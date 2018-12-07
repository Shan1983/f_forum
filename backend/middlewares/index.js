const passport = require("passport");
const { errorLog, logger } = require("../helpers/logging");
const moment = require("moment");

exports.log = (req, res, next) => {
  const log = {
    time: moment().format("YYYY-MM-DD-hh:mm:ss"),
    ip: req.ip,
    user: req.session.userId || "N/A",
    status: res.statusCode,
    method: req.method,
    url: req.originalUrl,
    level: "info",
    message: "OK"
  };
  logger.info(log);
  next();
};

exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);

  const logError = {
    time: moment().format("YYYY-MM-DD-hh:mm:ss"),
    ip: req.ip,
    user: req.session.userId || "N/A",
    status: res.statusCode,
    method: req.method,
    url: req.originalUrl,
    level: "error",
    message: error
  };

  errorLog.error(logError);
  next(error);
};

exports.errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500);
  // log error
  const logError = {
    time: moment().format("YYYY-MM-DD-hh:mm:ss"),
    ip: req.ip,
    user: req.session.userId || "N/A",
    status: res.statusCode,
    method: req.method,
    url: req.originalUrl,
    level: "error",
    message: err.message
  };

  errorLog.error(logError);

  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }

  res.json({
    status: res.statusCode,
    error: err.error,
    message: err.message
  });

  next();
};

exports.isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (info) {
      res.status(401);
      return res.json({
        error: info.message
      });
    }

    if (!user) {
      res.status(401);
      return res.json({ error: "Not authorized" });
    }

    if (!req.session.userId) {
      res.status(401);
      return next({
        error: "NOTAUTHORIZED",
        message: "You are not authorized to continue."
      });
    }

    return next();
  })(req, res, next);
};

exports.owner = (req, res, next) => {
  if (req.session.role === "Owner") {
    next();
  } else {
    res.status(401);
    next({
      error: "NOTAUTHORIZED",
      message: "You are not authorized to continue."
    });
  }
};

exports.admin = (req, res, next) => {
  if (req.session.role === "Admin" || req.session.role === "Owner") {
    next();
  } else {
    res.status(401);
    next({
      error: "NOTAUTHORIZED",
      message: "You are not authorized to continue."
    });
  }
};

exports.staff = (req, res, next) => {
  if (req.session.role !== "Member") {
    next();
  } else {
    res.status(401);
    next({
      error: "NOTAUTHORIZED",
      message: "You are not authorized to continue."
    });
  }
};
