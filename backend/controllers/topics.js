const randomColor = require("randomcolor");
const Joi = require("joi");
const Topic = require("../queries/topics");
const User = require("../queries/users");
const {
  topicSchema,
  topicUpdateSchema,
  topicCategorySchema
} = require("../helpers/validation");
const slugify = require("slugify");
const moment = require("moment");
const { getCategory, getUser } = require("../helpers/topic");
const { getRoleFromId } = require("../helpers/roles");
const rewards = require("../helpers/rewards");

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

    const categoryTitle = await getCategory(req.params.category);

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
      category: categoryTitle,
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
      return next();
    }

    const topicDetails = topic.rows[0];

    if (topicDetails.lock === "closed") {
      res.status(403);
      return next({
        error: "TOPICLOCKED",
        message: topicDetails.lock_reason || "Topic is locked."
      });
    }

    const topicObj = {
      topic_color: topicDetails.topic_color,
      title: topicDetails.topic_title,
      discussion: topicDetails.discussion,
      created: moment(topicDetails.created_at).fromNow(),
      user: {
        color: topicDetails.color_icon,
        name: topicDetails.username,
        pcount: topicDetails.post_count,
        points: topicDetails.points,
        avatar: topicDetails.avatar,
        role: topicDetails.title
      }
    };

    res.json({ topic: topicObj });
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

    const deletedObj = topics.data.map(async d => {
      let category = await getCategory(d.category_id);
      return {
        color: d.topic_color,
        category: category[0],
        title: d.title,
        slug: d.slug,
        user: await getUser(d.user_id)
      };
    });

    const response = await Promise.all(deletedObj);

    if (response === undefined) {
      res.status(500);
      return next({
        error: "UNKNOWN",
        message: "Oops, something bad happened, try again."
      });
    }

    res.json({
      deletedTopics: response,
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
exports.createNewTopic = async (req, res, next) => {
  try {
    const errors = Joi.validate(req.body, topicSchema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    const newTopic = {
      topic_color: req.body.color || randomColor(),
      category_id: req.params.category,
      title: req.body.title,
      slug: slugify(req.body.title),
      user_id: req.session.userId,
      discussion: req.body.discussion
    };

    const topic = await Topic.insert(newTopic);

    await User.addToPostCount(newTopic.user_id);
    await User.addToPoints(newTopic.user_id, rewards.topic_reward);

    // get the user data
    const userData = await getUser(req.session.userId);
    const topicObj = {
      id: topic.id,
      color: topic.topic_color,
      title: topic.title,
      sticky: topic.sticky,
      status: topic.lock,
      reason: topic.lock_reason || "N/A",
      created: moment(topic.created_at).fromNow(),
      discussion: topic.discussion,
      user: {
        username: userData.username,
        pcount: userData.post_count,
        points: userData.points,
        role: await getRoleFromId(userData.role_id),
        avatar: userData.avatar
      }
    };

    res.json({ topic: topicObj });
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
    topic.lock_reason = req.body.reason || "This topic has been locked.";
    await Topic.update(topic.id, topic);

    res.json({ success: true });
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
      topic.sticky_ends = moment(Date.now()).add(
        req.body.sticky_duration || 7,
        "days"
      );
    }
    await Topic.update(topic.id, topic);

    res.json({ success: true });
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

    const errors = Joi.validate(req.body, topicCategorySchema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    const categoryId = await Topic.getCategoryId(req.body.title);

    topic.category_id = categoryId.id;

    await Topic.update(topic.id, topic);

    res.json({ success: true });
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

    const errors = Joi.validate(req.body, topicUpdateSchema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    if (topic.user_id === req.session.userId || req.session.role === "Owner") {
      const editTopic = {
        topic_color: req.body.color || randomColor(),
        title: req.body.title,
        slug: slugify(req.body.title),
        discussion: req.body.discussion
      };

      await Topic.update(topic.id, editTopic);

      res.json({ success: true });
    } else {
      res.status(401);
      next({
        error: "NOTAUTHORIZED",
        message: "You are not authorized to continue."
      });
    }
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

    if (topic.user_id === req.session.userId || req.session.role === "Owner") {
      const currentColor = topic.topic_color;
      topic.topic_color = req.body.changeColor || currentColor;

      await Topic.update(topic.id, topic);

      res.json({ success: true });
    } else {
      res.status(401);
      return next({
        error: "NOTAUTHORIZED",
        message: "You are not authorized to continue."
      });
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topic);

    if (topic === undefined) {
      res.status(404);
      return next({ error: "NOTFOUND", message: "No topic found" });
    }

    await Topic.delete(topic.id);

    await User.removeFromPoints(topic.user_id, rewards.topic_reward);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
