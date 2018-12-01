process.env.NODE_ENV = "test";

const server = require("../../server");
const db = require("../../db");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;

chai.use(require("chai-http"));
chai.use(require("chai-things"));

const { setupTestDb, DbCleanup } = require("../helpers/dbSetup");
const { login, register, badRegistration } = require("../helpers/users");
const agent = chai.request.agent(server);

describe("USER ROUTES", () => {
  beforeEach(async () => {
    await setupTestDb(db);
  });

  afterEach(async () => {
    await DbCleanup(db);
  });

  describe("GET", () => {
    describe("Get All Users - Paginated | Auth | Staff", () => {
      it("should display all non deleted users");
      it("should return 404 if no users found.");
    });
    describe("Get A Single User - Auth", () => {
      it("should return a single user");
      it("should return 400 if user not exists");
    });
    describe("Get All Admin Users - Paginated | Auth | Admin", () => {
      it("should return a list of admin users");
      it("should return 404 if no admin users found.");
    });
    describe("Get A Users Profile - Auth", () => {
      it("should return a users profile");
      it("should return 404 if no user profile exists");
    });
    describe("Get A Users Avatar", () => {
      it("should return a users avatar");
    });
    describe("Verify A Users Email Address", () => {
      it("should verify a users email address");
      it("should return 400 if no user exists");
    });
    describe("Reset A Users Password", () => {
      it("should reset a users password");
      it("should return 400 if user not exists");
      it("should return 400 if password validation fails");
      it("should return 400 if validation fails");
    });
  });
  describe("POST", () => {
    describe("LogIn", () => {
      it("should log a user in", async () => {
        const data = { email: "test@test.com", password: "test123" };
        const user = await login(agent, data);

        user.should.have.status(200);
        user.body.should.have.property("token");
      });
      it("should refuse to log an intruder in", async () => {
        const data = { email: "intruder@test.com", password: "donkeyKong_83" };
        const user = await login(agent, data);

        user.should.have.status(403);
        user.body.should.have.property("error", "LOGINERROR");
      });
      it("should refuse to log an unverified user in", async () => {
        const data = { email: "admin@test.com", password: "test123" };
        const user = await login(agent, data);

        user.should.have.status(403);
        user.body.should.have.property("error", "NOTVERIFIED");
      });
      it("should refuse to log a banned user in", async () => {
        const data = { email: "banned@test.com", password: "test123" };
        const user = await login(agent, data);

        user.should.have.status(401);
        user.body.should.have.property("error", "BANNED");
      });
    });
    describe("Register", () => {
      it("should register a new user", async () => {
        const user = await register(agent);

        user.should.have.status(200);
        user.body.should.have.property("success", true);
      });
      it("should refuse to register a user if validation fails", async () => {
        const data = {
          username: "test",
          password: "test"
        };
        const user = await badRegistration(agent, data);

        user.should.have.status(400);
        user.body.should.have.property("error", "VALIDATIONERROR");
      });
      it("should refuse to register a banned user", async () => {
        const data = {
          username: "test",
          email: "banned@test.com",
          password: "test"
        };
        const user = await badRegistration(agent, data);

        user.should.have.status(400);
        user.body.should.have.property("error", "BANNED");
      });
      it("should refuse to register if user already has account", async () => {
        const data = {
          username: "test",
          email: "test@test.com",
          password: "test"
        };
        const user = await badRegistration(agent, data);

        user.should.have.status(400);
        user.body.should.have.property("error", "ACCOUNTEXISTS");
      });
    });
    describe("LogOut", () => {
      it("should log a user out");
    });
    describe("Upload Avatar - Auth", () => {
      it("should upload a users avatar");
    });
    describe("Close User Account - Auth | Admin", () => {
      it("should close a users account");
      it("should return 400 if account not exists");
      it("should return 400 if account is admin");
    });
    describe("Request A Password Reset", () => {
      it("should send a reset request");
      it("should return 400 if user not exist");
    });
    describe("User Privileges - Auth | Admin", () => {
      it("should update a users privileges");
      it("should return 400 if user not exists");
      it("should return 400 if changing to same role");
      it("should return 400 if validation fails");
    });
  });
  describe("PUT", () => {
    describe("Update User Email - Auth", () => {
      it("should update a users email address");
      it("should return 400 if user not exists");
      it("should return 401 if user not account owner");
      it("should return 400 if validation fails");
    });
    describe("Update A Users Account Options - Auth", () => {
      it("should update a users account options");
      it("should return 400 if user not exists");
      it("should return 401 if user not account owner");
      it("should return 400 if validation fails");
    });
    describe("Update A Users Password - Auth", () => {
      it("should update a users password");
      it("should return 400 if user not exists");
      it("should return 401 if user not account owner");
      it("should return 401 if password validation fails");
      it("should return 400 if validation fails");
    });
  });
});
