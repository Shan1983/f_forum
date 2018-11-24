const faker = require("faker");
const randomColor = require("randomcolor");

let topics = [];

for (let i = 0; i <= 20; i++) {
  let word = faker.lorem.word();
  topics.push({
    id: i,
    topic_color: randomColor(),
    category_id: Math.floor(Math.random() * 3) || 3,
    title: word,
    slug: word,
    user_id: Math.floor(Math.random() * 16),
    discussion: faker.lorem.sentences(5)
  });
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("topics")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("topics").insert(topics);
    });
};
