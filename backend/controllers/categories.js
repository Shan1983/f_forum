const randomColor = require("randomcolor");
const moment = require("moment");
const Joi = require("joi");
const Category = require("../queries/categories");
const {
  categorySchema,
  categoryUpdateSchema
} = require("../helpers/validation");
const { generateId } = require("../helpers/auth");
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
    const categories = await Category.findAllCategories(options);

    // if (categories === undefined) {
    //   res.status(400);
    //   return next({
    //     error: "CATEGORYERROR",
    //     message: "The category does not exist."
    //   });
    // }

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
      category: categoryObj,
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
    // get all the categories
    const categories = await Category.findAllCategoryTopics(
      req.params.category
    );

    console.log(categories);
    if (categories === undefined) {
      res.status(400);
      return next({
        error: "CATEGORYERROR",
        message: "The category does not exist."
      });
    }

    // create category object
    const categoryObj = categories.map(c => {
      return {
        title: c.title,
        slug: c.slug,
        description: c.description,
        icon_color: c.icon_color,
        created: c.created_at
      };
    });

    res.json(categoryObj);
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
      id: generateId(),
      title: req.body.title.toUpperCase(),
      slug: slugify(req.body.title),
      description: req.body.description,
      icon_color: randomColor()
    };

    await Category.insert(categoryObj);

    res.json(categoryObj);
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

    res.json(categoryObj);
  } catch (error) {
    res.status(400);
    next(error);
  }
};
