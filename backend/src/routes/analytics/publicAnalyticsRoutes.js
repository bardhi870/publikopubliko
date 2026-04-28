



const router = require("express").Router();
const crypto = require("crypto");
const db = require("../../config/db");

function hashIp(ip) {
  if (!ip) return null;
  return crypto
    .createHash("sha256")
    .update(ip)
    .digest("hex");
}

router.post("/track", async (req, res) => {
  try {
    const {
      event_type,
      page_url,
      element_name,
      category,
      post_id,
      ad_id,
      session_id,
      visitor_id,
      referrer,
      device_type,
      browser,
      os,
      country,
      city,
      metadata
    } = req.body;

    if (!event_type) {
      return res.status(400).json({
        message: "event_type required"
      });
    }

    const forwarded = req.headers["x-forwarded-for"];

    const rawIp =
      forwarded
        ? forwarded.split(",")[0].trim()
        : req.socket?.remoteAddress || null;

    const ip_hash = hashIp(rawIp);

    await db.query(
      `
      INSERT INTO analytics_events (
        event_type,
        page_url,
        element_name,
        category,
        post_id,
        ad_id,
        session_id,
        visitor_id,
        ip_hash,
        referrer,
        device_type,
        browser,
        os,
        country,
        city,
        metadata
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,$14,$15,$16
      )
      `,
      [
        event_type,
        page_url || null,
        element_name || null,
        category || null,
        post_id || null,
        ad_id || null,
        session_id || null,
        visitor_id || null,
        ip_hash,
        referrer || null,
        device_type || null,
        browser || null,
        os || null,
        country || null,
        city || null,
        metadata || {}
      ]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Tracking failed"
    });

  }
});

module.exports = router;