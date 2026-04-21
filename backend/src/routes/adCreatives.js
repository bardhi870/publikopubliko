const router = require("express").Router();
const upload = require("../config/multer");

const {
  getAdCreatives,
  getCreativesByCampaign,
  createAdCreative,
  updateAdCreative,
  deleteAdCreative
} = require("../controllers/adCreativesController");

router.get("/", getAdCreatives);
router.get("/campaign/:campaignId", getCreativesByCampaign);

router.post("/", upload.single("image"), createAdCreative);

router.put("/:id", upload.single("image"), updateAdCreative);

router.delete("/:id", deleteAdCreative);

module.exports = router;