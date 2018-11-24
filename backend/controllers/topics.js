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
    // create option Obj for pagination
    const options = {
      req,
      page: req.query.page,
      limit: req.query.limit
    };
    const topics = await Topic.findAllTopicsPaginated(
      req.params.category,
      options
    );

    // console.log(topics);

    // if (topics.data.length <= 0) {
    //   res.status(400);
    //   return next({
    //     error: "NOTOPICS",
    //     message: `Currently no topics.`
    //   });
    // }

    if (topics.data === undefined) {
      res.status(404);
      return next();
    }

    const topicsObj = topics.data.map(t => {
      return {
        color: t.topic_color,
        title: t.title,
        slug: t.slug,
        status: t.lock,
        created: moment(t.created_at).fromNow()
      };
    });

    res.json({
      topics: topicsObj,
      meta: {
        limit: topics.limit,
        count: topics.count,
        pageCount: topics.pageCount,
        currentPage: topics.currentPage
      }
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.getTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findByIdWithUser(req.params.id);

    if (topic.rows.length <= 0) {
      res.status(404);
      return next({
        error: "NOTFOUND",
        message: "Topic not found."
      });
    }

    const t = topic.rows[0];

    if (t.lock === "closed") {
      res.status(403);
      return next({
        error: "TOPICLOCKED",
        message: "Topic is locked."
      });
    }

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
    // create option Obj for pagination
    const options = {
      req,
      page: req.query.page,
      limit: req.query.limit,
      deleted: true
    };
    const topics = await Topic.findDeletedTopicsPaginated(
      req.params.category,
      options
    );

    // if (topics.length <= 0) {
    //   res.status(404);
    //   return next({
    //     error: "NOTFOUND",
    //     message: "No deleted topics found."
    //   });
    // }

    if (topics.data === undefined) {
      res.status(404);
      return next();
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
    topic.lock_reason = req.body.reason;
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
    if (req.body.sticky_duration !== "forever") {
      topic.sticky_ends = moment(new Date()).add(
        req.body.sticky_duration,
        "days"
      );
    }
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

    const categoryId = await Topic.getCategoryId(req.body.title.toUpperCase());

    topic.category_id = categoryId.id;

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

    const updated = await Topic.update(topic.id, editTopic);

    res.json({ success: true, updated });
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
