const pool = require("../../config/db");

const normalizeExternalLink = (link) => {
  const clean = String(link || "").trim();
  if (!clean) return null;
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  return `https://${clean}`;
};

const normalizePositionsCount = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value ? [value] : [];
    }
  }

  return [];
};

const stringifyJsonArray = (value) => {
  return JSON.stringify(parseJsonArray(value));
};

const buildFileUrl = (req, file) => {
  if (!file) return null;

  if (file.location) return file.location;

  if (file.filename) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return `${baseUrl}/uploads/${file.filename}`;
  }

  if (file.key) {
    return `${process.env.WASABI_ENDPOINT}/${process.env.WASABI_BUCKET}/${file.key}`;
  }

  return null;
};

const getUploadedMedia = (req) => {
  const imageFiles = req.files?.images || [];
  const videoFiles = req.files?.video || [];

  const uploadedImages = imageFiles
    .map((file) => buildFileUrl(req, file))
    .filter(Boolean);

  const uploadedVideo = buildFileUrl(req, videoFiles[0]);

  return { uploadedImages, uploadedVideo };
};

const getAllPosts = async (req, res) => {
  try {
    const { category, includeExpired } = req.query;
    const shouldIncludeExpired = includeExpired === "true";

    let query = `SELECT * FROM posts`;
    const values = [];
    const conditions = [];

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    if (!shouldIncludeExpired) {
      conditions.push(`is_active = true`);
      conditions.push(`
        (
          is_unlimited = true
          OR active_until IS NULL
          OR active_until::date >= CURRENT_DATE
        )
      `);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY featured DESC, created_at DESC`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Gabim gjatë marrjes së postimeve:", error);
    res.status(500).json({ message: "Gabim në server." });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Postimi nuk u gjet." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Gabim gjatë marrjes së postimit:", error);
    res.status(500).json({ message: "Gabim në server." });
  }
};

const createPost = async (req, res) => {
  try {
    const { uploadedImages, uploadedVideo } = getUploadedMedia(req);

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

      mileage,
      power,
      transmission,
      drive_type,
      fuel_type,
      vehicle_year,
      body_type,
      series,
      doors,
      seats,
      exterior_color,
      interior_color,
      weight,
      engine_capacity,
      vehicle_condition,
      location,

      phone,
      whatsapp,

      offerBadge,
      offerFeatures,
      clientId,

      is_active,
      is_unlimited,
      active_from,
      active_until,

      company_name,
      job_category,
      job_location,
      positions_count,
      experience,
      work_hours,
      languages,

      featured,
      breaking,

      externalLink,
      externalLinkLabel,
      external_link,
      external_link_label
    } = req.body;

    const isNewsCategory = ["vendi", "rajoni", "bota", "lajme"].includes(category);

    const finalExternalLink = normalizeExternalLink(external_link || externalLink);

    const finalExternalLinkLabel =
      external_link_label ||
      externalLinkLabel ||
      (finalExternalLink ? "Hap linkun" : null);

    const finalImageUrl = uploadedImages[0] || image_url || null;
    const finalGalleryImages =
      uploadedImages.length > 0 ? uploadedImages : parseJsonArray(gallery_images);
    const finalVideoUrl = uploadedVideo || video_url || null;

    const result = await pool.query(
      `
      INSERT INTO posts (
        title, description, category, price, image_url, gallery_images, video_url,
        property_type, listing_type, price_type, city, area, rooms, bathrooms,
        mileage, power, transmission, drive_type, fuel_type, vehicle_year,
        body_type, series, doors, seats, exterior_color, interior_color,
        weight, engine_capacity, vehicle_condition, location,
        phone, whatsapp, offer_badge, offer_features, client_id,
        is_active, is_unlimited, active_from, active_until,
        company_name, job_category, job_location, positions_count,
        experience, work_hours, languages,
        featured, breaking, external_link, external_link_label
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,$14,
        $15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,
        $27,$28,$29,$30,
        $31,$32,$33,$34,$35,
        $36,$37,$38,$39,
        $40,$41,$42,$43,
        $44,$45,$46,
        $47,$48,$49,$50
      )
      RETURNING *
      `,
      [
        title,
        description,
        category,
        price || null,
        finalImageUrl,
        stringifyJsonArray(finalGalleryImages),
        finalVideoUrl,

        propertyType || null,
        listingType || null,
        priceType || null,
        city || null,
        area || null,
        rooms || null,
        bathrooms || null,

        mileage || null,
        power || null,
        transmission || null,
        drive_type || null,
        fuel_type || null,
        vehicle_year || null,
        body_type || null,
        series || null,
        doors || null,
        seats || null,
        exterior_color || null,
        interior_color || null,
        weight || null,
        engine_capacity || null,
        vehicle_condition || null,
        location || null,

        phone || null,
        whatsapp || null,
        offerBadge || null,
        stringifyJsonArray(offerFeatures),
        clientId || null,

        is_active !== false && is_active !== "false",
        is_unlimited === true || is_unlimited === "true",
        active_from || new Date(),
        is_unlimited === true || is_unlimited === "true"
          ? null
          : active_until || null,

        company_name || null,
        job_category || null,
        job_location || city || null,
        normalizePositionsCount(positions_count),
        experience || null,
        work_hours || null,
        languages || null,

        featured === true || featured === "true",
        isNewsCategory ? breaking === true || breaking === "true" : false,
        finalExternalLink,
        finalExternalLinkLabel
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Gabim gjatë krijimit të postimit:", error);
    res.status(500).json({ message: "Gabim në server." });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { uploadedImages, uploadedVideo } = getUploadedMedia(req);

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

      mileage,
      power,
      transmission,
      drive_type,
      fuel_type,
      vehicle_year,
      body_type,
      series,
      doors,
      seats,
      exterior_color,
      interior_color,
      weight,
      engine_capacity,
      vehicle_condition,
      location,

      phone,
      whatsapp,

      offerBadge,
      offerFeatures,
      clientId,

      is_active,
      is_unlimited,
      active_from,
      active_until,

      company_name,
      job_category,
      job_location,
      positions_count,
      experience,
      work_hours,
      languages,

      featured,
      breaking,

      externalLink,
      externalLinkLabel,
      external_link,
      external_link_label
    } = req.body;

    const isNewsCategory = ["vendi", "rajoni", "bota", "lajme"].includes(category);

    const finalExternalLink = normalizeExternalLink(external_link || externalLink);

    const finalExternalLinkLabel =
      external_link_label ||
      externalLinkLabel ||
      (finalExternalLink ? "Hap linkun" : null);

    const finalImageUrl = uploadedImages[0] || image_url || null;
    const finalGalleryImages =
      uploadedImages.length > 0 ? uploadedImages : parseJsonArray(gallery_images);
    const finalVideoUrl = uploadedVideo || video_url || null;

    const result = await pool.query(
      `
      UPDATE posts
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
          mileage = $15,
          power = $16,
          transmission = $17,
          drive_type = $18,
          fuel_type = $19,
          vehicle_year = $20,
          body_type = $21,
          series = $22,
          doors = $23,
          seats = $24,
          exterior_color = $25,
          interior_color = $26,
          weight = $27,
          engine_capacity = $28,
          vehicle_condition = $29,
          location = $30,
          phone = $31,
          whatsapp = $32,
          offer_badge = $33,
          offer_features = $34,
          client_id = $35,
          is_active = $36,
          is_unlimited = $37,
          active_from = $38,
          active_until = $39,
          company_name = $40,
          job_category = $41,
          job_location = $42,
          positions_count = $43,
          experience = $44,
          work_hours = $45,
          languages = $46,
          featured = $47,
          breaking = $48,
          external_link = $49,
          external_link_label = $50,
          updated_at = NOW()
      WHERE id = $51
      RETURNING *
      `,
      [
        title,
        description,
        category,
        price || null,
        finalImageUrl,
        stringifyJsonArray(finalGalleryImages),
        finalVideoUrl,

        propertyType || null,
        listingType || null,
        priceType || null,
        city || null,
        area || null,
        rooms || null,
        bathrooms || null,

        mileage || null,
        power || null,
        transmission || null,
        drive_type || null,
        fuel_type || null,
        vehicle_year || null,
        body_type || null,
        series || null,
        doors || null,
        seats || null,
        exterior_color || null,
        interior_color || null,
        weight || null,
        engine_capacity || null,
        vehicle_condition || null,
        location || null,

        phone || null,
        whatsapp || null,
        offerBadge || null,
        stringifyJsonArray(offerFeatures),
        clientId || null,

        is_active !== false && is_active !== "false",
        is_unlimited === true || is_unlimited === "true",
        active_from || new Date(),
        is_unlimited === true || is_unlimited === "true"
          ? null
          : active_until || null,

        company_name || null,
        job_category || null,
        job_location || city || null,
        normalizePositionsCount(positions_count),
        experience || null,
        work_hours || null,
        languages || null,

        featured === true || featured === "true",
        isNewsCategory ? breaking === true || breaking === "true" : false,

        finalExternalLink,
        finalExternalLinkLabel,

        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Postimi nuk u gjet." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Gabim gjatë përditësimit të postimit:", error);
    res.status(500).json({ message: "Gabim në server." });
  }
};

const togglePostStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE posts
      SET is_active = NOT is_active,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Postimi nuk u gjet." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Gabim gjatë ndryshimit të statusit:", error);
    res.status(500).json({ message: "Gabim në server." });
  }
};

const incrementPostViews = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE posts
      SET views_count = COALESCE(views_count, 0) + 1
      WHERE id = $1
      RETURNING views_count
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Postimi nuk u gjet." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Gabim gjatë rritjes së views:", error);
    res.status(500).json({ message: "Gabim në server." });
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
      return res.status(404).json({ message: "Postimi nuk u gjet." });
    }

    res.json({ message: "Postimi u fshi me sukses." });
  } catch (error) {
    console.error("Gabim gjatë fshirjes së postimit:", error);
    res.status(500).json({ message: "Gabim në server." });
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