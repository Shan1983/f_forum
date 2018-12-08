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
      it("should return all topics in a category");
      it("should return 404 if no topics are found");
      it("should return 401 if illegally accessed");
    });
    describe("Get a single topic - Auth", () => {
      it("should return a single topic");
      it("should return 404 if no topic is found");
      it("should return 401 if illegally accessed");
    });
    describe("Gets all deleted topics - Paginated | Staff | Auth", () => {
      it("should return a list of deleted topics");
      it("should return 404 if theyre no deleted topics");
      it("should return 401 if illegally accessed");
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
