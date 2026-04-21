const db = require("../config/db");

/* GET ALL CAMPAIGNS */
const getCampaigns = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        c.*,
        a.name AS advertiser_name,
        a.company_name AS advertiser_company_name,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'placement_id', p.id,
              'placement_name', p.name,
              'placement_slug', p.slug,
              'sort_order', cp.sort_order,
              'is_active', cp.is_active
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS placements
      FROM campaigns c
      JOIN advertisers a ON a.id = c.advertiser_id
      LEFT JOIN campaign_placements cp ON cp.campaign_id = c.id
      LEFT JOIN ad_placements p ON p.id = cp.placement_id
      GROUP BY c.id, a.name, a.company_name
      ORDER BY c.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("getCampaigns error:", err);
    res.status(500).json({
      message: "Gabim në marrjen e fushatave."
    });
  }
};

/* GET CAMPAIGN BY ID */
const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT
        c.*,
        a.name AS advertiser_name,
        a.company_name AS advertiser_company_name,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'placement_id', p.id,
              'placement_name', p.name,
              'placement_slug', p.slug,
              'sort_order', cp.sort_order,
              'is_active', cp.is_active
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS placements
      FROM campaigns c
      JOIN advertisers a ON a.id = c.advertiser_id
      LEFT JOIN campaign_placements cp ON cp.campaign_id = c.id
      LEFT JOIN ad_placements p ON p.id = cp.placement_id
      WHERE c.id = $1
      GROUP BY c.id, a.name, a.company_name
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Fushata nuk u gjet."
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("getCampaignById error:", err);
    res.status(500).json({
      message: "Gabim në marrjen e fushatës."
    });
  }
};

/* CREATE CAMPAIGN */
const createCampaign = async (req, res) => {
  const client = await db.connect();

  try {
    const {
      advertiser_id,
      title,
      description,
      campaign_type,
      pricing_model,
      price,
      start_date,
      end_date,
      status,
      priority,
      target_url,
      open_in_new_tab,
      notes,
      placements
    } = req.body;

    if (!advertiser_id || !title || !campaign_type) {
      return res.status(400).json({
        message: "advertiser_id, title dhe campaign_type janë të detyrueshme."
      });
    }

    await client.query("BEGIN");

    const campaignResult = await client.query(
      `
      INSERT INTO campaigns (
        advertiser_id,
        title,
        description,
        campaign_type,
        pricing_model,
        price,
        start_date,
        end_date,
        status,
        priority,
        target_url,
        open_in_new_tab,
        notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
      `,
      [
        advertiser_id,
        title,
        description || null,
        campaign_type,
        pricing_model || "flat_fee",
        price || 0,
        start_date || null,
        end_date || null,
        status || "draft",
        priority || 0,
        target_url || null,
        open_in_new_tab !== undefined ? open_in_new_tab : true,
        notes || null
      ]
    );

    const campaign = campaignResult.rows[0];

    if (Array.isArray(placements) && placements.length > 0) {
      for (let i = 0; i < placements.length; i++) {
        const placementId = placements[i];

        await client.query(
          `
          INSERT INTO campaign_placements (
            campaign_id,
            placement_id,
            sort_order,
            is_active
          )
          VALUES ($1,$2,$3,$4)
          `,
          [campaign.id, placementId, i, true]
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Fushata u krijua me sukses.",
      campaign
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("createCampaign error:", err);
    res.status(500).json({
      message: "Gabim në krijimin e fushatës."
    });
  } finally {
    client.release();
  }
};

/* UPDATE CAMPAIGN */
const updateCampaign = async (req, res) => {
  const client = await db.connect();

  try {
    const { id } = req.params;
    const {
      advertiser_id,
      title,
      description,
      campaign_type,
      pricing_model,
      price,
      start_date,
      end_date,
      status,
      priority,
      target_url,
      open_in_new_tab,
      notes,
      placements
    } = req.body;

    if (!advertiser_id || !title || !campaign_type) {
      return res.status(400).json({
        message: "advertiser_id, title dhe campaign_type janë të detyrueshme."
      });
    }

    await client.query("BEGIN");

    const campaignResult = await client.query(
      `
      UPDATE campaigns
      SET
        advertiser_id = $1,
        title = $2,
        description = $3,
        campaign_type = $4,
        pricing_model = $5,
        price = $6,
        start_date = $7,
        end_date = $8,
        status = $9,
        priority = $10,
        target_url = $11,
        open_in_new_tab = $12,
        notes = $13,
        updated_at = NOW()
      WHERE id = $14
      RETURNING *
      `,
      [
        advertiser_id,
        title,
        description || null,
        campaign_type,
        pricing_model || "flat_fee",
        price || 0,
        start_date || null,
        end_date || null,
        status || "draft",
        priority || 0,
        target_url || null,
        open_in_new_tab !== undefined ? open_in_new_tab : true,
        notes || null,
        id
      ]
    );

    if (!campaignResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Fushata nuk u gjet."
      });
    }

    await client.query(
      `
      DELETE FROM campaign_placements
      WHERE campaign_id = $1
      `,
      [id]
    );

    if (Array.isArray(placements) && placements.length > 0) {
      for (let i = 0; i < placements.length; i++) {
        const placementId = placements[i];

        await client.query(
          `
          INSERT INTO campaign_placements (
            campaign_id,
            placement_id,
            sort_order,
            is_active
          )
          VALUES ($1,$2,$3,$4)
          `,
          [id, placementId, i, true]
        );
      }
    }

    await client.query("COMMIT");

    res.json({
      message: "Fushata u përditësua me sukses.",
      campaign: campaignResult.rows[0]
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("updateCampaign error:", err);
    res.status(500).json({
      message: "Gabim në përditësimin e fushatës."
    });
  } finally {
    client.release();
  }
};

/* DELETE CAMPAIGN */
const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM campaigns
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Fushata nuk u gjet."
      });
    }

    res.json({
      message: "Fushata u fshi me sukses."
    });
  } catch (err) {
    console.error("deleteCampaign error:", err);
    res.status(500).json({
      message: "Gabim në fshirjen e fushatës."
    });
  }
};

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign
};