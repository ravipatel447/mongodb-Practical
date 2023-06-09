const httpStatus = require("http-status");
const { Comment, Post } = require("../models");
const ApiError = require("../utils/ApiError");
const { commentMessages } = require("../messages");
const { default: mongoose } = require("mongoose");

/**
 * Creates a new comment on a post
 *
 * @function
 * @async
 * @param {string} postId - The ID of the post to add the comment to
 * @param {string} body - The content of the comment
 * @param {object} user - The user object that made the comment
 * @returns {Promise<Comment>} - The newly created comment object
 */
const createComment = async (postId, body, user) => {
  const comment = new Comment(body);
  comment.commentedBy = user._id;
  comment.postId = postId;
  return comment.save();
};

/**
 * Retrieves comments on posts based on filters
 *
 * @function
 * @async
 * @param {string} postId - The ID of the post to find the comment to
 * @param {object} filters - The filters to apply on the comments
 * @returns {Promise<Comment[]>} - An array of comment objects matching the filters
 */
const getCommentsOnPosts = async (postId, filters = {}, user) => {
  // return Comment.find({ postId: postId }).populate({
  //   path: "commentedBy",
  //   select: "firstName lastName",
  // });
  return Comment.aggregate([
    {
      $match: {
        postId: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $addFields: {
        self: { $eq: ["$commentedBy", user] },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "commentedBy",
        foreignField: "_id",
        as: "commentedBy",
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
        commentedBy: { $arrayElemAt: ["$commentedBy", 0] },
      },
    },
  ]);
};

/**
 * Deletes a comment belonging to a user
 *
 * @function
 * @async
 * @param {string} id - The ID of the comment to delete
 * @param {object} user - The user object that made the comment
 * @returns {Promise<Comment>} - The deleted comment object
 * @throws {ApiError} - If the comment is not found
 */
const deleteComment = async (id, user) => {
  const comment = await Comment.findOneAndDelete({
    _id: id,
    commentedBy: user._id,
  });

  if (!comment) {
    throw new ApiError(
      commentMessages.error.COMMENT_NOT_FOUND,
      httpStatus.BAD_REQUEST
    );
  }
  return comment;
};

const updateCommentById = async (id, body = {}, filters = {}) => {
  let comment = await Comment.findOne({ _id: id, ...filters });
  if (!comment) {
    throw new ApiError(
      "no comment found with this id!",
      httpStatus.BAD_REQUEST
    );
  }
  Object.assign(comment, { ...body });
  comment = await comment.save();
  return comment;
};

module.exports = {
  createComment,
  getCommentsOnPosts,
  deleteComment,
  updateCommentById,
};
