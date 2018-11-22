const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete } = require("./index");

const schema = Joi.object().keys({
  id: Joi.string().required(),
  topic_color: Joi.string(),
  category_id: Joi.string().required(),
  title: Joi.string().required(),
  slug: Joi.string().required(),
  user_id: Joi.string().required(),
  discussion: Joi.string().required(),
  sticky: Joi.boolean(),
  lock: Joi.string(),
  deleted: Joi.boolean()
});

module.exports = {
  async findAllTopics(category) {
    const query = db.raw(
      `SELECT *
      FROM topics
      WHERE category_id = ?
      AND
      deleted = false
      ORDER BY created_at DESC`,
      [category]
    );

    return query;
  },

  async findById(id) {
    const query = db("topics")
      .where("id", id)
      .where("deleted", false)
      .first();

    return query;
  },

  async findByIdWithUser(id) {
    const query = db.raw(
      `SELECT *, topics.title AS topic_title
      FROM topics
      LEFT JOIN users ON users.id = topics.user_id
      LEFT JOIN roles AS r ON r.id = users.role_id
      WHERE topics.id = ?`,
      [id]
    );

    return query;
  },

  async getCategoryId(category) {
    const query = db("categories")
      .where("title", category)
      .where("deleted", false)
      .first();
  },

  async findDeletedTopics() {
    const topics = await db("topics").where("deleted", true);
    return topics;
  },

  async update(id, topic) {
    const rows = await db("topics")
      .where("id", id)
      .update(topic, "*");
    return rows[0];
  },

  insert(topic) {
    return insertAndValidate("topics", topic, schema);
  },

  async delete(id) {
    return softDelete("topics", id);
  }
};
