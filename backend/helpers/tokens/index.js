const jwt = require("jsonwebtoken");
require("dotenv").config();

const { getRoleFromId } = require("../roles");

exports.signToken = async user => {
  const payload = {
    id: user.id,
    username: user.username,
    role: await getRoleFromId(user.role_id)
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
};

exports.verifyToken = token => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
