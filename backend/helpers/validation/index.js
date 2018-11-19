const Joi = require("joi");

exports.updatePasswordSchema = Joi.object().keys({
  password: Joi.string().required(),
  confirmPassword: Joi.string().required()
});

exports.updateEmailSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
});

exports.registerSchema = Joi.object().keys({
  username: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required()
});
