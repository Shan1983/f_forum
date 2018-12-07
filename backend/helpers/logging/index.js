const winston = require("winston");
const fs = require("fs");
const moment = require("moment");

// setup logging
const logDir = "./logs";

const logFormatter = args => {
  const date = moment().format("DD.MM.YYYY");
  let msg;
  msg = `${date} - ${args.ip} - ${args.user} - ${args.status} - ${
    args.method
  } - ${args.url} - ${args.level} - ${args.message}`;
  return msg;
};

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = `${logDir}/${moment().format(
  "YYYY-MM-DD"
)}-f_forum-general.log`;
const logFileError = `${logDir}/${moment().format(
  "YYYY-MM-DD"
)}-f_forum-errors.log`;

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
