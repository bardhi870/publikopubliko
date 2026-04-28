import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { trackEvent } from "../../utils/analytics";

const normalizeGalleryImages = (galleryImages) => {
  if (!galleryImages) return [];
  if (Array.isArray(galleryImages)) return galleryImages.filter(Boolean);

  try {
    const parsed = JSON.parse(galleryImages);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const stripHtml = (html = "") =>
  String(html || "")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isPostNew = (createdAt) => {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return diffDays <= 3;
};

const formatPrice = (price) => {
  if (!price) return "Me marrëveshje";
  return `${Number(price).toLocaleString("de-DE")} €`;
};

export default function VehiclePostCard({ post }) {
  const city = post.location || post.city || "";
  const year = post.vehicle_year || post.year || "";
  const fuel = post.fuel_type || post.fuel || "";
  const gearbox = post.transmission || post.gearbox || "";
  const mileage = post.mileage || post.kilometers || "";
  const price = post.price || "";
  const status = post.status || "Aktiv";

  const cleanDescription = stripHtml(post.description);
  const isNew = isPostNew(post.created_at);

  const isFeatured =
    post?.featured === true || post?.featured === "true" || post?.featured === 1;

  const isNewOnly = isNew && !isFeatured;

  const galleryImages = useMemo(
    () => normalizeGalleryImages(post.gallery_images),
    [post.gallery_images]
  );

  const mediaItems = useMemo(() => {
    const allImages = [post.image_url, ...galleryImages].filter(Boolean);
    const uniqueImages = [...new Set(allImages)];

    return uniqueImages.map((url) => ({
      type: "image",
      url
    }));
  }, [post.image_url, galleryImages]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [post.id]);

  useEffect(() => {
    if (mediaItems.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % mediaItems.length);
    }, 3400);

    return () => clearInterval(interval);
  }, [mediaItems.length]);

  const activeMedia = mediaItems[activeIndex];

  const handlePostClick = () => {
    trackEvent({
      event_type: "post_click",
      page_url: window.location.pathname,
      post_id: post.id,
      category: "automjete",
      element_name: "vehicle_post_card"
    });
  };

  return (
    <>
      <style>{`
        .vehicle-card-link {
          width: 100%;
          height: 100%;
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .vehicle-card {
          position: relative;
          width: 100%;
          height: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 28px rgba(15,23,42,0.05);
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
          display: flex;
          flex-direction: column;
          isolation: isolate;
        }

        .vehicle-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 44px rgba(15,23,42,0.12);
          border-color: #cbd5e1;
        }

        .vehicle-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.65) 45%, transparent 70%);
          transform: translateX(-135%);
          transition: transform .75s ease;
          pointer-events: none;
          z-index: 3;
        }

        .vehicle-card:hover::after {
          transform: translateX(135%);
        }

        .vehicle-featured {
          border: 2px solid #facc15;
          box-shadow:
            0 0 0 1px rgba(250,204,21,0.18),
            0 14px 34px rgba(250,204,21,0.22);
        }

        .vehicle-new-card {
          border: 2px solid #0ea5e9;
          box-shadow:
            0 0 0 1px rgba(14,165,233,0.16),
            0 14px 34px rgba(14,165,233,0.18);
        }

        .vehicle-image-wrap {
          position: relative;
          width: 100%;
          height: 185px;
          overflow: hidden;
          background: #eef8ff;
        }

        .vehicle-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .35s ease;
        }

        .vehicle-card:hover .vehicle-image {
          transform: scale(1.04);
        }

        .vehicle-image-fallback {
          width: 100%;
          height: 100%;
          background:
            radial-gradient(circle at 28% 18%, rgba(14,165,233,.18), transparent 34%),
            linear-gradient(135deg,#f8fafc,#e0f2fe);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #020617;
          font-weight: 950;
          font-size: 20px;
        }

        .vehicle-top-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          z-index: 4;
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }

        .vehicle-left-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          align-items: center;
        }

        .vehicle-badge {
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

        .vehicle-badge-featured {
          min-width: 28px;
          background: linear-gradient(135deg,#facc15,#f59e0b);
          color: #fff;
          box-shadow: 0 6px 18px rgba(245,158,11,0.38);
        }

        .vehicle-badge-new {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg,#06b6d4,#2563eb);
          color: #fff;
          box-shadow: 0 6px 18px rgba(37,99,235,0.34);
        }

        .vehicle-badge-new::after {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-20deg);
          animation: vehicleShimmerMove 2.4s infinite;
        }

        @keyframes vehicleShimmerMove {
          0% { left: -120%; }
          100% { left: 130%; }
        }

        .vehicle-status-wrap {
          position: absolute;
          right: 10px;
          bottom: 10px;
          z-index: 4;
        }

        .vehicle-status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 950;
          background: rgba(15,23,42,.78);
          color: #fff;
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 18px rgba(15,23,42,.18);
        }

        .vehicle-slide-dots {
          position: absolute;
          left: 50%;
          bottom: 13px;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          z-index: 4;
        }

        .vehicle-slide-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,.58);
          transition: width .2s ease, background .2s ease;
        }

        .vehicle-slide-dot.active {
          width: 17px;
          background: #fff;
        }

        .vehicle-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .vehicle-city {
          font-size: 13px;
          color: #475569;
          font-weight: 850;
          margin-bottom: 7px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vehicle-title {
          margin: 0 0 10px;
          font-size: 18px;
          line-height: 1.25;
          font-weight: 950;
          color: #020617;
          letter-spacing: -.035em;
          word-break: break-word;
          min-height: 44px;
        }

        .vehicle-desc {
          margin: 0 0 12px;
          font-size: 13px;
          line-height: 1.45;
          color: #475569;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .vehicle-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0 0 14px;
        }

        .vehicle-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 9px;
          border-radius: 999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 11px;
          font-weight: 850;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vehicle-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 7px;
          margin-bottom: 14px;
        }

        .vehicle-stat {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          padding: 9px 6px;
          text-align: center;
          min-width: 0;
        }

        .vehicle-stat-label {
          font-size: 9px;
          font-weight: 900;
          color: #64748b;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: .3px;
        }

        .vehicle-stat-value {
          font-size: 12px;
          font-weight: 950;
          color: #020617;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vehicle-bottom {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .vehicle-price-box {
          min-width: 0;
        }

        .vehicle-price-label {
          font-size: 10px;
          font-weight: 950;
          color: #64748b;
          margin-bottom: 3px;
          text-transform: uppercase;
          letter-spacing: .4px;
        }

        .vehicle-price {
          font-size: 21px;
          font-weight: 950;
          color: #020617;
          line-height: 1;
          letter-spacing: -.045em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vehicle-cta {
          color: #020617;
          font-size: 13px;
          font-weight: 950;
          white-space: nowrap;
          transition: transform .2s ease, color .2s ease;
        }

        .vehicle-card:hover .vehicle-cta {
          color: #2563eb;
          transform: translateX(3px);
        }

        @media (max-width: 640px) {
          .vehicle-card {
            border-radius: 14px;
            box-shadow: 0 8px 20px rgba(15,23,42,.045);
            min-height: 262px;
          }

          .vehicle-card:hover {
            transform: none;
          }

          .vehicle-card::after {
            display: none;
          }

          .vehicle-image-wrap {
            height: 118px;
          }

          .vehicle-image-fallback {
            font-size: 14px;
          }

          .vehicle-top-badges {
            top: 8px;
            left: 8px;
            right: 8px;
          }

          .vehicle-badge {
            font-size: 9.5px;
            padding: 5px 8px;
          }

          .vehicle-badge-featured {
            min-width: 26px;
            padding: 5px 8px;
          }

          .vehicle-status-wrap {
            right: 8px;
            bottom: 8px;
          }

          .vehicle-status-badge {
            font-size: 8.8px;
            padding: 5px 8px;
          }

          .vehicle-slide-dots {
            bottom: 9px;
          }

          .vehicle-body {
            padding: 12px;
          }

          .vehicle-city {
            font-size: 11.3px;
            margin-bottom: 6px;
          }

          .vehicle-title {
            font-size: 13.5px;
            line-height: 1.28;
            min-height: 34px;
            margin-bottom: 9px;
          }

          .vehicle-desc {
            display: none;
          }

          .vehicle-chips {
            gap: 5px;
            margin-bottom: 11px;
          }

          .vehicle-chip {
            font-size: 9.6px;
            padding: 5px 7px;
          }

          .vehicle-stats {
            grid-template-columns: 1fr;
            gap: 5px;
            margin-bottom: 11px;
          }

          .vehicle-stat {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            text-align: left;
            min-height: 30px;
            padding: 6px 8px;
            border-radius: 10px;
          }

          .vehicle-stat-label {
            font-size: 8px;
            margin-bottom: 0;
          }

          .vehicle-stat-value {
            max-width: 58%;
            text-align: right;
            font-size: 10px;
          }

          .vehicle-bottom {
            gap: 6px;
            padding-top: 10px;
          }

          .vehicle-price-label {
            font-size: 8px;
          }

          .vehicle-price {
            font-size: 15px;
            max-width: 90px;
          }

          .vehicle-cta {
            font-size: 10.8px;
            max-width: 86px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `}</style>

      <Link
        to={`/automjete/${post.id}`}
        className="vehicle-card-link"
        onClick={handlePostClick}
      >
        <article
          className={`vehicle-card ${isFeatured ? "vehicle-featured" : ""} ${
            isNewOnly ? "vehicle-new-card" : ""
          }`}
        >
          <div className="vehicle-image-wrap">
            {activeMedia ? (
              <img
                src={activeMedia.url}
                alt={post.title || "Automjet"}
                className="vehicle-image"
                loading="lazy"
              />
            ) : (
              <div className="vehicle-image-fallback">Automjet</div>
            )}

            <div className="vehicle-top-badges">
              <div className="vehicle-left-badges">
                <span className="vehicle-badge">Auto</span>
                {isFeatured && (
                  <span className="vehicle-badge vehicle-badge-featured">⭐</span>
                )}
              </div>

              {isNew && <span className="vehicle-badge vehicle-badge-new">E RE</span>}
            </div>

            <div className="vehicle-status-wrap">
              <span className="vehicle-status-badge">{status}</span>
            </div>

            {mediaItems.length > 1 && (
              <div className="vehicle-slide-dots">
                {mediaItems.map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    className={`vehicle-slide-dot ${
                      dotIndex === activeIndex ? "active" : ""
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="vehicle-body">
            {city && <div className="vehicle-city">📍 {city}</div>}

            <h3 className="vehicle-title">{post.title}</h3>

            {cleanDescription && (
              <p className="vehicle-desc">{cleanDescription}</p>
            )}

            {(fuel || gearbox) && (
              <div className="vehicle-chips">
                {fuel && <span className="vehicle-chip">{fuel}</span>}
                {gearbox && <span className="vehicle-chip">{gearbox}</span>}
              </div>
            )}

            <div className="vehicle-stats">
              <div className="vehicle-stat">
                <div className="vehicle-stat-label">Viti</div>
                <div className="vehicle-stat-value">{year || "—"}</div>
              </div>

              <div className="vehicle-stat">
                <div className="vehicle-stat-label">Km</div>
                <div className="vehicle-stat-value">
                  {mileage ? `${mileage} km` : "—"}
                </div>
              </div>

              <div className="vehicle-stat">
                <div className="vehicle-stat-label">Ndërr.</div>
                <div className="vehicle-stat-value">{gearbox || "—"}</div>
              </div>
            </div>

            <div className="vehicle-bottom">
              <div className="vehicle-price-box">
                <div className="vehicle-price-label">Çmimi</div>
                <div className="vehicle-price">{formatPrice(price)}</div>
              </div>

              <span className="vehicle-cta">Shiko detajet →</span>
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}