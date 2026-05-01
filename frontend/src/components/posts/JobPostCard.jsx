import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { trackEvent } from "../../utils/analytics";

function makeSlug(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[ë]/g, "e")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

 const rawTitle = post?.title || post?.name || "";

const title =
  rawTitle.length > (isMobile ? 28 : 54)
    ? `${rawTitle.slice(0, isMobile ? 28 : 54)}...`
    : rawTitle;

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
          border: 1px solid rgba(191,219,254,.92);
          border-radius: 22px;
          overflow: hidden;
          box-shadow:
            0 14px 34px rgba(15,23,42,.07),
            inset 0 1px 0 rgba(255,255,255,.9);
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          isolation: isolate;
          contain: layout paint;
        }

        .job-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 48px rgba(37,99,235,.15);
          border-color: #60a5fa;
        }

        .job-card::after{
          content:"";
          position:absolute;
          inset:0;
          background:linear-gradient(120deg, transparent 0%, rgba(255,255,255,.55) 45%, transparent 70%);
          transform:translateX(-135%);
          transition:transform .65s ease;
          pointer-events:none;
          z-index:5;
        }

        .job-card:hover::after{
          transform:translateX(135%);
        }

        .job-new-card {
          border: 2px solid #3b82f6;
          box-shadow:
            0 0 0 1px rgba(59,130,246,.14),
            0 16px 38px rgba(37,99,235,.14);
        }

        .job-featured {
          border: 2px solid #facc15;
          background: linear-gradient(180deg,#fffdf5 0%,#ffffff 100%);
          box-shadow:
            0 0 0 1px rgba(250,204,21,.18),
            0 18px 42px rgba(250,204,21,.20);
        }

        .job-featured::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at 18% 0%, rgba(250,204,21,.22), transparent 36%),
            linear-gradient(135deg, rgba(250,204,21,.06), transparent 40%);
          pointer-events:none;
          z-index:1;
        }

        .job-media {
          height: 205px;
          position: relative;
          overflow: hidden;
          background: #eef4ff;
          border-bottom: 1px solid #eaf2ff;
        }

        .job-media::before{
          content:"";
          position:absolute;
          inset:0;
          z-index:2;
          background:
            linear-gradient(180deg,rgba(2,6,23,.10) 0%, transparent 36%, rgba(2,6,23,.24) 100%);
          pointer-events:none;
        }

        .job-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center bottom;
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
          color: #1d4ed8;
          background:
            radial-gradient(circle at 28% 18%, rgba(59,130,246,.18), transparent 34%),
            linear-gradient(135deg,#eff6ff,#dbeafe);
        }

        .job-top-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          justify-content: space-between;
          gap: 7px;
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
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 9.5px;
          font-weight: 950;
          background: rgba(239,246,255,.95);
          color: #1e3a8a;
          border: 1px solid rgba(191,219,254,.95);
          box-shadow: 0 7px 18px rgba(37,99,235,.11);
          white-space: nowrap;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .badge-featured {
          min-width: 27px;
          background: linear-gradient(135deg,#facc15,#f59e0b);
          color: #fff;
          border-color: rgba(254,240,138,.88);
          box-shadow: 0 9px 22px rgba(245,158,11,.32);
        }

        .badge-new {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg,#60a5fa,#2563eb);
          color: #fff;
          border-color: rgba(147,197,253,.72);
          box-shadow: 0 9px 22px rgba(37,99,235,.28);
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
          padding: 13px 14px 14px;
          display: flex;
          flex-direction: column;
          flex: 1;
          position: relative;
          z-index: 2;
          background:
            radial-gradient(circle at 92% 0%,rgba(59,130,246,.05),transparent 28%),
            #fff;
        }

        .job-city {
          display:flex;
          align-items:center;
          gap:5px;
          font-size: 12.2px;
          color: #64748b;
          font-weight: 850;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-company {
          display:flex;
          align-items:center;
          gap:5px;
          font-size: 11.8px;
          color: #64748b;
          font-weight: 850;
          margin-bottom: 7px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-title {
          margin: 0 0 9px;
          font-size: 16.5px;
          line-height: 1.18;
          color: #020617;
          font-weight: 950;
          min-height: 36px;
          letter-spacing:-.03em;
          word-break: break-word;
        }

        .job-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin: 0 0 10px;
        }

        .job-chip {
          display: inline-flex;
          align-items: center;
          padding: 5px 8px;
          border-radius: 999px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
          font-size: 9.5px;
          font-weight: 900;
          max-width:100%;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .job-footer {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid #e5eaf1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          font-weight: 850;
        }

        .job-status {
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-width:0;
          padding:8px 13px;
          border-radius:999px;
          background:linear-gradient(135deg,#3b82f6,#1d4ed8);
          color:#fff;
          font-size:12px;
          font-weight:950;
          line-height:1;
          white-space:nowrap;
          box-shadow:0 10px 22px rgba(37,99,235,.22);
        }

        .job-featured .job-status{
          background:linear-gradient(135deg,#facc15,#f59e0b);
          box-shadow:0 10px 22px rgba(245,158,11,.24);
        }

        .job-status.expired {
          background: linear-gradient(135deg,#ef4444,#dc2626);
          color: #fff;
          box-shadow:0 10px 22px rgba(220,38,38,.18);
        }

        .job-status.today {
          background: linear-gradient(135deg,#f97316,#ea580c);
          color: #fff;
          box-shadow:0 10px 22px rgba(234,88,12,.20);
        }

        .job-cta {
          color: #1d4ed8;
          font-size:11px;
          font-weight: 950;
          white-space: nowrap;
          transition:transform .2s ease,color .2s ease;
        }

        .job-featured .job-cta{
          color:#b45309;
        }

        .job-card:hover .job-cta{
          color:#1e40af;
          transform:translateX(3px);
        }

        .job-featured:hover .job-cta{
          color:#92400e;
        }

        @media (max-width: 640px) {
          .job-card {
            border-radius: 16px;
            box-shadow: 0 9px 22px rgba(15,23,42,.055);
            min-height: 0;
          }

          .job-card:hover {
            transform: none;
          }

          .job-card::after{
            display:none;
          }

          .job-new-card{
            border:1.5px solid #3b82f6;
          }

          .job-featured{
            border:1.5px solid #facc15;
            background:linear-gradient(180deg,#fffdf5 0%,#ffffff 100%);
            box-shadow:
              0 0 0 1px rgba(250,204,21,.18),
              0 14px 28px rgba(250,204,21,.18);
          }

          .job-media {
            height: 150px;
          }

          .job-card:hover .job-image {
            transform: none;
          }

          .job-body {
            padding: 10px;
          }

          .job-title {
            font-size: 12.5px;
            line-height: 1.2;
            min-height: 28px;
            margin-bottom: 7px;
            letter-spacing:-.02em;
          }

          .job-city {
            font-size: 10px;
            margin-bottom: 5px;
          }

          .job-company {
            font-size: 10px;
            margin-bottom: 6px;
          }

          .job-chips {
            gap: 4px;
            margin-bottom: 8px;
          }

          .job-chip {
            font-size: 7.8px;
            padding: 4px 6px;
          }

          .badge {
            font-size: 7.8px;
            padding: 4px 6px;
            min-height:20px;
            max-width:82px;
            overflow:hidden;
            text-overflow:ellipsis;
          }

          .badge-featured {
            min-width: 22px;
            padding: 4px 6px;
          }

          .job-top-badges {
            top: 7px;
            left: 7px;
            right: 7px;
            gap:4px;
          }

          .job-footer {
            gap: 6px;
            padding-top: 8px;
          }

          .job-status{
            padding:7px 9px;
            font-size:10px;
            max-width:86px;
            overflow:hidden;
            text-overflow:ellipsis;
          }

          .job-cta {
            font-size: 8.5px;
            max-width: 58px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        @media(max-width:390px){
          .job-media{
            height:138px;
          }

          .job-body{
            padding:9px;
          }

          .job-title{
            font-size:11.5px;
            min-height:27px;
          }

          .job-chip{
            font-size:7.2px;
            padding:4px 5px;
          }

          .job-status{
            font-size:9.5px;
            padding:6px 8px;
            max-width:78px;
          }

          .job-cta{
            font-size:8px;
            max-width:54px;
          }
        }

        @media(prefers-reduced-motion:reduce){
          .job-card,
          .job-image,
          .job-cta{
            transition:none;
          }

          .badge-new::after{
            animation:none;
          }
        }
      `}</style>

      <Link
        to={`/konkurse-pune/${makeSlug(post?.title || "konkurs-pune")}-${post.id}`}
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
                alt={post.title || "Shpallje"}
                className="job-image"
                loading="lazy"
              />
            ) : (
              <div className="job-fallback">
  {post?.title?.slice(0, 12) || "Shpallje"}
</div>
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