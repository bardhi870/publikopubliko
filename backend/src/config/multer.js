const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  const allowedVideoTypes = [
    "video/mp4",
    "video/quicktime",
    "video/webm"
  ];

  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedVideoTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Lejohen vetëm foto (jpg/png/webp) dhe video (mp4/mov/webm)."),
      false
    );
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    const safeName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .toLowerCase();

    const fileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-${safeName}${ext}`;

    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 11,
    fileSize: 200 * 1024 * 1024
  }
});

module.exports = upload;