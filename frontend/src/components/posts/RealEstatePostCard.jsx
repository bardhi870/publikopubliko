import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const formatDate = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

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

export default function RealEstatePostCard({ post, index = 0 }) {
  const propertyType = post.property_type || post.propertyType || "";
  const listingType = post.listing_type || post.listingType || "";
  const priceType = post.price_type || post.priceType || "";
  const city = post.city || post.location || "";
  const area = post.area || post.area_m2 || post.square_meters || "";
  const rooms = post.rooms || "";
  const bathrooms = post.bathrooms || post.bathroom || "";
  const phone = post.phone || post.contact_phone || "";
  const whatsapp = post.whatsapp || post.whatsapp_number || "";
  const activeFrom = post.active_from || post.activeFrom || "";
  const activeUntil = post.active_until || post.activeUntil || "";
  const status = post.status || "Aktiv";

  const isNew = index < 30;

  const isFeatured =
    post?.featured === true || post?.featured === "true" || post?.featured === 1;

  const isNewOnly = isNew && !isFeatured;

  const cleanDescription = stripHtml(post.description);

  const whatsappDigits = String(whatsapp || "").replace(/\D/g, "");
  const whatsappLink = whatsappDigits ? `https://wa.me/${whatsappDigits}` : null;
  const phoneLink = phone ? `tel:${phone}` : null;

  const galleryImages = useMemo(
    () => normalizeGalleryImages(post.gallery_images),
    [post.gallery_images]
  );

  const mediaItems = useMemo(() => {
    const items = [];

    if (post.video_url) {
      items.push({
        type: "video",
        url: post.video_url
      });
    }

    const allImages = [post.image_url, ...galleryImages].filter(Boolean);
    const uniqueImages = [...new Set(allImages)];

    uniqueImages.forEach((url) => {
      items.push({
        type: "image",
        url
      });
    });

    return items;
  }, [post.video_url, post.image_url, galleryImages]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [post.id]);

  useEffect(() => {
    if (mediaItems.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % mediaItems.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [mediaItems.length]);

  const activeMedia = mediaItems[activeIndex];

  return (
    <>
      <style>{`
        .re-card-link {
          width: 100%;
          height: 100%;
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .re-card {
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

        .re-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 44px rgba(15,23,42,0.12);
          border-color: #cbd5e1;
        }

        .re-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.65) 45%, transparent 70%);
          transform: translateX(-135%);
          transition: transform .75s ease;
          pointer-events: none;
          z-index: 3;
        }

        .re-card:hover::after {
          transform: translateX(135%);
        }

        .re-featured {
          border: 2px solid #facc15;
          box-shadow:
            0 0 0 1px rgba(250,204,21,0.18),
            0 14px 34px rgba(250,204,21,0.22);
        }

        .re-new-card {
          border: 2px solid #0ea5e9;
          box-shadow:
            0 0 0 1px rgba(14,165,233,0.16),
            0 14px 34px rgba(14,165,233,0.18);
        }

        .re-image-wrap {
          position: relative;
          width: 100%;
          height: 185px;
          overflow: hidden;
          background: #fff7ed;
        }

        .re-image,
        .re-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .35s ease;
        }

        .re-card:hover .re-image,
        .re-card:hover .re-video {
          transform: scale(1.04);
        }

        .re-image-fallback {
          width: 100%;
          height: 100%;
          background:
            radial-gradient(circle at 28% 18%, rgba(249,115,22,.16), transparent 34%),
            linear-gradient(135deg,#fff7ed,#ffedd5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9a3412;
          font-weight: 950;
          font-size: 18px;
        }

        .re-top-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          justify-content: space-between;
          gap: 8px;
          z-index: 4;
        }

        .re-left-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          align-items: center;
        }

        .re-badge {
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

        .re-badge-featured {
          min-width: 28px;
          background: linear-gradient(135deg,#facc15,#f59e0b);
          color: #fff;
          box-shadow: 0 6px 18px rgba(245,158,11,0.38);
        }

        .re-badge-new {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg,#06b6d4,#2563eb);
          color: #fff;
          box-shadow: 0 6px 18px rgba(37,99,235,0.34);
        }

        .re-badge-new::after {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-20deg);
          animation: reShimmerMove 2.4s infinite;
        }

        @keyframes reShimmerMove {
          0% { left: -120%; }
          100% { left: 130%; }
        }

        .re-status {
          position: absolute;
          right: 10px;
          bottom: 10px;
          z-index: 4;
        }

        .re-status-badge {
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

        .re-video-badge {
          position: absolute;
          left: 10px;
          bottom: 10px;
          z-index: 4;
          background: rgba(15,23,42,0.82);
          color: #fff;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 950;
        }

        .re-slide-dots {
          position: absolute;
          left: 50%;
          bottom: 13px;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          z-index: 4;
        }

        .re-slide-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,.58);
          transition: width .2s ease, background .2s ease;
        }

        .re-slide-dot.active {
          width: 17px;
          background: #fff;
        }

        .re-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .re-city {
          font-size: 13px;
          color: #475569;
          font-weight: 850;
          margin-bottom: 7px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .re-title {
          margin: 0 0 10px;
          font-size: 18px;
          line-height: 1.25;
          font-weight: 950;
          color: #020617;
          letter-spacing: -.035em;
          word-break: break-word;
          min-height: 44px;
        }

        .re-desc {
          margin: 0 0 12px;
          font-size: 13px;
          line-height: 1.45;
          color: #475569;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .re-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0 0 14px;
        }

        .re-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 9px;
          border-radius: 999px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          font-size: 11px;
          font-weight: 850;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .re-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 7px;
          margin-bottom: 14px;
        }

        .re-stat {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          padding: 9px 6px;
          text-align: center;
          min-width: 0;
        }

        .re-stat-label {
          font-size: 9px;
          font-weight: 900;
          color: #64748b;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: .3px;
        }

        .re-stat-value {
          font-size: 12px;
          font-weight: 950;
          color: #020617;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .re-bottom {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .re-price-box {
          min-width: 0;
        }

        .re-price-label {
          font-size: 10px;
          font-weight: 950;
          color: #64748b;
          margin-bottom: 3px;
          text-transform: uppercase;
          letter-spacing: .4px;
        }

        .re-price {
          font-size: 21px;
          font-weight: 950;
          color: #020617;
          line-height: 1;
          letter-spacing: -.045em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .re-cta {
          color: #020617;
          font-size: 13px;
          font-weight: 950;
          white-space: nowrap;
          transition: transform .2s ease, color .2s ease;
        }

        .re-card:hover .re-cta {
          color: #2563eb;
          transform: translateX(3px);
        }

        @media (max-width: 640px) {
          .re-card {
            border-radius: 14px;
            box-shadow: 0 8px 20px rgba(15,23,42,.045);
            min-height: 262px;
          }

          .re-card:hover {
            transform: none;
          }

          .re-card::after {
            display: none;
          }

          .re-image-wrap {
            height: 118px;
          }

          .re-image-fallback {
            font-size: 14px;
          }

          .re-top-badges {
            top: 8px;
            left: 8px;
            right: 8px;
          }

          .re-badge {
            font-size: 9.5px;
            padding: 5px 8px;
          }

          .re-badge-featured {
            min-width: 26px;
            padding: 5px 8px;
          }

          .re-status {
            right: 8px;
            bottom: 8px;
          }

          .re-status-badge {
            font-size: 8.8px;
            padding: 5px 8px;
          }

          .re-video-badge {
            left: 8px;
            bottom: 8px;
            font-size: 8.8px;
            padding: 5px 8px;
          }

          .re-slide-dots {
            bottom: 9px;
          }

          .re-body {
            padding: 12px;
          }

          .re-city {
            font-size: 11.3px;
            margin-bottom: 6px;
          }

          .re-title {
            font-size: 13.5px;
            line-height: 1.28;
            min-height: 34px;
            margin-bottom: 9px;
          }

          .re-desc {
            display: none;
          }

          .re-chips {
            gap: 5px;
            margin-bottom: 11px;
          }

          .re-chip {
            font-size: 9.6px;
            padding: 5px 7px;
          }

          .re-stats {
            grid-template-columns: 1fr;
            gap: 5px;
            margin-bottom: 11px;
          }

          .re-stat {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            text-align: left;
            min-height: 30px;
            padding: 6px 8px;
            border-radius: 10px;
          }

          .re-stat-label {
            font-size: 8px;
            margin-bottom: 0;
          }

          .re-stat-value {
            max-width: 58%;
            text-align: right;
            font-size: 10px;
          }

          .re-bottom {
            gap: 6px;
            padding-top: 10px;
          }

          .re-price-label {
            font-size: 8px;
          }

          .re-price {
            font-size: 15px;
            max-width: 90px;
          }

          .re-cta {
            font-size: 10.8px;
            max-width: 86px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `}</style>

      <Link to={`/patundshmeri/${post.id}`} className="re-card-link">
        <article
          className={`re-card ${isFeatured ? "re-featured" : ""} ${
            isNewOnly ? "re-new-card" : ""
          }`}
        >
          <div className="re-image-wrap">
            {activeMedia ? (
              activeMedia.type === "video" ? (
                <video
                  className="re-video"
                  src={activeMedia.url}
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt={post.title || "Patundshmëri"}
                  className="re-image"
                  loading="lazy"
                />
              )
            ) : (
              <div className="re-image-fallback">Patundshmëri</div>
            )}

            <div className="re-top-badges">
              <div className="re-left-badges">
                <span className="re-badge">Pronë</span>
                {isFeatured && <span className="re-badge re-badge-featured">⭐</span>}
              </div>

              {isNew && <span className="re-badge re-badge-new">E RE</span>}
            </div>

            <div className="re-status">
              <span className="re-status-badge">{status}</span>
            </div>

            {activeMedia?.type === "video" && (
              <div className="re-video-badge">▶ Video</div>
            )}

            {mediaItems.length > 1 && (
              <div className="re-slide-dots">
                {mediaItems.map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    className={`re-slide-dot ${
                      dotIndex === activeIndex ? "active" : ""
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="re-body">
            {city && <div className="re-city">📍 {city}</div>}

            <h3 className="re-title">{post.title}</h3>

            {cleanDescription && <p className="re-desc">{cleanDescription}</p>}

            {(propertyType || listingType || priceType) && (
              <div className="re-chips">
                {propertyType && <span className="re-chip">{propertyType}</span>}
                {listingType && <span className="re-chip">{listingType}</span>}
                {priceType && <span className="re-chip">{priceType}</span>}
              </div>
            )}

            <div className="re-stats">
              <div className="re-stat">
                <div className="re-stat-label">Sip.</div>
                <div className="re-stat-value">{area ? `${area} m²` : "—"}</div>
              </div>

              <div className="re-stat">
                <div className="re-stat-label">Dhoma</div>
                <div className="re-stat-value">{rooms || "—"}</div>
              </div>

              <div className="re-stat">
                <div className="re-stat-label">Banjo</div>
                <div className="re-stat-value">{bathrooms || "—"}</div>
              </div>
            </div>

            <div className="re-bottom">
              <div className="re-price-box">
                <div className="re-price-label">Çmimi</div>
                <div className="re-price">
                  {post.price ? `${post.price} €` : "Me marrëveshje"}
                </div>
              </div>

              <span className="re-cta">Shiko detajet →</span>
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}