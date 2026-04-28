import React, { useEffect, useMemo, useState } from "react";
import AdminTopNav from "../../components/admin/AdminTopNav";

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

    const totalPosts = clients.reduce(
      (sum, client) => sum + (Number(client.postsCount) || 0),
      0
    );

    return {
      totalClients,
      activeClients,
      totalRemaining,
      totalPosts
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
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.heroCard}>
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div style={styles.heroGrid} className="admin-clients-hero-grid">
            <div style={styles.heroLeft}>
              <div style={styles.heroBadge}>Clients Manager</div>

              <h1 style={styles.heroTitle}>Menaxhimi i klientëve</h1>

              <p style={styles.heroSubtitle}>
                Menaxho klientët, pagesat, statuset dhe krijimin e postimeve nga
                një panel i vetëm, të pastër, modern dhe profesional.
              </p>

              <div style={styles.heroNavWrap}>
                <AdminTopNav />
              </div>
            </div>

            <div style={styles.heroStatsGrid} className="admin-clients-hero-stats">
              <StatCard label="Totali i klientëve" value={stats.totalClients} dark />
              <StatCard label="Klientë aktivë" value={stats.activeClients} dark />
              <StatCard label="Shuma e mbetur" value={`${stats.totalRemaining} €`} dark />
              <StatCard label="Postime" value={stats.totalPosts} dark />
            </div>
          </div>
        </section>

        <section style={styles.formSectionCard}>
          <div style={styles.sectionTopRow}>
            <div>
              <h3 style={styles.sectionMainTitle}>
                {editingId ? "Përditëso klientin" : "Shto klient të ri"}
              </h3>

              <p style={styles.sectionMainSubtitle}>
                Plotëso të dhënat e klientit në një formë të rregullt, të
                strukturuar dhe të lehtë për menaxhim.
              </p>
            </div>

            <div style={styles.sectionMiniBadge}>
              {editingId ? "Edit mode" : "New client"}
            </div>
          </div>

          <div style={styles.formInnerWrap}>
            <form onSubmit={handleSubmit} style={styles.formGrid}>
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

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Shënime</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Shënime rreth klientit..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                />
              </div>

              <div style={styles.formActions}>
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
        </section>

        <section style={styles.listSectionCard}>
          <div style={styles.sectionTopRow}>
            <div>
              <h3 style={styles.sectionMainTitle}>Lista e klientëve</h3>

              <p style={styles.sectionMainSubtitle}>
                Kërko, edito dhe menaxho klientët në kartela më kompakte dhe më
                të pastra.
              </p>
            </div>

            <div style={styles.searchWrap}>
              <input
                type="text"
                placeholder="Kërko klientin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div style={styles.emptyState}>Nuk u gjet asnjë klient.</div>
          ) : (
            <div className="clients-grid-pro" style={styles.clientsGrid}>
              {filteredClients.map((client) => {
                const total = Number(client.totalPrice) || 0;
                const paid = Number(client.paidAmount) || 0;
                const remaining = Math.max(total - paid, 0);

                return (
                  <div key={client.id} style={styles.clientCard}>
                    <div style={styles.clientCardTop}>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={styles.clientName}>{client.fullName}</h4>
                        <p style={styles.clientBusiness}>
                          {client.businessName || "Pa biznes të shënuar"}
                        </p>
                      </div>

                      <div style={statusPill(client.status)}>{client.status}</div>
                    </div>

                    <div style={styles.clientQuickInfo}>
                      <div style={styles.clientQuickLine}>📞 {client.phone || "-"}</div>
                      <div style={styles.clientQuickLine}>✉️ {client.email || "-"}</div>
                    </div>

                    <div style={styles.clientMiniGrid}>
                      <MiniInfo label="Burimi" value={client.source || "-"} />
                      <MiniInfo label="Shërbimi" value={client.serviceType || "-"} />
                      <MiniInfo label="Oferta" value={client.selectedOffer || "-"} />
                      <MiniInfo label="Postime" value={client.postsCount || 0} />
                      <MiniInfo label="Totali" value={`${total} €`} />
                      <MiniInfo label="Mbetur" value={`${remaining} €`} />
                    </div>

                    {client.notes ? (
                      <div style={styles.notesBox}>
                        <div style={styles.notesTitle}>Shënime</div>
                        <div style={styles.notesText}>
                          {client.notes.length > 90
                            ? `${client.notes.slice(0, 90)}...`
                            : client.notes}
                        </div>
                      </div>
                    ) : null}

                    {client.posts && client.posts.length > 0 ? (
                      <div style={styles.postsPreviewBox}>
                        <div style={styles.postsPreviewTitle}>
                          Postime ({client.posts.length})
                        </div>

                        <div style={styles.postsPreviewList}>
                          {client.posts.slice(0, 2).map((post) => {
                            const postStatus = getPostStatusMeta(post);

                            return (
                              <div key={post.id} style={styles.postMiniCard}>
                                <div style={styles.postMiniTop}>
                                  <div style={styles.postMiniTitle}>
                                    {post.title || "Pa titull"}
                                  </div>
                                  <div
                                    style={{
                                      ...styles.postMiniStatus,
                                      background: postStatus.background,
                                      color: postStatus.color
                                    }}
                                  >
                                    {postStatus.label}
                                  </div>
                                </div>

                                <div style={styles.postMiniMeta}>
                                  {post.category || "-"}
                                </div>

                                {!post.is_unlimited && post.active_until ? (
                                  <div style={styles.postMiniDate}>
                                    Aktiv deri:{" "}
                                    {formatDateTimeForDisplay(post.active_until)}
                                  </div>
                                ) : null}

                                <div style={styles.postMiniActions}>
                                  <button
                                    type="button"
                                    onClick={() => editPostForClient(client, post)}
                                    style={styles.postMiniPrimaryBtn}
                                  >
                                    Edito postimin
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleTogglePost(post.id)}
                                    style={styles.postMiniSecondaryBtn}
                                  >
                                    {post.is_active === false ? "Aktivizo" : "Çaktivizo"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeletePost(post.id)}
                                    style={styles.postMiniDangerBtn}
                                  >
                                    Fshij
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          {client.posts.length > 2 ? (
                            <div style={styles.morePostsBadge}>
                              +{client.posts.length - 2} postime tjera
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    <div style={styles.clientCardActions}>
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
                        Edito klientin
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

          <style>{`
            @media (min-width: 1700px) {
              .clients-grid-pro {
                grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
              }
            }

            @media (max-width: 1699px) and (min-width: 1180px) {
              .clients-grid-pro {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              }
            }

            @media (max-width: 1179px) and (min-width: 760px) {
              .clients-grid-pro {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
            }

            @media (max-width: 759px) {
              .clients-grid-pro {
                grid-template-columns: 1fr !important;
              }
            }

            @media (max-width: 1180px) {
              .admin-clients-hero-grid {
                grid-template-columns: 1fr !important;
              }
            }

            @media (max-width: 760px) {
              .admin-clients-hero-stats {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </section>
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

function StatCard({ label, value, dark = false }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.07))",
        borderRadius: "22px",
        padding: "18px 18px 16px",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        minHeight: "92px"
      }}
    >
      <div
        style={{
          color: "rgba(255,255,255,0.78)",
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

function MiniInfo({ label, value }) {
  return (
    <div style={styles.miniInfoBox}>
      <div style={styles.miniInfoLabel}>{label}</div>
      <div style={styles.miniInfoValue}>{value}</div>
    </div>
  );
}

function statusPill(status) {
  const map = {
    Aktiv: {
      background: "#dcfce7",
      color: "#166534"
    },
    "Në pritje": {
      background: "#fef3c7",
      color: "#92400e"
    },
    Paguar: {
      background: "#dbeafe",
      color: "#1d4ed8"
    },
    Pezulluar: {
      background: "#fee2e2",
      color: "#991b1b"
    },
    Përfunduar: {
      background: "#e2e8f0",
      color: "#334155"
    }
  };

  return {
    background: map[status]?.background || "#eff6ff",
    color: map[status]?.color || "#1d4ed8",
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

  formSectionCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 18px 44px rgba(15,23,42,0.06)",
    marginBottom: "22px"
  },

  listSectionCard: {
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

  searchWrap: {
    minWidth: "280px",
    maxWidth: "340px",
    width: "100%"
  },

  searchInput: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box"
  },

  emptyState: {
    padding: "30px 16px",
    textAlign: "center",
    border: "1px dashed #cbd5e1",
    borderRadius: "14px",
    color: "#64748b"
  },

  clientsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px"
  },

  clientCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "16px",
    background: "#ffffff",
    boxShadow: "0 10px 26px rgba(15,23,42,0.05)"
  },

  clientCardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "10px",
    flexWrap: "wrap"
  },

  clientName: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1.3
  },

  clientBusiness: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5
  },

  clientQuickInfo: {
    display: "grid",
    gap: "6px",
    marginBottom: "12px"
  },

  clientQuickLine: {
    fontSize: "13px",
    color: "#334155",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "9px 10px"
  },

  clientMiniGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "8px",
    marginBottom: "12px"
  },

  miniInfoBox: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "10px",
    border: "1px solid #e2e8f0"
  },

  miniInfoLabel: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#64748b",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  },

  miniInfoValue: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#0f172a",
    wordBreak: "break-word",
    lineHeight: 1.35
  },

  notesBox: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "12px"
  },

  notesTitle: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  },

  notesText: {
    color: "#475569",
    lineHeight: 1.5,
    fontSize: "13px"
  },

  postsPreviewBox: {
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "12px"
  },

  postsPreviewTitle: {
    fontSize: "12px",
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },

  postsPreviewList: {
    display: "grid",
    gap: "8px"
  },

  postMiniCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "10px",
    border: "1px solid #e2e8f0"
  },

  postMiniTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "6px"
  },

  postMiniTitle: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1.35
  },

  postMiniStatus: {
    padding: "5px 8px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "11px",
    whiteSpace: "nowrap"
  },

  postMiniMeta: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "6px"
  },

  postMiniDate: {
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "8px"
  },

  postMiniActions: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap"
  },

  postMiniPrimaryBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px"
  },

  postMiniSecondaryBtn: {
    background: "#e2e8f0",
    color: "#0f172a",
    border: "none",
    padding: "8px 10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px"
  },

  postMiniDangerBtn: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    padding: "8px 10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px"
  },

  morePostsBadge: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#2563eb",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "999px",
    padding: "7px 10px",
    width: "fit-content"
  },

  clientCardActions: {
    display: "flex",
    gap: "8px",
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
  background: "#d01010",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700"
};