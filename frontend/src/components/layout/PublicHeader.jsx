import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import NewsMenuDropdown from "../news/NewsMenuDropdown";

const logoUrl =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776285534/ChatGPT_Image_Apr_15_2026_10_38_27_PM_bf2mf9.png";

const navItems = [
  { to: "/", label: "Ballina", end: true },
  { to: "/kategori/patundshmeri", label: "Patundshmëri" },
  { to: "/kategori/automjete", label: "Automjete" },
  { to: "/kategori/konkurse-pune", label: "Konkurse Pune" },
  { to: "/kategori/oferta", label: "Oferta" },
  { to: "/reklamo-me-ne", label: "Reklamo më ne" }
];

const mobileNewsItems = [
  { to: "/kategori/lajme", label: "Të gjitha lajmet", desc: "Publikimet e fundit" },
  { to: "/kategori/lajme-vendi", label: "Vendi", desc: "Lajme nga vendi" },
  { to: "/kategori/lajme-rajoni", label: "Rajoni", desc: "Zhvillime nga rajoni" },
  { to: "/kategori/lajme-bota", label: "Bota", desc: "Ngjarje ndërkombëtare" }
];

export default function PublicHeader() {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setNewsOpen(false);
  }, [location.pathname]);

  const isMobile = screenWidth <= 980;

  return (
    <header className={`public-header ${scrolled ? "is-scrolled" : "is-top"}`}>
      <div className="header-shell">
        <div className="header-inner">
          <Link to="/" className="brand-link">
            <div className="brand-logo-box">
              <img src={logoUrl} alt="Publiko Logo" className="brand-logo" />
            </div>

            <div className="brand-text">
              <div className="brand-title">
                Publiko<span>.biz</span>
              </div>
              <div className="brand-subtitle">Portal informativ & shpallje</div>
            </div>
          </Link>

          {isMobile ? (
            <button
              type="button"
              className={`menu-button ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Mbyll menunë" : "Hap menunë"}
            >
              <span />
              <span />
              <span />
            </button>
          ) : (
            <nav className="desktop-nav">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Ballina
              </NavLink>

              <NewsMenuDropdown />

              {navItems.slice(1).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""} ${
                      item.to === "/kategori/oferta" ? "offer-link" : ""
                    } ${item.to === "/reklamo-me-ne" ? "advertise-link" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}

          {!isMobile && (
            <a href="tel:044000000" className="header-call">
              <span>📞</span>
              Kontakt
            </a>
          )}
        </div>

        {isMobile && (
          <div className={`mobile-menu-wrap ${menuOpen ? "show" : ""}`}>
            <div className="mobile-menu">
              <nav className="mobile-nav">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `mobile-link ${isActive ? "active" : ""}`
                  }
                >
                  Ballina
                </NavLink>

                <button
                  type="button"
                  className="mobile-link news-button"
                  onClick={() => setNewsOpen(true)}
                >
                  <span>Lajme</span>
                  <b>Hap kategoritë</b>
                </button>

                {navItems.slice(1).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `mobile-link ${isActive ? "active" : ""} ${
                        item.to === "/kategori/oferta" ? "offer-link" : ""
                      } ${
                        item.to === "/reklamo-me-ne" ? "advertise-link" : ""
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <a href="tel:044000000" className="mobile-call">
                <span>📞</span>
                Kontakto tani
              </a>
            </div>
          </div>
        )}
      </div>

      {isMobile && newsOpen && (
        <div className="news-modal-backdrop" onClick={() => setNewsOpen(false)}>
          <div className="news-modal" onClick={(e) => e.stopPropagation()}>
            <div className="news-modal-head">
              <div>
                <span>Lajme</span>
                <h3>Zgjidh kategorinë</h3>
              </div>

              <button
                type="button"
                onClick={() => setNewsOpen(false)}
                aria-label="Mbyll dritaren"
              >
                ×
              </button>
            </div>

            <div className="news-modal-grid">
              {mobileNewsItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `news-modal-link ${isActive ? "active" : ""}`
                  }
                >
                  <strong>{item.label}</strong>
                  <small>{item.desc}</small>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .public-header{
          position:sticky;
          top:0;
          z-index:1100;
          transition:background .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .public-header.is-top{
          background:rgba(2,6,23,.08);
          backdrop-filter:blur(4px);
          -webkit-backdrop-filter:blur(4px);
          border-bottom:1px solid rgba(255,255,255,.08);
          box-shadow:none;
        }

        .public-header.is-scrolled{
          background:rgba(255,255,255,.94);
          backdrop-filter:blur(22px);
          -webkit-backdrop-filter:blur(22px);
          border-bottom:1px solid rgba(148,163,184,.18);
          box-shadow:0 16px 42px rgba(15,23,42,.07);
        }

        .header-shell{
          max-width:1500px;
          margin:0 auto;
          padding:12px 18px;
        }
 .brand-logo-box{
  animation:logoReveal .9s cubic-bezier(.22,1,.36,1) forwards;
  transform:scale(.85) rotate(-8deg);
  opacity:0;
}

.brand-logo{
  animation:logoFloat 6s ease-in-out infinite;
}

@keyframes logoReveal{
  0%{
    opacity:0;
    transform:scale(.7) rotate(-12deg);
    filter:blur(10px);
  }
  60%{
    opacity:1;
    transform:scale(1.08) rotate(2deg);
    filter:blur(2px);
  }
  100%{
    opacity:1;
    transform:scale(1) rotate(0);
    filter:blur(0);
  }
}

@keyframes logoFloat{
  0%,100%{
    transform:translateY(0);
  }
  50%{
    transform:translateY(-4px);
  }
}
  .brand-logo-box::after{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  background:radial-gradient(circle, rgba(14,165,233,.45), transparent 70%);
  opacity:.35;
  animation:logoGlow 3.5s ease-in-out infinite;
  pointer-events:none;
}

@keyframes logoGlow{
  0%,100%{
    opacity:.25;
  }
  50%{
    opacity:.6;
  }
}
  .brand-link:hover .brand-logo-box{
  transform:scale(1.08) rotate(3deg);
  box-shadow:0 25px 60px rgba(14,165,233,.4);
}

.brand-link:hover .brand-logo{
  transform:scale(1.05);
}
  .brand-title{
  animation:titleFade .8s ease forwards;
  opacity:0;
  transform:translateY(10px);
  animation-delay:.2s;
}

.brand-subtitle{
  animation:titleFade .8s ease forwards;
  opacity:0;
  transform:translateY(10px);
  animation-delay:.35s;
}

@keyframes titleFade{
  to{
    opacity:1;
    transform:translateY(0);
  }
}
  .brand-logo-box{
  transition:all .35s cubic-bezier(.22,1,.36,1);
}

.brand-logo{
  transition:all .35s cubic-bezier(.22,1,.36,1);
}

.public-header.is-scrolled .brand-logo-box{
  width:44px;
  height:44px;
  border-radius:14px;
  box-shadow:0 10px 22px rgba(15,23,42,.15);
}

.public-header.is-scrolled .brand-logo{
  transform:scale(.9);
}
  .brand-title{
  transition:all .35s ease;
}

.brand-subtitle{
  transition:all .35s ease;
}

.public-header.is-scrolled .brand-title{
  font-size:20px;
}

.public-header.is-scrolled .brand-subtitle{
  font-size:10px;
  opacity:.7;
}
  .public-header{
  transition:
    background .35s ease,
    box-shadow .35s ease,
    backdrop-filter .35s ease,
    border-color .35s ease;
}
    .public-header.is-top{
  background:rgba(2,6,23,.08);
  backdrop-filter:blur(6px);
}

.public-header.is-scrolled{
  background:rgba(255,255,255,.96);
  backdrop-filter:blur(22px);
}
  
        .header-inner{
          min-height:66px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:18px;
        }

        .brand-link{
          display:flex;
          align-items:center;
          gap:12px;
          text-decoration:none;
          flex-shrink:0;
          min-width:0;
        }

        .brand-logo-box{
          width:56px;
          height:56px;
          border-radius:20px;
          background:linear-gradient(135deg,#020617,#0f3fb8 55%,#0ea5e9);
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          border:1px solid rgba(255,255,255,.55);
          box-shadow:0 18px 40px rgba(37,99,235,.28);
        }

        .brand-logo{
          width:78%;
          height:78%;
          object-fit:contain;
        }

        .brand-title{
          font-size:25px;
          font-weight:950;
          letter-spacing:-.06em;
          line-height:1;
          color:#0b1220;
          transition:color .25s ease;
        }

        .brand-title span{
          color:#0b63f6;
        }

        .brand-subtitle{
          margin-top:6px;
          font-size:12px;
          font-weight:800;
          color:#475569;
          white-space:nowrap;
          transition:color .25s ease;
        }

        .public-header.is-top .brand-title{
          color:#ffffff;
          text-shadow:0 3px 16px rgba(0,0,0,.35);
        }

        .public-header.is-top .brand-title span{
          color:#bfdbfe;
        }

        .public-header.is-top .brand-subtitle{
          color:rgba(255,255,255,.82);
        }

        .desktop-nav{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:6px;
          padding:7px;
          border-radius:999px;
          background:#f8fbff;
          border:1px solid #dbeafe;
          box-shadow:0 16px 36px rgba(15,23,42,.045);
          transition:.25s ease;
        }

        .public-header.is-top .desktop-nav{
          background:rgba(255,255,255,.07);
          border-color:rgba(255,255,255,.12);
          box-shadow:none;
          backdrop-filter:blur(8px);
        }

        .nav-link{
          text-decoration:none;
          color:#334155;
          font-size:14px;
          font-weight:900;
          padding:12px 15px;
          border-radius:999px;
          border:1px solid transparent;
          transition:.2s ease;
          white-space:nowrap;
        }

        .public-header.is-top .nav-link{
          color:rgba(255,255,255,.92);
        }

        .nav-link:hover{
          color:#0b63f6;
          background:#eaf3ff;
        }

        .public-header.is-top .nav-link:hover{
          color:#fff;
          background:rgba(255,255,255,.14);
        }

        .nav-link.active{
          color:#082f6f;
          background:linear-gradient(135deg,#dbeafe,#bfdbfe);
          border-color:#93c5fd;
          box-shadow:0 12px 24px rgba(37,99,235,.12);
        }

        .public-header.is-top .nav-link.active{
          color:#fff;
          background:rgba(255,255,255,.16);
          border-color:rgba(255,255,255,.22);
          box-shadow:none;
        }

        .nav-link.offer-link{
          color:#065f46;
          background:#ecfdf5;
          border-color:#a7f3d0;
        }

        .public-header.is-top .nav-link.offer-link{
          color:#064e3b;
          background:#d1fae5;
          border-color:#86efac;
        }

        .nav-link.advertise-link{
          color:#fff;
          background:linear-gradient(135deg,#0b63f6,#0284c7);
          box-shadow:0 14px 30px rgba(14,99,246,.26);
        }

        .header-call{
          height:48px;
          padding:0 20px;
          border-radius:999px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:9px;
          text-decoration:none;
          color:#0f172a;
          font-size:14px;
          font-weight:950;
          background:#fff;
          border:1px solid #bfdbfe;
          box-shadow:0 14px 28px rgba(15,23,42,.07);
          transition:.2s ease;
          white-space:nowrap;
        }

        .public-header.is-top .header-call{
          color:#fff;
          background:rgba(255,255,255,.08);
          border-color:rgba(255,255,255,.22);
          box-shadow:none;
          backdrop-filter:blur(8px);
        }

        .menu-button{
          width:52px;
          height:52px;
          border-radius:18px;
          border:1px solid #bfdbfe;
          background:#fff;
          box-shadow:0 14px 32px rgba(15,23,42,.08);
          display:flex;
          align-items:center;
          justify-content:center;
          flex-direction:column;
          gap:5px;
          cursor:pointer;
          transition:.25s ease;
          flex-shrink:0;
        }

        .public-header.is-top .menu-button{
          background:rgba(255,255,255,.12);
          border-color:rgba(255,255,255,.24);
          box-shadow:none;
          backdrop-filter:blur(8px);
        }

        .menu-button span{
          width:21px;
          height:2px;
          border-radius:999px;
          background:#0f172a;
          transition:.25s ease;
        }

        .public-header.is-top .menu-button span{
          background:#fff;
        }

        .menu-button.open{
          background:#eff6ff;
          border-color:#60a5fa;
        }

        .menu-button.open span:nth-child(1){
          transform:translateY(7px) rotate(45deg);
        }

        .menu-button.open span:nth-child(2){
          opacity:0;
          transform:scaleX(.3);
        }

        .menu-button.open span:nth-child(3){
          transform:translateY(-7px) rotate(-45deg);
        }

        .mobile-menu-wrap{
          max-height:0;
          opacity:0;
          overflow:hidden;
          transform:translateY(-8px);
          transition:max-height .4s ease, opacity .25s ease, transform .3s ease, margin-top .25s ease;
          pointer-events:none;
        }

        .mobile-menu-wrap.show{
          max-height:920px;
          opacity:1;
          margin-top:12px;
          transform:translateY(0);
          pointer-events:auto;
        }

        .mobile-menu{
          padding:14px;
          border-radius:28px;
          background:#ffffff;
          border:1px solid #dbeafe;
          box-shadow:0 24px 60px rgba(15,23,42,.14);
        }

        .mobile-nav{
          display:grid;
          grid-template-columns:1fr;
          gap:10px;
        }

        .mobile-link{
          text-decoration:none;
          color:#172033;
          font-size:15px;
          font-weight:950;
          line-height:1.25;
          padding:16px;
          border-radius:18px;
          background:#fff;
          border:1px solid #dbe4f0;
          box-shadow:0 8px 18px rgba(15,23,42,.045);
          min-height:56px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          box-sizing:border-box;
        }

        button.mobile-link{
          width:100%;
          cursor:pointer;
          font-family:inherit;
          text-align:left;
        }

        .news-button{
          background:linear-gradient(135deg,#eff6ff,#dbeafe);
          border-color:#93c5fd;
          color:#082f6f;
        }

        .news-button b{
          font-size:12px;
          color:#2563eb;
          font-weight:900;
        }

        .mobile-link.active{
          color:#082f6f;
          background:linear-gradient(135deg,#dbeafe,#bfdbfe);
          border-color:#60a5fa;
        }

        .mobile-link.offer-link{
          color:#065f46;
          background:#ecfdf5;
          border-color:#86efac;
        }

        .mobile-link.advertise-link{
          color:#fff;
          background:linear-gradient(135deg,#0b63f6,#0284c7);
          border-color:#38bdf8;
          box-shadow:0 14px 28px rgba(14,99,246,.24);
        }

        .mobile-call{
          margin-top:14px;
          min-height:54px;
          border-radius:18px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:9px;
          text-decoration:none;
          color:#fff;
          font-size:16px;
          font-weight:950;
          background:linear-gradient(135deg,#0b63f6,#0284c7);
          box-shadow:0 16px 32px rgba(14,99,246,.26);
        }

        .news-modal-backdrop{
          position:fixed;
          inset:0;
          z-index:2000;
          background:rgba(2,6,23,.56);
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
          display:flex;
          align-items:flex-end;
          justify-content:center;
          padding:14px;
        }

        .news-modal{
          width:100%;
          max-width:520px;
          max-height:88vh;
          overflow:auto;
          border-radius:30px;
          background:#fff;
          border:1px solid #dbeafe;
          box-shadow:0 30px 90px rgba(2,6,23,.34);
          padding:18px;
          animation:modalUp .25s ease;
        }

        @keyframes modalUp{
          from{opacity:0; transform:translateY(18px) scale(.98)}
          to{opacity:1; transform:translateY(0) scale(1)}
        }

        .news-modal-head{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:14px;
          margin-bottom:16px;
        }

        .news-modal-head span{
          color:#2563eb;
          font-size:12px;
          font-weight:950;
          text-transform:uppercase;
          letter-spacing:.08em;
        }

        .news-modal-head h3{
          margin:6px 0 0;
          color:#0f172a;
          font-size:24px;
          font-weight:950;
          letter-spacing:-.04em;
        }

        .news-modal-head button{
          width:44px;
          height:44px;
          border-radius:16px;
          border:1px solid #dbeafe;
          background:#eff6ff;
          color:#0f172a;
          font-size:30px;
          line-height:1;
          cursor:pointer;
        }

        .news-modal-grid{
          display:grid;
          gap:10px;
        }

        .news-modal-link{
          text-decoration:none;
          padding:16px;
          border-radius:20px;
          background:#f8fbff;
          border:1px solid #dbeafe;
          display:flex;
          flex-direction:column;
          gap:6px;
          transition:.2s ease;
        }

        .news-modal-link strong{
          color:#0f172a;
          font-size:16px;
          font-weight:950;
        }

        .news-modal-link small{
          color:#64748b;
          font-size:13px;
          font-weight:800;
        }

        .news-modal-link.active,
        .news-modal-link:hover{
          background:linear-gradient(135deg,#dbeafe,#bfdbfe);
          border-color:#60a5fa;
        }

        @media(max-width:980px){
          .header-shell{padding:10px 12px}
          .header-inner{min-height:60px}
          .brand-logo-box{width:50px;height:50px;border-radius:18px}
          .brand-title{font-size:23px}
          .brand-subtitle{font-size:11px}
        }

        @media(max-width:520px){
          .header-shell{padding:9px 10px}
          .brand-link{gap:10px}
          .brand-logo-box{width:46px;height:46px;border-radius:16px}
          .brand-title{font-size:21px}
          .brand-subtitle{font-size:10.5px;max-width:160px;overflow:hidden;text-overflow:ellipsis}
          .menu-button{width:48px;height:48px;border-radius:16px}
          .mobile-menu{padding:12px;border-radius:24px}
        }

        @media(max-width:370px){
          .brand-subtitle{display:none}
          .brand-title{font-size:20px}
        }
      `}</style>
    </header>
  );
}