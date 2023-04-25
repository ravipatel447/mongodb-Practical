const { Joi } = require("express-validation");

const updateValidation = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    password: Joi.string(),
  }),
};

module.exports = {
  updateValidation,
};
