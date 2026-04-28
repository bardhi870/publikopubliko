import React, { useEffect, useMemo, useState } from "react";
import AdminTopNav from "../../components/admin/AdminTopNav";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminAdRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/ad-requests`);
      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const stats = useMemo(() => {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(
      (request) => (request.status || "Në pritje") === "Në pritje"
    ).length;
    const contactedRequests = requests.filter(
      (request) => request.status === "Kontaktuar"
    ).length;
    const acceptedRequests = requests.filter(
      (request) => request.status === "Pranuar"
    ).length;

    return {
      totalRequests,
      pendingRequests,
      contactedRequests,
      acceptedRequests
    };
  }, [requests]);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/api/ad-requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error("Gabim në përditësimin e statusit.");
      }

      fetchRequests();
    } catch (error) {
      console.error(error);
      alert("Statusi nuk u përditësua.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("A dëshiron ta fshish këtë kërkesë?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/api/ad-requests/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Gabim në fshirje.");
      }

      fetchRequests();
    } catch (error) {
      console.error(error);
      alert("Kërkesa nuk u fshi.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.heroCard}>
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div style={styles.heroGrid} className="admin-adrequests-hero-grid">
            <div style={styles.heroLeft}>
              <div style={styles.heroBadge}>Lead Requests</div>

              <h1 style={styles.heroTitle}>Kërkesat për reklamim</h1>

              <p style={styles.heroSubtitle}>
                Menaxho kërkesat hyrëse, kontakto klientët potencialë, përditëso
                statuset dhe filtro punën e ekipit nga një panel i vetëm premium.
              </p>

              <div style={styles.heroNavWrap}>
                <AdminTopNav />
              </div>
            </div>

            <div
              style={styles.heroStatsGrid}
              className="admin-adrequests-hero-stats"
            >
              <StatCard label="Kërkesat" value={stats.totalRequests} dark />
              <StatCard label="Në pritje" value={stats.pendingRequests} dark />
              <StatCard label="Kontaktuar" value={stats.contactedRequests} dark />
              <StatCard label="Pranuar" value={stats.acceptedRequests} dark />
            </div>
          </div>
        </section>

        <section style={styles.listCard}>
          <div style={styles.sectionTopRow}>
            <div>
              <h3 style={styles.sectionMainTitle}>Lista e kërkesave</h3>
              <p style={styles.sectionMainSubtitle}>
                Menaxho kërkesat e reklamimit në kartela më të pastra, më të
                lexueshme dhe më profesionale.
              </p>
            </div>

            <div style={styles.sectionMiniBadge}>
              {loading ? "Duke ngarkuar..." : `${requests.length} kërkesa`}
            </div>
          </div>

          {loading ? (
            <div style={styles.emptyState}>Duke i ngarkuar kërkesat...</div>
          ) : requests.length === 0 ? (
            <div style={styles.emptyState}>Nuk ka kërkesa të reja.</div>
          ) : (
            <div style={styles.requestsGrid}>
              {requests.map((request) => (
                <div key={request.id} style={styles.requestCard}>
                  <div style={styles.requestCardTop}>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={styles.requestName}>{request.full_name}</h4>
                      <p style={styles.requestBusiness}>
                        {request.business_name || "Pa emër biznesi"}
                      </p>
                    </div>

                    <div style={statusBadge(request.status || "Në pritje")}>
                      {request.status || "Në pritje"}
                    </div>
                  </div>

                  <div style={styles.infoGrid}>
                    <InfoBox label="Telefoni" value={request.phone || "-"} />
                    <InfoBox label="Email" value={request.email || "-"} />
                    <InfoBox label="Shërbimi" value={request.ad_type || "-"} />
                    <InfoBox label="Buxheti" value={request.budget || "-"} />
                  </div>

                  <div style={styles.messageBox}>
                    <div style={styles.messageTitle}>Përshkrimi</div>
                    <div style={styles.messageText}>
                      {request.message || "Nuk ka përshkrim."}
                    </div>
                  </div>

                  <div style={styles.actionsRow}>
                    <button
                      onClick={() => updateStatus(request.id, "Kontaktuar")}
                      style={secondaryBtnStyle}
                    >
                      Kontaktuar
                    </button>

                    <button
                      onClick={() => updateStatus(request.id, "Pranuar")}
                      style={primaryBtnStyle}
                    >
                      Prano
                    </button>

                    <button
                      onClick={() => updateStatus(request.id, "Refuzuar")}
                      style={warningBtnStyle}
                    >
                      Refuzo
                    </button>

                    <button
                      onClick={() => handleDelete(request.id)}
                      style={deleteBtnStyle}
                    >
                      Fshij
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <style>{`
            @media (max-width: 1180px) {
              .admin-adrequests-hero-grid {
                grid-template-columns: 1fr !important;
              }
            }

            @media (max-width: 760px) {
              .admin-adrequests-hero-stats {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, dark = false }) {
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
        minHeight: "92px"
      }}
    >
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
  );
}

function InfoBox({ label, value }) {
  return (
    <div style={styles.infoBox}>
      <div style={styles.infoBoxLabel}>{label}</div>
      <div style={styles.infoBoxValue}>{value}</div>
    </div>
  );
}

function statusBadge(status) {
  const badgeMap = {
    Aktiv: {
      background: "#dcfce7",
      color: "#166534"
    },
    "Në pritje": {
      background: "#fef3c7",
      color: "#92400e"
    },
    Kontaktuar: {
      background: "#dbeafe",
      color: "#1d4ed8"
    },
    Pranuar: {
      background: "#dcfce7",
      color: "#166534"
    },
    Refuzuar: {
      background: "#fee2e2",
      color: "#991b1b"
    }
  };

  return {
    background: badgeMap[status]?.background || "#eff6ff",
    color: badgeMap[status]?.color || "#1d4ed8",
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

  emptyState: {
    padding: "30px 16px",
    textAlign: "center",
    border: "1px dashed #cbd5e1",
    borderRadius: "14px",
    color: "#64748b"
  },

  requestsGrid: {
    display: "grid",
    gap: "16px"
  },

  requestCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "18px",
    background: "#ffffff",
    boxShadow: "0 10px 26px rgba(15,23,42,0.05)"
  },

  requestCardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "14px",
    alignItems: "flex-start"
  },

  requestName: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1.25
  },

  requestBusiness: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.5
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    marginBottom: "14px"
  },

  infoBox: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "12px",
    border: "1px solid #e2e8f0"
  },

  infoBoxLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    marginBottom: "4px"
  },

  infoBoxValue: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
    wordBreak: "break-word",
    lineHeight: 1.45
  },

  messageBox: {
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "12px",
    marginBottom: "14px",
    border: "1px solid #e2e8f0"
  },

  messageTitle: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "6px"
  },

  messageText: {
    color: "#475569",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    fontSize: "14px"
  },

  actionsRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  }
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

const warningBtnStyle = {
  background: "#facc15",
  color: "#0f172a",
  border: "none",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700"
};

const deleteBtnStyle = {
  background: "#d01010",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700"
};