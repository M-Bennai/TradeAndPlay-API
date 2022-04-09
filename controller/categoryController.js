const { Category } = require("../models");
const { v4: uuidv4 } = require("uuid");

const CategoryController = {
  addRoadmap: async (category, articleId) => {
    const newCategory = await Category.create({
      id: uuidv4(),
      category,
      articleId,
    });
    return newCategory;
  },
};
module.exports = CategoryController;
