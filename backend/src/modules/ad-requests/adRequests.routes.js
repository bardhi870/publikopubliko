const router = require("express").Router();
const db = require("../../config/db");

/* GET all ad requests */
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM ad_requests
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gabim në marrjen e kërkesave për reklamim."
    });
  }
});

/* CREATE ad request */
router.post("/", async (req, res) => {
  try {
    const {
      full_name,
      business_name,
      phone,
      email,
      ad_type,
      budget,
      message
    } = req.body;

    if (!full_name?.trim() || !phone?.trim()) {
      return res.status(400).json({
        message: "Emri i plotë dhe telefoni janë të detyrueshëm."
      });
    }

    const result = await db.query(
      `
      INSERT INTO ad_requests (
        full_name,
        business_name,
        phone,
        email,
        ad_type,
        budget,
        message
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        full_name,
        business_name,
        phone,
        email,
        ad_type,
        budget,
        message
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gabim gjatë ruajtjes së kërkesës."
    });
  }
});

/* UPDATE status */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Në pritje", "Kontaktuar", "Pranuar", "Refuzuar"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status i pavlefshëm."
      });
    }

    const result = await db.query(
      `
      UPDATE ad_requests
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Kërkesa nuk u gjet."
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gabim gjatë përditësimit të statusit."
    });
  }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM ad_requests
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Kërkesa nuk u gjet."
      });
    }

    res.json({
      message: "Kërkesa u fshi me sukses."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gabim gjatë fshirjes së kërkesës."
    });
  }
});

module.exports = router;