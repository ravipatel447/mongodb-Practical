const { Joi } = require("express-validation");

const createValidation = {
  body: Joi.object().keys({
    comment: Joi.string().required(),
  }),
};

module.exports = {
  createValidation,
};
