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
        poll.body.should.have.property("poll_id");
        poll.body.should.have.property("poll_question");
        poll.body.should.have.property("poll_answers");
      });
      it("should return 404 if no poll found", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const poll = await agent
          .get("/api/v1/poll/9999")
          .set("content-type", "application/json")
          .set("Authorization", token);

        poll.should.have.status(404);
        poll.body.should.have.property("message");
      });
      it("should return 401 if not authorized", async () => {
        const agent = getAgent(server);

        const poll = await agent
          .get("/api/v1/poll/9999")
          .set("content-type", "application/json");

        poll.should.have.status(401);
        poll.body.should.have.property("error");
      });
    });
    describe("Get all current polls - Auth | Staff", () => {
      it("should return all active polls", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const poll = await agent
          .get("/api/v1/poll?page=1&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        poll.should.have.status(200);
        poll.body.poll.should.have.property("poll_id");
        poll.body.poll.should.have.property("poll_question");
        poll.body.should.have.property("meta");
      });
      it("should return 404 if no polls found", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const poll = await agent
          .get("/api/v1/poll?page=99&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        poll.should.have.status(404);
        poll.body.should.have.property("message");
      });
      it("should return 401 if not authorized", async () => {
        const agent = getAgent(server);

        const poll = await agent
          .get("/api/v1/poll?page=99&limit=15")
          .set("content-type", "application/json");

        poll.should.have.status(401);
        poll.body.should.have.property("error");
      });
    });
    describe("Get a polls results - Auth", () => {
      it("should return the poll with a winning answer", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const poll = await agent
          .get("/api/v1/poll/1/results")
          .set("content-type", "application/json")
          .set("Authorization", token);

        poll.should.have.status(200);
        poll.body.should.have.property("poll");
        poll.body.poll.should.have.property("poll_question");
        poll.body.poll.should.have.property("winning_answer");
      });
      it("should return 404 if poll is not found", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const poll = await agent
          .get("/api/v1/poll/9999/results")
          .set("content-type", "application/json")
          .set("Authorization", token);

        poll.should.have.status(404);
        poll.body.should.have.property("message");
      });
    });
  });
  describe("POST", () => {
    describe("Post a new poll - Auth", () => {});
    describe("Vote on a poll - Auth", () => {});
  });
  describe("PUT", () => {
    describe("Edit a poll - Auth", () => {});
  });
  describe("DELETE", () => {
    describe("Remove a poll - Auth | Staff", () => {});
  });
});
