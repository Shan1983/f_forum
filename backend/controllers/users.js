const randomColor = require("randomcolor");
const bcrypt = require("bcryptjs");
const {
  generateId,
  generateHash,
  setupUserSession
} = require("../helpers/auth");
const { getRoleId, getRoleFromId } = require("../helpers/roles");
const User = require("../queries/users");
const { signToken } = require("../helpers/tokens");

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.findAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getAllAdmins = async (req, res, next) => {
  try {
    const query = await User.findAllAdmins();
    const admins = query[0];

    res.json(admins);
  } catch (error) {
    next(error);
  }
};

exports.getSingle = async (req, res, next) => {};

exports.getProfile = async (req, res, next) => {};

exports.getAvatar = async (req, res, next) => {};

exports.verifyEmail = async (req, res, next) => {};

exports.login = async (req, res, next) => {
  try {
    // get the user
    const query = await User.findByEmail(req.body.email);

    // check user is banned
    if (query.banned) {
      throw new Error("BANNED");
    }

    // validate users password
    if (await bcrypt.compare(req.body.password, query.hash)) {
      // generate a new token for the user
      const token = await signToken(query);
      // set up the users session
      await setupUserSession(
        req,
        query.username,
        query.id,
        query.role_id,
        token
      );

      const userObj = {
        id: query.id,
        color: query.color_icon,
        username: query.username,
        email: query.email,
        role: await getRoleFromId(query.role_id),
        created_at: query.created_at,
        token
      };

      res.json(userObj);
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const user = {
      id: generateId(),
      color_icon: randomColor(),
      username: req.body.username,
      email: req.body.email,
      hash: generateHash(req.body.password),
      role_id: await getRoleId("Member")
    };

    const result = await User.insert(user);

    res.json(result);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.session.destroy(() => {
      res.clearCookie("adminUI");
      res.clearCookie("sexy-token");
      res.json({
        success: true
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.upload = async (req, res, next) => {};

exports.closeAccount = async (req, res, next) => {};

exports.updateProfile = async (req, res, next) => {};

exports.destroy = async (req, res, next) => {};
