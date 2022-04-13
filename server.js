require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");

const allowedOrigins = ["http://localhost:4000"];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(allowedOrigins));

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
  `listenning on port ${port}`;
});

module.exports = app;
