import React from "react";
import { Link } from "react-router-dom";

const categoryLabels = {
  vendi: "Vendi",
  rajoni: "Rajoni",
  bota: "Bota",
};

export default function QuickHeadlines({ posts = [] }) {
  if (!posts.length) return null;

  const headlines = posts.slice(0, 6);

  return (
    <section
      style={{
        marginTop: "42px",
        marginBottom: "42px",
        border: "1px solid #dbe3ea",
        padding: "24px",
        background: "#fff",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "20px",
          fontSize: "28px",
          fontWeight: 900,
          color: "#0f172a",
          letterSpacing: "-0.03em",
        }}
      >
        Lajme të shpejta
      </h2>

      <div
        style={{
          display: "grid",
          gap: "0px",
        }}
      >
        {headlines.map((post) => {
          const link = post.slug
            ? `/lajme/artikulli/${post.slug}`
            : `/lajme/artikulli/${post.id}`;

          const hasVideo = !!post.video_url;

          return (
            <Link
              key={post.id}
              to={link}
              style={{
                textDecoration: "none",
                color: "#0f172a",
                borderBottom: "1px solid #e2e8f0",
                padding: "14px 0",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#2563eb",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {categoryLabels[post.category] || "Lajm"}
                </span>

                {hasVideo && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px 9px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 800,
                      background: "rgba(220,38,38,.92)",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,.14)",
                    }}
                  >
                    ▶ Video
                  </span>
                )}

                {post.created_at && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    {new Date(post.created_at).toLocaleDateString("sq-AL", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: 1.4,
                  color: "#0f172a",
                }}
              >
                {post.title}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}