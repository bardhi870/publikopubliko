import React, { useEffect, useMemo, useState } from "react";
import OfferCard from "./OfferCard";
import AdSlot from "../../components/ads/AdSlot";
import {
  FiUsers,
  FiHome,
  FiTrendingUp,
  FiBriefcase,
  FiBarChart2,
  FiCheckCircle,
  FiZap
} from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PUBLIKO_LOGO =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776285534/ChatGPT_Image_Apr_15_2026_10_38_27_PM_bf2mf9.png";

const defaultHighlights = [
  "Shtrirje e gjerë – shpallja juaj promovohet te një audiencë më e madhe.",
  "Publikim profesional dhe prezencë më serioze për biznesin tuaj.",
  "Kontakt më i lehtë me klientët përmes telefonit, WhatsApp apo formularëve."
];

export default function OffersSection() {
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        if (!offersRes.ok) throw new Error("Gabim gjatë marrjes së ofertave.");
        if (!statsRes.ok) throw new Error("Gabim gjatë marrjes së statistikave.");

        const offersData = await offersRes.json();
        const statsData = await statsRes.json();

        if (!ignore) {
          setOffers(
            (Array.isArray(offersData) ? offersData : []).filter((offer) =>
              offer.is_active !== undefined
                ? !!offer.is_active
                : offer.isActive !== undefined
                  ? !!offer.isActive
                  : true
            )
          );

          setStats(
            (Array.isArray(statsData) ? statsData : [])
              .filter((stat) =>
                stat.status !== undefined ? stat.status === "Aktive" : true
              )
              .sort(
                (a, b) =>
                  Number(a?.sort_order ?? a?.sortOrder ?? 0) -
                  Number(b?.sort_order ?? b?.sortOrder ?? 0)
              )
              .slice(0, 3)
          );
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("Nuk u ngarkuan të dhënat.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const sortedOffers = useMemo(() => {
    return [...offers].sort(
      (a, b) => Number(b.price || 0) - Number(a.price || 0)
    );
  }, [offers]);

  const singleOffer = sortedOffers.length === 1;
  const twoOffers = sortedOffers.length === 2;

  if (loading) {
    return <div className="offers-empty-state">Duke i ngarkuar ofertat...</div>;
  }

  if (error) {
    return <div className="offers-empty-state">{error}</div>;
  }

  if (!sortedOffers.length) {
    return (
      <div className="offers-empty-state">
        Nuk ka oferta të publikuara për momentin.
      </div>
    );
  }

  return (
    <section className="offers-section">
      <style>{`
        .offers-section {
          width: 100%;
          position: relative;
          isolation: isolate;
          padding: clamp(20px, 3vw, 44px) 0 clamp(30px, 4vw, 60px);
        }

        .offers-section::before {
          content: "";
          position: absolute;
          inset: -40px 0 auto 0;
          height: 420px;
          background:
            radial-gradient(circle at 18% 12%, rgba(59,130,246,.13), transparent 34%),
            radial-gradient(circle at 82% 18%, rgba(20,184,166,.12), transparent 32%);
          pointer-events: none;
          z-index: -1;
        }

        .offers-hero {
          max-width: 980px;
          margin: 0 auto clamp(26px, 4vw, 44px);
          padding: 0 16px;
          text-align: center;
        }

        .offers-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: #1d4ed8;
          font-weight: 900;
          font-size: 13px;
          margin-bottom: 16px;
          box-shadow: 0 14px 30px rgba(37,99,235,.11);
          border: 1px solid rgba(191,219,254,.95);
        }

        .offers-title {
          margin: 0;
          color: #0f172a;
          font-size: clamp(34px, 5vw, 62px);
          line-height: .98;
          letter-spacing: -.06em;
          font-weight: 950;
        }

        .offers-title span {
          background: linear-gradient(135deg, #2563eb, #0f766e);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .offers-subtitle {
          max-width: 740px;
          margin: 16px auto 0;
          color: #64748b;
          font-size: clamp(14px, 1.6vw, 17px);
          line-height: 1.85;
          font-weight: 600;
        }

        .offers-ad-wrap {
          max-width: 1280px;
          margin: 0 auto 28px;
          padding: 0 16px;
        }

        .offers-grid {
          display: grid;
          justify-content: center;
          align-items: stretch;
          gap: 26px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .offers-grid.single {
          max-width: 780px;
          grid-template-columns: minmax(280px, 720px);
        }

        .offers-grid.two {
          max-width: 1120px;
          grid-template-columns: repeat(2, minmax(300px, 540px));
        }

        .offers-grid.multi {
          grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
        }

        .offers-proof {
          max-width: 1280px;
          margin: clamp(30px, 4vw, 52px) auto 0;
          padding: 0 16px;
        }

        .offers-proof-card {
          position: relative;
          overflow: hidden;
          border-radius: 36px;
          padding: clamp(24px, 4vw, 42px);
          background:
            linear-gradient(135deg, rgba(255,255,255,.98), rgba(240,253,250,.96)),
            radial-gradient(circle at top right, rgba(45,212,191,.16), transparent 34%);
          border: 1px solid rgba(203,213,225,.85);
          box-shadow: 0 28px 80px rgba(15,23,42,.08);
        }

        .offers-proof-card::before {
          content: "";
          position: absolute;
          top: -120px;
          right: -90px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(45,212,191,.20), transparent 70%);
          pointer-events: none;
        }

        .offers-proof-card::after {
          content: "";
          position: absolute;
          bottom: -130px;
          left: -90px;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,.14), transparent 72%);
          pointer-events: none;
        }

        .offers-proof-content {
          position: relative;
          z-index: 1;
          max-width: 1030px;
          margin: 0 auto;
          text-align: center;
        }

        .offers-brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,.88);
          border: 1px solid rgba(226,232,240,.95);
          box-shadow: 0 14px 34px rgba(15,23,42,.07);
          margin-bottom: 18px;
        }

        .offers-brand-pill img {
          width: 32px;
          height: 32px;
          object-fit: contain;
          border-radius: 999px;
          background: #fff;
          padding: 3px;
          box-shadow: 0 8px 18px rgba(15,23,42,.10);
        }

        .offers-brand-pill span {
          color: #0f172a;
          font-weight: 900;
          font-size: 13px;
        }

        .offers-proof-title {
          margin: 0;
          color: #0f172a;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.02;
          font-weight: 950;
          letter-spacing: -.05em;
        }

        .offers-proof-text {
          max-width: 760px;
          margin: 14px auto 0;
          color: #64748b;
          font-size: clamp(14px, 1.5vw, 17px);
          line-height: 1.9;
          font-weight: 600;
        }

        .offers-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 30px;
        }

        .offers-stat-card {
          border-radius: 26px;
          padding: 24px 22px;
          background: rgba(255,255,255,.9);
          border: 1px solid rgba(203,213,225,.8);
          box-shadow: 0 18px 38px rgba(15,23,42,.055);
          backdrop-filter: blur(10px);
          text-align: left;
          transition: transform .22s ease, box-shadow .22s ease;
        }

        .offers-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 50px rgba(15,23,42,.08);
        }

        .offers-stat-icon {
          width: 62px;
          height: 62px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #ecfeff, #e0f2fe);
          color: #0891b2;
          border: 1px solid #c7f0f5;
        }

        .offers-stat-value {
          color: #0f172a;
          font-size: 38px;
          font-weight: 950;
          line-height: 1;
          letter-spacing: -.05em;
          margin-bottom: 10px;
        }

        .offers-stat-label {
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
          font-weight: 800;
        }

        .offers-highlights {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin: 28px auto 0;
          text-align: left;
        }

        .offers-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 17px 18px;
          border-radius: 22px;
          background: rgba(255,255,255,.78);
          border: 1px solid rgba(226,232,240,.95);
          box-shadow: 0 14px 30px rgba(15,23,42,.045);
        }

        .offers-highlight-icon {
          width: 28px;
          height: 28px;
          min-width: 28px;
          border-radius: 999px;
          background: rgba(20,184,166,.14);
          color: #0f766e;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
        }

        .offers-highlight span:last-child {
          color: #334155;
          font-size: 14.5px;
          line-height: 1.7;
          font-weight: 700;
        }

        .offers-empty-state {
          padding: 42px 24px;
          border-radius: 28px;
          background: linear-gradient(180deg, #ffffff, #f8fafc);
          border: 1px dashed #cbd5e1;
          color: #64748b;
          text-align: center;
          font-size: 15px;
          box-shadow: 0 18px 45px rgba(15,23,42,.05);
        }

        @media (max-width: 1100px) {
          .offers-grid.multi {
            grid-template-columns: repeat(2, minmax(280px, 1fr));
          }

          .offers-highlights {
            grid-template-columns: 1fr;
            max-width: 780px;
          }
        }

        @media (max-width: 768px) {
          .offers-section {
            padding-top: 18px;
          }

          .offers-hero {
            padding: 0 14px;
            margin-bottom: 24px;
          }

          .offers-badge {
            padding: 8px 13px;
            font-size: 12px;
            margin-bottom: 13px;
          }

          .offers-title {
            font-size: clamp(32px, 10vw, 42px);
            line-height: 1.05;
            letter-spacing: -.045em;
          }

          .offers-subtitle {
            font-size: 14px;
            line-height: 1.75;
            margin-top: 12px;
          }

          .offers-ad-wrap {
            padding: 0 12px;
            margin-bottom: 20px;
          }

          .offers-grid,
          .offers-grid.single,
          .offers-grid.two,
          .offers-grid.multi {
            grid-template-columns: 1fr;
            gap: 18px;
            padding: 0 12px;
            max-width: 100%;
          }

          .offers-proof {
            margin-top: 30px;
            padding: 0 12px;
          }

          .offers-proof-card {
            border-radius: 26px;
            padding: 24px 15px;
          }

          .offers-brand-pill {
            padding: 8px 13px;
            margin-bottom: 15px;
          }

          .offers-brand-pill img {
            width: 27px;
            height: 27px;
          }

          .offers-proof-title {
            font-size: clamp(28px, 9vw, 36px);
            line-height: 1.08;
          }

          .offers-proof-text {
            font-size: 14px;
            line-height: 1.75;
          }

          .offers-stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-top: 22px;
          }

          .offers-stat-card {
            border-radius: 20px;
            padding: 18px 16px;
          }

          .offers-stat-icon {
            width: 54px;
            height: 54px;
            border-radius: 17px;
            margin-bottom: 14px;
          }

          .offers-stat-value {
            font-size: 30px;
          }

          .offers-stat-label {
            font-size: 13px;
          }

          .offers-highlights {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-top: 22px;
          }

          .offers-highlight {
            border-radius: 18px;
            padding: 14px;
          }

          .offers-highlight span:last-child {
            font-size: 14px;
          }
        }

        @media (max-width: 420px) {
          .offers-title {
            font-size: 31px;
          }

          .offers-proof-card {
            padding-left: 13px;
            padding-right: 13px;
          }
        }
      `}</style>

      <div className="offers-hero">
        <div className="offers-badge">
          <FiZap size={15} />
          Paketa & Oferta
        </div>

        <h2 className="offers-title">
          Zgjedh ofertën që <span>të përshtatet</span> më së miri
        </h2>

        <p className="offers-subtitle">
          Paketa fleksibile, prezencë më profesionale dhe mundësi kontakti direkt
          për regjistrim apo konsultim.
        </p>
      </div>

      <div className="offers-ad-wrap">
        <AdSlot placement="offers_top_banner" />
      </div>

      <div
        className={`offers-grid ${
          singleOffer ? "single" : twoOffers ? "two" : "multi"
        }`}
      >
        {sortedOffers.map((offer, index) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            featured={singleOffer ? true : index === 1 || !!offer.offer_badge}
          />
        ))}
      </div>

      <div className="offers-proof">
        <div className="offers-proof-card">
          <div className="offers-proof-content">
            <div className="offers-brand-pill">
              <img src={PUBLIKO_LOGO} alt="Publiko" />
              <span>Publiko</span>
            </div>

            <h3 className="offers-proof-title">Pse të zgjidhni Publiko?</h3>

            <p className="offers-proof-text">
              Prezencë më e fortë, më shumë besueshmëri dhe më shumë mundësi që
              oferta juaj të arrijë te klientët e duhur.
            </p>

            <div className="offers-stats-grid">
              {stats.length ? (
                stats.map((stat, index) => {
                  const Icon = getStatIcon(stat, index);

                  return (
                    <div className="offers-stat-card" key={stat.id || index}>
                      <div className="offers-stat-icon">
                        <Icon size={28} />
                      </div>

                      <div className="offers-stat-value">{stat.value}</div>
                      <div className="offers-stat-label">{stat.label}</div>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    color: "#64748b",
                    padding: "12px 0",
                    fontWeight: 700
                  }}
                >
                  Nuk ka statistika aktive për momentin.
                </div>
              )}
            </div>

            <div className="offers-highlights">
              {defaultHighlights.map((item, index) => (
                <div className="offers-highlight" key={index}>
                  <span className="offers-highlight-icon">
                    <FiCheckCircle size={17} />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getStatIcon(item, index) {
  const text = `${item?.label || ""} ${item?.value || ""}`.toLowerCase();

  if (
    text.includes("pun") ||
    text.includes("klient") ||
    text.includes("user") ||
    text.includes("persona") ||
    text.includes("shikime")
  ) {
    return FiUsers;
  }

  if (
    text.includes("biznes") ||
    text.includes("kompani") ||
    text.includes("company") ||
    text.includes("regjistr")
  ) {
    return FiHome;
  }

  if (
    text.includes("rritje") ||
    text.includes("trend") ||
    text.includes("vizita") ||
    text.includes("website") ||
    text.includes("trafik")
  ) {
    return FiTrendingUp;
  }

  if (
    text.includes("projekt") ||
    text.includes("job") ||
    text.includes("punë") ||
    text.includes("pune")
  ) {
    return FiBriefcase;
  }

  const icons = [FiUsers, FiHome, FiTrendingUp, FiBriefcase, FiBarChart2];
  return icons[index % icons.length];
}