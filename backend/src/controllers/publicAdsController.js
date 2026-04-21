const db = require("../config/db");

const getPublicAd = async (req, res) => {
  try {
    const { placement, device } = req.query;

    if (!placement) {
      return res.status(400).json({
        message: "placement është i detyrueshëm."
      });
    }

    const result = await db.query(
      `
      SELECT
        c.id AS campaign_id,
        c.title AS campaign_title,
        c.description AS campaign_description,
        c.campaign_type,
        c.target_url,
        c.open_in_new_tab,
        c.priority,

        p.id AS placement_id,
        p.name AS placement_name,
        p.slug AS placement_slug,

        ac.id AS creative_id,
        ac.creative_type,
        ac.title AS creative_title,
        ac.image_url,
        ac.video_url,
        ac.html_code,
        ac.headline,
        ac.description AS creative_description,
        ac.button_text,
        ac.button_link,
        ac.device_type,
        ac.is_primary

      FROM ad_placements p
      JOIN campaign_placements cp
        ON cp.placement_id = p.id
       AND cp.is_active = true
      JOIN campaigns c
        ON c.id = cp.campaign_id
      JOIN ad_creatives ac
        ON ac.campaign_id = c.id

      WHERE p.slug = $1
        AND p.is_active = true
        AND c.status = 'active'
        AND (c.start_date IS NULL OR c.start_date <= NOW())
        AND (c.end_date IS NULL OR c.end_date >= NOW())
        AND (
          ac.device_type = 'all'
          OR ac.device_type = $2
        )

      ORDER BY
        c.priority DESC,
        cp.sort_order ASC,
        ac.is_primary DESC,
        ac.id DESC

      LIMIT 3
      `,
      [placement, device || "all"]
    );

    if (!result.rows.length) {
      return res.json(null);
    }

    if (result.rows.length === 1) {
      return res.json(result.rows[0]);
    }

    return res.json(result.rows);
  } catch (err) {
    console.error("getPublicAd error:", err);
    res.status(500).json({
      message: "Gabim në marrjen e reklamës publike."
    });
  }
};

module.exports = {
  getPublicAd
};