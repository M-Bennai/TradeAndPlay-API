const express = require("express");
const router = express.Router();

router.use("/user", require("./userRouter"));
router.use("/article", require("./articleRouter"));
router.use("/category", require("./categoryRouter"));
router.use("/value", require("./valueRouter"));

module.exports = router;
