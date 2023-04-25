const httpStatus = require("http-status");
const { userService } = require("../services");
const { userMessages } = require("../messages");
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/response");

const getUserProfile = catchAsync(async (req, res) => {
  return response.successResponse(
    res,
    httpStatus.OK,
    { user: req.user },
    userMessages.success.USER_PROFILE_FETCH_SUCCESS
  );
});

const updateUserProfile = catchAsync(async (req, res) => {
  const user = await userService.updateUserProfile(req.user, req.body);
  return response.successResponse(
    res,
    httpStatus.OK,
    { user },
    userMessages.success.USER_UPDATION_SUCCESS
  );
});

const deleteUserProfile = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.user._id);
  return response.successResponse(
    res,
    httpStatus.OK,
    {},
    userMessages.success.USER_PROFILE_DELETE_SUCCESS
  );
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
