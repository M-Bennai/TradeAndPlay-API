const { ageRange } = require("../models");
const { Article } = require("../models");
const { v4: uuidv4 } = require("uuid");

const AgeRangeController = {
  addAgeRange: async ({ range }) => {
    const newAgeRange = await ageRange.create({
      id: uuidv4(),
      range,
    });
    return newAgeRange;
  },

  getAllAgeRange: async () => {
    const allAgeRange = await ageRange.findAll();
    return allAgeRange;
  },
  getOneAgeRange: async (id) => {
    const OneAgeRange = await ageRange.findOne({
      where: { id: id },
      include: [{ model: Article, as: "article" }],
    });
    return OneAgeRange;
  },
};

module.exports = AgeRangeController;
