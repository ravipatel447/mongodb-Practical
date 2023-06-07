const httpStatus = require("http-status");
const { postService } = require("../services");
const { postMessages } = require("../messages");
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/response");
const _ = require("lodash");

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
  // const page = parseInt(_.get(req.query, "page", 1));
  // const limit = parseInt(_.get(req.query, "limit", 10));
  // const sortingOrder = _.get(req.query, "sort", "ASC");
  // const sortBy = _.get(req.query, "sortBy", "_id");

  const posts = await postService.getPosts({}, "comments postedBy");

  return response.successResponse(
    res,
    httpStatus.OK,
    { posts },
    postMessages.success.POSTS_FETCH_SUCCESS
  );
});

const searchPosts = catchAsync(async (req, res) => {
  const posts = await postService.getPosts({
    title: { $regex: req.query.text, $options: "i" },
  });
  return response.successResponse(
    res,
    httpStatus.OK,
    { posts },
    postMessages.success.POSTS_FETCH_SUCCESS
  );
});

const getMyPosts = catchAsync(async (req, res) => {
  const myposts = await req.user.populate({
    path: "posts",
    options: {
      limit: parseInt(100),
      skip: parseInt(0),
    },
  });
  return response.successResponse(
    res,
    httpStatus.OK,
    { myposts },
    postMessages.success.POSTS_FETCH_SUCCESS
  );
});

const getPostsByUserId = catchAsync(async (req, res) => {
  const posts = await postService.getPosts({ postedBy: req.params.id });
  return response.successResponse(
    res,
    httpStatus.OK,
    { posts },
    postMessages.success.POSTS_FETCH_SUCCESS
  );
});

const getTotalpostsByEachUser = catchAsync(async (req, res) => {
  const posts = await postService.totalPostEachUser();
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
  searchPosts,
  getPostById,
  getMyPosts,
  getTotalpostsByEachUser,
  getPostsByUserId,
  updateMyPost,
  deleteMyPost,
};
