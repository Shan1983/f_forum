const uuidv1 = require("uuid/v1");
const bycrypt = require("bcryptjs");
const Cookie = require("js-cookie");
const { getRoleFromId } = require("../roles");

exports.generateId = () => {
  return uuidv1();
};

exports.generateHash = password => {
  return bycrypt.hashSync(password, 10);
};

exports.setupUserSession = async (req, username, userId, roleId, token) => {
  req.session.loggedIn = true;
  req.session.username = username;
  req.session.userId = userId;
  req.session.token = token;

  const role = await getRoleFromId(roleId);

  switch (role) {
    case "Owner":
      req.session.role = "Owner";
      break;
    case "Admin":
      req.session.role = "Admin";
      break;
    case "Moderator":
      req.session.role = "Moderator";
      break;
    case "Member":
      req.session.role = "Member";
      break;
    default:
      return null;
  }

  // set cookie for showing admin links
  // admins routes are secure
  if (role === "Admin" || role === "Moderator") {
    Cookie.set("adminUI", true, { expires: 7 });
  }

  // for testing purposes
  Cookie.set("sexy-token", token, { expires: 1 });
};
