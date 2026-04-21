import React, { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getRotationDelay(placement, isInlinePlacement, isMobile) {
  if (placement === "sidebar_top" || placement === "sidebar_middle") {
    return 11000;
  }

  if (isInlinePlacement) {
    return isMobile ? 10000 : 14000;
  }

  return isMobile ? 9000 : 8000;
}

function getWeightedAds(list) {
  const normalized = Array.isArray(list) ? list.filter(Boolean) : [];

  if (normalized.length <= 1) return normalized;

  const weighted = [];

  normalized.forEach((item) => {
    const priority = Number(item?.priority ?? 0);

    let weight = 1;
    if (priority >= 10) weight = 4;
    else if (priority >= 7) weight = 3;
    else if (priority >= 4) weight = 2;

    for (let i = 0; i < weight; i += 1) {
      weighted.push(item);
    }
  });

  return weighted.length ? weighted : normalized;
}

function getNextWeightedIndex(currentIndex, weightedAds, currentAd) {
  if (weightedAds.length <= 1) return 0;

  let nextIndex = (currentIndex + 1) % weightedAds.length;

  if (
    currentAd &&
    weightedAds.length > 1 &&
    weightedAds[nextIndex]?.creative_id === currentAd?.creative_id
  ) {
    const differentIndex = weightedAds.findIndex(
      (item, idx) =>
        idx !== currentIndex && item?.creative_id !== currentAd?.creative_id
    );

    if (differentIndex !== -1) {
      nextIndex = differentIndex;
    }
  }

  return nextIndex;
}

export default function AdSlot({ placement, device }) {
  const [ads, setAds] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayAd, setDisplayAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const rotateTimeoutRef = useRef(null);
  const fadeTimeoutRef = useRef(null);

  const resolvedDevice = useMemo(() => {
    if (device) return device;

    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      return "mobile";
    }

    return "desktop";
  }, [device]);

  const isMobile = resolvedDevice === "mobile";

  const isInlinePlacement =
    placement === "news_inline_1" ||
    placement === "realestate_inline" ||
    placement === "automotive_inline" ||
    placement === "jobs_inline";

  const weightedAds = useMemo(() => getWeightedAds(ads), [ads]);

  const rotationDelay = useMemo(
    () => getRotationDelay(placement, isInlinePlacement, isMobile),
    [placement, isInlinePlacement, isMobile]
  );

  useEffect(() => {
    if (!placement) return;

    let isMounted = true;

    const fetchAds = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/api/public/ads?placement=${placement}&device=${resolvedDevice}`
        );

        const data = await res.json();

        if (!isMounted) return;

        let normalizedAds = [];

        if (Array.isArray(data)) {
          normalizedAds = data.filter(Boolean);
        } else if (data) {
          normalizedAds = [data];
        }

        setAds(normalizedAds);
        setActiveIndex(0);
        setDisplayAd(normalizedAds[0] || null);
        setIsVisible(true);
      } catch (err) {
        console.error("Gabim gjatë marrjes së reklamës:", err);

        if (isMounted) {
          setAds([]);
          setActiveIndex(0);
          setDisplayAd(null);
          setIsVisible(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAds();

    return () => {
      isMounted = false;
    };
  }, [placement, resolvedDevice]);

  useEffect(() => {
    if (!weightedAds.length) {
      setDisplayAd(null);
      return;
    }

    setDisplayAd(weightedAds[activeIndex] || weightedAds[0] || null);
  }, [weightedAds, activeIndex]);

  useEffect(() => {
    if (weightedAds.length <= 1) return;

    const clearTimers = () => {
      if (rotateTimeoutRef.current) clearTimeout(rotateTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };

    clearTimers();

    rotateTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);

      fadeTimeoutRef.current = setTimeout(() => {
        setActiveIndex((prev) =>
          getNextWeightedIndex(prev, weightedAds, weightedAds[prev])
        );
        setIsVisible(true);
      }, 320);
    }, rotationDelay);

    return clearTimers;
  }, [weightedAds, activeIndex, rotationDelay]);

  const ad = displayAd;

  if (loading || !ad) return null;

  const href = ad.button_link || ad.target_url || "#";
  const isImage = ad.creative_type === "image" && ad.image_url;
  const isVideo = ad.creative_type === "video" && ad.video_url;
  const isHtml = ad.creative_type === "html" && ad.html_code;
  const hasMedia = isImage || isVideo;

  const title = ad.headline || ad.creative_title || "Sponsoruar";
  const description = ad.creative_description || ad.campaign_description || "";
  const buttonText = ad.button_text || "Shiko më shumë";

  const mediaHeight = isInlinePlacement
    ? isMobile
      ? "160px"
      : "190px"
    : isMobile
      ? "220px"
      : "340px";

  const titleFontSize = isInlinePlacement
    ? isMobile
      ? "18px"
      : "22px"
    : isMobile
      ? "20px"
      : "30px";

  const contentPadding = isInlinePlacement
    ? isMobile
      ? "12px"
      : "16px"
    : isMobile
      ? "14px"
      : "22px";

  const contentMaxWidth = isInlinePlacement
    ? "100%"
    : isMobile
      ? "100%"
      : "76%";

  const uniqueAdsCount = ads.length;

  return (
    <a
      href={href}
      target={ad.open_in_new_tab ? "_blank" : "_self"}
      rel="noreferrer"
      style={{
        display: "block",
        width: "100%",
        textDecoration: "none",
        color: "inherit"
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "0px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: isInlinePlacement
            ? "0 10px 24px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.7)"
            : isMobile
              ? "0 12px 30px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.7)"
              : "0 18px 48px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(4px)",
          transition: "opacity .45s ease, transform .45s ease"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at top right, rgba(59,130,246,0.10), transparent 28%), radial-gradient(circle at bottom left, rgba(99,102,241,0.08), transparent 22%)"
          }}
        />

        {uniqueAdsCount > 1 && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              zIndex: 4,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "44px",
              height: "28px",
              padding: "0 10px",
              borderRadius: "999px",
              background: "rgba(15,23,42,0.72)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              backdropFilter: "blur(10px)"
            }}
          >
            {(ads.findIndex((item) => item?.creative_id === ad?.creative_id) || 0) + 1}/
            {uniqueAdsCount}
          </div>
        )}

        {isImage && (
          <div
            style={{
              position: "relative",
              width: "100%",
              background: "#e2e8f0"
            }}
          >
            <img
              src={ad.image_url}
              alt={title}
              style={{
                display: "block",
                width: "100%",
                height: mediaHeight,
                objectFit: "cover"
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: isInlinePlacement
                  ? "linear-gradient(180deg, rgba(15,23,42,0.02) 0%, rgba(15,23,42,0.12) 38%, rgba(15,23,42,0.70) 100%)"
                  : isMobile
                    ? "linear-gradient(180deg, rgba(15,23,42,0.03) 0%, rgba(15,23,42,0.20) 45%, rgba(15,23,42,0.82) 100%)"
                    : "linear-gradient(180deg, rgba(15,23,42,0.03) 0%, rgba(15,23,42,0.10) 42%, rgba(15,23,42,0.66) 100%)"
              }}
            />
          </div>
        )}

        {isVideo && (
          <div
            style={{
              position: "relative",
              width: "100%",
              background: "#0f172a"
            }}
          >
            <video
              src={ad.video_url}
              autoPlay
              muted
              loop
              playsInline
              style={{
                display: "block",
                width: "100%",
                height: mediaHeight,
                objectFit: "cover"
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: isInlinePlacement
                  ? "linear-gradient(180deg, rgba(15,23,42,0.04) 0%, rgba(15,23,42,0.72) 100%)"
                  : isMobile
                    ? "linear-gradient(180deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.82) 100%)"
                    : "linear-gradient(180deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.66) 100%)"
              }}
            />
          </div>
        )}

        {isHtml && (
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: isMobile ? "16px" : "22px"
            }}
            dangerouslySetInnerHTML={{ __html: ad.html_code }}
          />
        )}

        <div
          style={{
            position: hasMedia ? "absolute" : "relative",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            padding: contentPadding
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: isInlinePlacement
                ? "8px"
                : isMobile
                  ? "10px"
                  : "12px"
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobile ? "6px 10px" : "7px 12px",
                borderRadius: "999px",
                background: hasMedia ? "rgba(255,255,255,0.94)" : "#ffffff",
                color: "#475569",
                border: "1px solid rgba(15,23,42,0.08)",
                fontSize: isMobile ? "10px" : "11px",
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                backdropFilter: "blur(10px)"
              }}
            >
              Sponsoruar
            </span>

            {ad.campaign_title && (
              <span
                style={{
                  color: hasMedia ? "rgba(255,255,255,0.88)" : "#94a3b8",
                  fontSize: isMobile ? "10px" : "11px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase"
                }}
              >
                {ad.campaign_title}
              </span>
            )}
          </div>

          <div
            style={{
              maxWidth: contentMaxWidth
            }}
          >
            <h3
              style={{
                margin: "0 0 8px",
                color: hasMedia ? "#ffffff" : "#0f172a",
                fontSize: titleFontSize,
                lineHeight: isInlinePlacement
                  ? 1.15
                  : isMobile
                    ? 1.12
                    : 1.08,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                textShadow: hasMedia
                  ? "0 3px 14px rgba(0,0,0,0.28)"
                  : "none"
              }}
            >
              {title}
            </h3>

            {description && (
              <p
                style={{
                  margin: "0 0 14px",
                  color: hasMedia ? "rgba(255,255,255,0.94)" : "#475569",
                  fontSize: isInlinePlacement
                    ? isMobile
                      ? "12px"
                      : "14px"
                    : isMobile
                      ? "13px"
                      : "15px",
                  lineHeight: isInlinePlacement ? 1.55 : isMobile ? 1.55 : 1.7,
                  maxWidth: "760px",
                  textShadow: hasMedia
                    ? "0 2px 12px rgba(0,0,0,0.22)"
                    : "none"
                }}
              >
                {description}
              </p>
            )}

            <div
              style={{
                display: "flex",
                alignItems: isMobile ? "stretch" : "center",
                gap: "10px",
                flexWrap: "wrap",
                flexDirection: isMobile ? "column" : "row"
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: isMobile ? "42px" : "44px",
                  width: isMobile ? "100%" : "auto",
                  padding: isMobile ? "0 14px" : "0 16px",
                  borderRadius: "14px",
                  background: hasMedia
                    ? "#ffffff"
                    : "linear-gradient(135deg, #0f172a, #1e293b)",
                  color: hasMedia ? "#0f172a" : "#ffffff",
                  fontSize: isMobile ? "13px" : "14px",
                  fontWeight: 800,
                  boxShadow: hasMedia
                    ? "0 8px 25px rgba(255,255,255,0.20)"
                    : "0 10px 24px rgba(15,23,42,0.18)"
                }}
              >
                {buttonText}
              </span>

              <span
                style={{
                  fontSize: isMobile ? "12px" : "13px",
                  fontWeight: 700,
                  color: hasMedia
                    ? "rgba(255,255,255,0.88)"
                    : "#64748b",
                  textAlign: isMobile ? "center" : "left",
                  width: isMobile ? "100%" : "auto"
                }}
              >
                Placement: {ad.placement_name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}