import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const accentSoft = "#93c5fd";

const logoUrl =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776285534/ChatGPT_Image_Apr_15_2026_10_38_27_PM_bf2mf9.png";

const footerBgUrl =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776272072/pexels-aubin-kirch-280714467-18098706_typ0ey_nawh9b.jpg";

export default function PublicFooter() {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = screenWidth <= 640;
  const isTablet = screenWidth > 640 && screenWidth <= 1024;

  return (
    <footer
      style={{
        marginTop: isMobile ? "56px" : "84px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#071120"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${footerBgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: isMobile ? 0.16 : 0.28,
          transform: "scale(1.04)"
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(7,17,32,0.98) 0%, rgba(15,23,42,0.94) 38%, rgba(29,78,216,0.74) 100%)"
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-60px",
          width: isMobile ? "180px" : "320px",
          height: isMobile ? "180px" : "320px",
          borderRadius: "999px",
          background: "rgba(59,130,246,0.16)",
          filter: "blur(28px)",
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "-140px",
          left: "-70px",
          width: isMobile ? "220px" : "360px",
          height: isMobile ? "220px" : "360px",
          borderRadius: "999px",
          background: "rgba(96,165,250,0.12)",
          filter: "blur(32px)",
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "26px 14px 18px" : "38px 20px 22px",
          position: "relative",
          zIndex: 2
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
                ? "1fr"
                : "1.15fr 1fr 1fr",
            gap: isMobile ? "12px" : "16px",
            alignItems: "stretch"
          }}
        >
          <div className="footer-card-hover" style={brandCard(isMobile)}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "14px"
              }}
            >
              <div style={logoBox(isMobile)}>
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
                    fontSize: isMobile ? "24px" : "26px",
                    fontWeight: "900",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05
                  }}
                >
                  Publiko
                </div>

                <div
                  style={{
                    color: "#bfdbfe",
                    fontSize: isMobile ? "11px" : "12px",
                    marginTop: "4px",
                    lineHeight: 1.4
                  }}
                >
                  Portal informativ & shpallje
                </div>
              </div>
            </div>

            <p
              style={{
                color: "#dbeafe",
                lineHeight: 1.75,
                margin: 0,
                fontSize: isMobile ? "13px" : "14px"
              }}
            >
              Publiko është platformë moderne për lajme, patundshmëri,
              automjete dhe konkurse pune, me prezencë vizuale serioze dhe
              strukturë profesionale.
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "18px"
              }}
            >
              <a href="tel:044000000" style={contactChip()}>
                📞 044 000 000
              </a>

              <a href="mailto:ihgkosova@gmail.com" style={contactChip()}>
                ✉️ ihgkosova@gmail.com
              </a>
            </div>
          </div>

          <div className="footer-card-hover" style={columnCard(isMobile)}>
            <h4
              style={{
                marginTop: 0,
                marginBottom: "14px",
                fontSize: isMobile ? "15px" : "16px",
                color: "#ffffff",
                lineHeight: 1.3,
                letterSpacing: "-0.01em"
              }}
            >
              Navigimi & Kategoritë
            </h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "4px 18px"
              }}
            >
              <FooterLink to="/">Ballina</FooterLink>
              <FooterLink to="/kategori/vendi">Vendi</FooterLink>

              <FooterLink to="/kategori/lajme">Lajme</FooterLink>
              <FooterLink to="/kategori/rajoni">Rajoni</FooterLink>

              <FooterLink to="/kategori/patundshmeri">Patundshmëri</FooterLink>
              <FooterLink to="/kategori/bota">Bota</FooterLink>

              <FooterLink to="/kategori/automjete">Automjete</FooterLink>
              <FooterLink to="/kategori/oferta">Oferta</FooterLink>

              <FooterLink to="/kategori/konkurse-pune">Konkurse Pune</FooterLink>
              <FooterLink to="/reklamo-me-ne">Reklamo më ne</FooterLink>

              <FooterLink to="/kontakti">Kontakti</FooterLink>
            </div>
          </div>

          <div className="footer-card-hover" style={columnCard(isMobile)}>
            <h4
              style={{
                marginTop: 0,
                marginBottom: "14px",
                fontSize: isMobile ? "15px" : "16px",
                color: "#ffffff",
                lineHeight: 1.3,
                letterSpacing: "-0.01em"
              }}
            >
              Na kontaktoni
            </h4>

            <div
              style={{
                display: "grid",
                gap: "10px"
              }}
            >
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={socialRow()}
                className="footer-social-row"
              >
                <span style={socialIcon()}>f</span>
                <span>Facebook</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={socialRow()}
                className="footer-social-row"
              >
                <span style={socialIcon()}>◎</span>
                <span>Instagram</span>
              </a>

              <a
                href="mailto:ihgkosova@gmail.com"
                style={socialRow()}
                className="footer-social-row"
              >
                <span style={socialIcon()}>✉</span>
                <span>ihgkosova@gmail.com</span>
              </a>
            </div>

            <div
              style={{
                marginTop: "16px",
                padding: "14px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)"
              }}
            >
              <div
                style={{
                  color: "#ffffff",
                  fontWeight: "800",
                  marginBottom: "6px",
                  fontSize: "14px"
                }}
              >
                Lokacioni
              </div>

              <div
                style={{
                  color: "#dbeafe",
                  fontSize: "13px",
                  lineHeight: 1.7
                }}
              >
                Prishtinë, Kosovë
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: isMobile ? "16px" : "22px",
            padding: isMobile ? "14px 0 0" : "16px 0 0",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "8px",
            color: "#bfdbfe",
            fontSize: isMobile ? "12px" : "13px",
            lineHeight: 1.6
          }}
        >
          <div>© 2026 Publiko. Të gjitha të drejtat e rezervuara.</div>

          <div
            style={{
              color: accentSoft,
              fontWeight: "700"
            }}
          >
            Dizajn premium • Informim i qartë • Prezencë serioze
          </div>
        </div>
      </div>

      <style>{`
        .footer-link-premium {
          position: relative;
          transition: all .25s ease;
        }

        .footer-link-premium:hover {
          color: #ffffff !important;
          transform: translateX(4px);
        }

        .footer-link-premium::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 1px;
          background: rgba(255,255,255,0.72);
          transition: width .25s ease;
        }

        .footer-link-premium:hover::after {
          width: 28px;
        }

        .footer-card-hover {
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
        }

        .footer-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 50px rgba(0,0,0,0.18);
          border-color: rgba(255,255,255,0.18);
        }

        .footer-social-row:hover {
          background: rgba(255,255,255,0.12) !important;
          border-color: rgba(255,255,255,0.18) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .footer-link-premium:hover {
            transform: none;
          }

          .footer-card-hover:hover {
            transform: none;
          }

          .footer-social-row:hover {
            transform: none;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="footer-link-premium"
      style={{
        display: "block",
        color: "#dbeafe",
        textDecoration: "none",
        marginBottom: "10px",
        fontSize: "14px",
        lineHeight: 1.5,
        wordBreak: "break-word"
      }}
    >
      {children}
    </Link>
  );
}

function columnCard(isMobile) {
  return {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: isMobile ? "16px" : "18px",
    padding: isMobile ? "16px" : "18px",
    minHeight: "100%",
    boxSizing: "border-box",
    backdropFilter: "blur(7px)",
    WebkitBackdropFilter: "blur(7px)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.14)"
  };
}

function brandCard(isMobile) {
  return {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.11)",
    borderRadius: isMobile ? "16px" : "18px",
    padding: isMobile ? "16px" : "18px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.14)",
    boxSizing: "border-box",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)"
  };
}

function logoBox(isMobile) {
  return {
    width: isMobile ? "50px" : "54px",
    height: isMobile ? "50px" : "54px",
    borderRadius: isMobile ? "13px" : "15px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    boxShadow: "0 12px 26px rgba(37,99,235,0.28)",
    flexShrink: 0
  };
}

function contactChip() {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "13px",
    textDecoration: "none",
    boxShadow: "0 10px 22px rgba(0,0,0,0.10)"
  };
}

function socialRow() {
  return {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
    transition: "all .25s ease"
  };
}

function socialIcon() {
  return {
    width: "34px",
    height: "34px",
    minWidth: "34px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.12)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontWeight: "900",
    fontSize: "14px"
  };
}