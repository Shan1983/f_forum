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

exports.updateOptionsSchema = Joi.object().keys({
  allowSubs: Joi.boolean(),
  advertising: Joi.boolean(),
  bio: Joi.string()
});

exports.registerSchema = Joi.object().keys({
  username: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required()
});

exports.categorySchema = Joi.object().keys({
  id: Joi.string(),
  title: Joi.string().required(),
  description: Joi.string(),
  icon_color: Joi.string(),
  slug: Joi.string()
});

exports.categoryUpdateSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string(),
  slug: Joi.string()
});

exports.topicCategorySchema = Joi.object().keys({
  title: Joi.string().required()
});

exports.topicUpdateSchema = Joi.object().keys({
  topic_color: Joi.string(),
  title: Joi.string().required(),
  slug: Joi.string().required(),
  discussion: Joi.string().required()
});
