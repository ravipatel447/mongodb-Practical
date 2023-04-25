const httpStatus = require("http-status");
const { postService } = require("../services");
const { postMessages } = require("../messages");
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/response");

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost(req.body, req.user);
  return response.successResponse(
    res,
    httpStatus.CREATED,
    { post },
    postMessages.success.POST_CREATION_SUCCESS
  );
});

const getPosts = catchAsync(async (req, res) => {
  const posts = await postService.getPosts();
  return response.successResponse(
    res,
    httpStatus.OK,
    { posts },
    postMessages.success.POSTS_FETCH_SUCCESS
  );
});

const getMyPosts = catchAsync(async (req, res) => {
  const myposts = await postService.getPosts({ posteBy: req.user._id });
  return response.successResponse(
    res,
    httpStatus.OK,
    { myposts },
    postMessages.success.POSTS_FETCH_SUCCESS
  );
});

const getPostsByUserId = catchAsync(async (req, res) => {
  const posts = await postService.getPosts({ posteBy: req.params.id });
  return response.successResponse(
    res,
    httpStatus.OK,
    { posts },
    postMessages.success.POSTS_FETCH_SUCCESS
  );
});

const getPostById = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  return response.successResponse(
    res,
    httpStatus.OK,
    { post },
    postMessages.success.POST_FETCH_SUCCESS
  );
});

const updateMyPost = catchAsync(async (req, res) => {
  const post = await postService.updatePost(req.params.id, req.user, req.body);
  return response.successResponse(
    res,
    httpStatus.OK,
    { post },
    postMessages.success.POST_UPDATION_SUCCESS
  );
});

const deleteMyPost = catchAsync(async (req, res) => {
  await postService.deletePost(req.params.id, req.user);
  return response.successResponse(
    res,
    httpStatus.OK,
    {},
    postMessages.success.POST_DELETION_SUCCESS
  );
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  getMyPosts,
  getPostsByUserId,
  updateMyPost,
  deleteMyPost,
};
