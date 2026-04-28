import React, { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiHome,
  FiTrendingUp,
  FiBriefcase,
  FiBarChart2
} from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PublicStatsSection() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await fetch(`${API_BASE}/api/stats`);
      const data = await res.json();

      const normalized = Array.isArray(data) ? data : [];
      setStats(normalized);
    } catch (err) {
      console.error("Gabim gjatë marrjes së statistikave:", err);
      setStats([]);
    } finally {
      setLoading(false);
    }
  }

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
    <section style={styles.outerSection}>
      <div style={styles.section}>
        <div style={styles.glowLeft} />
        <div style={styles.glowRight} />

        <div style={styles.badge}>Publiko</div>

        <h2 style={styles.title}>Pse të zgjidhni Publiko?</h2>

        <p style={styles.subtitle}>
          Prezencë më e fortë, më shumë besueshmëri dhe më shumë mundësi që
          oferta juaj të arrijë te klientët e duhur.
        </p>

        <div style={styles.grid}>
          {activeStats.map((item, index) => {
            const Icon = getStatIcon(item, index);

            return (
              <div key={item.id || index} style={styles.card}>
                <div style={styles.iconWrap}>
                  <Icon size={28} />
                </div>

                <div style={styles.value}>{item?.value || "0"}</div>

                <div style={styles.label}>{item?.label || "-"}</div>
              </div>
            );
          })}
        </div>

        <div style={styles.pointsWrap}>
          <div style={styles.point}>
            Shtrirje e gjerë – shpallja juaj promovohet te një audiencë e madhe.
          </div>
          <div style={styles.point}>
            Publikim profesional dhe prezencë më serioze për biznesin tuaj.
          </div>
          <div style={styles.point}>
            Menaxhim më i lehtë i kontaktit dhe regjistrimeve për klientët tuaj.
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
    text.includes("persona")
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

const styles = {
  outerSection: {
    width: "100%",
    padding: "50px 20px 0"
  },

  section: {
    position: "relative",
    overflow: "hidden",
    margin: "0 auto",
    padding: "56px 36px 38px",
    borderRadius: "34px",
    border: "1px solid #dbe7ee",
    background: "linear-gradient(180deg, #f9fcff 0%, #f3fbf8 100%)",
    boxShadow: "0 18px 50px rgba(15,23,42,0.07)",
    maxWidth: "1440px",
    width: "100%"
  },

  glowLeft: {
    position: "absolute",
    left: "-120px",
    bottom: "-80px",
    width: "280px",
    height: "280px",
    borderRadius: "999px",
    background:
      "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)",
    pointerEvents: "none"
  },

  glowRight: {
    position: "absolute",
    right: "-100px",
    top: "-70px",
    width: "260px",
    height: "260px",
    borderRadius: "999px",
    background:
      "radial-gradient(circle, rgba(20,184,166,0.12), transparent 70%)",
    pointerEvents: "none"
  },

  badge: {
    width: "fit-content",
    margin: "0 auto 16px",
    padding: "10px 16px",
    borderRadius: "999px",
    border: "1px solid #dbe7ee",
    background: "#ffffffcc",
    color: "#0f172a",
    fontWeight: "800",
    fontSize: "13px",
    position: "relative",
    zIndex: 2
  },

  title: {
    margin: 0,
    textAlign: "center",
    fontSize: "clamp(32px, 4vw, 60px)",
    lineHeight: 1.05,
    color: "#0f172a",
    fontWeight: "900",
    letterSpacing: "-0.04em"
  },

  subtitle: {
    margin: "18px auto 0",
    textAlign: "center",
    maxWidth: "860px",
    color: "#64748b",
    fontSize: "19px",
    lineHeight: 1.8
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
    marginTop: "40px"
  },

  card: {
    background: "rgba(255,255,255,0.96)",
    border: "1px solid #dbe3ee",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 32px rgba(15,23,42,0.06)"
  },

  iconWrap: {
    width: "66px",
    height: "66px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    background: "linear-gradient(135deg, #ecfeff 0%, #e0f2fe 100%)",
    color: "#2bbec4",
    border: "1px solid #c7f0f5"
  },

  value: {
    fontSize: "34px",
    fontWeight: "900",
    color: "#0f172a",
    lineHeight: 1.05,
    letterSpacing: "-0.03em"
  },

  label: {
    marginTop: "10px",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "700",
    lineHeight: 1.6
  },

  pointsWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "30px"
  },

  point: {
    background: "#ffffff",
    border: "1px solid #dbe7ee",
    borderRadius: "18px",
    padding: "18px 18px",
    color: "#475569",
    fontWeight: "700",
    lineHeight: 1.7,
    boxShadow: "0 10px 24px rgba(15,23,42,0.04)"
  }
};