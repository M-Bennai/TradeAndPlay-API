require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const logger = require("morgan");
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:8080",
  "https://trade-and-play-api-production-production-kzubvcgwdq-ez.a.run.app/",
  "https://trade-and-play-front-production-kzubvcgwdq-ez.a.run.app/",
];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(cors(allowedOrigins));
app.use(logger("dev"));
app.get("/", (req, res) => {
  res.send("working");
});

// if (process.env.NODE_DEV === "production") {
//   app.use(express.static("build"));
//   app.get("*", (req, res) => {
//     req.sendFile(path.resolve(__dirname, "build", "index.html"));
//   });
// }

app.use("/api", require("./routes/index"));
console.log("process.env.s :>> ", process.env.GCS_BUCKET);
app.listen(port, () => {
  console.log(`listenning on port ${port}`);
});

module.exports = app;
