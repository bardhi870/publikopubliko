const router = require("express").Router();

const {
  getPublicAd
} = require("../controllers/publicAdsController");

router.get("/", getPublicAd);

module.exports = router;