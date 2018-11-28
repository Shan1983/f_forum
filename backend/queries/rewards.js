const db = require("../db");

module.exports = {
  async updateRewards(obj) {
    return db.raw(
      `UPDATE rewards SET reply = ?, topic = ?, like = ?, create_poll = ?, answer_poll = ? WHERE id = 1;`
    );
  }
};
