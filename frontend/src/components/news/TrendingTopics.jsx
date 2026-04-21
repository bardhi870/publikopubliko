import React from "react";
import { Link } from "react-router-dom";

export default function TrendingTopics({ posts = [] }) {
  const topics = [
    {
      label: "Vendi",
      slug: "vendi",
      link: "/lajme/vendi",
    },
    {
      label: "Rajoni",
      slug: "rajoni",
      link: "/lajme/rajoni",
    },
    {
      label: "Bota",
      slug: "bota",
      link: "/lajme/bota",
    },
  ];

  return (
    <section
      style={{
        marginBottom: "34px",
      }}
    >
      <div
        style={{
          marginBottom: "14px",
          fontSize: "13px",
          fontWeight: 800,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "#2563eb",
        }}
      >
        Trending Topics
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {topics.map((topic) => {
          const count = posts.filter(
            (p) => p.category === topic.slug
          ).length;

          return (
            <Link
              key={topic.label}
              to={topic.link}
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                border: "1px solid #dbe3ea",
                background: "#fff",
                color: "#0f172a",
                fontWeight: 700,
                borderRadius: "0px",
              }}
            >
              <span>
                #{topic.label}
              </span>

              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#2563eb",
                }}
              >
                ({count})
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}