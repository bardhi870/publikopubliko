import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const sectionCard = {
  border: "1px solid #e2e8f0",
  borderRadius: "22px",
  padding: "18px",
  background: "linear-gradient(180deg,#ffffff 0%,#f8fbff 100%)",
  boxShadow: "0 10px 28px rgba(15,23,42,0.04)"
};

const sectionTitle = {
  margin: "0 0 14px",
  color: "#0f172a",
  fontSize: "16px",
  fontWeight: "900"
};

const sectionText = {
  margin: "-6px 0 16px",
  color: "#64748b",
  fontSize: "13px",
  lineHeight: "1.6"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#334155",
  fontWeight: "800",
  fontSize: "13px"
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
  padding: "14px 20px",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  background: "linear-gradient(135deg,#0f172a,#2563eb)",
  color: "#fff",
  fontWeight: "900",
  boxShadow: "0 16px 34px rgba(37,99,235,0.25)"
};

const secondaryActionBtn = {
  padding: "11px 16px",
  border: "1px solid #cbd5e1",
  borderRadius: "14px",
  cursor: "pointer",
  background: "#fff",
  color: "#0f172a",
  fontWeight: "800"
};

const ghostActionBtn = {
  padding: "14px 20px",
  border: "1px solid #dbeafe",
  borderRadius: "14px",
  cursor: "pointer",
  background: "#fff",
  color: "#0f172a",
  fontWeight: "900"
};

const addOptionBtn = {
  marginTop: "10px",
  padding: "11px 15px",
  borderRadius: "12px",
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  color: "#1d4ed8",
  cursor: "pointer",
  fontWeight: "800"
};

const removeOptionBtn = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#dc2626",
  cursor: "pointer",
  fontWeight: "800"
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
  padding: "13px 15px",
  borderRadius: "16px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  fontSize: "13px",
  color: "#475569",
  lineHeight: "1.7"
};

const previewCardBtn = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "800",
  fontSize: "13px"
};

const previewDarkBtn = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "none",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "800",
  fontSize: "13px"
};

const previewDangerBtn = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "1px solid #fecaca",
  background: "#fff5f5",
  color: "#dc2626",
  cursor: "pointer",
  fontWeight: "800",
  fontSize: "13px"
};

const editorialToggleCard = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 16px",
  borderRadius: "16px",
  background: "#fff",
  border: "1px solid rgba(37,99,235,0.14)",
  minHeight: "62px",
  boxSizing: "border-box"
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"]
  ]
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "align",
  "link",
  "image",
  "video"
];

const normalizeUrl = (url = "") => {
  const clean = url.trim();
  if (!clean) return "";
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  return `https://${clean}`;
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
        borderRadius: "30px",
        padding: "24px",
        boxShadow: "0 20px 55px rgba(15,23,42,0.07)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "18px",
          borderBottom: "1px solid #e2e8f0"
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              padding: "7px 11px",
              borderRadius: "999px",
              background: "#eff6ff",
              color: "#1d4ed8",
              fontSize: "12px",
              fontWeight: "900",
              marginBottom: "10px"
            }}
          >
            {editingId ? "MODIFIKIM" : "PUBLIKIM I RI"}
          </div>

          <h2
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "24px",
              fontWeight: "950",
              letterSpacing: "-0.03em"
            }}
          >
            {editingId ? "Edito postimin" : "Shto postim të ri"}
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              color: "#64748b",
              fontSize: "14px",
              lineHeight: "1.6"
            }}
          >
            Plotëso të dhënat, zgjidh median dhe publiko postimin në platformë.
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
          <p style={sectionText}>Titulli, përshkrimi dhe kategoria e postimit.</p>

          <div
            className="admin-form-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
              gap: "14px"
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Titulli</label>
              <input
                type="text"
                name="title"
                placeholder="Shkruaj titullin"
                value={formData.title || ""}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Përshkrimi / Teksti</label>

              <div className="quill-premium-wrap">
                <ReactQuill
                  theme="snow"
                  value={formData.description || ""}
                  onChange={(value) =>
                    handleChange({
                      target: { name: "description", value }
                    })
                  }
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Shkruaj tekstin këtu..."
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Kategoria</label>
              <select
                name="category"
                value={formData.category || ""}
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
                  value={formData.price || ""}
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
                    borderRadius: "20px",
                    border: "1px solid rgba(37,99,235,0.14)",
                    background:
                      "linear-gradient(135deg,rgba(239,246,255,0.95),rgba(248,250,252,0.98))"
                  }}
                >
                  <div
                    style={{
                      marginBottom: "6px",
                      color: "#0f172a",
                      fontWeight: "950",
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
                    Kontrollo ku shfaqet lajmi: hero kryesor ose breaking ticker.
                  </div>

                  <div
                    className="editorial-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2,minmax(0,1fr))",
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
                        <div style={{ color: "#0f172a", fontWeight: "900" }}>
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
                        <div style={{ color: "#0f172a", fontWeight: "900" }}>
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
                          Shfaqet në shiritin horizontal.
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
            <p style={sectionText}>
              Të dhëna shtesë për banesa, shtëpi, lokale dhe prona.
            </p>

            <div
              className="admin-form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                gap: "14px"
              }}
            >
              <div>
                <label style={labelStyle}>Lloji i pronës</label>
                <select
                  name="property_type"
                  value={formData.property_type || ""}
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
                  name="purpose"
                  value={formData.purpose || ""}
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
                  value={formData.priceType || ""}
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
                  value={formData.city || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Sipërfaqja m²</label>
                <input
                  type="text"
                  name="area"
                  placeholder="p.sh. 85"
                  value={formData.area || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Viti i ndërtimit</label>
                <input
                  type="text"
                  name="year_built"
                  placeholder="p.sh. 2020"
                  value={formData.year_built || ""}
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
                  value={formData.rooms || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Dhoma gjumi</label>
                <input
                  type="number"
                  name="bedrooms"
                  placeholder="p.sh. 2"
                  value={formData.bedrooms || ""}
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
                  value={formData.bathrooms || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Kati</label>
                <input
                  type="text"
                  name="floor"
                  placeholder="p.sh. 4"
                  value={formData.floor || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Orientimi</label>
                <select
                  name="orientation"
                  value={formData.orientation || ""}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh orientimin</option>
                  <option value="Lindje">Lindje</option>
                  <option value="Perëndim">Perëndim</option>
                  <option value="Veri">Veri</option>
                  <option value="Jug">Jug</option>
                  <option value="Jug-Lindje">Jug-Lindje</option>
                  <option value="Jug-Perëndim">Jug-Perëndim</option>
                  <option value="Veri-Lindje">Veri-Lindje</option>
                  <option value="Veri-Perëndim">Veri-Perëndim</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Lagjja</label>
                <input
                  type="text"
                  name="neighborhood"
                  placeholder="p.sh. Dardania"
                  value={formData.neighborhood || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Adresa</label>
                <input
                  type="text"
                  name="address"
                  placeholder="p.sh. Rr. B"
                  value={formData.address || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Parking / Garazh</label>
                <select
                  name="parking"
                  value={formData.parking || ""}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh</option>
                  <option value="Po">Po</option>
                  <option value="Jo">Jo</option>
                  <option value="Garazh">Garazh</option>
                  <option value="Parking privat">Parking privat</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Ashensor</label>
                <select
                  name="elevator"
                  value={formData.elevator || ""}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh</option>
                  <option value="Po">Po</option>
                  <option value="Jo">Jo</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Ballkon / Terasë</label>
                <select
                  name="balcony"
                  value={formData.balcony || ""}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh</option>
                  <option value="Po">Po</option>
                  <option value="Jo">Jo</option>
                  <option value="Ballkon">Ballkon</option>
                  <option value="Terasë">Terasë</option>
                  <option value="Ballkon + Terasë">Ballkon + Terasë</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Ngrohja</label>
                <input
                  type="text"
                  name="heating"
                  placeholder="p.sh. Qendrore, rrymë, pelet"
                  value={formData.heating || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Mobilimi</label>
                <select
                  name="furnishing"
                  value={formData.furnishing || ""}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh</option>
                  <option value="E mobiluar">E mobiluar</option>
                  <option value="Gjysmë e mobiluar">Gjysmë e mobiluar</option>
                  <option value="E pamobiluar">E pamobiluar</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Dokumentacioni</label>
                <input
                  type="text"
                  name="legal_status"
                  placeholder="p.sh. Me fletë poseduese"
                  value={formData.legal_status || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Pronësia</label>
                <input
                  type="text"
                  name="ownership"
                  placeholder="p.sh. Pronar / Agjenci"
                  value={formData.ownership || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Karakteristikat</label>
                <input
                  type="text"
                  name="features"
                  placeholder="p.sh. Parking, Ashensor, Ballkon, Internet"
                  value={formData.features || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {formData.category === "automjete" && (
          <div style={sectionCard}>
            <h3 style={sectionTitle}>Detajet e automjetit</h3>
            <p style={sectionText}>
              Plotëso të dhënat kryesore të veturës që shfaqen në faqe.
            </p>

            <div
              className="admin-form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                gap: "14px"
              }}
            >
              <input name="mileage" placeholder="Kilometrazh (p.sh. 198000)" value={formData.mileage || ""} onChange={handleChange} style={inputStyle} />
              <input name="power" placeholder="Fuqia (hp)" value={formData.power || ""} onChange={handleChange} style={inputStyle} />
              <input name="transmission" placeholder="Transmetimi (Automatic / Manual)" value={formData.transmission || ""} onChange={handleChange} style={inputStyle} />
              <input name="drive_type" placeholder="Sistemi (FWD / AWD / 4x4)" value={formData.drive_type || ""} onChange={handleChange} style={inputStyle} />
              <input name="fuel_type" placeholder="Karburanti (Diesel / Benzin)" value={formData.fuel_type || ""} onChange={handleChange} style={inputStyle} />
              <input name="vehicle_year" placeholder="Viti" value={formData.vehicle_year || ""} onChange={handleChange} style={inputStyle} />
              <input name="body_type" placeholder="Lloji i automjetit (SUV, Sedan)" value={formData.body_type || ""} onChange={handleChange} style={inputStyle} />
              <input name="series" placeholder="Seria" value={formData.series || ""} onChange={handleChange} style={inputStyle} />
              <input name="doors" placeholder="Dyert" value={formData.doors || ""} onChange={handleChange} style={inputStyle} />
              <input name="seats" placeholder="Ulëset" value={formData.seats || ""} onChange={handleChange} style={inputStyle} />
              <input name="exterior_color" placeholder="Ngjyra e jashtme" value={formData.exterior_color || ""} onChange={handleChange} style={inputStyle} />
              <input name="interior_color" placeholder="Ngjyra e brendshme" value={formData.interior_color || ""} onChange={handleChange} style={inputStyle} />
              <input name="weight" placeholder="Pesha (kg)" value={formData.weight || ""} onChange={handleChange} style={inputStyle} />
              <input name="engine_capacity" placeholder="Motorri (p.sh. 2993)" value={formData.engine_capacity || ""} onChange={handleChange} style={inputStyle} />
              <input name="vehicle_condition" placeholder="Kushti (I ri / I përdorur)" value={formData.vehicle_condition || ""} onChange={handleChange} style={inputStyle} />
              <input name="location" placeholder="Lokacioni (p.sh. Prishtinë)" value={formData.location || ""} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
        )}

        {isJobPost && (
          <div style={sectionCard}>
            <h3 style={sectionTitle}>Detajet e konkursit</h3>
            <p style={sectionText}>
              Informata kryesore që shfaqen në kartelë dhe në detaje.
            </p>

            <div
              className="admin-form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                gap: "14px"
              }}
            >
              <div>
                <label style={labelStyle}>Kompania</label>
                <input
                  type="text"
                  name="company_name"
                  placeholder="p.sh. Dent Line"
                  value={formData.company_name || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Kategoritë</label>
                <select
                  name="job_category"
                  value={formData.job_category || ""}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Zgjedh kategorinë</option>
                  <option value="Mjekësi">Mjekësi</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Shitje">Shitje</option>
                  <option value="Administratë">Administratë</option>
                  <option value="Ndërtimtari">Ndërtimtari</option>
                  <option value="Prodhimtari">Prodhimtari</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Vendi i punës</label>
                <input
                  type="text"
                  name="job_location"
                  placeholder="p.sh. Prishtinë"
                  value={formData.job_location || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Numri i pozitave</label>
                <input
                  type="number"
                  name="positions_count"
                  placeholder="p.sh. 5"
                  value={formData.positions_count || ""}
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
                </select>
              </div>
            </div>
          </div>
        )}

        {showContactFields && (
          <div style={sectionCard}>
            <h3 style={sectionTitle}>Kontakti</h3>
            <p style={sectionText}>
              Këto të dhëna shfaqen në kartelat publike dhe te detajet.
            </p>

            <div
              className="admin-form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                gap: "14px"
              }}
            >
              <div>
                <label style={labelStyle}>Nr. Telefonit</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="p.sh. 044000000"
                  value={formData.phone || ""}
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
                  value={formData.whatsapp || ""}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        <div style={sectionCard}>
          <h3 style={sectionTitle}>Link ekstra</h3>
          <p style={sectionText}>
            Vendos link opsional për burim lajmi, aplikim, website, Facebook,
            Instagram, lokacion ose dokument.
          </p>

          <div
            className="admin-form-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
              gap: "14px"
            }}
          >
            <input
              type="text"
              name="link_text"
              placeholder="p.sh. Apliko këtu"
              value={formData.link_text || ""}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="url"
              name="link_url"
              placeholder="https://example.com"
              value={formData.link_url || ""}
              onChange={handleChange}
              onBlur={() => {
                const fixed = normalizeUrl(formData.link_url || "");
                handleChange({
                  target: { name: "link_url", value: fixed }
                });
              }}
              style={inputStyle}
            />
          </div>

          {formData.link_url && (
            <div
              style={{
                marginTop: "14px",
                padding: "13px 14px",
                borderRadius: "16px",
                border: "1px solid #bfdbfe",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap"
              }}
            >
              <div>
                <div
                  style={{
                    color: "#0f172a",
                    fontWeight: "900",
                    fontSize: "13px"
                  }}
                >
                  Preview linku
                </div>
                <div
                  style={{
                    marginTop: "4px",
                    color: "#64748b",
                    fontSize: "12px",
                    wordBreak: "break-all"
                  }}
                >
                  {formData.link_url}
                </div>
              </div>

              <a
                href={normalizeUrl(formData.link_url)}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "10px 13px",
                  borderRadius: "12px",
                  background: "#2563eb",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: "900",
                  fontSize: "13px"
                }}
              >
                {formData.link_text || "Hap linkun"}
              </a>
            </div>
          )}
        </div>

        <div style={sectionCard}>
          <h3 style={sectionTitle}>Afati dhe statusi</h3>

          <div
            className="admin-form-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
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
                  checked={!!formData.is_unlimited}
                  onChange={handleChange}
                />
                <span style={{ color: "#0f172a", fontWeight: "800" }}>
                  Pa afat
                </span>
              </label>
            </div>

            <div>
              <label style={labelStyle}>Statusi</label>
              <label style={checkboxWrapStyle}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active !== false}
                  onChange={handleChange}
                />
                <span style={{ color: "#0f172a", fontWeight: "800" }}>
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
              <label style={labelStyle}>Badge</label>
              <input
                type="text"
                name="offerBadge"
                placeholder="p.sh. 🔥 Më e shitur"
                value={formData.offerBadge || ""}
                onChange={handleChange}
                style={inputStyle}
              />
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

            <button type="button" onClick={addOfferFeature} style={addOptionBtn}>
              + Shto opsion
            </button>
          </div>
        )}

        <div style={sectionCard}>
          <h3 style={sectionTitle}>Media</h3>
          <p style={sectionText}>
            Zgjedh fotot, cakto kopertinën dhe renditjen sipas dëshirës.
          </p>

          <label style={labelStyle}>Foto max 10 + 1 Video</label>
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
            • Deri 1 video
            <br />
            • Mund ta zgjedhësh vet kopertinën
            <br />• Mund ta ndryshosh renditjen e fotove
          </div>

          {selectedImages?.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  fontWeight: "900",
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
                  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
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
                      borderRadius: "20px",
                      padding: "12px",
                      background: "#fff",
                      boxShadow: img.isCover
                        ? "0 14px 30px rgba(37,99,235,0.14)"
                        : "0 8px 22px rgba(15,23,42,0.05)"
                    }}
                  >
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "165px",
                        objectFit: "cover",
                        borderRadius: "15px",
                        display: "block"
                      }}
                    />

                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        flexWrap: "wrap"
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "13px",
                          color: img.isCover ? "#2563eb" : "#475569"
                        }}
                      >
                        {img.isCover ? "✓ Kopertina" : `Foto ${index + 1}`}
                      </strong>

                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Renditja: {img.sortOrder || index + 1}
                      </span>
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
                          Kopertinë
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => moveSelectedImageLeft(index)}
                        style={previewDarkBtn}
                      >
                        ←
                      </button>

                      <button
                        type="button"
                        onClick={() => moveSelectedImageRight(index)}
                        style={previewDarkBtn}
                      >
                        →
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
                  fontWeight: "900",
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
                  borderRadius: "20px",
                  padding: "14px",
                  background: "#fff",
                  boxShadow: "0 8px 22px rgba(15,23,42,0.05)"
                }}
              >
                <video
                  controls
                  src={selectedVideo.preview}
                  style={{
                    width: "100%",
                    maxHeight: "360px",
                    borderRadius: "15px",
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
                  <strong
                    style={{
                      fontSize: "13px",
                      color: videoIsCover ? "#2563eb" : "#0f172a"
                    }}
                  >
                    {videoIsCover ? "✓ Kopertina Video" : "Video e zgjedhur"}
                  </strong>

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
            flexWrap: "wrap",
            paddingTop: "4px"
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
        .quill-premium-wrap {
          background: #fff;
          border: 1px solid #cbd5e1;
          border-radius: 16px;
          overflow: hidden;
        }

        .quill-premium-wrap .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .quill-premium-wrap .ql-container {
          border: none;
          min-height: 190px;
          font-size: 15px;
        }

        .quill-premium-wrap .ql-editor {
          min-height: 190px;
          line-height: 1.75;
          color: #0f172a;
        }

        .quill-premium-wrap .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }

        @media (max-width: 768px) {
          .admin-form-grid,
          .offer-feature-grid,
          .media-grid,
          .editorial-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}