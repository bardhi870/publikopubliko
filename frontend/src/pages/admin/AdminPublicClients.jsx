import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
  };

  const handleDelete = async (id) => {
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
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "28px 16px 50px"
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "18px",
            marginBottom: "24px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
          }}
        >
          <h2
            style={{
              marginBottom: "18px",
              fontSize: "24px",
              fontWeight: "700"
            }}
          >
            Admin Panel
          </h2>

          <div
 
 
  style={{
    display: "flex",
    gap: "14px",
    flexWrap: "wrap"
  }}
>
  <Link to="/admin" style={btnStyle}>
    Dashboard
  </Link>

  <Link to="/admin/offers" style={btnStyle}>
    Ofertat
  </Link>

  <Link to="/admin/stats" style={btnStyle}>
    Statistikat
  </Link>

  <Link to="/admin/clients" style={btnStyle}>
    Klientët
  </Link>

  <Link to="/admin/public-clients" style={activeBtnStyle}>
    Klientët tanë
  </Link>

  <Link to="/admin/payments" style={btnStyle}>
    Pagesat
  </Link>

  <Link to="/admin/ad-requests" style={btnStyle}>
    Reklamo me ne
  </Link>
</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px"
          }}
        >
          <StatCard label="Totali i logove" value={stats.totalClients} />
          <StatCard label="Logo aktive" value={stats.activeClients} />
          <StatCard label="Jo aktive" value={stats.inactiveClients} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 420px) 1fr",
            gap: "20px"
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
              height: "fit-content"
            }}
          >
            <h3
              style={{
                marginBottom: "18px",
                fontSize: "20px",
                fontWeight: "700"
              }}
            >
              {editingId ? "Përditëso logon" : "Shto logo të re"}
            </h3>

            <form
              onSubmit={handleSubmit}
              style={{ display: "grid", gap: "14px" }}
            >
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

              <div>
                <label style={labelStyle}>Logo / Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  border: "1px dashed #cbd5e1",
                  borderRadius: "14px",
                  padding: "14px",
                  background: "#f8fafc"
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#0f172a",
                    marginBottom: "10px"
                  }}
                >
                  Preview
                </div>

                {formData.imagePreview ? (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      padding: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "150px",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "110px",
                        objectFit: "contain",
                        display: "block"
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      minHeight: "150px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#64748b",
                      textAlign: "center",
                      padding: "12px"
                    }}
                  >
                    Nuk ka logo të zgjedhur.
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "6px"
                }}
              >
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

          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
            }}
          >
            <h3
              style={{
                marginBottom: "18px",
                fontSize: "20px",
                fontWeight: "700"
              }}
            >
              Lista e klientëve tanë
            </h3>

            {sortedClients.length === 0 ? (
              <div
                style={{
                  padding: "30px 16px",
                  textAlign: "center",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "14px",
                  color: "#64748b"
                }}
              >
                Nuk ka logo të regjistruara.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {sortedClients.map((client) => (
                  <div
                    key={client.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "18px"
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "120px 1fr",
                        gap: "16px",
                        alignItems: "center",
                        marginBottom: "14px"
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          height: "90px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          padding: "10px"
                        }}
                      >
                        {client.image ? (
                          <img
                            src={client.image}
                            alt={client.name}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "70px",
                              objectFit: "contain",
                              display: "block"
                            }}
                          />
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                            Pa logo
                          </span>
                        )}
                      </div>

                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "12px",
                            flexWrap: "wrap",
                            marginBottom: "8px"
                          }}
                        >
                          <h4
                            style={{
                              margin: 0,
                              fontSize: "18px",
                              fontWeight: "700",
                              color: "#0f172a"
                            }}
                          >
                            {client.name}
                          </h4>

                          <div
                            style={{
                              background:
                                client.status === "Aktive"
                                  ? "#eff6ff"
                                  : "#f1f5f9",
                              color:
                                client.status === "Aktive"
                                  ? "#1d4ed8"
                                  : "#475569",
                              padding: "8px 12px",
                              borderRadius: "999px",
                              fontWeight: "700",
                              fontSize: "14px",
                              height: "fit-content"
                            }}
                          >
                            {client.status}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "10px"
                          }}
                        >
                          <InfoBox label="Link" value={client.website || "-"} />
                          <InfoBox
                            label="Renditja"
                            value={client.sortOrder || 0}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap"
                      }}
                    >
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
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "18px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: "14px",
          marginBottom: "8px"
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#0f172a"
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: "12px",
        padding: "12px"
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: "700",
          color: "#64748b",
          marginBottom: "4px"
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "15px",
          fontWeight: "700",
          color: "#0f172a",
          wordBreak: "break-word"
        }}
      >
        {value}
      </div>
    </div>
  );
}

const btnStyle = {
  textDecoration: "none",
  background: "#0f172a",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "600"
};

const activeBtnStyle = {
  ...btnStyle,
  background: "#2563eb"
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