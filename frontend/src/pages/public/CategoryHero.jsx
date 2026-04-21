import React, { useEffect, useState } from "react";

const categoryTitles = {
  lajme: "Lajme",
  vendi: "Vendi",
  rajoni: "Rajoni",
  bota: "Bota",
  patundshmeri: "Patundshmëri",
  automjete: "Automjete",
  oferta: "Oferta",
  "konkurse-pune": "Konkurse Pune"
};

const categoryDescriptions = {
  lajme:
    "Zhvillimet më të fundit, informacionet kryesore dhe temat më të rëndësishme të ditës.",
  vendi:
    "Ngjarje, aktualitete dhe përmbajtje me fokus nga Kosova dhe hapësira vendore.",
  rajoni:
    "Lajme, zhvillime dhe temat më me ndikim nga rajoni ynë.",
  bota:
    "Ngjarje ndërkombëtare, analiza dhe zhvillime globale në një vend.",
  patundshmeri:
    "Banesë, shtëpi, toka dhe prona të ndryshme të organizuara qartë dhe bukur.",
  automjete:
    "Automjete, publikime të reja dhe oferta të përzgjedhura për çdo interes.",
  oferta:
    "Paketa profesionale, oferta promocionale dhe zgjidhje të personalizuara për biznesin tuaj.",
  "konkurse-pune":
    "Gjej konkurse pune, pozita të hapura dhe mundësi të reja për karrierën tënde."
};

const heroImages = {
  lajme:
    "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1770616331/pexels-gdtography-277628-911738_avu5ml.jpg",
  vendi:
    "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1770616331/pexels-gdtography-277628-911738_avu5ml.jpg",
  rajoni:
    "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1770616331/pexels-gdtography-277628-911738_avu5ml.jpg",
  bota:
    "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1770616331/pexels-gdtography-277628-911738_avu5ml.jpg",
  patundshmeri:
    "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776272072/pexels-aubin-kirch-280714467-18098706_typ0ey_nawh9b.jpg",
  automjete:
    "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776272072/pexels-aubin-kirch-280714467-18098706_typ0ey_nawh9b.jpg",
  oferta:
    "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776474870/p_lomjpm.png",
  "konkurse-pune":
    "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1770616331/pexels-gdtography-277628-911738_avu5ml.jpg"
};

const offerSlides = [
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776474870/p_lomjpm.png",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776285534/ChatGPT_Image_Apr_15_2026_10_38_27_PM_bf2mf9.png",
  "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1800&auto=format&fit=crop"
];

const offerLogo =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776285534/ChatGPT_Image_Apr_15_2026_10_38_27_PM_bf2mf9.png";

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
  const isOffersPage = category === "oferta";

  useEffect(() => {
    if (!isOffersPage) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % offerSlides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isOffersPage]);

  const title = categoryTitles[category] || "Kategoria";
  const description =
    categoryDescriptions[category] ||
    "Përmbajtje dhe publikime për këtë kategori.";

  const heroImage = isOffersPage
    ? offerSlides[slideIndex]
    : heroImages[category] ||
      "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1770616331/pexels-gdtography-277628-911738_avu5ml.jpg";

  const contentMaxWidth = isOffersPage ? "780px" : isMobile ? "100%" : "800px";

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: isOffersPage
          ? isMobile
            ? "520px"
            : isTablet
            ? "590px"
            : "650px"
          : isMobile
          ? "340px"
          : isTablet
          ? "390px"
          : "450px",
        display: "flex",
        alignItems: "center",
        borderBottomLeftRadius: isOffersPage ? (isMobile ? "28px" : "40px") : "0",
        borderBottomRightRadius: isOffersPage ? (isMobile ? "28px" : "40px") : "0"
      }}
    >
      {isOffersPage
        ? offerSlides.map((image, index) => (
            <div
              key={image}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                transform: isMobile ? "scale(1.05)" : "scale(1.03)",
                opacity: slideIndex === index ? 1 : 0,
                transition: "opacity 1s ease"
              }}
            />
          ))
        : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transform: isMobile ? "scale(1.02)" : "scale(1.05)"
            }}
          />
        )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isOffersPage
            ? isMobile
              ? "linear-gradient(180deg, rgba(3,12,29,0.86) 0%, rgba(7,20,42,0.68) 42%, rgba(8,32,43,0.50) 72%, rgba(20,184,166,0.24) 100%)"
              : "linear-gradient(90deg, rgba(5,15,35,0.90) 0%, rgba(7,20,42,0.76) 36%, rgba(8,32,43,0.48) 65%, rgba(20,184,166,0.34) 100%)"
            : "linear-gradient(135deg, rgba(7,16,34,0.92) 0%, rgba(15,23,42,0.82) 42%, rgba(37,99,235,0.62) 100%)"
        }}
      />

      {isOffersPage && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 78% 24%, rgba(94,234,212,0.20), transparent 24%), radial-gradient(circle at 18% 86%, rgba(59,130,246,0.16), transparent 28%)"
            }}
          />

          <div
            style={{
              position: "absolute",
              left: isMobile ? "-18%" : "-6%",
              bottom: isMobile ? "-80px" : "-120px",
              width: isMobile ? "320px" : "540px",
              height: isMobile ? "320px" : "540px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 65%)",
              pointerEvents: "none"
            }}
          />

          <div
            style={{
              position: "absolute",
              right: isMobile ? "-18%" : "-6%",
              top: isMobile ? "-80px" : "-120px",
              width: isMobile ? "320px" : "540px",
              height: isMobile ? "540px" : "540px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(20,184,166,0.18), transparent 65%)",
              pointerEvents: "none"
            }}
          />
        </>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(15,23,42,0.10) 100%)"
        }}
      />

      {isOffersPage && !isMobile && (
        <img
          src={offerLogo}
          alt="Publiko"
          style={{
            position: "absolute",
            right: isTablet ? "7%" : "8%",
            top: isTablet ? "15%" : "16%",
            width: isTablet ? "118px" : "150px",
            opacity: 0.13,
            objectFit: "contain",
            filter: "drop-shadow(0 0 34px rgba(94,234,212,0.55))",
            pointerEvents: "none",
            zIndex: 1
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          padding: isOffersPage
            ? isMobile
              ? "48px 16px 94px"
              : isTablet
              ? "72px 24px 116px"
              : "86px 24px 132px"
            : isMobile
            ? "38px 16px 88px"
            : isTablet
            ? "56px 24px 100px"
            : "70px 24px 112px"
        }}
      >
        <div style={{ maxWidth: contentMaxWidth }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: isMobile ? "8px 13px" : "10px 17px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.14)",
              fontSize: isMobile ? "12px" : "13px",
              fontWeight: 700,
              color: "#dbeafe",
              marginBottom: isMobile ? "18px" : "22px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 10px 24px rgba(15,23,42,0.12)",
              letterSpacing: "0.01em"
            }}
          >
            Kategoria • {title}
          </div>

          <h1
            style={{
              fontSize: isOffersPage
                ? isMobile
                  ? "50px"
                  : isTablet
                  ? "64px"
                  : "82px"
                : isMobile
                ? "44px"
                : isTablet
                ? "56px"
                : "72px",
              lineHeight: isMobile ? 0.98 : 0.94,
              margin: "0 0 16px",
              color: "#ffffff",
              letterSpacing: "-0.045em",
              fontWeight: 900,
              textWrap: "balance",
              textShadow: "0 10px 30px rgba(0,0,0,0.18)"
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: isOffersPage
                ? isMobile
                  ? "15px"
                  : isTablet
                  ? "18px"
                  : "20px"
                : isMobile
                ? "15px"
                : isTablet
                ? "17px"
                : "20px",
              color: "rgba(219,234,254,0.94)",
              lineHeight: isMobile ? 1.75 : 1.82,
              margin: 0,
              maxWidth: isMobile ? "100%" : "760px",
              fontWeight: 500,
              letterSpacing: "0.002em",
              textShadow: "0 6px 22px rgba(0,0,0,0.12)"
            }}
          >
            {description}
          </p>

          {isOffersPage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: isMobile ? "20px" : "26px"
              }}
            >
              {offerSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSlideIndex(index)}
                  aria-label={`Slide ${index + 1}`}
                  style={{
                    width: slideIndex === index ? "28px" : "9px",
                    height: "9px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    background:
                      slideIndex === index
                        ? "linear-gradient(135deg, #5eead4, #14b8a6)"
                        : "rgba(255,255,255,0.35)",
                    boxShadow:
                      slideIndex === index
                        ? "0 0 18px rgba(94,234,212,0.45)"
                        : "none",
                    transition: "all .28s ease",
                    padding: 0
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}