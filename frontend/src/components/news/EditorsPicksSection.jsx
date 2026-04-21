import React from "react";
import NewsCard from "./NewsCard";

export default function EditorsPicksSection({ posts = [] }) {
  if (!posts.length) return null;

  const mainPost = posts[0];
  const sidePosts = posts.slice(1);

  return (
    <section
      style={{
        marginBottom: "46px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
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
            background: "linear-gradient(180deg, #dc2626, #991b1b)",
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
          Zgjedhjet e redaksisë
        </h2>
      </div>

      <div
        className="editors-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "18px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <NewsCard post={mainPost} variant="large" />
        </div>

        <div
          style={{
            display: "grid",
            gap: "16px",
            minWidth: 0,
          }}
        >
          {sidePosts.map((post) => (
            <NewsCard
              key={post.id}
              post={post}
              variant="compact"
              showExcerpt={false}
            />
          ))}
        </div>
      </div>

      <style>
        {`
          @media (max-width: 980px) {
            .editors-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </section>
  );
}