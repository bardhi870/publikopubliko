import React, { useEffect, useMemo, useState } from "react";

const categoryTitles = {
  lajme: "Lajme",
  patundshmeri: "Patundshmëri",
  automjete: "Automjete",
  oferta: "Oferta",
  "konkurse-pune": "Konkurse Pune"
};

const categoryDescriptions = {
  lajme:
    "Zhvillimet më të fundit, përmbajtje informative dhe temat kryesore të ditës në një paraqitje moderne.",
  patundshmeri:
    "Prona të selektuara me paraqitje premium, kërkim të lehtë dhe prezantim profesional.",
  automjete:
    "Automjete të publikuara me fotografi të pastra, detaje të qarta dhe pamje moderne.",
  oferta:
    "Oferta promocionale, paketa profesionale dhe zgjidhje të personalizuara për biznesin tuaj.",
  "konkurse-pune":
    "Mundësi pune të organizuara qartë për kërkim më të lehtë dhe prezantim më serioz."
};

const heroSlides = {
  lajme: [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1800&auto=format&fit=crop"
  ],
  patundshmeri: [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1800&auto=format&fit=crop"
  ],
  automjete: [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=1800&auto=format&fit=crop"
  ],
  oferta: [
    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555529771-35a1b1e44b1e?q=80&w=1800&auto=format&fit=crop"
  ],
  "konkurse-pune": [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1800&auto=format&fit=crop"
  ]
};

const categoryBadges = {
  lajme: "Informim i shpejtë",
  patundshmeri: "Prona premium",
  automjete: "Oferta të reja",
  oferta: "Paketa & promo",
  "konkurse-pune": "Karrierë & punë"
};

const NEW_HERO_LOGO =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776969626/ChatGPT_Image_Apr_23_2026_08_40_09_PM_ycq88d.png";

const heroLogos = {
  lajme: NEW_HERO_LOGO,
  patundshmeri: NEW_HERO_LOGO,
  automjete: NEW_HERO_LOGO,
  oferta: NEW_HERO_LOGO,
  "konkurse-pune": NEW_HERO_LOGO
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

  const slides = useMemo(() => {
    return (
      heroSlides[category] || [
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1800&auto=format&fit=crop"
      ]
    );
  }, [category]);

  useEffect(() => {
    setSlideIndex(0);
  }, [category]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [slides]);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1100;

  const title = categoryTitles[category] || "Kategori";
  const description =
    categoryDescriptions[category] || "Përmbajtje për këtë kategori.";
  const badge = categoryBadges[category] || "Përmbajtje";
  const heroLogo = heroLogos[category] || NEW_HERO_LOGO;

  return (
    <section
      style={{
        position: "relative",
        minHeight: isMobile ? "360px" : isTablet ? "430px" : "500px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden"
      }}
    >
      <style>{`
        @keyframes heroFloatLogo {
          0% {
            transform: translateY(0px) rotate(-2deg) scale(1);
          }
          50% {
            transform: translateY(-8px) rotate(0deg) scale(1.015);
          }
          100% {
            transform: translateY(0px) rotate(-2deg) scale(1);
          }
        }

        @keyframes heroPulseGlow {
          0% {
            opacity: 0.22;
            transform: scale(1);
          }
          50% {
            opacity: 0.36;
            transform: scale(1.04);
          }
          100% {
            opacity: 0.22;
            transform: scale(1);
          }
        }

        @keyframes heroLogoShine {
          0% {
            opacity: 0;
            transform: translateX(-40px) skewX(-12deg);
          }
          30% {
            opacity: 0.30;
          }
          100% {
            opacity: 0;
            transform: translateX(220px) skewX(-12deg);
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
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            transform: isMobile ? "scale(1.04)" : "scale(1.06)",
            opacity: slideIndex === index ? 1 : 0,
            transition: "opacity 1s ease"
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isMobile
            ? "linear-gradient(180deg, rgba(2,6,23,0.58) 0%, rgba(2,6,23,0.78) 70%, rgba(2,6,23,0.88) 100%)"
            : "linear-gradient(90deg, rgba(2,6,23,0.84) 0%, rgba(2,6,23,0.62) 42%, rgba(2,6,23,0.48) 68%, rgba(2,6,23,0.62) 100%)"
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.18), transparent 28%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08), transparent 24%)"
        }}
      />

      <div
        style={{
          position: "absolute",
          left: isMobile ? "-80px" : "-40px",
          bottom: isMobile ? "-90px" : "-120px",
          width: isMobile ? "220px" : "320px",
          height: isMobile ? "220px" : "320px",
          borderRadius: "999px",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)",
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          position: "absolute",
          right: isMobile ? "-70px" : "-30px",
          top: isMobile ? "-80px" : "-110px",
          width: isMobile ? "220px" : "320px",
          height: isMobile ? "220px" : "320px",
          borderRadius: "999px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)",
          pointerEvents: "none"
        }}
      />

      {!isMobile && (
        <>
          <div
            style={{
              position: "absolute",
              right: isTablet ? "7%" : "8%",
              top: isTablet ? "17%" : "15%",
              width: isTablet ? "210px" : "270px",
              height: isTablet ? "210px" : "270px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(14,165,233,0.22), rgba(37,99,235,0.08), transparent 72%)",
              filter: "blur(20px)",
              animation: "heroPulseGlow 5.2s ease-in-out infinite",
              pointerEvents: "none",
              zIndex: 1
            }}
          />

          <div
            style={{
              position: "absolute",
              right: isTablet ? "5.2%" : "6%",
              top: isTablet ? "12%" : "10%",
              width: isTablet ? "250px" : "340px",
              height: isTablet ? "250px" : "340px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "heroFloatLogo 5.8s ease-in-out infinite",
              pointerEvents: "none",
              zIndex: 2
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%"
              }}
            >
              <img
                src={heroLogo}
                alt="Publiko"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  opacity: 0.28,
                  filter:
                    "drop-shadow(0 10px 24px rgba(2,6,23,0.25)) drop-shadow(0 0 26px rgba(59,130,246,0.18))"
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: "18%",
                  left: "10%",
                  width: "36%",
                  height: "56%",
                  background:
                    "linear-gradient(120deg, rgba(255,255,255,0), rgba(255,255,255,0.32), rgba(255,255,255,0))",
                  filter: "blur(4px)",
                  transform: "skewX(-12deg)",
                  animation: "heroLogoShine 4.5s ease-in-out infinite"
                }}
              />
            </div>
          </div>
        </>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          maxWidth: "1500px",
          margin: "0 auto",
          padding: isMobile
            ? "38px 14px 92px"
            : isTablet
              ? "54px 22px 110px"
              : "72px 26px 130px",
          boxSizing: "border-box"
        }}
      >
        <div style={{ maxWidth: isMobile ? "100%" : "780px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: isMobile ? "8px 13px" : "10px 16px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#dbeafe",
              fontSize: isMobile ? "11px" : "12px",
              fontWeight: "800",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              marginBottom: isMobile ? "16px" : "20px"
            }}
          >
            {badge}
          </div>

          <h1
            style={{
              margin: "0 0 14px",
              color: "#ffffff",
              fontSize: isMobile
                ? "clamp(34px, 10vw, 42px)"
                : isTablet
                  ? "58px"
                  : "76px",
              lineHeight: isMobile ? 0.98 : 0.94,
              fontWeight: "900",
              letterSpacing: "-0.045em",
              textShadow: "0 10px 26px rgba(0,0,0,0.18)"
            }}
          >
            {title}
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: isMobile ? "100%" : "760px",
              color: "rgba(255,255,255,0.92)",
              fontSize: isMobile ? "14px" : isTablet ? "17px" : "20px",
              lineHeight: isMobile ? 1.72 : 1.82,
              fontWeight: "500",
              textShadow: "0 6px 22px rgba(0,0,0,0.12)"
            }}
          >
            {description}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? "8px" : "10px",
              marginTop: isMobile ? "18px" : "24px"
            }}
          >
            <div
              style={{
                padding: isMobile ? "9px 12px" : "10px 14px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "#ffffff",
                fontSize: isMobile ? "12px" : "13px",
                fontWeight: "700",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}
            >
              Responsive
            </div>

            <div
              style={{
                padding: isMobile ? "9px 12px" : "10px 14px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "#ffffff",
                fontSize: isMobile ? "12px" : "13px",
                fontWeight: "700",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}
            >
              Dizajn premium
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: isMobile ? "18px" : "28px",
            transform: "translateX(-50%)",
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSlideIndex(index)}
              aria-label={`Slide ${index + 1}`}
              style={{
                width: slideIndex === index ? "28px" : "9px",
                height: "9px",
                borderRadius: "999px",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background:
                  slideIndex === index
                    ? "linear-gradient(135deg, #ffffff, #dbeafe)"
                    : "rgba(255,255,255,0.38)",
                boxShadow:
                  slideIndex === index
                    ? "0 0 16px rgba(255,255,255,0.38)"
                    : "none",
                transition: "all .28s ease"
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}