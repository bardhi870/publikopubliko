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

const MobileIcon = ({ type }) => {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true"
  };

  const paths = {
    home: (
      <>
        <path d="M3.5 10.7L12 3.6L20.5 10.7" />
        <path d="M5.6 9.6V20.2H18.4V9.6" />
        <path d="M9.4 20.2V13.7H14.6V20.2" />
      </>
    ),
    news: (
      <>
        <path d="M5 4.7H16.6C18 4.7 19.1 5.8 19.1 7.2V19.3H6.9C5.9 19.3 5 18.4 5 17.4V4.7Z" />
        <path d="M8.1 8H15.8" />
        <path d="M8.1 11.1H15.8" />
        <path d="M8.1 14.2H13" />
      </>
    ),
    property: (
      <>
        <path d="M4.2 11L12 4.3L19.8 11" />
        <path d="M6.1 9.9V20H17.9V9.9" />
        <path d="M9.2 20V14.2H14.8V20" />
        <path d="M9.2 10.9H14.8" />
      </>
    ),
    car: (
      <>
        <path d="M4.2 13.1L6 8.4C6.4 7.4 7.3 6.8 8.4 6.8H15.6C16.7 6.8 17.6 7.4 18 8.4L19.8 13.1" />
        <path d="M5 13.1H19V17.9H5V13.1Z" />
        <path d="M7 17.9V19.5" />
        <path d="M17 17.9V19.5" />
        <path d="M7.8 15.4H8" />
        <path d="M16 15.4H16.2" />
      </>
    ),
    jobs: (
      <>
        <path d="M8.2 8.2V6.5C8.2 5.6 8.9 4.9 9.8 4.9H14.2C15.1 4.9 15.8 5.6 15.8 6.5V8.2" />
        <path d="M4.8 8.2H19.2V18.7H4.8V8.2Z" />
        <path d="M4.8 12.2H19.2" />
        <path d="M10.4 12.2V13.8H13.6V12.2" />
      </>
    ),
    offers: (
      <>
        <path d="M4.6 12.7L11.4 5.9H18.7V13.2L11.9 20L4.6 12.7Z" />
        <path d="M15.9 8.8H16" />
        <path d="M9.2 13.2L11.1 15.1L15.1 11.1" />
      </>
    ),
    advertise: (
      <>
        <path d="M5 15.1V8.9L14.4 5.2V18.8L5 15.1Z" />
        <path d="M14.4 9.2H17.3C18.6 9.2 19.6 10.2 19.6 11.5V12.5C19.6 13.8 18.6 14.8 17.3 14.8H14.4" />
        <path d="M7.2 15.9L8.2 19.2H10.5L9.4 16.7" />
      </>
    )
  };

  return (
    <svg {...commonProps}>
      {paths[type] || paths.home}
    </svg>
  );
};

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
                  <span className="mobile-link-main">
                    <i className="mobile-link-icon"><MobileIcon type="home" /></i>
                    <span>Ballina</span>
                  </span>
                </NavLink>

                <button
                  type="button"
                  className="mobile-link news-button"
                  onClick={() => setNewsOpen(true)}
                >
                  <span className="mobile-link-main">
                    <i className="mobile-link-icon"><MobileIcon type="news" /></i>
                    <span>Lajme</span>
                  </span>
                  <b>Hap kategoritë</b>
                </button>

                {navItems.slice(1).map((item) => {
                  const iconMap = {
                    "/kategori/patundshmeri": "property",
                    "/kategori/automjete": "car",
                    "/kategori/konkurse-pune": "jobs",
                    "/kategori/oferta": "offers",
                    "/reklamo-me-ne": "advertise"
                  };

                  return (
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
                      <span className="mobile-link-main">
                        <i className="mobile-link-icon"><MobileIcon type={iconMap[item.to]} /></i>
                        <span>{item.label}</span>
                      </span>
                    </NavLink>
                  );
                })}
              </nav>

              <a href="tel:044000000" className="mobile-call">
                <span>📞</span>
                <strong>Kontakto tani</strong>
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
  filter:drop-shadow(0 8px 14px rgba(14,99,246,.22));
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
          position:relative;
          width:56px;
          height:56px;
          border-radius:20px;
          background:
            radial-gradient(circle at 28% 18%,rgba(255,255,255,.35),transparent 34%),
            linear-gradient(135deg,#020617 0%,#0f3fb8 55%,#0ea5e9 100%);
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          border:1px solid rgba(255,255,255,.58);
          box-shadow:
            0 18px 40px rgba(37,99,235,.28),
            inset 0 1px 0 rgba(255,255,255,.22);
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
          position:relative;
          padding:11px;
          border-radius:26px;
          background:
            radial-gradient(circle at 10% 0%, rgba(59,130,246,.16), transparent 34%),
            radial-gradient(circle at 92% 12%, rgba(14,165,233,.14), transparent 34%),
            linear-gradient(180deg,rgba(255,255,255,.86),rgba(248,251,255,.74));
          border:1px solid rgba(191,219,254,.84);
          box-shadow:
            0 26px 70px rgba(15,23,42,.16),
            inset 0 1px 0 rgba(255,255,255,.8);
          backdrop-filter:blur(24px);
          -webkit-backdrop-filter:blur(24px);
          overflow:hidden;
        }

        .mobile-menu::before{
          content:"";
          position:absolute;
          inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.42),transparent 48%);
          pointer-events:none;
        }

        .mobile-nav{
          position:relative;
          z-index:1;
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:8px;
        }

        .mobile-link{
          position:relative;
          min-width:0;
          min-height:62px;
          text-decoration:none;
          color:#172033;
          font-size:12.5px;
          font-weight:950;
          line-height:1.12;
          padding:10px;
          border-radius:18px;
          background:
            linear-gradient(180deg,rgba(255,255,255,.96),rgba(248,251,255,.9));
          border:1px solid rgba(203,213,225,.92);
          box-shadow:
            0 10px 24px rgba(15,23,42,.055),
            inset 0 1px 0 rgba(255,255,255,.9);
          display:flex;
          flex-direction:column;
          align-items:flex-start;
          justify-content:center;
          gap:7px;
          box-sizing:border-box;
          overflow:hidden;
          transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease;
        }

        .mobile-link::after{
          content:"";
          position:absolute;
          right:-18px;
          top:-18px;
          width:58px;
          height:58px;
          border-radius:999px;
          background:radial-gradient(circle,rgba(37,99,235,.12),transparent 68%);
          pointer-events:none;
        }

        .mobile-link-main{
          position:relative;
          z-index:1;
          display:flex;
          align-items:center;
          gap:8px;
          min-width:0;
          width:100%;
        }

        .mobile-link-main span{
          min-width:0;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }

        .mobile-link-icon{
          width:29px;
          height:29px;
          flex:0 0 29px;
          border-radius:12px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          font-style:normal;
          color:#0b63f6;
          background:
            radial-gradient(circle at 28% 18%,rgba(255,255,255,.9),transparent 40%),
            linear-gradient(135deg,#eff6ff,#dbeafe);
          border:1px solid rgba(147,197,253,.88);
          box-shadow:
            0 8px 18px rgba(37,99,235,.12),
            inset 0 1px 0 rgba(255,255,255,.85);
        }

        .mobile-link-icon svg{
          width:17px;
          height:17px;
          stroke:currentColor;
          stroke-width:1.85;
          stroke-linecap:round;
          stroke-linejoin:round;
        }

        .mobile-link:hover,
        .mobile-link:active{
          transform:translateY(-1px) scale(.99);
          border-color:#93c5fd;
          box-shadow:0 14px 30px rgba(37,99,235,.13);
        }

        button.mobile-link{
          width:100%;
          cursor:pointer;
          font-family:inherit;
          text-align:left;
        }

        .news-button{
          background:
            radial-gradient(circle at 15% 0%,rgba(255,255,255,.65),transparent 32%),
            linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);
          border-color:#93c5fd;
          color:#082f6f;
        }

        .news-button b{
          position:relative;
          z-index:1;
          display:inline-flex;
          align-items:center;
          color:#2563eb;
          font-size:9.2px;
          font-weight:950;
          line-height:1;
          white-space:nowrap;
          opacity:.92;
        }

        .mobile-link.active{
          color:#082f6f;
          background:
            radial-gradient(circle at 20% 0%,rgba(255,255,255,.65),transparent 34%),
            linear-gradient(135deg,#dbeafe 0%,#bfdbfe 100%);
          border-color:#60a5fa;
          box-shadow:0 14px 30px rgba(37,99,235,.16);
        }

        .mobile-link.offer-link{
          color:#065f46;
          background:linear-gradient(135deg,#ecfdf5 0%,#dcfce7 100%);
          border-color:#86efac;
        }

        .mobile-link.offer-link .mobile-link-icon{
          color:#047857;
          background:linear-gradient(135deg,#ecfdf5,#bbf7d0);
          border-color:#86efac;
        }

        .mobile-link.advertise-link{
          color:#fff;
          background:
            radial-gradient(circle at 20% 0%,rgba(255,255,255,.30),transparent 34%),
            linear-gradient(135deg,#2563eb 0%,#0284c7 100%);
          border-color:rgba(125,211,252,.75);
          box-shadow:0 15px 32px rgba(37,99,235,.26);
        }

        .mobile-link.advertise-link .mobile-link-icon{
          color:#fff;
          background:rgba(255,255,255,.18);
          border-color:rgba(255,255,255,.28);
          box-shadow:none;
        }

        .mobile-link.advertise-link::after{
          background:radial-gradient(circle,rgba(255,255,255,.25),transparent 68%);
        }

        .mobile-call{
          position:relative;
          z-index:1;
          margin-top:10px;
          min-height:48px;
          border-radius:18px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:9px;
          text-decoration:none;
          color:#fff;
          font-size:14px;
          font-weight:950;
          background:
            radial-gradient(circle at 18% 0%,rgba(255,255,255,.25),transparent 30%),
            linear-gradient(135deg,#0b63f6 0%,#0284c7 100%);
          box-shadow:0 16px 30px rgba(14,99,246,.25);
        }

        .mobile-call strong{
          font-size:14px;
          font-weight:950;
        }

        .news-modal-backdrop{
          position:fixed;
          inset:0;
          z-index:2000;
          background:
            radial-gradient(circle at 20% 0%,rgba(37,99,235,.28),transparent 35%),
            rgba(2,6,23,.62);
          backdrop-filter:blur(16px);
          -webkit-backdrop-filter:blur(16px);
          display:flex;
          align-items:flex-end;
          justify-content:center;
          padding:14px;
        }

        .news-modal{
          position:relative;
          width:100%;
          max-width:520px;
          max-height:88vh;
          overflow:auto;
          border-radius:30px;
          background:
            radial-gradient(circle at 12% 0%, rgba(59,130,246,.17), transparent 36%),
            radial-gradient(circle at 92% 16%, rgba(14,165,233,.13), transparent 34%),
            rgba(255,255,255,.88);
          border:1px solid rgba(191,219,254,.88);
          box-shadow:
            0 32px 95px rgba(2,6,23,.34),
            inset 0 1px 0 rgba(255,255,255,.85);
          padding:16px;
          animation:modalUp .25s ease;
          backdrop-filter:blur(24px);
          -webkit-backdrop-filter:blur(24px);
        }

        .news-modal::before{
          content:"";
          position:absolute;
          left:18px;
          right:18px;
          top:10px;
          height:4px;
          border-radius:999px;
          background:linear-gradient(90deg,transparent,#60a5fa,transparent);
          opacity:.55;
        }

        @keyframes modalUp{
          from{opacity:0; transform:translateY(18px) scale(.98)}
          to{opacity:1; transform:translateY(0) scale(1)}
        }

        .news-modal-head{
          position:relative;
          z-index:1;
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:14px;
          margin:6px 0 14px;
        }

        .news-modal-head span{
          color:#2563eb;
          font-size:11px;
          font-weight:950;
          text-transform:uppercase;
          letter-spacing:.09em;
        }

        .news-modal-head h3{
          margin:5px 0 0;
          color:#0f172a;
          font-size:23px;
          line-height:1;
          font-weight:950;
          letter-spacing:-.045em;
        }

        .news-modal-head button{
          width:42px;
          height:42px;
          border-radius:16px;
          border:1px solid rgba(147,197,253,.85);
          background:rgba(239,246,255,.85);
          color:#0f172a;
          font-size:28px;
          line-height:1;
          cursor:pointer;
          box-shadow:0 10px 22px rgba(15,23,42,.08);
        }

        .news-modal-grid{
          position:relative;
          z-index:1;
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:9px;
        }

        .news-modal-link{
          position:relative;
          min-height:86px;
          text-decoration:none;
          padding:13px;
          border-radius:20px;
          background:
            linear-gradient(180deg,rgba(255,255,255,.96),rgba(248,251,255,.88));
          border:1px solid rgba(203,213,225,.88);
          display:flex;
          flex-direction:column;
          justify-content:center;
          gap:7px;
          transition:.2s ease;
          overflow:hidden;
          box-shadow:0 10px 24px rgba(15,23,42,.055);
        }

        .news-modal-link::after{
          content:"";
          position:absolute;
          right:-18px;
          top:-18px;
          width:60px;
          height:60px;
          border-radius:999px;
          background:radial-gradient(circle,rgba(37,99,235,.12),transparent 68%);
        }

        .news-modal-link strong{
          position:relative;
          z-index:1;
          color:#0f172a;
          font-size:14.5px;
          line-height:1.1;
          font-weight:950;
        }

        .news-modal-link small{
          position:relative;
          z-index:1;
          color:#64748b;
          font-size:11.3px;
          line-height:1.25;
          font-weight:800;
        }

        .news-modal-link.active,
        .news-modal-link:hover{
          transform:translateY(-1px);
          background:linear-gradient(135deg,#dbeafe,#bfdbfe);
          border-color:#60a5fa;
          box-shadow:0 14px 30px rgba(37,99,235,.14);
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
          .mobile-menu{padding:9px;border-radius:22px}
          .mobile-nav{gap:7px}
          .mobile-link{min-height:58px;border-radius:16px;padding:9px;font-size:12px}
          .mobile-link-icon{width:26px;height:26px;flex-basis:26px;border-radius:10px}
          .mobile-link-icon svg{width:15.5px;height:15.5px}
          .news-button b{font-size:8.8px}
          .mobile-call{min-height:46px;border-radius:16px;font-size:13px}
          .news-modal{padding:14px;border-radius:26px}
          .news-modal-grid{gap:8px}
          .news-modal-link{min-height:78px;padding:11px;border-radius:18px}
          .news-modal-link strong{font-size:13.5px}
          .news-modal-link small{font-size:10.5px}
        }

        @media(max-width:370px){
          .brand-subtitle{display:none}
          .brand-title{font-size:20px}
          .mobile-link{min-height:54px;padding:8px;font-size:11.2px}
          .mobile-link-icon{width:24px;height:24px;flex-basis:24px;border-radius:9px}
          .mobile-link-icon svg{width:14.5px;height:14.5px}
          .news-button b{font-size:8.2px}
          .news-modal-link{min-height:72px;padding:10px}
          .news-modal-link strong{font-size:12.5px}
          .news-modal-link small{display:none}
        }
      `}</style>
    </header>
  );
}