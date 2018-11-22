const { generateId } = require("../../helpers/auth");

const roles = [
  { id: generateId(), title: "Member" },
  { id: generateId(), title: "Moderator" },
  { id: generateId(), title: "Admin" },
  { id: "d0abc273-ed64-11e8-aa98-e36e37c6bb49", title: "Owner" }
];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("roles")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("roles").insert(roles);
    });
};
