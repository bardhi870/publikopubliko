import React from "react";
import { Link } from "react-router-dom";

export default function MostReadSection({ posts = [] }) {
  if (!posts.length) return null;

  const mostRead = [...posts]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5);

  return (
    <section
      style={{
        marginTop: "42px",
        marginBottom: "42px",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "28px",
          fontWeight: 900,
          color: "#0f172a",
          letterSpacing: "-0.03em",
        }}
      >
        Më të lexuarat
      </h2>

      <div
        style={{
          display: "grid",
          gap: "0px",
          borderTop: "1px solid #dbe3ea",
        }}
      >
        {mostRead.map((post, i) => {
          const link = post.slug
            ? `/lajme/artikulli/${post.slug}`
            : `/lajme/artikulli/${post.id}`;

          const hasVideo = !!post.video_url;

          return (
            <Link
              key={post.id}
              to={link}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                gap: "14px",
                alignItems: "start",
                textDecoration: "none",
                color: "#0f172a",
                borderBottom: "1px solid #dbe3ea",
                padding: "16px 0",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "#2563eb",
                  lineHeight: 1,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "18px",
                    lineHeight: 1.35,
                    color: "#0f172a",
                  }}
                >
                  {post.title}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {hasVideo && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "5px 10px",
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

                  <span
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    {post.views_count || 0} lexime
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}