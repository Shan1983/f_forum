process.env.NODE_ENV = "test";

const server = require("../../server");
const db = require("../../db");

const { setupTestDb, DbCleanup } = require("../helpers/dbSetup");
const { getAgent, login } = require("../helpers/users");

describe("TOPIC ROUTES", () => {
  beforeEach(async () => {
    await setupTestDb(db);
  });

  afterEach(async () => {
    await DbCleanup(db);
  });

  describe("GET", () => {
    describe("Gets all topics in a category - Paginated | Auth", () => {
      it("should return all topics in a category", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const allCategories = await agent
          .get("/api/v1/topic/1/all?page=1&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        allCategories.should.have.status(200);
        allCategories.body.should.have.property("category");
        allCategories.body.should.have.property("meta");
      });
      it("should return 404 if no topics are found", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const allCategories = await agent
          .get("/api/v1/topic/1/all?page=1000&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        allCategories.should.have.status(404);
        allCategories.body.should.have.property("message");
      });
      it("should return 401 if illegally accessed", async () => {
        const agent = getAgent(server);

        const allCategories = await agent
          .get("/api/v1/topic/1/all?page=1&limit=15")
          .set("content-type", "application/json");

        allCategories.should.have.status(401);
        allCategories.body.should.have.property("error");
      });
    });
    describe("Get a single topic - Auth", () => {
      it("should return a single topic", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .get("/api/v1/topic/1")
          .set("content-type", "application/json")
          .set("Authorization", token);

        topic.should.have.status(200);
        topic.body.should.have.property("topic");
      });
      it("should return 404 if no topic is found", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .get("/api/v1/topic/9999")
          .set("content-type", "application/json")
          .set("Authorization", token);

        topic.should.have.status(404);
        topic.body.should.have.property("message");
      });
      it("should return 401 if illegally accessed", async () => {
        const agent = getAgent(server);

        const allCategories = await agent
          .get("/api/v1/topic/1")
          .set("content-type", "application/json");

        allCategories.should.have.status(401);
        allCategories.body.should.have.property("error");
      });
    });
    describe("Gets all deleted topics - Paginated | Staff | Auth", () => {
      it("should return a list of deleted topics", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const token = `Bearer ${user.body.token}`;
        const deleted = await agent
          .get("/api/v1/topic/1/deleted?page=1&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        deleted.should.have.status(200);
        deleted.body.should.have.property("deletedTopics");
      });
      it("should return 404 if theyre no deleted topics", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .get("/api/v1/topic/9999/deleted?page=1&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        topic.should.have.status(404);
        topic.body.should.have.property("message");
      });
      it("should return 401 if illegally accessed", async () => {
        const agent = getAgent(server);

        const topic = await agent
          .get("/api/v1/topic/9999/deleted?page=1&limit=15")
          .set("content-type", "application/json");

        topic.should.have.status(401);
        topic.body.should.have.property("error");
      });
    });
  });
  describe("POST", () => {
    describe("Posts a new topic - Auth", () => {
      it(
        "should create a new topic, and increment the users post count and score"
      );
      it("should return 404 error if validation fails");
      it("should return 401 if illegally accessed");
    });
    describe("Locks a topic - Staff | Auth", () => {
      it("should lock a open topic");
      it("should unlock a closed topic");
      it("should return 401 if illegally accessed");
    });
    describe("Makes a topic sticky - Staff | Auth", () => {
      it("should make an open topic sticky");
      it("should remove an open topic sticky status");
      it("should return 401 if illegally accessed");
      // todo
      it("should remove an open topic sticky status via job");
    });
    describe("Moves a topic - Staff | Auth", () => {
      it("should move a topic to another category");
      it("should return 404 if no topic found");
      it("should return 400 if validation fails");
      it("should return 401 if illegally accessed");
    });
    describe("Change a topics color - Auth", () => {
      it("should change a topics color");
      it("should return 404 if no topic exists");
      it("should return 401 if not the topic owner");
      it("should allow an admin to change topic color");
      it("should return 401 if illegally accessed");
    });
  });
  describe("PUT", () => {
    describe("Edits a topic - Auth", () => {
      it("should edit a topic");
      it("should return 400 if validation fails");
      it("should return 404 if no topic is found");
      it("should return 401 if not the topic owner");
      it("should return 401 if illegally accessed");
    });
  });
  describe("DELETE", () => {
    describe("Deletes a topic - Staff | Auth", () => {
      it("should remove a topic");
      it("should return 404 if topic not found");
      it("should deduct reward points");
      it("should return 401 if illegally accessed");
    });
  });
});
