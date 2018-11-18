const winston = require("winston");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// setup logging
const logDir = "./logs";

const logFormatter = args => {
  const date = moment().format("DD.MM.YYYY hh:mm:ss");
  let msg;
  msg = `${date} - ${args.ip} - ${args.status} - ${args.method} - ${
    args.url
  } - ${args.level} - ${args.message}`;
  return msg;
};

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const now = moment().format("DD-MM-YYYY");
const logFile = `${logDir}/f_forum-${now}.log`;
const logFileError = `${logDir}/f_forum-${now}-errors.log`;

const logger = winston.createLogger({
  level: "info",
  json: true,
  formatter: logFormatter,
  transports: [
    new winston.transports.File({
      filename: logFile,
      level: "info"
    })
  ]
});

const loggerError = winston.createLogger({
  level: "error",
  json: true,
  formatter: logFormatter,
  transports: [
    new winston.transports.File({
      filename: logFileError,
      level: "error"
    })
  ]
});

exports.logger = logger;
exports.errorLog = loggerError;
