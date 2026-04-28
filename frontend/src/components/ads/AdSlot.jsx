import React, { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "../../utils/analytics";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const INLINE = [
  "news_inline_1",
  "realestate_inline",
  "automotive_inline",
  "jobs_inline",
  "home_in_feed_1",
  "home_in_feed_2"
];

const TOP = [
  "home_header_banner",
  "news_top_banner",
  "realestate_top_banner",
  "automotive_top_banner",
  "jobs_top_banner",
  "offers_top_banner"
];

const SIDEBAR = ["sidebar_top", "sidebar_middle"];
const STICKY = ["mobile_sticky_bottom"];
const CARD = ["offers_sponsored_card"];

function getType(placement) {
  if (TOP.includes(placement)) return "top";
  if (INLINE.includes(placement)) return "inline";
  if (SIDEBAR.includes(placement)) return "sidebar";
  if (STICKY.includes(placement)) return "sticky";
  if (CARD.includes(placement)) return "card";
  return "default";
}

function normalizeAds(data) {
  if (Array.isArray(data)) return data.filter(Boolean);
  return data ? [data] : [];
}

function getWeightedAds(list) {
  const ads = Array.isArray(list) ? list.filter(Boolean) : [];
  if (ads.length <= 1) return ads;

  const weighted = [];

  ads.forEach((ad) => {
    const priority = Number(ad?.priority || 0);
    const weight =
      priority >= 10 ? 4 : priority >= 7 ? 3 : priority >= 4 ? 2 : 1;

    for (let i = 0; i < weight; i += 1) weighted.push(ad);
  });

  return weighted.length ? weighted : ads;
}

function getNextIndex(current, weightedAds, currentAd) {
  if (weightedAds.length <= 1) return 0;

  let next = (current + 1) % weightedAds.length;

  if (weightedAds[next]?.creative_id === currentAd?.creative_id) {
    const different = weightedAds.findIndex(
      (item, idx) =>
        idx !== current && item?.creative_id !== currentAd?.creative_id
    );

    if (different !== -1) next = different;
  }

  return next;
}

function getStyles(type, isMobile) {
  const mediaHeight = (() => {
    if (type === "sticky") return "58px";
    if (type === "sidebar") return isMobile ? "110px" : "180px";
    if (type === "inline") return isMobile ? "130px" : "180px";
    if (type === "card") return isMobile ? "130px" : "180px";
    if (type === "top") return isMobile ? "150px" : "220px";
    return isMobile ? "120px" : "170px";
  })();

  return {
    mediaHeight,
    buttonFontSize: isMobile ? "11px" : "13px"
  };
}

export default function AdSlot({ placement, device }) {
  const [ads, setAds] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayAd, setDisplayAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const rotateRef = useRef(null);
  const fadeRef = useRef(null);
  const impressionRef = useRef(new Set());

  const resolvedDevice = useMemo(() => {
    if (device) return device;

    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      return "mobile";
    }

    return "desktop";
  }, [device]);

  const isMobile = resolvedDevice === "mobile";
  const type = getType(placement);
  const weightedAds = useMemo(() => getWeightedAds(ads), [ads]);
  const styles = getStyles(type, isMobile);

  useEffect(() => {
    if (!placement) return;

    let mounted = true;

    async function fetchAds() {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/api/public/ads?placement=${placement}&device=${resolvedDevice}`
        );

        const data = await res.json();
        if (!mounted) return;

        const list = normalizeAds(data);

        setAds(list);
        setActiveIndex(0);
        setDisplayAd(list[0] || null);
        setIsVisible(true);
      } catch (err) {
        console.error("Gabim gjatë marrjes së reklamës:", err);

        if (mounted) {
          setAds([]);
          setDisplayAd(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAds();

    return () => {
      mounted = false;
    };
  }, [placement, resolvedDevice]);

  useEffect(() => {
    if (!weightedAds.length) {
      setDisplayAd(null);
      return;
    }

    setDisplayAd(weightedAds[activeIndex] || weightedAds[0]);
  }, [weightedAds, activeIndex]);

  useEffect(() => {
    if (weightedAds.length <= 1) return;

    const delay =
      type === "sidebar"
        ? 11000
        : type === "inline"
          ? 13000
          : type === "sticky"
            ? 12000
            : 10000;

    if (rotateRef.current) clearTimeout(rotateRef.current);
    if (fadeRef.current) clearTimeout(fadeRef.current);

    rotateRef.current = setTimeout(() => {
      setIsVisible(false);

      fadeRef.current = setTimeout(() => {
        setActiveIndex((prev) =>
          getNextIndex(prev, weightedAds, weightedAds[prev])
        );
        setIsVisible(true);
      }, 180);
    }, delay);

    return () => {
      if (rotateRef.current) clearTimeout(rotateRef.current);
      if (fadeRef.current) clearTimeout(fadeRef.current);
    };
  }, [weightedAds, activeIndex, type]);

  useEffect(() => {
    const ad = displayAd;
    if (!ad) return;

    const key = `${placement}-${resolvedDevice}-${ad.creative_id}-${activeIndex}`;
    if (impressionRef.current.has(key)) return;

    trackEvent({
      event_type: "ad_impression",
      page_url: window.location.pathname,
      ad_id: ad.creative_id || ad.ad_id || null,
      element_name: placement,
      metadata: {
        placement,
        placement_name: ad.placement_name || placement,
        creative_id: ad.creative_id || null,
        campaign_id: ad.campaign_id || null,
        device: resolvedDevice
      }
    });

    impressionRef.current.add(key);
  }, [displayAd, placement, resolvedDevice, activeIndex]);

  const ad = displayAd;

  if (loading || !ad) return null;
  if (type === "sticky" && !isMobile) return null;

  const href = ad.button_link || ad.target_url || "";
  const isImage = ad.creative_type === "image" && ad.image_url;
  const isVideo = ad.creative_type === "video" && ad.video_url;
  const isHtml = ad.creative_type === "html" && ad.html_code;
  const buttonText = type === "sticky" ? "Hape" : ad.button_text || "Shiko";

  const handleClick = (e) => {
    if (!href) {
      e.preventDefault();
      return;
    }

    trackEvent({
      event_type: "ad_click",
      page_url: window.location.pathname,
      ad_id: ad.creative_id || ad.ad_id || null,
      element_name: placement,
      metadata: {
        placement,
        placement_name: ad.placement_name || placement,
        creative_id: ad.creative_id || null,
        campaign_id: ad.campaign_id || null,
        target_url: href,
        device: resolvedDevice
      }
    });
  };

  return (
    <div
      className={`ad-slot ad-slot-${type}`}
      style={{
        width: "100%",
        margin:
          type === "sticky"
            ? "0"
            : type === "sidebar"
              ? "0 0 14px"
              : "18px 0"
      }}
    >
      <a
        href={href || undefined}
        target={href && ad.open_in_new_tab ? "_blank" : "_self"}
        rel="noreferrer"
        onClick={handleClick}
        style={{
          display: "block",
          width: "100%",
          color: "inherit",
          textDecoration: "none",
          cursor: href ? "pointer" : "default"
        }}
      >
        <article
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "0px",
            background: "#ffffff",
            border: "none",
            boxShadow:
              type === "sticky"
                ? "0 -8px 20px rgba(15,23,42,.16)"
                : "0 12px 30px rgba(15,23,42,.10)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(2px)",
            transition: "opacity .22s ease, transform .22s ease"
          }}
        >
          {ads.length > 1 && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 6,
                height: "22px",
                minWidth: "36px",
                padding: "0 8px",
                borderRadius: "999px",
                background: "rgba(15,23,42,.68)",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 900
              }}
            >
              {(ads.findIndex((item) => item?.creative_id === ad?.creative_id) || 0) + 1}/
              {ads.length}
            </div>
          )}

          {(isImage || isVideo) && (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: styles.mediaHeight,
                background: "#e2e8f0",
                overflow: "hidden"
              }}
            >
              {isImage && (
                <img
                  src={ad.image_url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transition: "transform .45s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.045)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              )}

              {isVideo && (
                <video
                  src={ad.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center"
                  }}
                />
              )}

              {type !== "sticky" && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.18))",
                    pointerEvents: "none"
                  }}
                />
              )}
            </div>
          )}

          {isHtml && (
            <div dangerouslySetInnerHTML={{ __html: ad.html_code }} />
          )}

          {(type !== "sticky" || isMobile) && (
            <div
              style={{
                position: "absolute",
                left: type === "sticky" ? "auto" : "14px",
                right: type === "sticky" ? "10px" : "auto",
                bottom: type === "sticky" ? "50%" : "14px",
                transform: type === "sticky" ? "translateY(50%)" : "none",
                zIndex: 7
              }}
            >
              <span
                style={{
                  minWidth: type === "sticky" ? "62px" : "auto",
                  height: type === "sticky" ? "30px" : "34px",
                  padding: type === "sticky" ? "0 12px" : "0 15px",
                  borderRadius: "999px",
                  background: "#ffffff",
                  color: "#0f172a",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: styles.buttonFontSize,
                  fontWeight: 950,
                  boxShadow:
                    type === "sticky"
                      ? "0 8px 18px rgba(15,23,42,.18)"
                      : "0 12px 28px rgba(0,0,0,.22)"
                }}
              >
                {buttonText}
              </span>
            </div>
          )}
        </article>
      </a>
    </div>
  );
}