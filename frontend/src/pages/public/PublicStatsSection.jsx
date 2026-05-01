import React, { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiHome,
  FiTrendingUp,
  FiBriefcase,
  FiBarChart2,
  FiCheckCircle,
  FiZap
} from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PUBLIKO_LOGO =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776285534/ChatGPT_Image_Apr_15_2026_10_38_27_PM_bf2mf9.png";

const points = [
  "Shtrirje e gjerë – shpallja juaj promovohet te një audiencë më e madhe.",
  "Publikim profesional dhe prezencë më serioze për biznesin tuaj.",
  "Kontakt më i lehtë me klientët përmes telefonit, WhatsApp apo formularëve."
];

export default function PublicStatsSection() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadStats() {
      try {
        const res = await fetch(`${API_BASE}/api/stats`);
        const data = await res.json();

        if (!ignore) {
          setStats(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Gabim gjatë marrjes së statistikave:", err);
        if (!ignore) setStats([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadStats();

    return () => {
      ignore = true;
    };
  }, []);

  const activeStats = useMemo(() => {
    return stats
      .filter((item) => (item?.status || "").toLowerCase() === "aktive")
      .sort(
        (a, b) =>
          Number(a?.sort_order ?? a?.sortOrder ?? 0) -
          Number(b?.sort_order ?? b?.sortOrder ?? 0)
      )
      .slice(0, 3);
  }, [stats]);

  if (loading) return null;
  if (activeStats.length === 0) return null;

  return (
    <section className="public-stats-section">
      <style>{`
        .public-stats-section {
          width: 100%;
          padding: clamp(34px, 5vw, 70px) 16px 0;
          position: relative;
          isolation: isolate;
        }

        .public-stats-box {
          max-width: 1440px;
          width: 100%;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          border-radius: 38px;
          padding: clamp(28px, 5vw, 62px) clamp(16px, 4vw, 42px) clamp(24px, 4vw, 42px);
          border: 1px solid rgba(203, 213, 225, 0.95);
          background:
            radial-gradient(circle at 12% 90%, rgba(37,99,235,.13), transparent 30%),
            radial-gradient(circle at 88% 10%, rgba(20,184,166,.15), transparent 32%),
            linear-gradient(135deg, rgba(255,255,255,.98), rgba(241,250,255,.96) 48%, rgba(240,253,250,.96));
          box-shadow: 0 28px 90px rgba(15,23,42,.085);
        }

        .public-stats-box::before {
          content: "";
          position: absolute;
          inset: 14px;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,.78);
          pointer-events: none;
        }

        .public-stats-header {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .public-stats-badge {
          width: fit-content;
          margin: 0 auto 16px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(219,234,254,.95);
          background: rgba(255,255,255,.86);
          color: #0f172a;
          font-weight: 900;
          font-size: 13px;
          box-shadow: 0 14px 34px rgba(15,23,42,.07);
          backdrop-filter: blur(10px);
        }

        .public-stats-badge img {
          width: 28px;
          height: 28px;
          object-fit: contain;
          border-radius: 999px;
          background: #fff;
          padding: 3px;
          box-shadow: 0 8px 18px rgba(15,23,42,.10);
        }

        .public-stats-title {
          margin: 0;
          font-size: clamp(32px, 5vw, 60px);
          line-height: 1.02;
          color: #0f172a;
          font-weight: 950;
          letter-spacing: -.055em;
        }

        .public-stats-title span {
          background: linear-gradient(135deg, #2563eb, #0f766e);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .public-stats-subtitle {
          margin: 16px auto 0;
          max-width: 820px;
          color: #64748b;
          font-size: clamp(14px, 1.5vw, 18px);
          line-height: 1.85;
          font-weight: 600;
        }

        .public-stats-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: clamp(28px, 4vw, 42px);
        }

        .public-stat-card {
          position: relative;
          overflow: hidden;
          background: rgba(255,255,255,.92);
          border: 1px solid rgba(203,213,225,.9);
          border-radius: 28px;
          padding: 26px 24px;
          box-shadow: 0 18px 44px rgba(15,23,42,.065);
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }

        .public-stat-card::after {
          content: "";
          position: absolute;
          top: -60px;
          right: -60px;
          width: 150px;
          height: 150px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(59,130,246,.13), transparent 72%);
          pointer-events: none;
        }

        .public-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 26px 60px rgba(15,23,42,.095);
          border-color: rgba(147,197,253,.95);
        }

        .public-stat-icon {
          width: 66px;
          height: 66px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          background: linear-gradient(135deg, #ecfeff, #dbeafe);
          color: #0891b2;
          border: 1px solid #c7f0f5;
          box-shadow: 0 14px 28px rgba(8,145,178,.12);
          position: relative;
          z-index: 1;
        }

        .public-stat-value {
          color: #0f172a;
          font-size: clamp(32px, 4vw, 42px);
          font-weight: 950;
          line-height: 1;
          letter-spacing: -.05em;
          position: relative;
          z-index: 1;
        }

        .public-stat-label {
          margin-top: 11px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.65;
          font-weight: 800;
          position: relative;
          z-index: 1;
        }

        .public-points-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 26px;
        }

        .public-point {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255,255,255,.82);
          border: 1px solid rgba(219,231,238,.95);
          border-radius: 22px;
          padding: 18px;
          color: #475569;
          font-weight: 750;
          line-height: 1.7;
          box-shadow: 0 14px 30px rgba(15,23,42,.045);
        }

        .public-point-icon {
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

        .public-stats-mini {
          position: relative;
          z-index: 2;
          margin: 26px auto 0;
          width: fit-content;
          max-width: 100%;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 999px;
          background: rgba(15,23,42,.92);
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 18px 40px rgba(15,23,42,.16);
        }

        .public-stats-mini svg {
          color: #67e8f9;
        }

        .public-stats-mini-wrap {
          text-align: center;
        }

        @media (max-width: 1020px) {
          .public-stats-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }

          .public-stat-card {
            padding: 22px 18px;
          }

          .public-points-grid {
            grid-template-columns: 1fr;
            max-width: 780px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 768px) {
          .public-stats-section {
            padding: 30px 12px 0;
          }

          .public-stats-box {
            border-radius: 28px;
            padding: 28px 14px 22px;
          }

          .public-stats-box::before {
            inset: 9px;
            border-radius: 22px;
          }

          .public-stats-badge {
            padding: 8px 13px;
            font-size: 12px;
            margin-bottom: 14px;
          }

          .public-stats-badge img {
            width: 25px;
            height: 25px;
          }

          .public-stats-title {
            font-size: clamp(30px, 9vw, 40px);
            line-height: 1.06;
            letter-spacing: -.045em;
          }

          .public-stats-subtitle {
            font-size: 14px;
            line-height: 1.75;
            margin-top: 12px;
          }

          .public-stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-top: 24px;
          }

          .public-stat-card {
            border-radius: 22px;
            padding: 18px 16px;
            display: grid;
            grid-template-columns: 58px 1fr;
            column-gap: 14px;
            align-items: center;
          }

          .public-stat-icon {
            width: 54px;
            height: 54px;
            border-radius: 18px;
            margin-bottom: 0;
            grid-row: span 2;
          }

          .public-stat-value {
            font-size: 31px;
          }

          .public-stat-label {
            margin-top: 6px;
            font-size: 13.5px;
            line-height: 1.5;
          }

          .public-points-grid {
            gap: 11px;
            margin-top: 20px;
          }

          .public-point {
            border-radius: 18px;
            padding: 14px;
            font-size: 14px;
            line-height: 1.65;
          }

          .public-point-icon {
            width: 26px;
            height: 26px;
            min-width: 26px;
          }

          .public-stats-mini {
            width: 100%;
            justify-content: center;
            border-radius: 18px;
            padding: 12px 14px;
            line-height: 1.45;
          }
        }

        @media (max-width: 420px) {
          .public-stats-box {
            padding-left: 12px;
            padding-right: 12px;
          }

          .public-stat-card {
            grid-template-columns: 52px 1fr;
            padding: 16px 14px;
          }

          .public-stat-icon {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>

      <div className="public-stats-box">
        <div className="public-stats-header">
          <div className="public-stats-badge">
            <img src={PUBLIKO_LOGO} alt="Publiko" />
            <span>Publiko Platformë</span>
          </div>

          <h2 className="public-stats-title">
            Pse të zgjidhni <span>Publiko?</span>
          </h2>

          <p className="public-stats-subtitle">
            Prezencë më e fortë, më shumë besueshmëri dhe më shumë mundësi që
            oferta juaj të arrijë te klientët e duhur.
          </p>
        </div>

        <div className="public-stats-grid">
          {activeStats.map((item, index) => {
            const Icon = getStatIcon(item, index);

            return (
              <div key={item.id || index} className="public-stat-card">
                <div className="public-stat-icon">
                  <Icon size={28} />
                </div>

                <div className="public-stat-value">{item?.value || "0"}</div>
                <div className="public-stat-label">{item?.label || "-"}</div>
              </div>
            );
          })}
        </div>

        <div className="public-points-grid">
          {points.map((point, index) => (
            <div className="public-point" key={index}>
              <span className="public-point-icon">
                <FiCheckCircle size={17} />
              </span>
              <span>{point}</span>
            </div>
          ))}
        </div>

        <div className="public-stats-mini-wrap">
          <div className="public-stats-mini">
            <FiZap size={16} />
            Platformë moderne për shpallje, oferta, lajme dhe promovim biznesi.
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