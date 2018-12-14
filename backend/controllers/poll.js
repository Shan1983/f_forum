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
      return next();
    }

    const responses = poll.rows.map(async p => {
      const votes = await Poll.getVoteCount(p.ans_id);
      return { id: p.ans_id, answer: p.response, votes: votes.rows[0].count };
    });

    const votes = await Promise.all(responses);

    const pollObj = {
      poll_id: poll.rows[0].id,
      poll_question: poll.rows[0].question,
      started_by: poll.rows[0].username,
      poll_active: poll.rows[0].active,
      poll_duration: poll.rows[0].duration,
      poll_answers: votes
    };

    res.json(pollObj);
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

    const responses = poll.data.map(p => {
      return { id: p.ans_id, answer: p.response };
    });

    const pollObj = {
      poll_id: poll.data[0].id,
      poll_question: poll.data[0].question,
      started_by: poll.data[0].username,
      poll_active: poll.data[0].active,
      poll_duration: poll.data[0].duration,
      poll_answers: responses,
      path: `/api/v1/topic/${poll.data[0].topic_id}`
    };

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

    const responses = poll.rows.map(async p => {
      const votes = await Poll.getVoteCount(p.ans_id);
      return { id: p.ans_id, answer: p.response, votes: votes.rows[0].count };
    });

    const votes = await Promise.all(responses);

    const winner = votes.reduce((prev, current) => {
      return prev.votes > current.votes ? prev : current;
    });

    const pollObj = {
      poll_id: poll.rows[0].id,
      poll_question: poll.rows[0].question,
      started_by: poll.rows[0].username,
      poll_active: poll.rows[0].active,
      poll_duration: poll.rows[0].duration,
      winning_answer: winner,
      all_answers: votes
    };

    res.json({ poll: pollObj });
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
