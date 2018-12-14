exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("poll_answers")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("poll_answers").insert([
        {
          poll_question_id: 1,
          response: "Yes"
        },
        {
          poll_question_id: 1,
          response: "No"
        },
        {
          poll_question_id: 1,
          response: "Maybe?"
        }
      ]);
    });
};
