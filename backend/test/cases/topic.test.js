process.env.NODE_ENV = "test";

const server = require("../../server");
const db = require("../../db");

const { setupTestDb, DbCleanup } = require("../helpers/dbSetup");
const { getAgent, login } = require("../helpers/users");
const rewards = require("../../helpers/rewards");
const chai = require("chai");
const expect = chai.expect;

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
      it("should create a new topic, and increment the users post count and score", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .post("/api/v1/topic/1")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ title: "test", discussion: "test test test" });

        topic.should.have.status(200);
        topic.body.should.have.property("topic");
      });
      it("should return 404 error if validation fails", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .post("/api/v1/topic/1")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ title: "", discussion: "test test test" });

        topic.should.have.status(400);
        topic.body.should.have.property("error");
      });
      it("should return 401 if illegally accessed", async () => {
        const agent = getAgent(server);

        const topic = await agent
          .post("/api/v1/topic/1")
          .set("content-type", "application/json")

          .send({ title: "", discussion: "test test test" });

        topic.should.have.status(401);
        topic.body.should.have.property("error");
      });
    });
    describe("Locks a topic - Staff | Auth", () => {
      it("should lock a open topic", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .post("/api/v1/topic/1/lock")
          .set("content-type", "application/json")
          .set("Authorization", token);

        topic.should.have.status(200);
        topic.body.should.have.property("success");
      });
      it("should return 401 if illegally accessed", async () => {
        const agent = getAgent(server);

        const topic = await agent
          .post("/api/v1/topic/1/lock")
          .set("content-type", "application/json");

        topic.should.have.status(401);
        topic.body.should.have.property("error");
      });
    });
    describe("Makes a topic sticky - Staff | Auth", () => {
      it("should make an open topic sticky", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .post("/api/v1/topic/1/sticky")
          .set("content-type", "application/json")
          .set("Authorization", token);

        topic.should.have.status(200);
        topic.body.should.have.property("success");
      });
      it("should return 401 if illegally accessed", async () => {
        const agent = getAgent(server);

        const topic = await agent
          .post("/api/v1/topic/1/sticky")
          .set("content-type", "application/json");

        topic.should.have.status(401);
        topic.body.should.have.property("error");
      });
      // todo
      it("should remove an open topic sticky status via job");
    });
    describe("Moves a topic - Staff | Auth", () => {
      it("should move a topic to another category", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .post("/api/v1/topic/1/move")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ title: "spiders" });

        topic.should.have.status(200);
        topic.body.should.have.property("success");
      });
      it("should return 404 if no topic found", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .post("/api/v1/topic/9999/move")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ title: "spiders" });

        topic.should.have.status(404);
        topic.body.should.have.property("message");
      });
      it("should return 400 if validation fails", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .post("/api/v1/topic/1/move")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ title: "" });

        topic.should.have.status(400);
        topic.body.should.have.property("error");
      });
      it("should return 401 if illegally accessed", async () => {
        const agent = getAgent(server);

        const topic = await agent
          .post("/api/v1/topic/1/move")
          .set("content-type", "application/json")

          .send({ title: "spiders" });

        topic.should.have.status(401);
        topic.body.should.have.property("error");
      });
    });
    describe("Change a topics color - Auth", () => {
      it("should change a topics color", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Owner");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .post("/api/v1/topic/1/color")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ changeColor: "#000" });

        topic.should.have.status(200);
        topic.body.should.have.property("success");
      });
      it("should return 404 if no topic exists", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Owner");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .post("/api/v1/topic/9999/color")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ changeColor: "#000" });

        topic.should.have.status(404);
        topic.body.should.have.property("message");
      });
      it("should return 401 if not the topic owner", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .post("/api/v1/topic/1/color")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ changeColor: "#000" });

        topic.should.have.status(401);
        topic.body.should.have.property("error");
      });
      it("should return 401 if illegally accessed", async () => {
        const agent = getAgent(server);

        const topic = await agent
          .post("/api/v1/topic/1/color")
          .set("content-type", "application/json");

        topic.should.have.status(401);
        topic.body.should.have.property("error");
      });
    });
  });
  describe("PUT", () => {
    describe("Edits a topic - Auth", () => {
      it("should edit a topic", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Owner");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .put("/api/v1/topic/1/edit")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ title: "new title", discussion: "new discussion" });

        topic.should.have.status(200);
        topic.body.should.have.property("success");
      });
      it("should return 400 if validation fails", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Owner");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .put("/api/v1/topic/1/edit")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ title: "", discussion: "new discussion" });

        topic.should.have.status(400);
        topic.body.should.have.property("error");
      });
      it("should return 404 if no topic is found", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Owner");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .put("/api/v1/topic/9999/edit")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ title: "new title", discussion: "new discussion" });

        topic.should.have.status(404);
        topic.body.should.have.property("message");
      });
      it("should return 401 if not the topic owner", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .put("/api/v1/topic/1/edit")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ title: "new title", discussion: "new discussion" });

        topic.should.have.status(401);
        topic.body.should.have.property("error");
      });
      it("should return 401 if illegally accessed", async () => {
        const agent = getAgent(server);

        const topic = await agent
          .put("/api/v1/topic/1/edit")
          .set("content-type", "application/json")

          .send({ title: "new title", discussion: "new discussion" });

        topic.should.have.status(401);
        topic.body.should.have.property("error");
      });
    });
  });
  describe("DELETE", () => {
    describe("Deletes a topic - Staff | Auth", () => {
      it("should remove a topic", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .delete("/api/v1/topic/1")
          .set("content-type", "application/json")
          .set("Authorization", token);

        topic.should.have.status(200);
        topic.body.should.have.property("success");
      });
      it("should return 404 if topic not found", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const token = `Bearer ${user.body.token}`;
        const topic = await agent
          .delete("/api/v1/topic/9999")
          .set("content-type", "application/json")
          .set("Authorization", token);

        topic.should.have.status(404);
        topic.body.should.have.property("message");
      });
      it("should return 401 if illegally accessed", async () => {
        const agent = getAgent(server);

        const topic = await agent
          .delete("/api/v1/topic/1")
          .set("content-type", "application/json");

        topic.should.have.status(401);
        topic.body.should.have.property("error");
      });
    });
  });
});
