import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// 🔥 IKONA PROFESIONALE
import { FaHome, FaSearch, FaMoneyBillWave } from "react-icons/fa";

const HERO_IMAGES = [
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151246/0004-foto_u8byn7.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151248/0008-foto_to3nuw.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151247/0006-foto_jytqi0.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151249/0011-foto_on637s.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151249/0010-foto_ascivp.webp",
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1777151246/0002-foto_b6wltt.webp"
];

const categories = [
  { label: "Automjete", value: "automjete" },
  { label: "Patundshmëri", value: "patundshmeri" },
  { label: "Konkurse Pune", value: "konkurse-pune" },
  { label: "Lajme", value: "lajme" }
];

const locations = [
  "Të gjitha",
  "Prishtinë",
  "Prizren",
  "Pejë",
  "Gjakovë",
  "Ferizaj",
  "Gjilan",
  "Mitrovicë",
  "Podujevë"
];

export default function HomeHero() {
  const navigate = useNavigate();

  const [activeSlide, setActiveSlide] = useState(0);
  const [listingType, setListingType] = useState("me-ble");
  const [searchCategory, setSearchCategory] = useState("automjete");
  const [keyword, setKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("Të gjitha");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const supportsListingType = useMemo(
    () => searchCategory === "automjete" || searchCategory === "patundshmeri",
    [searchCategory]
  );

  const supportsPrice = useMemo(
    () =>
      searchCategory === "automjete" ||
      searchCategory === "patundshmeri" ||
      searchCategory === "konkurse-pune",
    [searchCategory]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5600);

    return () => clearInterval(timer);
  }, []);

  const cleanNumber = (value) => value.replace(/[^\d]/g, "");

  const handleHeroSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) params.set("q", keyword.trim());
    if (searchLocation !== "Të gjitha") params.set("lokacioni", searchLocation);
    if (supportsPrice && minPrice) params.set("cmimiPrej", cleanNumber(minPrice));
    if (supportsPrice && maxPrice) params.set("cmimiDeri", cleanNumber(maxPrice));
    if (supportsListingType) params.set("lloji", listingType);

    const query = params.toString();
    navigate(`/kategori/${searchCategory}${query ? `?${query}` : ""}`);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleHeroSearch();
  };

  return (
    <section className="home-hero">
      {HERO_IMAGES.map((img, i) => (
        <div
          key={i}
          className={`hero-bg ${activeSlide === i ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      <div className="home-hero-overlay" />

      <div className="hero-center">
        <span className="hero-eyebrow">Platformë moderne për shpallje</span>

        <h1 className="hero-title">
          <span className="hero-line">Tregu i Shpalljeve</span>
          <span className="hero-line highlight">Fillon Këtu</span>
        </h1>

        <p className="hero-subtitle">
          Gjej <b>automjete</b>, <b>prona</b>, <b>punë</b> —
          <span className="hero-accent"> në një vend të vetëm.</span>
        </p>

        {supportsListingType && (
          <div className="hero-toggle premium-toggle">
            <button
              className={listingType === "me-qira" ? "active" : ""}
              onClick={() => setListingType("me-qira")}
            >
              <FaHome /> Me Qira
            </button>

            <button
              className={listingType === "me-ble" ? "active" : ""}
              onClick={() => setListingType("me-ble")}
            >
              <FaMoneyBillWave /> Me Ble
            </button>
          </div>
        )}
      </div>

      <div className="hero-search-wrap">
        <div className="hero-search-card">

          <div className="search-field">
            <label>Kategoria</label>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="real-select"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="search-field search-wide">
            <label>Kërko</label>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleEnter}
              placeholder="Model, titull, kompani..."
              className="real-input"
            />
          </div>

          <div className="search-field">
            <label>Lokacioni</label>
            <select
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="real-select"
            >
              {locations.map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {supportsPrice && (
            <>
              <div className="search-field">
                <label>Çmimi prej</label>
                <input
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onKeyDown={handleEnter}
                  className="real-input"
                />
              </div>

              <div className="search-field">
                <label>Çmimi deri</label>
                <input
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onKeyDown={handleEnter}
                  className="real-input"
                />
              </div>
            </>
          )}

          <button className="search-btn" onClick={handleHeroSearch}>
            <FaSearch />
            Kërko
          </button>

        </div>
      </div>
    </section>
  );
}