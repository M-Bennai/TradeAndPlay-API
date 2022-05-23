const { Category } = require("../models");
const { v4: uuidv4 } = require("uuid");

const CategoryController = {
  addCategory: async ({ name }) => {
    const newCategory = await Category.create({
      id: uuidv4(),
      name,
    });
    return newCategory;
  },

  getAllCategories: async () => {
    const allCategories = await Category.findAll();
    return allCategories;
  },
};
module.exports = CategoryController;
