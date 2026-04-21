import React, { useEffect, useState } from "react";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";

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
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PublicHeader />

      <main style={{ flex: 1, width: "100%" }}>
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: isMobile ? "320px" : "420px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1.04)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(8,18,38,0.88) 0%, rgba(15,23,42,0.84) 42%, rgba(37,99,235,0.74) 100%)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "1220px",
              width: "100%",
              margin: "0 auto",
              padding: isMobile ? "40px 16px 86px" : "72px 20px 110px",
            }}
          >
            <div style={{ maxWidth: isMobile ? "100%" : "760px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: isMobile ? "7px 12px" : "8px 14px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontSize: isMobile ? "12px" : "13px",
                  color: "#dbeafe",
                  marginBottom: "18px",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                Kontakt • Publiko
              </div>

              <h1
                style={{
                  fontSize: isMobile ? "34px" : isTablet ? "48px" : "64px",
                  lineHeight: isMobile ? 1.04 : 1.02,
                  margin: "0 0 14px",
                  color: "#fff",
                  letterSpacing: "-0.04em",
                  fontWeight: 900,
                }}
              >
                Na kontaktoni për çdo pyetje ose bashkëpunim.
              </h1>

              <p
                style={{
                  fontSize: isMobile ? "15px" : "18px",
                  color: "#dbeafe",
                  lineHeight: isMobile ? 1.7 : 1.8,
                  margin: 0,
                  maxWidth: "680px",
                }}
              >
                Jemi këtu për informata, bashkëpunime dhe çdo komunikim zyrtar
                lidhur me portalin, shpalljet dhe publikimet.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            maxWidth: "1220px",
            margin: isMobile ? "-44px auto 0" : "-72px auto 0",
            padding: isMobile ? "0 14px 46px" : "0 20px 64px",
            position: "relative",
            zIndex: 3,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(280px, 1fr))",
              gap: isMobile ? "14px" : "20px",
              marginBottom: isMobile ? "16px" : "22px",
            }}
          >
            <InfoCard
              isMobile={isMobile}
              icon="📍"
              title="Lokacioni"
              value="Prishtinë, Kosovë"
              desc="Qendra e komunikimit dhe operimit të portalit tonë."
            />

            <InfoCard
              isMobile={isMobile}
              icon="✉️"
              title="Email"
              value="ihgkosova@gmail.com"
              desc="Na shkruani për informata, bashkëpunime dhe pyetje zyrtare."
              action={
                <a href="mailto:ihgkosova@gmail.com" style={secondaryBtn(isMobile)}>
                  Dërgo Email
                </a>
              }
            />

            <InfoCard
              isMobile={isMobile}
              icon="📞"
              title="Telefoni"
              value="044 000 000"
              desc="Na kontaktoni direkt për komunikim më të shpejtë."
              action={
                <a href="tel:044000000" style={primaryBtn(isMobile)}>
                  Thirr Tani
                </a>
              }
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr",
              gap: isMobile ? "14px" : "20px",
            }}
          >
            <div style={mainCard(isMobile)}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "18px",
                  flexWrap: "wrap",
                }}
              >
                <div style={badge(isMobile)}>Kontakt Zyrtar</div>
                <div style={subtleText(isMobile)}>
                  Publiko • Portal informativ & shpallje
                </div>
              </div>

              <h2
                style={{
                  margin: "0 0 12px",
                  color: "#0f172a",
                  fontSize: isMobile ? "28px" : "40px",
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                }}
              >
                Jemi të gatshëm të dëgjojmë dhe të përgjigjemi.
              </h2>

              <p
                style={{
                  margin: "0 0 22px",
                  color: "#475569",
                  lineHeight: isMobile ? 1.75 : 1.8,
                  fontSize: isMobile ? "15px" : "16px",
                  maxWidth: "720px",
                }}
              >
                Nëse keni pyetje rreth publikimeve, kategorive, bashkëpunimeve,
                reklamimit ose njoftimeve në portal, mund të na kontaktoni përmes
                emailit ose telefonit. Komunikimi ynë synon të jetë i qartë,
                profesional dhe i shpejtë.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <a
                  href="mailto:ihgkosova@gmail.com"
                  style={{
                    ...primaryBtn(isMobile),
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Shkruaj në Email
                </a>

                <a
                  href="tel:044000000"
                  style={{
                    ...ghostBtn(isMobile),
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  📞 044 000 000
                </a>
              </div>
            </div>

            <div style={sideCard(isMobile)}>
              <div style={smallTitle(isMobile)}>Detajet e kontaktit</div>

              <div style={contactRow}>
                <span style={rowLabel(isMobile)}>Lokacioni</span>
                <span style={rowValue(isMobile)}>Prishtinë, Kosovë</span>
              </div>

              <div style={divider} />

              <div style={contactRow}>
                <span style={rowLabel(isMobile)}>Email</span>
                <span style={rowValue(isMobile)}>ihgkosova@gmail.com</span>
              </div>

              <div style={divider} />

              <div style={contactRow}>
                <span style={rowLabel(isMobile)}>Telefoni</span>
                <span style={rowValue(isMobile)}>044 000 000</span>
              </div>

              <div
                style={{
                  marginTop: "24px",
                  padding: isMobile ? "14px" : "16px",
                  borderRadius: isMobile ? "16px" : "18px",
                  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                  border: "1px solid #bfdbfe",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#1d4ed8",
                    marginBottom: "6px",
                  }}
                >
                  Komunikim i shpejtë
                </div>
                <div
                  style={{
                    color: "#334155",
                    lineHeight: 1.7,
                    fontSize: isMobile ? "13px" : "14px",
                  }}
                >
                  Për kontakt më të drejtpërdrejtë, përdorni telefonin ose emailin
                  e mësipërm.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

function InfoCard({ icon, title, value, desc, action, isMobile }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.90)",
        border: "1px solid rgba(226,232,240,0.95)",
        borderRadius: isMobile ? "22px" : "26px",
        padding: isMobile ? "18px" : "22px",
        boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          width: isMobile ? "50px" : "54px",
          height: isMobile ? "50px" : "54px",
          borderRadius: isMobile ? "16px" : "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
          fontSize: isMobile ? "22px" : "24px",
          marginBottom: "14px",
          boxShadow: "0 10px 24px rgba(37,99,235,0.10)",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: isMobile ? "12px" : "14px",
          fontWeight: "800",
          color: "#64748b",
          marginBottom: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: isMobile ? "22px" : "24px",
          fontWeight: "900",
          color: "#0f172a",
          lineHeight: 1.15,
          marginBottom: "10px",
          letterSpacing: "-0.02em",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>

      <p
        style={{
          margin: "0 0 16px",
          color: "#475569",
          lineHeight: 1.7,
          fontSize: isMobile ? "13px" : "14px",
        }}
      >
        {desc}
      </p>

      {action}
    </div>
  );
}

const contactRow = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

function mainCard(isMobile) {
  return {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: isMobile ? "24px" : "30px",
    padding: isMobile ? "20px" : "28px",
    boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  };
}

function sideCard(isMobile) {
  return {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: isMobile ? "24px" : "30px",
    padding: isMobile ? "20px" : "24px",
    boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  };
}

function badge(isMobile) {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: isMobile ? "7px 12px" : "8px 14px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
    color: "#1d4ed8",
    fontSize: isMobile ? "12px" : "13px",
    fontWeight: "800",
    border: "1px solid #bfdbfe",
  };
}

function subtleText(isMobile) {
  return {
    color: "#64748b",
    fontSize: isMobile ? "13px" : "14px",
  };
}

function smallTitle(isMobile) {
  return {
    fontSize: isMobile ? "12px" : "14px",
    fontWeight: "800",
    color: "#64748b",
    marginBottom: "18px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };
}

function rowLabel(isMobile) {
  return {
    color: "#64748b",
    fontSize: isMobile ? "12px" : "13px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };
}

function rowValue(isMobile) {
  return {
    color: "#0f172a",
    fontSize: isMobile ? "18px" : "20px",
    fontWeight: "800",
    lineHeight: 1.3,
    wordBreak: "break-word",
  };
}

const divider = {
  height: "1px",
  background: "#e2e8f0",
  margin: "18px 0",
};

function primaryBtn(isMobile) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    padding: isMobile ? "12px 16px" : "13px 18px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #2563eb, #60a5fa)",
    color: "#fff",
    fontWeight: "800",
    fontSize: isMobile ? "14px" : "15px",
    boxShadow: "0 16px 32px rgba(37,99,235,0.22)",
  };
}

function secondaryBtn(isMobile) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    padding: isMobile ? "11px 14px" : "12px 16px",
    borderRadius: "999px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: "800",
    fontSize: isMobile ? "14px" : "15px",
    border: "1px solid #bfdbfe",
  };
}

function ghostBtn(isMobile) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    padding: isMobile ? "12px 16px" : "13px 18px",
    borderRadius: "999px",
    background: "#fff",
    color: "#0f172a",
    fontWeight: "800",
    fontSize: isMobile ? "14px" : "15px",
    border: "1px solid #dbeafe",
    boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
  };
}