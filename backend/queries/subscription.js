const Joi = require("joi");
const db = require("../db");

const { insertAndValidate } = require("./index");

const schema = Joi.object().keys({
  topic_id: Joi.number()
    .integer()
    .required(),
  user_id: Joi.number().integer(),
  mute: Joi.boolean()
});

module.exports = {
  async findById(id) {
    // const query = await db("subscriptions")
    //   .where("id", id)
    //   .where("deleted", false)

    // return query;

    return db.raw(
      `SELECT * FROM subscriptions WHERE user_id = ? AND deleted = false`,
      [id]
    );
  },

  async findUserSub(user, topic) {
    return db.raw(
      `SELECT * FROM subscriptions WHERE topic_id = ? AND user_id = ? AND deleted = false LIMIT 1`,
      [user, topic]
    );
  },

  async update(id, user) {
    const rows = await db("subscriptions")
      .where("id", id)
      .update(user, "*");
    return rows[0];
  },

  insert(user) {
    return insertAndValidate("subscriptions", user, schema);
  }
};
