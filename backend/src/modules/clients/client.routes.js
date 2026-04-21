const router = require("express").Router();
const db = require("../../config/db");

/* GET ALL CLIENTS */
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        c.*,
        COUNT(p.id)::int AS posts_count,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', p.id,
              'title', p.title,
              'category', p.category,
              'created_at', p.created_at,
              'is_active', p.is_active,
              'is_unlimited', p.is_unlimited,
              'active_from', p.active_from,
              'active_until', p.active_until
            )
            ORDER BY p.created_at DESC
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS posts
      FROM clients c
      LEFT JOIN posts p
        ON p.client_id = c.id
      GROUP BY c.id
      ORDER BY c.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Gabim në marrjen e klientëve:", err);
    res.status(500).json({
      message: "Gabim në marrjen e klientëve"
    });
  }
});

/* CREATE CLIENT */
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      businessName,
      source,
      serviceType,
      selectedOffer,
      totalPrice,
      paidAmount,
      status,
      notes
    } = req.body;

    if (!fullName?.trim() || !phone?.trim()) {
      return res.status(400).json({
        message: "Emri dhe telefoni janë të detyrueshëm"
      });
    }

    const result = await db.query(
      `
      INSERT INTO clients (
        full_name,
        phone,
        email,
        business_name,
        source,
        service_type,
        selected_offer,
        total_price,
        paid_amount,
        status,
        notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
      `,
      [
        fullName.trim(),
        phone.trim(),
        email || null,
        businessName || null,
        source || "WhatsApp",
        serviceType || null,
        selectedOffer || null,
        totalPrice || 0,
        paidAmount || 0,
        status || "Aktiv",
        notes || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Gabim në krijimin e klientit:", err);
    res.status(500).json({
      message: "Gabim në krijimin e klientit"
    });
  }
});

/* UPDATE CLIENT */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      phone,
      email,
      businessName,
      source,
      serviceType,
      selectedOffer,
      totalPrice,
      paidAmount,
      status,
      notes
    } = req.body;

    if (!fullName?.trim() || !phone?.trim()) {
      return res.status(400).json({
        message: "Emri dhe telefoni janë të detyrueshëm"
      });
    }

    const result = await db.query(
      `
      UPDATE clients
      SET
        full_name = $1,
        phone = $2,
        email = $3,
        business_name = $4,
        source = $5,
        service_type = $6,
        selected_offer = $7,
        total_price = $8,
        paid_amount = $9,
        status = $10,
        notes = $11
      WHERE id = $12
      RETURNING *
      `,
      [
        fullName.trim(),
        phone.trim(),
        email || null,
        businessName || null,
        source || "WhatsApp",
        serviceType || null,
        selectedOffer || null,
        totalPrice || 0,
        paidAmount || 0,
        status || "Aktiv",
        notes || null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Klienti nuk u gjet"
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Gabim në përditësim:", err);
    res.status(500).json({
      message: "Gabim në përditësim"
    });
  }
});

/* DELETE CLIENT */
router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query(
      `
      DELETE FROM clients
      WHERE id = $1
      RETURNING *
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Klienti nuk u gjet"
      });
    }

    res.json({
      success: true,
      message: "Klienti u fshi me sukses"
    });
  } catch (err) {
    console.error("Gabim në fshirje:", err);
    res.status(500).json({
      message: "Gabim në fshirje"
    });
  }
});

module.exports = router;