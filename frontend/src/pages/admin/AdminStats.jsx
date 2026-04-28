import React, { useEffect, useMemo, useState } from "react";
import AdminTopNav from "../../components/admin/AdminTopNav";
import {
  FiUsers,
  FiHome,
  FiTrendingUp,
  FiBriefcase,
  FiBarChart2
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api/stats";

const initialForm = {
  value: "",
  label: "",
  status: "Aktive",
  sortOrder: ""
};

export default function AdminStats() {
  const [stats, setStats] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Stats fetch error:", error);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const sortedStats = useMemo(() => {
    return (Array.isArray(stats) ? stats : [])
      .filter(Boolean)
      .sort(
        (a, b) =>
          Number(a?.sort_order ?? a?.sortOrder ?? 0) -
          Number(b?.sort_order ?? b?.sortOrder ?? 0)
      );
  }, [stats]);

  const statsSummary = useMemo(() => {
    const safeStats = sortedStats;

    return {
      totalStats: safeStats.length,
      activeStats: safeStats.filter((item) => item?.status === "Aktive").length,
      inactiveStats: safeStats.filter((item) => item?.status !== "Aktive").length,
      firstOrder:
        safeStats.length > 0
          ? Number(safeStats[0]?.sort_order ?? safeStats[0]?.sortOrder ?? 0)
          : 0
    };
  }, [sortedStats]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.value.trim() || !formData.label.trim()) return;

    const payload = {
      value: formData.value.trim(),
      label: formData.label.trim(),
      status: formData.status,
      sortOrder: formData.sortOrder === "" ? 0 : Number(formData.sortOrder)
    };

    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error("Gabim gjatë përditësimit të statistikës.");
        }
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error("Gabim gjatë ruajtjes së statistikës.");
        }
      }

      resetForm();
      fetchStats();
    } catch (error) {
      console.error("Submit stats error:", error);
      alert("Ndodhi një gabim. Kontrollo backend-in ose databazën.");
    }
  };

  const handleEdit = (item) => {
    if (!item) return;

    setEditingId(item.id);
    setFormData({
      value: item?.value || "",
      label: item?.label || "",
      status: item?.status || "Aktive",
      sortOrder: String(item?.sort_order ?? item?.sortOrder ?? "")
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "A je i sigurt që don me fshi këtë statistikë?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Gabim gjatë fshirjes së statistikës.");
      }

      if (editingId === id) {
        resetForm();
      }

      fetchStats();
    } catch (error) {
      console.error("Delete stats error:", error);
      alert("Ndodhi një gabim gjatë fshirjes.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.heroCard}>
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div style={styles.heroGrid} className="admin-stats-hero-grid">
            <div style={styles.heroLeft}>
              <div style={styles.heroBadge}>Stats Manager</div>

              <h1 style={styles.heroTitle}>Menaxhimi i statistikave</h1>

              <p style={styles.heroSubtitle}>
                Menaxho shifrat kryesore të faqes, renditjen dhe statusin e tyre
                në një panel modern, të pastër dhe profesional.
              </p>

              <div style={styles.heroNavWrap}>
                <AdminTopNav />
              </div>
            </div>

            <div style={styles.heroStatsGrid} className="admin-stats-hero-stats">
              <StatCard
                label="Totali i statistikave"
                value={statsSummary.totalStats}
                dark
                icon={<FiBarChart2 size={22} />}
              />
              <StatCard
                label="Statistika aktive"
                value={statsSummary.activeStats}
                dark
                icon={<FiTrendingUp size={22} />}
              />
              <StatCard
                label="Jo aktive"
                value={statsSummary.inactiveStats}
                dark
                icon={<FiBriefcase size={22} />}
              />
              <StatCard
                label="Renditja e parë"
                value={statsSummary.firstOrder}
                dark
                icon={<FiHome size={22} />}
              />
            </div>
          </div>
        </section>

        <section style={styles.contentGrid} className="admin-stats-content-grid">
          <div style={styles.formCard}>
            <div style={styles.sectionTopRow}>
              <div>
                <h3 style={styles.sectionMainTitle}>
                  {editingId ? "Përditëso statistikën" : "Shto statistikë të re"}
                </h3>

                <p style={styles.sectionMainSubtitle}>
                  Plotëso vlerën, tekstin, statusin dhe renditjen në një formë
                  të rregullt dhe të lehtë për menaxhim.
                </p>
              </div>

              <div style={styles.sectionMiniBadge}>
                {editingId ? "Edit mode" : "New stat"}
              </div>
            </div>

            <div style={styles.formInnerWrap}>
              <form onSubmit={handleSubmit} style={styles.formGrid}>
                <div>
                  <label style={labelStyle}>Numri / Vlera</label>
                  <input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="p.sh. 142,000"
                    style={inputStyle}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Teksti</label>
                  <textarea
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    placeholder="p.sh. Të punësuar me sukses përmes Publiko"
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Statusi</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="Aktive">Aktive</option>
                    <option value="Jo aktive">Jo aktive</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Renditja</label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleChange}
                    placeholder="p.sh. 1"
                    style={inputStyle}
                  />
                </div>

                <div style={styles.formActions}>
                  <button type="submit" style={primaryBtnStyle}>
                    {editingId ? "Ruaj ndryshimet" : "Shto statistikën"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    style={secondaryBtnStyle}
                  >
                    Pastro
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div style={styles.listCard}>
            <div style={styles.sectionTopRow}>
              <div>
                <h3 style={styles.sectionMainTitle}>Lista e statistikave</h3>

                <p style={styles.sectionMainSubtitle}>
                  Menaxho statistikat në kartela më të pastra, më premium dhe responsive.
                </p>
              </div>

              <div style={styles.sectionMiniBadge}>
                {loading ? "Duke ngarkuar..." : `${sortedStats.length} statistika`}
              </div>
            </div>

            {loading ? (
              <div style={styles.emptyState}>Duke i ngarkuar statistikat...</div>
            ) : sortedStats.length === 0 ? (
              <div style={styles.emptyState}>Nuk ka statistika të regjistruara.</div>
            ) : (
              <div style={styles.statsGrid} className="admin-stats-grid">
                {sortedStats.map((item, index) => {
                  const Icon = getStatIcon(item, index);

                  return (
                    <div key={item.id} style={styles.statItemCard}>
                      <div style={styles.statIconWrap}>
                        <Icon size={28} />
                      </div>

                      <div style={styles.statItemTop}>
                        <div>
                          <h4 style={styles.statValue}>{item?.value || "-"}</h4>
                          <p style={styles.statOrderText}>
                            Renditja: {item?.sort_order ?? item?.sortOrder ?? 0}
                          </p>
                        </div>

                        <div style={statusPill(item?.status || "Jo aktive")}>
                          {item?.status || "Jo aktive"}
                        </div>
                      </div>

                      <div style={styles.statLabelBox}>
                        <div style={styles.statLabelTitle}>Teksti</div>
                        <div style={styles.statLabelText}>
                          {item?.label || "-"}
                        </div>
                      </div>

                      <div style={styles.statActions}>
                        <button
                          onClick={() => handleEdit(item)}
                          style={secondaryBtnStyle}
                        >
                          Ndrysho
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          style={dangerBtnStyle}
                        >
                          Fshij
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <style>{`
              @media (max-width: 1180px) {
                .admin-stats-hero-grid {
                  grid-template-columns: 1fr !important;
                }

                .admin-stats-content-grid {
                  grid-template-columns: 1fr !important;
                }
              }

              @media (max-width: 760px) {
                .admin-stats-hero-stats {
                  grid-template-columns: 1fr !important;
                }

                .admin-stats-grid {
                  grid-template-columns: 1fr !important;
                }
              }

              @media (min-width: 761px) and (max-width: 1150px) {
                .admin-stats-grid {
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                }
              }

              @media (min-width: 1151px) {
                .admin-stats-grid {
                  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                }
              }
            `}</style>
          </div>
        </section>
      </div>
    </div>
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

function StatCard({ label, value, dark = false, icon }) {
  return (
    <div
      style={{
        background: dark
          ? "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.07))"
          : "#fff",
        borderRadius: "22px",
        padding: "18px 18px 16px",
        border: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid #e2e8f0",
        boxShadow: dark
          ? "inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 8px 30px rgba(0,0,0,0.06)",
        backdropFilter: dark ? "blur(10px)" : "none",
        minHeight: "92px",
        display: "flex",
        gap: "14px",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: dark ? "rgba(255,255,255,0.92)" : "#ecfeff",
          color: "#24b8bf",
          flexShrink: 0
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            color: dark ? "rgba(255,255,255,0.78)" : "#64748b",
            fontSize: "13px",
            marginBottom: "10px",
            fontWeight: "700"
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: "28px",
            fontWeight: "900",
            color: dark ? "#ffffff" : "#0f172a",
            lineHeight: 1
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function statusPill(status) {
  const isActive = status === "Aktive";

  return {
    background: isActive ? "#dcfce7" : "#e2e8f0",
    color: isActive ? "#166534" : "#334155",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "12px",
    height: "fit-content",
    whiteSpace: "nowrap"
  };
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f5f7fb 0%, #eef3ff 42%, #f8fafc 100%)",
    padding: "8px 12px 48px"
  },

  container: {
    maxWidth: "1620px",
    margin: "0 auto"
  },

  heroCard: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #13265e 0%, #2143aa 55%, #3b82f6 100%)",
    borderRadius: "30px",
    padding: "24px",
    marginBottom: "22px",
    boxShadow: "0 24px 60px rgba(37,99,235,0.24)"
  },

  heroGlowOne: {
    position: "absolute",
    top: "-80px",
    right: "-40px",
    width: "260px",
    height: "260px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(255,255,255,0.16), transparent 70%)",
    pointerEvents: "none"
  },

  heroGlowTwo: {
    position: "absolute",
    bottom: "-120px",
    left: "18%",
    width: "300px",
    height: "300px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(255,255,255,0.08), transparent 72%)",
    pointerEvents: "none"
  },

  heroGrid: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(360px, 0.95fr)",
    gap: "20px",
    alignItems: "stretch"
  },

  heroLeft: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    padding: "10px 15px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "16px",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)"
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(36px, 4.2vw, 62px)",
    lineHeight: 0.98,
    fontWeight: "900",
    letterSpacing: "-0.05em",
    fontFamily: 'Georgia, "Times New Roman", serif',
    maxWidth: "760px"
  },

  heroSubtitle: {
    margin: "16px 0 18px",
    color: "rgba(255,255,255,0.92)",
    fontSize: "15px",
    lineHeight: 1.8,
    maxWidth: "720px",
    fontWeight: "500"
  },

  heroNavWrap: {
    marginTop: "10px",
    paddingTop: "8px",
    maxWidth: "100%",
    overflowX: "auto",
    overflowY: "hidden"
  },

  heroStatsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    alignSelf: "start"
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(340px, 420px) 1fr",
    gap: "20px"
  },

  formCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 18px 44px rgba(15,23,42,0.06)",
    height: "fit-content"
  },

  listCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 18px 44px rgba(15,23,42,0.06)"
  },

  sectionTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px"
  },

  sectionMainTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: "-0.02em"
  },

  sectionMainSubtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.7,
    maxWidth: "760px"
  },

  sectionMiniBadge: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
    fontWeight: "800",
    fontSize: "13px"
  },

  formInnerWrap: {
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    border: "1px solid #e8eef8",
    borderRadius: "24px",
    padding: "16px"
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px"
  },

  formActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "6px",
    gridColumn: "1 / -1"
  },

  emptyState: {
    padding: "30px 16px",
    textAlign: "center",
    border: "1px dashed #cbd5e1",
    borderRadius: "14px",
    color: "#64748b"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px"
  },

  statItemCard: {
    border: "1px solid #dbe3ee",
    borderRadius: "24px",
    padding: "18px",
    background: "#ffffff",
    boxShadow: "0 10px 26px rgba(15,23,42,0.05)"
  },

  statIconWrap: {
    width: "64px",
    height: "64px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
    background: "linear-gradient(135deg, #ecfeff 0%, #e0f2fe 100%)",
    color: "#32b8c6",
    border: "1px solid #c7f0f5",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)"
  },

  statItemTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "14px",
    flexWrap: "wrap"
  },

  statValue: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "900",
    color: "#0f172a",
    lineHeight: 1.05,
    letterSpacing: "-0.03em"
  },

  statOrderText: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5
  },

  statLabelBox: {
    background: "#f8fafc",
    borderRadius: "16px",
    padding: "14px",
    marginBottom: "14px",
    border: "1px solid #e2e8f0"
  },

  statLabelTitle: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "6px"
  },

  statLabelText: {
    color: "#475569",
    lineHeight: 1.6,
    fontSize: "14px",
    whiteSpace: "pre-wrap"
  },

  statActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  }
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#0f172a"
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box"
};

const primaryBtnStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700"
};

const secondaryBtnStyle = {
  background: "#e2e8f0",
  color: "#0f172a",
  border: "none",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700"
};

const dangerBtnStyle = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700"
};