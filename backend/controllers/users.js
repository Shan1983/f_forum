const randomColor = require("randomcolor");
const bcrypt = require("bcryptjs");
const uuidv4 = require("uuid/v4");
const moment = require("moment");
const Joi = require("joi");
const { generateHash, setupUserSession } = require("../helpers/auth");
const { getRoleId, getRoleFromId } = require("../helpers/roles");
const User = require("../queries/users");
const Ip = require("../queries/ips");
const { signToken } = require("../helpers/tokens");
const {
  updatePasswordSchema,
  updateEmailSchema,
  registerSchema
} = require("../helpers/validation");

exports.getAll = async (req, res, next) => {
  try {
    // pagination options
    const options = {
      req,
      page: req.query.page,
      limit: req.query.limit
    };

    const users = await User.findAllUsersPaginated(options);

    if (users.data === undefined) {
      res.status(404);
      return next({
        error: "NOTFOUND",
        message: `Not Found - ${req.originalUrl}`
      });
    }

    const userObj = users.data.map(async u => {
      return {
        id: u.id,
        color: u.color_icon,
        username: u.username,
        pcount: u.post_count,
        points: u.points,
        role: await getRoleFromId(u.role_id),
        avatar: u.avatar,
        created: moment(u.created_at).fromNow()
      };
    });

    Promise.all(userObj).then(response => {
      res.json({
        users: response,
        meta: {
          limit: users.limit,
          count: users.count,
          pageCount: users.pageCount,
          currentPage: users.currentPage
        }
      });
    });
    // validate if we found a user
    // if (!users) {
    //   res.status(400);
    //   return next({
    //     error: "NOUSERS",
    //     message: `Currently they're no users.`
    //   });
    // }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getAllAdmins = async (req, res, next) => {
  try {
    // pagination options
    const options = {
      req,
      page: req.query.page,
      limit: req.query.limit
    };

    const users = await User.findAllAdminsPaginated(options);

    if (users.data === undefined) {
      res.status(404);
      return next({
        error: "NOTFOUND",
        message: `Not Found - ${req.originalUrl}`
      });
    }

    const userObj = users.data.map(async u => {
      return {
        id: u.id,
        color: u.color_icon,
        username: u.username,
        pcount: u.post_count,
        points: u.points,
        avatar: u.avatar,
        created: moment(u.created_at).fromNow()
      };
    });

    Promise.all(userObj).then(response => {
      res.json({
        users: response,
        meta: {
          limit: users.limit,
          count: users.count,
          pageCount: users.pageCount,
          currentPage: users.currentPage
        }
      });
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getSingle = async (req, res, next) => {
  try {
    // get the user
    const user = await User.findById(req.params.id);

    // validate if we found a user
    if (!users) {
      res.status(400);
      return next({
        error: "ACCOUNTNOTEXISTS",
        message: `This account does not exist.`
      });
    }

    // find the users posts

    const userObj = {
      color_icon: user.color_icon,
      username: user.username,
      role: await getRoleFromId(user.role_id),
      avatar: user.avatar,
      created_at: user.created_at,
      posts: []
    };

    res.json(userObj);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    // get the user
    const user = await User.findById(req.params.id);

    // validate if we found a user
    if (!users) {
      res.status(404);
      return next();
    }

    // get other stuff <<coming soon>>
    const userObj = {
      color_icon: user.color_icon,
      username: user.username,
      role: await getRoleFromId(user.role_id),
      avatar: user.avatar,
      created_at: user.created_at,
      posts: [],
      friends: []
    };

    res.json(userObj);
  } catch (error) {
    next(error);
  }
};

exports.getAvatar = async (req, res, next) => {
  try {
    // get the user avatar
    const avatar = await User.getAvatar(req.params.id);
    res.json(avatar);
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    // get the user
    const user = await User.findByToken("token", req.params.token);

    // validate user found
    if (user === undefined) {
      res.status(400);
      return next({
        error: "TOKENERROR",
        message: `Email verification failed.`
      });
    }

    user.token = null;
    user.verified = true;

    await User.update(user.id, user);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // get the user
    const user = await User.findByToken("ptoken", req.params.token);

    // validate user found
    if (user === undefined) {
      res.status(400);
      return next({
        error: "TOKENERROR",
        message: `Password reset failed.`
      });
    }

    // validate input
    const errors = Joi.validate(req.body, updatePasswordSchema);

    if (!errors.error) {
      user.ptoken = null;
      if (req.body.password === req.body.confirmPassword) {
        user.hash = generateHash(req.body.password);
      } else {
        res.status(400);
        next({
          error: "VALIDATIONERROR",
          message: "Password fields need to match."
        });
      }
      User.update(user.id, user);
    } else {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    await User.update(user.id, user);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    // validate input
    const errors = Joi.validate(req.body, updateEmailSchema);

    if (!errors.error) {
      // get the user
      const user = await User.findByEmail(req.params.email);

      // validate user found
      if (user === undefined) {
        res.status(400);
        return next({
          error: "ACCOUNTNOTEXISTS",
          message: "This account does not exist."
        });
      }

      user.ptoken = uuidv4();

      await User.update(user.id, user);

      // send email event
      res.json({ success: true });
    } else {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    // get the user
    const query = await User.findByEmail(req.body.email);

    if (!query) {
      res.status(403);
      return next({
        error: "LOGINERROR",
        message: "The email or password provided was incorrect."
      });
    }

    if (!query.verified) {
      res.status(403);
      return next({
        error: "NOTVERIFIED",
        message:
          "Please go to your email address and follow the instructiosn in order to verify your account."
      });
    }

    // check user is banned
    if (query.banned) {
      res.status(401);
      return next({
        error: "BANNED",
        message: "You are banned."
      });
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
      res.status(403);
      return next({
        error: "LOGINERROR",
        message: "The email or password provided was incorrect."
      });
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    // validate input
    const errors = Joi.validate(req.body, registerSchema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    const user = {
      color_icon: randomColor(),
      username: req.body.username,
      email: req.body.email,
      hash: generateHash(req.body.password),
      role_id: 1,
      token: uuidv4()
    };

    // check if the user has registered before
    const checkUser = await User.findByEmailIgnoreIfAccountClosed(
      req.body.email
    );

    if (checkUser !== undefined) {
      res.status(400);
      if (checkUser.banned) {
        return next({ error: "BANNED", message: "You are banned." });
      }
      return next({
        error: "ACCOUNTEXISTS",
        message: "You already have an account. Please try logging in instead."
      });
    }

    await User.insert(user);
    await Ip.insert({
      user_id: user.id,
      ip: req.ip
    });

    res.json({ success: true });
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

exports.upload = async (req, res, next) => {
  //get the user
  const user = await User.findById(req.params.id);

  // catch the file
  const filename = req.file.originalname;

  // edit the file
  const uploadedFilename = `${moment().unix()}${filename}`;

  // update the user object
  user.avatar = uploadedFilename;

  // update the db
  await User.update(user.id, user);
  res.json({ success: true });
};

exports.closeAccount = async (req, res, next) => {
  try {
    // get the user
    const user = await User.findById(req.params.id);

    // validate if we found a user
    if (user === undefined) {
      res.status(400);
      return next({
        error: "ACCOUNTNOTEXISTS",
        message: "This account does not exist."
      });
    }

    if ((await getRoleFromId(user.role_id)) === "Admin") {
      res.status(400);
      return next({
        error: "ACCOUNTCLOSEERROR",
        message: "You can not close an admin account."
      });
    }

    await User.closeAccount(req.params.id);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.updateProfileEmail = async (req, res, next) => {
  try {
    // validate input
    const errors = Joi.validate(req.body, updateEmailSchema);

    // get the user
    const user = await User.findById(req.params.id);

    // validate user exists
    if (user === undefined) {
      res.status(400);
      return next({
        error: "ACCOUNTNOTEXISTS",
        message: "This account does not exist."
      });
    }

    // validate the user can make changes
    if (user.id !== req.session.userId) {
      res.status(401);
      return next({
        error: "NOTAUTHORIZED",
        message: "You are not authorized to continue."
      });
    }

    // update the users email
    if (!errors.error) {
      user.email = req.body.email;
      await User.update(user.id, user);
    } else {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.updateProfileOptions = async (req, res, next) => {
  try {
    // validate input
    const errors = Joi.validate(req.body, updateOptionsSchema);

    // get the user
    const user = await User.findById(req.params.id);

    // validate user exists
    if (user === undefined) {
      res.status(400);
      return next({
        error: "ACCOUNTNOTEXISTS",
        message: "This account does not exist."
      });
    }

    // validate the user can make changes
    if (user.id !== req.session.userId) {
      res.status(401);
      return next({
        error: "NOTAUTHORIZED",
        message: "You are not authorized to continue."
      });
    }

    // update the users email
    if (!errors.error) {
      user.bio = req.body.description;
      user.allowSubs = req.body.subscriptions;
      user.advertising = req.body.advertising;
      await User.update(user.id, user);
    } else {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.updateProfilePassword = async (req, res, next) => {
  try {
    // validate input
    const errors = Joi.validate(req.body, updatePasswordSchema);

    // get the user
    const user = await User.findById(req.params.id);

    // validate user exists
    if (user === undefined) {
      res.status(400);
      return next({
        error: "ACCOUNTNOTEXISTS",
        message: "This account does not exist."
      });
    }

    // validate the user can make changes
    if (user.id !== req.session.userId) {
      res.status(401);
      return next({
        error: "NOTAUTHORIZED",
        message: "You are not authorized to continue."
      });
    }

    // update the users password
    if (!errors.error) {
      if (await bcrypt.compare(req.body.password, user.hash)) {
        const newHash = generateHash(req.body.confirmPassword);
        user.hash = newHash;
        await User.update(user.id, user);
      } else {
        res.status(401);
        return next({
          error: "NOTAUTHORIZED",
          message: "You are not authorized to continue."
        });
      }
    } else {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.privileges = async (req, res, next) => {
  try {
    // find the user
    const user = await User.findById(req.params.id);

    // validate user
    if (user === undefined) {
      res.status(400);
      return next({
        error: "ACCOUNTNOTEXISTS",
        message: `This account does not exist.`
      });
    }

    const currentRole = await getRoleFromId(user.role_id);

    if (currentRole === req.body.role) {
      res.status(400);
      return next({
        error: "PRIVILEGESERROR",
        message: `You can't update/down grade a user to same role.`
      });
    }

    const newRole = await getRoleId(req.body.role);

    if (newRole === undefined || newRole === "Owner") {
      res.status(400);
      return next({ error: "ROLEERROR", message: "Unknown role" });
    }

    user.role_id = newRole;
    await User.update(user.id, user);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
