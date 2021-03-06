const Joi = require("joi");

exports.updatePasswordSchema = Joi.object().keys({
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  newPassword: Joi.string().required()
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
  password: Joi.string().required(),
  role_id: Joi.number().integer()
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
  slug: Joi.string(),
  discussion: Joi.string().required()
});

exports.replySchema = Joi.object().keys({
  reply: Joi.string().required()
});

exports.roleSchema = Joi.object().keys({
  role: Joi.string().required()
});

exports.topicSchema = Joi.object().keys({
  topic_color: Joi.string(),
  category_id: Joi.number().integer(),
  title: Joi.string().required(),
  slug: Joi.string(),
  user_id: Joi.number().integer(),
  discussion: Joi.string().required()
});
