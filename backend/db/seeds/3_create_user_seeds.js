const faker = require("faker");
const randomColor = require("randomcolor");
const { generateHash } = require("../../helpers/auth");

let users = [];

for (let i = 1; i <= 16; i++) {
  users.push({
    id: i,
    color_icon: randomColor(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    hash: generateHash("test123"),
    role_id: 1
  });
}

users.push({
  id: 17,
  color_icon: randomColor(),
  username: "Shan",
  email: "test@test.com",
  hash: generateHash("test123"),
  role_id: 4
});
users.push({
  id: 18,
  color_icon: randomColor(),
  username: "admin",
  email: "admin@test.com",
  hash: generateHash("test123"),
  role_id: 3
});
users.push({
  id: 19,
  color_icon: randomColor(),
  username: "moderator",
  email: "moderator@test.com",
  hash: generateHash("test123"),
  role_id: 2
});

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert(users);
    });
};
