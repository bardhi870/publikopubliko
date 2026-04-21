import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const categoryLabels = {
  vendi: "Vendi",
  rajoni: "Rajoni",
  bota: "Bota",
};

const formatDate = (date) => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("sq-AL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case "vendi":
      return {
        bg: "rgba(15,118,110,.08)",
        color: "#0f766e",
        border: "rgba(15,118,110,.16)",
      };

    case "rajoni":
      return {
        bg: "rgba(37,99,235,.08)",
        color: "#2563eb",
        border: "rgba(37,99,235,.16)",
      };

    case "bota":
      return {
        bg: "rgba(124,58,237,.08)",
        color: "#7c3aed",
        border: "rgba(124,58,237,.16)",
      };

    default:
      return {
        bg: "rgba(15,23,42,.04)",
        color: "#0f172a",
        border: "rgba(15,23,42,.08)",
      };
  }
};

function parseGalleryImages(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }

  return [];
}

export default function NewsCard({
  post,
  variant = "default",
  showExcerpt = true,
  showCategory = true,
  showDate = true,
  enableManualMediaNav = false,
}) {
  const videoRef = useRef(null);

  if (!post) return null;

  const {
    id,
    slug,
    title,
    excerpt,
    description,
    image_url,
    video_url,
    gallery_images,
    category,
    created_at,
  } = post;

  const label = categoryLabels[category] || "Lajm";
  const colors = getCategoryColor(category);
  const summary = excerpt || description || "";

  const link = slug
    ? `/lajme/artikulli/${slug}`
    : `/lajme/artikulli/${id}`;

  const isLarge = variant === "large";
  const isCompact = variant === "compact";

  const parsedGalleryImages = useMemo(
    () => parseGalleryImages(gallery_images),
    [gallery_images]
  );

  const imageItems =
    parsedGalleryImages.length > 0
      ? parsedGalleryImages
      : image_url
      ? [image_url]
      : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [id, imageItems.length]);

  useEffect(() => {
    if (video_url && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    }
  }, [video_url, id]);

  const currentImage = imageItems[activeImageIndex] || image_url || "";

  const goPrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (imageItems.length <= 1) return;

    setActiveImageIndex((prev) =>
      prev === 0 ? imageItems.length - 1 : prev - 1
    );
  };

  const goNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (imageItems.length <= 1) return;

    setActiveImageIndex((prev) =>
      prev === imageItems.length - 1 ? 0 : prev + 1
    );
  };

  const showManualButtons = enableManualMediaNav && imageItems.length > 1 && !video_url;

  return (
    <Link
      to={link}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        height: "100%",
      }}
    >
      <article
        style={{
          background: "#ffffff",
          borderRadius: "0px",
          overflow: "hidden",
          border: "1px solid #dbe3ea",
          boxShadow: "none",
          transition: "border-color .2s ease",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
  e.currentTarget.style.borderColor = "#cbd5e1";

  const btns = e.currentTarget.querySelectorAll("button");
  btns.forEach(btn => btn.style.opacity = "1");
}}
       onMouseLeave={(e) => {
  e.currentTarget.style.borderColor = "#dbe3ea";

  const btns = e.currentTarget.querySelectorAll("button");
  btns.forEach(btn => btn.style.opacity = "0");
}}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: isLarge
              ? "16/10"
              : isCompact
              ? "16/11"
              : "16/10",
            background: "#f1f5f9",
            overflow: "hidden",
          }}
        >
          {video_url ? (
            <video
              ref={videoRef}
              src={video_url}
              muted
              playsInline
              loop
              autoPlay
              preload="metadata"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                background: "#000",
              }}
            />
          ) : currentImage ? (
            <img
              src={currentImage}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
              }}
            />
          )}

          {showCategory && (
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "14px",
                padding: "7px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                background: colors.bg,
                color: colors.color,
                border: `1px solid ${colors.border}`,
                zIndex: 2,
              }}
            >
              {label}
            </div>
          )}

          {!!video_url && (
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 800,
                background: "rgba(220,38,38,.92)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,.14)",
                zIndex: 2,
              }}
            >
              ▶ Video
            </div>
          )}

          {showManualButtons && (
            <>
              <button
                type="button"
                onClick={goPrevImage}
                style={navBtnLeft}
                aria-label="Media e kaluar"
              >
                ←
              </button>

              <button
                type="button"
                onClick={goNextImage}
                style={navBtnRight}
                aria-label="Media tjetër"
              >
                →
              </button>

              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "10px",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "6px",
                  zIndex: 2,
                }}
              >
                {imageItems.map((_, index) => (
                  <span
                    key={index}
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "999px",
                      background:
                        index === activeImageIndex
                          ? "#ffffff"
                          : "rgba(255,255,255,0.40)",
                      display: "block",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div
          style={{
            padding: isLarge
              ? "22px"
              : isCompact
              ? "16px"
              : "18px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flex: 1,
          }}
        >
          {showDate && created_at && (
            <div
              style={{
                fontSize: "13px",
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              {formatDate(created_at)}
            </div>
          )}

          <h3
            style={{
              margin: 0,
              fontSize: isLarge
                ? "28px"
                : isCompact
                ? "17px"
                : "20px",
              lineHeight: isLarge ? 1.1 : 1.25,
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </h3>

          {showExcerpt && summary && (
            <p
              style={{
                margin: 0,
                color: "#475569",
                fontSize: isCompact ? "14px" : "15px",
                lineHeight: 1.65,
                display: "-webkit-box",
                WebkitLineClamp: isLarge ? 3 : 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {summary}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

const navBtnBase = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",

  zIndex: 3,

  width: "42px",
  height: "42px",

  background: "transparent",
  border: "none",
  boxShadow: "none",
  backdropFilter: "none",

  color: "#ffffff",

  cursor: "pointer",

  fontSize: "30px",
  fontWeight: 300,

  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  padding: 0,

  opacity: 0,
  transition: "opacity .2s ease",
};

const navBtnLeft = {
  ...navBtnBase,
  left: "12px",
};

const navBtnRight = {
  ...navBtnBase,
  right: "12px",
};