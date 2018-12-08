const faker = require("faker");
const randomColor = require("randomcolor");
const moment = require("moment");

let topics = [];

for (let i = 1; i <= 50; i++) {
  let word = faker.lorem.word();
  let topic_builder = {
    topic_color: randomColor(),
    category_id: Math.floor(Math.random() * 3) || 2,
    title: word,
    slug: word,
    user_id: Math.floor(Math.random() * 22) || 17,
    discussion: faker.lorem.sentences(5)
  };
  // * every ten topics will be closed
  if (i % 10 == 0) {
    topic_builder.lock = "closed";
    topic_builder.lock_reason = faker.lorem.sentence();
  }

  // * every 20th topic will be a sticky topic
  if (i % 20 == 0) {
    topic_builder.sticky = true;
    topic_builder.sticky_ends = moment(Date.now()).add(5, "days");
  }

  // * every 13th post will be deleted
  if (i % 13 == 0) {
    topic_builder.deleted = true;
    topic_builder.deleted_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  }

  topics.push(topic_builder);
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
