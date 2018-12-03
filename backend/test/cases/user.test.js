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
        const singleUser = await agent
          .get(`/api/v1/user/${user.body.id}`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        singleUser.should.have.status(200);
        singleUser.body.should.have.property("users");
        const keys = singleUser.body.users;
        keys.should.have.property("username").and.be.a("string");
        keys.should.have.property("topics").and.be.a("array");
      });
      it("should return 404 if user not exists", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const singleUser = await agent
          .get(`/api/v1/user/9999`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        singleUser.should.have.status(404);
        singleUser.body.should.have.property("error");
      });
    });
    describe("Get All Admin Users - Paginated | Auth | Admin", () => {
      it("should return a list of admin users", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const token = `Bearer ${user.body.token}`;
        const close = await agent
          .get("/api/v1/user/admins?page=1&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        close.should.have.status(200);
        close.body.should.have.property("users").and.be.a("array");
        const keys = close.body.users;
        keys[0].should.have.property("id").and.be.a("number");
        keys[0].should.have.property("username").and.be.a("string");
      });
      it("should return 404 if no admin users found.", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const token = `Bearer ${user.body.token}`;
        const adminUsers = await agent
          .get("/api/v1/user/admins?page=99&limit=15")
          .set("content-type", "application/json")
          .set("Authorization", token);

        adminUsers.should.have.status(404);
        adminUsers.body.should.have.property("error");
      });
    });
    describe("Get A Users Profile - Auth", () => {
      it("should return a users profile", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const profile = await agent
          .get(`/api/v1/user/profile/${user.body.id}`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        profile.should.have.status(200);
        profile.body.should.have.property("user");
        const keys = profile.body.user;
        keys.should.have.property("username").and.be.a("string");
        keys.should.have.property("topics").and.be.a("array");
      });
      it("Reminder to add friends to profile");
      it("should return 404 if no user profile exists", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const profile = await agent
          .get(`/api/v1/user/profile/9999`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        profile.should.have.status(404);
        profile.body.should.have.property("error");
      });
    });
    describe("Get A Users Avatar", () => {
      it("should return a users avatar", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const profile = await agent
          .get(`/api/v1/user/${user.body.id}/avatar`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        profile.should.have.status(200);
        profile.body.should.have.property("avatar");
      });
    });
    describe("Verify A Users Email Address", () => {
      it("should verify a users email address", async () => {
        const agent = getAgent(server);
        const user = await db("users")
          .where("email", "not.verified@test.com")
          .first();

        const verify = await agent
          .get(`/api/v1/user/verify/email/${user.token}`)
          .set("content-type", "application/json");

        verify.should.have.status(200);
        verify.body.should.have.property("success", true);
      });
      it("should return 400 if no user exists", async () => {
        const agent = getAgent(server);

        const verify = await agent
          .get(`/api/v1/user/verify/email/9999`)
          .set("content-type", "application/json");

        verify.should.have.status(400);
        verify.body.should.have.property("error");
      });
    });
    describe("Reset A Users Password", () => {
      it("should reset a users password", async () => {
        const agent = getAgent(server);

        const user = await db("users")
          .where("email", "test@test.com")
          .first();

        const reset = await agent
          .get(`/api/v1/user/${user.ptoken}/request/reset`)
          .set("content-type", "application/json")
          .send({ password: "test123", confirmPassword: "test123" });

        reset.should.have.status(200);
        reset.body.should.have.property("success", true);
      });
      it("should return 400 if user not exists", async () => {
        const agent = getAgent(server);

        const user = await db("users")
          .where("email", "moderator@test.com")
          .first();

        const reset = await agent
          .get(`/api/v1/user/${user.ptoken}/request/reset`)
          .set("content-type", "application/json")
          .send({ password: "test123", confirmPassword: "test123" });

        reset.should.have.status(400);
        reset.body.should.have.property("error");
      });
      it("should return 400 if password validation fails", async () => {
        const agent = getAgent(server);

        const user = await db("users")
          .where("email", "moderator@test.com")
          .first();

        const reset = await agent
          .get(`/api/v1/user/${user.ptoken}/request/reset`)
          .set("content-type", "application/json")
          .send({ password: "test123", confirmPassword: "test1234" });

        reset.should.have.status(400);
        reset.body.should.have.property("error");
      });
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
      it("should upload a users avatar", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Member");

        const token = `Bearer ${user.body.token}`;
        const upload = await agent
          .post(`/api/v1/user/profile/${user.body.id}/upload`)
          .set("Authorization", token)
          .field("content-type", "multipart/form-data")
          .field("avatar", process.env.TEST_IMG_FILE)
          .attach("avatar", process.env.DESKTOP_IMAGE_PATH);

        upload.should.have.status(200);
        upload.body.should.have.property("success", true);
      });
    });
    describe("Close User Account - Auth | Admin", () => {
      it("should close a users account", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const userToClose = await db("users")
          .where("id", 1)
          .first();

        const token = `Bearer ${user.body.token}`;
        const close = await agent
          .post(`/api/v1/user/${userToClose.id}/close`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        close.should.have.status(200);
        close.body.should.have.property("success");
      });
      it("should return 400 if account not exists", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const token = `Bearer ${user.body.token}`;
        const close = await agent
          .post(`/api/v1/user/9999/close`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        close.should.have.status(400);
        close.body.should.have.property("error");
      });
      it("should return 400 if account is admin", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const token = `Bearer ${user.body.token}`;
        const close = await agent
          .post(`/api/v1/user/${user.body.id}/close`)
          .set("content-type", "application/json")
          .set("Authorization", token);

        close.should.have.status(400);
        close.body.should.have.property("error");
      });
    });
    describe("Request A Password Reset", () => {
      it("should send a reset request", async () => {
        const agent = getAgent(server);

        const request = await agent
          .post(`/api/v1/user/request/reset`)
          .set("content-type", "application/json")
          .send({ email: "test@test.com" });

        request.should.have.status(200);
        request.body.should.have.property("success");
      });
      it("should return 400 if user not exist", async () => {
        const agent = getAgent(server);

        const request = await agent
          .post(`/api/v1/user/request/reset`)
          .set("content-type", "application/json");

        request.should.have.status(400);
        request.body.should.have.property("error");
      });
    });
    describe("User Privileges - Auth | Admin", () => {
      it("should update a users privileges", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const userToPromote = await db("users")
          .where("id", 1)
          .first();

        const token = `Bearer ${user.body.token}`;
        const promote = await agent
          .post(`/api/v1/user/${userToPromote.id}/privileges`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ role: "Admin" });

        promote.should.have.status(200);
        promote.body.should.have.property("success");
      });
      it("should return 400 if user not exists", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const token = `Bearer ${user.body.token}`;
        const promote = await agent
          .post(`/api/v1/user/9999/privileges`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ role: "Admin" });

        promote.should.have.status(400);
        promote.body.should.have.property("error");
      });
      it("should return 400 if changing to same role", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const userToPromote = await db("users")
          .where("id", 1)
          .first();

        const token = `Bearer ${user.body.token}`;
        const promote = await agent
          .post(`/api/v1/user/${userToPromote.id}/privileges`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ role: "Member" });

        promote.should.have.status(400);
        promote.body.should.have.property("error");
      });
      it("should return 400 if validation fails", async () => {
        const agent = getAgent(server);
        const user = await login(agent, {}, "Admin");

        const userToPromote = await db("users")
          .where("id", 1)
          .first();

        const token = `Bearer ${user.body.token}`;
        const promote = await agent
          .post(`/api/v1/user/${userToPromote.id}/privileges`)
          .set("content-type", "application/json")
          .set("Authorization", token)
          .send({ role: "" });

        promote.should.have.status(400);
        promote.body.should.have.property("error");
      });
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
