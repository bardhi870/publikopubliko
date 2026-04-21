import React from "react";
import { Link } from "react-router-dom";
import NewsCard from "./NewsCard";

export default function NewsSection({
  title = "Lajme",
  posts = [],
  viewAllLink = "/lajme",
}) {
  if (!posts || posts.length === 0) return null;

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 4);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "22px",
        marginBottom: "42px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "4px",
              height: "28px",
              borderRadius: "0px",
              background: "linear-gradient(180deg, #2563eb, #7c3aed)",
            }}
          />

          <h2
            style={{
              margin: 0,
              fontSize: "30px",
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#0f172a",
            }}
          >
            {title}
          </h2>
        </div>

        <Link
          to={viewAllLink}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "#1d4ed8",
            fontWeight: 700,
            fontSize: "14px",

            padding: "0",
            margin: 0,

            background: "none",
            border: "none",
            boxShadow: "none",

            transition: "color .2s ease, opacity .2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#1e40af";
            e.currentTarget.style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#1d4ed8";
            e.currentTarget.style.opacity = "1";
          }}
        >
          Shiko të gjitha →
        </Link>
      </div>

      <div
        className="news-section-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "20px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <NewsCard
            post={featuredPost}
            variant="large"
            enableManualMediaNav={true}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "16px",
            minWidth: 0,
          }}
        >
          {secondaryPosts.map((post) => (
            <NewsCard
              key={post.id}
              post={post}
              variant="compact"
              showExcerpt={false}
              enableManualMediaNav={true}
            />
          ))}
        </div>
      </div>

      <style>
        {`
          @media (max-width:980px){
            .news-section-grid{
              grid-template-columns:1fr !important;
            }
          }
        `}
      </style>
    </section>
  );
}