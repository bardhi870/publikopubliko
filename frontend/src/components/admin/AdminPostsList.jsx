import React from "react";
import { formatDate } from "../../utils/postHelpers";

export default function AdminPostsList({
  filteredPosts,
  posts,
  postsByCategory,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  categoryLabels,
  onToggleFeatured,
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

  const shorten = (text, max = 78) => {
    if (!text) return "";
    return text.length > max ? `${text.slice(0, max)}...` : text;
  };

  return (
    <div>
      <div style={filtersWrap}>
        <button
          onClick={() => setSelectedCategoryFilter("all")}
          style={selectedCategoryFilter === "all" ? activeFilter : filterBtn}
        >
          Të gjitha ({posts.length})
        </button>

        {postsByCategory.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategoryFilter(cat.value)}
            style={
              selectedCategoryFilter === cat.value ? activeFilter : filterBtn
            }
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div style={emptyState}>Nuk ka postime për këtë kategori.</div>
      ) : (
        <div className="posts-grid-pro" style={grid}>
          {filteredPosts.map((post) => {
            const features = getFeatures(post.offer_features);
            const showEditorialBadges = true;

            return (
              <div key={post.id} style={card}>
                <div style={imageWrap}>
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} style={image} />
                  ) : (
                    <div style={noImage}>Pa foto</div>
                  )}

                  <div style={imageOverlay}>
                    <span style={badge}>
                      {categoryLabels?.[post.category] || post.category}
                    </span>

                    <span style={post.is_active ? activeStatus : inactiveStatus}>
                      {post.is_active ? "Aktiv" : "Jo aktiv"}
                    </span>
                  </div>

                  {(post.featured || post.breaking) ? (
                    <div style={editorialBadgesRow}>
                      {post.featured ? (
                        <span style={featuredBadge}>⭐ Featured</span>
                      ) : null}

                      {post.breaking ? (
                        <span style={breakingBadge}>🔴 Breaking</span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div style={body}>
                  <div style={topMeta}>
                    <span>{formatDate(post.created_at)}</span>

                    {post.offer_badge ? (
                      <span style={offerBadge}>{post.offer_badge}</span>
                    ) : null}
                  </div>

                  <h3 style={title}>{shorten(post.title, 42)}</h3>

                  {post.description ? (
                    <p style={desc}>{shorten(post.description, 88)}</p>
                  ) : null}

                  {(post.price || post.city || post.rooms) ? (
                    <div className="post-info-grid" style={infoGrid}>
                      {post.price ? (
                        <div style={infoBox}>
                          <div style={label}>Çmimi</div>
                          <div style={value}>{post.price} €</div>
                        </div>
                      ) : null}

                      {post.city ? (
                        <div style={infoBox}>
                          <div style={label}>Qyteti</div>
                          <div style={value}>{post.city}</div>
                        </div>
                      ) : null}

                      {post.rooms ? (
                        <div style={infoBox}>
                          <div style={label}>Dhoma</div>
                          <div style={value}>{post.rooms}</div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {features.length > 0 ? (
                    <div style={featuresWrap}>
                      {features.slice(0, 2).map((feature, index) => (
                        <div key={index} style={featureItem}>
                          <span style={featureIcon}>
                            {feature.included ? "✔" : "✖"}
                          </span>
                          <span>{shorten(feature.text, 24)}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {(post.phone || post.whatsapp) ? (
                    <div style={contactBox}>
                      <div style={contactTitle}>Kontakti</div>

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
    onClick={() => onToggleFeatured(post)}
    style={{
      ...editBtn,
      background: post.featured
        ? "linear-gradient(135deg,#f59e0b,#facc15)"
        : "#e2e8f0",
      color: post.featured ? "#fff" : "#334155"
    }}
  >
    {post.featured ? "⭐ Featured" : "☆ Feature"}
  </button>

  <button onClick={() => onEdit(post)} style={editBtn}>
    Edito
  </button>

  <button onClick={() => onDelete(post.id)} style={deleteBtn}>
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
        @media (min-width: 1700px) {
          .posts-grid-pro {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 1699px) and (min-width: 1280px) {
          .posts-grid-pro {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 1279px) and (min-width: 900px) {
          .posts-grid-pro {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 899px) and (min-width: 620px) {
          .posts-grid-pro {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 619px) {
          .posts-grid-pro {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 720px) {
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
  padding: "9px 13px",
  borderRadius: "999px",
  fontWeight: "800",
  cursor: "pointer",
  color: "#0f172a",
  fontSize: "13px"
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
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "16px"
};

const card = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "22px",
  overflow: "hidden",
  boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
  transition: "transform .18s ease, box-shadow .18s ease"
};

const imageWrap = {
  position: "relative",
  height: "160px",
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
  fontWeight: "700",
  fontSize: "14px"
};

const imageOverlay = {
  position: "absolute",
  top: "10px",
  left: "10px",
  right: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "8px",
  flexWrap: "wrap"
};

const editorialBadgesRow = {
  position: "absolute",
  left: "10px",
  bottom: "10px",
  display: "flex",
  gap: "8px",
  flexWrap: "wrap"
};

const badge = {
  background: "rgba(255,255,255,0.96)",
  padding: "7px 12px",
  borderRadius: "999px",
  fontWeight: "800",
  color: "#2563eb",
  boxShadow: "0 8px 18px rgba(15,23,42,0.08)",
  fontSize: "12px"
};

const featuredBadge = {
  background: "rgba(254,249,195,0.96)",
  padding: "7px 10px",
  borderRadius: "999px",
  fontWeight: "800",
  color: "#a16207",
  boxShadow: "0 8px 18px rgba(15,23,42,0.08)",
  fontSize: "12px"
};

const breakingBadge = {
  background: "rgba(254,226,226,0.96)",
  padding: "7px 10px",
  borderRadius: "999px",
  fontWeight: "800",
  color: "#dc2626",
  boxShadow: "0 8px 18px rgba(15,23,42,0.08)",
  fontSize: "12px"
};

const activeStatus = {
  background: "#dcfce7",
  padding: "7px 12px",
  borderRadius: "999px",
  fontWeight: "800",
  color: "#15803d",
  fontSize: "12px"
};

const inactiveStatus = {
  background: "#fee2e2",
  padding: "7px 12px",
  borderRadius: "999px",
  fontWeight: "800",
  color: "#b91c1c",
  fontSize: "12px"
};

const body = {
  padding: "14px"
};

const topMeta = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "8px"
};

const offerBadge = {
  background: "#fff7ed",
  color: "#c2410c",
  padding: "5px 9px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "800"
};

const title = {
  fontSize: "18px",
  fontWeight: "900",
  margin: "0 0 8px",
  color: "#0f172a",
  lineHeight: "1.25"
};

const desc = {
  fontSize: "13px",
  lineHeight: "1.55",
  color: "#64748b",
  margin: "0 0 12px"
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "8px",
  marginBottom: "12px"
};

const infoBox = {
  background: "#f8fafc",
  padding: "10px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  minHeight: "64px"
};

const label = {
  fontSize: "10px",
  fontWeight: "800",
  color: "#64748b",
  marginBottom: "4px",
  letterSpacing: "0.04em",
  textTransform: "uppercase"
};

const value = {
  fontSize: "14px",
  fontWeight: "900",
  color: "#0f172a",
  lineHeight: "1.3",
  wordBreak: "break-word"
};

const featuresWrap = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "10px",
  marginBottom: "12px"
};

const featureItem = {
  display: "flex",
  gap: "7px",
  alignItems: "flex-start",
  color: "#334155",
  fontSize: "12px",
  marginBottom: "6px"
};

const featureIcon = {
  fontWeight: "900",
  minWidth: "14px"
};

const contactBox = {
  background: "#f8fafc",
  padding: "10px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  marginBottom: "12px"
};

const contactTitle = {
  fontWeight: "900",
  marginBottom: "6px",
  color: "#0f172a",
  fontSize: "12px",
  letterSpacing: "0.04em",
  textTransform: "uppercase"
};

const contactRow = {
  marginBottom: "5px",
  color: "#475569",
  fontSize: "13px"
};

const actions = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px"
};

const editBtn = {
  border: "none",
  padding: "10px",
  borderRadius: "12px",
  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
  color: "#fff",
  fontWeight: "900",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(37,99,235,0.18)",
  fontSize: "13px"
};

const deleteBtn = {
  border: "1px solid #fecaca",
  padding: "10px",
  borderRadius: "12px",
  background: "#fff5f5",
  color: "#dc2626",
  fontWeight: "900",
  cursor: "pointer",
  fontSize: "13px"
};