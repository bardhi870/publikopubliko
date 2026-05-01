import React, { useEffect, useMemo, useState } from "react";

const THEME = {
  patundshmeri: {
    title: "Patundshmëri",
    badge: "Prona premium",
    accent: "#10b981",
    accent2: "#14b8a6",
    description:
      "Prona të zgjedhura me prezantim modern, fotografi cilësore dhe kërkim të lehtë për çdo klient.",
    stats: ["Prona të verifikuara", "Fotografi cilësore", "Prezantim premium"],
    slides: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2200&auto=format&fit=crop"
    ]
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
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2200&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2200&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2200&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555529771-35a1b1e44b1e?q=80&w=2200&auto=format&fit=crop"
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
    }, 4300);

    return () => clearInterval(interval);
  }, [slides]);

  return (
    <section
      style={{
        position: "relative",
        minHeight: isMobile ? "500px" : isTablet ? "500px" : "520px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#020617"
      }}
    >
      <style>{`
        @keyframes heroFadeUp {
          0% { opacity: 0; transform: translateY(22px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes heroGlowPulse {
          0%, 100% { opacity: .22; transform: scale(1); }
          50% { opacity: .55; transform: scale(1.08); }
        }

        @keyframes heroLineMove {
          0% { transform: translateX(-120%) skewX(-14deg); opacity: 0; }
          25% { opacity: .8; }
          100% { transform: translateX(140%) skewX(-14deg); opacity: 0; }
        }

        @keyframes heroAccentFloat {
          0%, 100% { transform: translateY(0px); opacity: .8; }
          50% { transform: translateY(-10px); opacity: 1; }
        }

        .hero-premium-badge::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.22), transparent);
          animation: heroLineMove 4.8s ease-in-out infinite;
        }

        .hero-title-gradient {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 46%, #cbd5e1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        @media (max-width: 768px) {
          .hero-premium-stats {
            grid-template-columns: 1fr !important;
          }
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
              category === "automjete"
                ? isMobile
                  ? "center center"
                  : "center 44%"
                : "center center",
            backgroundRepeat: "no-repeat",
            opacity: slideIndex === index ? 1 : 0,
            transform: slideIndex === index ? "scale(1.045)" : "scale(1.09)",
            transition: "opacity 1.15s ease, transform 6s ease",
            filter: "saturate(1.08) contrast(1.08)"
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isMobile
            ? "linear-gradient(180deg, rgba(2,6,23,.70) 0%, rgba(2,6,23,.88) 60%, rgba(2,6,23,.98) 100%)"
            : "linear-gradient(90deg, rgba(2,6,23,.98) 0%, rgba(2,6,23,.90) 38%, rgba(2,6,23,.54) 68%, rgba(2,6,23,.78) 100%)"
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 16% 32%, ${meta.accent}4d, transparent 25%),
            radial-gradient(circle at 74% 22%, ${meta.accent2}36, transparent 30%),
            radial-gradient(circle at 50% 100%, rgba(255,255,255,.08), transparent 34%),
            linear-gradient(180deg, rgba(255,255,255,.04), transparent 42%, rgba(2,6,23,.72))
          `
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "linear-gradient(90deg, black, transparent 74%)",
          WebkitMaskImage: "linear-gradient(90deg, black, transparent 74%)"
        }}
      />

      {!isMobile && (
        <>
          <div
            style={{
              position: "absolute",
              right: isTablet ? "6%" : "9%",
              top: isTablet ? "22%" : "18%",
              width: isTablet ? "260px" : "380px",
              height: isTablet ? "260px" : "380px",
              borderRadius: "999px",
              background: `radial-gradient(circle, ${meta.accent}3d, ${meta.accent2}1f, transparent 70%)`,
              filter: "blur(24px)",
              animation: "heroGlowPulse 5.5s ease-in-out infinite",
              zIndex: 1
            }}
          />

          <div
            style={{
              position: "absolute",
              right: isTablet ? "8%" : "11%",
              top: isTablet ? "24%" : "20%",
              width: isTablet ? "190px" : "260px",
              height: isTablet ? "190px" : "260px",
              borderRadius: "42px",
              border: `1px solid ${meta.accent}2e`,
              background:
                "linear-gradient(145deg, rgba(255,255,255,.10), rgba(255,255,255,.025))",
              boxShadow: `0 30px 90px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.12), 0 0 70px ${meta.accent}26`,
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              transform: "rotate(-7deg)",
              animation: "heroAccentFloat 6s ease-in-out infinite",
              zIndex: 2
            }}
          />

          <div
            style={{
              position: "absolute",
              right: isTablet ? "5%" : "7%",
              bottom: isTablet ? "80px" : "86px",
              width: isTablet ? "280px" : "420px",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
              opacity: 0.7,
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
          maxWidth: "1520px",
          margin: "0 auto",
          padding: isMobile
            ? "108px 16px 76px"
            : isTablet
              ? "112px 24px 90px"
              : "118px 32px 94px",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            maxWidth: isMobile ? "100%" : "790px",
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
              padding: isMobile ? "9px 13px" : "10px 17px",
              borderRadius: "999px",
              background: `${meta.accent}18`,
              border: `1px solid ${meta.accent}60`,
              color: "#ffffff",
              fontSize: isMobile ? "11px" : "12px",
              fontWeight: 950,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              boxShadow: `0 0 0 1px rgba(255,255,255,.05), 0 16px 36px ${meta.accent}24`,
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              marginBottom: isMobile ? "18px" : "24px"
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
              margin: "0 0 20px",
              fontSize: isMobile
                ? "clamp(44px, 13.5vw, 62px)"
                : isTablet
                  ? "74px"
                  : "96px",
              lineHeight: 0.88,
              fontWeight: 950,
              letterSpacing: isMobile ? "-0.055em" : "-0.075em",
              textShadow: "0 30px 70px rgba(0,0,0,.55)"
            }}
          >
            {meta.title}
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: "680px",
              color: "rgba(255,255,255,.90)",
              fontSize: isMobile ? "15px" : "22px",
              lineHeight: isMobile ? 1.68 : 1.66,
              fontWeight: 650,
              letterSpacing: "-0.015em",
              textShadow: "0 16px 38px rgba(0,0,0,.44)"
            }}
          >
            {meta.description}
          </p>

          <div
            className="hero-premium-stats"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
              gap: "10px",
              maxWidth: "790px",
              marginTop: isMobile ? "24px" : "34px"
            }}
          >
            {meta.stats.map((item, index) => (
              <div
                key={item}
                style={{
                  animation: `heroFadeUp .7s ease ${0.12 + index * 0.08}s both`,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  minHeight: isMobile ? "44px" : "50px",
                  padding: isMobile ? "10px 13px" : "12px 15px",
                  borderRadius: "18px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,.13), rgba(255,255,255,.055))",
                  border: "1px solid rgba(255,255,255,.14)",
                  boxShadow:
                    "0 16px 36px rgba(0,0,0,.20), inset 0 1px 0 rgba(255,255,255,.08)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  color: "rgba(255,255,255,.92)",
                  fontSize: isMobile ? "12px" : "13px",
                  fontWeight: 850
                }}
              >
                <span
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "3px",
                    transform: "rotate(45deg)",
                    background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent2})`,
                    boxShadow: `0 0 16px ${meta.accent}75`,
                    flex: "0 0 auto"
                  }}
                />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            right: isMobile ? "18px" : "44px",
            bottom: isMobile ? "22px" : "36px",
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            gap: "9px"
          }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSlideIndex(index)}
              aria-label={`Slide ${index + 1}`}
              style={{
                width: slideIndex === index ? "30px" : "10px",
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