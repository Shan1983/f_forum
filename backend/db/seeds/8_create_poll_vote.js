exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("poll_votes")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("poll_votes").insert([
        {
          user_id: 1,
          poll_question_id: 1,
          poll_response_id: 1
        }
      ]);
    });
};
