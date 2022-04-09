const articleRouter = require("express").Router();
const jsonwebtoken = require("jsonwebtoken");

articleRouter.post(
  "/create",
  /*validateToken*/ async (req, res) => {
    console.log("req.body :>> ", req.body);
    try {
      const { roadmapLink, entityId } = req.body;
      const newRoadmap = await addRoadmap(roadmapLink, entityId);
      res.status(200).json({ msg: "success", newRoadmap });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(400).json({ msg: "an error was occured" });
    }
  }
);
module.exports = articleRouter;
