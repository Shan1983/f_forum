const Joi = require("joi");
const moment = require("moment");
const db = require("../db");
const { paginator, softDelete } = require("./index");

const schema = Joi.object().keys({});

module.exports = {
  async findById(id, options) {
    const query = await db.raw(
      `SELECT * 
        FROM poll_questions
        LEFT JOIN poll_answers ON poll_answers.poll_question_id = poll_questions.id
        LEFT JOIN poll_votes ON poll_votes.poll_question_id = poll_questions.id
        WHERE poll_questions.id = ?
        AND
        poll_questions.deleted = false`,
      [id]
    );

    return query;
  },

  async getAll(id, options) {
    const count = await db.raw(
      `SELECT COUNT ('id) FROM poll_questions WHERE id = ? AND deleted = false`,
      [id]
    );
    const query = await db.raw(
      `SELECT *
          FROM poll_questions
        LEFT JOIN poll_answers ON poll_answers.poll_question_id = poll_questions.id
        LEFT JOIN poll_votes ON poll_votes.poll_question_id = poll_questions.id`,
      []
    );

    const paginate = {
      req: options.req,
      count: count.rows[0].count,
      query: query.rows,
      page: options.page || 1,
      limit: options.limit || 15
    };
    return paginator(paginate);
  },

  async createPoll(poll) {
    const query = await db.raw(
      `INSERT INTO poll_questions (question, user_id, active, duration) VALUES (?,?,?,?)`,
      [poll.question, poll.user_id, poll.active, poll.duration]
    );

    return query;
  },

  async createPollResponses(poll) {
    const query = await db.raw(
      `INSERT INTO poll_answers (response, poll_question_id) VALUES (?,?)`,
      [poll.response, poll.poll_question_id]
    );

    return query;
  },

  async createVote(poll) {
    const query = await db.raw(
      `INSERT INTO poll_votes (user_id, poll_question_id, poll_response_id) VALUES (?,?,?)`,
      [poll.user_id, poll.poll_question_id, poll.poll_response_id]
    );

    return query;
  },

  async updateQuestion(id, question) {
    const query = await db.raw(
      `UPDATE poll_questions SET question = ? WHERE id = ?`,
      [question, id]
    );

    return query;
  },

  async updateResponse(id, response) {
    const query = await db.raw(
      `UPDATE poll_answers SET response = ? WHERE poll_question_id = ?`,
      [response, id]
    );

    return query;
  },

  async delete(id) {
    return softDelete("poll_questions", id);
  }
};
