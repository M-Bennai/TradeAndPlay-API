const { Storage } = require("@google-cloud/storage");
const { format } = require("util");
const articleRouter = require("express").Router();
const jsonwebtoken = require("jsonwebtoken");
const { Article } = require("../models");
const { Op } = require("sequelize");
// const path = require("path");
// const multer = require("multer");
const validateToken = require("../middleware/authMiddleware");
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

const {
  addArticle,
  getAllArticle,
  getAllUserArticle,
  getAllArticleByValue,
  deleteArticle,
  searchArticle,
  getOneArticle,
} = require("../controller/articleController");

articleRouter.post("/create", async (req, res) => {
  try {
    await processFileMiddleware(req, res);
    const {
      file,
      body: {
        title,
        condition,
        description,
        userId,
        categoryId,
        valueId,
        //ageRangeId,
      },
    } = req;
    console.log("file :>> ", file);
    console.log("body :>> ", req.body);
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

        const addNewArticle = await addArticle({
          title,
          condition,
          description,
          image: publicUrl,
          userId,
          categoryId,
          valueId,
          // ageRangeId,
        });
        console.log("addNewArticle :>> ", addNewArticle);
        resolve(addNewArticle);
      });
      blobStream.end(req.file.buffer);
    });
    newFile.then((res) => {
      console.log("res :>> ", res);
    });

    res.status(201).json("Article create success");
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json("An error was occured");
  }
});

// articleRouter.post(
//   "/create",
//   /*validateToken*/ upload.single("image"),
//   async (req, res) => {
//     console.log("req.body :>> ", req.body);

//     console.log("req.files :>> ", req.file);
//     const {
//       title,
//       ageRange,
//       condition,
//       description,
//       userId,
//       image,
//       categoryId,
//       valueId,
//       ageRangeId,
//     } = req.body;
//     try {
//       const newArticle = await addArticle({
//         title,
//         ageRange,
//         condition,
//         image: req.file.path,
//         description,
//         userId,
//         categoryId,
//         valueId,
//         ageRangeId,
//       });
//       res.status(200).json({ msg: "new article created", newArticle });
//     } catch (error) {
//       console.log("error :>> ", error);
//       res.status(400).json({ msg: "an error was occured" });
//     }
//   }
// );

articleRouter.get("/all", async (req, res) => {
  try {
    const allArticle = await getAllArticle();
    res.status(200).json({ msg: "succes", allArticle });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ msg: "an error was occured", error });
  }
});

articleRouter.get("/oneArticle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneArticle = await getOneArticle(id);
    res.status(200).json({ msg: "success", oneArticle });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ msg: "an error was occured", error });
  }
});

articleRouter.get("/all/:id", async (req, res) => {
  const { id } = req.params;
  console.log("userId je suis dans le routeur:>> ", id);
  try {
    const allArticleByUser = await getAllUserArticle({ id });
    res.status(200).json({ msg: "success", allArticleByUser });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ msg: "error" });
  }
});

articleRouter.get("/value/:id", async (req, res) => {
  const { id } = req.params;
  console.log("valueId je suis dans le routeur:>> ", id);
  try {
    const allArticleByValue = await getAllArticleByValue({ id });
    res.status(200).json({ msg: "success", allArticleByValue });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ msg: "error" });
  }
});

articleRouter.delete("/delete/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    // const { id } = req.query;
    console.log("req.query :>> ", req.query);
    await deleteArticle(id);
    res.status(200).json("article deleted");
  } catch (error) {
    res.status(400).json("cannot delete user");
  }
});

// articleRouter.get("/search", async (req, res) => {
//   const title = req.params;
//   console.log("article :>> ", title);
//   try {
//     const search = await searchArticle({ title });
//     res.status(200).json({ msg: "article found", search });
//   } catch (error) {
//     res.status(400).json("no result for this search");
//   }
// });

articleRouter.get("/search", (req, res) => {
  if (req.query.title) {
    const title = req.query.title;
    return Article.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        },
      },
    })
      .then((article) => {
        const message = `Il y a ${article.length} qui correspondent a votre recherche ${title}`;
        res.json({ message, data: article });
      })
      .catch((error) => {
        const message = `La liste des articles n'a pas pu être récupérée. Reessayez dans quelques instants`;
        res.status(500).json({ message, data: error });
      });
  }
});
module.exports = articleRouter;
