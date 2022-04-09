const userRouter = require("express").Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

userRouter.post("/register", async (req, res) => {
  const {
    email,
    password,
    role,
    firstName,
    lastName,
    nickname,
    image,
    address,
    phone,
  } = req.body;
  console.log("req.body :>> ", req.body);
  try {
    const findUser = await User.findOne({ where: { email: email } });
    if (!findUser) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      console.log("encryptedPassword :>> ", encryptedPassword);
      const newUser = await addUser({
        email,
        password: encryptedPassword,
        role,
        firstName,
        lastName,
        nickname,
      });
      console.log("newUser :>> ", newUser);
      res.status(201).json({ msg: "User added succesfully", newUser });
    } else {
      res.status(400).json({ msg: "User already exit" });
    }
    console.log("req.body :>> ", req.body);
  } catch (error) {
    console.log("error :>> ", error);
    res.status(401).json({ message: "can't register" });
  }
});

module.exports = userRouter;
