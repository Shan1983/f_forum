const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete, paginator } = require("./index");

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
  async findAllTopicsPaginated(id, options) {
    const query = await db.raw(
      `SELECT *
      FROM topics
      WHERE category_id = ?
      AND
      deleted = false
      ORDER BY created_at DESC`,
      [id]
    );

    const count = await db.raw(
      `SELECT COUNT('id')
      FROM topics
      WHERE category_id = ?
      AND
      deleted = false`,
      [id]
    );

    // const count = await db(options.table)
    //   .where(options.delimiters, options.value)
    //   .where("deleted", options.deleted)
    //   .count("id");

    // const query = await db(options.table)
    //   .where(options.delimiters, options.value)
    //   .where("deleted", options.deleted);

    const paginate = {
      req: options.req,
      count: count.rows[0].count,
      query: query.rows,
      page: options.page || 1,
      limit: options.limit || 15
    };
    return paginator(paginate);
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

    return query;
  },

  async findDeletedTopicsPaginated(id, options) {
    const query = await db.raw(
      `SELECT *
      FROM topics
      WHERE category_id = ?
      AND
      deleted = true
      ORDER BY created_at DESC`,
      [id]
    );

    const count = await db.raw(
      `SELECT COUNT('id')
      FROM topics
      WHERE category_id = ?
      AND
      deleted = true`,
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
  },

  paginate(data, perPage) {
    const pager = new Paginate(data);

    return pager;
  }
};
