const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete } = require("./index");
const { getRoleId } = require("../helpers/roles");

const schema = Joi.object().keys({
  id: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  hash: Joi.string().required(),
  avatar: Joi.string(),
  role_id: Joi.string().guid({
    version: ["uuidv1"]
  }),
  color_icon: Joi.string(),
  token: Joi.string(),
  verified: Joi.boolean()
});

module.exports = {
  async findAllAdmins() {
    const admins = await db("users")
      .where("role_id", await getRoleId("Admin"))
      .where("role_id", await getRoleId("Moderator"))
      .where("deleted", false);

    if (admins.length <= 0) {
      return [{ status: 200, message: "No Admin Users." }];
    } else {
      return admins;
    }
  },

  async findAllUsers() {
    const query = await db("users").where("deleted", false);
    const user = query[0];

    const userObj = {
      color_icon: user.color_icon,
      username: user.username,
      email: user.email,
      avatar: user.avatar
    };

    return userObj;
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
  }
};
