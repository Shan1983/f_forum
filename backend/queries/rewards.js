const db = require("../db");

module.exports = {
  async loadInitialRewards() {
    return db("rewards").where("id", 1);
  },

  async updateRewards(obj) {
    return db.raw(
      `UPDATE rewards SET reply = ?, topic = ?, like = ?, create_poll = ?, answer_poll = ? WHERE id = 1;`,
      [obj.r, obj.t, obj.l, obj.cp, obj.ap]
    );
  }
};
