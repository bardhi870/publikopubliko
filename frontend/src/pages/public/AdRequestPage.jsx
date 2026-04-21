import React, { useState } from "react";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialForm = {
  full_name: "",
  business_name: "",
  phone: "",
  email: "",
  ad_type: "",
  budget: "",
  message: ""
};

export default function AdRequestPage() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/ad-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Nuk u dërgua kërkesa.");
      }

      setSuccessMessage(
        "Kërkesa u dërgua me sukses. Do t’ju kontaktojmë së shpejti me ofertën e personalizuar."
      );
      setFormData(initialForm);
    } catch (error) {
      setErrorMessage("Ndodhi një gabim gjatë dërgimit të kërkesës.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.08), transparent 32%), #f8fafc",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <PublicHeader />

      <main style={{ flex: 1 }}>
        <section
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "34px 16px 70px"
          }}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "34px",
              padding: "30px 22px",
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 52%, #2563eb 100%)",
              boxShadow: "0 25px 70px rgba(15,23,42,0.20)",
              marginBottom: "28px"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-80px",
                right: "-80px",
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.10)",
                filter: "blur(10px)"
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-70px",
                left: "-50px",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: "rgba(96,165,250,0.16)",
                filter: "blur(8px)"
              }}
            />

            <div style={{ position: "relative", zIndex: 2, maxWidth: "760px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 14px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#dbeafe",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "16px"
                }}
              >
                🚀 Promovo biznesin tuaj
              </div>

              <h1
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: "clamp(30px, 5vw, 54px)",
                  lineHeight: 1.02,
                  fontWeight: "900",
                  letterSpacing: "-0.04em"
                }}
              >
                Reklamo me ne
              </h1>

              <p
                style={{
                  marginTop: "16px",
                  marginBottom: 0,
                  color: "rgba(255,255,255,0.84)",
                  fontSize: "16px",
                  lineHeight: 1.75,
                  maxWidth: "680px",
                  whiteSpace: "pre-line"
                }}
              >
                {"Na kontaktoni dhe merrni ofertën e personalizuar për promovimin e biznesit tuaj në Publiko.\n\nOfrojmë banerë reklamues, linke të sponsorizuara, foto me link brenda lajmeve, postime të sponsorizuara, artikuj promovues dhe paketa reklamimi sipas nevojës dhe buxhetit tuaj."}
              </p>
            </div>
          </div>

          <div
            className="ad-request-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr",
              gap: "24px"
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(226,232,240,0.95)",
                borderRadius: "28px",
                padding: "26px",
                boxShadow: "0 20px 50px rgba(15,23,42,0.07)"
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "10px",
                  color: "#0f172a",
                  fontSize: "26px",
                  fontWeight: "900",
                  letterSpacing: "-0.03em"
                }}
              >
                Kërko ofertë për reklamim
              </h2>

              <p
                style={{
                  marginTop: 0,
                  marginBottom: "24px",
                  color: "#64748b",
                  fontSize: "15px",
                  lineHeight: 1.7
                }}
              >
                Plotësoni të dhënat dhe ekipi ynë do t’ju kontaktojë me ofertë të
                personalizuar për reklamimin e biznesit ose shërbimit tuaj.
              </p>

              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "16px"
                  }}
                >
                  <Field
                    label="Emri i plotë"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Shkruani emrin dhe mbiemrin"
                  />

                  <Field
                    label="Emri i biznesit"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    placeholder="P.sh. Biznesi XYZ"
                  />

                  <Field
                    label="Numri i telefonit"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="04X XXX XXX"
                  />

                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@biznesi.com"
                  />

                  <SelectField
                    label="Shërbimi që kërkoni"
                    name="ad_type"
                    value={formData.ad_type}
                    onChange={handleChange}
                  />

                  <Field
                    label="Buxheti"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="P.sh. 100€ - 500€"
                  />
                </div>

                <div style={{ marginTop: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#334155",
                      fontSize: "14px",
                      fontWeight: "700"
                    }}
                  >
                    Përshkrimi i kërkesës
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Na tregoni çfarë promovimi dëshironi, ku doni të shfaqeni dhe çfarë synoni të arrini me reklamën tuaj."
                    rows={6}
                    style={textareaStyle}
                  />
                </div>

                {successMessage ? (
                  <div style={successStyle}>{successMessage}</div>
                ) : null}

                {errorMessage ? (
                  <div style={errorStyle}>{errorMessage}</div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: "18px",
                    width: "100%",
                    border: "none",
                    borderRadius: "18px",
                    padding: "16px 18px",
                    cursor: loading ? "not-allowed" : "pointer",
                    background: loading
                      ? "linear-gradient(135deg, #94a3b8, #cbd5e1)"
                      : "linear-gradient(135deg, #2563eb, #60a5fa)",
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: "900",
                    letterSpacing: "-0.01em",
                    boxShadow: "0 18px 34px rgba(37,99,235,0.22)",
                    transition: "all 0.2s ease"
                  }}
                >
                  {loading
                    ? "Duke u dërguar..."
                    : "Kërko ofertën e personalizuar"}
                </button>
              </form>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px"
              }}
            >
              <InfoCard
                icon="📢"
                title="Promovim më i dukshëm"
                text="Biznesi juaj mund të promovohet me banerë, linke ose postime të sponsorizuara për të arritur audiencën e duhur."
              />

              <InfoCard
                icon="🎯"
                title="Zgjidhje fleksibile"
                text="Zgjidhni ndërmjet banerëve reklamues, fotos me link brenda lajmit, artikujve promovues ose paketave të kombinuara."
              />

              <InfoCard
                icon="⚡"
                title="Ofertë e personalizuar"
                text="Çdo biznes ka nevoja të ndryshme. Ju përgatisim ofertë sipas qëllimit, kohëzgjatjes dhe buxhetit tuaj."
              />

              <div
                style={{
                  background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "28px",
                  padding: "28px",
                  boxShadow: "0 20px 50px rgba(15,23,42,0.06)"
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    fontSize: "28px",
                    fontWeight: "900",
                    color: "#0f172a",
                    marginBottom: "16px",
                    letterSpacing: "-0.03em"
                  }}
                >
                  Pse të reklamoni me Publiko?
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    lineHeight: 1.7,
                    marginBottom: "24px"
                  }}
                >
                  Prani më e fortë, promovim më i dukshëm dhe forma të ndryshme
                  reklamimi për të arritur klientët e duhur.
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                    marginBottom: "24px"
                  }}
                >
                  {[
                    "Banerë reklamues",
                    "Postime të sponsorizuara",
                    "Linke brenda lajmeve",
                    "Paketa promovimi të personalizuara"
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "14px 16px",
                        borderRadius: "16px",
                        background: "#f8fafc",
                        border: "1px solid #dbeafe",
                        fontWeight: "800",
                        color: "#1e293b"
                      }}
                    >
                      <span
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "999px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#dbeafe",
                          color: "#1d4ed8",
                          fontSize: "14px",
                          flexShrink: 0
                        }}
                      >
                        ✓
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gap: "14px" }}>
                  <a href="https://wa.me/38344000000" style={contactBtnGreen}>
                    WhatsApp: 044 000 000
                  </a>

                  <a href="tel:044000000" style={contactBtnBlue}>
                    Telefon: 044 000 000
                  </a>

                  <a href="mailto:info@publiko.biz" style={contactBtnGray}>
                    Email: info@publiko.biz
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

      <style>
        {`
          @media (max-width: 980px) {
            .ad-request-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 640px) {
            .ad-request-grid form > div:first-child {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text"
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: "#334155",
          fontSize: "14px",
          fontWeight: "700"
        }}
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: "#334155",
          fontSize: "14px",
          fontWeight: "700"
        }}
      >
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
      >
        <option value="">Zgjidh shërbimin</option>
        <option value="banner">Baner reklamues në faqe</option>
        <option value="sponsored_link">Link i sponsorizuar</option>
        <option value="image_link">Foto me link brenda lajmit</option>
        <option value="sponsored_post">Postim i sponsorizuar</option>
        <option value="sponsored_article">Artikull promovues</option>
        <option value="custom_package">Paketë e personalizuar</option>
      </select>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.94)",
        border: "1px solid rgba(226,232,240,0.95)",
        borderRadius: "24px",
        padding: "22px",
        boxShadow: "0 18px 42px rgba(15,23,42,0.06)"
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
          fontSize: "24px",
          marginBottom: "14px"
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          margin: 0,
          color: "#0f172a",
          fontSize: "20px",
          fontWeight: "900",
          letterSpacing: "-0.02em"
        }}
      >
        {title}
      </h3>

      <p
        style={{
          marginTop: "10px",
          marginBottom: 0,
          color: "#64748b",
          lineHeight: 1.75,
          fontSize: "15px"
        }}
      >
        {text}
      </p>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #dbe3ee",
  outline: "none",
  fontSize: "15px",
  color: "#0f172a",
  background: "#fff",
  boxSizing: "border-box",
  boxShadow: "inset 0 1px 2px rgba(15,23,42,0.03)"
};

const textareaStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "18px",
  border: "1px solid #dbe3ee",
  outline: "none",
  fontSize: "15px",
  color: "#0f172a",
  background: "#fff",
  boxSizing: "border-box",
  resize: "vertical",
  fontFamily: "inherit",
  boxShadow: "inset 0 1px 2px rgba(15,23,42,0.03)"
};

const successStyle = {
  marginTop: "16px",
  padding: "14px 16px",
  borderRadius: "16px",
  background: "rgba(220,252,231,0.8)",
  border: "1px solid rgba(74,222,128,0.35)",
  color: "#166534",
  fontWeight: "700",
  fontSize: "14px"
};

const errorStyle = {
  marginTop: "16px",
  padding: "14px 16px",
  borderRadius: "16px",
  background: "rgba(254,226,226,0.82)",
  border: "1px solid rgba(248,113,113,0.35)",
  color: "#991b1b",
  fontWeight: "700",
  fontSize: "14px"
};

const contactBtnGreen = {
  display: "flex",
  textDecoration: "none",
  padding: "14px 16px",
  borderRadius: "16px",
  background: "#dcfce7",
  color: "#166534",
  fontWeight: "800"
};

const contactBtnBlue = {
  display: "flex",
  textDecoration: "none",
  padding: "14px 16px",
  borderRadius: "16px",
  background: "#dbeafe",
  color: "#1d4ed8",
  fontWeight: "800"
};

const contactBtnGray = {
  display: "flex",
  textDecoration: "none",
  padding: "14px 16px",
  borderRadius: "16px",
  background: "#f1f5f9",
  color: "#334155",
  fontWeight: "800"
};