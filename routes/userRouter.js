const userRouter = require("express").Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const {
  addUser,
  updateUserEmail,
  updateUserName,
  updateUserImage,
  getClientUser,
  deleteUser,
  updateUserPassword,
} = require("../controller/userController");
const validateToken = require("../middleware/authMiddleware");

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
        firstName,
        lastName,
        email,
        password: encryptedPassword,
        role,
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

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    res.status(400).json({ msg: "No user with that email" });
  }
  const matchPassword = await bcrypt.compare(password, user.password);
  //console.log("matchPassword :>> ", matchPassword);
  if (!matchPassword) {
    res.status(400).json({ msg: "Wrong email or password" });
  } else {
    const accessToken = await jsonwebtoken.sign(
      {
        email: user.email,
        role: user.role,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({ msg: "You logged in", token: accessToken, user });
  }
});

userRouter.get("/auth", validateToken, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ msg: "an error was occured" });
  }
});

userRouter.get("/all", async (req, res) => {
  const allUser = await User.findAll();
  res.status(200).json(allUser);
});

userRouter.get("/allClients", async (req, res) => {
  try {
    const allClients = await getClientUser();
    res.status(200).json(allClients);
  } catch (error) {
    console.log("error :>> ", error);
    res.status(200).json("an error was occured");
  }
});

userRouter.get("/getOneClientUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneClient = await getOneConsultantUser(id);
    res.status(200).json({ msg: "success", oneClient });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(200).json("an error was occured");
  }
});

userRouter.put("/update/email/:id", async (req, res) => {
  try {
    const { email } = req.body;
    const { id } = req.params;
    console.log("email :>> ", email);
    console.log("id :>> ", id);
    await updateUserEmail(email, id);
    res.status(200).json("user email was update successfully");
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json("an error was occured");
  }
});

userRouter.put("/update/name/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    console.log("name :>> ", name);
    console.log("id :>> ", id);
    const userUpdate = await updateUserName(id, name);
    res.status(200).json({ msg: "name upload success", userUpdate });
  } catch (error) {
    res.status(400).json("an error was occured");
    console.log("error :>> ", error);
  }
});

userRouter.post("/logout", /* authToken */ (req, res) => {});

userRouter.get("/all", async (req, res) => {
  const allUser = await User.findAll();
  res.status(200).json(allUser);
});

userRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { imageName } = req.body;
    await deleteUser(id, imageName);
    res.status(200).json("delete user success");
  } catch (error) {
    res.status(400).json("cannot delete user");
  }
});
userRouter.put("/update/password/:id", async (req, res) => {
  try {
    const {
      params: { id },
      body: { password },
    } = req;
    const encryptedPassword = await bcrypt.hash(password, 10);
    await updateUserPassword(id, encryptedPassword);
    res.status(200).json("password update success");
  } catch (error) {
    res.status(400).json("cannot update user password");
  }
});

module.exports = userRouter;
