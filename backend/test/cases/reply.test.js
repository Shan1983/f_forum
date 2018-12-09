process.env.NODE_ENV = "test";

const server = require("../../server");
const db = require("../../db");

const { setupTestDb, DbCleanup } = require("../helpers/dbSetup");
const { getAgent, login } = require("../helpers/users");
const rewards = require("../../helpers/rewards");

describe("REPLY ROUTES", () => {
  beforeEach(async () => {
    await setupTestDb(db);
  });

  afterEach(async () => {
    await DbCleanup(db);
  });

  describe("GET", () => {
    describe("Get all the replies to a topic - Auth", () => {
      it("should return a list of replies to the topic", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const replies = await agent
          .get("/api/v1/reply/1?page=1&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        replies.should.have.status(200);
        replies.body.should.have.property("replies");
        replies.body.should.have.property("meta");
      });
      it("should return 404 if theyre no replies", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const replies = await agent
          .get("/api/v1/reply/9999?page=1&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        replies.should.have.status(404);
        replies.body.should.have.property("message");
      });
      it("should return 401 if accessed illegally", async () => {
        const agent = getAgent(server);

        const replies = await agent
          .get("/api/v1/reply/1?page=1&limit=15")
          .set("content-type", "application/json");

        replies.should.have.status(401);
        replies.body.should.have.property("error");
      });
    });
  });
  describe("POST", () => {
    describe("Post a new reply - Auth", () => {
      it("should post a new reply", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const replies = await agent
          .post("/api/v1/reply/1")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ reply: "big long reply" });

        replies.should.have.status(200);
        replies.body.should.have.property("success");
      });
      it("should return 400 if validation fails", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const replies = await agent
          .post("/api/v1/reply/1")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ reply: "" });

        replies.should.have.status(400);
        replies.body.should.have.property("error");
      });
    });
  });
  describe("PUT", () => {
    describe("Update a reply - Auth", () => {
      it("should update a reply", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const replies = await agent
          .put("/api/v1/reply/1")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ reply: "big long reply" });

        replies.should.have.status(200);
        replies.body.should.have.property("success");
      });
      it("should return 400 if validation fails", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const replies = await agent
          .put("/api/v1/reply/1")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ reply: "" });

        replies.should.have.status(400);
        replies.body.should.have.property("error");
      });
    });
  });
  describe("DELETE", () => {
    describe("Delete a reply - Staff | Auth", () => {
      it("should remove a reply", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const replies = await agent
          .delete("/api/v1/reply/1")
          .set("content-type", "application/json")
          .set("Authorization", token);

        replies.should.have.status(200);
        replies.body.should.have.property("success");
      });
      it("should return 404 if reply not exists", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const replies = await agent
          .delete("/api/v1/reply/999")
          .set("content-type", "application/json")
          .set("Authorization", token);

        replies.should.have.status(404);
        replies.body.should.have.property("message");
      });
      it("should return 401 if unauthorized", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const replies = await agent
          .delete("/api/v1/reply/1")
          .set("content-type", "application/json")
          .set("Authorization", token);

        replies.should.have.status(401);
        replies.body.should.have.property("error");
      });
    });
  });
});
