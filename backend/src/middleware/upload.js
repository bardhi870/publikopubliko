const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

// WASABI CONFIG
const s3 = new AWS.S3({
  accessKeyId: process.env.WASABI_ACCESS_KEY,
  secretAccessKey: process.env.WASABI_SECRET_KEY,
  endpoint: process.env.WASABI_ENDPOINT,
  region: process.env.WASABI_REGION,
  s3ForcePathStyle: true,
  signatureVersion: "v4"
});

// FILTER (foto + video)
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
      new Error(
        "Lejohen vetëm foto (jpg/png/webp) dhe video (mp4/mov/webm)."
      ),
      false
    );
  }
};

// UPLOAD NË WASABI
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.WASABI_BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: function (req, file, cb) {
      const ext = path.extname(file.originalname);

      const safeName = path
        .basename(file.originalname, ext)
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .toLowerCase();

      const folder = file.mimetype.startsWith("video/")
        ? "videos"
        : "images";

      const fileName = `${folder}/${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}-${safeName}${ext}`;

      cb(null, fileName);
    }
  }),

  fileFilter,

  limits: {
    files: 11, // 10 foto + 1 video
    fileSize: 200 * 1024 * 1024
  }
});

module.exports = upload;