const faker = require("faker");
const randomColor = require("randomcolor");

let replies = [];

for (let i = 1; i <= 101; i++) {
  replies.push({
    topic_id: Math.floor(Math.random() * 21) || 1,
    user_id: Math.floor(Math.random() * 17) || 19,
    reply: faker.lorem.sentences(7)
  });
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("topic_replies")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("topic_replies").insert(replies);
    });
};
