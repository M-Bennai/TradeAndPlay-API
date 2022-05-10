const { Article } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../models");
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
    console.log("id dans le controller :>> ", id);
    const allUserArticle = await Article.findAll({
      where: { userId: id.id },
      order: [["createdAt", "ASC"]],
      include: [{ model: User, as: "user" }],
    });
    return allUserArticle;
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
  searchArticle: async (req, res) => {
    let query = {};
    if (req.query.keyword) {
      query.$or = [{ title: { $regex: req.query.keyword } }];
    }
    let article = await Article.find(query);
    return res
      .status(200)
      .send({ message: "successfully fetched", data: article });
  },
};

module.exports = articleController;
