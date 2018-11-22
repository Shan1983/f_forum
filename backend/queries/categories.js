const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete } = require("./index");

const schema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string(),
  icon_color: Joi.string(),
  slug: Joi.string()
});

module.exports = {
  async findAllCategories() {
    const categories = await db("categories").where("deleted", false);
    return categories;
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
