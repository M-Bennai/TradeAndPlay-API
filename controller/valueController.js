const { Value } = require("../models");
const { Article } = require("../models");
const { v4: uuidv4 } = require("uuid");

const ValueController = {
  addValue: async ({ name, price }) => {
    const newValue = await Value.create({
      id: uuidv4(),
      name,
      price,
    });
    return newValue;
  },

  getAllValues: async () => {
    const allValues = await Value.findAll();
    return allValues;
  },
  getOneValue: async (id) => {
    const value = await Value.findOne({
      where: { id: id },
      include: [{ model: Article, as: "article" }],
    });
    return value;
  },
};

module.exports = ValueController;
