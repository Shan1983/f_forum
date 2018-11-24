const faker = require("faker");
const randomColor = require("randomcolor");

let replies = [];

for (let i = 0; i <= 100; i++) {
  replies.push({
    id: i,
    topic_id: Math.floor(Math.random() * 20) || 1,
    user_id: Math.floor(Math.random() * 16),
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
