import React, { useEffect, useMemo, useState } from "react";
import { getPostsByCategory } from "../../api/postApi";
import RealEstatePostCard from "./RealEstatePostCard";
import RealEstatePostCardHome from "./RealEstatePostCardHome";

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c");

const isPostNew = (createdAt) => {
  if (!createdAt) return false;
  return (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 3;
};

const isFeatured = (post) =>
  post?.featured === true ||
  post?.featured === 1 ||
  post?.featured === "1" ||
  post?.featured === "true" ||
  post?.is_featured === true ||
  post?.is_featured === 1 ||
  post?.is_featured === "1" ||
  post?.is_featured === "true";

const stripHtml = (html = "") =>
  String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeListingType = (post) => {
  const raw = normalize(
    post?.listing_type ||
      post?.listingType ||
      post?.price_type ||
      post?.purpose ||
      post?.type ||
      post?.sale_type ||
      post?.transaction_type ||
      ""
  );

  if (raw.includes("shit") || raw.includes("sale") || raw.includes("sell")) {
    return "shitje";
  }

  if (raw.includes("qira") || raw.includes("rent") || raw.includes("lease")) {
    return "qira";
  }

  return raw;
};

const shufflePosts = (items) =>
  [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);

export default function RealEstateCategoryPosts({
  title,
  category,
  variant,
  initialLimit = 4
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [realEstateSearch, setRealEstateSearch] = useState("");
  const [selectedRealEstateCity, setSelectedRealEstateCity] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedListingType, setSelectedListingType] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const isHomeVariant = variant === "home";

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

      const query = normalize(realEstateSearch);
      const postTitle = normalize(post.title);
      const postDescription = normalize(stripHtml(post.description));
      const postCity = normalize(post.city || post.location);
      const postPropertyType = normalize(post.property_type || post.propertyType);
      const postListingType = normalizeListingType(post);
      const selectedListing = normalizeListingType({ listing_type: selectedListingType });

      const matchesQuery =
        !query ||
        postTitle.includes(query) ||
        postDescription.includes(query) ||
        postCity.includes(query) ||
        postPropertyType.includes(query) ||
        postListingType.includes(query);

      return (
        matchesQuery &&
        (!selectedRealEstateCity ||
          postCity.includes(normalize(selectedRealEstateCity))) &&
        (!selectedPropertyType ||
          postPropertyType.includes(normalize(selectedPropertyType))) &&
        (!selectedListingType || postListingType === selectedListing)
      );
    });

    const sortNewest = (items) =>
      [...items].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );

    const featured = sortNewest(filtered.filter(isFeatured));
    const fresh = sortNewest(
      filtered.filter((post) => !isFeatured(post) && isPostNew(post.created_at))
    );
    const normal = sortNewest(
      filtered.filter((post) => !isFeatured(post) && !isPostNew(post.created_at))
    );

    if (isHomeVariant) {
      const rotatedFeatured = shufflePosts(featured);
      const rotatedNormal = shufflePosts(normal);
      return [...rotatedFeatured, ...fresh, ...rotatedNormal].slice(0, initialLimit);
    }

    return [...featured, ...fresh, ...normal];
  }, [
    posts,
    realEstateSearch,
    selectedRealEstateCity,
    selectedPropertyType,
    selectedListingType,
    isHomeVariant,
    initialLimit
  ]);

  const clearRealEstateFilters = () => {
    setRealEstateSearch("");
    setSelectedRealEstateCity("");
    setSelectedPropertyType("");
    setSelectedListingType("");
    setShowMobileFilters(false);
  };

  if (loading) {
    return <p className="realestate-loading">Duke u ngarkuar...</p>;
  }

  if (isHomeVariant) {
    return (
      <div className="home-clean-grid">
        {filteredPosts.slice(0, initialLimit).map((post, index) => (
          <RealEstatePostCardHome
            key={post.id || index}
            post={post}
            index={index}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="realestate-section">
      {title ? (
        <div className="realestate-head">
          <div className="realestate-head-titlebox">
            <span>Patundshmëri</span>
            <h2 className="realestate-title">{title}</h2>
          </div>
        </div>
      ) : null}

      <div className="realestate-mobile-filter-row">
        <button
          type="button"
          onClick={() => setShowMobileFilters((prev) => !prev)}
          className={`realestate-filter-toggle ${
            showMobileFilters ? "active" : ""
          }`}
        >
          {showMobileFilters ? "Mbyll filtrat" : "Filtrat"}
        </button>
      </div>

      <div className={`realestate-filters ${showMobileFilters ? "show" : ""}`}>
        <div className="realestate-filter-grid">
          <div>
            <label>Kërko pronë</label>
            <input
              type="text"
              placeholder="Titulli, qyteti..."
              value={realEstateSearch}
              onChange={(e) => setRealEstateSearch(e.target.value)}
            />
          </div>

          <div>
            <label>Qyteti</label>
            <input
              type="text"
              placeholder="Shkruaj qytetin..."
              value={selectedRealEstateCity}
              onChange={(e) => setSelectedRealEstateCity(e.target.value)}
            />
          </div>

          <div>
            <label>Lloji i pronës</label>
            <input
              type="text"
              placeholder="P.sh. banesë, shtëpi..."
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
            />
          </div>

          <div>
            <label>Shitje / Qira</label>
            <select
              value={selectedListingType}
              onChange={(e) => setSelectedListingType(e.target.value)}
            >
              <option value="">Të gjitha</option>
              <option value="shitje">Shitje</option>
              <option value="qira">Qira</option>
            </select>
          </div>
        </div>

        <div className="realestate-filter-bottom">
          <div>
            Prona të gjetura: <strong>{filteredPosts.length}</strong>
          </div>

          <button type="button" onClick={clearRealEstateFilters}>
            Largo filtrat
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="realestate-empty">Nuk u gjet asnjë patundshmëri.</div>
      ) : (
        <div className="realestate-post-grid">
          {filteredPosts.map((post, index) => (
            <RealEstatePostCard
              key={post.id || index}
              post={post}
              index={index}
            />
          ))}
        </div>
      )}

      <style>{categoryCss}</style>
    </section>
  );
}

const categoryCss = `
  .realestate-loading{
    width:100%;
    padding:18px;
    border:1px solid #e2e8f0;
    border-radius:18px;
    background:#fff;
    color:#64748b;
    font-size:13px;
    font-weight:800;
  }

  .realestate-section{
    width:100%;
    max-width:1640px;
    margin:0 auto 54px;
    position:relative;
    padding:0 4px;
  }

  .realestate-head{
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

  .realestate-head-titlebox span{
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

  .realestate-title{
    margin:0;
    font-size:clamp(30px,3.4vw,48px);
    line-height:.96;
    font-weight:950;
    letter-spacing:-.06em;
    color:#07142d;
  }

  .realestate-mobile-filter-row{
    display:none;
    justify-content:flex-end;
    margin-bottom:12px;
  }

  .realestate-filter-toggle{
    height:44px;
    padding:0 18px;
    border-radius:999px;
    border:1px solid rgba(191,219,254,.95);
    background:linear-gradient(135deg,#ffffff,#eff6ff);
    color:#1d4ed8;
    cursor:pointer;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    box-shadow:0 12px 26px rgba(37,99,235,.10);
    font-size:13px;
    font-weight:950;
  }

  .realestate-filter-toggle.active{
    background:linear-gradient(135deg,#1d4ed8,#0284c7);
    color:#fff;
  }

  .realestate-filters{
    position:relative;
    overflow:hidden;
    background:
      radial-gradient(circle at 7% 0%, rgba(37,99,235,.10), transparent 30%),
      radial-gradient(circle at 96% 8%, rgba(14,165,233,.10), transparent 28%),
      linear-gradient(180deg, rgba(255,255,255,.99), rgba(248,251,255,.95));
    border:1px solid rgba(191,219,254,.88);
    border-radius:26px;
    padding:18px;
    box-shadow:
      0 18px 44px rgba(15,23,42,.06),
      inset 0 1px 0 rgba(255,255,255,.85);
    margin-bottom:18px;
  }

  .realestate-filter-grid{
    display:grid;
    grid-template-columns:1.45fr repeat(3,minmax(0,1fr));
    gap:12px;
    align-items:end;
  }

  .realestate-filter-grid label{
    display:block;
    font-size:10.5px;
    font-weight:950;
    color:#334155;
    margin-bottom:7px;
    letter-spacing:.02em;
  }

  .realestate-filter-grid input,
  .realestate-filter-grid select{
    width:100%;
    height:44px;
    padding:0 13px;
    border-radius:15px;
    border:1px solid #dbeafe;
    outline:none;
    font-size:13px;
    font-weight:750;
    background:rgba(255,255,255,.96);
    color:#0f172a;
    box-sizing:border-box;
    box-shadow:0 8px 18px rgba(15,23,42,.035);
    transition:border-color .18s ease, box-shadow .18s ease, background .18s ease;
  }

  .realestate-filter-grid input:focus,
  .realestate-filter-grid select:focus{
    border-color:#60a5fa;
    box-shadow:0 0 0 4px rgba(37,99,235,.10);
    background:#fff;
  }

  .realestate-filter-grid select{
    cursor:pointer;
    appearance:none;
    -webkit-appearance:none;
    background-image:linear-gradient(45deg, transparent 50%, #2563eb 50%), linear-gradient(135deg, #2563eb 50%, transparent 50%);
    background-position:calc(100% - 18px) 18px, calc(100% - 12px) 18px;
    background-size:6px 6px, 6px 6px;
    background-repeat:no-repeat;
    padding-right:36px;
  }

  .realestate-filter-bottom{
    margin-top:13px;
    display:flex;
    justify-content:space-between;
    gap:10px;
    flex-wrap:wrap;
    align-items:center;
    color:#64748b;
    font-size:13px;
    font-weight:850;
  }

  .realestate-filter-bottom strong{
    color:#1d4ed8;
    font-weight:950;
  }

  .realestate-filter-bottom button{
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

  .realestate-empty{
    background:#fff;
    border:1px solid #e2e8f0;
    border-radius:20px;
    padding:32px 20px;
    text-align:center;
    color:#64748b;
    font-size:13px;
    font-weight:850;
  }

  .realestate-post-grid{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:15px;
    align-items:start;
    width:100%;
    max-width:1420px;
    margin:0 auto;
  }

  @media(max-width:1100px){
    .realestate-filter-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
    }

    .realestate-filter-grid > div:first-child{
      grid-column:1 / -1;
    }

    .realestate-post-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:12px;
    }
  }

  @media(max-width:640px){
    .realestate-section{
      margin-bottom:34px;
      padding:0 10px;
    }

    .realestate-head{
      padding:18px 16px;
      border-radius:22px;
      margin-bottom:12px;
    }

    .realestate-head-titlebox span{
      font-size:9px;
      padding:6px 10px;
      margin-bottom:8px;
    }

    .realestate-title{
      font-size:32px;
      line-height:.95;
    }

    .realestate-mobile-filter-row{
      display:flex;
    }

    .realestate-filter-toggle{
      height:42px;
      padding:0 14px;
      font-size:12px;
    }

    .realestate-filters{
      display:none;
      padding:14px;
      border-radius:22px;
      margin-bottom:14px;
    }

    .realestate-filters.show{
      display:block;
    }

    .realestate-filter-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px;
    }

    .realestate-filter-grid > div:first-child{
      grid-column:1 / -1;
    }

    .realestate-filter-grid label{
      font-size:10.5px;
      margin-bottom:6px;
    }

    .realestate-filter-grid input,
  .realestate-filter-grid select{
      height:46px;
      border-radius:14px;
      font-size:13px;
      padding:0 12px;
    }

    .realestate-filter-bottom{
      font-size:12px;
      margin-top:12px;
    }

    .realestate-filter-bottom button{
      min-height:42px;
      padding:0 15px;
      font-size:12px;
    }

    .realestate-post-grid{
      grid-template-columns:1fr;
      gap:12px;
    }
  }

  @media(max-width:360px){
    .realestate-title{
      font-size:29px;
    }

    .realestate-filter-grid input,
  .realestate-filter-grid select{
      height:42px;
      font-size:12.5px;
    }
  }
`;
