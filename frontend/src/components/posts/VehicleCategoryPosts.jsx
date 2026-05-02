import React, { useEffect, useMemo, useState } from "react";
import { getPostsByCategory } from "../../api/postApi";
import VehiclePostCard from "./VehiclePostCard";
import VehiclePostCardHome from "./VehiclePostCardHome";

const normalize = (value) => {
  const clean = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .replace(/\s+/g, " ");

  const aliases = {
    prishtin: "prishtine",
    prishtine: "prishtine",
    pr: "prishtine",
    disel: "diesel",
    dizel: "diesel",
    diesel: "diesel",
    benzin: "benzin",
    benzine: "benzin",
    benzina: "benzin",
    petrol: "benzin",
    hybrid: "hybrid",
    hibrid: "hybrid",
    automatic: "automatic",
    automatik: "automatic",
    automat: "automatic",
    manual: "manual",
    manuale: "manual"
  };

  return aliases[clean] || clean;
};

const softMatch = (postValue, selectedValue) => {
  if (!selectedValue) return true;

  const postClean = normalize(postValue);
  const selectedClean = normalize(selectedValue);

  if (!postClean) return false;

  return (
    postClean === selectedClean ||
    postClean.includes(selectedClean) ||
    selectedClean.includes(postClean)
  );
};

const isPostNew = (createdAt) => {
  if (!createdAt) return false;
  return (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 3;
};

const stripHtml = (html = "") =>
  String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M10.8 18.2A7.4 7.4 0 1 0 10.8 3.4a7.4 7.4 0 0 0 0 14.8Z" />
    <path d="M16.5 16.5L21 21" />
  </svg>
);

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6H20" />
    <path d="M7 12H17" />
    <path d="M10 18H14" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6L18 18" />
    <path d="M18 6L6 18" />
  </svg>
);

export default function VehicleCategoryPosts({
  title,
  category,
  variant,
  initialLimit = 4
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicleCity, setSelectedVehicleCity] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedGearbox, setSelectedGearbox] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(max-width:640px)").matches
      : false
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const isHomeVariant = variant === "home";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(max-width:640px)");
    const onChange = () => setIsMobile(media.matches);

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await getPostsByCategory(category);

        if (!ignore) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Gabim gjatë marrjes së postimeve:", error);

        if (!ignore) {
          setPosts([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, [category]);

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      if (isHomeVariant) return true;

      const query = normalize(vehicleSearch);
      const postTitle = normalize(post.title);
      const postDescription = normalize(stripHtml(post.description));
      const postCity = post.location || post.city || "";
      const postFuel = post.fuel_type || post.fuel || "";
      const postGearbox = post.transmission || post.gearbox || "";
      const postYear = post.vehicle_year || post.year || "";

      const matchesQuery =
        !query || postTitle.includes(query) || postDescription.includes(query);

      return (
        matchesQuery &&
        softMatch(postCity, selectedVehicleCity) &&
        softMatch(postFuel, selectedFuel) &&
        softMatch(postGearbox, selectedGearbox) &&
        softMatch(postYear, selectedYear)
      );
    });

    const sortNewest = (items) =>
      [...items].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );

    const featured = sortNewest(filtered.filter((post) => post.featured));
    const fresh = sortNewest(
      filtered.filter((post) => !post.featured && isPostNew(post.created_at))
    );
    let normal = sortNewest(
  filtered.filter((post) => !post.featured && !isPostNew(post.created_at))
);

// 🔥 ROTATION (PRO LEVEL)
if (isHomeVariant) {
  normal = normal.sort(() => 0.5 - Math.random());
}

if (isHomeVariant) {
  let finalPosts = [];

  // 🔥 1. ROTATE FEATURED
  let rotatedFeatured = [...featured];

  if (rotatedFeatured.length > 0) {
    rotatedFeatured = rotatedFeatured.sort(() => 0.5 - Math.random());
  }

  finalPosts.push(...rotatedFeatured);

  // 🔥 2. NËSE S'KA MJAFTUESHËM → MBUSHE ME TJERA
  if (finalPosts.length < initialLimit) {
    finalPosts.push(...normal);
  }

  if (finalPosts.length < initialLimit) {
    finalPosts.push(...fresh);
  }

  // 🔥 3. LIMIT FINAL
  return finalPosts.slice(0, initialLimit);
}

return [...featured, ...fresh, ...normal];
  }, [
    posts,
    vehicleSearch,
    selectedVehicleCity,
    selectedFuel,
    selectedGearbox,
    selectedYear,
    isHomeVariant
  ]);

  const hasActiveFilters =
    vehicleSearch ||
    selectedVehicleCity ||
    selectedFuel ||
    selectedGearbox ||
    selectedYear;

  const clearVehicleFilters = () => {
    setVehicleSearch("");
    setSelectedVehicleCity("");
    setSelectedFuel("");
    setSelectedGearbox("");
    setSelectedYear("");
    setShowMobileFilters(false);
  };

  if (loading) {
    return <p className="vehicle-loading">Duke u ngarkuar...</p>;
  }

  if (isHomeVariant) {
    return (
      <div className="home-clean-grid">
        {filteredPosts.slice(0, initialLimit).map((post, index) => (
          <VehiclePostCardHome key={post.id || index} post={post} index={index} />
        ))}
      </div>
    );
  }

  return (
    <section className="vehicle-category-section">
      <div className="vehicle-category-head">
        {title ? (
          <div className="vehicle-head-titlebox">
            <span>Automjete</span>
            <h2>{title}</h2>
          </div>
        ) : (
          <div />
        )}

        {isMobile && (
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className={`vehicle-mobile-filter-btn ${
              showMobileFilters ? "active" : ""
            }`}
          >
            {showMobileFilters ? <XIcon /> : <FilterIcon />}
            <span>{showMobileFilters ? "Mbyll" : "Filtrat"}</span>
          </button>
        )}
      </div>

      {(!isMobile || showMobileFilters) && (
        <div className="vehicle-search-panel">
          <div className="vehicle-search-top">
            <div>
              <span className="vehicle-search-kicker">Kërkim i avancuar</span>
              <h3>Filtro automjetet</h3>
            </div>

            <div className="vehicle-search-count">
              <span>{filteredPosts.length}</span>
              <small>automjete</small>
            </div>
          </div>

          <div className="vehicle-filter-grid">
            <div className="vehicle-field vehicle-field-search">
              <label>Kërko automjet</label>
              <div className="vehicle-input-icon-wrap">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="BMW, Golf, Mercedes..."
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="vehicle-field">
              <label>Qyteti</label>
              <input
                type="text"
                placeholder="Shkruaj qytetin..."
                value={selectedVehicleCity}
                onChange={(e) => setSelectedVehicleCity(e.target.value)}
              />
            </div>

            <div className="vehicle-field">
              <label>Karburanti</label>
              <input
                type="text"
                placeholder="P.sh. Diesel, Benzin..."
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
              />
            </div>

            <div className="vehicle-field">
              <label>Ndërruesi</label>
              <input
                type="text"
                placeholder="P.sh. Automatik..."
                value={selectedGearbox}
                onChange={(e) => setSelectedGearbox(e.target.value)}
              />
            </div>

            <div className="vehicle-field">
              <label>Viti</label>
              <input
                type="text"
                placeholder="P.sh. 2020..."
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              />
            </div>
          </div>

          <div className="vehicle-search-footer">
            <div className="vehicle-active-text">
              {hasActiveFilters
                ? "Filtrat janë aktivë"
                : "Shfaqen të gjitha automjetet"}
            </div>

            <button type="button" onClick={clearVehicleFilters}>
              Largo filtrat
            </button>
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="vehicle-empty-result">Nuk u gjet asnjë automjet.</div>
      ) : (
        <div className="vehicle-category-grid">
          {filteredPosts.map((post, index) => (
            <VehiclePostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}

      <style>{categoryCss}</style>
    </section>
  );
}

const categoryCss = `
  .vehicle-loading{
    margin-top:14px;
    color:#475569;
    font-size:13px;
    font-weight:850;
  }

  .vehicle-category-section{
    width:100%;
    max-width:1640px;
    margin:0 auto 54px;
    position:relative;
    padding:0 4px;
  }

  .vehicle-category-head{
    position:relative;
    overflow:hidden;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:18px;
    margin-bottom:16px;
    padding:22px 24px;
    border-radius:26px;
    background:
      radial-gradient(circle at 8% 0%, rgba(37,99,235,.16), transparent 32%),
      radial-gradient(circle at 92% 18%, rgba(14,165,233,.12), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,.99), rgba(248,251,255,.94));
    border:1px solid rgba(191,219,254,.92);
    box-shadow:
      0 18px 44px rgba(15,23,42,.065),
      inset 0 1px 0 rgba(255,255,255,.9);
  }

  .vehicle-category-head::after{
    content:"";
    position:absolute;
    inset:auto 18px 0 18px;
    height:1px;
    background:linear-gradient(90deg, transparent, rgba(37,99,235,.42), transparent);
  }

  .vehicle-head-titlebox span{
    display:inline-flex;
    align-items:center;
    gap:7px;
    padding:7px 12px;
    border-radius:999px;
    background:linear-gradient(135deg,#eff6ff,#dbeafe);
    color:#1d4ed8;
    font-size:10px;
    font-weight:950;
    margin-bottom:9px;
    letter-spacing:.08em;
    text-transform:uppercase;
    border:1px solid rgba(191,219,254,.9);
    box-shadow:0 10px 22px rgba(37,99,235,.10);
  }

  .vehicle-head-titlebox span::before{
    content:"";
    width:7px;
    height:7px;
    border-radius:999px;
    background:#2563eb;
    box-shadow:0 0 0 4px rgba(37,99,235,.12);
  }

  .vehicle-category-head h2{
    margin:0;
    font-size:clamp(30px,3.4vw,48px);
    line-height:.96;
    letter-spacing:-.06em;
    font-weight:950;
    color:#07142d;
  }

  .vehicle-mobile-filter-btn{
    min-height:44px;
    padding:0 18px;
    border-radius:999px;
    border:1px solid rgba(191,219,254,.95);
    background:linear-gradient(135deg,#ffffff,#eff6ff);
    color:#1d4ed8;
    display:inline-flex;
    align-items:center;
    gap:8px;
    font-size:13px;
    font-weight:950;
    cursor:pointer;
    box-shadow:0 12px 26px rgba(37,99,235,.10);
  }

  .vehicle-mobile-filter-btn.active{
    background:linear-gradient(135deg,#1d4ed8,#0284c7);
    color:#fff;
    border-color:rgba(125,211,252,.75);
  }

  .vehicle-mobile-filter-btn svg{
    width:17px;
    height:17px;
    stroke:currentColor;
    stroke-width:2.2;
    stroke-linecap:round;
  }

  .vehicle-search-panel{
    position:relative;
    overflow:hidden;
    border:1px solid rgba(191,219,254,.88);
    border-radius:26px;
    padding:18px;
    margin-bottom:18px;
    background:
      radial-gradient(circle at 7% 0%, rgba(37,99,235,.10), transparent 30%),
      radial-gradient(circle at 96% 8%, rgba(14,165,233,.10), transparent 28%),
      linear-gradient(180deg, rgba(255,255,255,.99), rgba(248,251,255,.95));
    box-shadow:
      0 18px 44px rgba(15,23,42,.06),
      inset 0 1px 0 rgba(255,255,255,.85);
  }

  .vehicle-search-panel::before{
    content:"";
    position:absolute;
    left:18px;
    right:18px;
    top:0;
    height:1px;
    background:linear-gradient(90deg, transparent, rgba(37,99,235,.35), transparent);
  }

  .vehicle-search-top{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:14px;
    margin-bottom:16px;
  }

  .vehicle-search-kicker{
    display:inline-flex;
    align-items:center;
    min-height:26px;
    padding:0 11px;
    border-radius:999px;
    background:#dbeafe;
    color:#1d4ed8;
    font-size:10px;
    font-weight:950;
    margin-bottom:8px;
  }

  .vehicle-search-top h3{
    margin:0;
    color:#07142d;
    font-size:23px;
    line-height:1;
    letter-spacing:-.04em;
    font-weight:950;
  }

  .vehicle-search-count{
    min-width:88px;
    min-height:58px;
    border-radius:17px;
    border:1px solid #dbeafe;
    background:#fff;
    display:grid;
    place-items:center;
    padding:8px 12px;
    box-shadow:0 12px 26px rgba(15,23,42,.05);
  }

  .vehicle-search-count span{
    color:#1d4ed8;
    font-size:24px;
    line-height:1;
    font-weight:950;
  }

  .vehicle-search-count small{
    color:#64748b;
    font-size:10.5px;
    font-weight:850;
  }

  .vehicle-filter-grid{
    display:grid;
    grid-template-columns:1.45fr repeat(4,minmax(0,1fr));
    gap:12px;
    align-items:end;
  }

  .vehicle-field label{
    display:block;
    margin:0 0 7px;
    color:#334155;
    font-size:10.5px;
    font-weight:950;
    letter-spacing:.02em;
  }

  .vehicle-field input{
    width:100%;
    height:44px;
    padding:0 13px;
    border-radius:15px;
    border:1px solid #dbeafe;
    background:rgba(255,255,255,.96);
    color:#0f172a;
    font-size:13px;
    font-weight:750;
    outline:none;
    box-sizing:border-box;
    box-shadow:0 8px 18px rgba(15,23,42,.035);
    transition:border-color .18s ease, box-shadow .18s ease, background .18s ease;
  }

  .vehicle-field input:focus{
    border-color:#60a5fa;
    box-shadow:0 0 0 4px rgba(37,99,235,.10);
    background:#fff;
  }

  .vehicle-field input::placeholder{
    color:#94a3b8;
    font-weight:750;
  }

  .vehicle-input-icon-wrap{
    position:relative;
  }

  .vehicle-input-icon-wrap svg{
    position:absolute;
    left:14px;
    top:50%;
    transform:translateY(-50%);
    width:17px;
    height:17px;
    stroke:#64748b;
    stroke-width:2;
    stroke-linecap:round;
    pointer-events:none;
  }

  .vehicle-input-icon-wrap input{
    padding-left:42px;
  }

  .vehicle-search-footer{
    margin-top:13px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    flex-wrap:wrap;
  }

  .vehicle-active-text{
    color:#64748b;
    font-size:13px;
    font-weight:850;
  }

  .vehicle-search-footer button{
    min-height:38px;
    padding:0 15px;
    border-radius:999px;
    border:1px solid #bfdbfe;
    background:#fff;
    color:#1d4ed8;
    font-size:12.5px;
    font-weight:950;
    cursor:pointer;
    box-shadow:0 10px 22px rgba(37,99,235,.08);
  }

  .vehicle-empty-result{
    background:#ffffff;
    border:1px solid #e2e8f0;
    border-radius:20px;
    padding:32px 20px;
    text-align:center;
    color:#64748b;
    font-size:13px;
    font-weight:850;
  }

  .vehicle-category-grid{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:15px;
    align-items:start;
    width:100%;
    max-width:1420px;
    margin:0 auto;
    content-visibility:auto;
    contain-intrinsic-size:900px;
  }

  @media(max-width:1100px){
    .vehicle-filter-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
    }

    .vehicle-field-search{
      grid-column:1 / -1;
    }

    .vehicle-category-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:12px;
    }
  }

  @media(max-width:640px){
    .vehicle-category-section{
      margin-bottom:34px;
      padding:0;
    }

    .vehicle-category-head{
      padding:18px 16px;
      border-radius:22px;
      margin-bottom:12px;
    }

    .vehicle-head-titlebox span{
      font-size:9px;
      padding:6px 10px;
      margin-bottom:8px;
    }

    .vehicle-category-head h2{
      font-size:32px;
      line-height:.95;
    }

    .vehicle-mobile-filter-btn{
      min-height:42px;
      padding:0 14px;
      font-size:12px;
    }

    .vehicle-search-panel{
      padding:14px;
      border-radius:22px;
      margin-bottom:14px;
    }

    .vehicle-search-top{
      align-items:start;
      margin-bottom:14px;
      gap:12px;
    }

    .vehicle-search-kicker{
      min-height:24px;
      font-size:9.5px;
      padding:0 10px;
      margin-bottom:7px;
    }

    .vehicle-search-top h3{
      font-size:22px;
      letter-spacing:-.045em;
    }

    .vehicle-search-count{
      min-width:80px;
      min-height:54px;
      border-radius:16px;
      padding:8px 10px;
    }

    .vehicle-search-count span{
      font-size:25px;
    }

    .vehicle-search-count small{
      font-size:10px;
    }

    .vehicle-filter-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px;
    }

    .vehicle-field-search{
      grid-column:1 / -1;
    }

    .vehicle-field label{
      font-size:10.5px;
      margin-bottom:6px;
    }

    .vehicle-field input{
      height:46px;
      border-radius:14px;
      font-size:13px;
      padding:0 12px;
    }

    .vehicle-input-icon-wrap input{
      padding-left:42px;
    }

    .vehicle-search-footer{
      margin-top:12px;
      gap:9px;
    }

    .vehicle-active-text{
      font-size:12px;
    }

    .vehicle-search-footer button{
      min-height:42px;
      padding:0 15px;
      font-size:12px;
    }

    .vehicle-category-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:8px;
      max-width:100%;
    }
  }

  @media(max-width:360px){
    .vehicle-category-head h2{
      font-size:29px;
    }

    .vehicle-field input{
      height:42px;
      font-size:12.5px;
    }
  }
`;
