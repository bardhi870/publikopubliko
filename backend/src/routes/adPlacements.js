const router = require("express").Router();
const { getPlacements } = require("../controllers/adPlacementsController");

router.get("/", getPlacements);

module.exports = router;