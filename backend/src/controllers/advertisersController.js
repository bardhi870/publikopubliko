const db = require("../config/db");

/* GET ALL ADVERTISERS */
const getAdvertisers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM advertisers
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("getAdvertisers error:", err);
    res.status(500).json({
      message: "Gabim në marrjen e reklamuesve."
    });
  }
};

/* CREATE ADVERTISER */
const createAdvertiser = async (req, res) => {
  try {
    const {
      name,
      company_name,
      contact_person,
      phone,
      email,
      whatsapp,
      address,
      notes,
      status
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Emri i reklamuesit është i detyrueshëm."
      });
    }

    const result = await db.query(
      `
      INSERT INTO advertisers (
        name,
        company_name,
        contact_person,
        phone,
        email,
        whatsapp,
        address,
        notes,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `,
      [
        name,
        company_name || null,
        contact_person || null,
        phone || null,
        email || null,
        whatsapp || null,
        address || null,
        notes || null,
        status || "active"
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createAdvertiser error:", err);
    res.status(500).json({
      message: "Gabim në krijimin e reklamuesit."
    });
  }
};

/* UPDATE ADVERTISER */
const updateAdvertiser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      company_name,
      contact_person,
      phone,
      email,
      whatsapp,
      address,
      notes,
      status
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Emri i reklamuesit është i detyrueshëm."
      });
    }

    const result = await db.query(
      `
      UPDATE advertisers
      SET
        name = $1,
        company_name = $2,
        contact_person = $3,
        phone = $4,
        email = $5,
        whatsapp = $6,
        address = $7,
        notes = $8,
        status = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
      `,
      [
        name,
        company_name || null,
        contact_person || null,
        phone || null,
        email || null,
        whatsapp || null,
        address || null,
        notes || null,
        status || "active",
        id
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Reklamuesi nuk u gjet."
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateAdvertiser error:", err);
    res.status(500).json({
      message: "Gabim në përditësimin e reklamuesit."
    });
  }
};

/* DELETE ADVERTISER */
const deleteAdvertiser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM advertisers
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Reklamuesi nuk u gjet."
      });
    }

    res.json({
      message: "Reklamuesi u fshi me sukses."
    });
  } catch (err) {
    console.error("deleteAdvertiser error:", err);
    res.status(500).json({
      message: "Gabim në fshirjen e reklamuesit."
    });
  }
};

module.exports = {
  getAdvertisers,
  createAdvertiser,
  updateAdvertiser,
  deleteAdvertiser
};