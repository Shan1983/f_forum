const Joi = require("joi");
const db = require("../db");

const { insertAndValidate, softDelete } = require("./index");

const schema = Joi.object().keys({
  pending_request: Joi.number().integer(),
  user_id: Joi.number().integer(),
  accepting_friend: Joi.number().integer()
});

module.exports = {
  async findById(id) {
    const query = db.raw(
      `SELECT * FROM friends WHERE sender_id = ? AND deleted = false`,
      [id]
    );
    return query;
  },

  async pendingFriendship(sender) {
    const query = db.raw(`SELECT * FROM friends WHERE sender_id = ?`, [sender]);

    return query;
  },

  async checkPendingRequests(sender, reciever) {
    const query = db.raw(
      `SELECT * FROM friends WHERE sender_id = ? AND reciever_id = ? AND deleted = false AND pending = true`,
      [sender, reciever]
    );

    return query;
  },

  async sendFriendRequest(friend) {
    const query = db.raw(
      `
      INSERT INTO friends (sender, sender_id, reciever, reciever_id, pending) VALUES (?,?,?,?, true)
      `,
      [friend.sender, friend.sender_id, friend.reciever, friend.reciever_id]
    );

    return query;
  },

  async acceptNewFriend(id) {
    const query = db.raw(
      `
      UPDATE friends SET accepted = true WHERE reciever_id = ?
      `,
      [id]
    );

    return query;
  },

  async findDeletedFriends() {
    const query = await db("friends").where("deleted", true);
    return query;
  },

  async delete(id) {
    return softDelete("friends", id);
  }
};
