const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete } = require("./index");

const schema = Joi.object().keys({
  user_id: Joi.number()
    .integer()
    .required(),
  reason: Joi.string(),
  release_date: Joi.date().timestamp(),
  deleted: Joi.boolean()
});

module.exports = {
  async findAll() {
    return db.raw(`SELECT * FROM penaltyBoxes WHERE deleted = false`);
  },

  async findById(id) {
    return db.raw(
      `
      SELECT * 
      FROM penaltyBoxes
      WHERE id = ?
      AND 
      deleted = false`,
      [id]
    );
  },

  async update(id, penaltyBoxes) {
    const rows = await db("penaltyBoxes")
      .where("id", id)
      .update(penaltyBoxes, "*");
    return rows[0];
  },

  insert(report) {
    return insertAndValidate("reports", report, schema);
  },

  async delete(id) {
    return softDelete("reports", id);
  }
};
