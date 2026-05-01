import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const makeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[ë]/g, "e")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

const formatPrice = (price) => {
  if (!price) return "Me marrëveshje";
  return `${Number(price).toLocaleString("de-DE")} €`;
};

export default function RealEstatePostCard({ post, index = 0 }) {
  const propertyType = post.property_type || post.propertyType || "";
  const listingType = post.listing_type || post.listingType || "";
  const priceType = post.price_type || post.priceType || "";
  const city = post.city || post.location || "";
  const area = post.area || post.area_m2 || post.square_meters || "";
  const rooms = post.rooms || "";
  const bathrooms = post.bathrooms || post.bathroom || "";
  const status = post.status || "Aktiv";

  const isNew = index < 30;
  const isFeatured =
    post?.featured === true || post?.featured === "true" || post?.featured === 1;
  const isNewOnly = isNew && !isFeatured;

  const cleanDescription = stripHtml(post.description);

  const galleryImages = useMemo(
    () => normalizeGalleryImages(post.gallery_images),
    [post.gallery_images]
  );

  const mediaItems = useMemo(() => {
    const items = [];

    if (post.video_url) {
      items.push({ type: "video", url: post.video_url });
    }

    const allImages = [post.image_url, ...galleryImages].filter(Boolean);
    const uniqueImages = [...new Set(allImages)];

    uniqueImages.forEach((url) => {
      items.push({ type: "image", url });
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
    }, 3800);

    return () => clearInterval(interval);
  }, [mediaItems.length]);

  const activeMedia = mediaItems[activeIndex];
  const detailUrl = `/patundshmeri/${makeSlug(post?.title || "prona")}-${post.id}`;

  return (
    <>
      <style>{`
        .re-card-link{
          width:100%;
          height:100%;
          min-width:0;
          text-decoration:none;
          color:inherit;
          display:block;
        }

        .re-card{
          position:relative;
          width:100%;
          height:100%;
          min-width:0;
          background:#ffffff;
          border:1px solid rgba(191,219,254,.92);
          border-radius:24px;
          overflow:hidden;
          box-shadow:
            0 18px 44px rgba(15,23,42,.075),
            0 1px 0 rgba(255,255,255,.9) inset;
          transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease;
          display:flex;
          flex-direction:column;
          isolation:isolate;
          contain:layout paint;
        }

        .re-card:hover{
          transform:translateY(-4px);
          box-shadow:0 26px 62px rgba(37,99,235,.17);
          border-color:#60a5fa;
        }

        .re-card::after{
          content:"";
          position:absolute;
          inset:0;
          background:linear-gradient(120deg, transparent 0%, rgba(255,255,255,.58) 45%, transparent 70%);
          transform:translateX(-135%);
          transition:transform .72s ease;
          pointer-events:none;
          z-index:5;
        }

        .re-card:hover::after{
          transform:translateX(135%);
        }

        .re-new-card{
          border:2px solid #3b82f6;
          box-shadow:
            0 0 0 1px rgba(59,130,246,.14),
            0 20px 48px rgba(37,99,235,.16);
        }

        .re-featured{
          border:2px solid #facc15;
          background:linear-gradient(180deg,#fffdf5 0%,#ffffff 100%);
          box-shadow:
            0 0 0 1px rgba(250,204,21,.18),
            0 22px 54px rgba(250,204,21,.24);
        }

        .re-featured::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at 18% 0%, rgba(250,204,21,.26), transparent 38%),
            linear-gradient(135deg, rgba(250,204,21,.08), transparent 42%);
          pointer-events:none;
          z-index:1;
        }

        .re-image-wrap{
          position:relative;
          width:100%;
          height:270px;
          overflow:hidden;
          background:#eef4ff;
          border-bottom:1px solid #eaf2ff;
        }

        .re-image-wrap::before{
          content:"";
          position:absolute;
          inset:0;
          z-index:2;
          background:
            linear-gradient(180deg,rgba(2,6,23,.10) 0%, transparent 36%, rgba(2,6,23,.26) 100%);
          pointer-events:none;
        }

        .re-image,
        .re-video{
          width:100%;
          height:100%;
          object-fit:cover;
          object-position:center bottom;
          display:block;
          transition:transform .38s ease;
        }

        .re-card:hover .re-image,
        .re-card:hover .re-video{
          transform:scale(1.045);
        }

        .re-image-fallback{
          width:100%;
          height:100%;
          background:linear-gradient(135deg,#eaf4ff,#dbeafe);
          display:flex;
          align-items:center;
          justify-content:center;
          color:#1d4ed8;
          font-weight:950;
          font-size:15px;
        }

        .re-top-badges{
          position:absolute;
          top:12px;
          left:12px;
          right:12px;
          display:flex;
          justify-content:space-between;
          gap:7px;
          z-index:4;
        }

        .re-left-badges{
          display:flex;
          gap:6px;
          flex-wrap:wrap;
          align-items:center;
        }

        .re-badge{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:6px 10px;
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

        .re-badge-featured{
          min-width:29px;
          background:linear-gradient(135deg,#facc15,#f59e0b);
          color:#fff;
          border-color:rgba(254,240,138,.88);
          box-shadow:0 10px 24px rgba(245,158,11,.34);
        }

        .re-badge-new{
          position:relative;
          overflow:hidden;
          background:linear-gradient(135deg,#60a5fa,#2563eb);
          color:#fff;
          border-color:rgba(147,197,253,.72);
          box-shadow:0 10px 24px rgba(37,99,235,.30);
        }

        .re-badge-new::after{
          content:"";
          position:absolute;
          top:0;
          left:-120%;
          width:60%;
          height:100%;
          background:linear-gradient(120deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.65) 50%,rgba(255,255,255,0) 100%);
          transform:skewX(-20deg);
          animation:reShimmerMove 2.4s infinite;
        }

        @keyframes reShimmerMove{
          0%{left:-120%;}
          100%{left:130%;}
        }

        .re-status{
          position:absolute;
          left:12px;
          bottom:12px;
          z-index:4;
        }

        .re-status-badge{
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

        .re-video-badge{
          position:absolute;
          left:12px;
          bottom:45px;
          z-index:4;
          background:rgba(29,78,216,.90);
          color:#fff;
          padding:5px 9px;
          border-radius:999px;
          font-size:9px;
          font-weight:950;
        }

        .re-slide-dots{
          position:absolute;
          left:50%;
          bottom:14px;
          transform:translateX(-50%);
          display:flex;
          gap:5px;
          z-index:4;
        }

        .re-slide-dot{
          width:7px;
          height:7px;
          border-radius:999px;
          background:rgba(255,255,255,.68);
          transition:width .2s ease, background .2s ease;
          box-shadow:0 4px 10px rgba(15,23,42,.18);
        }

        .re-slide-dot.active{
          width:22px;
          background:#ffffff;
        }

        .re-body{
          padding:18px 19px 19px;
          display:flex;
          flex-direction:column;
          flex:1;
          min-width:0;
          position:relative;
          z-index:2;
          background:
            radial-gradient(circle at 92% 0%,rgba(59,130,246,.06),transparent 30%),
            #fff;
        }

        .re-city{
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

        .re-title{
          margin:0 0 10px;
          font-size:18px;
          line-height:1.18;
          font-weight:950;
          color:#020617;
          letter-spacing:-.035em;
          word-break:break-word;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
          min-height:43px;
        }

        .re-desc{
          margin:0 0 12px;
          font-size:13px;
          line-height:1.5;
          color:#475569;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }

        .re-chips{
          display:flex;
          flex-wrap:wrap;
          gap:6px;
          margin:0 0 14px;
        }

        .re-chip{
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

        .re-stats{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:10px 12px;
          margin-bottom:14px;
        }

        .re-stat{
          display:flex;
          align-items:center;
          gap:9px;
          min-width:0;
        }

        .re-stat:nth-child(3){
          grid-column:1 / -1;
        }

        .re-stat-icon{
          width:36px;
          height:36px;
          flex:0 0 36px;
          border-radius:999px;
          display:grid;
          place-items:center;
          background:#f8fbff;
          border:1px solid #e5eefb;
          color:#94a3b8;
        }

        .re-stat-icon svg{
          width:18px;
          height:18px;
          stroke:currentColor;
          stroke-width:1.75;
          stroke-linecap:round;
          stroke-linejoin:round;
        }

        .re-stat-label{
          font-size:13px;
          font-weight:850;
          color:#94a3b8;
          margin-bottom:2px;
          line-height:1;
        }

        .re-stat-value{
          font-size:13px;
          font-weight:900;
          color:#020617;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          line-height:1.18;
        }

        .re-bottom{
          margin-top:auto;
          padding-top:13px;
          border-top:1px solid #e5eaf1;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
          min-width:0;
        }

        .re-price{
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

        .re-featured .re-price{
          background:linear-gradient(135deg,#facc15,#f59e0b);
          box-shadow:0 12px 26px rgba(245,158,11,.26);
        }

        .re-cta{
          color:#1d4ed8;
          font-size:12px;
          font-weight:950;
          white-space:nowrap;
          transition:transform .2s ease,color .2s ease;
        }

        .re-featured .re-cta{
          color:#b45309;
        }

        .re-card:hover .re-cta{
          color:#1e40af;
          transform:translateX(3px);
        }

        .re-featured:hover .re-cta{
          color:#92400e;
        }

        @media(max-width:640px){
          .re-card{
            border-radius:18px;
            box-shadow:0 11px 26px rgba(15,23,42,.065);
            min-height:0;
          }

          .re-card:hover{
            transform:none;
          }

          .re-card::after{
            display:none;
          }

          .re-new-card{
            border:1.5px solid #3b82f6;
          }

          .re-featured{
            border:1.5px solid #facc15;
            background:linear-gradient(180deg,#fffdf5 0%,#ffffff 100%);
            box-shadow:
              0 0 0 1px rgba(250,204,21,.18),
              0 16px 34px rgba(250,204,21,.20);
          }

          .re-image-wrap{
            height:186px;
          }

          .re-card:hover .re-image,
          .re-card:hover .re-video{
            transform:none;
          }

          .re-image-fallback{
            font-size:12px;
          }

          .re-top-badges{
            top:8px;
            left:8px;
            right:8px;
            gap:5px;
          }

          .re-left-badges{
            gap:4px;
          }

          .re-badge{
            font-size:8px;
            padding:4px 7px;
            min-height:21px;
            max-width:86px;
            overflow:hidden;
            text-overflow:ellipsis;
          }

          .re-badge-featured{
            min-width:23px;
            padding:4px 6px;
          }

          .re-status{
            left:8px;
            bottom:8px;
          }

          .re-status-badge{
            font-size:7.5px;
            padding:4px 6px;
            max-width:78px;
            overflow:hidden;
            text-overflow:ellipsis;
          }

          .re-video-badge{
            left:8px;
            bottom:36px;
            font-size:7.5px;
            padding:4px 6px;
          }

          .re-slide-dots{
            bottom:9px;
            gap:3px;
          }

          .re-slide-dot{
            width:5px;
            height:5px;
          }

          .re-slide-dot.active{
            width:15px;
          }

          .re-body{
            padding:12px;
          }

          .re-city{
            font-size:10.5px;
            margin-bottom:7px;
          }

          .re-title{
            font-size:13px;
            line-height:1.22;
            min-height:32px;
            margin-bottom:8px;
            letter-spacing:-.02em;
          }

          .re-desc{
            display:none;
          }

          .re-chips{
            gap:4px;
            margin-bottom:10px;
          }

          .re-chip{
            font-size:8px;
            padding:4px 6px;
            max-width:100%;
          }

          .re-stats{
            gap:8px 7px;
            margin-bottom:10px;
          }

          .re-stat{
            gap:6px;
          }

          .re-stat-icon{
            width:28px;
            height:28px;
            flex-basis:28px;
          }

          .re-stat-icon svg{
            width:14px;
            height:14px;
          }

          .re-stat-label{
            font-size:10px;
          }

          .re-stat-value{
            font-size:10px;
          }

          .re-bottom{
            gap:7px;
            padding-top:9px;
          }

          .re-price{
            padding:8px 11px;
            font-size:12.5px;
            max-width:125px;
          }

          .re-cta{
            font-size:9px;
            max-width:66px;
            overflow:hidden;
            text-overflow:ellipsis;
          }
        }

        @media(max-width:390px){
          .re-image-wrap{
            height:170px;
          }

          .re-body{
            padding:10px;
          }

          .re-title{
            font-size:12px;
            min-height:30px;
          }

          .re-chip{
            font-size:7.5px;
            padding:4px 5px;
          }

          .re-stat-label{
            font-size:9px;
          }

          .re-stat-value{
            font-size:9.2px;
          }

          .re-price{
            font-size:11.5px;
            padding:7px 9px;
            max-width:110px;
          }

          .re-cta{
            font-size:8.5px;
            max-width:58px;
          }
        }

        @media(prefers-reduced-motion:reduce){
          .re-card,
          .re-image,
          .re-video,
          .re-slide-dot,
          .re-cta{
            transition:none;
          }

          .re-badge-new::after{
            animation:none;
          }
        }
      `}</style>

      <Link to={detailUrl} className="re-card-link">
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
                  preload="metadata"
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt={post.title || "Patundshmëri"}
                  className="re-image"
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
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

            <h3 className="re-title">{post.title || "Patundshmëri"}</h3>

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
                <span className="re-stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 11V20" />
                    <path d="M20 14V20" />
                    <path d="M4 15H20" />
                    <path d="M6 11H11V15H4V13A2 2 0 0 1 6 11Z" />
                    <path d="M11 15H20V13A3 3 0 0 0 17 10H11V15Z" />
                  </svg>
                </span>
                <div>
                  <div className="re-stat-label">Dhoma</div>
                  <div className="re-stat-value">{rooms ? `${rooms} Dhoma` : "—"}</div>
                </div>
              </div>

              <div className="re-stat">
                <span className="re-stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12H21V14A5 5 0 0 1 16 19H10A5 5 0 0 1 5 14V12Z" />
                    <path d="M7 12V5A2 2 0 0 1 9 3H11" />
                    <path d="M14 6H10" />
                  </svg>
                </span>
                <div>
                  <div className="re-stat-label">Banjo</div>
                  <div className="re-stat-value">{bathrooms ? `${bathrooms} Banjo` : "—"}</div>
                </div>
              </div>

              <div className="re-stat">
                <span className="re-stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 20H20" />
                    <path d="M5 19V5" />
                    <path d="M5 19L19 19L5 5V19Z" />
                    <path d="M9 15H12" />
                  </svg>
                </span>
                <div>
                  <div className="re-stat-label">Sipërfaqja</div>
                  <div className="re-stat-value">{area ? `${area} m²` : "—"}</div>
                </div>
              </div>
            </div>

            <div className="re-bottom">
              <div className="re-price">{formatPrice(post.price)}</div>
              <span className="re-cta">Shiko detajet →</span>
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}