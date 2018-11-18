const Joi = require("joi");
const db = require("../db");

const { insertAndValidate } = require("./index");

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
  findAllAdmins() {
    return db("users").where("role_id", "12345");
  },

  findByEmail(email) {
    return db("users")
      .where("email", email)
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
