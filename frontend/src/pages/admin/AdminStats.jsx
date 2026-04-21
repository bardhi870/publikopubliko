import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
      inactiveStats: safeStats.filter((item) => item?.status !== "Aktive").length
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
  };

  const handleDelete = async (id) => {
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

            <Link to="/admin/stats" style={activeBtnStyle}>
              Statistikat
            </Link>

            <Link to="/admin/clients" style={btnStyle}>
              Klientët
            </Link>

            <Link to="/admin/public-clients" style={btnStyle}>
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
          <StatCard
            label="Totali i statistikave"
            value={statsSummary.totalStats}
          />
          <StatCard
            label="Statistika aktive"
            value={statsSummary.activeStats}
          />
          <StatCard
            label="Jo aktive"
            value={statsSummary.inactiveStats}
          />
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
              {editingId ? "Përditëso statistikën" : "Shto statistikë të re"}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
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

              <div>
                <label style={labelStyle}>Teksti</label>
                <textarea
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  placeholder="p.sh. Të punësuar me sukses përmes Publiko"
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
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

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "6px"
                }}
              >
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
              Lista e statistikave
            </h3>

            {loading ? (
              <div
                style={{
                  padding: "20px 0",
                  color: "#64748b"
                }}
              >
                Duke i ngarkuar statistikat...
              </div>
            ) : sortedStats.length === 0 ? (
              <div
                style={{
                  padding: "30px 16px",
                  textAlign: "center",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "14px",
                  color: "#64748b"
                }}
              >
                Nuk ka statistika të regjistruara.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {sortedStats.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "18px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginBottom: "10px"
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#0f172a"
                          }}
                        >
                          {item?.value || "-"}
                        </h4>

                        <p
                          style={{
                            margin: "6px 0 0",
                            color: "#64748b",
                            fontSize: "14px"
                          }}
                        >
                          Renditja: {item?.sort_order ?? item?.sortOrder ?? 0}
                        </p>
                      </div>

                      <div
                        style={{
                          background:
                            item?.status === "Aktive" ? "#eff6ff" : "#f1f5f9",
                          color:
                            item?.status === "Aktive" ? "#1d4ed8" : "#475569",
                          padding: "8px 12px",
                          borderRadius: "999px",
                          fontWeight: "700",
                          fontSize: "14px",
                          height: "fit-content"
                        }}
                      >
                        {item?.status || "Jo aktive"}
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: "12px",
                        padding: "12px",
                        marginBottom: "14px"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#0f172a",
                          marginBottom: "6px"
                        }}
                      >
                        Teksti
                      </div>

                      <div
                        style={{
                          color: "#475569",
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap"
                        }}
                      >
                        {item?.label || "-"}
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