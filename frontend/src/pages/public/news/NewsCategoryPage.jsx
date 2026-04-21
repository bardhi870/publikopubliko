import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import PublicHeader from "../../../components/layout/PublicHeader";
import PublicFooter from "../../../components/layout/PublicFooter";
import NewsCard from "../../../components/news/NewsCard";
import AdSlot from "../../../components/ads/AdSlot";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const categoryConfig = {
  vendi: {
    title: "Vendi",
    eyebrow: "Lajme Kombëtare",
    description:
      "Ngjarjet më të rëndësishme nga vendi, të organizuara qartë dhe me paraqitje editoriale moderne."
  },
  rajoni: {
    title: "Rajoni",
    eyebrow: "Lajme Rajonale",
    description:
      "Zhvillimet kryesore nga rajoni, me përmbajtje të kuruar dhe paraqitje të pastër profesionale."
  },
  bota: {
    title: "Bota",
    eyebrow: "Lajme Ndërkombëtare",
    description:
      "Historitë dhe zhvillimet më të rëndësishme nga bota, në një faqe moderne dhe serioze lajmesh."
  }
};

function InlineSponsoredCard() {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #ffffff 0%, #f8fafc 45%, #eef2ff 100%)",
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
        minHeight: "100%"
      }}
    >
      <div
        style={{
          padding: "14px 14px 0"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "12px"
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "7px 11px",
                borderRadius: "999px",
                background: "#ffffff",
                border: "1px solid rgba(15,23,42,0.08)",
                color: "#475569",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase"
              }}
            >
              Sponsoruar
            </span>

            <span
              style={{
                color: "#64748b",
                fontSize: "12px",
                fontWeight: 700
              }}
            >
              Partner Content
            </span>
          </div>

          <span
            style={{
              color: "#94a3b8",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}
          >
            Inline Placement
          </span>
        </div>
      </div>

      <div style={{ padding: "0 14px 14px" }}>
        <AdSlot placement="news_inline_1" />
      </div>
    </div>
  );
}

export default function NewsCategoryPage() {
  const { category } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = categoryConfig[category] || {
    title: "Lajme",
    eyebrow: "Kategori",
    description: "Përmbajtje editoriale e organizuar sipas kategorive."
  };

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];

        const filtered = safeData
          .filter((item) => item.category === category)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setPosts(filtered);
      })
      .catch((err) => {
        console.error("Gabim gjatë marrjes së lajmeve:", err);
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  const heroPost = useMemo(() => posts[0] || null, [posts]);
  const gridPosts = useMemo(() => posts.slice(1), [posts]);

  const gridWithInlineAd = useMemo(() => {
    if (!gridPosts.length) return [];

    const items = [...gridPosts];
    const insertIndex = Math.min(3, items.length);
    items.splice(insertIndex, 0, {
      __type: "ad-inline",
      id: "news-inline-ad"
    });

    return items;
  }, [gridPosts]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #f8fafc 50%, #f1f5f9 100%)",
        color: "#0f172a"
      }}
    >
      <PublicHeader />

      <main
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "22px 16px 60px"
        }}
      >
        <section
          style={{
            marginBottom: "28px",
            background: "linear-gradient(135deg, #ffffff, #f8fafc)",
            border: "1px solid rgba(15,23,42,0.06)",
            borderRadius: "30px",
            padding: "28px",
            boxShadow: "0 12px 35px rgba(15,23,42,0.05)"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                padding: "7px 12px",
                borderRadius: "999px",
                background: "rgba(37,99,235,0.08)",
                color: "#1d4ed8",
                border: "1px solid rgba(37,99,235,0.10)",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase"
              }}
            >
              {config.eyebrow}
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(34px, 5vw, 60px)",
                lineHeight: 0.96,
                fontWeight: 900,
                letterSpacing: "-0.05em",
                color: "#0f172a",
                maxWidth: "900px"
              }}
            >
              {config.title}
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "720px",
                color: "#475569",
                fontSize: "16px",
                lineHeight: 1.75
              }}
            >
              {config.description}
            </p>
          </div>
        </section>

        {loading ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(15,23,42,0.06)",
              padding: "40px 24px",
              textAlign: "center",
              color: "#64748b",
              borderRadius: "24px"
            }}
          >
            Duke ngarkuar lajmet...
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(15,23,42,0.06)",
              padding: "40px 24px",
              textAlign: "center",
              color: "#64748b",
              borderRadius: "24px"
            }}
          >
            Nuk ka lajme në këtë kategori.
          </div>
        ) : (
          <>
            <section
              style={{
                marginBottom: "30px",
                borderRadius: "28px",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #eef2ff 100%)",
                border: "1px solid rgba(15,23,42,0.06)",
                boxShadow: "0 15px 45px rgba(15,23,42,0.06)",
                padding: "18px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "14px"
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 900,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#475569",
                      background: "#fff",
                      border: "1px solid rgba(15,23,42,0.08)",
                      padding: "8px 12px",
                      borderRadius: "999px"
                    }}
                  >
                    Sponsoruar
                  </span>

                  <span
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      fontWeight: 600
                    }}
                  >
                    Partner Promovues
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontWeight: 700
                  }}
                >
                  News Premium Placement
                </div>
              </div>

              <AdSlot placement="news_top_banner" />
            </section>

            {heroPost && (
              <section style={{ marginBottom: "28px" }}>
                <NewsCard post={heroPost} variant="large" />
              </section>
            )}

            {gridWithInlineAd.length > 0 && (
              <section
                className="news-category-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "18px",
                  alignItems: "stretch"
                }}
              >
                {gridWithInlineAd.map((item, index) => {
                  if (item.__type === "ad-inline") {
                    return (
                      <InlineSponsoredCard
                        key={item.id || `inline-ad-${index}`}
                      />
                    );
                  }

                  return (
                    <NewsCard
                      key={item.id}
                      post={item}
                      variant="default"
                    />
                  );
                })}
              </section>
            )}
          </>
        )}
      </main>

      <PublicFooter />

      <style>
        {`
          @media (max-width: 1024px) {
            .news-category-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 680px) {
            .news-category-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}