import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPostsByCategory } from "../../api/postApi";
import VehiclePostCard from "./VehiclePostCard";


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
  return postClean === selectedClean || postClean.includes(selectedClean) || selectedClean.includes(postClean);
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
  return (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 3;
};

const stripHtml = (html = "") =>
  String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

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

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width:640px)").matches : false
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);

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
        if (!ignore) setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gabim gjatë marrjes së postimeve:", error);
        if (!ignore) setPosts([]);
      } finally {
        if (!ignore) setLoading(false);
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
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

    const featured = sortNewest(filtered.filter((post) => post.featured));
    const fresh = sortNewest(filtered.filter((post) => !post.featured && isPostNew(post.created_at)));
    const normal = sortNewest(filtered.filter((post) => !post.featured && !isPostNew(post.created_at)));

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
    vehicleSearch || selectedVehicleCity || selectedFuel || selectedGearbox || selectedYear;

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
              <div key={post.id || index} className={`home-vehicle-card ${isExpanded ? "expanded" : ""}`}>
                <Link to={`/automjete/${post.id}`} className="home-vehicle-media">
                  {postImage ? (
                    <img
                      src={postImage}
                      alt={post.title || "Automjet"}
                      className="home-vehicle-img"
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  ) : (
                    <div className="home-vehicle-noimg">Automjet</div>
                  )}

                  <div className="home-vehicle-overlay">
                    <div className="home-vehicle-top">
                      <span className="home-vehicle-badge">Automjet</span>
                      {isPostNew(post.created_at) && <span className="home-vehicle-new">E RE</span>}
                      {post.featured && <span className="home-vehicle-featured">⭐</span>}
                    </div>

                    <div className="home-vehicle-bottom">
                      <h3>{post.title || "Automjet"}</h3>

                      <button
                        type="button"
                        className="home-vehicle-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setExpandedCardId((prev) => (prev === post.id ? null : post.id));
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

                      <Link to={`/automjete/${post.id}`} className="home-vehicle-detail-link">
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
            className={`vehicle-mobile-filter-btn ${showMobileFilters ? "active" : ""}`}
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
              {hasActiveFilters ? "Filtrat janë aktivë" : "Shfaqen të gjitha automjetet"}
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

const homeVehicleCss = `
  .home-vehicle-grid{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:14px;
    width:100%;
    align-items:start;
  }

  .home-vehicle-card{
    border-radius:22px;
    overflow:hidden;
    background:#ffffff;
    box-shadow:0 16px 34px rgba(15,23,42,0.075);
    border:1px solid rgba(226,232,240,0.92);
  }

  .home-vehicle-media{
    position:relative;
    min-height:250px;
    background:#cbd5e1;
    display:block;
    text-decoration:none;
    overflow:hidden;
  }

  .home-vehicle-img,
  .home-vehicle-noimg{
    width:100%;
    height:100%;
    display:block;
  }

  .home-vehicle-img{
    object-fit:cover;
    transition:transform .35s ease;
  }

  .home-vehicle-card:hover .home-vehicle-img{
    transform:scale(1.04);
  }

  .home-vehicle-noimg{
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(135deg,#cbd5e1,#94a3b8);
    color:#fff;
    font-size:17px;
    font-weight:900;
    min-height:250px;
  }

  .home-vehicle-overlay{
    position:absolute;
    inset:0;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    padding:15px;
    background:linear-gradient(to top,rgba(2,6,23,.72),rgba(2,6,23,.16) 48%,rgba(2,6,23,.02));
    color:#fff;
  }

  .home-vehicle-top{
    display:flex;
    align-items:flex-start;
    gap:7px;
    flex-wrap:wrap;
  }

  .home-vehicle-badge,
  .home-vehicle-new,
  .home-vehicle-featured{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    border-radius:999px;
    font-size:10.5px;
    font-weight:950;
    line-height:1;
    min-height:27px;
    padding:6px 10px;
    border:1px solid rgba(255,255,255,.34);
    backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);
  }

  .home-vehicle-badge{
    background:rgba(255,255,255,.78);
    color:#0f172a;
  }

  .home-vehicle-new{
    background:rgba(6,182,212,.72);
    color:#fff;
  }

  .home-vehicle-featured{
    background:rgba(245,158,11,.78);
    color:#fff;
    min-width:28px;
    padding:6px 9px;
  }

  .home-vehicle-bottom h3{
    margin:0;
    font-size:17px;
    line-height:1.22;
    font-weight:950;
    letter-spacing:-.02em;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
  }

  .home-vehicle-btn{
    margin-top:11px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    padding:10px 14px;
    border-radius:999px;
    background:rgba(255,255,255,.15);
    border:1px solid rgba(255,255,255,.22);
    color:#fff;
    font-size:12.5px;
    font-weight:900;
    backdrop-filter:blur(8px);
    cursor:pointer;
  }

  .home-vehicle-expand{
    max-height:0;
    overflow:hidden;
    transition:max-height .35s ease;
    background:#ffffff;
  }

  .home-vehicle-expand.show{
    max-height:520px;
  }

  .home-vehicle-expand-inner{
    padding:16px;
    border-top:1px solid #e2e8f0;
  }

  .home-vehicle-expand-head h4{
    margin:0;
    color:#0f172a;
    font-size:17px;
    font-weight:950;
    letter-spacing:-.02em;
  }

  .home-vehicle-expand-head p{
    margin:7px 0 0;
    color:#64748b;
    font-size:13px;
    line-height:1.55;
  }

  .home-vehicle-specs{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:10px;
    margin-top:16px;
  }

  .home-vehicle-spec{
    border:1px solid #dbe3ee;
    border-radius:15px;
    padding:13px 10px;
    text-align:center;
    background:#f8fafc;
  }

  .home-vehicle-spec span{
    display:block;
    font-size:11px;
    color:#64748b;
    font-weight:850;
    margin-bottom:7px;
  }

  .home-vehicle-spec strong{
    display:block;
    font-size:15px;
    color:#0f172a;
    font-weight:950;
  }

  .home-vehicle-price-wrap{
    margin-top:16px;
    padding-top:15px;
    border-top:1px solid #e2e8f0;
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    gap:12px;
    flex-wrap:wrap;
  }

  .home-vehicle-price-label{
    display:block;
    font-size:11px;
    color:#64748b;
    font-weight:900;
    margin-bottom:5px;
  }

  .home-vehicle-price{
    font-size:22px;
    color:#0f172a;
    font-weight:950;
    letter-spacing:-.03em;
  }

  .home-vehicle-detail-link{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-height:44px;
    padding:10px 16px;
    border-radius:14px;
    background:#16a34a;
    color:#fff;
    font-size:13px;
    font-weight:900;
    text-decoration:none;
    white-space:nowrap;
  }

  @media(max-width:1024px){
    .home-vehicle-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
    }
  }

  @media(max-width:640px){
    .home-vehicle-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:9px;
    }

    .home-vehicle-card{
      border-radius:17px;
    }

    .home-vehicle-media,
    .home-vehicle-noimg{
      min-height:158px;
    }

    .home-vehicle-overlay{
      padding:9px;
      background:linear-gradient(to top,rgba(2,6,23,.66),rgba(2,6,23,.12) 48%,rgba(2,6,23,.01));
    }

    .home-vehicle-top{
      gap:5px;
    }

    .home-vehicle-badge,
    .home-vehicle-new,
    .home-vehicle-featured{
      min-height:22px;
      padding:5px 7px;
      font-size:8.7px;
    }

    .home-vehicle-bottom h3{
      font-size:12.5px;
      line-height:1.18;
    }

    .home-vehicle-btn{
      margin-top:7px;
      padding:8px 9px;
      font-size:9.8px;
    }

    .home-vehicle-expand-inner{
      padding:11px;
    }

    .home-vehicle-expand-head h4{
      font-size:13px;
    }

    .home-vehicle-expand-head p{
      font-size:11.5px;
      line-height:1.45;
    }

    .home-vehicle-specs{
      grid-template-columns:1fr;
      gap:7px;
      margin-top:11px;
    }

    .home-vehicle-spec{
      padding:9px 7px;
      border-radius:12px;
    }

    .home-vehicle-spec span{
      font-size:10px;
      margin-bottom:5px;
    }

    .home-vehicle-spec strong{
      font-size:12.5px;
    }

    .home-vehicle-price{
      font-size:17px;
    }

    .home-vehicle-detail-link{
      width:100%;
      min-height:39px;
      font-size:11.5px;
      border-radius:12px;
    }
  }
`;