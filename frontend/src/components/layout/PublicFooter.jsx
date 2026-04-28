import React from "react";
import { Link } from "react-router-dom";

const logoUrl =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776969027/PUBLIKO_LOGO_pomulk.png";

const poweredLogoUrl =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776283100/ChatGPT_Image_Apr_15_2026_09_58_09_PM_vsc72w.png";

const footerVideoUrl =
  "https://res.cloudinary.com/dbz7fjuty/video/upload/v1777172527/7020027_Abstract_Nebula_3840x2160_ehdkq2.mp4";

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
          <path d="M0,150 C220,75 430,80 650,125 C850,165 1020,125 1165,82 C1300,42 1400,95 1440,68 L1440,220 L0,220 Z" />
        </svg>
      </div>

      <video className="footer-bg-video" autoPlay muted loop playsInline>
        <source src={footerVideoUrl} type="video/mp4" />
      </video>

      <div className="footer-overlay" />
      <div className="footer-grid-lines" />
      <div className="footer-orb footer-orb-one" />
      <div className="footer-orb footer-orb-two" />

      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-card footer-brand-card">
            <div className="footer-brand-head">
              <div className="footer-logo-box">
                <img src={logoUrl} alt="Publiko Logo" />
              </div>

              <div>
                <div className="footer-brand-title">
                  Publiko<span>.biz</span>
                </div>
                <div className="footer-brand-subtitle">
                  Portal informativ & shpallje
                </div>
              </div>
            </div>

            <p className="footer-description">
              Platformë moderne për lajme, patundshmëri, automjete dhe konkurse
              pune — e ndërtuar për prezencë serioze, navigim të qartë dhe
              publikime profesionale.
            </p>

            <div className="footer-contact-chips">
              <a href="tel:044000000">📞 044 000 000</a>
              <a href="mailto:ihgkosova@gmail.com">✉️ ihgkosova@gmail.com</a>
            </div>
          </div>

          <div className="footer-card">
            <h4>Navigimi & Kategoritë</h4>

            <div className="footer-links-grid">
              <FooterLink to="/">Ballina</FooterLink>
              <FooterLink to="/kategori/lajme">Lajme</FooterLink>
              <FooterLink to="/kategori/patundshmeri">Patundshmëri</FooterLink>
              <FooterLink to="/kategori/automjete">Automjete</FooterLink>
              <FooterLink to="/kategori/konkurse-pune">Konkurse Pune</FooterLink>
              <FooterLink to="/kategori/oferta">Oferta</FooterLink>
              <FooterLink to="/kategori/vendi">Vendi</FooterLink>
              <FooterLink to="/kategori/rajoni">Rajoni</FooterLink>
              <FooterLink to="/kategori/bota">Bota</FooterLink>
              <FooterLink to="/reklamo-me-ne">Reklamo më ne</FooterLink>
              <FooterLink to="/kontakti">Kontakti</FooterLink>

              <div className="footer-legal-block">
                <h4>Politikat</h4>
                <FooterLink to="/privacy-policy">Politika e Privatësisë</FooterLink>
              </div>
            </div>
          </div>

          <div className="footer-card">
            <h4>Na kontaktoni</h4>

            <div className="footer-social-list">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <span>f</span>
                <b>Facebook</b>
              </a>

              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <span>◎</span>
                <b>Instagram</b>
              </a>

              <a href="mailto:ihgkosova@gmail.com">
                <span>✉</span>
                <b>ihgkosova@gmail.com</b>
              </a>
            </div>

            <div className="footer-location-box">
              <strong>Lokacioni</strong>
              <small>Prishtinë, Kosovë</small>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 Publiko.biz. Të gjitha të drejtat e rezervuara.</div>

          <div className="footer-powered">
            <span className="powered-label">POWERED BY</span>

            <img src={poweredLogoUrl} alt="Powered by" />

            <span className="powered-name">Made by Bardh Dajaku</span>
          </div>
        </div>
      </div>

      <style>{`
        .public-footer{
          margin-top:150px;
          padding-top:128px;
          padding-bottom:0;
          color:#fff;
          position:relative;
          overflow:hidden;
          background:#030712;
          isolation:isolate;
        }

        .footer-wave{
          position:absolute;
          top:-1px;
          left:0;
          width:100%;
          height:155px;
          z-index:3;
          pointer-events:none;
          transform:translateY(-99%);
        }

        .footer-wave svg{
          width:100%;
          height:100%;
          display:block;
        }

        .footer-wave path{
          fill:#030712;
          filter:
            drop-shadow(0 -18px 38px rgba(0,0,0,.50))
            drop-shadow(0 -6px 18px rgba(14,165,233,.20));
        }

        .footer-bg-video{
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
          z-index:-6;
          opacity:.25;
          pointer-events:none;
          transform:scale(1.05);
        }

        .footer-overlay{
          position:absolute;
          inset:0;
          z-index:-5;
          background:
            linear-gradient(180deg, rgba(2,6,23,.96) 0%, rgba(2,6,23,.88) 46%, rgba(2,6,23,.99) 100%),
            radial-gradient(circle at 78% 18%, rgba(14,165,233,.30), transparent 34%),
            radial-gradient(circle at 10% 90%, rgba(37,99,235,.24), transparent 38%);
        }

        .footer-grid-lines{
          position:absolute;
          inset:0;
          opacity:.16;
          background:
            linear-gradient(120deg, rgba(147,197,253,.10) 1px, transparent 1px),
            linear-gradient(300deg, rgba(56,189,248,.075) 1px, transparent 1px);
          background-size:58px 58px;
          z-index:-4;
        }

        .footer-orb{
          position:absolute;
          border-radius:999px;
          pointer-events:none;
          filter:blur(30px);
          z-index:-2;
        }

        .footer-orb-one{
          width:340px;
          height:340px;
          top:-135px;
          right:-80px;
          background:rgba(59,130,246,.22);
        }

        .footer-orb-two{
          width:390px;
          height:390px;
          bottom:-170px;
          left:-110px;
          background:rgba(14,165,233,.16);
        }

        .footer-container{
          max-width:1320px;
          margin:0 auto;
          padding:36px 20px 28px;
          position:relative;
          z-index:4;
        }

        .footer-grid{
          display:grid;
          grid-template-columns:1.15fr 1fr 1fr;
          gap:18px;
          align-items:stretch;
        }

        .footer-card{
          position:relative;
          overflow:hidden;
          padding:20px;
          min-height:265px;
          border-radius:24px;
          background:linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.04));
          border:1px solid rgba(255,255,255,.14);
          box-shadow:0 24px 60px rgba(0,0,0,.22);
          backdrop-filter:blur(14px);
          -webkit-backdrop-filter:blur(14px);
          box-sizing:border-box;
          transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }

        .footer-card::before{
          content:"";
          position:absolute;
          inset:0;
          background:radial-gradient(circle at 15% 0%, rgba(255,255,255,.13), transparent 32%);
          pointer-events:none;
        }

        .footer-card:hover{
          transform:translateY(-4px);
          border-color:rgba(147,197,253,.34);
          box-shadow:0 30px 78px rgba(0,0,0,.28);
        }

        .footer-brand-head{
          display:flex;
          align-items:center;
          gap:14px;
          margin-bottom:15px;
          position:relative;
          z-index:2;
        }

        .footer-logo-box{
          width:62px;
          height:62px;
          border-radius:20px;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          flex-shrink:0;
          position:relative;
          background:linear-gradient(135deg, rgba(255,255,255,.18), rgba(14,165,233,.18));
          border:1px solid rgba(255,255,255,.20);
          box-shadow:0 18px 42px rgba(37,99,235,.34);
          animation:footerLogoFloat 6s ease-in-out infinite;
        }

        .footer-logo-box::after{
          content:"";
          position:absolute;
          inset:-8px;
          border-radius:inherit;
          background:radial-gradient(circle, rgba(14,165,233,.46), transparent 70%);
          opacity:.36;
          z-index:-1;
          animation:footerGlow 3.6s ease-in-out infinite;
        }

        .footer-logo-box::before{
          content:"";
          position:absolute;
          top:0;
          left:-120%;
          width:70%;
          height:100%;
          background:linear-gradient(120deg, transparent, rgba(255,255,255,.42), transparent);
          animation:footerShine 5.2s ease-in-out infinite;
        }

        .footer-logo-box img{
          width:82%;
          height:82%;
          object-fit:contain;
          position:relative;
          z-index:2;
          transition:transform .35s cubic-bezier(.22,1,.36,1);
        }

        .footer-logo-box:hover img{
          transform:scale(1.08) rotate(2deg);
        }

        .footer-brand-title{
          font-size:28px;
          font-weight:950;
          letter-spacing:-.055em;
          line-height:1;
        }

        .footer-brand-title span{
          color:#7dd3fc;
        }

        .footer-brand-subtitle{
          margin-top:5px;
          color:#bfdbfe;
          font-size:12px;
          font-weight:800;
        }

        .footer-description{
          position:relative;
          z-index:2;
          margin:0;
          color:#dbeafe;
          line-height:1.8;
          font-size:14px;
          font-weight:600;
        }

        .footer-contact-chips{
          position:relative;
          z-index:2;
          display:flex;
          flex-wrap:wrap;
          gap:10px;
          margin-top:18px;
        }

        .footer-contact-chips a{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          padding:10px 14px;
          border-radius:999px;
          background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.13);
          color:#fff;
          text-decoration:none;
          font-size:13px;
          font-weight:850;
          box-shadow:0 12px 24px rgba(0,0,0,.12);
          transition:.2s ease;
        }

        .footer-contact-chips a:hover{
          background:rgba(14,165,233,.16);
          border-color:rgba(147,197,253,.32);
          transform:translateY(-2px);
        }

        .footer-card h4{
          position:relative;
          z-index:2;
          margin:0 0 16px;
          color:#fff;
          font-size:16px;
          line-height:1.3;
          font-weight:950;
          letter-spacing:-.02em;
        }

        .footer-links-grid{
          position:relative;
          z-index:2;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:2px 18px;
        }

        .footer-legal-block{
          grid-column:1 / -1;
          margin-top:12px;
          padding-top:14px;
          border-top:1px solid rgba(255,255,255,.12);
        }

        .footer-legal-block h4{
          margin:0 0 10px;
          font-size:13px;
          color:#93c5fd;
          text-transform:uppercase;
          letter-spacing:.08em;
        }

        .footer-link-premium{
          position:relative;
          display:block;
          color:#dbeafe;
          text-decoration:none;
          margin-bottom:10px;
          font-size:14px;
          line-height:1.5;
          font-weight:750;
          word-break:break-word;
          transition:.22s ease;
          padding-left:13px;
        }

        .footer-link-premium::before{
          content:"›";
          position:absolute;
          left:0;
          top:0;
          color:#38bdf8;
          font-size:18px;
          line-height:1.2;
          font-weight:950;
        }

        .footer-link-premium:hover{
          color:#fff;
          transform:translateX(5px);
        }

        .footer-link-premium::after{
          content:"";
          position:absolute;
          left:13px;
          bottom:-2px;
          width:0;
          height:1px;
          background:linear-gradient(90deg,#38bdf8,transparent);
          transition:width .22s ease;
        }

        .footer-link-premium:hover::after{
          width:34px;
        }

        .footer-social-list{
          position:relative;
          z-index:2;
          display:grid;
          gap:10px;
        }

        .footer-social-list a{
          display:flex;
          align-items:center;
          gap:12px;
          padding:12px 14px;
          border-radius:16px;
          background:rgba(255,255,255,.065);
          border:1px solid rgba(255,255,255,.11);
          color:#fff;
          text-decoration:none;
          font-size:14px;
          transition:.22s ease;
        }

        .footer-social-list a:hover{
          background:rgba(255,255,255,.11);
          border-color:rgba(147,197,253,.30);
          transform:translateY(-2px);
        }

        .footer-social-list span{
          width:38px;
          height:38px;
          min-width:38px;
          border-radius:999px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(135deg, rgba(14,165,233,.28), rgba(37,99,235,.24));
          border:1px solid rgba(255,255,255,.16);
          color:#fff;
          font-size:15px;
          font-weight:950;
          box-shadow:0 12px 28px rgba(14,165,233,.22);
        }

        .footer-social-list b{
          font-weight:850;
          min-width:0;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .footer-location-box{
          position:relative;
          z-index:2;
          margin-top:16px;
          padding:15px;
          border-radius:18px;
          background:rgba(255,255,255,.065);
          border:1px solid rgba(255,255,255,.11);
        }

        .footer-location-box strong{
          display:block;
          color:#fff;
          font-size:14px;
          font-weight:950;
          margin-bottom:7px;
        }

        .footer-location-box small{
          color:#dbeafe;
          font-size:13px;
          line-height:1.6;
          font-weight:700;
        }

        .footer-bottom{
          margin-top:22px;
          padding-top:17px;
          border-top:1px solid rgba(255,255,255,.13);
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:14px;
          color:#bfdbfe;
          font-size:13px;
          line-height:1.6;
        }

        .footer-powered{
          display:flex;
          flex-direction:column;
          align-items:flex-end;
          gap:6px;
        }

        .powered-label{
          font-size:10px;
          letter-spacing:.18em;
          color:rgba(203,213,225,.45);
          font-weight:800;
        }

        .footer-powered img{
          width:52px;
          height:52px;
          object-fit:contain;
          opacity:.96;
          transition:all .35s ease;
          filter:drop-shadow(0 10px 22px rgba(14,165,233,.18));
        }

        .footer-powered img:hover{
          transform:scale(1.14);
          opacity:1;
        }

        .powered-name{
          font-size:11px;
          color:rgba(203,213,225,.36);
          font-weight:700;
          letter-spacing:.02em;
          transition:.25s ease;
        }

        .footer-powered:hover .powered-name{
          color:rgba(203,213,225,.76);
        }

        @keyframes footerLogoFloat{
          0%,100%{transform:translateY(0) scale(1);}
          50%{transform:translateY(-6px) scale(1.03);}
        }

        @keyframes footerGlow{
          0%,100%{opacity:.24; transform:scale(1);}
          50%{opacity:.62; transform:scale(1.08);}
        }

        @keyframes footerShine{
          0%{left:-120%;}
          50%,100%{left:140%;}
        }

        @media(max-width:1024px){
          .public-footer{
            margin-top:125px;
            padding-top:88px;
          }

          .footer-wave{
            height:118px;
          }

          .footer-grid{
            grid-template-columns:1fr;
          }

          .footer-card{
            min-height:auto;
          }

          .footer-container{
            padding:34px 16px 22px;
          }
        }

        @media(max-width:640px){
          .public-footer{
            margin-top:95px;
            padding-top:68px;
          }

          .footer-wave{
            height:88px;
          }

          .footer-bg-video{
            opacity:.18;
          }

          .footer-container{
            padding:28px 14px 19px;
          }

          .footer-grid{
            gap:12px;
          }

          .footer-card{
            border-radius:20px;
            padding:16px;
            min-height:auto;
          }

          .footer-card:hover,
          .footer-social-list a:hover,
          .footer-contact-chips a:hover,
          .footer-link-premium:hover{
            transform:none;
          }

          .footer-logo-box{
            width:52px;
            height:52px;
            border-radius:16px;
          }

          .footer-brand-title{
            font-size:24px;
          }

          .footer-description{
            font-size:13px;
          }

          .footer-links-grid{
            grid-template-columns:1fr 1fr;
            gap:0 12px;
          }

          .footer-link-premium{
            font-size:13px;
            margin-bottom:9px;
          }

          .footer-social-list a{
            padding:11px 12px;
          }

          .footer-bottom{
            flex-direction:column;
            align-items:flex-start;
            font-size:12px;
          }

          .footer-powered{
            align-items:flex-start;
          }

          .footer-powered img{
            width:46px;
            height:46px;
          }

          .footer-orb-one{
            width:220px;
            height:220px;
            top:-90px;
            right:-70px;
          }

          .footer-orb-two{
            width:260px;
            height:260px;
            bottom:-120px;
            left:-80px;
          }
        }

        @media(max-width:420px){
          .footer-links-grid{
            grid-template-columns:1fr;
          }

          .footer-contact-chips a{
            width:100%;
            justify-content:flex-start;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="footer-link-premium">
      {children}
    </Link>
  );
}