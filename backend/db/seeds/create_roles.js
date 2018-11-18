const { generateId } = require("../../helpers/auth");

const roles = [
  { id: generateId(), title: "Member" },
  { id: generateId(), title: "Moderator" },
  { id: generateId(), title: "Admin" }
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
