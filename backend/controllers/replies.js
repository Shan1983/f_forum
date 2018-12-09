const Joi = require("joi");
const Reply = require("../queries/reply");
const User = require("../queries/users");
const { replySchema } = require("../helpers/validation");
const { generateId } = require("../helpers/auth");
const moment = require("moment");
const rewards = require("../helpers/rewards");

exports.getReplies = async (req, res, next) => {
  try {
    const options = { req, page: req.query.page, limit: req.query.limit };
    const replies = await Reply.findByAllWithUserAndPagination(
      req.params.topic,
      options
    );

    // const r = replies.rows;

    // if (r.length <= 0) {
    //   res.status(404);
    //   return next({
    //     error: "NOTFOUND",
    //     message: "Replies not found."
    //   });
    // }

    if (replies.data === undefined) {
      res.status(404);
      return next();
    }

    const repliesObj = replies.data.map(r => {
      return {
        id: r.id,
        reply: r.reply,
        created: moment(r.created_at).fromNow(),
        user: {
          color: r.color_icon,
          name: r.username,
          pcount: r.post_count,
          points: r.points,
          avatar: r.avatar,
          role: r.title
        }
      };
    });

    res.json({
      replies: repliesObj,
      meta: {
        limit: replies.limit,
        count: replies.count,
        pageCount: replies.pageCount,
        currentPage: replies.currentPage
      }
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.postreply = async (req, res, next) => {
  try {
    const errors = Joi.validate(req.body, replySchema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    const replyObj = {
      topic_id: req.params.topic,
      user_id: req.session.userId,
      reply: req.body.reply
    };

    await Reply.insert(replyObj);

    await User.addToPostCount(replyObj.user_id);
    await User.addToPoints(replyObj.user_id, rewards.reply_reward);

    // emit sub email event

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.editreply = async (req, res, next) => {
  try {
    const reply = await Reply.findById(req.params.id);

    if (reply === undefined) {
      res.status(404);
      return next({
        error: "NOTFOUND",
        message: "Reply not found."
      });
    }

    const errors = Joi.validate(req.body, replySchema);

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

    if (reply === undefined) {
      res.status(404);
      return next({ error: "NOTFOUND", message: "Reply not found." });
    }

    await Reply.delete(reply.id);

    await User.removeFromPoints(reply.user_id, rewards.reply_reward);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
