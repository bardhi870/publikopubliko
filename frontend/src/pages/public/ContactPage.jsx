import React, { useEffect, useState } from "react";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";

const logoUrl =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776969027/PUBLIKO_LOGO_pomulk.png";

const heroImage =
  "https://res.cloudinary.com/dzyn3rfgk/image/upload/v1770616331/pexels-gdtography-277628-911738_avu5ml.jpg";

export default function ContactPage() {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1024;

  return (
    <div className="contact-page">
      <PublicHeader />

      <main>
        <section className="contact-hero">
          <div className="hero-bg" />
          <div className="hero-overlay" />
          <div className="hero-orb one" />
          <div className="hero-orb two" />

          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-logo-card">
                <div className="hero-logo">
                  <img src={logoUrl} alt="Publiko.biz" />
                </div>

                <div>
                  <strong>Publiko.biz</strong>
                  <span>Portal informativ & shpallje</span>
                </div>
              </div>

              <div className="hero-badge">Kontakt • Bashkëpunim • Reklamim</div>

              <h1>Na kontaktoni për çdo pyetje ose bashkëpunim.</h1>

              <p>
                Jemi këtu për informata, reklamime, shpallje dhe çdo komunikim
                zyrtar lidhur me platformën Publiko.biz.
              </p>

              <div className="hero-actions">
                <a href="mailto:ihgkosova@gmail.com">Shkruaj në Email</a>
                <a href="tel:044000000" className="ghost">📞 044 000 000</a>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-wrap">
          <div className="info-grid">
            <InfoCard
              icon="📍"
              title="Lokacioni"
              value="Prishtinë, Kosovë"
              desc="Qendra e komunikimit dhe operimit të portalit."
            />

            <InfoCard
              icon="✉️"
              title="Email"
              value="ihgkosova@gmail.com"
              desc="Për informata, bashkëpunime dhe pyetje zyrtare."
              action={
                <a href="mailto:ihgkosova@gmail.com" className="mini-btn">
                  Dërgo Email
                </a>
              }
            />

            <InfoCard
              icon="📞"
              title="Telefoni"
              value="044 000 000"
              desc="Kontakt direkt për komunikim më të shpejtë."
              action={
                <a href="tel:044000000" className="mini-btn primary">
                  Thirr Tani
                </a>
              }
            />
          </div>

          <div className="contact-main-grid">
            <div className="main-card">
              <div className="main-card-top">
                <div className="main-logo">
                  <img src={logoUrl} alt="Publiko.biz" />
                </div>

                <div>
                  <span>Kontakt Zyrtar</span>
                  <strong>Publiko.biz</strong>
                </div>
              </div>

              <h2>Jemi të gatshëm të dëgjojmë dhe të përgjigjemi.</h2>

              <p>
                Nëse keni pyetje rreth publikimeve, kategorive, bashkëpunimeve,
                reklamimit ose njoftimeve në portal, mund të na kontaktoni
                përmes emailit ose telefonit. Komunikimi ynë synon të jetë i
                qartë, profesional dhe i shpejtë.
              </p>

              <div className="main-actions">
                <a href="mailto:ihgkosova@gmail.com">Shkruaj në Email</a>
                <a href="tel:044000000" className="light">📞 044 000 000</a>
              </div>
            </div>

            <div className="details-card">
              <h3>Detajet e kontaktit</h3>

              <ContactRow label="Lokacioni" value="Prishtinë, Kosovë" />
              <ContactRow label="Email" value="ihgkosova@gmail.com" />
              <ContactRow label="Telefoni" value="044 000 000" />

              <div className="quick-box">
                <strong>Komunikim i shpejtë</strong>
                <p>
                  Për kontakt më të drejtpërdrejtë, përdorni telefonin ose
                  emailin e mësipërm.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

      <style>{`
        .contact-page{
          min-height:100vh;
          background:#f8fbff;
          color:#0f172a;
        }

        .contact-hero{
          position:relative;
          min-height:${isMobile ? "390px" : isTablet ? "500px" : "590px"};
          display:flex;
          align-items:center;
          overflow:hidden;
          isolation:isolate;
        }

        .hero-bg{
          position:absolute;
          inset:0;
          background-image:url(${heroImage});
          background-size:cover;
          background-position:center;
          transform:scale(1.06);
          z-index:-5;
        }

        .hero-overlay{
          position:absolute;
          inset:0;
          z-index:-4;
          background:
            linear-gradient(135deg, rgba(2,6,23,.94) 0%, rgba(15,23,42,.84) 42%, rgba(37,99,235,.76) 100%),
            radial-gradient(circle at 82% 18%, rgba(56,189,248,.42), transparent 34%);
        }

        .hero-orb{
          position:absolute;
          border-radius:999px;
          filter:blur(34px);
          pointer-events:none;
          z-index:-2;
        }

        .hero-orb.one{
          width:360px;
          height:360px;
          right:-80px;
          top:90px;
          background:rgba(56,189,248,.24);
        }

        .hero-orb.two{
          width:300px;
          height:300px;
          left:-120px;
          bottom:-100px;
          background:rgba(37,99,235,.28);
        }

        .hero-inner{
          width:min(100%,1220px);
          margin:0 auto;
          padding:${isMobile ? "92px 16px 92px" : "120px 20px 135px"};
          position:relative;
          z-index:2;
        }

        .hero-content{
          max-width:780px;
        }

        .hero-logo-card{
          display:inline-flex;
          align-items:center;
          gap:13px;
          padding:10px 14px 10px 10px;
          border-radius:22px;
          background:rgba(255,255,255,.11);
          border:1px solid rgba(255,255,255,.18);
          backdrop-filter:blur(14px);
          -webkit-backdrop-filter:blur(14px);
          box-shadow:0 20px 54px rgba(0,0,0,.20);
          margin-bottom:18px;
        }

        .hero-logo{
          width:58px;
          height:58px;
          border-radius:18px;
          display:grid;
          place-items:center;
          background:linear-gradient(135deg,rgba(255,255,255,.22),rgba(56,189,248,.20));
          border:1px solid rgba(255,255,255,.24);
          box-shadow:0 16px 38px rgba(14,165,233,.24);
          overflow:hidden;
        }

        .hero-logo img{
          width:82%;
          height:82%;
          object-fit:contain;
        }

        .hero-logo-card strong{
          display:block;
          color:#fff;
          font-size:22px;
          line-height:1;
          letter-spacing:-.04em;
          font-weight:950;
        }

        .hero-logo-card span{
          display:block;
          margin-top:5px;
          color:#bfdbfe;
          font-size:12px;
          font-weight:800;
        }

        .hero-badge{
          display:inline-flex;
          align-items:center;
          padding:8px 14px;
          border-radius:999px;
          background:rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.14);
          color:#dbeafe;
          font-size:${isMobile ? "12px" : "13px"};
          font-weight:850;
          margin-bottom:18px;
          backdrop-filter:blur(8px);
        }

        .hero-content h1{
          margin:0 0 16px;
          color:#fff;
          font-size:${isMobile ? "36px" : isTablet ? "52px" : "70px"};
          line-height:.98;
          letter-spacing:-.06em;
          font-weight:950;
        }

        .hero-content p{
          margin:0;
          max-width:690px;
          color:#dbeafe;
          font-size:${isMobile ? "15.5px" : "18px"};
          line-height:1.8;
          font-weight:600;
        }

        .hero-actions{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
          margin-top:26px;
        }

        .hero-actions a,
        .main-actions a{
          min-height:48px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:0 20px;
          border-radius:999px;
          text-decoration:none;
          background:linear-gradient(135deg,#2563eb,#60a5fa);
          color:#fff;
          font-weight:900;
          font-size:14px;
          box-shadow:0 18px 38px rgba(37,99,235,.28);
        }

        .hero-actions a.ghost,
        .main-actions a.light{
          background:rgba(255,255,255,.12);
          border:1px solid rgba(255,255,255,.20);
          color:#fff;
          box-shadow:none;
        }

        .contact-wrap{
          width:min(100%,1220px);
          margin:${isMobile ? "-52px auto 0" : "-82px auto 0"};
          padding:${isMobile ? "0 14px 54px" : "0 20px 74px"};
          position:relative;
          z-index:4;
        }

        .info-grid{
          display:grid;
          grid-template-columns:${isMobile ? "1fr" : "repeat(3,1fr)"};
          gap:${isMobile ? "14px" : "20px"};
          margin-bottom:20px;
        }

        .info-card,
        .main-card,
        .details-card{
          background:rgba(255,255,255,.94);
          border:1px solid rgba(226,232,240,.95);
          box-shadow:0 24px 65px rgba(15,23,42,.10);
          backdrop-filter:blur(12px);
          -webkit-backdrop-filter:blur(12px);
        }

        .info-card{
          border-radius:${isMobile ? "22px" : "28px"};
          padding:${isMobile ? "18px" : "22px"};
        }

        .info-icon{
          width:56px;
          height:56px;
          border-radius:18px;
          display:grid;
          place-items:center;
          background:linear-gradient(135deg,#eff6ff,#dbeafe);
          font-size:24px;
          margin-bottom:14px;
          box-shadow:0 12px 28px rgba(37,99,235,.12);
        }

        .info-card small{
          display:block;
          color:#64748b;
          font-size:12px;
          font-weight:900;
          text-transform:uppercase;
          letter-spacing:.06em;
          margin-bottom:7px;
        }

        .info-card h3{
          margin:0 0 10px;
          color:#0f172a;
          font-size:${isMobile ? "21px" : "24px"};
          line-height:1.15;
          letter-spacing:-.035em;
          font-weight:950;
          word-break:break-word;
        }

        .info-card p{
          margin:0 0 16px;
          color:#475569;
          font-size:14px;
          line-height:1.7;
        }

        .mini-btn{
          min-height:42px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:0 16px;
          border-radius:999px;
          background:#eff6ff;
          color:#1d4ed8;
          border:1px solid #bfdbfe;
          text-decoration:none;
          font-size:14px;
          font-weight:900;
        }

        .mini-btn.primary{
          background:linear-gradient(135deg,#2563eb,#60a5fa);
          color:#fff;
          border:0;
          box-shadow:0 14px 30px rgba(37,99,235,.22);
        }

        .contact-main-grid{
          display:grid;
          grid-template-columns:${isMobile ? "1fr" : "1.15fr .85fr"};
          gap:${isMobile ? "14px" : "20px"};
        }

        .main-card,
        .details-card{
          border-radius:${isMobile ? "24px" : "32px"};
          padding:${isMobile ? "22px" : "30px"};
        }

        .main-card-top{
          display:flex;
          align-items:center;
          gap:14px;
          margin-bottom:22px;
        }

        .main-logo{
          width:64px;
          height:64px;
          border-radius:20px;
          display:grid;
          place-items:center;
          background:linear-gradient(135deg,#eff6ff,#dbeafe);
          border:1px solid #bfdbfe;
          overflow:hidden;
          box-shadow:0 16px 34px rgba(37,99,235,.16);
        }

        .main-logo img{
          width:82%;
          height:82%;
          object-fit:contain;
        }

        .main-card-top span{
          display:block;
          color:#2563eb;
          font-size:12px;
          font-weight:950;
          text-transform:uppercase;
          letter-spacing:.06em;
        }

        .main-card-top strong{
          display:block;
          margin-top:4px;
          color:#07142d;
          font-size:25px;
          line-height:1;
          letter-spacing:-.04em;
          font-weight:950;
        }

        .main-card h2{
          margin:0 0 14px;
          color:#07142d;
          font-size:${isMobile ? "30px" : "44px"};
          line-height:1.03;
          letter-spacing:-.052em;
          font-weight:950;
        }

        .main-card p{
          margin:0 0 24px;
          max-width:760px;
          color:#475569;
          line-height:1.82;
          font-size:${isMobile ? "15px" : "16px"};
        }

        .main-actions{
          display:flex;
          flex-wrap:wrap;
          gap:12px;
        }

        .main-actions a.light{
          background:#fff;
          color:#07142d;
          border:1px solid #dbeafe;
          box-shadow:0 12px 26px rgba(15,23,42,.06);
        }

        .details-card h3{
          margin:0 0 20px;
          color:#07142d;
          font-size:18px;
          font-weight:950;
          text-transform:uppercase;
          letter-spacing:.045em;
        }

        .contact-row{
          display:grid;
          gap:7px;
        }

        .contact-row span{
          color:#64748b;
          font-size:12px;
          font-weight:950;
          text-transform:uppercase;
          letter-spacing:.06em;
        }

        .contact-row strong{
          color:#0f172a;
          font-size:${isMobile ? "18px" : "20px"};
          font-weight:900;
          line-height:1.3;
          word-break:break-word;
        }

        .divider{
          height:1px;
          background:#e2e8f0;
          margin:18px 0;
        }

        .quick-box{
          margin-top:24px;
          padding:17px;
          border-radius:20px;
          background:linear-gradient(135deg,#eff6ff,#dbeafe);
          border:1px solid #bfdbfe;
        }

        .quick-box strong{
          display:block;
          color:#1d4ed8;
          font-size:14px;
          font-weight:950;
          margin-bottom:7px;
        }

        .quick-box p{
          margin:0;
          color:#334155;
          line-height:1.7;
          font-size:14px;
        }

        @media(max-width:620px){
          .hero-logo-card{
            width:100%;
            box-sizing:border-box;
          }

          .hero-actions,
          .main-actions{
            flex-direction:column;
          }

          .hero-actions a,
          .main-actions a{
            width:100%;
            box-sizing:border-box;
          }
        }
      `}</style>
    </div>
  );
}

function InfoCard({ icon, title, value, desc, action }) {
  return (
    <div className="info-card">
      <div className="info-icon">{icon}</div>
      <small>{title}</small>
      <h3>{value}</h3>
      <p>{desc}</p>
      {action}
    </div>
  );
}

function ContactRow({ label, value }) {
  return (
    <>
      <div className="contact-row">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="divider" />
    </>
  );
}