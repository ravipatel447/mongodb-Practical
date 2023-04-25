const httpStatus = require("http-status");
const { Post } = require("../models");
const ApiError = require("../utils/ApiError");
const { postMessages } = require("../messages");

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
const getPosts = async (filters = {}) => {
  return Post.find(filters);
};

/**
 * Gets a single post by ID that matches the given filters.
 * @async
 * @param {string} id - The ID of the post to retrieve.
 * @param {Object} [filters={}] - The filters to apply to the query.
 * @returns {Promise<Object>}
 */
const getPostById = async (id, filters = {}) => {
  return Post.findOne({ _id: id, ...filters });
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
  const post = Post.findOne({ _id: id, postedBy: user._id });
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
  const post = Post.findOneAndDelete({ _id: id, postedBy: user._id });
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
  updatePost,
  deletePost,
};
