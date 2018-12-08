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

const KnexSessionStoreFactory = require("connect-session-knex");
const KnexSessionStore = KnexSessionStoreFactory(session);
const db = require("./db");

const { notFound, errorHandler } = require("./middlewares");

const app = express();

// setup the session store
const sessionStore = new KnexSessionStore({
  knex: db,
  tablename: "sessions"
});

// setup the middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(compression());
app.use(helmet());

// setup session middleware
const oneWeekInMillis = 604800000;
app.set("trust proxy", 1);
app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: oneWeekInMillis
    },
    store: sessionStore
  })
);

// setup authentication
app.use(passport.initialize());
app.use(passport.session());
require("./services/authentication")(passport);

// setup routes
app.use("/api/v1/user", require("./router/users"));
app.use("/api/v1/category", require("./router/categories"));
app.use("/api/v1/topic", require("./router/topics"));
app.use("/api/v1/reply", require("./router/replies"));
app.use("/api/v1/friend", require("./router/friends"));
app.use("/api/v1/report", require("./router/reports"));
app.use("/api/v1/penalty", require("./router/penalty"));
app.use("/api/v1/subscription", require("./router/subscriptions"));
app.use("/api/v1/like", require("./router/likes"));
app.use("/api/v1/reward", require("./router/rewards"));
app.use("/api/v1/poll", require("./router/polls"));

// setup 404 handle
app.use(notFound);

// setup error handling
app.use(errorHandler);

const init = async (port, args) => {
  try {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);

      logger.info(args);
    });
  } catch (error) {
    console.log(error);
  }
};

if (process.env.NODE_ENV === "test") {
  const port = 8888;
  const args = {
    status: "Ok",
    level: "info",
    message: "==[ TEST STARTED ]=="
  };
  init(port, args);
} else {
  const args = {
    status: "Ok",
    level: "info",
    message: "==[ f_forum started ]=="
  };
  init(process.env.PORT, args);
}

module.exports = app;
