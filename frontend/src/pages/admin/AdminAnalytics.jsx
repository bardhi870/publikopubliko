import React, { useEffect, useMemo, useState } from "react";
import AdminTopNav from "../../components/admin/AdminTopNav";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-US");
}

function buildQuery(filters) {
  const params = new URLSearchParams();

  if (filters.range === "custom") {
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
  } else {
    params.set("range", filters.range);
  }

  return params.toString();
}

function StatCard({ title, value, subtitle, accent = "#0f172a" }) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
        borderRadius: "24px",
        padding: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 14px 36px rgba(15,23,42,0.06)"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-10px",
          width: "90px",
          height: "90px",
          borderRadius: "999px",
          background: `${accent}12`
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: 800,
            color: "#64748b",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.06em"
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "34px",
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1
          }}
        >
          {value}
        </div>

        {subtitle ? (
          <div
            style={{
              marginTop: "12px",
              fontSize: "13px",
              color: "#94a3b8",
              lineHeight: 1.5
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, right, dark = false }) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: dark
          ? "linear-gradient(135deg, #0f172a 0%, #172033 100%)"
          : "#ffffff",
        borderRadius: "26px",
        padding: "22px",
        border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
        boxShadow: dark
          ? "0 18px 50px rgba(15,23,42,0.16)"
          : "0 14px 40px rgba(15,23,42,0.06)"
      }}
    >
      {dark && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at top right, rgba(59,130,246,0.14), transparent 22%), radial-gradient(circle at bottom left, rgba(168,85,247,0.12), transparent 20%)"
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "18px"
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 900,
              color: dark ? "#ffffff" : "#0f172a"
            }}
          >
            {title}
          </h2>

          {subtitle ? (
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "13px",
                color: dark ? "rgba(255,255,255,0.70)" : "#64748b"
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {right}
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

function EmptyState({ text, dark = false }) {
  return (
    <div
      style={{
        padding: "28px 16px",
        textAlign: "center",
        color: dark ? "rgba(255,255,255,0.72)" : "#64748b",
        fontSize: "14px",
        border: dark ? "1px dashed rgba(255,255,255,0.18)" : "1px dashed #cbd5e1",
        borderRadius: "18px",
        background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc"
      }}
    >
      {text}
    </div>
  );
}

function LegendDot({ color, label, dark = false }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        fontWeight: 700,
        color: dark ? "rgba(255,255,255,0.85)" : "#334155"
      }}
    >
      <span
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "999px",
          background: color,
          display: "inline-block"
        }}
      />
      {label}
    </div>
  );
}

function AnalyticsLineChart({ data }) {
  const width = 1000;
  const height = 340;
  const padding = 38;

  if (!data || data.length === 0) {
    return <EmptyState text="Ende nuk ka data për diagram." dark />;
  }

  const maxValue = Math.max(
    ...data.map((item) =>
      Math.max(
        Number(item.page_views || 0),
        Number(item.clicks || 0),
        Number(item.unique_visitors || 0)
      )
    ),
    1
  );

  const stepX =
    data.length > 1
      ? (width - padding * 2) / (data.length - 1)
      : width - padding * 2;

  const getX = (index) => padding + index * stepX;

  const getY = (value) =>
    height - padding - (Number(value || 0) / maxValue) * (height - padding * 2);

  const buildLine = (key) =>
    data
      .map((item, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(item[key])}`)
      .join(" ");

  const buildArea = (key) => {
    const line = data
      .map((item, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(item[key])}`)
      .join(" ");

    return `${line} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;
  };

  const yTicks = 5;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxValue / yTicks) * i)
  ).reverse();

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div style={{ minWidth: "880px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "16px"
          }}
        >
          <LegendDot color="#ffffff" label="Views" dark />
          <LegendDot color="#22c55e" label="Clicks" dark />
          <LegendDot color="#a855f7" label="Unique visitors" dark />
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "340px", display: "block" }}
        >
          <defs>
            <linearGradient id="viewsFillDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
          </defs>

          {tickValues.map((tick, index) => {
            const y = padding + ((height - padding * 2) / yTicks) * index;

            return (
              <g key={tick}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(255,255,255,0.12)"
                  strokeDasharray="4 6"
                />
                <text
                  x={8}
                  y={y + 4}
                  fontSize="12"
                  fill="rgba(255,255,255,0.46)"
                >
                  {formatNumber(tick)}
                </text>
              </g>
            );
          })}

          <path d={buildArea("page_views")} fill="url(#viewsFillDark)" />

          <path
            d={buildLine("page_views")}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={buildLine("clicks")}
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={buildLine("unique_visitors")}
            fill="none"
            stroke="#a855f7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((item, index) => (
            <g key={`${item.label}-${index}`}>
              <circle cx={getX(index)} cy={getY(item.page_views)} r="4.5" fill="#ffffff" />
              <circle cx={getX(index)} cy={getY(item.clicks)} r="4" fill="#22c55e" />
              <circle cx={getX(index)} cy={getY(item.unique_visitors)} r="4" fill="#a855f7" />
            </g>
          ))}

          {data.map((item, index) => (
            <text
              key={`label-${item.label}-${index}`}
              x={getX(index)}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fill="rgba(255,255,255,0.50)"
            >
              {String(item.label).slice(5)}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

function ProgressList({ items }) {
  if (!items.length) {
    return <EmptyState text="Ende nuk ka data." />;
  }

  const max = Math.max(...items.map((item) => Number(item.total || 0)), 1);

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {items.map((item, index) => {
        const total = Number(item.total || 0);
        const percentage = Math.max((total / max) * 100, 4);

        return (
          <div
            key={`${item.event_type}-${index}`}
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "14px"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "10px"
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#0f172a"
                }}
              >
                {item.event_type}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 900,
                  color: "#0f172a"
                }}
              >
                {formatNumber(total)}
              </div>
            </div>

            <div
              style={{
                width: "100%",
                height: "10px",
                borderRadius: "999px",
                background: "#e2e8f0",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  height: "100%",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #0f172a 0%, #334155 100%)"
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PoweredBadge() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(10px)",
        color: "#fff"
      }}
    >
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "999px",
          background: "#38bdf8",
          boxShadow: "0 0 18px rgba(56,189,248,0.8)"
        }}
      />
      <span
        style={{
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.68)"
        }}
      >
        Powered by
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#ffffff"
        }}
      >
        BARDH DAJAKU
      </span>
    </div>
  );
}

export default function AdminAnalytics() {
  const [filters, setFilters] = useState({
    range: "30d",
    from: "",
    to: ""
  });

  const [overview, setOverview] = useState(null);
  const [chart, setChart] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [topActions, setTopActions] = useState([]);
  const [ads, setAds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => buildQuery(filters), [filters]);

  async function fetchAnalytics() {
    try {
      setLoading(true);
      setError("");

      const [overviewRes, chartRes, topPagesRes, topActionsRes, adsRes] =
        await Promise.all([
          fetch(`${API_BASE}/api/admin/analytics/overview?${query}`),
          fetch(`${API_BASE}/api/admin/analytics/chart?${query}`),
          fetch(`${API_BASE}/api/admin/analytics/top-pages?${query}`),
          fetch(`${API_BASE}/api/admin/analytics/top-actions?${query}`),
          fetch(`${API_BASE}/api/admin/analytics/ads?${query}`)
        ]);

      const [
        overviewJson,
        chartJson,
        topPagesJson,
        topActionsJson,
        adsJson
      ] = await Promise.all([
        overviewRes.json(),
        chartRes.json(),
        topPagesRes.json(),
        topActionsRes.json(),
        adsRes.json()
      ]);

      if (!overviewRes.ok) {
        throw new Error(overviewJson.message || "Failed to load analytics");
      }

      setOverview(overviewJson.data || null);
      setChart(chartJson.data || []);
      setTopPages(topPagesJson.data || []);
      setTopActions(topActionsJson.data || []);
      setAds(adsJson.data || []);
    } catch (err) {
      console.error(err);
      setError("Nuk u ngarkuan analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, [query]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(15,23,42,0.06) 0%, #f8fafc 35%, #f8fafc 100%)",
        padding: "28px 16px 44px"
      }}
    >
      <div style={{ maxWidth: "1450px", margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #0f172a 0%, #162033 52%, #1e293b 100%)",
            borderRadius: "30px",
            padding: "28px",
            marginBottom: "22px",
            color: "#fff",
            boxShadow: "0 24px 70px rgba(15,23,42,0.18)"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 22%), radial-gradient(circle at bottom left, rgba(168,85,247,0.12), transparent 20%)"
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                padding: "18px",
                borderRadius: "20px",
                marginBottom: "18px",
                border: "1px solid rgba(255,255,255,0.10)"
              }}
            >
              <h2
                style={{
                  margin: "0 0 14px",
                  fontSize: "22px",
                  fontWeight: "700"
                }}
              >
                Admin Panel
              </h2>

              <AdminTopNav />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "18px",
                flexWrap: "wrap",
                marginBottom: "18px"
              }}
            >
              <div style={{ maxWidth: "820px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 800,
                    marginBottom: "14px"
                  }}
                >
                  LIVE ANALYTICS
                </div>

                <h1
                  style={{
                    margin: 0,
                    fontSize: "clamp(28px, 4vw, 42px)",
                    lineHeight: 1.02,
                    fontWeight: 900,
                    letterSpacing: "-0.03em"
                  }}
                >
                  Premium Analytics Dashboard
                </h1>

                <p
                  style={{
                    margin: "12px 0 0",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.78)",
                    maxWidth: "760px",
                    lineHeight: 1.7
                  }}
                >
                  Statistika reale për vizitat, klikimet, veprimet e përdoruesve dhe
                  performancën e reklamave — me pamje të pastër, premium dhe profesionale.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "12px"
                }}
              >
                <PoweredBadge />

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "flex-end"
                  }}
                >
                  {["today", "7d", "30d", "month", "year"].map((item) => {
                    const active = filters.range === item;

                    return (
                      <button
                        key={item}
                        onClick={() =>
                          setFilters({
                            range: item,
                            from: "",
                            to: ""
                          })
                        }
                        style={{
                          border: active
                            ? "1px solid rgba(255,255,255,0.30)"
                            : "1px solid rgba(255,255,255,0.12)",
                          background: active
                            ? "rgba(255,255,255,0.18)"
                            : "rgba(255,255,255,0.06)",
                          color: "#fff",
                          padding: "11px 14px",
                          borderRadius: "14px",
                          fontWeight: 800,
                          cursor: "pointer",
                          backdropFilter: "blur(8px)"
                        }}
                      >
                        {item === "today"
                          ? "Sot"
                          : item === "7d"
                          ? "7 ditë"
                          : item === "30d"
                          ? "30 ditë"
                          : item === "month"
                          ? "Ky muaj"
                          : "Ky vit"}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        range: "custom"
                      }))
                    }
                    style={{
                      border:
                        filters.range === "custom"
                          ? "1px solid rgba(255,255,255,0.30)"
                          : "1px solid rgba(255,255,255,0.12)",
                      background:
                        filters.range === "custom"
                          ? "rgba(255,255,255,0.18)"
                          : "rgba(255,255,255,0.06)",
                      color: "#fff",
                      padding: "11px 14px",
                      borderRadius: "14px",
                      fontWeight: 800,
                      cursor: "pointer"
                    }}
                  >
                    Custom
                  </button>
                </div>
              </div>
            </div>

            {filters.range === "custom" ? (
              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "18px",
                  borderTop: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  alignItems: "end"
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.8)",
                      marginBottom: "8px"
                    }}
                  >
                    Nga data
                  </div>
                  <input
                    type="date"
                    value={filters.from}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        from: e.target.value
                      }))
                    }
                    style={dateInputStyle}
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.8)",
                      marginBottom: "8px"
                    }}
                  >
                    Deri më
                  </div>
                  <input
                    type="date"
                    value={filters.to}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        to: e.target.value
                      }))
                    }
                    style={dateInputStyle}
                  />
                </div>

                <button
                  onClick={fetchAnalytics}
                  style={{
                    border: "none",
                    background: "#ffffff",
                    color: "#0f172a",
                    padding: "12px 18px",
                    borderRadius: "14px",
                    fontWeight: 900,
                    cursor: "pointer"
                  }}
                >
                  Apliko filtrin
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {loading ? (
          <SectionCard title="Analytics" subtitle="Duke ngarkuar të dhënat...">
            <EmptyState text="Duke ngarkuar analytics..." />
          </SectionCard>
        ) : error ? (
          <SectionCard title="Analytics" subtitle="Gabim në ngarkim">
            <div
              style={{
                color: "#b91c1c",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                padding: "14px",
                borderRadius: "16px"
              }}
            >
              {error}
            </div>
          </SectionCard>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "22px"
              }}
            >
              <StatCard
                title="Page Views"
                value={formatNumber(overview?.total_page_views)}
                subtitle="Shikime totale të faqeve"
                accent="#0f172a"
              />
              <StatCard
                title="Vizitorë unikë"
                value={formatNumber(overview?.unique_visitors)}
                subtitle="Përdorues unikë në periudhë"
                accent="#7c3aed"
              />
              <StatCard
                title="Klikime totale"
                value={formatNumber(overview?.total_clicks)}
                subtitle="Të gjitha veprimet e regjistruara"
                accent="#16a34a"
              />
              <StatCard
                title="WhatsApp Clicks"
                value={formatNumber(overview?.whatsapp_clicks)}
                subtitle="Klikime në WhatsApp"
                accent="#16a34a"
              />
              <StatCard
                title="Phone Clicks"
                value={formatNumber(overview?.phone_clicks)}
                subtitle="Klikime në numër telefoni"
                accent="#0ea5e9"
              />
              <StatCard
                title="Email Clicks"
                value={formatNumber(overview?.email_clicks)}
                subtitle="Klikime në email"
                accent="#f97316"
              />
              <StatCard
                title="Ad Impressions"
                value={formatNumber(overview?.ad_impressions)}
                subtitle="Sa herë janë parë reklamat"
                accent="#6366f1"
              />
              <StatCard
                title="Ad CTR"
                value={`${overview?.ad_ctr || 0}%`}
                subtitle="Përqindja e klikimeve në reklama"
                accent="#06b6d4"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.45fr 0.95fr",
                gap: "16px",
                marginBottom: "22px"
              }}
              className="analytics-mid-grid"
            >
              <SectionCard
                title="Traffic diagram"
                subtitle="Views, clicks dhe vizitorë unikë sipas periudhës"
                dark
              >
                <AnalyticsLineChart data={chart} />
              </SectionCard>

              <SectionCard
                title="Top actions"
                subtitle="Veprimet më të përdorura nga vizitorët"
              >
                <ProgressList items={topActions.slice(0, 8)} />
              </SectionCard>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: "16px",
                marginBottom: "22px"
              }}
              className="analytics-bottom-grid"
            >
              <SectionCard
                title="Top pages"
                subtitle="Faqet më të vizituara në portal"
              >
                {topPages.length === 0 ? (
                  <EmptyState text="Ende nuk ka data për faqet." />
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={thStyle}>Faqja</th>
                          <th style={thStyle}>Views</th>
                          <th style={thStyle}>Unique</th>
                          <th style={thStyle}>Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPages.map((item, index) => (
                          <tr key={`${item.page_url}-${index}`}>
                            <td style={tdStyle}>{item.page_url}</td>
                            <td style={tdStyle}>{formatNumber(item.views)}</td>
                            <td style={tdStyle}>{formatNumber(item.unique_visitors)}</td>
                            <td style={tdStyle}>{formatNumber(item.clicks)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </SectionCard>

              <SectionCard
                title="Ads performance"
                subtitle="Performanca e reklamave aktive"
              >
                {ads.length === 0 ? (
                  <EmptyState text="Ende nuk ka data për reklama." />
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={thStyle}>Ad ID</th>
                          <th style={thStyle}>Impressions</th>
                          <th style={thStyle}>Clicks</th>
                          <th style={thStyle}>CTR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ads.map((item, index) => (
                          <tr key={`${item.ad_id}-${index}`}>
                            <td style={tdStyle}>{item.ad_id}</td>
                            <td style={tdStyle}>{formatNumber(item.impressions)}</td>
                            <td style={tdStyle}>{formatNumber(item.clicks)}</td>
                            <td style={tdStyle}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  padding: "6px 10px",
                                  borderRadius: "999px",
                                  background: "#ecfeff",
                                  color: "#155e75",
                                  fontWeight: 800,
                                  fontSize: "12px"
                                }}
                              >
                                {item.ctr}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </SectionCard>
            </div>

            <SectionCard
              title="Chart data"
              subtitle="Pamje tabelare e të njëjtave të dhëna për kontroll më të saktë"
              right={
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em"
                  }}
                >
                  Powered by BARDH DAJAKU
                </div>
              }
            >
              {chart.length === 0 ? (
                <EmptyState text="Ende nuk ka data për chart." />
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Data</th>
                        <th style={thStyle}>Views</th>
                        <th style={thStyle}>Unique</th>
                        <th style={thStyle}>Clicks</th>
                        <th style={thStyle}>Ad impressions</th>
                        <th style={thStyle}>Ad clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chart.map((item, index) => (
                        <tr key={`${item.label}-${index}`}>
                          <td style={tdStyle}>{item.label}</td>
                          <td style={tdStyle}>{formatNumber(item.page_views)}</td>
                          <td style={tdStyle}>{formatNumber(item.unique_visitors)}</td>
                          <td style={tdStyle}>{formatNumber(item.clicks)}</td>
                          <td style={tdStyle}>{formatNumber(item.ad_impressions)}</td>
                          <td style={tdStyle}>{formatNumber(item.ad_clicks)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 1180px) {
          .analytics-mid-grid,
          .analytics-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          input, select, textarea, button {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

const dateInputStyle = {
  padding: "11px 12px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.10)",
  color: "#fff",
  outline: "none"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "640px"
};

const thStyle = {
  textAlign: "left",
  padding: "13px 12px",
  fontSize: "12px",
  fontWeight: 800,
  color: "#64748b",
  borderBottom: "1px solid #e2e8f0",
  background: "#f8fafc",
  whiteSpace: "nowrap"
};

const tdStyle = {
  padding: "13px 12px",
  fontSize: "14px",
  color: "#0f172a",
  borderBottom: "1px solid #eef2f7",
  whiteSpace: "nowrap"
};