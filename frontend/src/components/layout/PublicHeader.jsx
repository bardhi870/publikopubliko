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

export default function PublicHeader() {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isMobile = screenWidth <= 900;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        background: "rgba(255,255,255,0.58)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(148,163,184,0.14)",
        boxShadow: "0 14px 40px rgba(15,23,42,0.05)"
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: isMobile ? "12px 14px" : "14px 20px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px"
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "10px" : "12px",
              minWidth: 0,
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: isMobile ? "50px" : "52px",
                height: isMobile ? "50px" : "52px",
                borderRadius: "18px",
                background:
                  "linear-gradient(135deg, #0f172a, #1d4ed8 72%, #60a5fa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: "0 16px 34px rgba(37,99,235,0.22)",
                border: "1px solid rgba(255,255,255,0.28)"
              }}
            >
              <img
                src={logoUrl}
                alt="Publiko Logo"
                style={{
                  width: "78%",
                  height: "78%",
                  objectFit: "contain"
                }}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "900",
                  color: "#0f172a",
                  lineHeight: 1,
                  letterSpacing: "-0.03em"
                }}
              >
                Publiko
              </div>
              <div
                style={{
                  fontSize: isMobile ? "11px" : "12px",
                  color: "#64748b",
                  marginTop: "5px",
                  lineHeight: 1.25,
                  whiteSpace: "nowrap"
                }}
              >
                Portal informativ & shpallje
              </div>
            </div>
          </Link>

          {isMobile ? (
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Mbyll menunë" : "Hap menunë"}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                border: menuOpen
                  ? "1px solid rgba(96,165,250,0.34)"
                  : "1px solid rgba(148,163,184,0.18)",
                background: menuOpen
                  ? "rgba(255,255,255,0.68)"
                  : "rgba(255,255,255,0.46)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: menuOpen
                  ? "0 14px 34px rgba(37,99,235,0.12)"
                  : "0 10px 24px rgba(15,23,42,0.04)",
                transition: "all 0.22s ease",
                flexShrink: 0,
                position: "relative"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "18px",
                  height: "18px"
                }}
              >
                <span
                  style={{
                    ...burgerLine,
                    position: "absolute",
                    top: "3px",
                    left: 0,
                    transform: menuOpen
                      ? "translateY(5px) rotate(45deg)"
                      : "translateY(0) rotate(0deg)",
                    transition: "all 0.25s ease"
                  }}
                />
                <span
                  style={{
                    ...burgerLine,
                    position: "absolute",
                    top: "8px",
                    left: 0,
                    opacity: menuOpen ? 0 : 1,
                    transform: menuOpen ? "scaleX(0.3)" : "scaleX(1)",
                    transition: "all 0.22s ease"
                  }}
                />
                <span
                  style={{
                    ...burgerLine,
                    position: "absolute",
                    top: "13px",
                    left: 0,
                    transform: menuOpen
                      ? "translateY(-5px) rotate(-45deg)"
                      : "translateY(0) rotate(0deg)",
                    transition: "all 0.25s ease"
                  }}
                />
              </div>
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flex: 1
              }}
            >
              <nav
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  padding: "7px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.64)",
                  border: "1px solid rgba(203,213,225,0.58)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: "0 14px 32px rgba(15,23,42,0.04)"
                }}
              >
                {navItems.slice(0, 1).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    style={({ isActive }) => desktopNavStyle(isActive, item)}
                  >
                    {item.label}
                  </NavLink>
                ))}

                <NewsMenuDropdown />

                {navItems.slice(1).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    style={({ isActive }) => desktopNavStyle(isActive, item)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        {isMobile && (
          <div
            style={{
              marginTop: menuOpen ? "14px" : "0px",
              maxHeight: menuOpen ? "900px" : "0px",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(-10px)",
              overflow: "hidden",
              pointerEvents: menuOpen ? "auto" : "none",
              transition:
                "max-height 0.35s ease, opacity 0.25s ease, transform 0.28s ease, margin-top 0.25s ease"
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                padding: "14px",
                borderRadius: "28px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.48), rgba(255,255,255,0.24))",
                border: "1px solid rgba(255,255,255,0.30)",
                boxShadow:
                  "0 22px 50px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.35)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "radial-gradient(circle at top right, rgba(96,165,250,0.18), transparent 30%), radial-gradient(circle at bottom left, rgba(59,130,246,0.12), transparent 26%)"
                }}
              />

              <nav
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "10px"
                }}
              >
                {navItems.slice(0, 1).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    style={({ isActive }) => mobileNavStyle(isActive, item)}
                  >
                    {item.label}
                  </NavLink>
                ))}

                <NewsMenuDropdown
                  mobile
                  onNavigate={() => setMenuOpen(false)}
                />

                {navItems.slice(1).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    style={({ isActive }) => mobileNavStyle(isActive, item)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <a
                href="tel:044000000"
                style={{
                  position: "relative",
                  zIndex: 1,
                  marginTop: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "18px",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #2563eb, #60a5fa)",
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "14px",
                  boxShadow: "0 14px 28px rgba(37,99,235,0.20)"
                }}
              >
                📞
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function desktopNavStyle(isActive, item) {
  const isOffer = item?.to === "/kategori/oferta";
  const isAdvertise = item?.to === "/reklamo-me-ne";

  if (isOffer) {
    return {
      textDecoration: "none",
      color: "#166534",
      fontWeight: "800",
      padding: "12px 16px",
      borderRadius: "999px",
      background: isActive
        ? "linear-gradient(135deg, rgba(220,252,231,0.92), rgba(167,243,208,0.90))"
        : "rgba(240,253,244,0.62)",
      border: "1px solid rgba(52,211,153,0.52)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      boxShadow: isActive
        ? "0 10px 20px rgba(16,185,129,0.10)"
        : "0 6px 14px rgba(16,185,129,0.05)",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
      letterSpacing: "-0.01em"
    };
  }

  if (isAdvertise) {
    return {
      textDecoration: "none",
      color: "#9a3412",
      fontWeight: "800",
      padding: "12px 16px",
      borderRadius: "999px",
      background: isActive
        ? "linear-gradient(135deg, rgba(255,237,213,0.92), rgba(254,215,170,0.90))"
        : "rgba(255,247,237,0.66)",
      border: "1px solid rgba(251,146,60,0.52)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      boxShadow: isActive
        ? "0 10px 20px rgba(249,115,22,0.10)"
        : "0 6px 14px rgba(249,115,22,0.05)",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
      letterSpacing: "-0.01em"
    };
  }

  return {
    textDecoration: "none",
    color: isActive ? "#0f172a" : "#475569",
    fontWeight: isActive ? "800" : "700",
    padding: "12px 16px",
    borderRadius: "999px",
    background: isActive
      ? "linear-gradient(135deg, rgba(219,234,254,0.88), rgba(191,219,254,0.84))"
      : "transparent",
    border: isActive
      ? "1px solid rgba(147,197,253,0.64)"
      : "1px solid transparent",
    boxShadow: isActive ? "0 10px 20px rgba(37,99,235,0.08)" : "none",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    letterSpacing: "-0.01em"
  };
}

function mobileNavStyle(isActive, item) {
  const isOffer = item?.to === "/kategori/oferta";
  const isAdvertise = item?.to === "/reklamo-me-ne";

  if (isOffer) {
    return {
      textDecoration: "none",
      color: "#166534",
      fontWeight: "800",
      padding: "15px 16px",
      borderRadius: "18px",
      background: isActive
        ? "linear-gradient(135deg, rgba(220,252,231,0.86), rgba(167,243,208,0.78))"
        : "rgba(240,253,244,0.22)",
      border: "1px solid rgba(52,211,153,0.42)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      transition: "all 0.2s ease",
      textAlign: "left",
      boxShadow: isActive
        ? "0 10px 20px rgba(16,185,129,0.08)"
        : "0 6px 14px rgba(16,185,129,0.04)"
    };
  }

  if (isAdvertise) {
    return {
      textDecoration: "none",
      color: "#9a3412",
      fontWeight: "800",
      padding: "15px 16px",
      borderRadius: "18px",
      background: isActive
        ? "linear-gradient(135deg, rgba(255,237,213,0.86), rgba(254,215,170,0.78))"
        : "rgba(255,247,237,0.22)",
      border: "1px solid rgba(251,146,60,0.42)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      transition: "all 0.2s ease",
      textAlign: "left",
      boxShadow: isActive
        ? "0 10px 20px rgba(249,115,22,0.08)"
        : "0 6px 14px rgba(249,115,22,0.04)"
    };
  }

  return {
    textDecoration: "none",
    color: isActive ? "#0f172a" : "#475569",
    fontWeight: isActive ? "800" : "700",
    padding: "15px 16px",
    borderRadius: "18px",
    background: isActive
      ? "linear-gradient(135deg, rgba(219,234,254,0.82), rgba(191,219,254,0.76))"
      : "rgba(255,255,255,0.14)",
    border: isActive
      ? "1px solid rgba(147,197,253,0.56)"
      : "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    transition: "all 0.2s ease",
    textAlign: "left",
    boxShadow: isActive
      ? "0 10px 20px rgba(37,99,235,0.08)"
      : "0 6px 14px rgba(15,23,42,0.03)"
  };
}

const burgerLine = {
  width: "18px",
  height: "2px",
  background: "#0f172a",
  borderRadius: "999px"
};