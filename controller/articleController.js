const { Article } = require("../models");
const { v4: uuidv4 } = require("uuid");

const articleController = {
  addArticle: async ({
    title,
    ageRange,
    condition,
    image,
    price,
    description,
    userId,
  }) => {
    const newArticle = await Article.create({
      id: uuidv4(),
      title,
      ageRange,
      condition,
      image,
      price,
      description,
      userId,
    });
    return newArticle;
  },

  getAllUserArticle: async (id) => {
    const allArticle = await Article.findAll({
      where: { userId: id.id },
      order: [["createdAt", "ASC"]],
      include: [{ model: User, as: "user" }],
    });
    return allArticle;
  },

  deleteArticle: async (id) => {
    const article = await Article.findByPk(id);
    if (article)
      await Article.destroy({
        where: { id: id },
      });
  },
  getOneArticle: async (id) => {
    const article = await Article.findByPk(id);
    return article;
  },
  getAllArticle: async () => {
    const article = await Article.findAll();
    return article;
  },
};

module.exports = articleController;
