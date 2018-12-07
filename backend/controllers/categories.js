const randomColor = require("randomcolor");
const moment = require("moment");
const Joi = require("joi");
const Category = require("../queries/categories");
const {
  categorySchema,
  categoryUpdateSchema
} = require("../helpers/validation");
const { generateId } = require("../helpers/auth");
const { getCategory } = require("../helpers/topic");
const slugify = require("slugify");

// const emitter = require("../events/test");

exports.getAllCategories = async (req, res, next) => {
  try {
    const options = {
      req,
      page: req.query.page,
      limit: req.query.limit
    };
    // get all the categories
    const categories = await Category.findAllCategoriesPaginated(options);

    if (categories.data === undefined) {
      res.status(404);
      return next();
    }

    // create category object
    const categoryObj = categories.data.map(c => {
      return {
        title: c.title,
        slug: c.slug,
        description: c.description,
        icon_color: c.icon_color,
        created: moment(c.created_at).fromNow()
      };
    });

    res.json({
      categories: categoryObj,
      meta: {
        limit: categories.limit,
        count: categories.count,
        pageCount: categories.pageCount,
        currentPage: categories.currentPage
      }
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.getAllCategoryTopics = async (req, res, next) => {
  try {
    // pagination options
    const options = { req, page: req.query.page, limit: req.query.limit };
    // get all the categories
    const categories = await Category.findAllCategoryTopics(
      req.params.category,
      options
    );

    const categoryName = await getCategory(req.params.category);

    if (categories.data === undefined) {
      res.status(404);
      return next();
    }

    // create category object
    const categoryObj = categories.data.map(c => {
      return {
        title: c.title,
        slug: c.slug,
        color: c.topic_color,
        created: c.created_at
      };
    });

    res.json({
      category: categoryName[0],
      topics: categoryObj,
      meta: {
        limit: categories.limit,
        count: categories.count,
        pageCount: categories.pageCount,
        currentPage: categories.currentPage
      }
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.createNewCategory = async (req, res, next) => {
  try {
    // validate input
    const errors = Joi.validate(req.body, categorySchema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    const categoryObj = {
      title: req.body.title.toUpperCase(),
      slug: slugify(req.body.title),
      description: req.body.description,
      icon_color: randomColor()
    };

    await Category.insert(categoryObj);

    res.json({ success: true, category: categoryObj.title });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.removeCategory = async (req, res, next) => {
  try {
    // get all the categories
    await Category.delete(req.params.id);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.editCategory = async (req, res, next) => {
  try {
    // validate input
    const errors = Joi.validate(req.body, categoryUpdateSchema);

    if (errors.error) {
      res.status(400);
      return next({
        error: errors.error.name.toUpperCase(),
        message: errors.error.details[0].message
      });
    }

    const categoryObj = {
      title: req.body.title.toUpperCase(),
      slug: slugify(req.body.title),
      description: req.body.description
    };

    await Category.update(req.params.id, categoryObj);

    res.json({ success: true, category: categoryObj.title });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
