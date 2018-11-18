const uuidv1 = require("uuid/v1");
const bycrypt = require("bcryptjs");

exports.generateId = () => {
  return uuidv1();
};

exports.generateHash = password => {
  return bycrypt.hashSync(password, 10);
};
