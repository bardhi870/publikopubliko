const router = require("express").Router();

const postRoutes = require("../modules/posts/post.routes");
const packageRoutes = require("../modules/packages/package.routes");
const publicClientsRoutes = require("../modules/packages/publicClients.routes");
const clientRoutes = require("../modules/clients/client.routes");
const statsRoutes = require("../modules/stats/stats.routes");

const advertisersRoutes = require("./advertisers");
const campaignsRoutes = require("./campaigns");
const adPlacementsRoutes = require("./adPlacements");
const adCreativesRoutes = require("./adCreatives");
const publicAdsRoutes = require("./publicAds");

const analyticsRoutes = require("./analytics/publicAnalyticsRoutes");
const adminAnalyticsRoutes = require("./analytics/adminAnalyticsRoutes");

const upload = require("../config/multer");

/* MAIN MODULES */
router.use("/posts", postRoutes);
router.use("/packages", packageRoutes);
router.use("/clients", clientRoutes);
router.use("/public-clients", publicClientsRoutes);
router.use("/stats", statsRoutes);

/* ANALYTICS */
router.use("/analytics", analyticsRoutes);
router.use("/admin/analytics", adminAnalyticsRoutes);

/* ADS PLATFORM */
router.use("/advertisers", advertisersRoutes);
router.use("/campaigns", campaignsRoutes);
router.use("/ad-placements", adPlacementsRoutes);
router.use("/ad-creatives", adCreativesRoutes);
router.use("/public/ads", publicAdsRoutes);

/*
 SINGLE FILE
*/
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded"
    });
  }

  return res.json({
    message: "File uploaded successfully",
    imageUrl: `http://localhost:5000/uploads/${req.file.filename}`
  });
});

/*
 MULTI MEDIA UPLOAD
*/
router.post(
  "/upload/media",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const images = req.files?.images || [];
      const video = req.files?.video?.[0] || null;

      if (images.length > 10) {
        return res.status(400).json({
          message: "Max 10 images allowed"
        });
      }

      const imageUrls = images.map(
        (file) => `http://localhost:5000/uploads/${file.filename}`
      );

      const videoUrl = video
        ? `http://localhost:5000/uploads/${video.filename}`
        : null;

      return res.json({
        success: true,
        coverImage: imageUrls[0] || null,
        galleryImages: imageUrls,
        videoUrl
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Upload failed"
      });
    }
  }
);

module.exports = router;