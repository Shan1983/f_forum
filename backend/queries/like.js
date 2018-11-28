const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete } = require("./index");

const schema = Joi.object().keys({
  topic_id: Joi.number().integer(),
  user_id: Joi.number().integer(),
  reply_id: Joi.number().integer()
});

module.exports = {
  // likes have their own models to keep them
  // seperate, and easy to manage.

  async likeATopic(topic, user) {
    return db.raw(`INSERT INTO likes (topic_id, user_id) VALUES (?,?)`, [
      topic,
      user
    ]);
  },

  async likeAReply(reply, user) {
    return db.raw(`INSERT INTO likes (reply_id, user_id) VALUES (?,?)`, [
      reply,
      user
    ]);
  },

  async removeLike(id) {
    return db
      .raw("likes")
      .where("id", id)
      .del();
  }
};
