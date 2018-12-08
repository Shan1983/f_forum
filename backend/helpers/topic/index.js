const db = require("../../db");

exports.getCategory = async id => {
  const query = await db.raw(`SELECT title FROM categories WHERE id = ?`, [id]);
  const titles = query.rows.map(t => {
    return t.title;
  });

  return titles;
};

exports.getUser = async id => {
  const query = await db.raw(
    `SELECT * FROM users WHERE id = ? AND deleted = false`,
    [id]
  );
  const user = query.rows[0];
  return user;
};
