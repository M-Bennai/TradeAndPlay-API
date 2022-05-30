const { addAgeRange } = require("../controller/ageRangeController");
const ageRangeRouter = require("express").Router();
const { AgeRange } = require("../models");
const jsonwebtoken = require("jsonwebtoken");

ageRangeRouter.post(
  "/create",
  /*validateToken,*/ async (req, res) => {
    console.log("req.body :>> ", req.body);
    const { range } = req.body;
    try {
      const addNewAgeRange = await addAgeRange({ range });
      res.status(200).json({ msg: "success", addNewAgeRange });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(400).json({ msg: "an error was occured" });
    }
  }
);

ageRangeRouter.get("/all", async (req, res) => {
  const allAgeRange = await AgeRange.findAll();
  res.status(200).json(allAgeRange);
});

module.exports = ageRangeRouter;
