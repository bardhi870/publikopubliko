import React, { useEffect, useMemo, useState } from "react";
import OfferCard from "./OfferCard";
import AdSlot from "../../components/ads/AdSlot";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PUBLIKO_LOGO =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776285534/ChatGPT_Image_Apr_15_2026_10_38_27_PM_bf2mf9.png";

const defaultHighlights = [
  "Shtrirje e gjerë – shpallja juaj promovohet te një audiencë e madhe.",
  "Publikim profesional dhe prezencë më serioze për biznesin tuaj.",
  "Menaxhim më i lehtë i kontaktit dhe regjistrimeve për klientët tuaj."
];

export default function OffersSection() {
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [offersRes, statsRes] = await Promise.all([
          fetch(`${API}/api/packages`),
          fetch(`${API}/api/stats`)
        ]);

        if (!offersRes.ok) {
          throw new Error("Gabim gjatë marrjes së ofertave.");
        }

        if (!statsRes.ok) {
          throw new Error("Gabim gjatë marrjes së statistikave.");
        }

        const offersData = await offersRes.json();
        const statsData = await statsRes.json();

        const normalizedOffers = Array.isArray(offersData) ? offersData : [];
        const normalizedStats = Array.isArray(statsData) ? statsData : [];

        if (!ignore) {
          setOffers(
            normalizedOffers.filter((offer) =>
              offer.is_active !== undefined
                ? !!offer.is_active
                : offer.isActive !== undefined
                  ? !!offer.isActive
                  : true
            )
          );

          setStats(
            normalizedStats
              .filter((stat) =>
                stat.status !== undefined ? stat.status === "Aktive" : true
              )
              .sort(
                (a, b) =>
                  Number(a?.sort_order ?? a?.sortOrder ?? 0) -
                  Number(b?.sort_order ?? b?.sortOrder ?? 0)
              )
          );
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("Nuk u ngarkuan të dhënat.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1100;

  const sortedOffers = useMemo(() => {
    return [...offers].sort(
      (a, b) => Number(b.price || 0) - Number(a.price || 0)
    );
  }, [offers]);

  const singleOffer = sortedOffers.length === 1;
  const twoOffers = sortedOffers.length === 2;

  if (loading) {
    return <div style={emptyStateStyle}>Duke i ngarkuar ofertat...</div>;
  }

  if (error) {
    return <div style={emptyStateStyle}>{error}</div>;
  }

  if (!sortedOffers.length) {
    return (
      <div style={emptyStateStyle}>
        Nuk ka oferta të publikuara për momentin.
      </div>
    );
  }

  return (
    <section style={{ width: "100%" }}>
      <div
        style={{
          textAlign: "center",
          maxWidth: "920px",
          margin: isMobile ? "0 auto 26px" : "0 auto 40px",
          padding: isMobile ? "0 4px" : "0"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? "8px 13px" : "10px 16px",
            borderRadius: "999px",
            background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
            color: "#1d4ed8",
            fontWeight: "800",
            fontSize: isMobile ? "12px" : "13px",
            marginBottom: isMobile ? "12px" : "14px",
            boxShadow: "0 10px 24px rgba(37,99,235,0.08)"
          }}
        >
          Paketa & Oferta
        </div>

        <h2
          style={{
            margin: "0 0 12px",
            color: "#0f172a",
            fontSize: isMobile ? "30px" : isTablet ? "42px" : "54px",
            lineHeight: isMobile ? 1.08 : 1.02,
            letterSpacing: "-0.05em",
            fontWeight: "900"
          }}
        >
          Zgjedh ofertën që të përshtatet më së miri
        </h2>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: isMobile ? "14px" : "17px",
            lineHeight: isMobile ? 1.75 : 1.85,
            maxWidth: "720px",
            marginInline: "auto"
          }}
        >
          Paketa fleksibile, prezencë më profesionale dhe mundësi kontakti direkt
          për regjistrim apo konsultim.
        </p>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto 26px"
        }}
      >
        <AdSlot placement="offers_top_banner" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: singleOffer
            ? "minmax(300px, 720px)"
            : twoOffers && !isMobile
              ? "repeat(2, minmax(320px, 540px))"
              : isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(320px, 1fr))",
          justifyContent: "center",
          gap: isMobile ? "18px" : "26px",
          alignItems: "stretch",
          maxWidth: singleOffer
            ? "760px"
            : twoOffers
              ? "1120px"
              : "1280px",
          margin: "0 auto"
        }}
      >
        {sortedOffers.map((offer, index) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            featured={singleOffer ? true : index === 1 || !!offer.offer_badge}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: isMobile ? "28px" : "44px",
          borderRadius: isMobile ? "24px" : "34px",
          padding: isMobile ? "22px 16px" : "38px 34px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(240,253,250,0.96) 100%)",
          border: "1px solid rgba(203,213,225,0.8)",
          boxShadow: "0 24px 60px rgba(15,23,42,0.07)",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-90px",
            right: "-70px",
            width: isMobile ? "180px" : "280px",
            height: isMobile ? "180px" : "280px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(45,212,191,0.16) 0%, rgba(45,212,191,0) 72%)",
            pointerEvents: "none"
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-110px",
            left: "-80px",
            width: isMobile ? "200px" : "300px",
            height: isMobile ? "200px" : "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0) 74%)",
            pointerEvents: "none"
          }}
        />

        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: isMobile ? "8px 14px" : "10px 16px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.86)",
              border: "1px solid rgba(226,232,240,0.95)",
              boxShadow: "0 14px 32px rgba(15,23,42,0.06)",
              marginBottom: isMobile ? "14px" : "18px"
            }}
          >
            <img
              src={PUBLIKO_LOGO}
              alt="Publiko"
              style={{
                width: isMobile ? "26px" : "30px",
                height: isMobile ? "26px" : "30px",
                objectFit: "contain",
                borderRadius: "999px",
                background: "#fff",
                padding: "3px",
                boxShadow: "0 6px 18px rgba(15,23,42,0.08)"
              }}
            />
            <span
              style={{
                color: "#0f172a",
                fontWeight: "800",
                fontSize: isMobile ? "12px" : "13px"
              }}
            >
              Publiko
            </span>
          </div>

          <h3
            style={{
              margin: "0 0 12px",
              color: "#0f172a",
              fontSize: isMobile ? "28px" : "44px",
              lineHeight: isMobile ? 1.1 : 1.04,
              fontWeight: "900",
              letterSpacing: "-0.04em"
            }}
          >
            Pse të zgjidhni Publiko?
          </h3>

          <p
            style={{
              maxWidth: "760px",
              margin: "0 auto",
              color: "#64748b",
              fontSize: isMobile ? "14px" : "17px",
              lineHeight: isMobile ? 1.8 : 1.9
            }}
          >
            Prezencë më e fortë, më shumë besueshmëri dhe më shumë mundësi që
            oferta juaj të arrijë te klientët e duhur.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(3, minmax(0, 1fr))",
              gap: isMobile ? "12px" : "16px",
              marginTop: isMobile ? "20px" : "28px"
            }}
          >
            {stats.length ? (
              stats.map((stat, index) => (
                <div
                  key={stat.id || index}
                  style={{
                    borderRadius: isMobile ? "18px" : "24px",
                    padding: isMobile ? "18px 16px" : "24px 22px",
                    background: "rgba(255,255,255,0.86)",
                    border: "1px solid rgba(203,213,225,0.75)",
                    boxShadow: "0 16px 34px rgba(15,23,42,0.05)",
                    backdropFilter: "blur(8px)",
                    textAlign: "left"
                  }}
                >
                  <div
                    style={{
                      color: "#0f172a",
                      fontSize: isMobile ? "28px" : "36px",
                      fontWeight: "900",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      marginBottom: "10px"
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: isMobile ? "13px" : "14px",
                      lineHeight: 1.7,
                      fontWeight: "600"
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  color: "#64748b",
                  padding: "12px 0"
                }}
              >
                Nuk ka statistika aktive për momentin.
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gap: "12px",
              maxWidth: "760px",
              margin: isMobile ? "22px auto 0" : "30px auto 0",
              textAlign: "left"
            }}
          >
            {defaultHighlights.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: isMobile ? "14px 14px" : "16px 18px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.78)",
                  border: "1px solid rgba(226,232,240,0.9)",
                  boxShadow: "0 12px 26px rgba(15,23,42,0.04)"
                }}
              >
                <span
                  style={{
                    width: "24px",
                    height: "24px",
                    minWidth: "24px",
                    borderRadius: "999px",
                    background: "rgba(20,184,166,0.14)",
                    color: "#0f766e",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "900",
                    marginTop: "1px"
                  }}
                >
                  ✓
                </span>

                <span
                  style={{
                    color: "#334155",
                    fontSize: isMobile ? "14px" : "15px",
                    lineHeight: 1.7,
                    fontWeight: "600"
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const emptyStateStyle = {
  padding: "42px 24px",
  borderRadius: "28px",
  background: "linear-gradient(180deg, #ffffff, #f8fafc)",
  border: "1px dashed #cbd5e1",
  color: "#64748b",
  textAlign: "center",
  fontSize: "15px",
  boxShadow: "0 18px 45px rgba(15,23,42,0.05)"
};