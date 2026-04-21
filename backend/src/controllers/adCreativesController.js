const db = require("../config/db");

/* helper */
const buildUploadedFileUrl = (req) => {
  if (!req.file) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
};

/* GET ALL CREATIVES */
const getAdCreatives = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM ad_creatives
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("getAdCreatives error:", err);

    res.status(500).json({
      message: "Gabim në marrjen e creatives."
    });
  }
};

/* GET CREATIVES BY CAMPAIGN */
const getCreativesByCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM ad_creatives
      WHERE campaign_id = $1
      ORDER BY id DESC
      `,
      [campaignId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getCreativesByCampaign error:", err);

    res.status(500).json({
      message: "Gabim në marrjen e creatives të fushatës."
    });
  }
};

/* CREATE CREATIVE */
const createAdCreative = async (req, res) => {
  try {
    const {
      campaign_id,
      creative_type,
      title,
      image_url,
      video_url,
      html_code,
      headline,
      description,
      button_text,
      button_link,
      device_type,
      is_primary
    } = req.body;

    if (!campaign_id || !creative_type) {
      return res.status(400).json({
        message: "campaign_id dhe creative_type janë të detyrueshme."
      });
    }

    const uploadedImageUrl = buildUploadedFileUrl(req);
    const finalImageUrl = uploadedImageUrl || image_url || null;

    const result = await db.query(
      `
      INSERT INTO ad_creatives (
        campaign_id,
        creative_type,
        title,
        image_url,
        video_url,
        html_code,
        headline,
        description,
        button_text,
        button_link,
        device_type,
        is_primary
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      )
      RETURNING *
      `,
      [
        Number(campaign_id),
        creative_type,
        title || null,
        finalImageUrl,
        video_url || null,
        html_code || null,
        headline || null,
        description || null,
        button_text || null,
        button_link || null,
        device_type || "all",
        is_primary === "true" || is_primary === true
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createAdCreative error:", err);

    res.status(500).json({
      message: "Gabim në krijimin e creative."
    });
  }
};

/* UPDATE CREATIVE */
const updateAdCreative = async (req, res) => {
  try {
    const { id } = req.params;

    const existingResult = await db.query(
      `
      SELECT *
      FROM ad_creatives
      WHERE id = $1
      `,
      [id]
    );

    if (!existingResult.rows.length) {
      return res.status(404).json({
        message: "Creative nuk u gjet."
      });
    }

    const existingCreative = existingResult.rows[0];

    const {
      creative_type,
      title,
      image_url,
      video_url,
      html_code,
      headline,
      description,
      button_text,
      button_link,
      device_type,
      is_primary
    } = req.body;

    const uploadedImageUrl = buildUploadedFileUrl(req);

    const finalImageUrl =
      uploadedImageUrl ||
      image_url ||
      existingCreative.image_url ||
      null;

    const result = await db.query(
      `
      UPDATE ad_creatives
      SET
        creative_type = $1,
        title = $2,
        image_url = $3,
        video_url = $4,
        html_code = $5,
        headline = $6,
        description = $7,
        button_text = $8,
        button_link = $9,
        device_type = $10,
        is_primary = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
      `,
      [
        creative_type || existingCreative.creative_type,
        title || existingCreative.title,
        finalImageUrl,
        video_url !== undefined ? (video_url || null) : existingCreative.video_url,
        html_code !== undefined ? (html_code || null) : existingCreative.html_code,
        headline !== undefined ? (headline || null) : existingCreative.headline,
        description !== undefined ? (description || null) : existingCreative.description,
        button_text !== undefined ? (button_text || null) : existingCreative.button_text,
        button_link !== undefined ? (button_link || null) : existingCreative.button_link,
        device_type || existingCreative.device_type,
        is_primary === undefined
          ? existingCreative.is_primary
          : is_primary === "true" || is_primary === true,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateAdCreative error:", err);

    res.status(500).json({
      message: "Gabim në përditësimin e creative."
    });
  }
};

/* DELETE CREATIVE */
const deleteAdCreative = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM ad_creatives
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Creative nuk u gjet."
      });
    }

    res.json({
      message: "Creative u fshi me sukses."
    });
  } catch (err) {
    console.error("deleteAdCreative error:", err);

    res.status(500).json({
      message: "Gabim në fshirjen e creative."
    });
  }
};

module.exports = {
  getAdCreatives,
  getCreativesByCampaign,
  createAdCreative,
  updateAdCreative,
  deleteAdCreative
};