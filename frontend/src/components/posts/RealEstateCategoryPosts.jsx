import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPostsByCategory } from "../../api/postApi";
import RealEstatePostCard from "./RealEstatePostCard";


const normalize = (value) => String(value || "").trim().toLowerCase();

const makeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[ë]/g, "e")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

const isFeatured = (post) =>
  post?.featured === true ||
  post?.featured === 1 ||
  post?.featured === "1" ||
  post?.featured === "true" ||
  post?.is_featured === true ||
  post?.is_featured === 1 ||
  post?.is_featured === "1" ||
  post?.is_featured === "true";

const formatPrice = (price) => {
  if (!price) return "Sipas marrëveshjes";
  return `${Number(price).toLocaleString("de-DE")} €`;
};

const getPostImage = (post) => {
  const galleryImages = normalizeGalleryImages(post?.gallery_images);
  return post?.image_url || post?.image || galleryImages[0] || "";
};

export default function RealEstateCategoryPosts({ title, category, variant }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [realEstateSearch, setRealEstateSearch] = useState("");
  const [selectedRealEstateCity, setSelectedRealEstateCity] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedListingType, setSelectedListingType] = useState("");

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);

  const isHomeVariant = variant === "home";

  useEffect(() => {
    let ignore = false;

    const fetchPosts = async () => {
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
    };

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
      const postDescription = normalize(post.description);
      const postCity = normalize(post.city);
      const postPropertyType = normalize(post.property_type || post.propertyType);
      const postListingType = normalize(post.listing_type || post.listingType);

      return (
        (!query ||
          postTitle.includes(query) ||
          postDescription.includes(query) ||
          postCity.includes(query) ||
          postPropertyType.includes(query) ||
          postListingType.includes(query)) &&
        (!selectedRealEstateCity ||
          postCity.includes(normalize(selectedRealEstateCity))) &&
        (!selectedPropertyType ||
          postPropertyType.includes(normalize(selectedPropertyType))) &&
        (!selectedListingType ||
          postListingType.includes(normalize(selectedListingType)))
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
    const oldNormal = sortNewest(
      filtered.filter((post) => !isFeatured(post) && !isPostNew(post.created_at))
    );

    return [...featured, ...fresh, ...oldNormal];
  }, [
    posts,
    realEstateSearch,
    selectedRealEstateCity,
    selectedPropertyType,
    selectedListingType,
    isHomeVariant
  ]);

  const clearRealEstateFilters = () => {
    setRealEstateSearch("");
    setSelectedRealEstateCity("");
    setSelectedPropertyType("");
    setSelectedListingType("");
    setShowMobileFilters(false);
  };

  if (loading) {
    return (
      <div className="realestate-loading">
        <span>Duke u ngarkuar...</span>

        <style>{`
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
        `}</style>
      </div>
    );
  }

  if (isHomeVariant) {
    return (
      <>
        <div className="home-realestate-grid">
          {filteredPosts.slice(0, 6).map((post, index) => {
            const postImage = getPostImage(post);
            const isExpanded = expandedCardId === post.id;
            const detailUrl = `/patundshmeri/${makeSlug(
              post?.title || "prona"
            )}-${post.id}`;

            return (
              <div
                key={post.id || index}
                className={`home-realestate-card ${isExpanded ? "expanded" : ""}`}
              >
                <Link to={detailUrl} className="home-realestate-media">
                  {postImage ? (
                    <img
                      src={postImage}
                      alt={post.title || "Patundshmëri"}
                      className="home-realestate-image"
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  ) : (
                    <div className="home-realestate-noimage">Patundshmëri</div>
                  )}

                  <div className="home-realestate-overlay">
                    <div className="home-realestate-top">
                      <span className="home-realestate-badge">Patundshmëri</span>

                      {isPostNew(post.created_at) ? (
                        <span className="home-realestate-new">E RE</span>
                      ) : null}

                      {isFeatured(post) ? (
                        <span className="home-realestate-featured">⭐</span>
                      ) : null}

                      {post.city ? (
                        <span className="home-realestate-city">{post.city}</span>
                      ) : null}
                    </div>

                    <div className="home-realestate-bottom">
                      <h3>{post.title || "Patundshmëri"}</h3>

                      <button
                        type="button"
                        className="home-realestate-btn"
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

                <div className={`home-realestate-expand ${isExpanded ? "show" : ""}`}>
                  <div className="home-realestate-expand-inner">
                    <div className="home-realestate-expand-head">
                      <h4>{post.title || "Patundshmëri"}</h4>
                      <p>{post.description || "Shiko detajet e pronës."}</p>
                    </div>

                    <div className="home-realestate-specs">
                      <div className="home-realestate-spec">
                        <span>Lloji</span>
                        <strong>{post.property_type || post.propertyType || "—"}</strong>
                      </div>

                      <div className="home-realestate-spec">
                        <span>Qyteti</span>
                        <strong>{post.city || "—"}</strong>
                      </div>

                      <div className="home-realestate-spec">
                        <span>Shitje / Qira</span>
                        <strong>{post.listing_type || post.listingType || "—"}</strong>
                      </div>
                    </div>

                    <div className="home-realestate-price-wrap">
                      <div>
                        <span className="home-realestate-price-label">Çmimi</span>
                        <div className="home-realestate-price">
                          {formatPrice(post.price)}
                        </div>
                      </div>

                      <Link to={detailUrl} className="home-realestate-detail-link">
                        Shiko detajet
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <style>{`
          .home-realestate-grid{
            display:grid;
            grid-template-columns:repeat(3,minmax(0,1fr));
            gap:14px;
            width:100%;
            align-items:start;
          }

          .home-realestate-card{
            border-radius:20px;
            overflow:hidden;
            background:#fff;
            box-shadow:0 14px 32px rgba(15,23,42,.07);
            border:1px solid rgba(226,232,240,.95);
            contain:layout paint;
          }

          .home-realestate-media{
            position:relative;
            min-height:245px;
            background:#eaf2ff;
            display:block;
            text-decoration:none;
            overflow:hidden;
          }

          .home-realestate-image,
          .home-realestate-noimage{
            width:100%;
            height:100%;
            display:block;
          }

          .home-realestate-image{
            object-fit:cover;
            transition:transform .35s ease;
          }

          @media(hover:hover){
            .home-realestate-card:hover .home-realestate-image{
              transform:scale(1.035);
            }
          }

          .home-realestate-noimage{
            min-height:245px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:linear-gradient(135deg,#dbeafe,#94a3b8);
            color:#fff;
            font-size:15px;
            font-weight:900;
          }

          .home-realestate-overlay{
            position:absolute;
            inset:0;
            display:flex;
            flex-direction:column;
            justify-content:space-between;
            padding:13px;
            background:linear-gradient(to top,rgba(2,6,23,.72) 0%,rgba(2,6,23,.16) 45%,rgba(2,6,23,.02) 100%);
            color:#fff;
          }

          .home-realestate-top{
            display:flex;
            align-items:flex-start;
            gap:6px;
            flex-wrap:wrap;
          }

          .home-realestate-badge,
          .home-realestate-city,
          .home-realestate-new,
          .home-realestate-featured{
            display:inline-flex;
            align-items:center;
            justify-content:center;
            border-radius:999px;
            font-size:9.5px;
            font-weight:950;
            line-height:1;
            min-height:25px;
            padding:5px 8px;
            border:1px solid rgba(255,255,255,.32);
            backdrop-filter:blur(8px);
            -webkit-backdrop-filter:blur(8px);
          }

          .home-realestate-badge{
            background:rgba(255,255,255,.78);
            color:#0f172a;
          }

          .home-realestate-city{
            background:rgba(15,23,42,.48);
            color:#fff;
          }

          .home-realestate-new{
            background:rgba(6,182,212,.78);
            color:#fff;
          }

          .home-realestate-featured{
            background:rgba(245,158,11,.78);
            color:#fff;
            min-width:25px;
          }

          .home-realestate-bottom h3{
            margin:0;
            font-size:16px;
            line-height:1.18;
            font-weight:950;
            letter-spacing:-.02em;
            display:-webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient:vertical;
            overflow:hidden;
          }

          .home-realestate-btn{
            margin-top:9px;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            padding:9px 13px;
            border-radius:999px;
            background:rgba(255,255,255,.16);
            border:1px solid rgba(255,255,255,.24);
            color:#fff;
            font-size:11.5px;
            font-weight:900;
            backdrop-filter:blur(8px);
            cursor:pointer;
          }

          .home-realestate-expand{
            max-height:0;
            overflow:hidden;
            transition:max-height .35s ease;
            background:#fff;
          }

          .home-realestate-expand.show{
            max-height:520px;
          }

          .home-realestate-expand-inner{
            padding:15px;
            border-top:1px solid #e2e8f0;
          }

          .home-realestate-expand-head h4{
            margin:0;
            color:#0f172a;
            font-size:16px;
            font-weight:950;
            letter-spacing:-.02em;
          }

          .home-realestate-expand-head p{
            margin:7px 0 0;
            color:#64748b;
            font-size:12.5px;
            line-height:1.55;
            display:-webkit-box;
            -webkit-line-clamp:3;
            -webkit-box-orient:vertical;
            overflow:hidden;
          }

          .home-realestate-specs{
            display:grid;
            grid-template-columns:repeat(3,minmax(0,1fr));
            gap:9px;
            margin-top:14px;
          }

          .home-realestate-spec{
            border:1px solid #dbe3ee;
            border-radius:13px;
            padding:11px 8px;
            text-align:center;
            background:#f8fafc;
          }

          .home-realestate-spec span{
            display:block;
            font-size:10px;
            color:#64748b;
            font-weight:800;
            margin-bottom:6px;
          }

          .home-realestate-spec strong{
            display:block;
            font-size:13px;
            color:#0f172a;
            font-weight:950;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }

          .home-realestate-price-wrap{
            margin-top:14px;
            padding-top:13px;
            border-top:1px solid #e2e8f0;
            display:flex;
            align-items:flex-end;
            justify-content:space-between;
            gap:10px;
            flex-wrap:wrap;
          }

          .home-realestate-price-label{
            display:block;
            font-size:10px;
            color:#64748b;
            font-weight:900;
            margin-bottom:5px;
            text-transform:uppercase;
          }

          .home-realestate-price{
            font-size:20px;
            color:#0f172a;
            font-weight:950;
            letter-spacing:-.03em;
          }

          .home-realestate-detail-link{
            display:inline-flex;
            align-items:center;
            justify-content:center;
            min-height:42px;
            padding:10px 14px;
            border-radius:12px;
            background:#16a34a;
            color:#fff;
            font-size:12px;
            font-weight:900;
            text-decoration:none;
            white-space:nowrap;
          }

          @media(max-width:1024px){
            .home-realestate-grid{
              grid-template-columns:repeat(2,minmax(0,1fr));
            }
          }

          @media(max-width:640px){
            .home-realestate-grid{
              grid-template-columns:repeat(2,minmax(0,1fr));
              gap:9px;
            }

            .home-realestate-card{
              border-radius:15px;
            }

            .home-realestate-media,
            .home-realestate-noimage{
              min-height:155px;
            }

            .home-realestate-overlay{
              padding:9px;
            }

            .home-realestate-badge,
            .home-realestate-city,
            .home-realestate-new,
            .home-realestate-featured{
              min-height:22px;
              padding:4px 6px;
              font-size:8px;
            }

            .home-realestate-bottom h3{
              font-size:12.5px;
            }

            .home-realestate-btn{
              margin-top:7px;
              padding:8px 10px;
              font-size:10px;
            }

            .home-realestate-expand-inner{
              padding:11px;
            }

            .home-realestate-expand-head h4{
              font-size:13.5px;
            }

            .home-realestate-expand-head p{
              font-size:11.5px;
              -webkit-line-clamp:2;
            }

            .home-realestate-specs{
              grid-template-columns:1fr;
              gap:7px;
            }

            .home-realestate-spec{
              padding:8px;
              text-align:left;
            }

            .home-realestate-spec strong{
              font-size:12px;
            }

            .home-realestate-price{
              font-size:16px;
            }

            .home-realestate-detail-link{
              width:100%;
              min-height:38px;
              font-size:11px;
            }
          }

          @media(max-width:390px){
            .home-realestate-grid{
              gap:8px;
            }

            .home-realestate-media,
            .home-realestate-noimage{
              min-height:140px;
            }

            .home-realestate-bottom h3{
              font-size:11.5px;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
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
            className="realestate-filter-toggle"
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
              <input
                type="text"
                placeholder="P.sh. shitje, qira..."
                value={selectedListingType}
                onChange={(e) => setSelectedListingType(e.target.value)}
              />
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
          <div className="realestate-empty">
            Nuk u gjet asnjë patundshmëri.
          </div>
        ) : (
          <div className="realestate-post-grid">
            {filteredPosts.map((post, index) => (
              <RealEstatePostCard key={post.id || index} post={post} index={index} />
            ))}
          </div>
        )}
      </section>

      <style>{`
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

        .realestate-head::after{
          content:"";
          position:absolute;
          inset:auto 18px 0 18px;
          height:1px;
          background:linear-gradient(90deg, transparent, rgba(37,99,235,.42), transparent);
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

        .realestate-head-titlebox span::before{
          content:"";
          width:7px;
          height:7px;
          border-radius:999px;
          background:#2563eb;
          box-shadow:0 0 0 4px rgba(37,99,235,.12);
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

        .realestate-filters::before{
          content:"";
          position:absolute;
          left:18px;
          right:18px;
          top:0;
          height:1px;
          background:linear-gradient(90deg, transparent, rgba(37,99,235,.35), transparent);
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

        .realestate-filter-grid input{
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

        .realestate-filter-grid input:focus{
          border-color:#60a5fa;
          box-shadow:0 0 0 4px rgba(37,99,235,.10);
          background:#fff;
        }

        .realestate-filter-grid input::placeholder{
          color:#94a3b8;
          font-weight:750;
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
            padding:0;
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

          .realestate-filter-grid input{
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
}
  .realestate-post-grid{
  gap:12px;
}

.realestate-section{
  padding:0 10px;
}
        }

        @media(max-width:360px){
          .realestate-title{
            font-size:29px;
          }

          .realestate-filter-grid input{
            height:42px;
            font-size:12.5px;
          }
        }

        @media(max-width:330px){
          .realestate-post-grid{
            grid-template-columns:1fr;
          }
        }
      `}</style>
    </>
  );
}