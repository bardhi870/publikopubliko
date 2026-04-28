import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";
import CategoryPosts from "../../components/posts/CategoryPosts";
import CategoryHero from "./CategoryHero";
import OffersSection from "./OffersSection";
import AdSlot from "../../components/ads/AdSlot";

export default function CategoryPage() {
  const { category } = useParams();
  const isOffersPage = category === "oferta";

  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1100;

  const categoryMeta = useMemo(() => {
    switch (category) {
      case "patundshmeri":
        return {
          eyebrow: "Patundshmëri",
          title: "Prona të kuruara dhe të prezantuara në mënyrë profesionale.",
          accent: "#0f766e"
        };
      case "automjete":
        return {
          eyebrow: "Automjete",
          title: "Automjete me paraqitje moderne, të pastra dhe të lehta për kërkim.",
          accent: "#2563eb"
        };
      case "konkurse-pune":
        return {
          eyebrow: "Punë & Karrierë",
          title: "Mundësi pune të strukturuara për kërkim dhe aplikim më të lehtë.",
          accent: "#7c3aed"
        };
      case "oferta":
        return {
          eyebrow: "Oferta",
          title: "Oferta, promocione dhe publikime të sponsoruara të organizuara bukur.",
          accent: "#ea580c"
        };
      case "lajme":
        return {
          eyebrow: "Lajme",
          title: "Përmbajtje informative e strukturuar qartë për lexim më të mirë.",
          accent: "#1d4ed8"
        };
      default:
        return {
          eyebrow: "Kategori",
          title: "Përmbajtje e organizuar në një pamje të pastër dhe moderne.",
          accent: "#2563eb"
        };
    }
  }, [category]);

  const adConfig = useMemo(() => {
    switch (category) {
      case "patundshmeri":
        return {
          topPlacement: "realestate_top_banner",
          inlinePlacement: "realestate_inline"
        };
      case "automjete":
        return {
          topPlacement: "automotive_top_banner",
          inlinePlacement: "automotive_inline"
        };
      case "konkurse-pune":
        return {
          topPlacement: "jobs_top_banner",
          inlinePlacement: "jobs_inline"
        };
      case "oferta":
        return {
          topPlacement: "offers_top_banner",
          inlinePlacement: "offers_sponsored_card"
        };
      case "lajme":
        return {
          topPlacement: "news_top_banner",
          inlinePlacement: "news_inline_1"
        };
      default:
        return {
          topPlacement: null,
          inlinePlacement: null
        };
    }
  }, [category]);

  return (
    <div
      style={{
        background: isOffersPage
          ? "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        minHeight: "100vh"
      }}
    >
      <PublicHeader />

      <CategoryHero category={category} />

      <main
  style={{
    position: "relative",
    zIndex: 5,
    width: "100%",
    maxWidth: "2000px",
    margin: isMobile
      ? "-42px auto 0"
      : isTablet
        ? "-58px auto 0"
        : "-78px auto 0",
    padding: isMobile
      ? "0 10px 42px"
      : isTablet
        ? "0 16px 56px"
        : "0 24px 76px",
    boxSizing: "border-box"
  }}
>
        <section
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(226,232,240,0.95)",
            borderRadius: isMobile ? "22px" : "34px",
            padding: isMobile ? "16px" : isTablet ? "22px" : "28px",
            boxShadow: isOffersPage
              ? "0 28px 70px rgba(15,23,42,0.10)"
              : "0 22px 55px rgba(15,23,42,0.08)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-80px",
              right: "-80px",
              width: isMobile ? "160px" : "220px",
              height: isMobile ? "160px" : "220px",
              borderRadius: "999px",
              background: `${categoryMeta.accent}14`,
              filter: "blur(16px)",
              pointerEvents: "none"
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "-90px",
              left: "-90px",
              width: isMobile ? "170px" : "240px",
              height: isMobile ? "170px" : "240px",
              borderRadius: "999px",
              background: `${categoryMeta.accent}10`,
              filter: "blur(18px)",
              pointerEvents: "none"
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "grid",
              gap: isMobile ? "16px" : "24px"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "flex-end",
                justifyContent: "space-between",
                gap: isMobile ? "12px" : "20px",
                paddingBottom: isMobile ? "2px" : "6px",
                borderBottom: "1px solid rgba(226,232,240,0.8)"
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: `${categoryMeta.accent}12`,
                    border: `1px solid ${categoryMeta.accent}22`,
                    color: categoryMeta.accent,
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: "12px"
                  }}
                >
                  {categoryMeta.eyebrow}
                </div>

                <h1
                  style={{
                    margin: 0,
                    color: "#0f172a",
                    fontSize: isMobile
                      ? "clamp(28px, 9vw, 34px)"
                      : isTablet
                        ? "42px"
                        : "52px",
                    lineHeight: 1,
                    fontWeight: "900",
                    letterSpacing: "-0.04em"
                  }}
                >
                  {formatCategoryTitle(category)}
                </h1>

                <p
                  style={{
                    margin: "12px 0 0",
                    color: "#64748b",
                    fontSize: isMobile ? "14px" : "16px",
                    lineHeight: 1.7,
                    fontWeight: "500",
                    maxWidth: "780px"
                  }}
                >
                  {categoryMeta.title}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div
                  style={{
                    padding: isMobile ? "10px 12px" : "11px 14px",
                    borderRadius: "999px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                    fontSize: "13px",
                    fontWeight: "800",
                    boxShadow: "0 8px 20px rgba(15,23,42,0.04)"
                  }}
                >
                  Dizajn premium
                </div>

                <div
                  style={{
                    padding: isMobile ? "10px 12px" : "11px 14px",
                    borderRadius: "999px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                    fontSize: "13px",
                    fontWeight: "800",
                    boxShadow: "0 8px 20px rgba(15,23,42,0.04)"
                  }}
                >
                  Responsive
                </div>
              </div>
            </div>

            {adConfig.topPlacement && (
              <div
                style={{
                  borderRadius: isMobile ? "18px" : "24px",
                  overflow: "hidden"
                }}
              >
                <AdSlot placement={adConfig.topPlacement} />
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 300px",
                gap: isMobile ? "14px" : "20px",
                alignItems: "start"
              }}
            >
              <div
                style={{
                  minWidth: 0,
                  borderRadius: isMobile ? "18px" : "28px",
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(226,232,240,0.8)",
                  padding: isMobile ? "10px" : "14px",
                  boxShadow: "0 14px 34px rgba(15,23,42,0.04)"
                }}
              >
                {isOffersPage ? (
                  <>
                    <OffersSection />

                    {adConfig.inlinePlacement && (
                      <div style={{ marginTop: isMobile ? "14px" : "18px" }}>
                        <AdSlot placement={adConfig.inlinePlacement} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <CategoryPosts category={category} />

                    {adConfig.inlinePlacement && (
                      <div style={{ marginTop: isMobile ? "14px" : "18px" }}>
                        <AdSlot placement={adConfig.inlinePlacement} />
                      </div>
                    )}
                  </>
                )}
              </div>

              {!isMobile && (
                <aside
                  style={{
                    position: "sticky",
                    top: "92px",
                    display: "grid",
                    gap: "12px"
                  }}
                >
                  <AdSlot placement="sidebar_top" />
                  <AdSlot placement="sidebar_middle" />
                </aside>
              )}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

function formatCategoryTitle(category) {
  switch (category) {
    case "patundshmeri":
      return "Patundshmëri";
    case "automjete":
      return "Automjete";
    case "konkurse-pune":
      return "Konkurse Pune";
    case "oferta":
      return "Oferta";
    case "lajme":
      return "Lajme";
    default:
      return "Kategori";
  }
}