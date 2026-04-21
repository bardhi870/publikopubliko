const pool = require("../../config/db");

const getAllPosts = async (req, res) => {
  try {
    const { category, includeExpired } = req.query;
    const shouldIncludeExpired = includeExpired === "true";

    let result;

    if (shouldIncludeExpired) {
      if (category) {
        result = await pool.query(
          `SELECT *
           FROM posts
           WHERE category = $1
           ORDER BY created_at DESC`,
          [category]
        );
      } else {
        result = await pool.query(
          `SELECT *
           FROM posts
           ORDER BY created_at DESC`
        );
      }
    } else {
      if (category) {
        result = await pool.query(
          `SELECT *
           FROM posts
           WHERE category = $1
             AND is_active = true
             AND (
               is_unlimited = true
               OR active_until IS NULL
               OR active_until::date >= CURRENT_DATE
             )
           ORDER BY created_at DESC`,
          [category]
        );
      } else {
        result = await pool.query(
          `SELECT *
           FROM posts
           WHERE is_active = true
             AND (
               is_unlimited = true
               OR active_until IS NULL
               OR active_until::date >= CURRENT_DATE
             )
           ORDER BY created_at DESC`
        );
      }
    }

    res.json(result.rows);

  } catch (error) {
    console.error("Gabim gjatë marrjes së postimeve:", error);

    res.status(500).json({
      message: "Gabim në server."
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Postimi nuk u gjet."
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Gabim gjatë marrjes së postimit:", error);

    res.status(500).json({
      message: "Gabim në server."
    });
  }
};

const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      image_url,
      gallery_images,
      video_url,
      propertyType,
      listingType,
      priceType,
      city,
      area,
      rooms,
      bathrooms,
      phone,
      whatsapp,
      offerBadge,
      offerFeatures,
      clientId,
      is_active,
      is_unlimited,
      active_from,
      active_until,
      job_category,
      experience,
      work_hours,
      languages,
      featured,
      breaking
    } = req.body;

    const isNewsCategory =
      ["vendi","rajoni","bota"].includes(category);

    const result = await pool.query(
      `INSERT INTO posts (
        title,
        description,
        category,
        price,
        image_url,
        gallery_images,
        video_url,
        property_type,
        listing_type,
        price_type,
        city,
        area,
        rooms,
        bathrooms,
        phone,
        whatsapp,
        offer_badge,
        offer_features,
        client_id,
        is_active,
        is_unlimited,
        active_from,
        active_until,
        job_category,
        experience,
        work_hours,
        languages,
        featured,
        breaking
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,$29
      )
      RETURNING *`,
      [
        title,
        description,
        category,
        price || null,
        image_url || null,
        Array.isArray(gallery_images)
          ? JSON.stringify(gallery_images)
          : JSON.stringify([]),
        video_url || null,
        propertyType || null,
        listingType || null,
        priceType || null,
        city || null,
        area || null,
        rooms || null,
        bathrooms || null,
        phone || null,
        whatsapp || null,
        offerBadge || null,
        offerFeatures && Array.isArray(offerFeatures)
          ? JSON.stringify(offerFeatures)
          : JSON.stringify([]),
        clientId || null,
        is_active !== false,
        is_unlimited || false,
        active_from || new Date(),
        is_unlimited ? null : active_until || null,
        job_category || null,
        experience || null,
        work_hours || null,
        languages || null,
        isNewsCategory ? !!featured : false,
        isNewsCategory ? !!breaking : false
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Gabim gjatë krijimit të postimit:", error);

    res.status(500).json({
      message: "Gabim në server."
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      price,
      image_url,
      gallery_images,
      video_url,
      propertyType,
      listingType,
      priceType,
      city,
      area,
      rooms,
      bathrooms,
      phone,
      whatsapp,
      offerBadge,
      offerFeatures,
      clientId,
      is_active,
      is_unlimited,
      active_from,
      active_until,
      job_category,
      experience,
      work_hours,
      languages,
      featured,
      breaking
    } = req.body;

    const isNewsCategory =
      ["vendi","rajoni","bota"].includes(category);

    const result = await pool.query(
      `UPDATE posts
       SET title = $1,
           description = $2,
           category = $3,
           price = $4,
           image_url = $5,
           gallery_images = $6,
           video_url = $7,
           property_type = $8,
           listing_type = $9,
           price_type = $10,
           city = $11,
           area = $12,
           rooms = $13,
           bathrooms = $14,
           phone = $15,
           whatsapp = $16,
           offer_badge = $17,
           offer_features = $18,
           client_id = $19,
           is_active = $20,
           is_unlimited = $21,
           active_from = $22,
           active_until = $23,
           job_category = $24,
           experience = $25,
           work_hours = $26,
           languages = $27,
           featured = $28,
           breaking = $29
       WHERE id = $30
       RETURNING *`,
      [
        title,
        description,
        category,
        price || null,
        image_url || null,
        Array.isArray(gallery_images)
          ? JSON.stringify(gallery_images)
          : JSON.stringify([]),
        video_url || null,
        propertyType || null,
        listingType || null,
        priceType || null,
        city || null,
        area || null,
        rooms || null,
        bathrooms || null,
        phone || null,
        whatsapp || null,
        offerBadge || null,
        offerFeatures && Array.isArray(offerFeatures)
          ? JSON.stringify(offerFeatures)
          : JSON.stringify([]),
        clientId || null,
        is_active !== false,
        is_unlimited || false,
        active_from || new Date(),
        is_unlimited ? null : active_until || null,
        job_category || null,
        experience || null,
        work_hours || null,
        languages || null,
        isNewsCategory ? !!featured : false,
        isNewsCategory ? !!breaking : false,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Postimi nuk u gjet."
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Gabim gjatë përditësimit të postimit:", error);

    res.status(500).json({
      message: "Gabim në server."
    });
  }
};

const togglePostStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE posts
      SET is_active = NOT is_active
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Postimi nuk u gjet."
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Gabim gjatë ndryshimit të statusit:", error);

    res.status(500).json({
      message: "Gabim në server."
    });
  }
};

const incrementPostViews = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE posts
      SET views_count = COALESCE(views_count,0)+1
      WHERE id = $1
      RETURNING views_count
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Postimi nuk u gjet."
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Gabim gjatë rritjes së views:", error);

    res.status(500).json({
      message: "Gabim në server."
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Postimi nuk u gjet."
      });
    }

    res.json({
      message: "Postimi u fshi me sukses."
    });

  } catch (error) {
    console.error("Gabim gjatë fshirjes së postimit:", error);

    res.status(500).json({
      message: "Gabim në server."
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  togglePostStatus,
  incrementPostViews,
  deletePost
};