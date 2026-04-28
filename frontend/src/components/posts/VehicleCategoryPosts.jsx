import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPostsByCategory } from "../../api/postApi";
import VehiclePostCard from "./VehiclePostCard";
import {
  CITY_OPTIONS,
  VEHICLE_FUEL_OPTIONS,
  VEHICLE_GEARBOX_OPTIONS,
  VEHICLE_YEAR_OPTIONS
} from "../../constants/postFilterOptions";

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

const normalizeGalleryImages = (galleryImages) => {
  if (!galleryImages) return [];
  if (Array.isArray(galleryImages)) return galleryImages.filter(Boolean);

  try {
    const parsed = JSON.parse(galleryImages);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const isPostNew = (createdAt) => {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return diffDays <= 3;
};

const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M10.8 18.2A7.4 7.4 0 1 0 10.8 3.4a7.4 7.4 0 0 0 0 14.8Z" />
    <path d="M16.5 16.5L21 21" />
  </svg>
);

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M4 6H20" />
    <path d="M7 12H17" />
    <path d="M10 18H14" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M6 6L18 18" />
    <path d="M18 6L6 18" />
  </svg>
);

export default function VehicleCategoryPosts({ title, category, variant }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicleCity, setSelectedVehicleCity] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedGearbox, setSelectedGearbox] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);

  const isMobile = screenWidth <= 640;
  const isHomeVariant = variant === "home";

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPostsByCategory(category);
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gabim gjatë marrjes së postimeve:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  const filteredPosts = useMemo(() => {
    const filtered = [...posts].filter((post) => {
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
    const normal = sortNewest(
      filtered.filter((post) => !post.featured && !isPostNew(post.created_at))
    );

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

  if (loading) return <p className="vehicle-loading">Duke u ngarkuar...</p>;

  if (isHomeVariant) {
    return (
      <>
        <div className="home-vehicle-grid">
          {filteredPosts.slice(0, 6).map((post, index) => {
            const galleryImages = normalizeGalleryImages(post.gallery_images);
            const postImage = post?.image_url || galleryImages[0] || "";
            const isExpanded = expandedCardId === post.id;

            return (
              <div
                key={post.id || index}
                className={`home-vehicle-card ${isExpanded ? "expanded" : ""}`}
              >
                <Link to={`/automjete/${post.id}`} className="home-vehicle-media">
                  {postImage ? (
                    <img
                      src={postImage}
                      alt={post.title || "Automjet"}
                      className="home-vehicle-img"
                    />
                  ) : (
                    <div className="home-vehicle-noimg">Automjet</div>
                  )}

                  <div className="home-vehicle-overlay">
                    <div className="home-vehicle-top">
                      <span className="home-vehicle-badge">Automjet</span>
                      {isPostNew(post.created_at) && (
                        <span className="home-vehicle-new">E RE</span>
                      )}
                      {post.featured && (
                        <span className="home-vehicle-featured">⭐</span>
                      )}
                    </div>

                    <div className="home-vehicle-bottom">
                      <h3>{post.title || "Automjet"}</h3>

                      <button
                        type="button"
                        className="home-vehicle-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setExpandedCardId((prev) =>
                            prev === post.id ? null : post.id
                          );
                        }}
                      >
                        {isExpanded ? "Mbylle" : "Shiko më shumë →"}
                      </button>
                    </div>
                  </div>
                </Link>

                <div className={`home-vehicle-expand ${isExpanded ? "show" : ""}`}>
                  <div className="home-vehicle-expand-inner">
                    <div className="home-vehicle-expand-head">
                      <h4>{post.title || "Automjet"}</h4>
                      <p>{stripHtml(post.description) || "Shiko detajet e automjetit."}</p>
                    </div>

                    <div className="home-vehicle-specs">
                      <div className="home-vehicle-spec">
                        <span>Viti</span>
                        <strong>{post.vehicle_year || post.year || "—"}</strong>
                      </div>

                      <div className="home-vehicle-spec">
                        <span>Kilometra</span>
                        <strong>{post.mileage || post.kilometers || "—"}</strong>
                      </div>

                      <div className="home-vehicle-spec">
                        <span>Ndërruesi</span>
                        <strong>{post.transmission || post.gearbox || "—"}</strong>
                      </div>
                    </div>

                    <div className="home-vehicle-price-wrap">
                      <div>
                        <span className="home-vehicle-price-label">ÇMIMI</span>
                        <div className="home-vehicle-price">
                          {post.price ? `${post.price} €` : "Sipas marrëveshjes"}
                        </div>
                      </div>

                      <Link
                        to={`/automjete/${post.id}`}
                        className="home-vehicle-detail-link"
                      >
                        Shiko detajet
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <style>{homeVehicleCss}</style>
      </>
    );
  }

  return (
    <section className="vehicle-category-section">
      <div className="vehicle-category-head">
        {title ? <h2>{title}</h2> : <div />}
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
              <select
                value={selectedVehicleCity}
                onChange={(e) => setSelectedVehicleCity(e.target.value)}
              >
                <option value="">Të gjitha qytetet</option>
                {CITY_OPTIONS.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="vehicle-field">
              <label>Karburanti</label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
              >
                <option value="">Të gjitha</option>
                {VEHICLE_FUEL_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="vehicle-field">
              <label>Ndërruesi</label>
              <select
                value={selectedGearbox}
                onChange={(e) => setSelectedGearbox(e.target.value)}
              >
                <option value="">Të gjitha</option>
                {VEHICLE_GEARBOX_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="vehicle-field">
              <label>Viti</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Të gjitha</option>
                {VEHICLE_YEAR_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
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
  }

  .vehicle-category-section{
    width:100%;
    margin-bottom:42px;
  }

  .vehicle-category-head{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:14px;
    margin-bottom:16px;
  }

  .vehicle-category-head h2{
    margin:0;
    font-size:30px;
    line-height:1;
    letter-spacing:-.04em;
    font-weight:950;
    color:#0f172a;
  }

  .vehicle-mobile-filter-btn{
    min-height:44px;
    padding:0 14px;
    border-radius:999px;
    border:1px solid #dbe3ee;
    background:#fff;
    color:#0f172a;
    display:inline-flex;
    align-items:center;
    gap:8px;
    font-size:13px;
    font-weight:900;
    cursor:pointer;
  }

  .vehicle-mobile-filter-btn.active{
    background:#0f172a;
    color:#fff;
    border-color:#0f172a;
  }

  .vehicle-mobile-filter-btn svg{
    width:17px;
    height:17px;
    stroke:currentColor;
    stroke-width:2;
    stroke-linecap:round;
  }

  .vehicle-search-panel{
    position:relative;
    border:1px solid rgba(226,232,240,.95);
    border-radius:26px;
    padding:18px;
    margin-bottom:22px;
    background:linear-gradient(180deg,#ffffff,#f8fbff);
    overflow:hidden;
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
    padding:0 10px;
    border-radius:999px;
    background:#eff6ff;
    color:#2563eb;
    font-size:11px;
    font-weight:950;
    margin-bottom:8px;
  }

  .vehicle-search-top h3{
    margin:0;
    color:#0f172a;
    font-size:24px;
    line-height:1;
    letter-spacing:-.035em;
    font-weight:950;
  }

  .vehicle-search-count{
    min-width:92px;
    min-height:58px;
    border-radius:18px;
    border:1px solid #dbeafe;
    background:#fff;
    display:grid;
    place-items:center;
    padding:8px 12px;
  }

  .vehicle-search-count span{
    color:#0f172a;
    font-size:22px;
    line-height:1;
    font-weight:950;
  }

  .vehicle-search-count small{
    color:#64748b;
    font-size:11px;
    font-weight:850;
  }

  .vehicle-filter-grid{
    display:grid;
    grid-template-columns:1.15fr repeat(4,minmax(0,.85fr));
    gap:12px;
    align-items:end;
  }

  .vehicle-field label{
    display:block;
    margin:0 0 8px;
    color:#334155;
    font-size:12px;
    font-weight:950;
  }

  .vehicle-field input,
  .vehicle-field select{
    width:100%;
    height:50px;
    padding:0 14px;
    border-radius:15px;
    border:1px solid #dbe3ee;
    background:#fff;
    color:#0f172a;
    font-size:14px;
    outline:none;
    box-sizing:border-box;
  }

  .vehicle-field input:focus,
  .vehicle-field select:focus{
    border-color:#2563eb;
    box-shadow:0 0 0 4px rgba(37,99,235,.09);
  }

  .vehicle-input-icon-wrap{
    position:relative;
  }

  .vehicle-input-icon-wrap svg{
    position:absolute;
    left:14px;
    top:50%;
    transform:translateY(-50%);
    width:18px;
    height:18px;
    stroke:#64748b;
    stroke-width:2;
    stroke-linecap:round;
    pointer-events:none;
  }

  .vehicle-input-icon-wrap input{
    padding-left:42px;
  }

  .vehicle-search-footer{
    margin-top:14px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:12px;
    flex-wrap:wrap;
  }

  .vehicle-active-text{
    color:#64748b;
    font-size:13px;
    font-weight:850;
  }

  .vehicle-search-footer button{
    min-height:42px;
    padding:0 16px;
    border-radius:999px;
    border:1px solid #cbd5e1;
    background:#fff;
    color:#0f172a;
    font-size:13px;
    font-weight:900;
    cursor:pointer;
  }

  .vehicle-empty-result{
    background:#ffffff;
    border:1px solid #e2e8f0;
    border-radius:20px;
    padding:32px 20px;
    text-align:center;
    color:#64748b;
  }

  .vehicle-category-grid{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:22px;
    align-items:start;
    width:100%;
    max-width:1400px;
    margin:0 auto;
  }

  @media(max-width:1100px){
    .vehicle-filter-grid{
      grid-template-columns:repeat(3,minmax(0,1fr));
    }

    .vehicle-field-search{
      grid-column:1 / -1;
    }

    .vehicle-category-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
    }
  }

  @media(max-width:640px){
    .vehicle-category-head h2{
      font-size:23px;
    }

    .vehicle-search-panel{
      padding:13px;
      border-radius:22px;
      margin-bottom:16px;
    }

    .vehicle-search-top{
      align-items:center;
      margin-bottom:12px;
    }

    .vehicle-search-kicker{
      min-height:23px;
      font-size:10px;
    }

    .vehicle-search-top h3{
      font-size:20px;
    }

    .vehicle-search-count{
      min-width:72px;
      min-height:52px;
      border-radius:15px;
    }

    .vehicle-search-count span{
      font-size:20px;
    }

    .vehicle-filter-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px;
    }

    .vehicle-field-search{
      grid-column:1 / -1;
    }

    .vehicle-field label{
      font-size:11px;
      margin-bottom:6px;
    }

    .vehicle-field input,
    .vehicle-field select{
      height:46px;
      border-radius:13px;
      font-size:13px;
      padding:0 10px;
    }

    .vehicle-input-icon-wrap input{
      padding-left:38px;
    }

    .vehicle-search-footer{
      margin-top:12px;
    }

    .vehicle-search-footer button{
      min-height:40px;
      padding:0 14px;
    }

    .vehicle-category-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px;
      max-width:100%;
    }
  }
`;

const homeVehicleCss = `
  .home-vehicle-grid{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:16px;
    width:100%;
    align-items:start;
  }

  .home-vehicle-card{
    border-radius:24px;
    overflow:hidden;
    background:#ffffff;
    box-shadow:0 16px 34px rgba(15,23,42,0.08);
    border:1px solid rgba(226,232,240,0.9);
  }

  .home-vehicle-media{
    position:relative;
    min-height:260px;
    background:#cbd5e1;
    display:block;
    text-decoration:none;
  }

  .home-vehicle-img,
  .home-vehicle-noimg{
    width:100%;
    height:100%;
    display:block;
  }

  .home-vehicle-img{
    object-fit:cover;
    transition:transform .45s ease;
  }

  .home-vehicle-card:hover .home-vehicle-img{
    transform:scale(1.05);
  }

  .home-vehicle-noimg{
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(135deg,#cbd5e1,#94a3b8);
    color:#fff;
    font-size:18px;
    font-weight:800;
    min-height:260px;
  }

  .home-vehicle-overlay{
    position:absolute;
    inset:0;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    padding:16px;
    background:linear-gradient(
      to top,
      rgba(2,6,23,0.74) 0%,
      rgba(2,6,23,0.18) 44%,
      rgba(2,6,23,0.02) 100%
    );
    color:#fff;
  }

  .home-vehicle-top{
    display:flex;
    align-items:flex-start;
    justify-content:flex-start;
    gap:8px;
    flex-wrap:wrap;
  }

  .home-vehicle-badge,
  .home-vehicle-new,
  .home-vehicle-featured{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    border-radius:999px;
    font-size:11px;
    font-weight:900;
    line-height:1;
    min-height:28px;
    padding:6px 10px;
    border:1px solid rgba(255,255,255,0.38);
    backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);
  }

  .home-vehicle-badge{
    background:rgba(255,255,255,0.70);
    color:#0f172a;
  }

  .home-vehicle-new{
    background:rgba(6,182,212,0.70);
    color:#fff;
  }

  .home-vehicle-featured{
    background:rgba(245,158,11,0.72);
    color:#fff;
    min-width:28px;
    padding:6px 9px;
  }

  .home-vehicle-bottom h3{
    margin:0;
    font-size:18px;
    line-height:1.25;
    font-weight:900;
    letter-spacing:-0.02em;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
  }

  .home-vehicle-btn{
    margin-top:12px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    padding:11px 16px;
    border-radius:999px;
    background:rgba(255,255,255,0.14);
    border:1px solid rgba(255,255,255,0.22);
    color:#fff;
    font-size:13px;
    font-weight:800;
    backdrop-filter:blur(8px);
    cursor:pointer;
  }

  .home-vehicle-expand{
    max-height:0;
    overflow:hidden;
    transition:max-height .45s ease;
    background:#ffffff;
  }

  .home-vehicle-expand.show{
    max-height:520px;
  }

  .home-vehicle-expand-inner{
    padding:18px;
    border-top:1px solid #e2e8f0;
  }

  .home-vehicle-expand-head h4{
    margin:0;
    color:#0f172a;
    font-size:18px;
    font-weight:900;
    letter-spacing:-0.02em;
  }

  .home-vehicle-expand-head p{
    margin:8px 0 0;
    color:#64748b;
    font-size:14px;
    line-height:1.6;
  }

  .home-vehicle-specs{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:12px;
    margin-top:18px;
  }

  .home-vehicle-spec{
    border:1px solid #dbe3ee;
    border-radius:16px;
    padding:16px 12px;
    text-align:center;
    background:#f8fafc;
  }

  .home-vehicle-spec span{
    display:block;
    font-size:12px;
    color:#64748b;
    font-weight:700;
    margin-bottom:8px;
  }

  .home-vehicle-spec strong{
    display:block;
    font-size:18px;
    color:#0f172a;
    font-weight:900;
  }

  .home-vehicle-price-wrap{
    margin-top:18px;
    padding-top:16px;
    border-top:1px solid #e2e8f0;
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    gap:14px;
    flex-wrap:wrap;
  }

  .home-vehicle-price-label{
    display:block;
    font-size:12px;
    color:#64748b;
    font-weight:800;
    margin-bottom:6px;
  }

  .home-vehicle-price{
    font-size:24px;
    color:#0f172a;
    font-weight:900;
    letter-spacing:-0.03em;
  }

  .home-vehicle-detail-link{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-height:48px;
    padding:12px 18px;
    border-radius:14px;
    background:#16a34a;
    color:#fff;
    font-size:14px;
    font-weight:800;
    text-decoration:none;
    white-space:nowrap;
  }

  @media (max-width:1024px){
    .home-vehicle-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
    }
  }

  @media (max-width:640px){
    .home-vehicle-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px;
    }

    .home-vehicle-media,
    .home-vehicle-noimg{
      min-height:160px;
    }

    .home-vehicle-card{
      border-radius:18px;
    }

    .home-vehicle-overlay{
      padding:9px;
      background:linear-gradient(
        to top,
        rgba(2,6,23,0.66) 0%,
        rgba(2,6,23,0.12) 45%,
        rgba(2,6,23,0.01) 100%
      );
    }

    .home-vehicle-top{
      gap:5px;
    }

    .home-vehicle-badge,
    .home-vehicle-new,
    .home-vehicle-featured{
      min-height:22px;
      padding:5px 7px;
      font-size:9px;
    }

    .home-vehicle-bottom h3{
      font-size:13px;
    }

    .home-vehicle-btn{
      margin-top:7px;
      padding:8px 10px;
      font-size:10px;
    }

    .home-vehicle-expand-inner{
      padding:12px;
    }

    .home-vehicle-specs{
      grid-template-columns:1fr;
      gap:8px;
    }

    .home-vehicle-spec{
      padding:10px 8px;
    }

    .home-vehicle-spec strong{
      font-size:14px;
    }

    .home-vehicle-price{
      font-size:18px;
    }

    .home-vehicle-detail-link{
      width:100%;
      min-height:42px;
      font-size:12px;
    }
  }
`;