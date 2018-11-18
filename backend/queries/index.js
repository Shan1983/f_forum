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
