const chai = require("chai");
const should = chai.should();
const expect = chai.expect;

chai.use(require("chai-http"));
chai.use(require("chai-things"));

const faker = require("faker");
const { generateHash } = require("../../helpers/auth");

exports.getAgent = server => {
  return (agent = chai.request.agent(server));
};
exports.login = async (agent, data = {}, type = null) => {
  // log in a user
  let user;
  switch (type) {
    case "Member":
      user = await agent
        .post("/api/v1/user/login")
        .set("content-type", "application/json")
        .send({ email: "member@test.com", password: "test123" });
      break;
    case "Mod":
      user = await agent
        .post("/api/v1/user/login")
        .set("content-type", "application/json")
        .send({
          email: "moderator@test.com",
          password: "test123"
        });
      break;
    case "Admin":
      user = await agent
        .post("/api/v1/user/login")
        .set("content-type", "application/json")
        .send({
          email: "admin@test.com",
          password: "test123"
        });
      break;
    case "Owner":
      user = await agent
        .post("/api/v1/user/login")
        .set("content-type", "application/json")
        .send({
          email: "test@test.com",
          password: "test123"
        });
      break;
    default:
      user = await agent
        .post("/api/v1/user/login")
        .set("content-type", "application/json")
        .send({
          email: data.email,
          password: data.password
        });
      break;
  }

  return user;
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
