import React, { useEffect } from "react";

import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";

import HomeHero from "../../components/home/HomeHero";
import CategoryStrip from "../../components/home/CategoryStrip";
import HomeContent from "../../components/home/HomeContent";

import { trackEvent } from "../../utils/analytics";
import "../../styles/home.css";

export default function HomePage() {
  useEffect(() => {
    trackEvent({ event_type: "page_view" });
  }, []);

  return (
    <div className="home-page">
      <PublicHeader />

      <main className="home-main">
        <HomeHero />
        <CategoryStrip />
        <HomeContent />
      </main>

      <PublicFooter />
    </div>
  );
}