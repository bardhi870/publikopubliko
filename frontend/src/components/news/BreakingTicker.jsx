import React from "react";
import { Link } from "react-router-dom";

export default function BreakingTicker({ posts = [] }) {
  if (!posts || posts.length === 0) return null;

  const tickerItems = [...posts, ...posts];

  const animationDuration = Math.max(28, posts.length * 7);

  return (
    <section
      style={{
        width: "100%",
        marginBottom: "22px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          alignItems: "stretch",
          borderRadius: "0px",
          overflow: "hidden",
          border: "1px solid #dbe3ea",
          background: "#ffffff",
          boxShadow: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "0 18px",
            minHeight: "54px",
            background: "#dc2626",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            borderRadius: "0px",
            zIndex: 2,
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              background: "#ffffff",
              flexShrink: 0,
            }}
          />
          Breaking
        </div>

        <div
          className="breaking-ticker-viewport"
          style={{
            position: "relative",
            overflow: "hidden",
            minWidth: 0,
            background: "#ffffff",
          }}
        >
          <div
            className="breaking-ticker-marquee"
            style={{
              animationDuration: `${animationDuration}s`,
            }}
          >
            {tickerItems.map((post, index) => {
              const link = post.slug
                ? `/lajme/artikulli/${post.slug}`
                : `/lajme/artikulli/${post.id}`;

              const hasVideo = !!post.video_url;

              return (
                <React.Fragment key={`${post.id || index}-${index}`}>
                  <Link
                    to={link}
                    className="breaking-ticker-link"
                    style={{
                      textDecoration: "none",
                      color: "#0f172a",
                      fontSize: "14px",
                      fontWeight: 700,
                      lineHeight: 1.2,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      minWidth: "max-content",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {hasVideo && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "4px 8px",
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

                    <span>{post.title}</span>
                  </Link>

                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "999px",
                      background: "rgba(15,23,42,0.18)",
                      flexShrink: 0,
                    }}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <style>
        {`
          .breaking-ticker-viewport {
            min-height: 54px;
            display: flex;
            align-items: center;
          }

          .breaking-ticker-marquee {
            display: inline-flex;
            align-items: center;
            gap: 18px;
            white-space: nowrap;
            padding: 0 18px;
            min-width: max-content;
            animation-name: breakingTickerMove;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }

          .breaking-ticker-viewport:hover .breaking-ticker-marquee {
            animation-play-state: paused;
          }

          .breaking-ticker-link:hover {
            color: #1d4ed8 !important;
          }

          @keyframes breakingTickerMove {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @media (max-width: 680px) {
            .breaking-ticker-marquee {
              padding: 0 14px !important;
              gap: 14px !important;
            }
          }
        `}
      </style>
    </section>
  );
}