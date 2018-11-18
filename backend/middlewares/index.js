const { errorLog } = require("../helpers/logging");

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
};
