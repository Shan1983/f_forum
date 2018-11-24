const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete, paginator } = require("./index");
const { getRoleId } = require("../helpers/roles");

const schema = Joi.object().keys({
  username: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  hash: Joi.string().required(),
  avatar: Joi.string(),
  color_icon: Joi.string(),
  token: Joi.string(),
  verified: Joi.boolean()
});

module.exports = {
  async findAllAdminsPaginated(options) {
    // const count = await db(options.table)
    //   .whereIn(options.delimiters, options.value)
    //   .where("deleted", options.deleted)
    //   .count();

    // const query = await db(options.table)
    //   .whereIn(options.delimiters, options.value)
    //   .where("deleted", options.deleted);

    const count = await db.raw(
      `SELECT COUNT('id')
      FROM users
      WHERE role_id IN (2,3,4)
      AND 
      deleted = false
      `,
      []
    );

    const query = await db.raw(
      `SELECT *
      FROM users
      WHERE role_id IN (2,3,4)
      AND
      deleted = false`,
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

  async findAllUsersPaginated(options) {
    // const count = await db(options.table)
    //   .where("deleted", options.deleted)
    //   .count("id");

    // const query = await db(options.table).where("deleted", options.deleted);

    const count = await db.raw(
      `SELECT COUNT('id')
      FROM users
      WHERE deleted = false`,
      []
    );

    const query = await db.raw(
      `SELECT *
      FROM users
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

  async findByEmail(email) {
    const query = await db("users")
      .where("email", email)
      .where("deleted", false);
    return query[0];
  },

  // use this only when absolutely needed
  // does not return closed accounts.
  async findByEmailIgnoreIfAccountClosed(email) {
    const query = await db("users").where("email", email);
    return query[0];
  },

  async getAvatar(id) {
    const query = await db("users")
      .where("id", id)
      .where("deleted", false)
      .pluck("avatar")
      .first();

    return query;
  },

  async verifyEmail(token) {
    const query = await db("users")
      .where("token", token)
      .where("deleted", false)
      .first();

    return query;
  },

  async findById(id) {
    const query = await db("users")
      .where("id", id)
      .where("deleted", false)
      .first();

    return query;
  },

  async update(id, user) {
    const rows = await db("users")
      .where("id", id)
      .update(user, "*");
    return rows[0];
  },

  insert(user) {
    return insertAndValidate("users", user, schema);
  },

  async closeAccount(id) {
    return softDelete("users", id);
  },

  async findByToken(col, token) {
    const query = db("users")
      .where(col, token)
      .where("deleted", false)
      .first();

    return query;
  },

  async addToPostCount(id) {
    const rows = await db("users")
      .where("id", id)
      .increment("post_count", 1);

    return rows;
  },

  async addToPoints(id, points) {
    const rows = await db("users")
      .where("id", id)
      .increment("points", points);

    return rows;
  },

  async removeFromPoints(id, points) {
    const rows = await db("users")
      .where("id", id)
      .decrement("points", points);

    return rows;
  }
};
