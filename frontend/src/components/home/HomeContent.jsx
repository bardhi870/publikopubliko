import React from "react";

import AdSlot from "../ads/AdSlot";
import HomeSection from "./HomeSection";
import ClientsSection from "../../pages/public/ClientsSection";

export default function HomeContent() {
  return (
    <div className="home-layout">

      {/* 🔥 HEADER AD */}
      <AdSlot placement="home_header_banner" />

      {/* 🔹 AUTOMJETE */}
      <HomeSection
        title="Automjete"
        category="automjete"
        subtitle="Shpallje të automjeteve me foto, çmim dhe kontakt të qartë."
      />

      {/* 🔹 PATUNDSHMERI */}
      <HomeSection
        title="Patundshmëri"
        category="patundshmeri"
        subtitle="Prona të publikuara në mënyrë serioze dhe të strukturuar."
      />

      {/* 🔥 MID AD 1 */}
      <AdSlot placement="home_in_feed_1" />

      {/* 🔹 PUNE */}
      <HomeSection
        title="Konkurse Pune"
        category="konkurse-pune"
        subtitle="Mundësi pune dhe pozita aktive nga kompani të ndryshme."
      />

      {/* 🔹 LAJME */}
      <HomeSection
        title="Lajme"
        category="lajme"
        subtitle="Publikime dhe lajme të fundit në një format të pastër."
      />

      {/* 🔥 MID AD 2 */}
      <AdSlot placement="home_in_feed_2" />

      {/* 🔹 CLIENTS */}
      <ClientsSection />

    </div>
  );
}