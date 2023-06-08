const httpStatus = require("http-status");
const { Post } = require("../models");
const ApiError = require("../utils/ApiError");
const { postMessages } = require("../messages");
const { $where } = require("../models/user.model");

/**
 * Creates a new post.
 * @async
 * @param {Object} body - The post body.
 * @param {Object} user - The user creating the post.
 * @returns {Promise<Object>}
 */
const createPost = async (body, user) => {
  const post = new Post(body);
  post.postedBy = user._id;
  return post.save();
};

/**
 * Gets all posts that match the given filters.
 * @async
 * @param {Object} [filters={}] - The filters to apply to the query.
 * @returns {Promise<Array>}
 */
const getPosts = async (filters = {}, user = "") => {
  return Post.aggregate([
    {
      $match: filters,
    },
    {
      $addFields: {
        self: { $eq: ["$postedBy", user] },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },
    {
      $set: {
        comments: { $size: "$comments" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedBy",
        pipeline: [
          {
            $project: {
              _id: 0,
              firstName: "$firstName",
              lastName: "$lastName",
            },
          },
        ],
      },
    },
    {
      $set: {
        postedBy: { $arrayElemAt: ["$postedBy", 0] },
      },
    },
  ]);
};

/**
 * Gets all posts that match the given filters.
 * @async
 * @param {Object} [filters={}] - The filters to apply to the query.
 * @returns {Promise<Array>}
 */
const getAggregatedPosts = async (
  skip = 0,
  limit = 100,
  sorting = 1,
  sortBy = "_id"
) => {
  const sort = {};
  sort[sortBy] = sorting;
  const posts = await Post.aggregate([
    {
      $lookup: {
        from: "users",
        as: "postedBy",
        let: { postedBy: "$postedBy" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$postedBy", "$_id"] },
            },
          },
          {
            $project: {
              Name: {
                $concat: ["$firstName", " ", "$lastName"],
              },
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "comments",
        as: "comments",
        let: { pId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$pId", "$postId"] },
            },
          },
          {
            $project: {
              comment: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $sort: sort,
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $project: {
        title: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        postedBy: {
          $first: "$postedBy.Name",
        },
        comments: 1,
      },
    },
  ]);
  return posts;
};

const totalPostEachUser = async () => {
  const data = await Post.aggregate([
    {
      $group: { _id: "$postedBy", totalPosts: { $sum: 1 } },
    },
    {
      $lookup: {
        from: "users",
        as: "postedBy",
        let: { postedBy: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$postedBy", "$_id"] },
            },
          },
          {
            $project: {
              Name: {
                $concat: ["$firstName", " ", "$lastName"],
              },
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        totalPosts: 1,
        User: {
          $first: "$postedBy.Name",
        },
      },
    },
  ]);
  return data;
};

/**
 * Gets a single post by ID that matches the given filters.
 * @async
 * @param {string} id - The ID of the post to retrieve.
 * @param {Object} [filters={}] - The filters to apply to the query.
 * @returns {Promise<Object>}
 */
const getPostById = async (id, filters = {}, populate = "") => {
  return Post.findOne({ _id: id, ...filters }).populate(populate);
};

/**
 * Gets a single post that matches the given filters.
 * @async
 * @param {Object} [filters={}] - The filters to apply to the query.
 * @returns {Promise<Object>}
 */
const getPostByFilter = async (filters = {}) => {
  return Post.findOne(filters);
};

/**
 * Updates a post.
 * @async
 * @param {string} id - The ID of the post to update.
 * @param {Object} user - The user updating the post.
 * @param {Object} body - The post body.
 * @returns {Promise<Object>}
 * @throws {ApiError} If the post is not found or the user is not authorized to update it.
 */
const updatePost = async (id, user, body) => {
  const updates = Object.keys(body);
  const post = await Post.findOne({ _id: id, postedBy: user._id });
  if (!post) {
    throw new ApiError(
      postMessages.error.POST_NOT_FOUND,
      httpStatus.BAD_REQUEST
    );
  }
  updates.forEach((update) => {
    post[update] = body[update];
  });
  return post.save();
};

/**
 * Deletes a post.
 * @async
 * @param {string} id - The ID of the post to delete.
 * @param {Object} user - The user deleting the post.
 * @returns {Promise<Object>}
 * @throws {ApiError} If the post is not found or the user is not authorized to delete it.
 */
const deletePost = async (id, user) => {
  const post = await Post.findOneAndDelete({ _id: id, postedBy: user._id });
  if (!post) {
    throw new ApiError(
      postMessages.error.POST_NOT_FOUND,
      httpStatus.BAD_REQUEST
    );
  }
  return post;
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  getPostByFilter,
  getAggregatedPosts,
  totalPostEachUser,
  updatePost,
  deletePost,
};
