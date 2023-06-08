const httpStatus = require("http-status");
const { tokenMessages } = require("../messages");

const { tokenService } = require("../services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

module.exports = catchAsync(async (req, res, next) => {
  if (!req.user) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next();
    }

    const user = await tokenService.verifyToken(token);
    if (user._id) {
      req.user = user;
      req.token = token;
      next();
    } else {
      return next();
    }
  } else {
    next();
  }
});
