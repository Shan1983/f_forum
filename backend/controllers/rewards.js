const Reward = require("../queries/rewards");

exports.updateRewards = async (req, res, next) => {
  try {
    // create reward object
    const rewardObj = {
      r: req.body.reply || req.locals.reply,
      t: req.body.topic || req.locals.topic,
      l: req.body.like || req.locals.like,
      cp: req.body.create_poll || req.locals.create_poll,
      ap: req.body.answer_poll || req.locals.answer_poll
    };

    // update db

    await Reward.updateRewards(rewardObj);

    // update locals

    req.locals.reply = rewardObj.r;
    req.locals.topic = rewardObj.t;
    req.locals.like = rewardObj.l;
    req.locals.create_poll = rewardObj.cp;
    req.locals.answer_poll = rewardObj.ap;

    res.status({ success: true });
  } catch (error) {
    res.status(400);
    next();
  }
};
