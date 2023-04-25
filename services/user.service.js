const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const { userMessages } = require("../messages");

/**
 * create User from body
 * @param {Object} body
 * @returns {Promise<User>}
 */
const createUser = async (body) => {
  const user = new User(body);
  return user.save();
};

/**
 * get users list
 * @param {Object} filters
 * @returns {Array<Promise<User>>}
 */
const getUsers = async (filters = {}) => {
  return User.find(filters);
};

/**
 * get user by filter object
 * @param {Object} filters
 * @returns {Promise<User>}
 */
const getUserByFilter = async (filters = {}) => {
  return User.findOne(filters);
};

/**
 * Get user by their id
 * @param {String} id user Id
 * @param {Object} filters
 * @returns {Promise<User>}
 */
const getUserById = async (id, filters) => {
  return getUserByFilter({ _id: id, ...filters });
};

/**
 * Update user by their id and what ever body provided
 * @param {String} id User id
 * @param {Object} body
 * @param {Object} filters
 * @returns {Promise<User>}
 */
const updateUserById = async (id, body, filters = {}) => {
  const user = await User.findOneAndUpdate({ _id: id, ...filters }, body, {
    runValidators: true,
    new: true,
  });
  if (!user) {
    throw new ApiError(
      userMessages.error.USER_NOT_FOUND,
      httpStatus.BAD_REQUEST
    );
  }
  return user;
};

/**
 * @param {Object} user user Object
 * @param {Object} body updates
 * @returns {Promise<User>}
 */
const updateUserProfile = async (user, body) => {
  const updates = Object.keys(body);
  updates.forEach((update) => {
    user[update] = body[update];
  });
  return user.save();
};

/**
 * Delete user by Their Id
 * @param {String} id user Id
 * @param {Object} filters
 * @returns {Promise<User>}
 */
const deleteUserById = async (id, filters = {}) => {
  const user = await User.findOneAndRemove({ _id: id, ...filters });
  if (!user) {
    throw new ApiError(
      userMessages.error.USER_NOT_FOUND,
      httpStatus.BAD_REQUEST
    );
  }
  return user;
};

module.exports = {
  createUser,
  getUsers,
  getUserByFilter,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserProfile,
};
