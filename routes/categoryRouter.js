const { addCategory } = require("../controller/categoryController");
const categoryRouter = require("express").Router();
const { Category } = require("../models");
const jsonwebtoken = require("jsonwebtoken");

categoryRouter.post(
  "/create",
  /*validateToken,*/ async (req, res) => {
    console.log("req.body :>> ", req.body);
    try {
      const { category, articleId } = req.body;
      const newCategory = await addCategory(category, articleId);
      res.status(200).json({ msg: "success", newCategory });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(400).json({ msg: "an error was occured" });
    }
  }
);

module.exports = categoryRouter;
