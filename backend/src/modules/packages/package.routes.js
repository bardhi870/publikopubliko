const router = require("express").Router();
const db = require("../../config/db");

/* GET all */
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM packages
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gabim në marrjen e ofertave."
    });
  }
});

/* CREATE */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      offer_badge,
      highlighted,
      phone,
      whatsapp,
      messenger,
      offer_features,
      is_active,
      active_until,
      background_color,
      text_color,
      button_color
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO packages (
        title,
        description,
        price,
        offer_badge,
        highlighted,
        phone,
        whatsapp,
        messenger,
        offer_features,
        is_active,
        active_until,
        background_color,
        text_color,
        button_color
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
      `,
      [
        title,
        description,
        price,
        offer_badge,
        highlighted,
        phone,
        whatsapp,
        messenger,
        JSON.stringify(offer_features || []),
        is_active,
        active_until,
        background_color || "#ffffff",
        text_color || "#0f172a",
        button_color || "#2563eb"
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gabim në ruajtjen e ofertës."
    });
  }
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      offer_badge,
      highlighted,
      phone,
      whatsapp,
      messenger,
      offer_features,
      is_active,
      active_until,
      background_color,
      text_color,
      button_color
    } = req.body;

    const result = await db.query(
      `
      UPDATE packages
      SET
        title=$1,
        description=$2,
        price=$3,
        offer_badge=$4,
        highlighted=$5,
        phone=$6,
        whatsapp=$7,
        messenger=$8,
        offer_features=$9,
        is_active=$10,
        active_until=$11,
        background_color=$12,
        text_color=$13,
        button_color=$14
      WHERE id=$15
      RETURNING *
      `,
      [
        title,
        description,
        price,
        offer_badge,
        highlighted,
        phone,
        whatsapp,
        messenger,
        JSON.stringify(offer_features || []),
        is_active,
        active_until,
        background_color || "#ffffff",
        text_color || "#0f172a",
        button_color || "#2563eb",
        req.params.id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gabim në përditësim."
    });
  }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  try {
    await db.query(`DELETE FROM packages WHERE id=$1`, [req.params.id]);

    res.json({
      message: "Oferta u fshi."
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gabim në fshirje."
    });
  }
});

module.exports = router;