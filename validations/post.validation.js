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

module.exports = {
  createValidation,
  updateValidation,
};
