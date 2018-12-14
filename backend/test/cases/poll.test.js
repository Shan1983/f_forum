process.env.NODE_ENV = "test";

const server = require("../../server");
const db = require("../../db");

const { setupTestDb, DbCleanup } = require("../helpers/dbSetup");
const { getAgent, login } = require("../helpers/users");

describe("POLL ROUTES", () => {
  beforeEach(async () => {
    await setupTestDb(db);
  });

  afterEach(async () => {
    await DbCleanup(db);
  });

  describe("GET", () => {
    describe("Get a single poll - Auth", () => {
      it("should return a current poll", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const poll = await agent
          .get("/api/v1/poll/1")
          .set("content-type", "application/json")
          .set("Authorization", token);

        poll.should.have.status(200);
        poll.body.should.have.property("success");
      });
    });
    describe("Get all current polls - Auth | Staff");
    describe("Get a polls results - Auth");
  });
  describe("POST", () => {
    describe("Post a new poll - Auth");
    describe("Vote on a poll - Auth");
  });
  describe("PUT", () => {
    describe("Edit a poll - Auth");
  });
  describe("DELETE", () => {
    describe("Remove a poll - Auth | Staff");
  });
});
