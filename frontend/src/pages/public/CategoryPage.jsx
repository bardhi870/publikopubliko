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
          ? "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)"
          : "#f8fafc",
        minHeight: "100vh"
      }}
    >
      <PublicHeader />

      <CategoryHero category={category} />

      <main
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1320px",
          margin: isMobile
            ? "-54px auto 0"
            : isTablet
              ? "-70px auto 0"
              : "-86px auto 0",
          padding: isMobile
            ? "0 12px 42px"
            : isTablet
              ? "0 20px 56px"
              : "0 24px 72px"
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(226,232,240,0.95)",
            borderRadius: isMobile ? "22px" : "30px",
            padding: isMobile ? "16px" : isTablet ? "22px" : "26px",
            boxShadow: isOffersPage
              ? "0 28px 70px rgba(15,23,42,0.10)"
              : "0 20px 50px rgba(15,23,42,0.08)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              display: "grid",
              gap: isMobile ? "16px" : "22px"
            }}
          >
            {adConfig.topPlacement && (
              <AdSlot placement={adConfig.topPlacement} />
            )}

            {isOffersPage ? (
              <OffersSection />
            ) : (
              <CategoryPosts category={category} />
            )}

            {adConfig.inlinePlacement && (
              <AdSlot placement={adConfig.inlinePlacement} />
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}