const Joi = require("joi");
const db = require("../db");

const { insertAndValidate } = require("./index");
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
  color_icon: Joi.string()
});

module.exports = {
  async findAllAdmins() {
    const admins = await db("users")
      .where("role_id", await getRoleId("Admin"))
      .where("role_id", await getRoleId("Moderator"));

    if (admins.length <= 0) {
      return [{ status: 200, message: "No Admin Users." }];
    } else {
      return admins;
    }
  },

  async findAllUsers() {
    const query = await db("users");
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
    const query = await db("users").where("email", email);
    return query[0];
  },

  findById(id) {
    return db("users")
      .where("id", id)
      .pluck("id")
      .first();
  },

  async update(id, user) {
    const rows = await db("users")
      .where("id", id)
      .update(user, "*");
    return rows[0];
  },

  insert(user) {
    return insertAndValidate("users", user, schema);
  }
};
