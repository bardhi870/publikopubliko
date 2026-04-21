const router = require("express").Router();
const pool = require("../../config/db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM stats ORDER BY sort_order ASC, id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("GET stats error:", error);
    res.status(500).json({ message: "Gabim gjatë marrjes së statistikave." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { value, label, status, sortOrder } = req.body;

    if (!value || !label) {
      return res.status(400).json({
        message: "Value dhe label janë të detyrueshme."
      });
    }

    const result = await pool.query(
      `INSERT INTO stats (value, label, status, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [value.trim(), label.trim(), status || "Aktive", Number(sortOrder || 0)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST stats error:", error);
    res.status(500).json({ message: "Gabim gjatë ruajtjes së statistikës." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { value, label, status, sortOrder } = req.body;

    if (!value || !label) {
      return res.status(400).json({
        message: "Value dhe label janë të detyrueshme."
      });
    }

    const result = await pool.query(
      `UPDATE stats
       SET value = $1,
           label = $2,
           status = $3,
           sort_order = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [value.trim(), label.trim(), status || "Aktive", Number(sortOrder || 0), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Statistika nuk u gjet." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("PUT stats error:", error);
    res.status(500).json({ message: "Gabim gjatë përditësimit të statistikës." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM stats WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Statistika nuk u gjet." });
    }

    res.json({ message: "Statistika u fshi me sukses." });
  } catch (error) {
    console.error("DELETE stats error:", error);
    res.status(500).json({ message: "Gabim gjatë fshirjes së statistikës." });
  }
});

module.exports = router;