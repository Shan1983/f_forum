exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("rewards")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("rewards").insert([
        { id: 1, reply: 20 },
        { id: 2, topic: 50 },
        { id: 3, like: 10 },
        { id: 4, create_poll: 50 },
        { id: 5, answer_poll: 50 }
      ]);
    });
};
