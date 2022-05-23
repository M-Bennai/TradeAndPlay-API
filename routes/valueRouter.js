const {
  addValue,
  getAllValues,
  getOneValue,
} = require("../controller/valueController");
const valueRouter = require("express").Router();
const { Value } = require("../models");
const jsonwebtoken = require("jsonwebtoken");

valueRouter.post(
  "/create",
  /*validateToken,*/ async (req, res) => {
    console.log("req.body :>> ", req.body);
    const { name, price } = req.body;
    try {
      const newValue = await addValue({ name, price });
      res.status(200).json({ msg: "success", newValue });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(400).json({ msg: "an error was occured" });
    }
  }
);

valueRouter.get("/all", async (req, res) => {
  try {
    const allValues = await getAllValues();
    res.status(200).json({ msg: "success", allValues });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ msg: "an error was occured", error });
  }
});

valueRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneValue = await getOneValue(id);
    res.status(200).json({ msg: "success", oneValue });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ msg: "an error was occured", error });
  }
});

module.exports = valueRouter;
