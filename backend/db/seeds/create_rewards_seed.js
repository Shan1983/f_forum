exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("rewards")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("rewards").insert([
        {
          reply: 20,
          topic: 50,
          like: 10,
          create_poll: 50,
          answer_poll: 50
        }
      ]);
    });
};
