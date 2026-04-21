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

const RealEstatePostCard = ({ post, index = 0 }) => {
  const propertyType = post.property_type || post.propertyType || "";
  const listingType = post.listing_type || post.listingType || "";
  const priceType = post.price_type || post.priceType || "";
  const city = post.city || "";
  const area = post.area || post.area_m2 || post.square_meters || "";
  const rooms = post.rooms || "";
  const bathrooms = post.bathrooms || post.bathroom || "";
  const phone = post.phone || post.contact_phone || "";
  const whatsapp = post.whatsapp || post.whatsapp_number || "";
  const activeFrom = post.active_from || post.activeFrom || "";
  const activeUntil = post.active_until || post.activeUntil || "";
  const status = post.status || "Aktiv";

  const isNew = index < 30;

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
        .re-card-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .re-card-link {
          width: 100%;
          max-width: 860px;
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .re-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(15,23,42,0.07);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .re-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 50px rgba(15,23,42,0.10);
        }

        .re-image-wrap {
          position: relative;
          width: 100%;
          height: 340px;
          overflow: hidden;
          background: #f8fafc;
        }

        .re-image,
        .re-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .re-image-fallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 55%, #fed7aa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c2410c;
          font-weight: 800;
          font-size: 24px;
        }

        .re-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,23,42,0.58) 0%, rgba(15,23,42,0.12) 45%, rgba(15,23,42,0) 100%);
          pointer-events: none;
        }

        .re-top-badges {
          position: absolute;
          top: 18px;
          left: 18px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          z-index: 2;
        }

        .re-status {
          position: absolute;
          right: 18px;
          bottom: 18px;
          z-index: 2;
        }

        .re-slide-dots {
          position: absolute;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          display: flex;
          gap: 7px;
          z-index: 2;
        }

        .re-slide-dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,255,255,0.4);
          transition: all 0.2s ease;
        }

        .re-slide-dot.active {
          width: 22px;
          background: #ffffff;
        }

        .re-video-badge {
          position: absolute;
          left: 18px;
          bottom: 18px;
          z-index: 2;
          background: rgba(15,23,42,0.86);
          color: #fff;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .re-badge-white,
        .re-badge-orange,
        .re-badge-dark,
        .re-badge-soft,
        .re-badge-new {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-weight: 800;
          white-space: nowrap;
        }

        .re-badge-white {
          background: rgba(255,255,255,0.96);
          color: #0f172a;
          padding: 9px 14px;
          font-size: 12px;
          box-shadow: 0 4px 14px rgba(15,23,42,0.08);
        }

        .re-badge-orange {
          background: #f97316;
          color: #fff;
          padding: 9px 14px;
          font-size: 12px;
          box-shadow: 0 4px 14px rgba(249,115,22,0.22);
        }

        .re-badge-dark {
          background: rgba(15,23,42,0.92);
          color: #fff;
          padding: 9px 15px;
          font-size: 12px;
        }

        .re-badge-soft {
          background: #fff7ed;
          color: #c2410c;
          border: 1px solid #fdba74;
          padding: 7px 12px;
          font-size: 12px;
        }

        .re-badge-new {
          background: #06b6d4;
          color: #fff;
          padding: 9px 14px;
          font-size: 12px;
          box-shadow: 0 4px 14px rgba(6,182,212,0.22);
        }

        .re-body {
          padding: 22px;
        }

        .re-row-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .re-city {
          font-size: 14px;
          color: #64748b;
          font-weight: 700;
        }

        .re-title {
          margin: 0 0 10px;
          font-size: 32px;
          line-height: 1.15;
          font-weight: 900;
          color: #0f172a;
          word-break: break-word;
        }

        .re-desc {
          margin: 0 0 18px;
          font-size: 15px;
          line-height: 1.7;
          color: #475569;
        }

        .re-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .re-stat {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 14px 12px;
          text-align: center;
        }

        .re-stat-label {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 6px;
        }

        .re-stat-value {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }

        .re-meta {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 18px;
        }

        .re-dates {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
          font-weight: 600;
        }

        .re-bottom {
          border-top: 1px solid #e2e8f0;
          padding-top: 18px;
        }

        .re-price-label {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .re-price {
          font-size: 38px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.05;
          margin-bottom: 16px;
        }

        .re-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .re-btn {
          text-decoration: none;
          text-align: center;
          padding: 14px 16px;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .re-btn-phone {
          background: #0f172a;
          color: #fff;
        }

        .re-btn-wa {
          background: #16a34a;
          color: #fff;
        }

        .re-note {
          margin-top: 12px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .re-card-link {
            max-width: 100%;
          }

          .re-card {
            border-radius: 22px;
          }

          .re-image-wrap {
            height: 250px;
          }

          .re-top-badges {
            top: 14px;
            left: 14px;
          }

          .re-status {
            right: 14px;
            bottom: 14px;
          }

          .re-slide-dots {
            bottom: 14px;
          }

          .re-video-badge {
            left: 14px;
            bottom: 14px;
            font-size: 11px;
            padding: 7px 11px;
          }

          .re-badge-white,
          .re-badge-orange,
          .re-badge-dark,
          .re-badge-soft,
          .re-badge-new {
            font-size: 11px;
          }

          .re-badge-white,
          .re-badge-orange,
          .re-badge-new {
            padding: 7px 11px;
          }

          .re-badge-dark {
            padding: 8px 12px;
          }

          .re-body {
            padding: 16px;
          }

          .re-title {
            font-size: 24px;
          }

          .re-desc {
            font-size: 14px;
            margin-bottom: 14px;
          }

          .re-stats {
            gap: 8px;
          }

          .re-stat {
            padding: 11px 8px;
            border-radius: 15px;
          }

          .re-stat-label {
            font-size: 10px;
          }

          .re-stat-value {
            font-size: 14px;
          }

          .re-dates {
            font-size: 12px;
          }

          .re-price {
            font-size: 30px;
          }

          .re-buttons {
            grid-template-columns: 1fr;
          }

          .re-btn {
            width: 100%;
            padding: 13px 14px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="re-card-wrap">
        <Link to={`/patundshmeri/${post.id}`} className="re-card-link">
          <article className="re-card">
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
                    alt={post.title}
                    className="re-image"
                  />
                )
              ) : (
                <div className="re-image-fallback">Patundshmëri</div>
              )}

              <div className="re-overlay" />

              <div className="re-top-badges">
                <span className="re-badge-white">Patundshmëri</span>
                {listingType && <span className="re-badge-orange">{listingType}</span>}
                {isNew && <span className="re-badge-new">E RE</span>}
              </div>

              <div className="re-status">
                <span className="re-badge-dark">{status}</span>
              </div>

              {activeMedia?.type === "video" && (
                <div className="re-video-badge">▶ Video</div>
              )}

              {mediaItems.length > 1 && (
                <div className="re-slide-dots">
                  {mediaItems.map((_, dotIndex) => (
                    <span
                      key={dotIndex}
                      className={`re-slide-dot ${dotIndex === activeIndex ? "active" : ""}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="re-body">
              <div className="re-row-top">
                {city ? <div className="re-city">📍 {city}</div> : <div />}
                {propertyType && <span className="re-badge-soft">{propertyType}</span>}
              </div>

              <h3 className="re-title">{post.title}</h3>

              {post.description && (
                <p className="re-desc">
                  {post.description.length > 120
                    ? `${post.description.slice(0, 120)}...`
                    : post.description}
                </p>
              )}

              <div className="re-stats">
                <div className="re-stat">
                  <div className="re-stat-label">Sipërfaqja</div>
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

              {(priceType || activeFrom || activeUntil) && (
                <div className="re-meta">
                  {priceType && <span className="re-badge-soft">{priceType}</span>}

                  {(activeFrom || activeUntil) && (
                    <div className="re-dates">
                      {activeFrom && <div>Aktiv nga: {formatDate(activeFrom)}</div>}
                      {activeUntil && <div>Aktiv deri: {formatDate(activeUntil)}</div>}
                    </div>
                  )}
                </div>
              )}

              <div className="re-bottom">
                <div className="re-price-label">Çmimi</div>
                <div className="re-price">
                  {post.price ? `${post.price} €` : "Me marrëveshje"}
                </div>

                <div className="re-buttons">
                  {phoneLink && (
                    <a
                      href={phoneLink}
                      className="re-btn re-btn-phone"
                      onClick={(e) => e.stopPropagation()}
                    >
                      📞 Telefono
                    </a>
                  )}

                  {whatsappLink && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="re-btn re-btn-wa"
                      onClick={(e) => e.stopPropagation()}
                    >
                      WhatsApp
                    </a>
                  )}
                </div>

                <div className="re-note">
                  Kliko për të parë detajet e plota të pronës.
                </div>
              </div>
            </div>
          </article>
        </Link>
      </div>
    </>
  );
};

export default RealEstatePostCard;