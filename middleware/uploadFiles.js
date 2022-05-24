const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;

let processFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSize },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(jpeg|jpg|png|gif)$/)) {
      return cb(
        new Error(
          "only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls, pptx, ppt format."
        )
      );
    }
    cb(undefined, true); // continue with upload
  },
}).single("image");

let processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;
