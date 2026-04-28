import React, { useMemo, useState } from "react";
import AdminTopNav from "../../components/admin/AdminTopNav";

const initialPayments = [
  {
    id: 1,
    clientName: "Ardit Krasniqi",
    amount: "100",
    paymentDate: "2026-04-18",
    paymentMethod: "Cash",
    note: "Pagesa e parë / avans"
  }
];

const initialForm = {
  clientName: "",
  amount: "",
  paymentDate: "",
  paymentMethod: "Cash",
  note: ""
};

export default function AdminPayments() {
  const [payments, setPayments] = useState(initialPayments);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const stats = useMemo(() => {
    const totalPayments = payments.length;
    const totalAmount = payments.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    const today = new Date().toISOString().split("T")[0];

    const todayPayments = payments.filter(
      (p) => p.paymentDate === today
    ).length;

    const methodsUsed = new Set(
      payments.map((p) => p.paymentMethod).filter(Boolean)
    ).size;

    return {
      totalPayments,
      totalAmount,
      todayPayments,
      methodsUsed
    };
  }, [payments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clientName || !formData.amount) return;

    if (editingId) {
      setPayments((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
      );
    } else {
      setPayments((prev) => [{ id: Date.now(), ...formData }, ...prev]);
    }

    resetForm();
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      clientName: p.clientName || "",
      amount: p.amount || "",
      paymentDate: p.paymentDate || "",
      paymentMethod: p.paymentMethod || "Cash",
      note: p.note || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "A je i sigurt që don me fshi këtë pagesë?"
    );
    if (!confirmed) return;

    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.heroCard}>
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div style={styles.heroGrid} className="admin-payments-hero-grid">
            <div style={styles.heroLeft}>
              <div style={styles.heroBadge}>Payments Manager</div>

              <h1 style={styles.heroTitle}>Menaxhimi i pagesave</h1>

              <p style={styles.heroSubtitle}>
                Menaxho pagesat e klientëve, historinë, metodat e pagesës dhe
                statistikat ditore nga një panel i vetëm premium.
              </p>

              <div style={styles.heroNavWrap}>
                <AdminTopNav />
              </div>
            </div>

            <div
              style={styles.heroStatsGrid}
              className="admin-payments-hero-stats"
            >
              <StatCard label="Totali i pagesave" value={stats.totalPayments} dark />
              <StatCard label="Shuma totale" value={`${stats.totalAmount} €`} dark />
              <StatCard label="Pagesa sot" value={stats.todayPayments} dark />
              <StatCard label="Metoda" value={stats.methodsUsed} dark />
            </div>
          </div>
        </section>

        <section style={styles.contentGrid} className="admin-payments-content-grid">
          <div style={styles.formCard}>
            <div style={styles.sectionTopRow}>
              <div>
                <h3 style={styles.sectionMainTitle}>
                  {editingId ? "Edito pagesën" : "Shto pagesë"}
                </h3>

                <p style={styles.sectionMainSubtitle}>
                  Regjistro pagesat e klientëve në një formë të rregullt, të
                  pastër dhe të lehtë për menaxhim.
                </p>
              </div>

              <div style={styles.sectionMiniBadge}>
                {editingId ? "Edit mode" : "New payment"}
              </div>
            </div>

            <div style={styles.formInnerWrap}>
              <form onSubmit={handleSubmit} style={styles.formGrid}>
                <div>
                  <label style={labelStyle}>Emri i klientit</label>
                  <input
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="p.sh. Ardit Krasniqi"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Shuma</label>
                  <input
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="p.sh. 100"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Data e pagesës</label>
                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Metoda e pagesës</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option>Cash</option>
                    <option>Bankë</option>
                    <option>Kartelë</option>
                  </select>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Shënim</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Shënim për pagesën..."
                    rows={4}
                    style={{
                      ...inputStyle,
                      minHeight: "120px",
                      resize: "vertical"
                    }}
                  />
                </div>

                <div style={styles.formActions}>
                  <button type="submit" style={primaryBtnStyle}>
                    {editingId ? "Ruaj ndryshimet" : "Shto pagesën"}
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
                <h3 style={styles.sectionMainTitle}>Lista e pagesave</h3>

                <p style={styles.sectionMainSubtitle}>
                  Shiko pagesat në kartela më të pastra, kompakte dhe profesionale.
                </p>
              </div>

              <div style={styles.sectionMiniBadge}>
                {payments.length} pagesa
              </div>
            </div>

            {payments.length === 0 ? (
              <div style={styles.emptyState}>Nuk ka pagesa të regjistruara.</div>
            ) : (
              <div style={styles.paymentsGrid} className="admin-payments-grid">
                {payments.map((p) => (
                  <div key={p.id} style={styles.paymentCard}>
                    <div style={styles.paymentCardTop}>
                      <div>
                        <h4 style={styles.paymentName}>{p.clientName}</h4>
                        <p style={styles.paymentDate}>
                          {p.paymentDate || "Pa datë"}
                        </p>
                      </div>

                      <div style={styles.amountBadge}>{p.amount} €</div>
                    </div>

                    <div style={styles.paymentInfoGrid}>
                      <InfoBox label="Metoda" value={p.paymentMethod || "-"} />
                      <InfoBox label="Shuma" value={`${p.amount || 0} €`} />
                    </div>

                    <div style={styles.noteBox}>
                      <div style={styles.noteTitle}>Shënim</div>
                      <div style={styles.noteText}>
                        {p.note || "Nuk ka shënim për këtë pagesë."}
                      </div>
                    </div>

                    <div style={styles.paymentActions}>
                      <button
                        onClick={() => handleEdit(p)}
                        style={secondaryBtnStyle}
                      >
                        Edito
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        style={dangerBtnStyle}
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
                .admin-payments-hero-grid {
                  grid-template-columns: 1fr !important;
                }

                .admin-payments-content-grid {
                  grid-template-columns: 1fr !important;
                }
              }

              @media (max-width: 760px) {
                .admin-payments-hero-stats {
                  grid-template-columns: 1fr !important;
                }

                .admin-payments-grid {
                  grid-template-columns: 1fr !important;
                }
              }

              @media (min-width: 761px) and (max-width: 1150px) {
                .admin-payments-grid {
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                }
              }

              @media (min-width: 1151px) {
                .admin-payments-grid {
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

  paymentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px"
  },

  paymentCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "16px",
    background: "#ffffff",
    boxShadow: "0 10px 26px rgba(15,23,42,0.05)"
  },

  paymentCardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "14px",
    flexWrap: "wrap"
  },

  paymentName: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1.3
  },

  paymentDate: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5
  },

  amountBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px 14px",
    borderRadius: "999px",
    fontWeight: "900",
    fontSize: "14px",
    whiteSpace: "nowrap"
  },

  paymentInfoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "12px"
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
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
    wordBreak: "break-word",
    lineHeight: 1.45
  },

  noteBox: {
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "12px",
    marginBottom: "14px",
    border: "1px solid #e2e8f0"
  },

  noteTitle: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "6px"
  },

  noteText: {
    color: "#475569",
    lineHeight: 1.6,
    fontSize: "14px",
    whiteSpace: "pre-wrap"
  },

  paymentActions: {
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