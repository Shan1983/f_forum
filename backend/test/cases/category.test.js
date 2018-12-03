process.env.NODE_ENV = "test";

const server = require("../../server");
const db = require("../../db");

const { setupTestDb, DbCleanup } = require("../helpers/dbSetup");

describe("CATEGORY ROUTES", () => {
  beforeEach(async () => {
    await setupTestDb(db);
  });

  afterEach(async () => {
    await DbCleanup(db);
  });

  describe("GET", () => {
    describe("Get All Categories - Paginated | Auth", () => {});
    describe("Get Categories Topics - Paginated | Auth", () => {});
  });
  describe("POST", () => {
    describe("Create new categories -  Auth | staff", () => {});
  });
  describe("PUT", () => {
    describe("Edit categories -  Auth | staff", () => {});
  });
  describe("DELETE", () => {
    describe("delete categories -  Auth | staff", () => {});
  });
});
