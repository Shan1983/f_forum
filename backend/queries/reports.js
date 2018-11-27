const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete } = require("./index");

const schema = Joi.object().keys({
  topic_reply_id: Joi.number()
    .integer()
    .required(),
  comment: Joi.string(),
  reason: Joi.string().required(),
  user_id: Joi.number()
    .integer()
    .required(),
  deleted: Joi.boolean()
});

module.exports = {
  async findAllReports() {
    return db.raw(`SELECT * FROM reports WHERE deleted = false`);
  },

  async getTopic(id) {
    const query = db.raw(
      `SELECT *
    FROM reports 
    LEFT JOIN topics ON topics.id = reports.topic_reply_id
    WHERE topic_reply_id = ?
    AND
    deleted = false`,
      [id]
    );

    return query;
  },

  insert(report) {
    return insertAndValidate("reports", report, schema);
  },

  async delete(id) {
    return softDelete("reports", id);
  }
};
