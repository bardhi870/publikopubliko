import React from "react";

const sectionCard = {
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  padding: "16px",
  background: "#fcfdff"
};

const sectionTitle = {
  margin: "0 0 14px",
  color: "#0f172a",
  fontSize: "16px",
  fontWeight: "900"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#334155",
  fontWeight: "700",
  fontSize: "14px"
};

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  outline: "none",
  background: "#fff",
  fontSize: "15px",
  boxSizing: "border-box"
};

const primaryActionBtn = {
  padding: "13px 18px",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  background: "linear-gradient(135deg, #2563eb, #60a5fa)",
  color: "#fff",
  fontWeight: "800",
  boxShadow: "0 14px 28px rgba(37,99,235,0.22)"
};

const secondaryActionBtn = {
  padding: "11px 16px",
  border: "1px solid #cbd5e1",
  borderRadius: "14px",
  cursor: "pointer",
  background: "#fff",
  color: "#0f172a",
  fontWeight: "700"
};

const ghostActionBtn = {
  padding: "13px 18px",
  border: "1px solid #dbeafe",
  borderRadius: "14px",
  cursor: "pointer",
  background: "#fff",
  color: "#0f172a",
  fontWeight: "800"
};

const addOptionBtn = {
  marginTop: "10px",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  color: "#1d4ed8",
  cursor: "pointer",
  fontWeight: "700"
};

const removeOptionBtn = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#dc2626",
  cursor: "pointer",
  fontWeight: "700"
};

const checkboxWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  background: "#fff",
  minHeight: "52px",
  boxSizing: "border-box"
};

const uploadInfoBoxStyle = {
  marginTop: "10px",
  padding: "12px 14px",
  borderRadius: "14px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  fontSize: "13px",
  color: "#475569",
  lineHeight: "1.65"
};

const previewCardBtn = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px"
};

const previewDarkBtn = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "none",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px"
};

const previewDangerBtn = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "1px solid #fecaca",
  background: "#fff5f5",
  color: "#dc2626",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px"
};

const editorialToggleCard = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 16px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #ffffff, #f8fbff)",
  border: "1px solid rgba(37,99,235,0.12)",
  minHeight: "60px",
  boxSizing: "border-box"
};

export default function AdminPostForm({
  editingId,
  formData,
  handleChange,
  handleFileChange,
  selectedImages,
  selectedVideo,
  setCoverImage,
  setVideoAsCover,
  videoIsCover,
  moveSelectedImageLeft,
  moveSelectedImageRight,
  removeSelectedImage,
  removeSelectedVideo,
  handleSubmit,
  resetForm,
  categoryOptions,
  showPriceField,
  isRealEstate,
  showContactFields,
  isOffer,
  addOfferFeature,
  removeOfferFeature,
  handleOfferFeatureChange
}) {
  const isJobPost = formData.category === "konkurse-pune";
  const isNewsCategory = ["vendi", "rajoni", "bota"].includes(formData.category);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "26px",
        padding: "22px",
        boxShadow: "0 18px 45px rgba(15,23,42,0.06)"
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
        <div>
          <h2
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "22px",
              fontWeight: "900"
            }}
          >
            {editingId ? "Edito postimin" : "Shto postim të ri"}
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
              fontSize: "14px",
              lineHeight: "1.6"
            }}
          >
            Plotëso të dhënat dhe ruaje publikimin.
          </p>
        </div>

        {editingId && (
          <button type="button" onClick={resetForm} style={secondaryActionBtn}>
            Anulo editimin
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >
        <div style={sectionCard}>
          <h3 style={sectionTitle}>Të dhënat kryesore</h3>

          <div
            className="admin-form-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px"
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Titulli</label>
              <input
                type="text"
                name="title"
                placeholder="Shkruaj titullin"
                value={formData.title}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Përshkrimi</label>
              <textarea
                name="description"
                placeholder="Shkruaj përshkrimin"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
              />
            </div>

            <div>
              <label style={labelStyle}>Kategoria</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Zgjedh kategorinë</option>
                {categoryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {showPriceField && (
              <div>
                <label style={labelStyle}>Çmimi</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Shkruaj çmimin"
                  value={formData.price}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            )}

            {isNewsCategory && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div
                  style={{
                    marginTop: "4px",
                    padding: "16px",
                    borderRadius: "18px",
                    border: "1px solid rgba(37,99,235,0.12)",
                    background:
                      "linear-gradient(135deg, rgba(239,246,255,0.95), rgba(248,250,252,0.98))"
                  }}
                >
                  <div
                    style={{
                      marginBottom: "10px",
                      color: "#0f172a",
                      fontWeight: "900",
                      fontSize: "15px"
                    }}
                  >
                    Opsionet editoriale të lajmit
                  </div>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      lineHeight: "1.65",
                      marginBottom: "14px"
                    }}
                  >
                    Zgjedh nëse ky lajm duhet të shfaqet në hero ose në breaking ticker.
                  </div>

                  <div
                    className="editorial-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "12px"
                    }}
                  >
                    <label style={editorialToggleCard}>
                      <input
                        type="checkbox"
                        name="featured"
                        checked={!!formData.featured}
                        onChange={handleChange}
                      />
                      <div>
                        <div
                          style={{
                            color: "#0f172a",
                            fontWeight: "800",
                            fontSize: "14px"
                          }}
                        >
                          Featured në hero
                        </div>
                        <div
                          style={{
                            marginTop: "4px",
                            color: "#64748b",
                            fontSize: "12px",
                            lineHeight: "1.55"
                          }}
                        >
                          Shfaqet te lajmet kryesore sipër.
                        </div>
                      </div>
                    </label>

                    <label style={editorialToggleCard}>
                      <input
                        type="checkbox"
                        name="breaking"
                        checked={!!formData.breaking}
                        onChange={handleChange}
                      />
                      <div>
                        <div
                          style={{
                            color: "#0f172a",
                            fontWeight: "800",
                            fontSize: "14px"
                          }}
                        >
                          Breaking ticker
                        </div>
                        <div
                          style={{
                            marginTop: "4px",
                            color: "#64748b",
                            fontSize: "12px",
                            lineHeight: "1.55"
                          }}
                        >
                          Shfaqet në shiritin horizontal sipër faqes.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isRealEstate && (
          <div style={sectionCard}>
            <h3 style={sectionTitle}>Detajet e patundshmërisë</h3>

            <div
              className="admin-form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px"
              }}
            >
              <div>
                <label style={labelStyle}>Lloji i pronës</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh llojin</option>
                  <option value="banese">Banesë</option>
                  <option value="shtepi">Shtëpi</option>
                  <option value="lokal">Lokal</option>
                  <option value="zyre">Zyrë</option>
                  <option value="truall">Truall</option>
                  <option value="depo">Depo</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Lloji i shpalljes</label>
                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh llojin</option>
                  <option value="shitje">Në shitje</option>
                  <option value="qira">Me qira</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Lloji i çmimit</label>
                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh llojin</option>
                  <option value="fiks">Fiks</option>
                  <option value="marreveshje">Me marrëveshje</option>
                  <option value="mujor">Mujor</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Qyteti</label>
                <input
                  type="text"
                  name="city"
                  placeholder="p.sh. Prishtinë"
                  value={formData.city}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Sipërfaqja (m²)</label>
                <input
                  type="text"
                  name="area"
                  placeholder="p.sh. 85"
                  value={formData.area}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Dhoma</label>
                <input
                  type="number"
                  name="rooms"
                  placeholder="p.sh. 3"
                  value={formData.rooms}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Banjo</label>
                <input
                  type="number"
                  name="bathrooms"
                  placeholder="p.sh. 2"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {isJobPost && (
          <div style={sectionCard}>
            <h3 style={sectionTitle}>Detajet e konkursit</h3>

            <div
              className="admin-form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px"
              }}
            >
              <div>
                <label style={labelStyle}>Kategoria e punës</label>
                <select
                  name="job_category"
                  value={formData.job_category || ""}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh kategorinë</option>
                  <option value="Software">Software</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Mjekësi">Mjekësi</option>
                  <option value="Infermieri">Infermieri</option>
                  <option value="Arsim&Edukim">Arsim & Edukim</option>
                  <option value="Financa">Financa</option>
                  <option value="Shitje">Shitje</option>
                  <option value="Administratë">Administratë</option>
                  <option value="IT KARRIERA">IT KARRIERA</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Qyteti</label>
                <input
                  type="text"
                  name="city"
                  placeholder="p.sh. Prishtinë"
                  value={formData.city || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Përvoja</label>
                <select
                  name="experience"
                  value={formData.experience || ""}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh përvojën</option>
                  <option value="No Experience">No Experience</option>
                  <option value="1-2 Experience">1-2 Experience</option>
                  <option value="3-5 Experience">3-5 Experience</option>
                  <option value="5+ Experience">5+ Experience</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Orët e punës</label>
                <select
                  name="work_hours"
                  value={formData.work_hours || ""}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Unordered">Unordered</option>
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Gjuhët</label>
                <input
                  type="text"
                  name="languages"
                  placeholder="p.sh. Albanian, English"
                  value={formData.languages || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {showContactFields && (
          <div style={sectionCard}>
            <h3 style={sectionTitle}>Kontakti</h3>

            <div
              className="admin-form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px"
              }}
            >
              <div>
                <label style={labelStyle}>Nr. Telefonit</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="p.sh. 044000000"
                  value={formData.phone}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Nr. WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  placeholder="p.sh. 044000000"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        <div style={sectionCard}>
          <h3 style={sectionTitle}>Afati dhe statusi</h3>

          <div
            className="admin-form-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px"
            }}
          >
            <div>
              <label style={labelStyle}>Aktiv nga</label>
              <input
                type="date"
                name="active_from"
                value={formData.active_from || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Aktiv deri</label>
              <input
                type="date"
                name="active_until"
                value={formData.active_until || ""}
                onChange={handleChange}
                disabled={formData.is_unlimited}
                style={{
                  ...inputStyle,
                  background: formData.is_unlimited ? "#f1f5f9" : "#fff",
                  cursor: formData.is_unlimited ? "not-allowed" : "text"
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>Kohëzgjatja</label>
              <label style={checkboxWrapStyle}>
                <input
                  type="checkbox"
                  name="is_unlimited"
                  checked={formData.is_unlimited || false}
                  onChange={handleChange}
                />
                <span style={{ color: "#0f172a", fontWeight: "700" }}>
                  Pa afat (Unlimited)
                </span>
              </label>
            </div>

            <div>
              <label style={labelStyle}>Statusi i postimit</label>
              <label style={checkboxWrapStyle}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active !== false}
                  onChange={handleChange}
                />
                <span style={{ color: "#0f172a", fontWeight: "700" }}>
                  Aktiv
                </span>
              </label>
            </div>
          </div>
        </div>

        {isOffer && (
          <div style={sectionCard}>
            <h3 style={sectionTitle}>Opsionet e ofertës</h3>

            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Badge (opsionale)</label>
              <input
                type="text"
                name="offerBadge"
                placeholder="p.sh. 🔥 Më e shitur"
                value={formData.offerBadge || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div
              style={{
                marginBottom: "10px",
                color: "#475569",
                fontWeight: "700",
                fontSize: "14px"
              }}
            >
              Pikat e ofertës
            </div>

            {(formData.offerFeatures || []).map((feature, index) => (
              <div
                key={index}
                className="offer-feature-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 140px auto",
                  gap: "10px",
                  alignItems: "center",
                  marginBottom: "10px"
                }}
              >
                <input
                  type="text"
                  placeholder="p.sh. Konkursi publikohet"
                  value={feature.text || ""}
                  onChange={(e) =>
                    handleOfferFeatureChange(index, "text", e.target.value)
                  }
                  style={inputStyle}
                />

                <select
                  value={feature.included ? "yes" : "no"}
                  onChange={(e) =>
                    handleOfferFeatureChange(
                      index,
                      "included",
                      e.target.value === "yes"
                    )
                  }
                  style={inputStyle}
                >
                  <option value="yes">✔️ Po</option>
                  <option value="no">❌ Jo</option>
                </select>

                <button
                  type="button"
                  onClick={() => removeOfferFeature(index)}
                  style={removeOptionBtn}
                >
                  Hiq
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addOfferFeature}
              style={addOptionBtn}
            >
              + Shto opsion
            </button>
          </div>
        )}

        <div style={sectionCard}>
          <h3 style={sectionTitle}>Media</h3>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Foto (max 10) + 1 Video</label>

            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/quicktime,video/webm"
              onChange={handleFileChange}
              style={inputStyle}
            />

            <div style={uploadInfoBoxStyle}>
              • Deri 10 foto
              <br />
              • Deri 1 video (1080p max)
              <br />
              • Fotot kompresohen automatikisht (1600px, rreth 300–400KB)
              <br />
              • Videot kompresohen automatikisht nëse kanë nevojë
            </div>
          </div>

          {selectedImages?.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  fontWeight: "800",
                  marginBottom: "12px",
                  color: "#0f172a"
                }}
              >
                Fotot e zgjedhura
              </div>

              <div
                className="media-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px"
                }}
              >
                {selectedImages.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      border: img.isCover
                        ? "3px solid #2563eb"
                        : "1px solid #dbe3ee",
                      borderRadius: "18px",
                      padding: "12px",
                      background: "#fff",
                      boxShadow: img.isCover
                        ? "0 12px 26px rgba(37,99,235,0.12)"
                        : "0 8px 20px rgba(15,23,42,0.04)"
                    }}
                  >
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "14px",
                        display: "block"
                      }}
                    />

                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: img.isCover ? "#2563eb" : "#64748b"
                        }}
                      >
                        {img.isCover ? "✓ Kopertina" : `Foto ${index + 1}`}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#64748b"
                        }}
                      >
                        Renditja: {img.sortOrder || index + 1}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "12px",
                        flexWrap: "wrap"
                      }}
                    >
                      {!img.isCover && (
                        <button
                          type="button"
                          onClick={() => setCoverImage(index)}
                          style={previewCardBtn}
                        >
                          Vendos si kopertinë
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => moveSelectedImageLeft(index)}
                        style={previewDarkBtn}
                      >
                        ← Majtas
                      </button>

                      <button
                        type="button"
                        onClick={() => moveSelectedImageRight(index)}
                        style={previewDarkBtn}
                      >
                        Djathtas →
                      </button>

                      <button
                        type="button"
                        onClick={() => removeSelectedImage(index)}
                        style={previewDangerBtn}
                      >
                        Fshij
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedVideo && (
            <div style={{ marginTop: "22px" }}>
              <div
                style={{
                  fontWeight: "800",
                  marginBottom: "10px",
                  color: "#0f172a"
                }}
              >
                Video e zgjedhur
              </div>

              <div
                style={{
                  border: videoIsCover
                    ? "3px solid #2563eb"
                    : "1px solid #dbe3ee",
                  borderRadius: "18px",
                  padding: "14px",
                  background: "#fff",
                  boxShadow: "0 8px 20px rgba(15,23,42,0.04)"
                }}
              >
                <video
                  controls
                  src={selectedVideo.preview}
                  style={{
                    width: "100%",
                    maxHeight: "360px",
                    borderRadius: "14px",
                    display: "block",
                    background: "#000"
                  }}
                />

                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    alignItems: "center",
                    flexWrap: "wrap"
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: videoIsCover ? "#2563eb" : "#0f172a"
                    }}
                  >
                    {videoIsCover
                      ? "✓ Kopertina (Video)"
                      : "1 video e zgjedhur"}
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {!videoIsCover && (
                      <button
                        type="button"
                        onClick={setVideoAsCover}
                        style={previewCardBtn}
                      >
                        Vendos si kopertinë
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={removeSelectedVideo}
                      style={previewDangerBtn}
                    >
                      Largo videon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >
          <button type="submit" style={primaryActionBtn}>
            {editingId ? "Ruaj ndryshimet" : "Publiko postimin"}
          </button>

          <button type="button" onClick={resetForm} style={ghostActionBtn}>
            Pastro formën
          </button>
        </div>
      </form>

      <style>{`
        @media (max-width: 768px) {
          .admin-form-grid {
            grid-template-columns: 1fr !important;
          }

          .offer-feature-grid {
            grid-template-columns: 1fr !important;
          }

          .media-grid {
            grid-template-columns: 1fr !important;
          }

          .editorial-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}