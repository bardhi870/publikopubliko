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
  return (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 3;
};

const formatPrice = (price) => {
  if (!price) return "Me marrëveshje";
  return `${Number(price).toLocaleString("de-DE")} €`;
};
const makeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[ë]/g, "e")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  const isFeatured = post?.featured === true || post?.featured === "true" || post?.featured === 1;
  const isNewOnly = isNew && !isFeatured;

  const galleryImages = useMemo(
    () => normalizeGalleryImages(post.gallery_images),
    [post.gallery_images]
  );

  const mediaItems = useMemo(() => {
    const allImages = [post.image_url, ...galleryImages].filter(Boolean);
    return [...new Set(allImages)].map((url) => ({ type: "image", url }));
  }, [post.image_url, galleryImages]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setActiveIndex(0), [post.id]);

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
        .vehicle-card-link{
          width:100%;
          height:100%;
          display:block;
          text-decoration:none;
          color:inherit;
        }

        .vehicle-card{
          position:relative;
          width:100%;
          height:100%;
          background:#ffffff;
          border:1px solid rgba(191,219,254,.92);
          border-radius:24px;
          overflow:hidden;
          box-shadow:
            0 18px 44px rgba(15,23,42,.075),
            inset 0 1px 0 rgba(255,255,255,.9);
          transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease;
          display:flex;
          flex-direction:column;
          isolation:isolate;
          contain:layout paint;
        }

        .vehicle-card:hover{
          transform:translateY(-4px);
          box-shadow:0 26px 62px rgba(37,99,235,.17);
          border-color:#60a5fa;
        }

        .vehicle-card::after{
          content:"";
          position:absolute;
          inset:0;
          background:linear-gradient(120deg, transparent 0%, rgba(255,255,255,.58) 45%, transparent 70%);
          transform:translateX(-135%);
          transition:transform .72s ease;
          pointer-events:none;
          z-index:5;
        }

        .vehicle-card:hover::after{
          transform:translateX(135%);
        }

        .vehicle-new-card{
          border:2px solid #3b82f6;
          box-shadow:
            0 0 0 1px rgba(59,130,246,.14),
            0 20px 48px rgba(37,99,235,.16);
        }

        .vehicle-featured{
          border:2px solid #facc15;
          background:linear-gradient(180deg,#fffdf5 0%,#ffffff 100%);
          box-shadow:
            0 0 0 1px rgba(250,204,21,.18),
            0 22px 54px rgba(250,204,21,.24);
        }

        .vehicle-featured::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at 18% 0%, rgba(250,204,21,.26), transparent 38%),
            linear-gradient(135deg, rgba(250,204,21,.08), transparent 42%);
          pointer-events:none;
          z-index:1;
        }

        .vehicle-image-wrap{
          position:relative;
          width:100%;
          height:270px;
          overflow:hidden;
          background:#eef4ff;
          border-bottom:1px solid #eaf2ff;
        }

        .vehicle-image-wrap::before{
          content:"";
          position:absolute;
          inset:0;
          z-index:2;
          background:
            linear-gradient(180deg,rgba(2,6,23,.10) 0%, transparent 36%, rgba(2,6,23,.26) 100%);
          pointer-events:none;
        }

        .vehicle-image{
          width:100%;
          height:100%;
          object-fit:cover;
          object-position:center bottom;
          display:block;
          transition:transform .38s ease;
        }

        .vehicle-card:hover .vehicle-image{
          transform:scale(1.045);
        }

        .vehicle-image-fallback{
          width:100%;
          height:100%;
          background:linear-gradient(135deg,#eff6ff,#dbeafe);
          display:flex;
          align-items:center;
          justify-content:center;
          color:#1d4ed8;
          font-weight:950;
          font-size:17px;
        }

        .vehicle-top-badges{
          position:absolute;
          top:12px;
          left:12px;
          right:12px;
          z-index:4;
          display:flex;
          justify-content:space-between;
          gap:7px;
          pointer-events:none;
        }

        .vehicle-left-badges{
          display:flex;
          gap:6px;
          flex-wrap:wrap;
          align-items:center;
        }

        .vehicle-badge{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-height:29px;
          padding:0 11px;
          border-radius:999px;
          font-size:10px;
          font-weight:950;
          background:rgba(239,246,255,.95);
          color:#1e3a8a;
          border:1px solid rgba(191,219,254,.95);
          box-shadow:0 8px 20px rgba(37,99,235,.12);
          white-space:nowrap;
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
        }

        .vehicle-badge-featured{
          min-width:29px;
          padding:0 9px;
          background:linear-gradient(135deg,#facc15,#f59e0b);
          color:#fff;
          border-color:rgba(254,240,138,.88);
          box-shadow:0 10px 24px rgba(245,158,11,.34);
        }

        .vehicle-badge-new{
          position:relative;
          overflow:hidden;
          background:linear-gradient(135deg,#60a5fa,#2563eb);
          color:#fff;
          border-color:rgba(147,197,253,.72);
          box-shadow:0 10px 24px rgba(37,99,235,.30);
        }

        .vehicle-badge-new::after{
          content:"";
          position:absolute;
          top:0;
          left:-120%;
          width:60%;
          height:100%;
          background:linear-gradient(120deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.65) 50%,rgba(255,255,255,0) 100%);
          transform:skewX(-20deg);
          animation:vehicleShimmerMove 2.4s infinite;
        }

        @keyframes vehicleShimmerMove{
          0%{left:-120%;}
          100%{left:130%;}
        }

        .vehicle-status-wrap{
          position:absolute;
          left:12px;
          bottom:12px;
          right:auto;
          z-index:4;
        }

        .vehicle-status-badge{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:6px 9px;
          border-radius:999px;
          font-size:9px;
          font-weight:950;
          background:rgba(15,23,42,.78);
          color:#fff;
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
          box-shadow:0 8px 20px rgba(15,23,42,.22);
        }

        .vehicle-slide-dots{
          position:absolute;
          left:50%;
          bottom:14px;
          transform:translateX(-50%);
          display:flex;
          gap:5px;
          z-index:4;
        }

        .vehicle-slide-dot{
          width:7px;
          height:7px;
          border-radius:999px;
          background:rgba(255,255,255,.68);
          transition:width .2s ease, background .2s ease;
          box-shadow:0 4px 10px rgba(15,23,42,.18);
        }

        .vehicle-slide-dot.active{
          width:22px;
          background:#ffffff;
        }

        .vehicle-body{
          padding:18px 19px 19px;
          display:flex;
          flex-direction:column;
          flex:1;
          position:relative;
          z-index:2;
          background:
            radial-gradient(circle at 92% 0%,rgba(59,130,246,.06),transparent 30%),
            #fff;
        }

        .vehicle-city{
          display:flex;
          align-items:center;
          gap:5px;
          font-size:13px;
          color:#64748b;
          font-weight:850;
          margin-bottom:8px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .vehicle-title{
          margin:0 0 10px;
          font-size:18px;
          line-height:1.18;
          font-weight:950;
          color:#020617;
          letter-spacing:-.035em;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
          min-height:43px;
        }

        .vehicle-desc{
          margin:0 0 12px;
          font-size:13px;
          line-height:1.5;
          color:#475569;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }

        .vehicle-chips{
          display:flex;
          flex-wrap:wrap;
          gap:6px;
          margin:0 0 14px;
        }

        .vehicle-chip{
          display:inline-flex;
          align-items:center;
          padding:6px 9px;
          border-radius:999px;
          background:#eff6ff;
          border:1px solid #bfdbfe;
          color:#1d4ed8;
          font-size:10.5px;
          font-weight:900;
          max-width:100%;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .vehicle-stats{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:10px 12px;
          margin-bottom:14px;
        }

        .vehicle-stat{
          display:flex;
          align-items:center;
          gap:9px;
          min-width:0;
          background:transparent;
          border:0;
          border-radius:0;
          padding:0;
          text-align:left;
        }

        .vehicle-stat:nth-child(3){
          grid-column:1 / -1;
        }

        .vehicle-stat::before{
          content:"";
          width:36px;
          height:36px;
          flex:0 0 36px;
          border-radius:999px;
          display:block;
          background:
            radial-gradient(circle at 50% 50%, #94a3b8 0 2px, transparent 2.5px),
            #f8fbff;
          border:1px solid #e5eefb;
        }

        .vehicle-stat-label{
          font-size:13px;
          font-weight:850;
          color:#94a3b8;
          margin-bottom:2px;
          line-height:1;
          text-transform:none;
        }

        .vehicle-stat-value{
          font-size:13px;
          font-weight:900;
          color:#020617;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          line-height:1.18;
        }

        .vehicle-bottom{
          margin-top:auto;
          padding-top:13px;
          border-top:1px solid #e5eaf1;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
        }

        .vehicle-price-box{
          min-width:0;
        }

        .vehicle-price-label{
          display:none;
        }

        .vehicle-price{
          min-width:0;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:10px 17px;
          border-radius:999px;
          background:linear-gradient(135deg,#3b82f6,#1d4ed8);
          color:#fff;
          font-size:17px;
          font-weight:950;
          line-height:1;
          letter-spacing:-.035em;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          box-shadow:0 12px 26px rgba(37,99,235,.24);
        }

        .vehicle-featured .vehicle-price{
          background:linear-gradient(135deg,#facc15,#f59e0b);
          box-shadow:0 12px 26px rgba(245,158,11,.26);
        }

        .vehicle-cta{
          color:#1d4ed8;
          font-size:12px;
          font-weight:950;
          white-space:nowrap;
          transition:transform .2s ease,color .2s ease;
        }

        .vehicle-featured .vehicle-cta{
          color:#b45309;
        }

        .vehicle-card:hover .vehicle-cta{
          color:#1e40af;
          transform:translateX(3px);
        }

        .vehicle-featured:hover .vehicle-cta{
          color:#92400e;
        }

        @media(max-width:640px){
          .vehicle-card{
            border-radius:18px;
            box-shadow:0 11px 26px rgba(15,23,42,.065);
            min-height:0;
          }

          .vehicle-card:hover{
            transform:none;
          }

          .vehicle-card::after{
            display:none;
          }

          .vehicle-new-card{
            border:1.5px solid #3b82f6;
          }

          .vehicle-featured{
            border:1.5px solid #facc15;
            background:linear-gradient(180deg,#fffdf5 0%,#ffffff 100%);
            box-shadow:
              0 0 0 1px rgba(250,204,21,.18),
              0 16px 34px rgba(250,204,21,.20);
          }

          .vehicle-image-wrap{
            height:186px;
          }

          .vehicle-card:hover .vehicle-image{
            transform:none;
          }

          .vehicle-image-fallback{
            font-size:12px;
          }

          .vehicle-top-badges{
            top:8px;
            left:8px;
            right:8px;
            gap:5px;
          }

          .vehicle-left-badges{
            gap:4px;
          }

          .vehicle-badge{
            min-height:21px;
            padding:0 7px;
            font-size:8px;
            max-width:86px;
            overflow:hidden;
            text-overflow:ellipsis;
          }

          .vehicle-badge-featured{
            min-width:23px;
            padding:0 7px;
          }

          .vehicle-status-wrap{
            left:8px;
            bottom:8px;
          }

          .vehicle-status-badge{
            font-size:7.5px;
            padding:4px 6px;
            max-width:78px;
            overflow:hidden;
            text-overflow:ellipsis;
          }

          .vehicle-slide-dots{
            bottom:9px;
            gap:3px;
          }

          .vehicle-slide-dot{
            width:5px;
            height:5px;
          }

          .vehicle-slide-dot.active{
            width:15px;
          }

          .vehicle-body{
            padding:12px;
          }

          .vehicle-city{
            font-size:10.5px;
            margin-bottom:7px;
          }

          .vehicle-title{
            font-size:13px;
            line-height:1.22;
            min-height:32px;
            margin-bottom:8px;
            letter-spacing:-.02em;
          }

          .vehicle-desc{
            display:none;
          }

          .vehicle-chips{
            gap:4px;
            margin-bottom:10px;
          }

          .vehicle-chip{
            font-size:8px;
            padding:4px 6px;
            max-width:100%;
          }

          .vehicle-stats{
            display:none;
          }

          .vehicle-bottom{
            gap:7px;
            padding-top:9px;
          }

          .vehicle-price{
            padding:8px 11px;
            font-size:12.5px;
            max-width:125px;
          }

          .vehicle-cta{
            font-size:9px;
            max-width:66px;
            overflow:hidden;
            text-overflow:ellipsis;
          }
        }

        @media(max-width:390px){
          .vehicle-image-wrap{
            height:170px;
          }

          .vehicle-body{
            padding:10px;
          }

          .vehicle-title{
            font-size:12px;
            min-height:30px;
          }

          .vehicle-chip{
            font-size:7.5px;
            padding:4px 5px;
          }

          .vehicle-price{
            font-size:11.5px;
            padding:7px 9px;
            max-width:110px;
          }

          .vehicle-cta{
            font-size:8.5px;
            max-width:58px;
          }
        }

        @media(prefers-reduced-motion:reduce){
          .vehicle-card,
          .vehicle-image,
          .vehicle-slide-dot,
          .vehicle-cta{
            transition:none;
          }

          .vehicle-badge-new::after{
            animation:none;
          }
        }
      `}</style>

      <Link
                 to={`/automjete/${makeSlug(post?.title || "automjet")}-${post.id}`}
                    className="vehicle-card-link"
                    onClick={handlePostClick}
                       >
        <article className={`vehicle-card ${isFeatured ? "vehicle-featured" : ""} ${isNewOnly ? "vehicle-new-card" : ""}`}>
          <div className="vehicle-image-wrap">
            {activeMedia ? (
              <img
                src={activeMedia.url}
                alt={post.title || "Automjet"}
                className="vehicle-image"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="vehicle-image-fallback">Automjet</div>
            )}

            <div className="vehicle-top-badges">
              <div className="vehicle-left-badges">
                <span className="vehicle-badge">Auto</span>
                {isFeatured && <span className="vehicle-badge vehicle-badge-featured">⭐</span>}
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
                    className={`vehicle-slide-dot ${dotIndex === activeIndex ? "active" : ""}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="vehicle-body">
            {city && <div className="vehicle-city">📍 {city}</div>}

            <h3 className="vehicle-title">{post.title || "Automjet"}</h3>

            {cleanDescription && <p className="vehicle-desc">{cleanDescription}</p>}

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
                <div className="vehicle-stat-label">Kilometra</div>
                <div className="vehicle-stat-value">{mileage ? `${mileage} km` : "—"}</div>
              </div>

              <div className="vehicle-stat">
                <div className="vehicle-stat-label">Transm.</div>
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