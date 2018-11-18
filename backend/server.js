const express = require("express");
const cookieParser = require("cookie-parser");
// const morgan = require("morgan");
const passport = require("passport");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const session = require("express-session");
const { logger } = require("./helpers/logging");
require("dotenv").config();

const { notFound, errorHandler } = require("./middlewares");

const app = express();

// setup the middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(compression());
app.use(helmet());

// setup session middleware
app.set("trust proxy", 1);
app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true
  })
);

// setup authentication
app.use(passport.initialize());
require("./services/authentication")(passport);

// setup routes
app.use("/api/v1/user", require("./router/users"));

// setup 404 handle
app.use(notFound);

// setup error handling
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
  const args = {
    status: "Ok",
    level: "info",
    message: "==[ f_forum started ]=="
  };

  logger.info(args);
});

module.exports = app;
