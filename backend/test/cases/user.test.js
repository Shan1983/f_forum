process.env.NODE_ENV = "test";

const server = require("../../server");
const db = require("../../db");

const { setupTestDb, DbCleanup } = require("../helpers/dbSetup");
const {
  login,
  register,
  badRegistration,
  getAgent
} = require("../helpers/users");

describe("USER ROUTES", () => {
  beforeEach(async () => {
    await setupTestDb(db);
  });

  afterEach(async () => {
    await DbCleanup(db);
  });

  describe("GET", () => {
    describe("Get All Users - Paginated | Auth | Staff", () => {
      it("should display all non deleted users", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const allUsers = await agent
          .get("/api/v1/user?page=1&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        allUsers.should.have.status(200);
        allUsers.body.should.have.property("meta");
      });
      it("should return 404 if no users found.", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Mod");

        const token = `Bearer ${user.body.token}`;
        const allUsers = await agent
          .get("/api/v1/user?page=5&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        allUsers.should.have.status(404);
        allUsers.body.should.have.property("error");
      });
    });
    describe("Get A Single User - Auth", () => {
      it("should return a single user", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const allUsers = await agent
          .get(
            `/api/v1/user/${Math.floor(Math.random() * Math.floor(20)) || 1}`
          )
          .set("content-type", "application/json")
          .set("Authorization", token);

        allUsers.should.have.status(200);
        allUsers.body.should.have.property("error");
      });
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
        const user = await login(getAgent(server), data);

        user.should.have.status(200);
        user.body.should.have.property("token");
      });
      it("should refuse to log an intruder in", async () => {
        const data = { email: "intruder@test.com", password: "donkeyKong_83" };
        const user = await login(getAgent(server), data);

        user.should.have.status(403);
        user.body.should.have.property("error", "LOGINERROR");
      });
      it("should refuse to log an unverified user in", async () => {
        const data = { email: "not.verified@test.com", password: "test123" };
        const user = await login(getAgent(server), data);

        user.should.have.status(403);
        user.body.should.have.property("error", "NOTVERIFIED");
      });
      it("should refuse to log a banned user in", async () => {
        const data = { email: "banned@test.com", password: "test123" };
        const user = await login(getAgent(server), data);

        user.should.have.status(401);
        user.body.should.have.property("error", "BANNED");
      });
    });
    describe("Register", () => {
      it("should register a new user", async () => {
        const user = await register(getAgent(server));

        user.should.have.status(200);
        user.body.should.have.property("success", true);
      });
      it("should refuse to register a user if validation fails", async () => {
        const data = {
          username: "test",
          password: "test"
        };
        const user = await badRegistration(getAgent(server), data);

        user.should.have.status(400);
        user.body.should.have.property("error", "VALIDATIONERROR");
      });
      it("should refuse to register a banned user", async () => {
        const data = {
          username: "test",
          email: "banned@test.com",
          password: "test"
        };
        const user = await badRegistration(getAgent(server), data);

        user.should.have.status(400);
        user.body.should.have.property("error", "BANNED");
      });
      it("should refuse to register if user already has account", async () => {
        const data = {
          username: "test",
          email: "test@test.com",
          password: "test"
        };
        const user = await badRegistration(getAgent(server), data);

        user.should.have.status(400);
        user.body.should.have.property("error", "ACCOUNTEXISTS");
      });
    });
    describe("LogOut", () => {
      it("should log a user out", async () => {
        const agent = getAgent(server);
        const logout = await agent
          .post("/api/v1/user/logout")
          .set("content-type", "application/json");

        logout.should.have.status(200);
        logout.body.should.have.property("success", true);
      });
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
