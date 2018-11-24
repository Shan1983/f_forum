const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete, paginator } = require("./index");

const schema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string(),
  icon_color: Joi.string(),
  slug: Joi.string()
});

module.exports = {
  async findAllCategories(options) {
    // const categories = await db("categories").where("deleted", false);

    const query = await db.raw(
      `SELECT *
      FROM categories
      WHERE deleted = false`,
      []
    );

    const count = await db.raw(
      `SELECT COUNT('id')
      FROM categories
      WHERE deleted = false`,
      []
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

  async findAllCategoryTopics(id) {
    const topics = await db("topics")
      .where("category_id", id)
      .where("deleted", false)
      .limit(5);
    return topics;

    // ** leave this till font end is completed **
    // const query = await db.raw(
    //   `SELECT *
    //   FROM topics
    //   WHERE category_id = ?
    //   AND
    //    deleted = false`,
    //   [id]
    // );

    // const count = await db.raw(
    //   `SELECT COUNT('id')
    //   FROM categories
    //   WHERE deleted = false`,
    //   []
    // );

    // const paginate = {
    //   req: options.req,
    //   count: count.rows[0].count,
    //   query: query.rows,
    //   page: options.page || 1,
    //   limit: options.limit || 15
    // };

    // return paginator(paginate);
  },

  async findById(id) {
    const query = await db("categories")
      .where("id", id)
      .where("deleted", false)
      .first();

    return query;
  },

  async update(id, category) {
    const rows = await db("categories")
      .where("id", id)
      .update(category, "*");
    return rows[0];
  },

  insert(category) {
    return insertAndValidate("categories", category, schema);
  },

  async delete(id) {
    return softDelete("categories", id);
  }
};
