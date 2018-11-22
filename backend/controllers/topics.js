const randomColor = require("randomcolor");
const Joi = require("joi");
const Topic = require("../queries/topics");
const User = require("../queries/users");
const {
  topicSchema,
  topicUpdateSchema,
  topicCategorySchema
} = require("../helpers/validation");
const { generateId } = require("../helpers/auth");
const slugify = require("slugify");
const moment = require("moment");

exports.allCategoryTopics = async (req, res, next) => {
  try {
    const topics = await Topic.findAllTopics(req.params.category);

    if (topics.rows.length <= 0) {
      res.status(400);
      return next({
        error: "NOTOPICS",
        message: `Currently no topics.`
      });
    }

    const topicsObj = topics.rows.map(t => {
      return {
        color: t.topic_color,
        title: t.title,
        slug: t.slug,
        status: t.lock,
        created: moment(t.created_at).fromNow()
      };
    });

    res.json(topicsObj);
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.getTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findByIdWithUser(req.params.id);

    console.log(topic);

    if (topic.rows.length <= 0) {
      res.status(404);
      return next({
        error: "NOTFOUND",
        message: "Topic not found."
      });
    }

    const t = topic.rows[0];

    const topicObj = {
      topic_color: t.topic_color,
      title: t.topic_title,
      discussion: t.discussion,
      created: moment(t.created_at).fromNow(),
      user: {
        color: t.color_icon,
        name: t.username,
        pcount: t.post_count,
        points: t.points,
        avatar: t.avatar,
        role: {
          title: t.title
        }
      }
    };

    res.json(topicObj);
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.getDeletedTopics = async (req, res, next) => {
  try {
    const topics = await Topic.findDeletedTopics();

    if (topics === undefined) {
      res.status(404);
      return next({
        error: "NOTFOUND",
        message: "No deleted topics found."
      });
    }

    res.json(topics);
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.createNewTopic = async (req, res, next) => {
  try {
    const newTopic = {
      id: generateId(),
      topic_color: req.body.color || randomColor(),
      category_id: req.params.category,
      title: req.body.title,
      slug: slugify(req.body.title),
      user_id: req.session.userId,
      discussion: req.body.discussion
    };

    const topic = await Topic.insert(newTopic);

    await User.addToPostCount(newTopic.user_id);
    await User.addToPoints(newTopic.user_id, 50);

    res.json(topic);
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.lockTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topic);

    if (topic === undefined) {
      res.status(404);
      return next({
        error: "NOTFOUND",
        message: "No topic found"
      });
    }

    // update the topics lock status
    topic.lock = "closed";
    await Topic.update(topic.id, topic);

    res.json({ success: true, topic });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.makeTopicSticky = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topic);

    if (topic === undefined) {
      res.status(404);
      return next({ error: "NOTFOUND", message: "No topic found" });
    }

    // update the topics sticky status
    topic.sticky = true;
    await Topic.update(topic.id, topic);

    res.json({ success: true, topic });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.moveTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topic);

    if (topic === undefined) {
      res.status(404);
      return next({ error: "NOTFOUND", message: "No topic found" });
    }

    const errors = Joi.validate(topicCategorySchema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    const categoryId = await Topic.getCategoryId(req.body.title);

    topic.category_id = categoryId;

    await Topic.update(topic.id, topic);

    res.json({ success: true, topic });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.editTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topic);

    if (topic === undefined) {
      res.status(404);
      return next({ error: "NOTFOUND", message: "No topic found" });
    }

    if (topic.user_id !== req.session.userId) {
      res.status(401);
      next({
        error: "NOTAUTHORIZED",
        message: "You are not authorized to continue."
      });
    }

    const errors = Joi.validate(topicUpdateSchema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    const editTopic = {
      topic_color: req.body.color || randomColor(),
      title: req.body.title,
      slug: slugify(req.body.title),
      discussion: req.body.discussion
    };

    await Topic.update(topic.id, editTopic);

    res.json({ success: true, topic });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.changeTopicColor = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topic);

    if (topic === undefined) {
      res.status(404);
      return next({ error: "NOTFOUND", message: "No topic found" });
    }

    if (topic.user_id !== req.session.userId) {
      res.status(401);
      return next({
        error: "NOTAUTHORIZED",
        message: "You are not authorized to continue."
      });
    }

    const currentColor = topic.topic_color;
    topic.topic_color = req.body.changeColor || currentColor;

    await Topic.update(topic.id, topic);

    res.json({ success: true, topic });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topic);
    await Topic.delete(topic.id);

    await User.removeFromPoints(topic.user_id, 50);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
