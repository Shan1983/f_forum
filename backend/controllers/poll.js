const Joi = require("joi");
const moment = require("moment");
const Poll = require("../queries/poll");
const User = require("../queries/users");

const schema = Joi.object().keys({
  topic_id: Joi.number().integer(),
  question: Joi.string(),
  user_id: Joi.number().integer(),
  active: Joi.boolean(),
  duration: Joi.date().timestamp(),
  response: Joi.string(),
  poll_question_id: Joi.number().integer(),
  poll_response_id: Joi.number().integer()
});

exports.getPoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.poll);

    if (poll.rows.length <= 0) {
      res.status(404);
      next();
    }

    res.json(poll);
  } catch (error) {
    res.status(400);
    next();
  }
};
exports.getAllPolls = async (req, res, next) => {
  try {
    const options = {
      req,
      page: req.query.page,
      limit: req.query.limit
    };
    const poll = await Poll.getAll(options);

    if (poll.data === undefined) {
      res.status(404);
      return next();
    }

    const pollObj = poll.data.map(p => {
      return {
        color: p.topic_color,
        title: p.title,
        slug: p.slug,
        status: p.lock,
        created: moment(p.created_at).fromNow()
      };
    });

    res.json({
      poll: pollObj,
      meta: {
        limit: poll.limit,
        count: poll.count,
        pageCount: poll.pageCount,
        currentPage: poll.currentPage
      }
    });
  } catch (error) {
    res.status(400);
    next();
  }
};
exports.getPollResults = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.poll);

    if (poll.rows.length <= 0) {
      res.status(404);
      next();
    }

    const count = poll.rows.reduce((sum, row) => {
      sum[row.poll_answers] = (sum[row.poll_answers] || 0) + 1;
      return sum;
    }, {});

    //this needs fixing during testing!!!

    res.json({ pollCount: count });
  } catch (error) {
    res.status(400);
    next();
  }
};
exports.createNewPoll = async (req, res, next) => {
  try {
    const errors = Joi.validate(req.body, schema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    const pollCreateObj = {
      topic_id: req.params.topic,
      question: req.body.question,
      user_id: req.session.userId,
      active: true,
      duration: moment(new Date.now()).add(req.body.duration || 7, "days")
    };

    const created = await Poll.createPoll(pollCreateObj);

    // response validation
    if (req.body.responses.length < 2) {
      res.status(400);
      next({
        error: "POLLERROR",
        message: `Poll's require more than 2 responses.`
      });
    } else if (req.body.responses.length !== new Set(req.body.responses).size) {
      res.status(400);
      next({
        error: "POLLERROR",
        message: `Poll's can not contain duplicate responses.`
      });
    }

    await Promise.all(
      req.body.responses.map(r =>
        Poll.createPollResponses({
          response: r,
          poll_question_id: created.id
        })
      )
    );

    User.addToPoints(req.session.userId, req.locals.create_poll);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next();
  }
};

exports.voteOnPoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.poll);

    if (poll.rows.length <= 0) {
      res.status(404);
      next();
    }

    if (poll.rows.userId === req.session.userId) {
      res.status(403);
      next({ error: "VOTEERROR", message: `You can only vote once.` });
    }

    const voteObj = {
      user_id: req.session.userId,
      poll_question_id: poll.id,
      poll_response_id: req.params.response
    };

    await Poll.createVote(voteObj);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next();
  }
};

exports.editPoll = async (req, res, next) => {
  try {
    const errors = Joi.validate(req.body, schema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }
    await Poll.updateQuestion(req.params.poll, req.body.question);

    await Promise.all(
      req.body.responses.map(r => Poll.updateResponse(r, req.params.poll))
    );

    // this soooo needs testing!!!
    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next();
  }
};
exports.removePoll = async (req, res, next) => {
  try {
    await Poll.delete(req.params.poll);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next();
  }
};
