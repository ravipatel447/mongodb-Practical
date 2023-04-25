const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("../models/index");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const { tokenMessages } = require("../messages");

/**
 * Generate jwt signed token for user
 * @param {Object<User>} user
 * @returns {String}
 */
const generateUserToken = async (user) => {
  const token = await jwt.sign({ user: user._id }, config.jwt.secret, {
    expiresIn: config.jwt.expires,
  });
  user.tokens.push({ token });
  await user.save();
  return token;
};

/**
 * Verify user and return user if valid jwt token
 * @param {String} token jwt token string
 * @returns {Object<User>}
 */
const verifyToken = async (token) => {
  let { user } = jwt.verify(token, config.jwt.secret);
  user = await User.findOne({
    _id: user,
    "tokens.token": token,
  });
  if (!user) {
    throw new ApiError(
      tokenMessages.error.INVALID_TOKEN,
      httpStatus.BAD_REQUEST
    );
  }
  return user;
};

module.exports = {
  generateUserToken,
  verifyToken,
};
