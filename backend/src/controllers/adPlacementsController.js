const db = require("../config/db");

const getPlacements = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM ad_placements
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("getPlacements error:", err);
    res.status(500).json({
      message: "Gabim në marrjen e pozicioneve të reklamave."
    });
  }
};

module.exports = {
  getPlacements
};