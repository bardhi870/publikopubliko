import React from "react";
import { Link } from "react-router-dom";

const categoryLabels = {
  vendi: "Vendi",
  rajoni: "Rajoni",
  bota: "Bota",
};

const formatDate = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("sq-AL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

function HeroCard({ post, large = false }) {
  if (!post) return null;

  const link = post.slug
    ? `/lajme/artikulli/${post.slug}`
    : `/lajme/artikulli/${post.id}`;

  const categoryLabel = categoryLabels[post.category] || "Lajm";
  const hasVideo = !!post.video_url;

  return (
    <Link
      to={link}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        height: "100%",
      }}
    >
      <article
        style={{
          position: "relative",
          height: "100%",
          minHeight: large ? "520px" : "250px",
          borderRadius: "0px",
          overflow: "hidden",
          background: "#0f172a",
          boxShadow: "none",
          border: "1px solid #dbe3ea",
          transition: "border-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#cbd5e1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#dbe3ea";
        }}
      >
        {hasVideo ? (
          <video
            src={post.video_url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              background: "#000",
            }}
          />
        ) : post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #334155 100%)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: large
              ? "linear-gradient(to top, rgba(2,6,23,0.90) 10%, rgba(2,6,23,0.35) 55%, rgba(2,6,23,0.06) 100%)"
              : "linear-gradient(to top, rgba(2,6,23,0.88) 12%, rgba(2,6,23,0.28) 65%, rgba(2,6,23,0.06) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: large ? "28px" : "20px",
            display: "flex",
            flexDirection: "column",
            gap: large ? "14px" : "10px",
            zIndex: 2,
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
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "7px 12px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.14)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.03em",
                border: "1px solid rgba(255,255,255,0.16)",
              }}
            >
              {categoryLabel}
            </span>

            {hasVideo && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "7px 12px",
                  borderRadius: "999px",
                  background: "rgba(220,38,38,0.16)",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.03em",
                  border: "1px solid rgba(255,255,255,0.16)",
                }}
              >
                ▶ Video
              </span>
            )}

            {post.created_at && (
              <span
                style={{
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {formatDate(post.created_at)}
              </span>
            )}
          </div>

          <h1
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: large
                ? "clamp(28px, 5vw, 50px)"
                : "clamp(18px, 2vw, 24px)",
              lineHeight: large ? 1.02 : 1.12,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              maxWidth: large ? "90%" : "100%",
            }}
          >
            {post.title}
          </h1>

          {(post.excerpt || post.description) && (
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.82)",
                fontSize: large ? "16px" : "14px",
                lineHeight: 1.6,
                maxWidth: large ? "78%" : "100%",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.excerpt || post.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

export default function NewsHero({ posts = [] }) {
  if (!posts || posts.length === 0) return null;

  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 3);

  return (
    <section
      style={{
        marginBottom: "38px",
      }}
    >
      <div
        className="news-hero-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.45fr 0.9fr",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <HeroCard post={mainPost} large />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            gap: "20px",
            minWidth: 0,
          }}
        >
          {sidePosts.map((post) => (
            <HeroCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <style>
        {`
          @media (max-width: 1024px) {
            .news-hero-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </section>
  );
}