import React, { useEffect, useMemo, useRef, useState } from "react";

export default function NewsMediaSlider({
  images = [],
  videoUrl = "",
  autoSlideMs = 3500,
  height = "520px",
}) {
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const mediaItems = useMemo(() => {
    const items = [];

    if (videoUrl) {
      items.push({
        type: "video",
        src: videoUrl,
      });
    }

    if (Array.isArray(images)) {
      images.forEach((img) => {
        if (img) {
          items.push({
            type: "image",
            src: img,
          });
        }
      });
    }

    return items;
  }, [images, videoUrl]);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = mediaItems[activeIndex];

  const clearExistingTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const goToNext = () => {
    if (!mediaItems.length) return;
    setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const goToPrev = () => {
    if (!mediaItems.length) return;
    setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [mediaItems]);

  useEffect(() => {
    clearExistingTimer();

    if (!activeItem) return;

    if (activeItem.type === "image") {
      timerRef.current = setTimeout(() => {
        goToNext();
      }, autoSlideMs);
    }

    return () => clearExistingTimer();
  }, [activeIndex, activeItem, autoSlideMs]);

  useEffect(() => {
    if (!activeItem || activeItem.type !== "video") return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleEnded = () => {
      goToNext();
    };

    videoEl.currentTime = 0;

    const playPromise = videoEl.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }

    videoEl.addEventListener("ended", handleEnded);

    return () => {
      videoEl.removeEventListener("ended", handleEnded);
    };
  }, [activeIndex, activeItem]);

  if (!mediaItems.length) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        background: "#0f172a",
        border: "1px solid #dbe3ea",
      }}
    >
      {activeItem.type === "video" ? (
        <video
          ref={videoRef}
          src={activeItem.src}
          controls
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            background: "#000",
          }}
        />
      ) : (
        <img
          src={activeItem.src}
          alt="News media"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      {mediaItems.length > 1 && (
        <>
          <button type="button" onClick={goToPrev} style={navBtnLeft}>
            ←
          </button>

          <button type="button" onClick={goToNext} style={navBtnRight}>
            →
          </button>

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "14px",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "8px",
              zIndex: 5,
            }}
          >
            {mediaItems.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  background:
                    index === activeIndex ? "#ffffff" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const navBtnBase = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 5,
  width: "44px",
  height: "44px",
  border: "1px solid rgba(255,255,255,0.22)",
  background: "rgba(15,23,42,0.45)",
  color: "#fff",
  cursor: "pointer",
  fontSize: "18px",
};

const navBtnLeft = {
  ...navBtnBase,
  left: "14px",
};

const navBtnRight = {
  ...navBtnBase,
  right: "14px",
};