import React, { useState } from "react";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const LOGO_URL =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776969027/PUBLIKO_LOGO_pomulk.png";

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/ad-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Nuk u dërgua kërkesa.");

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
    <div className="ad-page">
      <PublicHeader />

      <main className="ad-main">
        <section className="hero-section">
          <div className="hero-bg-grid" />
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="hero-container">
            <div className="hero-left">
              <div className="hero-badge">🚀 REKLAMO ME PUBLIKO</div>

              <h1>
                Promovo biznesin tënd <span>me Publiko</span>
              </h1>

              <p>
                Arrij klientë të rinj çdo ditë me banerë reklamues, postime të
                sponsorizuara, artikuj promovues dhe paketa reklamimi të
                personalizuara.
              </p>

              <div className="hero-features">
                <div>👁️ Shikueshmëri maksimale</div>
                <div>🎯 Zgjidhje fleksibile</div>
                <div>📈 Rezultate të matshme</div>
                <div>🤝 Mbështetje profesionale</div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="logo-float">
                <img src={LOGO_URL} alt="Publiko" />
                <strong>Publiko</strong>
              </div>

              <div className="megaphone">📣</div>

              <div className="float-card card-one">📈</div>
              <div className="float-card card-two">🖼️</div>
              <div className="float-card card-three">▶</div>
              <div className="target">🎯</div>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="content-container">
            <div className="form-card">
              <div className="form-title-row">
                <div className="form-icon">✈️</div>
                <div>
                  <span>Kërkesë e re</span>
                  <h2>Kërko ofertë për reklamim</h2>
                </div>
              </div>

              <p className="form-intro">
                Plotësoni të dhënat më poshtë dhe ekipi ynë do t’ju kontaktojë
                me ofertën më të përshtatshme për biznesin tuaj.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
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
                    label="Buxheti i përafërt"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="P.sh. 100€ - 500€"
                  />
                </div>

                <div className="field-full">
                  <label>Përshkrimi i kërkesës</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Na tregoni çfarë promovimi dëshironi, ku doni të shfaqeni dhe çfarë synoni të arrini me reklamën tuaj..."
                    rows={5}
                  />
                </div>

                {successMessage ? (
                  <div className="success-box">✅ {successMessage}</div>
                ) : null}

                {errorMessage ? (
                  <div className="error-box">❌ {errorMessage}</div>
                ) : null}

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "Duke u dërguar..." : "✈️ Kërko ofertën e personalizuar"}
                </button>
              </form>
            </div>

            <aside className="side-column">
              <InfoCard
                icon="📢"
                title="Banerë reklamues"
                text="Shfaq biznesin tuaj në vendet më të dukshme të platformës."
              />
              <InfoCard
                icon="🔗"
                title="Linke të sponsorizuara"
                text="Drejto klientët direkt te faqja ose profili i biznesit tuaj."
              />
              <InfoCard
                icon="🖼️"
                title="Foto me link në lajme"
                text="Foto brenda artikujve me link të drejtpërdrejtë."
              />
              <InfoCard
                icon="📝"
                title="Artikuj promovues"
                text="Përmbajtje profesionale që rrit besueshmërinë e biznesit."
              />

              <div className="why-card">
                <div className="why-brand">
                  <img src={LOGO_URL} alt="Publiko" />
                  <strong>Publiko</strong>
                </div>

                <h3>Pse të reklamoni me Publiko?</h3>

                <ul>
                  <li>Platformë për biznese dhe shpallje</li>
                  <li>Zgjidhje reklamimi për çdo biznes</li>
                  <li>Çmime konkuruese</li>
                  <li>Mbështetje dhe raportim i plotë</li>
                </ul>

                <a href="tel:044000000">📞 Na kontaktoni</a>
              </div>
            </aside>
          </div>

          <div className="bottom-stats">
            <div>👥 <strong>100K+</strong><span>Vizitorë çdo muaj</span></div>
            <div>👁️ <strong>500K+</strong><span>Shikime faqesh</span></div>
            <div>📈 <strong>100%</strong><span>Kënaqësi e klientëve</span></div>
            <div>⭐ <strong>24/7</strong><span>Mbështetje</span></div>
          </div>
        </section>
      </main>

      <PublicFooter />

      <style>{`
        .ad-page{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          background:#f8fafc;
          color:#0f172a;
          overflow-x:hidden;
        }

        .ad-main{
          flex:1;
          background:#f8fafc;
        }

        .hero-section{
          position:relative;
          overflow:hidden;
          background:
            radial-gradient(circle at 22% 30%, rgba(37,99,235,.35), transparent 28%),
            radial-gradient(circle at 78% 34%, rgba(14,165,233,.28), transparent 28%),
            linear-gradient(135deg, #020617 0%, #071225 48%, #063b68 100%);
          padding:118px 18px 68px;
          color:#fff;
        }

        .hero-bg-grid{
          position:absolute;
          inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
          background-size:54px 54px;
          opacity:.8;
        }

        .hero-glow{
          position:absolute;
          border-radius:999px;
          pointer-events:none;
          filter:blur(10px);
        }

        .hero-glow-one{
          width:220px;
          height:220px;
          left:8%;
          top:20%;
          background:rgba(59,130,246,.20);
          border:1px solid rgba(147,197,253,.20);
        }

        .hero-glow-two{
          width:460px;
          height:460px;
          right:-130px;
          bottom:-190px;
          background:rgba(37,99,235,.24);
        }

        .hero-container{
          position:relative;
          z-index:2;
          max-width:1180px;
          margin:0 auto;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:42px;
          align-items:center;
        }

        .hero-badge{
          width:max-content;
          padding:10px 16px;
          border-radius:999px;
          background:rgba(37,99,235,.45);
          border:1px solid rgba(96,165,250,.38);
          color:#dbeafe;
          font-size:12px;
          font-weight:950;
          letter-spacing:.05em;
          margin-bottom:22px;
        }

        .hero-left h1{
          margin:0;
          max-width:560px;
          font-size:clamp(42px, 5.6vw, 72px);
          line-height:.96;
          font-weight:950;
          letter-spacing:-.065em;
        }

        .hero-left h1 span{
          color:#1995ff;
          text-shadow:0 0 35px rgba(59,130,246,.48);
        }

        .hero-left p{
          max-width:560px;
          margin:22px 0 0;
          color:#dbeafe;
          font-size:18px;
          line-height:1.75;
          font-weight:650;
        }

        .hero-features{
          display:grid;
          grid-template-columns:repeat(4, minmax(0,1fr));
          gap:12px;
          margin-top:30px;
        }

        .hero-features div{
          padding:13px 10px;
          border-top:1px solid rgba(59,130,246,.65);
          color:#e0f2fe;
          font-size:12px;
          font-weight:800;
        }

        .hero-visual{
          position:relative;
          min-height:390px;
        }

        .logo-float{
          position:absolute;
          top:6px;
          left:16px;
          display:flex;
          align-items:center;
          gap:10px;
          padding:12px 14px;
          border-radius:20px;
          background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.14);
          backdrop-filter:blur(16px);
        }

        .logo-float img{
          width:38px;
          height:38px;
          object-fit:contain;
          border-radius:12px;
          background:#fff;
          padding:5px;
        }

        .logo-float strong{
          font-size:18px;
          font-weight:950;
        }

        .megaphone{
          position:absolute;
          left:120px;
          top:80px;
          font-size:142px;
          filter:drop-shadow(0 28px 42px rgba(37,99,235,.55));
          transform:rotate(-10deg);
        }

        .float-card{
          position:absolute;
          width:150px;
          height:76px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:18px;
          background:linear-gradient(135deg, rgba(37,99,235,.35), rgba(14,165,233,.18));
          border:1px solid rgba(96,165,250,.42);
          box-shadow:0 20px 50px rgba(0,0,0,.20);
          backdrop-filter:blur(16px);
          font-size:42px;
        }

        .card-one{
          top:50px;
          right:50px;
          transform:rotate(-8deg);
        }

        .card-two{
          top:150px;
          right:0;
          width:190px;
        }

        .card-three{
          left:160px;
          bottom:35px;
          width:230px;
        }

        .target{
          position:absolute;
          right:42px;
          bottom:40px;
          font-size:98px;
          filter:drop-shadow(0 18px 34px rgba(37,99,235,.45));
        }

        .hero-visual::after{
          content:"";
          position:absolute;
          left:70px;
          right:20px;
          bottom:8px;
          height:34px;
          border-radius:999px;
          border:2px solid rgba(14,165,233,.55);
          box-shadow:0 0 28px rgba(14,165,233,.5);
        }

        .content-section{
          max-width:1180px;
          margin:0 auto;
          padding:32px 18px 70px;
        }

        .content-container{
          display:grid;
          grid-template-columns:1.55fr .75fr;
          gap:26px;
          align-items:start;
        }

        .form-card,
        .info-card,
        .why-card,
        .bottom-stats{
          background:#fff;
          border:1px solid #e2e8f0;
          box-shadow:0 20px 55px rgba(15,23,42,.08);
        }

        .form-card{
          border-radius:18px;
          padding:28px;
        }

        .form-title-row{
          display:flex;
          gap:16px;
          align-items:center;
          margin-bottom:14px;
        }

        .form-icon{
          width:58px;
          height:58px;
          border-radius:14px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          background:linear-gradient(135deg,#2563eb,#1d4ed8);
          box-shadow:0 14px 34px rgba(37,99,235,.32);
          font-size:24px;
        }

        .form-title-row span{
          color:#64748b;
          font-size:13px;
          font-weight:800;
        }

        .form-title-row h2{
          margin:4px 0 0;
          color:#0f172a;
          font-size:30px;
          line-height:1.1;
          font-weight:950;
          letter-spacing:-.04em;
        }

        .form-intro{
          max-width:640px;
          margin:0 0 28px 74px;
          color:#64748b;
          font-size:15px;
          line-height:1.7;
          font-weight:650;
        }

        .form-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:18px 22px;
        }

        label{
          display:block;
          margin-bottom:8px;
          color:#0f172a;
          font-size:13px;
          font-weight:900;
        }

        input,
        select,
        textarea{
          width:100%;
          box-sizing:border-box;
          border:1px solid #dbe3ee;
          background:#fff;
          outline:none;
          color:#0f172a;
          font-family:inherit;
          font-size:14px;
          font-weight:700;
          transition:.18s ease;
        }

        input,
        select{
          height:56px;
          border-radius:12px;
          padding:0 15px;
        }

        textarea{
          border-radius:13px;
          padding:15px;
          resize:vertical;
        }

        input:focus,
        select:focus,
        textarea:focus{
          border-color:#2563eb;
          box-shadow:0 0 0 4px rgba(37,99,235,.12);
        }

        .field-full{
          margin-top:20px;
        }

        .success-box,
        .error-box{
          margin-top:18px;
          padding:14px 16px;
          border-radius:12px;
          font-size:13px;
          font-weight:800;
        }

        .success-box{
          background:#ecfdf5;
          border:1px solid #86efac;
          color:#166534;
        }

        .error-box{
          background:#fef2f2;
          border:1px solid #fca5a5;
          color:#991b1b;
        }

        .submit-btn{
          width:100%;
          height:58px;
          margin-top:22px;
          border:none;
          border-radius:12px;
          cursor:pointer;
          background:linear-gradient(135deg,#2563eb,#1d4ed8);
          color:#fff;
          font-size:15px;
          font-weight:950;
          box-shadow:0 18px 36px rgba(37,99,235,.28);
          transition:.18s ease;
        }

        .submit-btn:hover{
          transform:translateY(-2px);
          box-shadow:0 24px 48px rgba(37,99,235,.36);
        }

        .submit-btn:disabled{
          cursor:not-allowed;
          opacity:.7;
          transform:none;
        }

        .side-column{
          display:flex;
          flex-direction:column;
          gap:14px;
        }

        .info-card{
          border-radius:14px;
          padding:18px;
          display:grid;
          grid-template-columns:52px 1fr;
          gap:14px;
          align-items:center;
        }

        .info-icon{
          width:52px;
          height:52px;
          border-radius:999px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(135deg,#2563eb,#1d4ed8);
          color:#fff;
          font-size:22px;
          box-shadow:0 14px 28px rgba(37,99,235,.25);
        }

        .info-card h3{
          margin:0;
          color:#1d4ed8;
          font-size:16px;
          font-weight:950;
        }

        .info-card p{
          margin:5px 0 0;
          color:#64748b;
          font-size:13px;
          line-height:1.45;
          font-weight:650;
        }

        .why-card{
          border-radius:16px;
          padding:24px;
          background:
            radial-gradient(circle at 80% 20%, rgba(59,130,246,.35), transparent 38%),
            linear-gradient(135deg,#061b46,#073b82);
          color:#fff;
        }

        .why-brand{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:20px;
        }

        .why-brand img{
          width:38px;
          height:38px;
          object-fit:contain;
          background:#fff;
          border-radius:11px;
          padding:5px;
        }

        .why-brand strong{
          font-size:22px;
          font-weight:950;
        }

        .why-card h3{
          margin:0 0 18px;
          font-size:26px;
          line-height:1.1;
          letter-spacing:-.04em;
          font-weight:950;
        }

        .why-card ul{
          list-style:none;
          padding:0;
          margin:0 0 22px;
          display:grid;
          gap:12px;
        }

        .why-card li{
          color:#dbeafe;
          font-size:13px;
          font-weight:750;
        }

        .why-card li::before{
          content:"✓";
          display:inline-flex;
          align-items:center;
          justify-content:center;
          width:18px;
          height:18px;
          margin-right:9px;
          border-radius:999px;
          background:#0ea5e9;
          color:#fff;
          font-size:11px;
          font-weight:950;
        }

        .why-card a{
          display:inline-flex;
          text-decoration:none;
          color:#fff;
          background:#0b63ce;
          border:1px solid rgba(255,255,255,.18);
          padding:13px 18px;
          border-radius:12px;
          font-weight:950;
        }

        .bottom-stats{
          margin-top:24px;
          border-radius:14px;
          padding:22px 28px;
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:18px;
          background:linear-gradient(135deg,#0b4ac2,#073b82);
          color:#fff;
        }

        .bottom-stats div{
          display:grid;
          gap:4px;
          font-size:24px;
        }

        .bottom-stats strong{
          font-size:24px;
          font-weight:950;
        }

        .bottom-stats span{
          font-size:13px;
          color:#dbeafe;
          font-weight:750;
        }

        @media(max-width:980px){
          .hero-section{
            padding-top:96px;
          }

          .hero-container,
          .content-container{
            grid-template-columns:1fr;
          }

          .hero-visual{
            min-height:320px;
          }

          .bottom-stats{
            grid-template-columns:1fr 1fr;
          }
        }

        @media(max-width:640px){
          .hero-section{
            padding:88px 12px 46px;
          }

          .hero-features,
          .form-grid,
          .bottom-stats{
            grid-template-columns:1fr;
          }

          .hero-left h1{
            font-size:42px;
          }

          .hero-left p{
            font-size:15px;
          }

          .hero-visual{
            min-height:250px;
          }

          .megaphone{
            font-size:98px;
            left:60px;
            top:70px;
          }

          .float-card{
            width:105px;
            height:58px;
            font-size:28px;
          }

          .card-two{
            width:130px;
          }

          .card-three{
            width:150px;
            left:95px;
          }

          .target{
            font-size:64px;
            right:20px;
          }

          .content-section{
            padding:22px 12px 48px;
          }

          .form-card{
            padding:20px;
          }

          .form-intro{
            margin-left:0;
          }

          .form-title-row{
            align-items:flex-start;
          }
        }
      `}</style>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange }) {
  return (
    <div>
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange}>
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
    <div className="info-card">
      <div className="info-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}