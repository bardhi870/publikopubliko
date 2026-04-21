import React from "react";
import { formatDate } from "../../utils/postHelpers";

export default function AdminPostsList({
  filteredPosts,
  posts,
  postsByCategory,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  categoryLabels,
  onEdit,
  onDelete
}) {
  const getFeatures = (offerFeatures) => {
    let features = [];

    try {
      features = offerFeatures
        ? typeof offerFeatures === "string"
          ? JSON.parse(offerFeatures)
          : offerFeatures
        : [];
    } catch {
      features = [];
    }

    return Array.isArray(features) ? features : [];
  };

  const isNewsCategory = (category) =>
    ["vendi", "rajoni", "bota"].includes(category);

  return (
    <div>
      <div style={filtersWrap}>
        <button
          onClick={() => setSelectedCategoryFilter("all")}
          style={
            selectedCategoryFilter === "all"
              ? activeFilter
              : filterBtn
          }
        >
          Të gjitha ({posts.length})
        </button>

        {postsByCategory.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategoryFilter(cat.value)}
            style={
              selectedCategoryFilter === cat.value
                ? activeFilter
                : filterBtn
            }
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div style={emptyState}>
          Nuk ka postime për këtë kategori.
        </div>
      ) : (
        <div className="posts-grid-pro" style={grid}>
          {filteredPosts.map((post) => {
            const features = getFeatures(post.offer_features);
            const showEditorialBadges = isNewsCategory(post.category);

            return (
              <div key={post.id} style={card}>
                <div style={imageWrap}>
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      style={image}
                    />
                  ) : (
                    <div style={noImage}>Pa foto</div>
                  )}

                  <div style={imageOverlay}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      <span style={badge}>
                        {categoryLabels?.[post.category] || post.category}
                      </span>

                      {showEditorialBadges && post.featured ? (
                        <span style={featuredBadge}>
                          ⭐ Featured
                        </span>
                      ) : null}

                      {showEditorialBadges && post.breaking ? (
                        <span style={breakingBadge}>
                          🔴 Breaking
                        </span>
                      ) : null}
                    </div>

                    <span style={post.is_active ? activeStatus : inactiveStatus}>
                      {post.is_active ? "Aktiv" : "Jo aktiv"}
                    </span>
                  </div>
                </div>

                <div style={body}>
                  <div style={topMeta}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap"
                      }}
                    >
                      <span>{formatDate(post.created_at)}</span>

                      {post.offer_badge ? (
                        <span style={offerBadge}>{post.offer_badge}</span>
                      ) : null}
                    </div>

                    {showEditorialBadges && (post.featured || post.breaking) ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap"
                        }}
                      >
                        {post.featured ? (
                          <span style={metaFeaturedBadge}>Featured</span>
                        ) : null}

                        {post.breaking ? (
                          <span style={metaBreakingBadge}>Breaking</span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <h3 style={title}>{post.title}</h3>

                  {post.description ? (
                    <p style={desc}>
                      {post.description.length > 120
                        ? `${post.description.slice(0, 120)}...`
                        : post.description}
                    </p>
                  ) : null}

                  {(post.price || post.city || post.rooms) ? (
                    <div className="post-info-grid" style={infoGrid}>
                      {post.price ? (
                        <div style={infoBox}>
                          <div style={label}>ÇMIMI</div>
                          <div style={value}>{post.price} €</div>
                        </div>
                      ) : null}

                      {post.city ? (
                        <div style={infoBox}>
                          <div style={label}>QYTETI</div>
                          <div style={value}>{post.city}</div>
                        </div>
                      ) : null}

                      {post.rooms ? (
                        <div style={infoBox}>
                          <div style={label}>DHOMA</div>
                          <div style={value}>{post.rooms}</div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {features.length > 0 ? (
                    <div style={featuresWrap}>
                      {features.slice(0, 3).map((feature, index) => (
                        <div key={index} style={featureItem}>
                          <span style={featureIcon}>
                            {feature.included ? "✔" : "✖"}
                          </span>
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {(post.phone || post.whatsapp) ? (
                    <div style={contactBox}>
                      <div style={contactTitle}>KONTAKTI</div>

                      {post.phone ? (
                        <div style={contactRow}>📞 {post.phone}</div>
                      ) : null}

                      {post.whatsapp ? (
                        <div style={contactRow}>💬 {post.whatsapp}</div>
                      ) : null}
                    </div>
                  ) : null}

                  <div style={actions}>
                    <button
                      onClick={() => onEdit(post)}
                      style={editBtn}
                    >
                      Edito
                    </button>

                    <button
                      onClick={() => onDelete(post.id)}
                      style={deleteBtn}
                    >
                      Fshij
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 1380px) {
          .posts-grid-pro {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 820px) {
          .posts-grid-pro {
            grid-template-columns: 1fr !important;
          }

          .post-info-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const filtersWrap = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "18px"
};

const filterBtn = {
  border: "1px solid #dbeafe",
  background: "#fff",
  padding: "10px 14px",
  borderRadius: "999px",
  fontWeight: "800",
  cursor: "pointer",
  color: "#0f172a"
};

const activeFilter = {
  ...filterBtn,
  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
  color: "#fff",
  border: "1px solid #2563eb",
  boxShadow: "0 10px 22px rgba(37,99,235,0.18)"
};

const emptyState = {
  textAlign: "center",
  padding: "44px 20px",
  border: "1px dashed #cbd5e1",
  borderRadius: "18px",
  color: "#64748b",
  background: "#fff"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "20px"
};

const card = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 16px 35px rgba(15,23,42,0.06)"
};

const imageWrap = {
  position: "relative",
  height: "240px",
  background: "#f8fafc"
};

const image = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block"
};

const noImage = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#94a3b8",
  fontWeight: "700"
};

const imageOverlay = {
  position: "absolute",
  top: "14px",
  left: "14px",
  right: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "10px",
  flexWrap: "wrap"
};

const badge = {
  background: "rgba(255,255,255,0.96)",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "800",
  color: "#2563eb",
  boxShadow: "0 10px 20px rgba(15,23,42,0.08)"
};

const featuredBadge = {
  background: "rgba(254,249,195,0.96)",
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: "800",
  color: "#a16207",
  boxShadow: "0 10px 20px rgba(15,23,42,0.08)"
};

const breakingBadge = {
  background: "rgba(254,226,226,0.96)",
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: "800",
  color: "#dc2626",
  boxShadow: "0 10px 20px rgba(15,23,42,0.08)"
};

const activeStatus = {
  background: "#dcfce7",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "800",
  color: "#15803d"
};

const inactiveStatus = {
  background: "#fee2e2",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "800",
  color: "#b91c1c"
};

const body = {
  padding: "20px"
};

const topMeta = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
  fontSize: "13px",
  color: "#64748b",
  marginBottom: "10px"
};

const offerBadge = {
  background: "#fff7ed",
  color: "#c2410c",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "800"
};

const metaFeaturedBadge = {
  background: "#fef9c3",
  color: "#a16207",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "800"
};

const metaBreakingBadge = {
  background: "#fee2e2",
  color: "#dc2626",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "800"
};

const title = {
  fontSize: "24px",
  fontWeight: "900",
  margin: "0 0 10px",
  color: "#0f172a",
  lineHeight: "1.25"
};

const desc = {
  fontSize: "14px",
  lineHeight: "1.65",
  color: "#64748b",
  margin: "0 0 16px"
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "12px",
  marginBottom: "16px"
};

const infoBox = {
  background: "#f8fafc",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  minHeight: "82px"
};

const label = {
  fontSize: "11px",
  fontWeight: "800",
  color: "#64748b",
  marginBottom: "6px",
  letterSpacing: "0.04em"
};

const value = {
  fontSize: "18px",
  fontWeight: "900",
  color: "#0f172a",
  lineHeight: "1.3",
  wordBreak: "break-word"
};

const featuresWrap = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "14px",
  marginBottom: "16px"
};

const featureItem = {
  display: "flex",
  gap: "8px",
  alignItems: "flex-start",
  color: "#334155",
  fontSize: "13px",
  marginBottom: "8px"
};

const featureIcon = {
  fontWeight: "900",
  minWidth: "16px"
};

const contactBox = {
  background: "#f8fafc",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  marginBottom: "18px"
};

const contactTitle = {
  fontWeight: "900",
  marginBottom: "8px",
  color: "#0f172a",
  fontSize: "13px",
  letterSpacing: "0.04em"
};

const contactRow = {
  marginBottom: "6px",
  color: "#475569",
  fontSize: "14px"
};

const actions = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px"
};

const editBtn = {
  border: "none",
  padding: "14px",
  borderRadius: "14px",
  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
  color: "#fff",
  fontWeight: "900",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(37,99,235,0.18)"
};

const deleteBtn = {
  border: "1px solid #fecaca",
  padding: "14px",
  borderRadius: "14px",
  background: "#fff5f5",
  color: "#dc2626",
  fontWeight: "900",
  cursor: "pointer"
};