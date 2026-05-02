import React, { useEffect, useMemo, useState } from "react";

const REAL_ESTATE_SLIDES = [
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151246/0004-foto_u8byn7.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151248/0008-foto_to3nuw.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151249/0009-foto_j1bqoo.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151247/0007-foto_ix3ag6.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151247/0006-foto_jytqi0.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151247/0005-foto_k5vk9z.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151246/0003-foto_nwynoo.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151246/0002-foto_b6wltt.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151246/0001-foto_hmairq.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151249/0011-foto_on637s.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151250/0012-foto_bkxbjc.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151249/0010-foto_ascivp.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776296263/sean-pollock-PhYq704ffdA-unsplash_1_mfyjz0.jpg",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776275717/webaliser-_TPTXZd9mOo-unsplash_wodfvv.jpg"
];

const THEME = {
  patundshmeri: {
    title: "Patundshmëri",
    badge: "Prona premium",
    accent: "#10b981",
    accent2: "#14b8a6",
    description:
      "Prona të zgjedhura me prezantim modern, fotografi cilësore dhe kërkim të lehtë për çdo klient.",
    stats: ["Prona të verifikuara", "Fotografi cilësore", "Prezantim premium"],
    slides: REAL_ESTATE_SLIDES
  },

  automjete: {
    title: "Automjete",
    badge: "Oferta të reja",
    accent: "#0ea5e9",
    accent2: "#2563eb",
    description:
      "Automjete të prezantuara bukur, me detaje të qarta, pamje moderne dhe kontakt të shpejtë.",
    stats: ["Automjete të verifikuara", "Pamje moderne", "Kontakt i shpejtë"],
    slides: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2400&auto=format&fit=crop"
    ]
  },

  "konkurse-pune": {
    title: "Konkurse Pune",
    badge: "Karrierë & punë",
    accent: "#a855f7",
    accent2: "#7c3aed",
    description:
      "Mundësi pune të organizuara qartë për kompani, kandidatë dhe aplikime më serioze.",
    stats: ["Shpallje të verifikuara", "Kompani serioze", "Aplikim i lehtë"],
    slides: [
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2400&auto=format&fit=crop"
    ]
  },

  lajme: {
    title: "Lajme",
    badge: "Informim i shpejtë",
    accent: "#38bdf8",
    accent2: "#2563eb",
    description:
      "Zhvillimet më të fundit, temat kryesore dhe përmbajtje informative në një pamje moderne.",
    stats: ["Lajme të fundit", "Lexim i shpejtë", "Përmbajtje moderne"],
    slides: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2400&auto=format&fit=crop"
    ]
  },

  oferta: {
    title: "Oferta",
    badge: "Paketa & promo",
    accent: "#34d399",
    accent2: "#059669",
    description:
      "Oferta promocionale, paketa profesionale dhe zgjidhje të personalizuara për biznesin tuaj.",
    stats: ["Oferta aktive", "Biznese lokale", "Promovim premium"],
    slides: [
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555529771-35a1b1e44b1e?q=80&w=2400&auto=format&fit=crop"
    ]
  }
};

export default function CategoryHero({ category }) {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1100;

  const meta = useMemo(() => THEME[category] || THEME.lajme, [category]);
  const slides = meta.slides;

  useEffect(() => {
    setSlideIndex(0);
  }, [category]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4100);

    return () => clearInterval(interval);
  }, [slides]);

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="category-premium-hero"
      style={{
        "--hero-accent": meta.accent,
        "--hero-accent-2": meta.accent2,
        position: "relative",
        minHeight: isMobile ? "590px" : isTablet ? "575px" : "660px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#020617",
        marginInline: isMobile ? "0" : "-10px"
      }}
    >
      <style>{`
        @keyframes heroFadeUp {
          0% { opacity: 0; transform: translateY(26px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes heroGlowPulse {
          0%, 100% { opacity: .20; transform: scale(1); }
          50% { opacity: .70; transform: scale(1.12); }
        }

        @keyframes heroLineMove {
          0% { transform: translateX(-120%) skewX(-14deg); opacity: 0; }
          25% { opacity: .95; }
          100% { transform: translateX(140%) skewX(-14deg); opacity: 0; }
        }

        @keyframes heroAccentFloat {
          0%, 100% { transform: translateY(0px) rotate(-7deg); opacity: .88; }
          50% { transform: translateY(-14px) rotate(-3deg); opacity: 1; }
        }

        @keyframes heroMiniFloat {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-12px) rotate(0deg); }
        }

        .category-premium-hero { isolation: isolate; }

        .category-premium-hero::before {
          content: "";
          position: absolute;
          inset: 18px 22px;
          z-index: 3;
          pointer-events: none;
          border-radius: 34px;
          border: 1px solid rgba(255,255,255,.10);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
        }

        .hero-premium-badge::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.30), transparent);
          animation: heroLineMove 4.6s ease-in-out infinite;
        }

        .hero-title-gradient {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 44%, #cbd5e1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-control-btn {
          width: 46px;
          height: 46px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.24);
          background: rgba(255,255,255,.13);
          color: white;
          cursor: pointer;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 20px 44px rgba(0,0,0,.28);
          transition: transform .22s ease, background .22s ease, border-color .22s ease;
          font-size: 28px;
          line-height: 1;
        }

        .hero-control-btn:hover {
          transform: translateY(-2px) scale(1.05);
          background: rgba(255,255,255,.22);
          border-color: rgba(255,255,255,.40);
        }

        .hero-slide-thumb {
          border: none;
          padding: 0;
          cursor: pointer;
          background: transparent;
        }

        @media (max-width: 768px) {
          .category-premium-hero::before { display: none; }
          .hero-premium-stats { grid-template-columns: 1fr !important; }
          .hero-side-preview,
          .hero-control-wrap,
          .hero-thumb-row { display: none !important; }
        }
      `}</style>

      {slides.map((image, index) => (
        <div
          key={`${image}-${index}`}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition:
              category === "patundshmeri"
                ? isMobile
                  ? "center center"
                  : "center 53%"
                : category === "automjete"
                  ? isMobile
                    ? "center center"
                    : "center 44%"
                  : "center center",
            backgroundRepeat: "no-repeat",
            opacity: slideIndex === index ? 1 : 0,
            transform: slideIndex === index ? "scale(1.025)" : "scale(1.075)",
            transition: "opacity 1.15s ease, transform 6s ease",
            filter: "saturate(1.10) contrast(1.10) brightness(.90)"
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isMobile
            ? "linear-gradient(180deg, rgba(2,6,23,.54) 0%, rgba(2,6,23,.82) 54%, rgba(2,6,23,.98) 100%)"
            : "linear-gradient(90deg, rgba(2,6,23,.98) 0%, rgba(2,6,23,.88) 34%, rgba(2,6,23,.42) 65%, rgba(2,6,23,.74) 100%)"
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 13% 24%, ${meta.accent}60, transparent 28%),
            radial-gradient(circle at 74% 18%, ${meta.accent2}4d, transparent 34%),
            radial-gradient(circle at 58% 108%, rgba(255,255,255,.12), transparent 36%),
            linear-gradient(180deg, rgba(255,255,255,.05), transparent 40%, rgba(2,6,23,.78))
          `
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.11,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.17) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.17) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(90deg, black, transparent 80%)",
          WebkitMaskImage: "linear-gradient(90deg, black, transparent 80%)"
        }}
      />

      {!isMobile && (
        <>
          <div
            style={{
              position: "absolute",
              right: isTablet ? "5%" : "8%",
              top: isTablet ? "17%" : "13%",
              width: isTablet ? "310px" : "500px",
              height: isTablet ? "310px" : "500px",
              borderRadius: "999px",
              background: `radial-gradient(circle, ${meta.accent}4d, ${meta.accent2}26, transparent 72%)`,
              filter: "blur(32px)",
              animation: "heroGlowPulse 5.5s ease-in-out infinite",
              zIndex: 1
            }}
          />

          <div
            className="hero-side-preview"
            style={{
              position: "absolute",
              right: isTablet ? "6%" : "9%",
              top: isTablet ? "21%" : "16%",
              width: isTablet ? "245px" : "360px",
              height: isTablet ? "285px" : "395px",
              borderRadius: "48px",
              border: `1px solid ${meta.accent}55`,
              background:
                "linear-gradient(145deg, rgba(255,255,255,.17), rgba(255,255,255,.05))",
              boxShadow: `0 38px 110px rgba(0,0,0,.36), inset 0 1px 0 rgba(255,255,255,.16), 0 0 82px ${meta.accent}30`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              transform: "rotate(-7deg)",
              animation: "heroAccentFloat 6s ease-in-out infinite",
              overflow: "hidden",
              zIndex: 2
            }}
          >
            <img
              src={slides[(slideIndex + 1) % slides.length]}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.38,
                filter: "saturate(1.18) contrast(1.06)"
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, rgba(255,255,255,.10), ${meta.accent}22, rgba(2,6,23,.45))`
              }}
            />
          </div>

          <div
            className="hero-side-preview"
            style={{
              position: "absolute",
              right: isTablet ? "24%" : "31%",
              bottom: isTablet ? "72px" : "88px",
              width: isTablet ? "112px" : "150px",
              height: isTablet ? "112px" : "150px",
              borderRadius: "32px",
              border: `1px solid ${meta.accent}55`,
              background: "rgba(255,255,255,.12)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              overflow: "hidden",
              boxShadow: "0 28px 78px rgba(0,0,0,.30)",
              animation: "heroMiniFloat 5s ease-in-out infinite",
              zIndex: 3
            }}
          >
            <img
              src={slides[(slideIndex + 2) % slides.length]}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.58
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              right: isTablet ? "5%" : "6%",
              bottom: isTablet ? "78px" : "88px",
              width: isTablet ? "310px" : "520px",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
              opacity: 0.78,
              zIndex: 2
            }}
          />
        </>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 4,
          width: "100%",
          maxWidth: "1760px",
          margin: "0 auto",
          padding: isMobile
            ? "118px 16px 96px"
            : isTablet
              ? "122px 34px 104px"
              : "132px 52px 118px",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            maxWidth: isMobile ? "100%" : "900px",
            animation: "heroFadeUp .75s ease both"
          }}
        >
          <div
            className="hero-premium-badge"
            style={{
              position: "relative",
              overflow: "hidden",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: isMobile ? "9px 13px" : "11px 18px",
              borderRadius: "999px",
              background: `${meta.accent}1c`,
              border: `1px solid ${meta.accent}66`,
              color: "#ffffff",
              fontSize: isMobile ? "11px" : "12px",
              fontWeight: 950,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              boxShadow: `0 0 0 1px rgba(255,255,255,.05), 0 18px 38px ${meta.accent}28`,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              marginBottom: isMobile ? "18px" : "26px"
            }}
          >
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "999px",
                background: meta.accent,
                boxShadow: `0 0 18px ${meta.accent}`
              }}
            />
            <span style={{ position: "relative", zIndex: 2 }}>{meta.badge}</span>
          </div>

          <h1
            className="hero-title-gradient"
            style={{
              margin: "0 0 22px",
              fontSize: isMobile
                ? "clamp(46px, 14vw, 64px)"
                : isTablet
                  ? "82px"
                  : "116px",
              lineHeight: 0.84,
              fontWeight: 950,
              letterSpacing: isMobile ? "-0.055em" : "-0.082em",
              textShadow: "0 34px 78px rgba(0,0,0,.58)"
            }}
          >
            {meta.title}
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: "760px",
              color: "rgba(255,255,255,.93)",
              fontSize: isMobile ? "15px" : "24px",
              lineHeight: isMobile ? 1.68 : 1.62,
              fontWeight: 680,
              letterSpacing: "-0.015em",
              textShadow: "0 18px 42px rgba(0,0,0,.46)"
            }}
          >
            {meta.description}
          </p>

          <div
            className="hero-premium-stats"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
              gap: "12px",
              maxWidth: "900px",
              marginTop: isMobile ? "26px" : "38px"
            }}
          >
            {meta.stats.map((item, index) => (
              <div
                key={item}
                style={{
                  animation: `heroFadeUp .7s ease ${0.12 + index * 0.08}s both`,
                  display: "flex",
                  alignItems: "center",
                  gap: "11px",
                  minHeight: isMobile ? "46px" : "54px",
                  padding: isMobile ? "11px 14px" : "14px 17px",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,.15), rgba(255,255,255,.06))",
                  border: "1px solid rgba(255,255,255,.15)",
                  boxShadow:
                    "0 18px 40px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.09)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  color: "rgba(255,255,255,.94)",
                  fontSize: isMobile ? "12px" : "13.5px",
                  fontWeight: 880
                }}
              >
                <span
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "3px",
                    transform: "rotate(45deg)",
                    background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent2})`,
                    boxShadow: `0 0 17px ${meta.accent}80`,
                    flex: "0 0 auto"
                  }}
                />
                {item}
              </div>
            ))}
          </div>

          {slides.length > 1 && (
            <div
              className="hero-thumb-row"
              style={{
                display: isMobile ? "none" : "flex",
                gap: "10px",
                marginTop: "30px",
                alignItems: "center"
              }}
            >
              {slides.slice(0, 6).map((image, index) => (
                <button
                  className="hero-slide-thumb"
                  key={image}
                  type="button"
                  onClick={() => setSlideIndex(index)}
                  aria-label={`Ndrysho slide ${index + 1}`}
                  style={{
                    width: slideIndex === index ? "82px" : "58px",
                    height: "45px",
                    borderRadius: "15px",
                    overflow: "hidden",
                    border:
                      slideIndex === index
                        ? `2px solid ${meta.accent}`
                        : "1px solid rgba(255,255,255,.22)",
                    boxShadow:
                      slideIndex === index
                        ? `0 0 24px ${meta.accent}78`
                        : "0 12px 28px rgba(0,0,0,.20)",
                    opacity: slideIndex === index ? 1 : 0.74,
                    transition: "all .28s ease"
                  }}
                >
                  <img
                    src={image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <div
            className="hero-control-wrap"
            style={{
              position: "absolute",
              right: isMobile ? "18px" : "54px",
              bottom: isMobile ? "22px" : "42px",
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              gap: "11px"
            }}
          >
            <button className="hero-control-btn" type="button" onClick={prevSlide} aria-label="Slide paraprak">
              ‹
            </button>
            <button className="hero-control-btn" type="button" onClick={nextSlide} aria-label="Slide tjetër">
              ›
            </button>
          </div>

          <div
            style={{
              position: "absolute",
              left: isMobile ? "16px" : "54px",
              right: isMobile ? "16px" : "54px",
              bottom: isMobile ? "22px" : "40px",
              zIndex: 5,
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-start",
              alignItems: "center",
              gap: "9px"
            }}
          >
            {slides.slice(0, isMobile ? 6 : 12).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSlideIndex(index)}
                aria-label={`Slide ${index + 1}`}
                style={{
                  width: slideIndex === index ? "32px" : "10px",
                  height: "10px",
                  borderRadius: "999px",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background:
                    slideIndex === index
                      ? `linear-gradient(135deg, ${meta.accent}, ${meta.accent2})`
                      : "rgba(255,255,255,.42)",
                  boxShadow:
                    slideIndex === index ? `0 0 20px ${meta.accent}80` : "none",
                  transition: "all .28s ease"
                }}
              />
            ))}
          </div>
        </>
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,.42), transparent)",
          zIndex: 6
        }}
      />
    </section>
  );
}
