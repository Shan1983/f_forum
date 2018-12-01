const Reward = require("../../queries/rewards");
const { logger, errorLog } = require("../logging");

exports.rewardSetup = app => {
  try {
    const reward = Reward.loadInitialRewards();

    app.locals.reply = reward.reply;
    app.locals.topic = reward.topic;
    app.locals.like = reward.like;
    app.locals.create_poll = reward.create_poll;
    app.locals.answer_poll = reward.answer_poll;

    log = {
      status: "OK",
      level: "info",
      message: "Reward data successfully loaded."
    };
    logger.info(log);

    return true;
  } catch (error) {
    console.log("Reward data error");
    console.log(error);
    const logError = {
      ip: "N/A",
      user: "N/A",
      status: 500,
      method: "N/A",
      url: "N/A",
      level: "error",
      message: "Failed to load reward data."
    };
    errorLog.error(logError);
    return false;
  }
};
