
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const pathFolder = path.resolve(__dirname, "../data/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pathFolder);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const name = file.originalname;
    cb(null, `${timestamp}-${name}`);
  },
});

const fileFilter = async (req, file, cb) => {
  const rootPath = path.resolve(__dirname, "../data");

  if (!fs.existsSync(rootPath)) {
    await fs.promises.mkdir(rootPath);
  }

  if (!fs.existsSync(pathFolder)) {
    await fs.promises.mkdir(pathFolder);
  }

  if (file.fieldname === "fileName") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("error in file"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const handleFileUpload = (req, res, next) => {
  const uploadSingle = upload.single("fileName");

  uploadSingle(req, res, (error) => {
    if(!req.file) {
      return res.status(400).json({ status: res.statusCode, error: `fileName field is required or name is invalid.` });
    }
    if (error) {
      return res.status(500).json({ error: `Server error: ${error.message}` });
    }
    next();
  });
};

module.exports = handleFileUpload;