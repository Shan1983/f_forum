const faker = require("faker");
const { generateHash } = require("../../helpers/auth");

exports.login = request => {
  // log in a user
};

exports.register = async agent => {
  // register a user
  const user = await agent
    .post("/api/v1/user/register")
    .set("content-type", "application/json")
    .send({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: generateHash("test123")
    });
  return user;
};

exports.badRegistration = async (agent, data) => {
  // register a user
  const user = await agent
    .post("/api/v1/user/register")
    .set("content-type", "application/json")
    .send(data);
  return user;
};
