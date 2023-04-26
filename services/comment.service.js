const httpStatus = require("http-status");
const { Comment, Post } = require("../models");
const ApiError = require("../utils/ApiError");
const { commentMessages } = require("../messages");

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
const getCommentsOnPosts = async (postId, filters = {}) => {
  return Post.findById(postId).populate({
    path: "comments",
    options: {
      limit: parseInt(100),
      skip: parseInt(0),
      sort: {
        _id: 1,
      },
    },
  });
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

module.exports = {
  createComment,
  getCommentsOnPosts,
  deleteComment,
};
