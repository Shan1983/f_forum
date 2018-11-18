const passport = require("passport");
const { errorLog, logger } = require("../helpers/logging");

exports.log = (req, res, next) => {
  const log = {
    ip: req.ip,
    user: req.session.userId || "N/A",
    status: res.statusCode,
    method: req.method,
    url: res.originalUrl,
    level: "info",
    message: "OK"
  };
  logger.info(log);
  next();
};

exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

exports.errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500);
  // log error
  const logError = {
    ip: req.ip,
    user: req.session.userId || "N/A",
    status: res.statusCode,
    method: req.method,
    url: res.originalUrl,
    level: "error",
    message: err.message
  };

  errorLog.error(logError);

  res.json({
    status: res.statusCode,
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
      return res.json({ error: "Not authorized" });
    }

    return next();
  })(req, res, next);
};
