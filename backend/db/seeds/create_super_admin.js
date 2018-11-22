const { generateId, generateHash } = require("../../helpers/auth");

const insertUser = [
  {
    id: generateId(),
    username: "pirate pete",
    email: "test@test.com",
    hash: generateHash("test"),
    role_id: "d0abc273-ed64-11e8-aa98-e36e37c6bb49",
    verified: true
  }
];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert(insertUser);
    });
};
