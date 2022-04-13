const articleRouter = require("express").Router();
const jsonwebtoken = require("jsonwebtoken");
const { HostNotFoundError } = require("sequelize");
const {
  addArticle,
  getAllArticle,
  getOneArticle,
  getAllUserArticle,
  deleteArticle,
  searchArticle,
} = require("../controller/articleController");

articleRouter.post(
  "/create",
  /*validateToken*/ async (req, res) => {
    console.log("req.body :>> ", req.body);

    const {
      title,
      ageRange,
      condition,
      image,
      price,
      description,
      userId,
    } = req.body;
    try {
      const newArticle = await addArticle({
        title,
        ageRange,
        condition,
        image,
        price,
        description,
        userId,
      });
      res.status(200).json({ msg: "new article created", newArticle });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(400).json({ msg: "an error was occured" });
    }
  }
);

articleRouter.get("/all", async (req, res) => {
  try {
    const allArticle = await getAllArticle();
    res.status(200).json({ msg: "succes", allArticle });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ msg: "an error was occured", error });
  }
});

articleRouter.get("/oneArticle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneArticle = await getOneArticle(id);
    res.status(200).json({ msg: success, oneArticle });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ msg: "an error was occured", error });
  }
});

articleRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteArticle(id);
    res.status(200).json("article deleted");
  } catch (error) {
    res.status(400).json("cannot delete user");
  }
});

articleRouter.get("/search", async (req, res) => {
  try {
    const { article } = req.query;
    await searchArticle();
    res.status(200).json({ msg: "article found", article });
  } catch (error) {
    res.status(400).json("no result for this search");
  }
});
module.exports = articleRouter;
