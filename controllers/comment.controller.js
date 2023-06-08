const httpStatus = require("http-status");
const { commentService } = require("../services");
const { commentMessages } = require("../messages");
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/response");

const createComment = catchAsync(async (req, res) => {
  const comment = await commentService.createComment(
    req.params.postId,
    req.body,
    req.user
  );
  return response.successResponse(
    res,
    httpStatus.CREATED,
    { comment },
    commentMessages.success.COMMENT_CREATION_SUCCESS
  );
});

const getCommentsByPostId = catchAsync(async (req, res) => {
  const { user } = req;
  const comments = await commentService.getCommentsOnPosts(
    req.params.postId,
    {},
    user?._id || ""
  );
  return response.successResponse(
    res,
    httpStatus.OK,
    { comments },
    commentMessages.success.COMMENT_FETCH_SUCCESS
  );
});

const deleteMyComment = catchAsync(async (req, res) => {
  const comment = await commentService.deleteComment(req.params.id, req.user);
  return response.successResponse(
    res,
    httpStatus.OK,
    { comment },
    commentMessages.success.COMMENT_DELETION_SUCCESS
  );
});

const updateCommentById = catchAsync(async (req, res) => {
  const { user, body } = req;
  const { commentId } = req.params;
  const comment = await commentService.updateCommentById(commentId, body, {
    commentedBy: user._id,
  });
  return response.successResponse(
    res,
    httpStatus.OK,
    { comment },
    "Comment updated successfully!"
  );
});

module.exports = {
  createComment,
  getCommentsByPostId,
  deleteMyComment,
  updateCommentById,
};
