import React, { useEffect } from "react";

import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";
import HomeContent from "../../components/home/HomeContent";

import { trackEvent } from "../../utils/analytics";
import "../../styles/home.css";

export default function HomePage() {
  useEffect(() => {
    trackEvent({ event_type: "page_view" });
  }, []);

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);

      trackEvent({
        event_type: "time_on_page",
        duration_seconds: duration,
        page_url: window.location.pathname
      });
    };
  }, []);

  return (
    <div className="home-page">
      <PublicHeader />

      <main className="home-main">
        <HomeContent />
      </main>

      <PublicFooter />
    </div>
  );
}