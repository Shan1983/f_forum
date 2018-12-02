const faker = require("faker");
const randomColor = require("randomcolor");
const { generateHash } = require("../../helpers/auth");

let users = [];

for (let i = 1; i <= 16; i++) {
  users.push({
    color_icon: randomColor(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    hash: generateHash("test123"),
    role_id: 1
  });
}

users.push({
  color_icon: randomColor(),
  username: "Shan",
  email: "test@test.com",
  hash: generateHash("test123"),
  verified: true,
  role_id: 4
});

users.push({
  color_icon: randomColor(),
  username: "admin",
  email: "admin@test.com",
  hash: generateHash("test123"),
  role_id: 3,
  verified: true
});

users.push({
  color_icon: randomColor(),
  username: "moderator",
  email: "moderator@test.com",
  hash: generateHash("test123"),
  role_id: 2,
  verified: true
});

users.push({
  color_icon: randomColor(),
  username: "mr. Banned",
  email: "banned@test.com",
  hash: generateHash("test123"),
  role_id: 1,
  banned: true,
  verified: true
});

users.push({
  color_icon: randomColor(),
  username: "John Doe",
  email: "member@test.com",
  hash: generateHash("test123"),
  role_id: 1,
  banned: true,
  verified: true
});

users.push({
  color_icon: randomColor(),
  username: "Not Verified",
  email: "not.verified@test.com",
  hash: generateHash("test123"),
  role_id: 1,
  banned: true
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
