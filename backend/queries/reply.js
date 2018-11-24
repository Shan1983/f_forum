const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete, paginator } = require("./index");

const schema = Joi.object().keys({
  topic_id: Joi.number().integer(),
  user_id: Joi.number().integer(),
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

  async findByAllWithUserAndPagination(id, options) {
    const count = await db.raw(
      `SELECT COUNT('id')
      FROM topic_replies
      WHERE topic_id = ?
      AND
      deleted = false`,
      [id]
    );

    const query = await db.raw(
      `SELECT *
      FROM topic_replies
      LEFT JOIN users ON users.id = topic_replies.user_id
      LEFT JOIN roles AS r ON r.id = users.role_id
      WHERE topic_id = ?
      AND
      topic_replies.deleted = false`,
      [id]
    );

    const paginate = {
      req: options.req,
      count: count.rows[0].count,
      query: query.rows,
      page: options.page || 1,
      limit: options.limit || 15
    };

    return paginator(paginate);
  },

  async findDeletedReplies() {
    const replies = await db("topic_replies").where("deleted", true);
    return replies;
  },

  async update(id, topic_replies) {
    const rows = await db("topic_replies")
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
