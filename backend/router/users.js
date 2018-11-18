const express = require("express");
const router = express.Router();

const { log, isAuthenticated } = require("../middlewares");
const controller = require("../controllers/users");

router.get("/", isAuthenticated, log, controller.getAll);
router.get("/admins", isAuthenticated, log, controller.getAllAdmins);
router.get("/:id", isAuthenticated, log, controller.getSingle);
router.get("/profile/:id", isAuthenticated, log, controller.getProfile);
router.get("/:id/avatar", log, controller.getAvatar);
router.get("/verify/email/:token", log, controller.verifyEmail);

router.post("/login", log, controller.login);
router.post("/register", log, controller.register);
router.post("/logout", log, controller.logout);
router.post("/profile/:id/upload", isAuthenticated, log, controller.upload);
router.post(
  "/profile/:id/close",
  isAuthenticated,
  log,
  controller.closeAccount
);

router.put("/profile/:id", isAuthenticated, log, controller.updateProfile);

router.delete("/:id", isAuthenticated, log, controller.destroy);

module.exports = router;
