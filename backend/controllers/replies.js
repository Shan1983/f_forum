const Joi = require("joi");
const Reply = require("../queries/reply");
const User = require("../queries/users");
const { replySchema } = require("../helpers/validation");
const { generateId } = require("../helpers/auth");
const moment = require("moment");

exports.getReplies = async (req, res, next) => {
  try {
    const replies = await Reply.findByAllWithUser();

    console.log(replies);

    const r = replies.rows[0];

    if (r.length <= 0) {
      res.status(404);
      return next({
        error: "NOTFOUND",
        message: "Replies not found."
      });
    }

    const repliesObj = {
      id: r.id,
      reply: r.reply,
      created: moment(r.created_at).fromNow(),
      user: {
        color: r.color_icon,
        name: r.username,
        pcount: r.post_count,
        points: r.points,
        avatar: r.avatar,
        role: {
          title: r.title
        }
      }
    };

    res.json(repliesObj);
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.postreply = async (req, res, next) => {
  try {
    const replyObj = {
      id: generateId(),
      topic_id: req.params.topic,
      user_id: req.session.userId,
      reply: re.body.reply
    };

    const reply = await Reply.insert(replyObj);

    await User.addToPostCount(replyObj.user_id);
    await User.addToPoints(replyObj.user_id, 20);

    res.json({ success: true, reply });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.editreply = async (req, res, next) => {
  try {
    const reply = Reply.findById(req.prams.id);

    if (reply === undefined) {
      res.status(404);
      return next({
        error: "NOTFOUND",
        message: "Reply not found."
      });
    }

    const errors = Joi.validate(replySchema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    reply.reply = req.body.reply; // omg 😳

    await Reply.update(reply.id, reply);

    res.json({ success: true, reply });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.removereply = async (req, res, next) => {
  try {
    const reply = await Reply.findById(req.params.id);
    await Reply.delete(reply.id);

    await User.removeFromPoints(reply.user_id, 20);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
