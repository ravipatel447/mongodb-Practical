const { Joi } = require("express-validation");

const createValidation = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const updateValidation = {
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
  }),
};
const fetchValidation = {
  query: Joi.object().keys({
    page: Joi.string(),
    limit: Joi.string(),
    sort: Joi.string().valid("ASC", "DESC"),
    sortBy: Joi.string().valid("_id", "title", "description"),
  }),
};
const searchValidation = {
  query: Joi.object().keys({
    text: Joi.string(),
  }),
};

module.exports = {
  createValidation,
  updateValidation,
  fetchValidation,
  searchValidation,
};
