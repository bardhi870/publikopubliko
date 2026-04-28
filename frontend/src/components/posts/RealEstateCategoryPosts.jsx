import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPostsByCategory } from "../../api/postApi";
import RealEstatePostCard from "./RealEstatePostCard";
import {
  CITY_OPTIONS,
  REAL_ESTATE_LISTING_OPTIONS,
  REAL_ESTATE_PROPERTY_OPTIONS
} from "../../constants/postFilterOptions";

const searchWrapStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 12px 30px rgba(15,23,42,0.04)",
  marginBottom: "20px"
};

const fieldLabelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: "800",
  color: "#475569",
  marginBottom: "8px"
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #dbe3ee",
  outline: "none",
  fontSize: "15px",
  background: "#fff",
  boxSizing: "border-box"
};

const clearBtnStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  fontWeight: "700",
  cursor: "pointer"
};

const titleStyle = {
  margin: 0,
  fontSize: "28px",
  fontWeight: "800",
  color: "#0f172a"
};

const mobileFilterIconBtnStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  border: "1px solid #dbe3ee",
  background: "#fff",
  color: "#0f172a",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)"
};

const normalize = (value) => String(value || "").trim().toLowerCase();

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

export default function RealEstateCategoryPosts({ title, category, variant }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [realEstateSearch, setRealEstateSearch] = useState("");
  const [selectedRealEstateCity, setSelectedRealEstateCity] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedListingType, setSelectedListingType] = useState("");

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

  const filterGridColumns =
    screenWidth > 1280
      ? "repeat(4, minmax(0, 1fr))"
      : screenWidth > 950
      ? "repeat(3, minmax(0, 1fr))"
      : screenWidth > 640
      ? "repeat(2, minmax(0, 1fr))"
      : "1fr";

  const cardGridColumns =
    screenWidth > 1100
      ? "repeat(3, minmax(0, 1fr))"
      : screenWidth > 640
      ? "repeat(2, minmax(0, 1fr))"
      : "1fr";

  const filteredPosts = useMemo(() => {
    const filtered = [...posts].filter((post) => {
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

    const featured = sortNewest(filtered.filter((post) => post.featured));

    const fresh = sortNewest(
      filtered.filter((post) => !post.featured && isPostNew(post.created_at))
    );

    const oldNormal = filtered.filter(
      (post) => !post.featured && !isPostNew(post.created_at)
    );

    if (isHomeVariant) {
      return [...featured, ...fresh, ...sortNewest(oldNormal)];
    }

    const rotatedOldNormal = [...oldNormal].sort(() => Math.random() - 0.5);

    return [...featured, ...fresh, ...rotatedOldNormal];
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
      <p style={{ marginTop: "14px", color: "#475569" }}>
        Duke u ngarkuar...
      </p>
    );
  }

  if (isHomeVariant) {
    return (
      <>
        <div className="home-realestate-grid">
          {filteredPosts.slice(0, 6).map((post, index) => {
            const galleryImages = normalizeGalleryImages(post.gallery_images);
            const postImage = post?.image_url || post?.image || galleryImages[0] || "";
            const isExpanded = expandedCardId === post.id;

            return (
              <div
                key={post.id || index}
                className={`home-realestate-card ${isExpanded ? "expanded" : ""}`}
              >
                <Link to={`/post/${post.id}`} className="home-realestate-media">
                  {postImage ? (
                    <img
                      src={postImage}
                      alt={post.title || "Patundshmëri"}
                      className="home-realestate-image"
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

                      {post.featured ? (
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
                        <span className="home-realestate-price-label">ÇMIMI</span>
                        <div className="home-realestate-price">
                          {post.price ? `${post.price} €` : "Sipas marrëveshjes"}
                        </div>
                      </div>

                      <Link to={`/post/${post.id}`} className="home-realestate-detail-link">
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
            gap:16px;
            width:100%;
            align-items:start;
          }

          .home-realestate-card{
            border-radius:24px;
            overflow:hidden;
            background:#ffffff;
            box-shadow:0 16px 34px rgba(15,23,42,0.08);
            border:1px solid rgba(226,232,240,0.9);
          }

          .home-realestate-media{
            position:relative;
            min-height:260px;
            background:#cbd5e1;
            display:block;
            text-decoration:none;
          }

          .home-realestate-image,
          .home-realestate-noimage{
            width:100%;
            height:100%;
            display:block;
          }

          .home-realestate-image{
            object-fit:cover;
            transition:transform .45s ease;
          }

          .home-realestate-card:hover .home-realestate-image{
            transform:scale(1.05);
          }

          .home-realestate-noimage{
            display:flex;
            align-items:center;
            justify-content:center;
            background:linear-gradient(135deg,#cbd5e1,#94a3b8);
            color:#fff;
            font-size:18px;
            font-weight:800;
            min-height:260px;
          }

          .home-realestate-overlay{
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

          .home-realestate-top{
            display:flex;
            align-items:flex-start;
            justify-content:flex-start;
            gap:8px;
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
            font-size:11px;
            font-weight:900;
            line-height:1;
            min-height:28px;
            padding:6px 10px;
            border:1px solid rgba(255,255,255,0.38);
            backdrop-filter:blur(10px);
            -webkit-backdrop-filter:blur(10px);
          }

          .home-realestate-badge{
            background:rgba(255,255,255,0.70);
            color:#0f172a;
          }

          .home-realestate-city{
            background:rgba(15,23,42,0.46);
            color:#fff;
          }

          .home-realestate-new{
            background:rgba(6,182,212,0.70);
            color:#fff;
          }

          .home-realestate-featured{
            background:rgba(245,158,11,0.72);
            color:#fff;
            min-width:28px;
            padding:6px 9px;
          }

          .home-realestate-bottom h3{
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

          .home-realestate-btn{
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

          .home-realestate-expand{
            max-height:0;
            overflow:hidden;
            transition:max-height .45s ease;
            background:#ffffff;
          }

          .home-realestate-expand.show{
            max-height:520px;
          }

          .home-realestate-expand-inner{
            padding:18px;
            border-top:1px solid #e2e8f0;
          }

          .home-realestate-expand-head h4{
            margin:0;
            color:#0f172a;
            font-size:18px;
            font-weight:900;
            letter-spacing:-0.02em;
          }

          .home-realestate-expand-head p{
            margin:8px 0 0;
            color:#64748b;
            font-size:14px;
            line-height:1.6;
          }

          .home-realestate-specs{
            display:grid;
            grid-template-columns:repeat(3,minmax(0,1fr));
            gap:12px;
            margin-top:18px;
          }

          .home-realestate-spec{
            border:1px solid #dbe3ee;
            border-radius:16px;
            padding:16px 12px;
            text-align:center;
            background:#f8fafc;
          }

          .home-realestate-spec span{
            display:block;
            font-size:12px;
            color:#64748b;
            font-weight:700;
            margin-bottom:8px;
          }

          .home-realestate-spec strong{
            display:block;
            font-size:18px;
            color:#0f172a;
            font-weight:900;
          }

          .home-realestate-price-wrap{
            margin-top:18px;
            padding-top:16px;
            border-top:1px solid #e2e8f0;
            display:flex;
            align-items:flex-end;
            justify-content:space-between;
            gap:14px;
            flex-wrap:wrap;
          }

          .home-realestate-price-label{
            display:block;
            font-size:12px;
            color:#64748b;
            font-weight:800;
            margin-bottom:6px;
          }

          .home-realestate-price{
            font-size:24px;
            color:#0f172a;
            font-weight:900;
            letter-spacing:-0.03em;
          }

          .home-realestate-detail-link{
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
            .home-realestate-grid{
              grid-template-columns:repeat(2,minmax(0,1fr));
            }
          }

          @media (max-width:640px){
            .home-realestate-grid{
              grid-template-columns:1fr;
              gap:12px;
            }

            .home-realestate-media,
            .home-realestate-noimage{
              min-height:180px;
            }

            .home-realestate-card{
              border-radius:20px;
            }

            .home-realestate-overlay{
              padding:10px;
              background:linear-gradient(
                to top,
                rgba(2,6,23,0.66) 0%,
                rgba(2,6,23,0.12) 45%,
                rgba(2,6,23,0.01) 100%
              );
            }

            .home-realestate-top{
              gap:6px;
            }

            .home-realestate-badge,
            .home-realestate-city,
            .home-realestate-new,
            .home-realestate-featured{
              min-height:24px;
              padding:5px 8px;
              font-size:10px;
            }

            .home-realestate-featured{
              min-width:24px;
              padding:5px 7px;
            }

            .home-realestate-bottom h3{
              font-size:14px;
            }

            .home-realestate-btn{
              margin-top:8px;
              padding:9px 12px;
              font-size:11px;
            }

            .home-realestate-expand-inner{
              padding:14px;
            }

            .home-realestate-specs{
              grid-template-columns:repeat(3,minmax(0,1fr));
              gap:10px;
            }

            .home-realestate-spec{
              padding:12px 8px;
            }

            .home-realestate-spec strong{
              font-size:16px;
            }

            .home-realestate-price{
              font-size:20px;
            }

            .home-realestate-detail-link{
              width:100%;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <section style={{ marginBottom: "40px" }}>
      {title ? (
        <h2
          style={{
            ...titleStyle,
            fontSize: isMobile ? "22px" : "28px",
            marginBottom: "18px"
          }}
        >
          {title}
        </h2>
      ) : null}

      {!isHomeVariant && isMobile && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            style={mobileFilterIconBtnStyle}
          >
            Filtrat
          </button>
        </div>
      )}

      {!isHomeVariant && (!isMobile || showMobileFilters) && (
        <div style={{ ...searchWrapStyle, padding: isMobile ? "14px" : "18px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: filterGridColumns,
              gap: isMobile ? "12px" : "16px"
            }}
          >
            <div>
              <label style={fieldLabelStyle}>Kërko pronë</label>
              <input
                type="text"
                placeholder="Titulli, përshkrimi, qyteti..."
                value={realEstateSearch}
                onChange={(e) => setRealEstateSearch(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={fieldLabelStyle}>Qyteti</label>
              <select
                value={selectedRealEstateCity}
                onChange={(e) => setSelectedRealEstateCity(e.target.value)}
                style={inputStyle}
              >
                <option value="">Të gjitha qytetet</option>
                {CITY_OPTIONS.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={fieldLabelStyle}>Lloji i pronës</label>
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                style={inputStyle}
              >
                <option value="">Të gjitha</option>
                {REAL_ESTATE_PROPERTY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={fieldLabelStyle}>Shitje / Qira</label>
              <select
                value={selectedListingType}
                onChange={(e) => setSelectedListingType(e.target.value)}
                style={inputStyle}
              >
                <option value="">Të gjitha</option>
                {REAL_ESTATE_LISTING_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap"
            }}
          >
            <div style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
              Gjithsej prona:{" "}
              <span style={{ color: "#0f172a", fontWeight: "800" }}>
                {filteredPosts.length}
              </span>
            </div>

            <button type="button" onClick={clearRealEstateFilters} style={clearBtnStyle}>
              Largo filtrat
            </button>
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            padding: "32px 20px",
            textAlign: "center",
            color: "#64748b"
          }}
        >
          Nuk u gjet asnjë patundshmëri.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cardGridColumns,
            gap: isMobile ? "14px" : "22px",
            alignItems: "start",
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto"
          }}
        >
          {filteredPosts.map((post, index) => (
            <RealEstatePostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}