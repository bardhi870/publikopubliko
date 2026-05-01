import React, { useEffect, useMemo, useState } from "react";
import AdminTopNav from "../../components/admin/AdminTopNav";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyFeature = {
  text: "",
  included: true,
  note: ""
};

const initialForm = {
  title: "",
  description: "",
  price: "",
  offerBadge: "",
  highlighted: false,
  isActive: true,
  activeUntil: "",
  phone: "",
  whatsapp: "",
  messenger: "",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
  buttonColor: "#2563eb",
  offerFeatures: [{ ...emptyFeature }]
};

function getAdminToken() {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
}

function getAuthHeaders() {
  const token = getAdminToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function parseOfferFeatures(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        throw new Error("NO_TOKEN");
      }

      const res = await fetch(`${API}/api/packages`, {
        headers: getAuthHeaders()
      });

      const data = await safeJson(res);

      if (res.status === 401 || res.status === 403) {
        throw new Error("AUTH_ERROR");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Gabim gjatë marrjes së ofertave.");
      }

      setOffers(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("AdminOffers load error:", err);

      if (err.message === "NO_TOKEN") {
        setError("Nuk ka token. Ju lutem bëni login përsëri si admin.");
      } else if (err.message === "AUTH_ERROR") {
        setError("Sesioni ka skaduar ose token-i nuk është valid. Ju lutem bëni login përsëri.");
      } else {
        setError("Nuk u ngarkuan ofertat.");
      }

      setOffers([]);
    } finally {
      setLoading(false);
    }
  }

  const normalizedOffers = useMemo(() => {
    return offers.map((offer) => {
      const offerFeatures = parseOfferFeatures(
        offer.offer_features ?? offer.offerFeatures
      );

      return {
        ...offer,
        isActive:
          typeof offer.isActive !== "undefined"
            ? !!offer.isActive
            : typeof offer.is_active !== "undefined"
            ? !!offer.is_active
            : true,
        activeUntil: offer.activeUntil || offer.active_until || "",
        offerBadge: offer.offerBadge || offer.offer_badge || "",
        highlighted:
          typeof offer.highlighted !== "undefined" ? !!offer.highlighted : false,
        phone: offer.phone || "",
        whatsapp: offer.whatsapp || "",
        messenger: offer.messenger || "",
        backgroundColor:
          offer.backgroundColor || offer.background_color || "#ffffff",
        textColor: offer.textColor || offer.text_color || "#0f172a",
        buttonColor: offer.buttonColor || offer.button_color || "#2563eb",
        offerFeatures
      };
    });
  }, [offers]);

  const totalOffers = normalizedOffers.length;

  const activeOffers = useMemo(
    () => normalizedOffers.filter((offer) => offer.isActive).length,
    [normalizedOffers]
  );

  const highlightedOffers = useMemo(
    () => normalizedOffers.filter((offer) => offer.highlighted).length,
    [normalizedOffers]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFeatureChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedFeatures = [...prev.offerFeatures];

      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [field]: value
      };

      return {
        ...prev,
        offerFeatures: updatedFeatures
      };
    });
  };

  const addFeatureRow = () => {
    setFormData((prev) => ({
      ...prev,
      offerFeatures: [...prev.offerFeatures, { ...emptyFeature }]
    }));
  };

  const removeFeatureRow = (index) => {
    setFormData((prev) => {
      if (prev.offerFeatures.length === 1) {
        return {
          ...prev,
          offerFeatures: [{ ...emptyFeature }]
        };
      }

      return {
        ...prev,
        offerFeatures: prev.offerFeatures.filter((_, i) => i !== index)
      };
    });
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Titulli dhe përshkrimi janë të detyrueshme.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        throw new Error("NO_TOKEN");
      }

      const cleanedFeatures = formData.offerFeatures
        .map((feature) => ({
          text: feature.text.trim(),
          included: !!feature.included,
          note: feature.note.trim()
        }))
        .filter((feature) => feature.text);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: formData.price.trim(),
        offer_badge: formData.offerBadge.trim(),
        highlighted: formData.highlighted,
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim(),
        messenger: formData.messenger.trim(),
        background_color: formData.backgroundColor,
        text_color: formData.textColor,
        button_color: formData.buttonColor,
        offer_features: cleanedFeatures,
        is_active: formData.isActive,
        active_until: formData.activeUntil || null
      };

      const url = editingId
        ? `${API}/api/packages/${editingId}`
        : `${API}/api/packages`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await safeJson(res);

      if (res.status === 401 || res.status === 403) {
        throw new Error("AUTH_ERROR");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Gabim gjatë ruajtjes së ofertës.");
      }

      await loadOffers();
      resetForm();
    } catch (err) {
      console.error("AdminOffers save error:", err);

      if (err.message === "NO_TOKEN") {
        setError("Nuk ka token. Ju lutem bëni login përsëri si admin.");
      } else if (err.message === "AUTH_ERROR") {
        setError("Sesioni ka skaduar ose token-i nuk është valid. Ju lutem bëni login përsëri.");
      } else {
        setError("Ruajtja e ofertës dështoi.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (offer) => {
    const normalizedIsActive =
      typeof offer.isActive !== "undefined"
        ? !!offer.isActive
        : typeof offer.is_active !== "undefined"
        ? !!offer.is_active
        : true;

    const normalizedFeatures = parseOfferFeatures(
      offer.offer_features ?? offer.offerFeatures
    );

    setEditingId(offer.id);

    setFormData({
      title: offer.title || "",
      description: offer.description || "",
      price: offer.price || "",
      offerBadge: offer.offerBadge || offer.offer_badge || "",
      highlighted: !!offer.highlighted,
      isActive: normalizedIsActive,
      activeUntil: offer.activeUntil || offer.active_until || "",
      phone: offer.phone || "",
      whatsapp: offer.whatsapp || "",
      messenger: offer.messenger || "",
      backgroundColor:
        offer.backgroundColor || offer.background_color || "#ffffff",
      textColor: offer.textColor || offer.text_color || "#0f172a",
      buttonColor: offer.buttonColor || offer.button_color || "#2563eb",
      offerFeatures: normalizedFeatures.length
        ? normalizedFeatures.map((feature) => ({
            text: feature.text || "",
            included:
              typeof feature.included !== "undefined" ? !!feature.included : true,
            note: feature.note || ""
          }))
        : [{ ...emptyFeature }]
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "A je i sigurt që don me e fshi këtë ofertë?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const token = getAdminToken();

      if (!token) {
        throw new Error("NO_TOKEN");
      }

      const res = await fetch(`${API}/api/packages/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      const data = await safeJson(res);

      if (res.status === 401 || res.status === 403) {
        throw new Error("AUTH_ERROR");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Gabim gjatë fshirjes së ofertës.");
      }

      await loadOffers();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error("AdminOffers delete error:", err);

      if (err.message === "NO_TOKEN") {
        setError("Nuk ka token. Ju lutem bëni login përsëri si admin.");
      } else if (err.message === "AUTH_ERROR") {
        setError("Sesioni ka skaduar ose token-i nuk është valid. Ju lutem bëni login përsëri.");
      } else {
        setError("Fshirja e ofertës dështoi.");
      }
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.heroCard}>
          <div style={styles.heroGlow} />

          <div style={styles.heroTop} className="admin-offers-hero-top">
            <div style={styles.heroLeft}>
              <div style={styles.heroBadge}>Admin • Oferta</div>

              <h1 style={styles.heroTitle}>Menaxho ofertat</h1>

              <p style={styles.heroSubtitle}>
                Krijo paketa profesionale me badge, kontakte direkte, ngjyra të
                personalizuara dhe pika të detajuara që shfaqen bukur në public.
              </p>

              <div style={styles.heroNavWrap}>
                <AdminTopNav />
              </div>
            </div>

            <div style={styles.heroStatsWrap} className="admin-offers-hero-stats">
              <StatCard label="Totali i ofertave" value={totalOffers} dark />
              <StatCard label="Ofertat aktive" value={activeOffers} dark />
              <StatCard label="Featured" value={highlightedOffers} dark />
            </div>
          </div>
        </section>

        {error ? <div style={styles.errorBox}>{error}</div> : null}

        <section style={styles.formSectionCard}>
          <div style={styles.sectionTopRow}>
            <div>
              <h3 style={styles.sectionMainTitle}>
                {editingId ? "Përditëso ofertën" : "Shto ofertë të re"}
              </h3>

              <p style={styles.sectionMainSubtitle}>
                Plotëso të dhënat, kontaktet, ngjyrat dhe pikat e ofertës në një
                formë të pastër dhe shumë të organizuar.
              </p>
            </div>

            <div style={styles.sectionMiniBadge}>
              {editingId ? "Edit mode" : "New offer"}
            </div>
          </div>

          <div style={styles.formInnerWrap}>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
              <SectionTitle title="Informacioni bazë" />

              <div>
                <label style={labelStyle}>Emri i ofertës</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="p.sh. Premium Plus"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Përshkrimi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Përshkrimi i ofertës..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                />
              </div>

              <div style={twoColGridStyle}>
                <div>
                  <label style={labelStyle}>Çmimi</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="p.sh. 65"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Badge</label>
                  <input
                    type="text"
                    name="offerBadge"
                    value={formData.offerBadge}
                    onChange={handleChange}
                    placeholder="p.sh. 🔥 Më e shitur"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Aktive deri më</label>
                <input
                  type="date"
                  name="activeUntil"
                  value={formData.activeUntil}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={checkboxWrapStyle}>
                <label style={checkLabelStyle}>
                  <input
                    type="checkbox"
                    name="highlighted"
                    checked={formData.highlighted}
                    onChange={handleChange}
                  />
                  Theksoje si ofertë featured
                </label>

                <label style={checkLabelStyle}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  Ofertë aktive
                </label>
              </div>

              <SectionTitle title="Ngjyrat e ofertës" />

              <div style={threeColGridStyle}>
                <div>
                  <label style={labelStyle}>Ngjyra e kartelës</label>
                  <div style={colorInputWrapStyle}>
                    <input
                      type="color"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleChange}
                      style={colorPickerStyle}
                    />
                    <input
                      type="text"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Ngjyra e tekstit</label>
                  <div style={colorInputWrapStyle}>
                    <input
                      type="color"
                      name="textColor"
                      value={formData.textColor}
                      onChange={handleChange}
                      style={colorPickerStyle}
                    />
                    <input
                      type="text"
                      name="textColor"
                      value={formData.textColor}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Ngjyra e butonit</label>
                  <div style={colorInputWrapStyle}>
                    <input
                      type="color"
                      name="buttonColor"
                      value={formData.buttonColor}
                      onChange={handleChange}
                      style={colorPickerStyle}
                    />
                    <input
                      type="text"
                      name="buttonColor"
                      value={formData.buttonColor}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              <SectionTitle title="Kontaktet" />

              <div style={twoColGridStyle}>
                <div>
                  <label style={labelStyle}>Numri i telefonit</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="p.sh. 044000000"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>WhatsApp</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="p.sh. 38344000000"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Messenger link</label>
                <input
                  type="text"
                  name="messenger"
                  value={formData.messenger}
                  onChange={handleChange}
                  placeholder="p.sh. https://m.me/emripages"
                  style={inputStyle}
                />
              </div>

              <SectionTitle title="Pikat e ofertës" />

              <div style={{ display: "grid", gap: "12px" }}>
                {formData.offerFeatures.map((feature, index) => (
                  <div key={index} style={featureCardStyle}>
                    <div style={{ display: "grid", gap: "10px" }}>
                      <input
                        type="text"
                        value={feature.text}
                        onChange={(e) =>
                          handleFeatureChange(index, "text", e.target.value)
                        }
                        placeholder={`Pika ${index + 1}`}
                        style={inputStyle}
                      />

                      <select
                        value={String(feature.included)}
                        onChange={(e) =>
                          handleFeatureChange(
                            index,
                            "included",
                            e.target.value === "true"
                          )
                        }
                        style={inputStyle}
                      >
                        <option value="true">Përfshihet ✓</option>
                        <option value="false">Nuk përfshihet ✕</option>
                      </select>

                      <input
                        type="text"
                        value={feature.note}
                        onChange={(e) =>
                          handleFeatureChange(index, "note", e.target.value)
                        }
                        placeholder="Shënim opsional"
                        style={inputStyle}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFeatureRow(index)}
                      style={removeBtnStyle}
                    >
                      Hiqe
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addFeatureRow} style={addRowBtnStyle}>
                + Shto pikë
              </button>

              <div style={styles.formActions}>
                <button type="submit" style={primaryBtnStyle} disabled={submitting}>
                  {submitting
                    ? "Duke ruajtur..."
                    : editingId
                    ? "Ruaj ndryshimet"
                    : "Shto ofertën"}
                </button>

                <button type="button" onClick={resetForm} style={secondaryBtnStyle}>
                  Pastro
                </button>
              </div>
            </form>
          </div>
        </section>

        <section style={styles.listSectionCard}>
          <div style={styles.sectionTopRow}>
            <div>
              <h3 style={styles.sectionMainTitle}>Lista e ofertave</h3>

              <p style={styles.sectionMainSubtitle}>
                Ofertat ekzistuese me status, badge, kontakte, ngjyra dhe pika të ruajtura.
              </p>
            </div>

            <div style={styles.sectionMiniBadge}>
              {normalizedOffers.length} oferta
            </div>
          </div>

          {loading ? (
            <div style={emptyStateStyle}>Duke i ngarkuar ofertat...</div>
          ) : normalizedOffers.length === 0 ? (
            <div style={emptyStateStyle}>Nuk ka oferta të regjistruara.</div>
          ) : (
            <div className="offers-grid-pro" style={styles.offersGrid}>
              {normalizedOffers.map((offer) => (
                <div
                  key={offer.id}
                  style={{
                    ...offerListCardStyle,
                    background: offer.backgroundColor,
                    color: offer.textColor
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
                          fontSize: "20px",
                          fontWeight: "800",
                          color: offer.textColor
                        }}
                      >
                        {offer.title}
                      </h4>

                      <p
                        style={{
                          margin: "6px 0 0",
                          color: offer.textColor,
                          opacity: 0.78,
                          fontSize: "14px",
                          lineHeight: 1.6
                        }}
                      >
                        {offer.isActive ? "Aktive" : "Jo aktive"}
                        {offer.activeUntil ? ` • deri më ${offer.activeUntil}` : ""}
                        {offer.highlighted ? " • Featured" : ""}
                      </p>
                    </div>

                    <div
                      style={{
                        fontWeight: "800",
                        fontSize: "20px",
                        color: offer.textColor
                      }}
                    >
                      {offer.price ? `${offer.price} €` : "Pa çmim"}
                    </div>
                  </div>

                  {offer.offerBadge ? (
                    <div
                      style={{
                        ...inlineBadgeStyle,
                        background: "rgba(255,255,255,0.18)",
                        color: offer.textColor,
                        border: "1px solid rgba(255,255,255,0.22)"
                      }}
                    >
                      {offer.offerBadge}
                    </div>
                  ) : null}

                  <p
                    style={{
                      margin: "0 0 14px",
                      color: offer.textColor,
                      opacity: 0.86,
                      lineHeight: 1.7
                    }}
                  >
                    {offer.description}
                  </p>

                  {(offer.phone || offer.whatsapp || offer.messenger) && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "10px",
                        marginBottom: "14px"
                      }}
                    >
                      {offer.phone ? <InfoTag label="Tel" value={offer.phone} /> : null}
                      {offer.whatsapp ? <InfoTag label="WhatsApp" value={offer.whatsapp} /> : null}
                      {offer.messenger ? <InfoTag label="Messenger" value="Link aktiv" /> : null}
                    </div>
                  )}

                  <div
                    style={{
                      background: "rgba(255,255,255,0.42)",
                      borderRadius: "14px",
                      padding: "14px",
                      marginBottom: "14px",
                      border: "1px solid rgba(255,255,255,0.35)"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "800",
                        color: offer.textColor,
                        marginBottom: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em"
                      }}
                    >
                      Pikat e ofertës
                    </div>

                    {offer.offerFeatures && offer.offerFeatures.length ? (
                      <div style={{ display: "grid", gap: "10px" }}>
                        {offer.offerFeatures.map((feature, index) => (
                          <div key={index}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px"
                              }}
                            >
                              <span
                                style={{
                                  color: feature.included ? "#10b981" : "#ef4444",
                                  fontWeight: "900",
                                  minWidth: "16px",
                                  marginTop: "1px"
                                }}
                              >
                                {feature.included ? "✓" : "✕"}
                              </span>

                              <span
                                style={{
                                  color: offer.textColor,
                                  fontWeight: "700",
                                  lineHeight: 1.5
                                }}
                              >
                                {feature.text}
                              </span>
                            </div>

                            {feature.note ? (
                              <div
                                style={{
                                  marginLeft: "26px",
                                  marginTop: "4px",
                                  color: offer.textColor,
                                  opacity: 0.72,
                                  fontSize: "13px",
                                  lineHeight: 1.5
                                }}
                              >
                                {feature.note}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: offer.textColor, opacity: 0.78 }}>
                        Nuk ka pika të shtuara.
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button onClick={() => handleEdit(offer)} style={secondaryBtnStyle}>
                      Ndrysho
                    </button>

                    <button onClick={() => handleDelete(offer.id)} style={dangerBtnStyle}>
                      Fshij
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <style>{`
            @media (max-width: 1180px) {
              .admin-offers-hero-top {
                grid-template-columns: 1fr !important;
              }

              .admin-offers-hero-stats {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              }
            }

            @media (min-width: 1700px) {
              .offers-grid-pro {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              }
            }

            @media (max-width: 1699px) and (min-width: 980px) {
              .offers-grid-pro {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
            }

            @media (max-width: 979px) {
              .offers-grid-pro {
                grid-template-columns: 1fr !important;
              }
            }

            @media (max-width: 768px) {
              .admin-offers-hero-stats {
                grid-template-columns: 1fr !important;
              }

              input,
              select,
              textarea,
              button {
                font-size: 16px !important;
              }
            }
          `}</style>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div
      style={{
        fontSize: "13px",
        fontWeight: "800",
        color: "#1d4ed8",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginTop: "4px"
      }}
    >
      {title}
    </div>
  );
}

function StatCard({ label, value, dark = false }) {
  return (
    <div
      style={{
        background: dark ? "rgba(255,255,255,0.10)" : "#fff",
        borderRadius: "20px",
        padding: "18px",
        border: dark ? "1px solid rgba(255,255,255,0.16)" : "1px solid #e2e8f0",
        boxShadow: dark
          ? "inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 10px 30px rgba(15,23,42,0.06)",
        backdropFilter: dark ? "blur(10px)" : "none"
      }}
    >
      <div
        style={{
          color: dark ? "rgba(255,255,255,0.80)" : "#64748b",
          fontSize: "14px",
          marginBottom: "8px",
          fontWeight: "700"
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "800",
          color: dark ? "#ffffff" : "#0f172a"
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoTag({ label, value }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "12px"
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: "12px",
          fontWeight: "700",
          marginBottom: "4px"
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#0f172a",
          fontSize: "14px",
          fontWeight: "700",
          wordBreak: "break-word"
        }}
      >
        {value}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef4ff 45%, #f8fafc 100%)",
    padding: "8px 14px 48px"
  },

  container: {
    maxWidth: "1620px",
    margin: "0 auto"
  },

  heroCard: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
    borderRadius: "30px",
    padding: "26px",
    marginBottom: "22px",
    boxShadow: "0 22px 60px rgba(37,99,235,0.22)"
  },

  heroGlow: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(circle at top right, rgba(255,255,255,0.16), transparent 24%), radial-gradient(circle at bottom left, rgba(255,255,255,0.08), transparent 20%)"
  },

  heroTop: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.9fr)",
    gap: "22px",
    alignItems: "start"
  },

  heroLeft: {
    minWidth: 0
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "14px"
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(32px, 4vw, 52px)",
    lineHeight: 1.02,
    fontWeight: "900",
    letterSpacing: "-0.04em"
  },

  heroSubtitle: {
    margin: "14px 0 0",
    color: "rgba(255,255,255,0.92)",
    fontSize: "15px",
    lineHeight: 1.8,
    maxWidth: "760px",
    fontWeight: "500"
  },

  heroNavWrap: {
    marginTop: "22px"
  },

  heroStatsWrap: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    alignSelf: "start"
  },

  errorBox: {
    marginBottom: "20px",
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    borderRadius: "16px",
    padding: "14px 16px",
    fontWeight: "600"
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

  formActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "4px"
  },

  offersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px"
  }
};

const emptyStateStyle = {
  padding: "34px 18px",
  textAlign: "center",
  border: "1px dashed #cbd5e1",
  borderRadius: "16px",
  color: "#64748b",
  background: "#f8fafc"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "700",
  color: "#0f172a",
  fontSize: "14px"
};

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
  background: "#fff"
};

const twoColGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px"
};

const threeColGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px"
};

const colorInputWrapStyle = {
  display: "grid",
  gridTemplateColumns: "56px 1fr",
  gap: "10px",
  alignItems: "center"
};

const colorPickerStyle = {
  width: "56px",
  height: "48px",
  border: "1px solid #cbd5e1",
  borderRadius: "14px",
  background: "#fff",
  padding: "4px",
  cursor: "pointer"
};

const checkboxWrapStyle = {
  display: "flex",
  gap: "18px",
  flexWrap: "wrap"
};

const checkLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontWeight: "700",
  color: "#0f172a",
  fontSize: "14px"
};

const featureCardStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "14px",
  background: "#f8fafc",
  display: "grid",
  gap: "10px"
};

const offerListCardStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  padding: "18px",
  background: "#ffffff"
};

const inlineBadgeStyle = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#eff6ff",
  color: "#1d4ed8",
  fontWeight: "700",
  fontSize: "13px",
  marginBottom: "12px"
};

const primaryBtnStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "13px 18px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "800"
};

const secondaryBtnStyle = {
  background: "#e2e8f0",
  color: "#0f172a",
  border: "none",
  padding: "13px 18px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "800"
};

const dangerBtnStyle = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "13px 18px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "800"
};

const addRowBtnStyle = {
  marginTop: "4px",
  background: "#eff6ff",
  color: "#1d4ed8",
  border: "1px solid #bfdbfe",
  padding: "12px 14px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "800"
};

const removeBtnStyle = {
  background: "#fee2e2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
  padding: "12px 14px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "800",
  whiteSpace: "nowrap"
};