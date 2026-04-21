import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function JobPostCard({ post, index = 0 }) {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = screenWidth <= 640;
  const isNew = index < 30;

  const city = post.city || post.location || "Prishtinë";
  const categoryLabel =
    post.job_category || post.category_name || post.industry || "Konkurs Pune";

  const daysText = useMemo(() => {
    if (!post.active_until) return "E re";

    const today = new Date();
    const endDate = new Date(post.active_until);

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diffMs = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Ka skaduar";
    if (diffDays === 0) return "Sot";
    if (diffDays === 1) return "1 Ditë";

    return `${diffDays} Ditë`;
  }, [post.active_until]);

  const title =
    post.title?.length > (isMobile ? 46 : 54)
      ? `${post.title.slice(0, isMobile ? 46 : 54)}...`
      : post.title;

  return (
    <>
      <style>{`
        .job-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
          height: 100%;
        }

        .job-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 28px rgba(15,23,42,0.05);
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }

        .job-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 38px rgba(15,23,42,0.09);
          border-color: #d7dee8;
        }

        .job-media {
          height: 185px;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #edf2f7;
        }

        .job-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .job-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-weight: 800;
          font-size: 16px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        }

        .job-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(15,23,42,0.44) 0%,
            rgba(15,23,42,0.10) 42%,
            rgba(15,23,42,0) 100%
          );
          pointer-events: none;
        }

        .job-top-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .job-badge-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .job-badge,
        .job-badge-new {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          padding: 6px 10px;
          white-space: nowrap;
        }

        .job-badge {
          background: rgba(255,255,255,0.95);
          color: #0f172a;
          box-shadow: 0 4px 12px rgba(15,23,42,0.08);
        }

        .job-badge-new {
          background: #06b6d4;
          color: #fff;
          box-shadow: 0 4px 12px rgba(6,182,212,0.25);
        }

        .job-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .job-title {
          margin: 0 0 12px;
          font-size: 15px;
          line-height: 1.45;
          font-weight: 800;
          color: #0f172a;
          min-height: 48px;
          word-break: break-word;
        }

        .job-meta-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .job-city {
          font-size: 13px;
          color: #64748b;
          font-weight: 700;
          max-width: 58%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .job-category {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border-radius: 999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 11px;
          font-weight: 800;
          max-width: 42%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .job-footer {
          padding-top: 14px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #64748b;
          margin-top: auto;
        }

        .job-status {
          font-weight: 700;
        }

        .job-status.expired {
          color: #dc2626;
        }

        .job-status.today {
          color: #ea580c;
        }

        .job-cta {
          font-size: 12px;
          font-weight: 800;
          color: #0f172a;
        }

        @media (max-width: 640px) {
          .job-card {
            border-radius: 16px;
          }

          .job-media {
            height: 145px;
          }

          .job-body {
            padding: 14px;
          }

          .job-title {
            font-size: 14px;
            min-height: 40px;
          }

          .job-city {
            font-size: 12px;
          }

          .job-footer {
            font-size: 12px;
          }

          .job-badge,
          .job-badge-new,
          .job-category {
            font-size: 10px;
          }
        }
      `}</style>

      <Link to={`/konkurse-pune/${post.id}`} className="job-card-link">
        <article className="job-card">
          <div className="job-media">
            {post.image_url ? (
              <img src={post.image_url} alt={post.title} className="job-image" />
            ) : (
              <div className="job-fallback">Konkurs Pune</div>
            )}

            <div className="job-overlay" />

            <div className="job-top-badges">
              <div className="job-badge-row">
                <span className="job-badge">Punë</span>
              </div>

              {isNew && <span className="job-badge-new">E RE</span>}
            </div>
          </div>

          <div className="job-body">
            <div className="job-meta-top">
              <span className="job-city">📍 {city}</span>
              <span className="job-category" title={categoryLabel}>
                {categoryLabel}
              </span>
            </div>

            <h3 className="job-title">{title}</h3>

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

              <span className="job-cta">Shiko detajet</span>
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}