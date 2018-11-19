const randomColor = require("randomcolor");
const uuidv4 = require("uuid/v4");
const Joi = require("joi");
const Category = require("../queries/categories");
const {
  categorySchema,
  categoryUpdateSchema
} = require("../helpers/validation");
const { generateId } = require("../helpers/auth");
const slugify = require("slugify");

exports.getAllCategories = async (req, res, next) => {
  try {
    // get all the categories
    const categories = await Category.findAllCategories();

    if (categories === undefined) {
      res.status(400);
      return next({
        error: "CATEGORYERROR",
        message: "The category does not exist."
      });
    }

    // create category object
    const categoryObj = {
      title: categories.title,
      slug: categories.slug,
      description: categories.description,
      icon_color: categories.icon_color,
      created: categories.created_at
    };
    res.json(categoryObj);
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.getAllCategoryTopics = async (req, res, next) => {
  try {
    // get all the categories
    const categories = await Category.findAllCategories();

    if (categories === undefined) {
      res.status(400);
      return next({
        error: "CATEGORYERROR",
        message: "The category does not exist."
      });
    }

    // create category object
    const categoryObj = {
      title: categories.title,
      slug: categories.slug,
      description: categories.description,
      icon_color: categories.icon_color,
      created: categories.created_at,
      topics: []
    };
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
