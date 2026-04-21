const router = require("express").Router();

const {
  getAdvertisers,
  createAdvertiser,
  updateAdvertiser,
  deleteAdvertiser
} = require("../controllers/advertisersController");

router.get("/", getAdvertisers);
router.post("/", createAdvertiser);
router.put("/:id", updateAdvertiser);
router.delete("/:id", deleteAdvertiser);

module.exports = router;