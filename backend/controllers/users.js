const randomColor = require("randomcolor");
const { generateId, generateHash } = require("../helpers/auth");
const { getRoleId } = require("../helpers/roles");
const User = require("../queries/users");

exports.getAll = async (req, res, next) => {};

exports.getSingle = async (req, res, next) => {};

exports.getProfile = async (req, res, next) => {};

exports.getAvatar = async (req, res, next) => {};

exports.verifyEmail = async (req, res, next) => {};

exports.login = async (req, res, next) => {};

exports.register = async (req, res, next) => {
  try {
    const user = {
      id: generateId(),
      color_icon: randomColor(),
      username: req.body.username,
      email: req.body.email,
      hash: generateHash(req.body.hash),
      role_id: await getRoleId("Member")
    };

    const result = await User.insert(user);

    res.json(result);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.logout = async (req, res, next) => {};

exports.upload = async (req, res, next) => {};

exports.closeAccount = async (req, res, next) => {};

exports.updateProfile = async (req, res, next) => {};

exports.destroy = async (req, res, next) => {};
