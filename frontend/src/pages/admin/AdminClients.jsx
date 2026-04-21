import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  businessName: "",
  source: "WhatsApp",
  serviceType: "",
  selectedOffer: "",
  totalPrice: "",
  paidAmount: "",
  status: "Aktiv",
  notes: ""
};

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const res = await fetch(`${API_BASE}/api/clients`);
      const data = await res.json();

      const normalized = Array.isArray(data)
        ? data.map((client) => ({
            id: client.id,
            fullName: client.full_name || "",
            phone: client.phone || "",
            email: client.email || "",
            businessName: client.business_name || "",
            source: client.source || "WhatsApp",
            serviceType: client.service_type || "",
            selectedOffer: client.selected_offer || "",
            totalPrice: client.total_price ?? "",
            paidAmount: client.paid_amount ?? "",
            status: client.status || "Aktiv",
            notes: client.notes || "",
            postsCount: client.posts_count || 0,
            posts: Array.isArray(client.posts) ? client.posts : []
          }))
        : [];

      setClients(normalized);
    } catch (err) {
      console.error(err);
      setClients([]);
    }
  }

  const filteredClients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return clients;

    return clients.filter((client) => {
      return (
        String(client.fullName || "").toLowerCase().includes(query) ||
        String(client.businessName || "").toLowerCase().includes(query) ||
        String(client.phone || "").toLowerCase().includes(query) ||
        String(client.email || "").toLowerCase().includes(query)
      );
    });
  }, [clients, searchTerm]);

  const stats = useMemo(() => {
    const totalClients = clients.length;

    const activeClients = clients.filter(
      (client) => client.status === "Aktiv"
    ).length;

    const totalRemaining = clients.reduce((sum, client) => {
      const total = Number(client.totalPrice) || 0;
      const paid = Number(client.paidAmount) || 0;
      return sum + Math.max(total - paid, 0);
    }, 0);

    return {
      totalClients,
      activeClients,
      totalRemaining
    };
  }, [clients]);

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

    if (!formData.fullName.trim() || !formData.phone.trim()) return;

    try {
      if (editingId) {
        await fetch(`${API_BASE}/api/clients/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${API_BASE}/api/clients`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
      }

      await loadClients();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ruajtjes së klientit.");
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setFormData({
      fullName: client.fullName || "",
      phone: client.phone || "",
      email: client.email || "",
      businessName: client.businessName || "",
      source: client.source || "WhatsApp",
      serviceType: client.serviceType || "",
      selectedOffer: client.selectedOffer || "",
      totalPrice: client.totalPrice || "",
      paidAmount: client.paidAmount || "",
      status: client.status || "Aktiv",
      notes: client.notes || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "A je i sigurt që don me fshi këtë klient?"
    );
    if (!confirmed) return;

    try {
      await fetch(`${API_BASE}/api/clients/${id}`, {
        method: "DELETE"
      });

      await loadClients();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë fshirjes së klientit.");
    }
  };

  const createPostForClient = (client) => {
    localStorage.setItem("selectedClientForPost", JSON.stringify(client));
    localStorage.removeItem("selectedPostForEdit");
    window.location.href = "/admin";
  };

  const editPostForClient = (client, post) => {
    localStorage.setItem("selectedClientForPost", JSON.stringify(client));
    localStorage.setItem(
      "selectedPostForEdit",
      JSON.stringify({
        id: post.id,
        title: post.title || "",
        description: post.description || "",
        category: post.category || "",
        price: post.price || "",
        image_url: post.image_url || "",
        property_type: post.property_type || "",
        listing_type: post.listing_type || "",
        price_type: post.price_type || "",
        city: post.city || "",
        area: post.area || "",
        rooms: post.rooms || "",
        bathrooms: post.bathrooms || "",
        phone: post.phone || "",
        whatsapp: post.whatsapp || "",
        offer_badge: post.offer_badge || "",
        offer_features: normalizeOfferFeatures(post.offer_features),
        client_id: post.client_id || client.id || null,
        is_active: post.is_active !== false,
        is_unlimited: post.is_unlimited || false,
        active_from: formatForDatetimeLocal(post.active_from),
        active_until: formatForDatetimeLocal(post.active_until),
        job_category: post.job_category || "",
        experience: post.experience || "",
        work_hours: post.work_hours || "",
        languages: post.languages || ""
      })
    );

    window.location.href = "/admin";
  };

  async function handleDeletePost(postId) {
    const confirmed = window.confirm(
      "A je i sigurt që don me fshi këtë postim?"
    );
    if (!confirmed) return;

    try {
      await fetch(`${API_BASE}/api/posts/${postId}`, {
        method: "DELETE"
      });

      await loadClients();
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë fshirjes së postimit.");
    }
  }

  async function handleTogglePost(postId) {
    try {
      const res = await fetch(`${API_BASE}/api/posts/${postId}/toggle`, {
        method: "PATCH"
      });

      if (!res.ok) {
        throw new Error("Gabim gjatë ndryshimit të statusit.");
      }

      await loadClients();
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ndryshimit të statusit të postimit.");
    }
  }

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

            <Link to="/admin/clients" style={activeBtnStyle}>
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
          <StatCard label="Totali i klientëve" value={stats.totalClients} />
          <StatCard label="Klientë aktivë" value={stats.activeClients} />
          <StatCard label="Shuma e mbetur" value={`${stats.totalRemaining} €`} />
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
              {editingId ? "Përditëso klientin" : "Shto klient të ri"}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Emri dhe mbiemri</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="p.sh. Bardh Dajaku"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Telefoni</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="p.sh. 044 123 456"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="p.sh. klienti@email.com"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Biznesi</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="p.sh. Beauty Studio"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Burimi i klientit</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Website Form">Website Form</option>
                  <option value="Telefon">Telefon</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Lloji i shërbimit</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjidh</option>
                  <option value="Konkurs Pune">Konkurs Pune</option>
                  <option value="Patundshmëri">Patundshmëri</option>
                  <option value="Automjete">Automjete</option>
                  <option value="Banner">Banner</option>
                  <option value="Postim i sponsorizuar">
                    Postim i sponsorizuar
                  </option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Oferta e zgjedhur</label>
                <input
                  type="text"
                  name="selectedOffer"
                  value={formData.selectedOffer}
                  onChange={handleChange}
                  placeholder="p.sh. Premium"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Çmimi total</label>
                <input
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  placeholder="p.sh. 300"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Ka paguar</label>
                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  placeholder="p.sh. 100"
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
                  <option value="Aktiv">Aktiv</option>
                  <option value="Në pritje">Në pritje</option>
                  <option value="Paguar">Paguar</option>
                  <option value="Pezulluar">Pezulluar</option>
                  <option value="Përfunduar">Përfunduar</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Shënime</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Shënime rreth klientit..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
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
                  {editingId ? "Ruaj ndryshimet" : "Shto klientin"}
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: "18px"
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "700"
                }}
              >
                Lista e klientëve
              </h3>

              <input
                type="text"
                placeholder="Kërko klientin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  ...inputStyle,
                  maxWidth: "320px"
                }}
              />
            </div>

            {filteredClients.length === 0 ? (
              <div
                style={{
                  padding: "30px 16px",
                  textAlign: "center",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "14px",
                  color: "#64748b"
                }}
              >
                Nuk u gjet asnjë klient.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {filteredClients.map((client) => {
                  const total = Number(client.totalPrice) || 0;
                  const paid = Number(client.paidAmount) || 0;
                  const remaining = Math.max(total - paid, 0);

                  return (
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
                            {client.fullName}
                          </h4>

                          <p
                            style={{
                              margin: "6px 0 0",
                              color: "#64748b",
                              fontSize: "14px"
                            }}
                          >
                            {client.businessName || "Pa biznes të shënuar"}
                          </p>
                        </div>

                        <div
                          style={{
                            background: "#eff6ff",
                            color: "#1d4ed8",
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
                          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                          gap: "10px",
                          marginBottom: "14px"
                        }}
                      >
                        <InfoBox label="Telefoni" value={client.phone || "-"} />
                        <InfoBox label="Email" value={client.email || "-"} />
                        <InfoBox label="Burimi" value={client.source || "-"} />
                        <InfoBox
                          label="Shërbimi"
                          value={client.serviceType || "-"}
                        />
                        <InfoBox
                          label="Oferta"
                          value={client.selectedOffer || "-"}
                        />
                        <InfoBox label="Postime" value={client.postsCount || 0} />
                        <InfoBox label="Totali" value={`${total} €`} />
                        <InfoBox label="Ka paguar" value={`${paid} €`} />
                        <InfoBox label="Ka mbetur" value={`${remaining} €`} />
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
                          Shënime
                        </div>
                        <div
                          style={{
                            color: "#475569",
                            lineHeight: 1.5,
                            whiteSpace: "pre-wrap"
                          }}
                        >
                          {client.notes || "Nuk ka shënime."}
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
                            marginBottom: "8px"
                          }}
                        >
                          Postimet e klientit
                        </div>

                        {client.posts && client.posts.length > 0 ? (
                          <div style={{ display: "grid", gap: "10px" }}>
                            {client.posts.map((post) => {
                              const postStatus = getPostStatusMeta(post);

                              return (
                                <div
                                  key={post.id}
                                  style={{
                                    padding: "12px",
                                    borderRadius: "10px",
                                    background: "#ffffff",
                                    border: "1px solid #e2e8f0"
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      gap: "10px",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      marginBottom: "8px"
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: "700",
                                        color: "#0f172a"
                                      }}
                                    >
                                      {post.title}
                                    </div>

                                    <div
                                      style={{
                                        background: postStatus.background,
                                        color: postStatus.color,
                                        padding: "6px 10px",
                                        borderRadius: "999px",
                                        fontWeight: "700",
                                        fontSize: "12px"
                                      }}
                                    >
                                      {postStatus.label}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: "#64748b",
                                      marginBottom: "8px"
                                    }}
                                  >
                                    {post.category || "-"}
                                  </div>

                                  {!post.is_unlimited && post.active_until ? (
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        color: "#64748b",
                                        marginBottom: "10px"
                                      }}
                                    >
                                      Aktiv deri: {formatDateTimeForDisplay(post.active_until)}
                                    </div>
                                  ) : null}

                                  {postStatus.label === "Skaduar" ? (
                                    <div
                                      style={{
                                        marginBottom: "10px",
                                        padding: "10px 12px",
                                        borderRadius: "10px",
                                        background: "#fff7ed",
                                        color: "#9a3412",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        lineHeight: 1.5
                                      }}
                                    >
                                      Ky postim ka skaduar dhe do të fshihet automatikisht
                                      pas 24 orësh nëse nuk rinovohet.
                                    </div>
                                  ) : null}

                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "8px",
                                      flexWrap: "wrap"
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => editPostForClient(client, post)}
                                      style={primaryBtnStyle}
                                    >
                                      Edito postimin
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleTogglePost(post.id)}
                                      style={secondaryBtnStyle}
                                    >
                                      {post.is_active === false
                                        ? "Aktivizo"
                                        : "Çaktivizo"}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeletePost(post.id)}
                                      style={dangerBtnStyle}
                                    >
                                      Fshij postimin
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div
                            style={{
                              color: "#64748b"
                            }}
                          >
                            Ky klient nuk ka ende postime.
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap"
                        }}
                      >
                        <button
                          onClick={() => createPostForClient(client)}
                          style={primaryBtnStyle}
                        >
                          Krijo postim
                        </button>

                        <button
                          onClick={() => handleEdit(client)}
                          style={secondaryBtnStyle}
                        >
                          Ndrysho klientin
                        </button>

                        <button
                          onClick={() => handleDelete(client.id)}
                          style={dangerBtnStyle}
                        >
                          Fshij klientin
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeOfferFeatures(value) {
  if (Array.isArray(value)) return value;

  try {
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function formatForDatetimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const pad = (num) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateTimeForDisplay(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("sq-AL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getPostStatusMeta(post) {
  if (post?.is_active === false) {
    return {
      label: "Joaktiv",
      background: "#fee2e2",
      color: "#991b1b"
    };
  }

  if (post?.is_unlimited) {
    return {
      label: "Pa afat",
      background: "#dcfce7",
      color: "#166534"
    };
  }

  if (post?.active_until) {
    const now = new Date();
    const expiresAt = new Date(post.active_until);

    if (!Number.isNaN(expiresAt.getTime()) && expiresAt < now) {
      return {
        label: "Skaduar",
        background: "#fef3c7",
        color: "#92400e"
      };
    }
  }

  return {
    label: "Aktiv",
    background: "#dbeafe",
    color: "#1d4ed8"
  };
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
  background: "#d01010",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700"
};