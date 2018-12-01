const faker = require("faker");
const { generateHash } = require("../../helpers/auth");

exports.login = async (agent, data, type = null) => {
  // log in a user
  let user;
  switch (type) {
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
