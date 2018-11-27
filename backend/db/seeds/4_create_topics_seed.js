const faker = require("faker");
const randomColor = require("randomcolor");

let topics = [];

for (let i = 1; i <= 21; i++) {
  let word = faker.lorem.word();
  topics.push({
    id: i,
    topic_color: randomColor(),
    category_id: Math.floor(Math.random() * 3) || 1,
    title: word,
    slug: word,
    user_id: Math.floor(Math.random() * 17),
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
