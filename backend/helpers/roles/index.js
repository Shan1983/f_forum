// return the id's of all roles in the system
const db = require("../../db");

exports.getRoleId = async role => {
  const query = await db("roles").where("title", role);
  return query[0].id;
};
