import React from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../../components/layout/PublicHeader";
import CategoryPosts from "../../components/posts/CategoryPosts";
import PublicFooter from "../../components/layout/PublicFooter";
import ClientsSection from "./ClientsSection";
import AdSlot from "../../components/ads/AdSlot";

const primaryColor = "#2563eb";

export default function HomePage() {
  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh" }}>
      <PublicHeader />

      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 20px 60px"
        }}
      >
        <section
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, #1e40af)`,
            color: "#fff",
            borderRadius: "28px",
            padding: "48px 32px",
            marginBottom: "24px",
            boxShadow: "0 18px 45px rgba(37,99,235,0.18)"
          }}
        >
          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 44px)",
              lineHeight: 1.05,
              margin: "0 0 12px"
            }}
          >
            Portal modern informativ & shpallje
          </h1>

          <p
            style={{
              fontSize: "18px",
              opacity: 0.92,
              margin: "0 0 20px",
              maxWidth: "760px",
              lineHeight: 1.7
            }}
          >
            Lajme, patundshmëri, automjete dhe mundësi pune në një vend.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/kategori/lajme" style={primaryBtn}>
              Shiko lajmet
            </Link>

            <a href="tel:044000000" style={contactBtn}>
              📞 044 000 000
            </a>
          </div>
        </section>

        <div style={{ marginBottom: "26px" }}>
          <AdSlot placement="home_header_banner" />
        </div>

        <div className="home-layout" style={layoutStyle}>
          <div style={{ minWidth: 0 }}>
            <Section title="Lajme" category="lajme" />

            <div style={{ margin: "8px 0 28px" }}>
              <AdSlot placement="home_in_feed_1" />
            </div>

            <Section title="Patundshmëri" category="patundshmeri" />

            <div style={{ margin: "8px 0 28px" }}>
              <AdSlot placement="home_in_feed_2" />
            </div>

            <Section title="Automjete" category="automjete" />
            <Section title="Konkurse Pune" category="konkurse-pune" />

            <ClientsSection />
          </div>

          <aside className="home-sidebar" style={sidebarStyle}>
            <div style={{ marginBottom: "18px" }}>
              <AdSlot placement="sidebar_top" device="desktop" />
            </div>

            <div>
              <AdSlot placement="sidebar_middle" device="desktop" />
            </div>
          </aside>
        </div>
      </main>

      <PublicFooter />

      <style>
        {`
          @media (max-width: 1024px) {
            .home-layout {
              grid-template-columns: 1fr !important;
            }

            .home-sidebar {
              display: none !important;
            }
          }

          @media (max-width: 768px) {
            main {
              padding-left: 14px !important;
              padding-right: 14px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

function Section({ title, category }) {
  return (
    <section style={{ marginBottom: "28px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          margin: "0 0 15px"
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#0f172a",
            fontSize: "30px",
            lineHeight: 1.1
          }}
        >
          {title}
        </h2>

        <Link
          to={`/kategori/${category}`}
          style={{
            textDecoration: "none",
            color: "#2563eb",
            fontWeight: 800,
            fontSize: "14px"
          }}
        >
          Shiko më shumë
        </Link>
      </div>

      <CategoryPosts title="" category={category} />
    </section>
  );
}

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 320px",
  gap: "24px",
  alignItems: "start"
};

const sidebarStyle = {
  position: "sticky",
  top: "90px"
};

const primaryBtn = {
  padding: "12px 18px",
  borderRadius: "999px",
  background: "#fff",
  color: "#2563eb",
  fontWeight: "700",
  textDecoration: "none"
};

const contactBtn = {
  padding: "12px 18px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  fontWeight: "700",
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,0.3)"
};