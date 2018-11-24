exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("roles")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("roles").insert([
        { id: 1, title: "Member" },
        { id: 2, title: "Moderator" },
        { id: 3, title: "Admin" },
        { id: 4, title: "Owner" }
      ]);
    });
};
