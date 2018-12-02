const faker = require("faker");
const randomColor = require("randomcolor");

let topics = [];

for (let i = 1; i <= 50; i++) {
  let word = faker.lorem.word();
  topics.push({
    topic_color: randomColor(),
    category_id: Math.floor(Math.random() * 3) || 2,
    title: word,
    slug: word,
    user_id: Math.floor(Math.random() * 22) || 17,
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
