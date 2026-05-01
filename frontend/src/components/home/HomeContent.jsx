import React from "react";

import AdSlot from "../ads/AdSlot";
import HomeSection from "./HomeSection";
import HomeNewsSection from "./HomeNewsSection";
import ClientsSection from "../../pages/public/ClientsSection";

export default function HomeContent() {
  return (
    <div className="home-layout">
      <AdSlot placement="home_header_banner" />

      <HomeNewsSection />

      <HomeSection
        title="Patundshmëri"
        category="patundshmeri"
        subtitle="Prona të publikuara në mënyrë serioze dhe të strukturuar."
      />

      <HomeSection
        title="Automjete"
        category="automjete"
        subtitle="Shpallje të automjeteve me foto, çmim dhe kontakt të qartë."
      />

      <AdSlot placement="home_in_feed_1" />

      <HomeSection
        title="Konkurse Pune"
        category="konkurse-pune"
        subtitle="Mundësi pune dhe pozita aktive nga kompani të ndryshme."
      />

      <AdSlot placement="home_in_feed_2" />

      <ClientsSection />
    </div>
  );
}