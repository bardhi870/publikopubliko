import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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

const VehiclePostCard = ({ post, index = 0 }) => {
  const city = post.city || post.location || "";
  const year = post.year || post.vehicle_year || "";
  const fuel = post.fuel || post.fuel_type || "";
  const gearbox = post.gearbox || post.transmission || "";
  const mileage = post.mileage || post.kilometers || "";
  const price = post.price || "";
  const status = post.status || "Aktiv";

  const isNew = index < 30;

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
    }, 3200);

    return () => clearInterval(interval);
  }, [mediaItems.length]);

  const activeMedia = mediaItems[activeIndex];

  return (
    <>
      <style>{`
        .vehicle-card-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .vehicle-card-link {
          width: 100%;
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .vehicle-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(15,23,42,0.07);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .vehicle-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 50px rgba(15,23,42,0.10);
        }

        .vehicle-image-wrap {
          position: relative;
          width: 100%;
          height: 320px;
          overflow: hidden;
          background: #f8fafc;
        }

        .vehicle-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .vehicle-image-fallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #166534;
          font-weight: 900;
          font-size: 24px;
        }

        .vehicle-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,23,42,0.58) 0%, rgba(15,23,42,0.12) 45%, rgba(15,23,42,0) 100%);
          pointer-events: none;
        }

        .vehicle-top-badges {
          position: absolute;
          top: 18px;
          left: 18px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          z-index: 2;
        }

        .vehicle-status-wrap {
          position: absolute;
          right: 18px;
          bottom: 18px;
          z-index: 2;
        }

        .vehicle-slide-dots {
          position: absolute;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          display: flex;
          gap: 7px;
          z-index: 2;
        }

        .vehicle-slide-dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,255,255,0.4);
          transition: all 0.2s ease;
        }

        .vehicle-slide-dot.active {
          width: 22px;
          background: #ffffff;
        }

        .vehicle-badge-white,
        .vehicle-badge-green,
        .vehicle-badge-dark,
        .vehicle-badge-soft {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-weight: 800;
          white-space: nowrap;
        }

        .vehicle-badge-white {
          background: rgba(255,255,255,0.96);
          color: #0f172a;
          padding: 9px 14px;
          font-size: 12px;
          box-shadow: 0 4px 14px rgba(15,23,42,0.08);
        }

        .vehicle-badge-green {
          background: #06b6d4;
          color: #ffffff;
          padding: 9px 14px;
          font-size: 12px;
          box-shadow: 0 4px 14px rgba(14,165,233,0.22);
        }

        .vehicle-badge-dark {
          background: rgba(15,23,42,0.92);
          color: #fff;
          padding: 9px 15px;
          font-size: 12px;
        }

        .vehicle-badge-soft {
          background: #ecfdf5;
          color: #15803d;
          border: 1px solid #86efac;
          padding: 7px 12px;
          font-size: 12px;
        }

        .vehicle-body {
          padding: 22px;
        }

        .vehicle-row-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .vehicle-city {
          font-size: 14px;
          color: #64748b;
          font-weight: 700;
        }

        .vehicle-title {
          margin: 0 0 10px;
          font-size: 32px;
          line-height: 1.15;
          font-weight: 900;
          color: #0f172a;
          word-break: break-word;
        }

        .vehicle-desc {
          margin: 0 0 18px;
          font-size: 15px;
          line-height: 1.7;
          color: #475569;
        }

        .vehicle-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .vehicle-stat {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 14px 12px;
          text-align: center;
        }

        .vehicle-stat-label {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 6px;
        }

        .vehicle-stat-value {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }

        .vehicle-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 18px;
        }

        .vehicle-bottom {
          border-top: 1px solid #e2e8f0;
          padding-top: 18px;
        }

        .vehicle-price-label {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .vehicle-price {
          font-size: 38px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.05;
          margin-bottom: 16px;
        }

        .vehicle-buttons {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .vehicle-btn {
          text-decoration: none;
          text-align: center;
          padding: 14px 16px;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #16a34a;
          color: #fff;
        }

        .vehicle-note {
          margin-top: 12px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .vehicle-card {
            border-radius: 22px;
          }

          .vehicle-image-wrap {
            height: 250px;
          }

          .vehicle-top-badges {
            top: 14px;
            left: 14px;
          }

          .vehicle-status-wrap {
            right: 14px;
            bottom: 14px;
          }

          .vehicle-slide-dots {
            bottom: 14px;
          }

          .vehicle-badge-white,
          .vehicle-badge-green,
          .vehicle-badge-dark,
          .vehicle-badge-soft {
            font-size: 11px;
          }

          .vehicle-badge-white,
          .vehicle-badge-green {
            padding: 7px 11px;
          }

          .vehicle-badge-dark {
            padding: 8px 12px;
          }

          .vehicle-body {
            padding: 16px;
          }

          .vehicle-title {
            font-size: 24px;
          }

          .vehicle-desc {
            font-size: 14px;
            margin-bottom: 14px;
          }

          .vehicle-stats {
            gap: 8px;
          }

          .vehicle-stat {
            padding: 11px 8px;
            border-radius: 15px;
          }

          .vehicle-stat-label {
            font-size: 10px;
          }

          .vehicle-stat-value {
            font-size: 14px;
          }

          .vehicle-price {
            font-size: 30px;
          }

          .vehicle-btn {
            width: 100%;
            padding: 13px 14px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="vehicle-card-wrap">
        <Link to={`/automjete/${post.id}`} className="vehicle-card-link">
          <article className="vehicle-card">
            <div className="vehicle-image-wrap">
              {activeMedia ? (
                <img
                  src={activeMedia.url}
                  alt={post.title}
                  className="vehicle-image"
                />
              ) : (
                <div className="vehicle-image-fallback">Automjet</div>
              )}

              <div className="vehicle-overlay" />

              <div className="vehicle-top-badges">
                <span className="vehicle-badge-white">Automjet</span>
                {isNew && <span className="vehicle-badge-green">E RE</span>}
              </div>

              <div className="vehicle-status-wrap">
                <span className="vehicle-badge-dark">{status}</span>
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
              <div className="vehicle-row-top">
                {city ? <div className="vehicle-city">📍 {city}</div> : <div />}
                {(fuel || gearbox) && (
                  <span className="vehicle-badge-soft">{fuel || gearbox}</span>
                )}
              </div>

              <h3 className="vehicle-title">{post.title}</h3>

              {post.description && (
                <p className="vehicle-desc">
                  {post.description.length > 110
                    ? `${post.description.slice(0, 110)}...`
                    : post.description}
                </p>
              )}

              <div className="vehicle-stats">
                <div className="vehicle-stat">
                  <div className="vehicle-stat-label">Viti</div>
                  <div className="vehicle-stat-value">{year || "—"}</div>
                </div>

                <div className="vehicle-stat">
                  <div className="vehicle-stat-label">Kilometra</div>
                  <div className="vehicle-stat-value">
                    {mileage ? `${mileage} km` : "—"}
                  </div>
                </div>

                <div className="vehicle-stat">
                  <div className="vehicle-stat-label">Ndërruesi</div>
                  <div className="vehicle-stat-value">{gearbox || "—"}</div>
                </div>
              </div>

              <div className="vehicle-meta">
                {fuel && <span className="vehicle-badge-soft">{fuel}</span>}
                {gearbox && <span className="vehicle-badge-soft">{gearbox}</span>}
              </div>

              <div className="vehicle-bottom">
                <div className="vehicle-price-label">Çmimi</div>
                <div className="vehicle-price">
                  {price ? `${price} €` : "Me marrëveshje"}
                </div>

                <div className="vehicle-buttons">
                  <div className="vehicle-btn">Shiko detajet</div>
                </div>

                <div className="vehicle-note">
                  Kliko për të parë detajet e plota të automjetit.
                </div>
              </div>
            </div>
          </article>
        </Link>
      </div>
    </>
  );
};

export default VehiclePostCard;