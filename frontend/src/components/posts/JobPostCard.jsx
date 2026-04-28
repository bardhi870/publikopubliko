import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { trackEvent } from "../../utils/analytics";

export default function JobPostCard({ post, index = 0 }) {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = screenWidth <= 640;
  const isNew = index < 30;

  const isFeatured =
    post?.featured === true || post?.featured === "true" || post?.featured === 1;

  const isNewOnly = isNew && !isFeatured;

  const city = post.job_location || post.city || post.location || "Prishtinë";
  const companyName = post.company_name || "";
  const jobCategory = post.job_category || "";
  const positionsCount = post.positions_count || "";
  const workHours = post.work_hours || "";

  const daysText = useMemo(() => {
    if (!post.active_until) return "E re";

    const today = new Date();
    const endDate = new Date(post.active_until);
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "Ka skaduar";
    if (diffDays === 0) return "Sot";
    if (diffDays === 1) return "1 Ditë";
    return `${diffDays} Ditë`;
  }, [post.active_until]);

  const title =
    post.title?.length > (isMobile ? 28 : 54)
      ? `${post.title.slice(0, isMobile ? 28 : 54)}...`
      : post.title;

  const handlePostClick = () => {
    trackEvent({
      event_type: "post_click",
      page_url: window.location.pathname,
      post_id: post.id,
      category: "konkurse-pune",
      element_name: "job_post_card"
    });
  };

  return (
    <>
      <style>{`
        .job-card {
          position: relative;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 28px rgba(15,23,42,0.05);
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          isolation: isolate;
        }

        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 44px rgba(15,23,42,0.12);
          border-color: #cbd5e1;
        }

        .job-featured {
          border: 2px solid #facc15;
          box-shadow:
            0 0 0 1px rgba(250,204,21,0.18),
            0 14px 34px rgba(250,204,21,0.22);
        }

        .job-new-card {
          border: 2px solid #0ea5e9;
          box-shadow:
            0 0 0 1px rgba(14,165,233,0.16),
            0 14px 34px rgba(14,165,233,0.18);
        }

        .job-media {
          height: 185px;
          position: relative;
          overflow: hidden;
          background: #eef8ff;
        }

        .job-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .35s ease;
        }

        .job-card:hover .job-image {
          transform: scale(1.04);
        }

        .job-fallback {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 950;
          color: #020617;
          background:
            radial-gradient(circle at 28% 18%, rgba(14,165,233,.18), transparent 34%),
            linear-gradient(135deg,#f8fafc,#e0f2fe);
        }

        .job-top-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          justify-content: space-between;
          gap: 8px;
          z-index: 4;
        }

        .job-left-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          align-items: center;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          background: rgba(255,255,255,0.94);
          color: #020617;
          box-shadow: 0 5px 14px rgba(15,23,42,0.10);
          white-space: nowrap;
          backdrop-filter: blur(8px);
        }

        .badge-featured {
          min-width: 28px;
          background: linear-gradient(135deg,#facc15,#f59e0b);
          color: #fff;
          box-shadow: 0 6px 18px rgba(245,158,11,0.38);
        }

        .badge-new {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg,#06b6d4,#2563eb);
          color: #fff;
          box-shadow: 0 6px 18px rgba(37,99,235,0.34);
        }

        .badge-new::after {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-20deg);
          animation: shimmerMove 2.4s infinite;
        }

        @keyframes shimmerMove {
          0% { left: -120%; }
          100% { left: 130%; }
        }

        .job-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .job-city {
          font-size: 13px;
          color: #475569;
          font-weight: 850;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-company {
          font-size: 12px;
          color: #64748b;
          font-weight: 800;
          margin-bottom: 9px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-title {
          margin: 0 0 12px;
          font-size: 16px;
          line-height: 1.35;
          color: #020617;
          font-weight: 950;
          min-height: 42px;
          word-break: break-word;
        }

        .job-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0 0 14px;
        }

        .job-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 9px;
          border-radius: 999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 11px;
          font-weight: 850;
        }

        .job-footer {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #475569;
          font-weight: 850;
        }

        .job-status.expired { color: #dc2626; }
        .job-status.today { color: #ea580c; }

        .job-cta {
          color: #020617;
          font-weight: 950;
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .job-card {
            border-radius: 14px;
            box-shadow: 0 8px 20px rgba(15,23,42,.045);
            min-height: 262px;
          }

          .job-card:hover {
            transform: none;
          }

          .job-media {
            height: 118px;
          }

          .job-body {
            padding: 12px;
          }

          .job-title {
            font-size: 13px;
            line-height: 1.28;
            min-height: 32px;
            margin-bottom: 10px;
          }

          .job-city {
            font-size: 11.3px;
            margin-bottom: 5px;
          }

          .job-company {
            font-size: 10.8px;
            margin-bottom: 8px;
          }

          .job-chips {
            gap: 5px;
            margin-bottom: 12px;
          }

          .job-chip {
            font-size: 9.6px;
            padding: 5px 7px;
          }

          .badge {
            font-size: 9.5px;
            padding: 5px 8px;
          }

          .badge-featured {
            min-width: 26px;
            padding: 5px 8px;
          }

          .job-top-badges {
            top: 8px;
            left: 8px;
            right: 8px;
          }

          .job-footer {
            font-size: 10.8px;
            gap: 5px;
            padding-top: 10px;
          }

          .job-cta {
            max-width: 88px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `}</style>

      <Link
        to={`/konkurse-pune/${post.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
          height: "100%"
        }}
        onClick={handlePostClick}
      >
        <article
          className={`job-card ${isFeatured ? "job-featured" : ""} ${
            isNewOnly ? "job-new-card" : ""
          }`}
        >
          <div className="job-media">
            {post.image_url ? (
              <img
                src={post.image_url}
                alt={post.title || "Konkurs"}
                className="job-image"
                loading="lazy"
              />
            ) : (
              <div className="job-fallback">Konkurs</div>
            )}

            <div className="job-top-badges">
              <div className="job-left-badges">
                <span className="badge">Punë</span>
                {isFeatured && <span className="badge badge-featured">⭐</span>}
              </div>

              {isNew && <span className="badge badge-new">E RE</span>}
            </div>
          </div>

          <div className="job-body">
            <div className="job-city">📍 {city}</div>

            {companyName && <div className="job-company">🏢 {companyName}</div>}

            <h3 className="job-title">{title}</h3>

            {(jobCategory || positionsCount || workHours) && (
              <div className="job-chips">
                {jobCategory && <span className="job-chip">{jobCategory}</span>}
                {positionsCount && (
                  <span className="job-chip">{positionsCount} pozita</span>
                )}
                {workHours && <span className="job-chip">{workHours}</span>}
              </div>
            )}

            <div className="job-footer">
              <span
                className={`job-status ${
                  daysText === "Ka skaduar"
                    ? "expired"
                    : daysText === "Sot"
                    ? "today"
                    : ""
                }`}
              >
                {daysText}
              </span>

              <span className="job-cta">Shiko detajet →</span>
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}