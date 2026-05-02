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
  FiZap,
  FiShield,
  FiStar
} from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PUBLIKO_LOGO =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776969027/PUBLIKO_LOGO_pomulk.png";

const fallbackStats = [
  { id: "views", value: "100K+", label: "Vizitorë potencialë çdo muaj" },
  { id: "business", value: "24/7", label: "Prezencë aktive online" },
  { id: "growth", value: "PRO", label: "Publikim profesional për biznesin" }
];

const defaultHighlights = [
  "Shpallja juaj promovohet te një audiencë më e madhe.",
  "Prezantim më profesional dhe më serioz për biznesin tuaj.",
  "Kontakt direkt përmes telefonit, WhatsApp ose formularëve."
];

export default function OffersSection() {
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState(fallbackStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const offersRes = await fetch(`${API}/api/packages`);

        if (!offersRes.ok) {
          throw new Error("Gabim gjatë marrjes së ofertave.");
        }

        const offersData = await offersRes.json();

        let statsData = [];

        try {
          const statsRes = await fetch(`${API}/api/stats`);
          if (statsRes.ok) {
            statsData = await statsRes.json();
          }
        } catch {
          statsData = [];
        }

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

          const activeStats = (Array.isArray(statsData) ? statsData : [])
            .filter((stat) =>
              stat.status !== undefined ? stat.status === "Aktive" : true
            )
            .sort(
              (a, b) =>
                Number(a?.sort_order ?? a?.sortOrder ?? 0) -
                Number(b?.sort_order ?? b?.sortOrder ?? 0)
            )
            .slice(0, 3);

          setStats(activeStats.length ? activeStats : fallbackStats);
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("Nuk u ngarkuan ofertat.");
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
        .offers-section{
          width:100%;
          position:relative;
          isolation:isolate;
          padding:clamp(22px,3vw,44px) 0 clamp(36px,5vw,72px);
        }

        .offers-section::before{
          content:"";
          position:absolute;
          inset:-50px 0 auto;
          height:520px;
          background:
            radial-gradient(circle at 16% 12%, rgba(37,99,235,.16), transparent 34%),
            radial-gradient(circle at 84% 18%, rgba(14,165,233,.14), transparent 34%),
            linear-gradient(180deg, rgba(239,246,255,.75), transparent);
          pointer-events:none;
          z-index:-1;
        }

        .offers-hero{
          max-width:1080px;
          margin:0 auto clamp(28px,4vw,48px);
          padding:0 16px;
          text-align:center;
        }

        .offers-brand-top{
          display:inline-flex;
          align-items:center;
          gap:12px;
          padding:10px 16px;
          border-radius:999px;
          background:rgba(255,255,255,.9);
          border:1px solid #dbeafe;
          box-shadow:0 16px 38px rgba(37,99,235,.10);
          margin-bottom:18px;
        }

        .offers-brand-top img{
          width:34px;
          height:34px;
          object-fit:contain;
          border-radius:11px;
          background:#fff;
        }

        .offers-brand-top strong{
          color:#0f172a;
          font-size:14px;
          font-weight:950;
        }

        .offers-badge{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          padding:10px 16px;
          border-radius:999px;
          background:linear-gradient(135deg,#2563eb,#0ea5e9);
          color:#fff;
          font-weight:950;
          font-size:13px;
          margin-bottom:18px;
          box-shadow:0 18px 38px rgba(37,99,235,.22);
        }

        .offers-title{
          margin:0;
          color:#0f172a;
          font-size:clamp(36px,5.5vw,68px);
          line-height:.96;
          letter-spacing:-.065em;
          font-weight:950;
        }

        .offers-title span{
          background:linear-gradient(135deg,#2563eb,#0ea5e9);
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }

        .offers-subtitle{
          max-width:780px;
          margin:18px auto 0;
          color:#64748b;
          font-size:clamp(14px,1.6vw,17px);
          line-height:1.85;
          font-weight:650;
        }

        .offers-ad-wrap{
          max-width:1280px;
          margin:0 auto 28px;
          padding:0 16px;
        }

        .offers-grid{
          display:grid;
          justify-content:center;
          align-items:stretch;
          gap:26px;
          max-width:1280px;
          margin:0 auto;
          padding:0 16px;
        }

        .offers-grid.single{
          max-width:780px;
          grid-template-columns:minmax(280px,720px);
        }

        .offers-grid.two{
          max-width:1120px;
          grid-template-columns:repeat(2,minmax(300px,540px));
        }

        .offers-grid.multi{
          grid-template-columns:repeat(auto-fit,minmax(310px,1fr));
        }

        .offers-proof{
          max-width:1280px;
          margin:clamp(32px,4vw,56px) auto 0;
          padding:0 16px;
        }

        .offers-proof-card{
          position:relative;
          overflow:hidden;
          border-radius:34px;
          padding:clamp(24px,4vw,44px);
          background:
            radial-gradient(circle at 88% 12%, rgba(59,130,246,.26), transparent 34%),
            radial-gradient(circle at 12% 88%, rgba(14,165,233,.18), transparent 34%),
            linear-gradient(135deg,#071225 0%,#0b2b63 55%,#0b63ce 100%);
          border:1px solid rgba(191,219,254,.35);
          box-shadow:0 34px 90px rgba(15,23,42,.18);
          color:#fff;
        }

        .offers-proof-content{
          position:relative;
          z-index:1;
          max-width:1060px;
          margin:0 auto;
          text-align:center;
        }

        .offers-brand-pill{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 16px;
          border-radius:999px;
          background:rgba(255,255,255,.12);
          border:1px solid rgba(255,255,255,.18);
          backdrop-filter:blur(12px);
          margin-bottom:18px;
        }

        .offers-brand-pill img{
          width:34px;
          height:34px;
          object-fit:contain;
          border-radius:11px;
          background:#fff;
          padding:3px;
        }

        .offers-brand-pill span{
          color:#fff;
          font-weight:950;
          font-size:14px;
        }

        .offers-proof-title{
          margin:0;
          color:#fff;
          font-size:clamp(30px,4vw,50px);
          line-height:1.02;
          font-weight:950;
          letter-spacing:-.055em;
        }

        .offers-proof-text{
          max-width:780px;
          margin:15px auto 0;
          color:#dbeafe;
          font-size:clamp(14px,1.5vw,17px);
          line-height:1.85;
          font-weight:650;
        }

        .offers-stats-grid{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:16px;
          margin-top:30px;
        }

        .offers-stat-card{
          border-radius:24px;
          padding:24px 22px;
          background:rgba(255,255,255,.12);
          border:1px solid rgba(255,255,255,.16);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.10);
          backdrop-filter:blur(12px);
          text-align:left;
          transition:transform .22s ease, box-shadow .22s ease;
        }

        .offers-stat-card:hover{
          transform:translateY(-4px);
          box-shadow:0 24px 50px rgba(0,0,0,.18);
        }

        .offers-stat-icon{
          width:58px;
          height:58px;
          border-radius:18px;
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:16px;
          background:linear-gradient(135deg,#38bdf8,#2563eb);
          color:#fff;
        }

        .offers-stat-value{
          color:#fff;
          font-size:36px;
          font-weight:950;
          line-height:1;
          letter-spacing:-.05em;
          margin-bottom:10px;
        }

        .offers-stat-label{
          color:#dbeafe;
          font-size:14px;
          line-height:1.65;
          font-weight:800;
        }

        .offers-highlights{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:14px;
          margin:28px auto 0;
          text-align:left;
        }

        .offers-highlight{
          display:flex;
          align-items:flex-start;
          gap:12px;
          padding:17px 18px;
          border-radius:20px;
          background:rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.14);
        }

        .offers-highlight-icon{
          width:28px;
          height:28px;
          min-width:28px;
          border-radius:999px;
          background:rgba(56,189,248,.18);
          color:#7dd3fc;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          margin-top:1px;
        }

        .offers-highlight span:last-child{
          color:#e0f2fe;
          font-size:14px;
          line-height:1.7;
          font-weight:750;
        }

        .offers-empty-state{
          max-width:760px;
          margin:30px auto;
          padding:42px 24px;
          border-radius:28px;
          background:linear-gradient(180deg,#fff,#f8fafc);
          border:1px dashed #cbd5e1;
          color:#64748b;
          text-align:center;
          font-size:15px;
          box-shadow:0 18px 45px rgba(15,23,42,.05);
        }

        @media(max-width:1100px){
          .offers-grid.multi{
            grid-template-columns:repeat(2,minmax(280px,1fr));
          }

          .offers-highlights{
            grid-template-columns:1fr;
            max-width:780px;
          }
        }

        @media(max-width:768px){
          .offers-section{
            padding-top:18px;
          }

          .offers-hero{
            padding:0 14px;
            margin-bottom:24px;
          }

          .offers-title{
            font-size:clamp(32px,10vw,42px);
            line-height:1.05;
          }

          .offers-subtitle{
            font-size:14px;
            line-height:1.75;
          }

          .offers-ad-wrap{
            padding:0 12px;
            margin-bottom:20px;
          }

          .offers-grid,
          .offers-grid.single,
          .offers-grid.two,
          .offers-grid.multi{
            grid-template-columns:1fr;
            gap:18px;
            padding:0 12px;
            max-width:100%;
          }

          .offers-proof{
            margin-top:30px;
            padding:0 12px;
          }

          .offers-proof-card{
            border-radius:26px;
            padding:24px 15px;
          }

          .offers-stats-grid{
            grid-template-columns:1fr;
            gap:12px;
            margin-top:22px;
          }

          .offers-stat-card{
            border-radius:20px;
            padding:18px 16px;
          }

          .offers-highlights{
            grid-template-columns:1fr;
            gap:12px;
            margin-top:22px;
          }
        }
      `}</style>

      <div className="offers-hero">
        <div className="offers-brand-top">
          <img src={PUBLIKO_LOGO} alt="Publiko" />
          <strong>Publiko.biz</strong>
        </div>

        <div className="offers-badge">
          <FiZap size={15} />
          Paketa & Oferta
        </div>

        <h2 className="offers-title">
          Zgjidh ofertën që <span>të përshtatet</span> më së miri
        </h2>

        <p className="offers-subtitle">
          Paketa fleksibile, prezencë më profesionale dhe mundësi kontakti direkt
          për promovim, regjistrim apo konsultim.
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
              <span>Publiko Business Platform</span>
            </div>

            <h3 className="offers-proof-title">Pse të zgjidhni Publiko?</h3>

            <p className="offers-proof-text">
              Prezencë më e fortë, më shumë besueshmëri dhe më shumë mundësi që
              oferta juaj të arrijë te klientët e duhur.
            </p>

            <div className="offers-stats-grid">
              {stats.map((stat, index) => {
                const Icon = getStatIcon(stat, index);

                return (
                  <div className="offers-stat-card" key={stat.id || index}>
                    <div className="offers-stat-icon">
                      <Icon size={27} />
                    </div>

                    <div className="offers-stat-value">{stat.value}</div>
                    <div className="offers-stat-label">{stat.label}</div>
                  </div>
                );
              })}
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

  const icons = [FiUsers, FiHome, FiTrendingUp, FiBriefcase, FiBarChart2, FiShield, FiStar];
  return icons[index % icons.length];
}