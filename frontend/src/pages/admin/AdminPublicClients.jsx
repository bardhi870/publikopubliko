import React, { useEffect, useMemo, useState } from "react";
import AdminTopNav from "../../components/admin/AdminTopNav";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialForm = {
  name: "",
  website: "",
  sortOrder: "",
  status: "Aktive",
  imageFile: null,
  imagePreview: ""
};

export default function AdminPublicClients() {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const res = await fetch(`${API}/api/public-clients`);
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gabim load clients:", err);
      setClients([]);
    }
  }

  const normalizedClients = useMemo(() => {
    return clients.map((client) => ({
      ...client,
      sortOrder:
        typeof client.sortOrder !== "undefined"
          ? Number(client.sortOrder || 0)
          : typeof client.sort_order !== "undefined"
          ? Number(client.sort_order || 0)
          : 0,
      status:
        typeof client.status !== "undefined"
          ? client.status
          : typeof client.is_active !== "undefined"
          ? client.is_active
            ? "Aktive"
            : "Jo aktive"
          : "Aktive"
    }));
  }, [clients]);

  const sortedClients = useMemo(() => {
    return [...normalizedClients].sort(
      (a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
    );
  }, [normalizedClients]);

  const stats = useMemo(() => {
    const totalClients = normalizedClients.length;
    const activeClients = normalizedClients.filter(
      (client) => client.status === "Aktive"
    ).length;
    const inactiveClients = normalizedClients.filter(
      (client) => client.status !== "Aktive"
    ).length;

    return {
      totalClients,
      activeClients,
      inactiveClients
    };
  }, [normalizedClients]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: file ? URL.createObjectURL(file) : prev.imagePreview
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  async function uploadImage(file) {
    const uploadData = new FormData();
    uploadData.append("image", file);

    const res = await fetch(`${API}/api/upload`, {
      method: "POST",
      body: uploadData
    });

    if (!res.ok) {
      throw new Error("Gabim gjatë upload-it të fotos.");
    }

    const data = await res.json();
    return data.imageUrl;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);

      let imageUrl = formData.imagePreview || "";

      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      const payload = {
        name: formData.name.trim(),
        image: imageUrl,
        website: formData.website.trim(),
        sort_order: Number(formData.sortOrder || 0),
        is_active: formData.status === "Aktive"
      };

      const url = editingId
        ? `${API}/api/public-clients/${editingId}`
        : `${API}/api/public-clients`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Gabim gjatë ruajtjes.");
      }

      await loadClients();
      resetForm();
    } catch (err) {
      console.error("Gabim ruajtje client:", err);
      alert("Ruajtja dështoi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setFormData({
      name: client.name || "",
      website: client.website || "",
      sortOrder:
        typeof client.sortOrder !== "undefined"
          ? String(client.sortOrder)
          : typeof client.sort_order !== "undefined"
          ? String(client.sort_order)
          : "",
      status:
        typeof client.status !== "undefined"
          ? client.status
          : client.is_active
          ? "Aktive"
          : "Jo aktive",
      imageFile: null,
      imagePreview: client.image || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "A je i sigurt që don me fshi këtë logo?"
    );
    if (!confirmed) return;

    try {
      await fetch(`${API}/api/public-clients/${id}`, {
        method: "DELETE"
      });

      await loadClients();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error("Gabim delete client:", err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.heroCard}>
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div style={styles.heroGrid} className="admin-public-clients-hero-grid">
            <div style={styles.heroLeft}>
              <div style={styles.heroBadge}>Trusted Brands</div>

              <h1 style={styles.heroTitle}>Klientët tanë publik</h1>

              <p style={styles.heroSubtitle}>
                Menaxho logot e partnerëve dhe klientëve publik, renditjen,
                statusin dhe prezantimin vizual në një seksion të vetëm premium.
              </p>

              <div style={styles.heroNavWrap}>
                <AdminTopNav />
              </div>
            </div>

            <div
              style={styles.heroStatsGrid}
              className="admin-public-clients-hero-stats"
            >
              <StatCard label="Totali i logove" value={stats.totalClients} dark />
              <StatCard label="Logo aktive" value={stats.activeClients} dark />
              <StatCard label="Jo aktive" value={stats.inactiveClients} dark />
              <StatCard
                label="Renditja e parë"
                value={sortedClients.length ? sortedClients[0]?.sortOrder || 0 : 0}
                dark
              />
            </div>
          </div>
        </section>

        <section style={styles.contentGrid} className="admin-public-clients-content-grid">
          <div style={styles.formCard}>
            <div style={styles.sectionTopRow}>
              <div>
                <h3 style={styles.sectionMainTitle}>
                  {editingId ? "Përditëso logon" : "Shto logo të re"}
                </h3>

                <p style={styles.sectionMainSubtitle}>
                  Shto ose edito partnerët publik me emër, link, renditje dhe
                  foto/logo.
                </p>
              </div>

              <div style={styles.sectionMiniBadge}>
                {editingId ? "Edit mode" : "New logo"}
              </div>
            </div>

            <div style={styles.formInnerWrap}>
              <form onSubmit={handleSubmit} style={styles.formGrid}>
                <div>
                  <label style={labelStyle}>Emri i kompanisë</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="p.sh. Publiko"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Link opsional</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="p.sh. https://example.com"
                    style={inputStyle}
                  />
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

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Logo / Foto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={inputStyle}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={styles.previewWrap}>
                    <div style={styles.previewTitle}>Preview</div>

                    {formData.imagePreview ? (
                      <div style={styles.previewBox}>
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          style={styles.previewImage}
                        />
                      </div>
                    ) : (
                      <div style={styles.previewEmpty}>
                        Nuk ka logo të zgjedhur.
                      </div>
                    )}
                  </div>
                </div>

                <div style={styles.formActions}>
                  <button
                    type="submit"
                    style={primaryBtnStyle}
                    disabled={submitting}
                  >
                    {submitting
                      ? "Duke ruajtur..."
                      : editingId
                      ? "Ruaj ndryshimet"
                      : "Shto logon"}
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
                <h3 style={styles.sectionMainTitle}>Lista e klientëve tanë</h3>

                <p style={styles.sectionMainSubtitle}>
                  Menaxho logot në kartela më të pastra, më premium dhe responsive.
                </p>
              </div>

              <div style={styles.sectionMiniBadge}>
                {sortedClients.length} logo
              </div>
            </div>

            {sortedClients.length === 0 ? (
              <div style={styles.emptyState}>Nuk ka logo të regjistruara.</div>
            ) : (
              <div style={styles.logoGrid} className="admin-public-logo-grid">
                {sortedClients.map((client) => (
                  <div key={client.id} style={styles.logoCard}>
                    <div style={styles.logoCardTop}>
                      <div style={styles.logoImageWrap}>
                        {client.image ? (
                          <img
                            src={client.image}
                            alt={client.name}
                            style={styles.logoImage}
                          />
                        ) : (
                          <span style={styles.logoEmptyText}>Pa logo</span>
                        )}
                      </div>

                      <div style={statusPill(client.status)}>{client.status}</div>
                    </div>

                    <h4 style={styles.logoName}>{client.name}</h4>

                    <div style={styles.logoMetaGrid}>
                      <InfoBox label="Link" value={client.website || "-"} />
                      <InfoBox label="Renditja" value={client.sortOrder || 0} />
                    </div>

                    <div style={styles.logoCardActions}>
                      <button
                        onClick={() => handleEdit(client)}
                        style={secondaryBtnStyle}
                      >
                        Ndrysho
                      </button>

                      <button
                        onClick={() => handleDelete(client.id)}
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
                .admin-public-clients-hero-grid {
                  grid-template-columns: 1fr !important;
                }

                .admin-public-clients-content-grid {
                  grid-template-columns: 1fr !important;
                }
              }

              @media (max-width: 760px) {
                .admin-public-clients-hero-stats {
                  grid-template-columns: 1fr !important;
                }

                .admin-public-logo-grid {
                  grid-template-columns: 1fr !important;
                }
              }

              @media (min-width: 761px) and (max-width: 1150px) {
                .admin-public-logo-grid {
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                }
              }

              @media (min-width: 1151px) {
                .admin-public-logo-grid {
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

  previewWrap: {
    border: "1px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "14px",
    background: "#f8fafc"
  },

  previewTitle: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "10px"
  },

  previewBox: {
    background: "#fff",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "170px",
    border: "1px solid #e2e8f0"
  },

  previewImage: {
    maxWidth: "100%",
    maxHeight: "120px",
    objectFit: "contain",
    display: "block"
  },

  previewEmpty: {
    background: "#fff",
    borderRadius: "14px",
    minHeight: "170px",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    textAlign: "center",
    padding: "12px"
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

  logoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px"
  },

  logoCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "16px",
    background: "#ffffff",
    boxShadow: "0 10px 26px rgba(15,23,42,0.05)"
  },

  logoCardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "14px"
  },

  logoImageWrap: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    minHeight: "96px",
    width: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: "12px",
    boxSizing: "border-box"
  },

  logoImage: {
    maxWidth: "100%",
    maxHeight: "72px",
    objectFit: "contain",
    display: "block"
  },

  logoEmptyText: {
    color: "#94a3b8",
    fontSize: "13px"
  },

  logoName: {
    margin: "0 0 12px",
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1.3
  },

  logoMetaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
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
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
    wordBreak: "break-word",
    lineHeight: 1.45
  },

  logoCardActions: {
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