const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete } = require("./index");

const schema = Joi.object().keys({
  id: Joi.string().required(),
  topic_id: Joi.string().required(),
  user_id: Joi.string().required(),
  reply: Joi.string().required()
});

module.exports = {
  async findById(id) {
    const query = db("topic_replies")
      .where("id", id)
      .where("deleted", false)
      .first();

    return query;
  },

  async findByAllWithUser() {
    const query = db.raw(
      `SELECT *
      FROM topic_replies
      LEFT JOIN users ON users.id = topic_replies.user_id
      LEFT JOIN roles AS r ON r.id = users.role_id
      WHERE deleted = false`,
      []
    );

    return query;
  },

  async findDeletedReplies() {
    const replies = await db("topic_replies").where("deleted", true);
    return replies;
  },

  async update(id, topic_replies) {
    const rows = await db("topic_repliess")
      .where("id", id)
      .update(topic_replies, "*");
    return rows[0];
  },

  insert(topic_replies) {
    return insertAndValidate("topic_replies", topic_replies, schema);
  },

  async delete(id) {
    return softDelete("topic_replies", id);
  }
};
