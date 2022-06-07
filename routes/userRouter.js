const userRouter = require("express").Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { Storage } = require("@google-cloud/storage");
const { format } = require("util");
// const multer = require("multer");
// const path = require("path");
const processFileMiddleware = require("../middleware/uploadFiles");

const uuid = require("uuid");
const uuidv1 = uuid.v1;

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY,
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET);

const {
  addUser,
  updateUserEmail,
  updateUserName,
  updateUserImage,
  getClientUser,
  deleteUser,
  updateUserPassword,
  getOneClientUser,
} = require("../controller/userController");
const validateToken = require("../middleware/authMiddleware");

// const fileStorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "Images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({
//   storage: fileStorageEngine,
//   limits: { fileSize: "10000000" },
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|gif/;
//     const mimeType = fileTypes.test(file.mimetype);
//     const extname = fileTypes.test(path.extname(file.originalname));

//     if (mimeType & extname) {
//       return cb(null, true);
//     }

//     cb("proper files formate to upload");
//   },
// });

userRouter.post("/register", async (req, res) => {
  try {
    await processFileMiddleware(req, res);
    const {
      file,
      body: {
        email,
        password,
        role,
        firstName,
        lastName,
        nickname,
        address,
        phone,
      },
    } = req;
    console.log("req.body :>> ", req.body);
    console.log("req.files dans le register:>> ", req.file);
    if (file.length === 0) {
      throw new Error("no-file");
    }
    const newFile = new Promise((resolve, reject) => {
      const filename = uuidv1() + "-" + req.file.originalname;
      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });
      blobStream.on("error", (err) => {
        res.status(500).json({ msg: err.message });
        reject({ message: "blob-stream", data: err });
      });
      blobStream.on("finish", async (data) => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        console.log("bucket.name :>> ", bucket.name);
        console.log("publicUrl :>> ", publicUrl);
        await bucket.file(filename).makePublic();

        const findUser = await User.findOne({ where: { email: email } });
        if (!findUser) {
          const encryptedPassword = await bcrypt.hash(password, 10);
          console.log("encryptedPassword :>> ", encryptedPassword);
          const newUser = await addUser({
            firstName,
            lastName,
            email,
            image: publicUrl,
            password: encryptedPassword,
            role,
            nickname,
          });
          console.log("newUser :>> ", newUser);
          resolve(newUser);
        }
      });
      blobStream.end(req.file.buffer);
    });
    newFile.then((res) => {
      console.log("res :>> ", res);
    });
    res.status(201).json({ msg: "User added succesfully" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json("An error was occured");
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(400).json({ msg: "Pas d'utilisateur avec cet email" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      res.status(400).json({ msg: "Mauvais email ou mot de passe" });
    } else {
      const accessToken = await jsonwebtoken.sign(
        {
          email: user.email,
          role: user.role,
          image: user.image,
          firstName: user.firstName,
          lastName: user.lastName,
          id: user.id,
        },

        process.env.JWT_SECRET
      );
      console.log("req.user :>> ", req.user);
      res.status(200).json({ msg: "You logged in", token: accessToken, user });
    }
  } catch (error) {
    console.log("error :>> ", error);

    res.status(400).json({ msg: "An error was occured", error: error });
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

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const oneClient = await getOneClientUser(id);
    res.status(200).json({ msg: "success", oneClient });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(200).json("an error was occured");
  }
});

userRouter.get("/all/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const allUser = await getOneClientUser({ id });
    res.status(200).json({ msg: "success", allUser });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ msg: "error" });
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
