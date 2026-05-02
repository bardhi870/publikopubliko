const router = require("express").Router();

const authRoutes = require("../modules/auth/auth.routes");
const requireAdminAuth = require("../middleware/requireAdminAuth");

const postRoutes = require("../modules/posts/post.routes");
const packageRoutes = require("../modules/packages/package.routes");
const clientRoutes = require("../modules/clients/client.routes");
const statsRoutes = require("../modules/stats/stats.routes");
const adRequestRoutes = require("../modules/ad-requests/adRequests.routes");

const advertisersRoutes = require("./advertisers");
const campaignsRoutes = require("./campaigns");
const adPlacementsRoutes = require("./adPlacements");
const adCreativesRoutes = require("./adCreatives");
const publicAdsRoutes = require("./publicAds");

const analyticsRoutes = require("./analytics/publicAnalyticsRoutes");
const adminAnalyticsRoutes = require("./analytics/adminAnalyticsRoutes");

const upload = require("../config/multer");

/* BASE URL */
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PUBLIC_URL
    : "http://localhost:5000";

/* =========================
   AUTH - PUBLIC
========================= */
router.use("/auth", authRoutes);

/* =========================
   PUBLIC MODULES
========================= */
router.use("/posts", postRoutes);
router.use("/public/ads", publicAdsRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/ad-requests", adRequestRoutes);
router.use("/packages", packageRoutes); // ✅ PUBLIC

/* =========================
   ADMIN PROTECTED MODULES
========================= */
router.use("/clients", requireAdminAuth, clientRoutes);
router.use("/stats", requireAdminAuth, statsRoutes);
router.use("/advertisers", requireAdminAuth, advertisersRoutes);
router.use("/campaigns", requireAdminAuth, campaignsRoutes);
router.use("/ad-placements", requireAdminAuth, adPlacementsRoutes);
router.use("/ad-creatives", requireAdminAuth, adCreativesRoutes);
router.use("/admin/analytics", requireAdminAuth, adminAnalyticsRoutes);

/* =========================
   UPLOAD SINGLE
========================= */
router.post(
  "/upload",
  requireAdminAuth,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    return res.json({
      message: "File uploaded successfully",
      imageUrl: `${BASE_URL}/uploads/${req.file.filename}`
    });
  }
);

/* =========================
   UPLOAD MEDIA
========================= */
router.post(
  "/upload/media",
  requireAdminAuth,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const images = req.files?.images || [];
      const video = req.files?.video?.[0] || null;

      const imageUrls = images.map(
        (file) => `${BASE_URL}/uploads/${file.filename}`
      );

      const videoUrl = video
        ? `${BASE_URL}/uploads/${video.filename}`
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

/* =========================
   EXPORT (FIX KRYESOR)
========================= */
module.exports = router;