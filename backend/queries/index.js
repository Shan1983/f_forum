const Joi = require("joi");
const db = require("../db");

exports.insertAndValidate = async (table, item, schema) => {
  const result = Joi.validate(item, schema);

  if ((await result.error) === null) {
    const rows = await db(table).insert(item, "*");
    return rows[0];
  } else {
    return Promise.reject(result.error);
  }
};

exports.softDelete = async (table, id) => {
  return db(table)
    .where("id", id)
    .update({
      deleted: true,
      deleted_at: new Date()
    });
};
