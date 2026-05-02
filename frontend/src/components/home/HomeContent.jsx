import React from "react";
import { Link } from "react-router-dom";

import AdSlot from "../ads/AdSlot";
import HomeSection from "./HomeSection";
import HomeNewsSection from "./HomeNewsSection";

export default function HomeContent() {
  return (
    <div className="home-layout">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-text">
            <span className="home-hero-eyebrow">Publiko.biz</span>

            <h1>Gjithçka në një vend.</h1>

            <p>
              Lajme, patundshmëri, automjete dhe konkurse pune — të strukturuara
              qartë për përdoruesit në Kosovë.
            </p>

            <div className="home-hero-actions">
              <Link to="/reklamo-me-ne" className="btn-primary">
                Reklamo këtu
              </Link>

              <Link to="/kategori/patundshmeri" className="btn-secondary">
                Shiko shpalljet
              </Link>
            </div>

            <div className="home-hero-categories">
              <Link to="/lajme">Lajme</Link>
              <Link to="/kategori/patundshmeri">Patundshmëri</Link>
              <Link to="/kategori/automjete">Automjete</Link>
              <Link to="/kategori/konkurse-pune">Konkurse Pune</Link>
            </div>
          </div>

          <div className="home-hero-ad">
            <AdSlot placement="home_header_banner" />
          </div>
        </div>
      </section>

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

      <div className="home-ad-block">
        <AdSlot placement="home_in_feed_1" />
      </div>

      <HomeSection
        title="Konkurse Pune"
        category="konkurse-pune"
        subtitle="Mundësi pune dhe pozita aktive nga kompani të ndryshme."
      />

      <div className="home-ad-block">
        <AdSlot placement="home_in_feed_2" />
      </div>

      <section className="home-cta">
        <span>Reklamo në Publiko</span>

        <h2>Promovo biznesin tënd aty ku shihen shpalljet.</h2>

        <p>
          Vendos reklamën tënde në hapësira kryesore të platformës dhe arrij
          klientë potencialë çdo ditë.
        </p>

        <Link to="/reklamo-me-ne" className="btn-primary">
          Fillo tani
        </Link>
      </section>
    </div>
  );
}