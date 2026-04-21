import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

            <Link to="/admin/public-clients" style={btnStyle}>
              Klientët tanë
            </Link>

            <Link to="/admin/payments" style={btnStyle}>
              Pagesat
            </Link>

            <Link to="/admin/ad-requests" style={activeBtnStyle}>
              Reklamo me ne
            </Link>
          </div>
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
            Kërkesat për reklamim
          </h3>

          {loading ? (
            <div style={emptyStyle}>Duke i ngarkuar kërkesat...</div>
          ) : requests.length === 0 ? (
            <div style={emptyStyle}>Nuk ka kërkesa të reja.</div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {requests.map((request) => (
                <div
                  key={request.id}
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
                      marginBottom: "12px"
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
                        {request.full_name}
                      </h4>

                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#64748b",
                          fontSize: "14px"
                        }}
                      >
                        {request.business_name || "Pa emër biznesi"}
                      </p>
                    </div>

                    <div style={statusBadge(request.status)}>
                      {request.status || "Në pritje"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "10px",
                      marginBottom: "14px"
                    }}
                  >
                    <InfoBox label="Telefoni" value={request.phone || "-"} />
                    <InfoBox label="Email" value={request.email || "-"} />
                    <InfoBox label="Shërbimi" value={request.ad_type || "-"} />
                    <InfoBox label="Buxheti" value={request.budget || "-"} />
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
                      Përshkrimi
                    </div>

                    <div
                      style={{
                        color: "#475569",
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap"
                      }}
                    >
                      {request.message || "Nuk ka përshkrim."}
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
                      style={dangerBtnStyle}
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
        </div>
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

const emptyStyle = {
  padding: "30px 16px",
  textAlign: "center",
  border: "1px dashed #cbd5e1",
  borderRadius: "14px",
  color: "#64748b"
};

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

function statusBadge(status) {
  const styles = {
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
    background: styles[status]?.background || "#eff6ff",
    color: styles[status]?.color || "#1d4ed8",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "14px",
    height: "fit-content"
  };
}