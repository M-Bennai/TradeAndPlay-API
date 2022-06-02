require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const logger = require("morgan");
const cors = require("cors");

const allowedOrigins = ["http://localhost:8080"];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use("/Images", express.static("Images"));
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

app.listen(port, () => {
  console.log(`listenning on port ${port}`);
});

module.exports = app;
