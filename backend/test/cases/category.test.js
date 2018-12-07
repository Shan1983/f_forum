process.env.NODE_ENV = "test";

const server = require("../../server");
const db = require("../../db");

const { setupTestDb, DbCleanup } = require("../helpers/dbSetup");
const { getAgent, login } = require("../helpers/users");

describe("CATEGORY ROUTES", () => {
  beforeEach(async () => {
    await setupTestDb(db);
  });

  afterEach(async () => {
    await DbCleanup(db);
  });

  describe("GET", () => {
    describe("Get All Categories - Paginated | Auth", () => {
      it("should return a list all current categories", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const allCategories = await agent
          .get("/api/v1/category?page=1&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        allCategories.should.have.status(200);
        allCategories.body.should.have.property("categories");
        allCategories.body.should.have.property("meta");
      });
      it("should return 404 if no categories found", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const allCategories = await agent
          .get("/api/v1/category?page=1000&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        allCategories.should.have.status(404);
      });
    });
    describe("Get Categories Topics - Paginated | Auth", () => {
      it("should return a categories topics", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const categoryTopics = await agent
          .get("/api/v1/category/1/topics?page=1&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        categoryTopics.should.have.status(200);
        categoryTopics.body.should.have.property(
          "category",
          categoryTopics.body.category
        );
        categoryTopics.body.should.have.property("meta");
      });
      it("should return 404 if no topics found", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const categoryTopics = await agent
          .get("/api/v1/category/1/topics?page=1000&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        categoryTopics.should.have.status(404);
      });
    });
  });
  describe("POST", () => {
    describe("Create new categories -  Auth | staff", () => {
      it("should create a new category", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const createNewCategory = await agent
          .post("/api/v1/category/")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            title: "test category",
            description: "created during testing"
          });

        createNewCategory.should.have.status(200);
        createNewCategory.body.should.have.property("success");
        createNewCategory.body.should.have.property("category");
      });
      it("should return 400 if validation fails", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const createNewCategory = await agent
          .post("/api/v1/category/")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            title: "",
            description: "created during testing"
          });

        createNewCategory.should.have.status(400);
        createNewCategory.body.should.have.property("error");
      });
      it("prevent non staff members from creating categories", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const createNewCategory = await agent
          .post("/api/v1/category/")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            title: "test category",
            description: "created during testing"
          });

        createNewCategory.should.have.status(401);
        createNewCategory.body.should.have.property("error");
      });
    });
  });
  describe("PUT", () => {
    describe("Edit categories -  Auth | staff", () => {
      it("should edit a category", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const createNewCategory = await agent
          .put("/api/v1/category/1")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            title: "test category",
            description: "created during testing"
          });

        createNewCategory.should.have.status(200);
        createNewCategory.body.should.have.property("success");
        createNewCategory.body.should.have.property("category");
      });
      it("should return 400 if validation fails", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const createNewCategory = await agent
          .put("/api/v1/category/1")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ title: "", description: "created during testing" });

        createNewCategory.should.have.status(400);
        createNewCategory.body.should.have.property("error");
      });
      it("prevent non staff members from editing categories", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const createNewCategory = await agent
          .put("/api/v1/category/1")
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({
            title: "test category",
            description: "created during testing"
          });

        createNewCategory.should.have.status(401);
        createNewCategory.body.should.have.property("error");
      });
    });
  });
  describe("DELETE", () => {
    describe("delete categories -  Auth | staff", () => {
      it("should delete a category", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const createNewCategory = await agent
          .delete("/api/v1/category/1")
          .set("content-type", "application/json")
          .set("Authorization", token);

        createNewCategory.should.have.status(200);
        createNewCategory.body.should.have.property("success");
      });
      it("prevent non staff members from deleting categories", async () => {
        const agent = getAgent(server);

        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const createNewCategory = await agent
          .delete("/api/v1/category/1")
          .set("content-type", "application/json")
          .set("Authorization", token);

        createNewCategory.should.have.status(401);
        createNewCategory.body.should.have.property("error");
      });
    });
  });
});
