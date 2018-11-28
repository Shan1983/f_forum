const Sub = require("../queries/subscription");
const Topic = require("../queries/topics");
const moment = require("moment");

exports.getUserSubs = async (req, res, next) => {
  try {
    const userSub = await Sub.findByid(req.params.user);

    if (userSub.rows.length <= 0) {
      res.status(404);
      next();
    }

    const subsObj = userSub.rows.map(async s => {
      const topic = await Topic.findById(s.topic_id);
      return {
        id: s.id,
        title: topic.title,
        muted: s.mute,
        created: moment(s.created_at).fromNow()
      };
    });

    res.json(subsObj);
  } catch (error) {
    res.status(400);
    next();
  }
};
exports.subscribe = async (req, res, next) => {
  try {
    const subObj = {
      topic_id: req.params.topic,
      user_id: req.session.userId
    };

    await Sub.insert(subObj);

    res.josn({ success: true });

    // emit sub event
  } catch (error) {
    res.status(400);
    next();
  }
};
exports.muteSubs = async (req, res, next) => {
  try {
    const sub = await Sub.findById(req.params.id);

    sub.mute = req.body.mute;

    await Sub.update(sub.id, sub);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next();
  }
};

exports.isUserSub = async (req, res, next) => {
  try {
    const sub = await Sub.findUserSub(req.session.userId, req.params.topic);

    if (sub.rows > 0) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  } catch (error) {
    res.status(400);
    next();
  }
};
