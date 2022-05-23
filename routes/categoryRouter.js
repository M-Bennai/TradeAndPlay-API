const {
  addCategory,
  getAllCategories,
} = require("../controller/categoryController");
const categoryRouter = require("express").Router();
const { Category } = require("../models");
const jsonwebtoken = require("jsonwebtoken");

categoryRouter.post(
  "/create",
  /*validateToken,*/ async (req, res) => {
    console.log("req.body :>> ", req.body);
    const { name } = req.body;
    try {
      const newCategory = await addCategory({ name });
      res.status(200).json({ msg: "success", newCategory });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(400).json({ msg: "an error was occured" });
    }
  }
);

categoryRouter.get("/all", async (req, res) => {
  const allCategories = await Category.findAll();
  res.status(200).json(allCategories);
});

module.exports = categoryRouter;
