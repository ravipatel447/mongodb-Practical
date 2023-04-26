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
  const comments = await commentService.getCommentsOnPosts(req.params.postId);
  return response.successResponse(
    res,
    httpStatus.OK,
    { comments },
    commentMessages.success.COMMENT_FETCH_SUCCESS
  );
});

const deleteMyComment = catchAsync(async (req, res) => {
  await commentService.deleteComment(req.params.id, req.user);
  return response.successResponse(
    res,
    httpStatus.OK,
    {},
    commentMessages.success.COMMENT_DELETION_SUCCESS
  );
});

module.exports = {
  createComment,
  getCommentsByPostId,
  deleteMyComment,
};
