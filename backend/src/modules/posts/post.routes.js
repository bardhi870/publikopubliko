const express = require("express");
const router = express.Router();
const upload = require("../../config/multer");

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePostStatus,
  incrementPostViews
} = require("./post.controller");

router.get("/", getAllPosts);
router.get("/:id", getPostById);

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 }
  ]),
  createPost
);

router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 }
  ]),
  updatePost
);

router.patch("/:id/toggle", togglePostStatus);
router.patch("/:id/view", incrementPostViews);
router.delete("/:id", deletePost);

module.exports = router;