const router = require("express").Router();
const db = require("../../config/db");

/*
  helpers
*/
function buildDateFilter(range, from, to) {
  if (from && to) {
    return {
      clause: `created_at::date BETWEEN $1 AND $2`,
      values: [from, to]
    };
  }

  switch (range) {
    case "today":
      return {
        clause: `created_at::date = CURRENT_DATE`,
        values: []
      };

    case "7d":
      return {
        clause: `created_at >= NOW() - INTERVAL '7 days'`,
        values: []
      };

    case "30d":
      return {
        clause: `created_at >= NOW() - INTERVAL '30 days'`,
        values: []
      };

    case "month":
      return {
        clause: `DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`,
        values: []
      };

    case "year":
      return {
        clause: `DATE_TRUNC('year', created_at) = DATE_TRUNC('year', CURRENT_DATE)`,
        values: []
      };

    default:
      return {
        clause: `created_at >= NOW() - INTERVAL '30 days'`,
        values: []
      };
  }
}

function getChartGrouping(range, from, to) {
  if (range === "year") {
    return {
      selectLabel: `TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS label`,
      groupBy: `DATE_TRUNC('month', created_at)`,
      orderBy: `DATE_TRUNC('month', created_at)`
    };
  }

  if (from && to) {
    const start = new Date(from);
    const end = new Date(to);

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (diffDays > 90) {
        return {
          selectLabel: `TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS label`,
          groupBy: `DATE_TRUNC('month', created_at)`,
          orderBy: `DATE_TRUNC('month', created_at)`
        };
      }
    }
  }

  return {
    selectLabel: `TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS label`,
    groupBy: `DATE(created_at)`,
    orderBy: `DATE(created_at)`
  };
}

/*
  OVERVIEW
*/
router.get("/overview", async (req, res) => {
  try {
    const { range = "30d", from, to } = req.query;
    const dateFilter = buildDateFilter(range, from, to);

    const result = await db.query(
      `
      SELECT
        COUNT(*) FILTER (WHERE event_type = 'page_view')::int AS total_page_views,

        COUNT(DISTINCT COALESCE(visitor_id, ip_hash))::int AS unique_visitors,

        COUNT(*) FILTER (
          WHERE event_type IN (
            'post_click',
            'category_click',
            'search_used',
            'search_result_click',
            'filter_used',
            'whatsapp_click',
            'phone_click',
            'email_click',
            'contact_form_submit',
            'ad_click',
            'sponsored_post_click',
            'load_more_click'
          )
        )::int AS total_clicks,

        COUNT(*) FILTER (WHERE event_type = 'whatsapp_click')::int AS whatsapp_clicks,
        COUNT(*) FILTER (WHERE event_type = 'phone_click')::int AS phone_clicks,
        COUNT(*) FILTER (WHERE event_type = 'email_click')::int AS email_clicks,
        COUNT(*) FILTER (WHERE event_type = 'ad_impression')::int AS ad_impressions,
        COUNT(*) FILTER (WHERE event_type = 'ad_click')::int AS ad_clicks,

        COALESCE(
          AVG(duration_seconds) FILTER (WHERE event_type = 'time_on_page'),
          0
        )::int AS avg_time_seconds

      FROM analytics_events
      WHERE ${dateFilter.clause}
      `,
      dateFilter.values
    );

    const row = result.rows[0] || {};

    const adCtr =
      Number(row.ad_impressions || 0) > 0
        ? Number(
            (
              (Number(row.ad_clicks || 0) / Number(row.ad_impressions || 0)) *
              100
            ).toFixed(2)
          )
        : 0;

    const avgSeconds = Number(row.avg_time_seconds || 0);

    return res.json({
      success: true,
      filter: {
        range,
        from: from || null,
        to: to || null
      },
      data: {
        total_page_views: Number(row.total_page_views || 0),
        unique_visitors: Number(row.unique_visitors || 0),
        total_clicks: Number(row.total_clicks || 0),
        whatsapp_clicks: Number(row.whatsapp_clicks || 0),
        phone_clicks: Number(row.phone_clicks || 0),
        email_clicks: Number(row.email_clicks || 0),
        ad_impressions: Number(row.ad_impressions || 0),
        ad_clicks: Number(row.ad_clicks || 0),
        ad_ctr: adCtr,
        avg_time_seconds: avgSeconds,
        avg_time_minutes: Number((avgSeconds / 60).toFixed(2))
      }
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load analytics overview"
    });
  }
});

/*
  CHART
*/
router.get("/chart", async (req, res) => {
  try {
    const { range = "30d", from, to } = req.query;
    const dateFilter = buildDateFilter(range, from, to);
    const grouping = getChartGrouping(range, from, to);

    const result = await db.query(
      `
      SELECT
        ${grouping.selectLabel},
        COUNT(*) FILTER (WHERE event_type = 'page_view')::int AS page_views,
        COUNT(*) FILTER (
          WHERE event_type IN (
            'post_click',
            'category_click',
            'search_used',
            'search_result_click',
            'filter_used',
            'whatsapp_click',
            'phone_click',
            'email_click',
            'contact_form_submit',
            'ad_click',
            'sponsored_post_click',
            'load_more_click'
          )
        )::int AS clicks,
        COUNT(DISTINCT COALESCE(visitor_id, ip_hash))::int AS unique_visitors,
        COUNT(*) FILTER (WHERE event_type = 'ad_impression')::int AS ad_impressions,
        COUNT(*) FILTER (WHERE event_type = 'ad_click')::int AS ad_clicks
      FROM analytics_events
      WHERE ${dateFilter.clause}
      GROUP BY ${grouping.groupBy}
      ORDER BY ${grouping.orderBy} ASC
      `,
      dateFilter.values
    );

    return res.json({
      success: true,
      filter: {
        range,
        from: from || null,
        to: to || null
      },
      data: result.rows
    });
  } catch (error) {
    console.error("Analytics chart error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load analytics chart"
    });
  }
});

/*
  TOP PAGES
*/
router.get("/top-pages", async (req, res) => {
  try {
    const { range = "30d", from, to } = req.query;
    const dateFilter = buildDateFilter(range, from, to);

    const result = await db.query(
      `
      SELECT
        COALESCE(page_url, 'unknown') AS page_url,
        COUNT(*) FILTER (WHERE event_type = 'page_view')::int AS views,
        COUNT(DISTINCT COALESCE(visitor_id, ip_hash))::int AS unique_visitors,
        COUNT(*) FILTER (
          WHERE event_type IN (
            'post_click',
            'category_click',
            'search_used',
            'search_result_click',
            'filter_used',
            'whatsapp_click',
            'phone_click',
            'email_click',
            'contact_form_submit',
            'ad_click',
            'sponsored_post_click',
            'load_more_click'
          )
        )::int AS clicks
      FROM analytics_events
      WHERE ${dateFilter.clause}
      GROUP BY page_url
      ORDER BY views DESC, unique_visitors DESC, clicks DESC
      LIMIT 20
      `,
      dateFilter.values
    );

    return res.json({
      success: true,
      filter: {
        range,
        from: from || null,
        to: to || null
      },
      data: result.rows
    });
  } catch (error) {
    console.error("Analytics top pages error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load top pages"
    });
  }
});

/*
  TOP ACTIONS
*/
router.get("/top-actions", async (req, res) => {
  try {
    const { range = "30d", from, to } = req.query;
    const dateFilter = buildDateFilter(range, from, to);

    const result = await db.query(
      `
      SELECT
        event_type,
        COUNT(*)::int AS total
      FROM analytics_events
      WHERE ${dateFilter.clause}
      GROUP BY event_type
      ORDER BY total DESC
      `,
      dateFilter.values
    );

    return res.json({
      success: true,
      filter: {
        range,
        from: from || null,
        to: to || null
      },
      data: result.rows
    });
  } catch (error) {
    console.error("Analytics top actions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load top actions"
    });
  }
});

/*
  ADS
*/
router.get("/ads", async (req, res) => {
  try {
    const { range = "30d", from, to } = req.query;
    const dateFilter = buildDateFilter(range, from, to);

    const result = await db.query(
      `
      SELECT
        COALESCE(ad_id, 0) AS ad_id,
        COUNT(*) FILTER (WHERE event_type = 'ad_impression')::int AS impressions,
        COUNT(*) FILTER (WHERE event_type = 'ad_click')::int AS clicks
      FROM analytics_events
      WHERE ${dateFilter.clause}
        AND event_type IN ('ad_impression', 'ad_click')
      GROUP BY ad_id
      ORDER BY clicks DESC, impressions DESC
      LIMIT 20
      `,
      dateFilter.values
    );

    const formatted = result.rows.map((item) => {
      const impressions = Number(item.impressions || 0);
      const clicks = Number(item.clicks || 0);

      return {
        ad_id: Number(item.ad_id || 0),
        impressions,
        clicks,
        ctr:
          impressions > 0
            ? Number(((clicks / impressions) * 100).toFixed(2))
            : 0
      };
    });

    return res.json({
      success: true,
      filter: {
        range,
        from: from || null,
        to: to || null
      },
      data: formatted
    });
  } catch (error) {
    console.error("Analytics ads error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load ads analytics"
    });
  }
});

/*
  COUNTRIES
*/
router.get("/countries", async (req, res) => {
  try {
    const { range = "30d", from, to } = req.query;
    const dateFilter = buildDateFilter(range, from, to);

    const result = await db.query(
      `
      SELECT
        COALESCE(NULLIF(country, ''), 'Unknown') AS country,
        COUNT(*) FILTER (WHERE event_type = 'page_view')::int AS total
      FROM analytics_events
      WHERE ${dateFilter.clause}
      GROUP BY COALESCE(NULLIF(country, ''), 'Unknown')
      ORDER BY total DESC
      LIMIT 10
      `,
      dateFilter.values
    );

    return res.json({
      success: true,
      filter: {
        range,
        from: from || null,
        to: to || null
      },
      data: result.rows
    });
  } catch (error) {
    console.error("Analytics countries error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load countries analytics"
    });
  }
});

/*
  CITIES
*/
router.get("/cities", async (req, res) => {
  try {
    const { range = "30d", from, to } = req.query;
    const dateFilter = buildDateFilter(range, from, to);

    const result = await db.query(
      `
      SELECT
        COALESCE(NULLIF(city, ''), 'Unknown') AS city,
        COALESCE(NULLIF(country, ''), 'Unknown') AS country,
        COUNT(*) FILTER (WHERE event_type = 'page_view')::int AS total
      FROM analytics_events
      WHERE ${dateFilter.clause}
      GROUP BY
        COALESCE(NULLIF(city, ''), 'Unknown'),
        COALESCE(NULLIF(country, ''), 'Unknown')
      ORDER BY total DESC
      LIMIT 10
      `,
      dateFilter.values
    );

    return res.json({
      success: true,
      filter: {
        range,
        from: from || null,
        to: to || null
      },
      data: result.rows
    });
  } catch (error) {
    console.error("Analytics cities error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load cities analytics"
    });
  }
});

/*
  DEVICES
*/
router.get("/devices", async (req, res) => {
  try {
    const { range = "30d", from, to } = req.query;
    const dateFilter = buildDateFilter(range, from, to);

    const result = await db.query(
      `
      SELECT
        COALESCE(NULLIF(device, ''), NULLIF(device_type, ''), 'Unknown') AS device,
        COUNT(*)::int AS total
      FROM analytics_events
      WHERE ${dateFilter.clause}
      GROUP BY COALESCE(NULLIF(device, ''), NULLIF(device_type, ''), 'Unknown')
      ORDER BY total DESC
      `,
      dateFilter.values
    );

    return res.json({
      success: true,
      filter: {
        range,
        from: from || null,
        to: to || null
      },
      data: result.rows
    });
  } catch (error) {
    console.error("Analytics devices error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load devices analytics"
    });
  }
});

/*
  TIME ON PAGE
*/
router.get("/time", async (req, res) => {
  try {
    const { range = "30d", from, to } = req.query;
    const dateFilter = buildDateFilter(range, from, to);

    const result = await db.query(
      `
      SELECT
        COALESCE(AVG(duration_seconds), 0)::int AS avg_time_seconds,
        COUNT(*) FILTER (WHERE event_type = 'time_on_page')::int AS samples
      FROM analytics_events
      WHERE ${dateFilter.clause}
        AND event_type = 'time_on_page'
      `,
      dateFilter.values
    );

    const row = result.rows[0] || {};
    const avgSeconds = Number(row.avg_time_seconds || 0);

    return res.json({
      success: true,
      filter: {
        range,
        from: from || null,
        to: to || null
      },
      data: {
        avg_time_seconds: avgSeconds,
        avg_time_minutes: Number((avgSeconds / 60).toFixed(2)),
        samples: Number(row.samples || 0)
      }
    });
  } catch (error) {
    console.error("Analytics time error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load time analytics"
    });
  }
});

module.exports = router;