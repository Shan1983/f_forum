const moment = require("moment");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("poll_questions")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("poll_questions").insert([
        {
          topic_id: 1,
          question: "Do you like spiders",
          user_id: 1,
          active: true,
          duration: moment(Date.now()).add(7, "days")
        }
      ]);
    });
};
