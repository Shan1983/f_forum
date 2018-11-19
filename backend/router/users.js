const express = require("express");
const router = express.Router();
const multer = require("multer");
const moment = require("moment");

const { log, isAuthenticated } = require("../middlewares");
const controller = require("../controllers/users");

// setup multer
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const filename = file.originalname;
    const uploadedFilename = `${moment().unix()}${filename}`;
    cb(null, uploadedFilename);
  }
});

const upload = multer({ storage, limits: { fileSize: 1000000 } });

router.get("/", isAuthenticated, log, controller.getAll);
router.get("/admins", isAuthenticated, log, controller.getAllAdmins);
router.get("/:id", isAuthenticated, log, controller.getSingle);
router.get("/profile/:id", isAuthenticated, log, controller.getProfile);
router.get("/:id/avatar", log, controller.getAvatar);
router.get("/verify/email/:token", log, controller.verifyEmail);

router.post("/login", log, controller.login);
router.post("/register", log, controller.register);
router.post("/logout", log, controller.logout);
router.post(
  "/profile/:id/upload",
  isAuthenticated,
  upload.single("avatar"),
  log,
  controller.upload
);
router.post("/:id/close", isAuthenticated, log, controller.closeAccount);

router.put(
  "/profile/:id/email",
  isAuthenticated,
  log,
  controller.updateProfileEmail
);
router.put(
  "/profile/:id/password",
  isAuthenticated,
  log,
  controller.updateProfilePassword
);
// router.put(
//   "/profile/:id/options",
//   isAuthenticated,
//   log,
//   controller.updateProfileOptions
// );

module.exports = router;
