const { Article } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../models");
const { Value } = require("../models");

const articleController = {
  addArticle: async ({
    title,
    condition,
    description,
    image,
    userId,
    valueId,
    ageRangeId,
    categoryId,
  }) => {
    console.log("image from fromcontroller :>> ", image);
    console.log("title :>> ", title);
    const newArticle = await Article.create({
      id: uuidv4(),
      title,
      condition,
      image,
      description,
      userId,
      categoryId,
      valueId,
      ageRangeId,
    });
    console.log("newArticle :>> ", newArticle);
    return newArticle;
  },

  getAllUserArticle: async (id) => {
    console.log("id dans le controller :>> ", id);
    const allUserArticle = await Article.findAll({
      where: { userId: id.id },
      order: [["createdAt", "ASC"]],
      include: [{ model: User, as: "user" }],
    });
    return allUserArticle;
  },

  getAllArticleByValue: async (id) => {
    console.log("id dans le controller :>> ", id);
    const allArticleByValue = await Article.findAll({
      where: { valueId: id.id },
      order: [["createdAt", "ASC"]],
      include: [{ model: Value, as: "value" }],
    });
    return allArticleByValue;
  },

  deleteArticle: async (id) => {
    const article = await Article.findByPk(id);
    if (article)
      await Article.destroy({
        where: { id: id },
      });
  },

  getAllArticle: async () => {
    const article = await Article.findAll();
    return article;
  },
  getOneArticle: async (id) => {
    const article = await Article.findOne({
      where: { id: id },
      include: [{ model: User, as: "user" }],
    });
    return article;
  },
  // getOneArticle: async (id) => {
  //   const article = await Article.findByPk(id);
  //   if (article === null) {
  //     console.log("Not found!");
  //   } else {
  //     return article; // true
  //     // Its primary key is 123
  //   }
  // },
  // searchArticle: async () => {
  //   // if (req.query.title) {
  //   const searchTitle = await Article.findAll({
  //     where: {
  //       title: {
  //         [Op.like]: `%${title}`,
  //       },
  //     },
  //   });

  //   return searchTitle;
  // },
};
module.exports = articleController;
