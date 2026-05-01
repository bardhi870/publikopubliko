import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";
import { getPostById } from "../../api/postApi";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const makeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[ë]/g, "e")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildMediaUrl = (url = "") => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const cleanUrl = String(url).startsWith("/") ? url : `/${url}`;
  return `${API_BASE}${cleanUrl}`;
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

const isVideoUrl = (url = "") => /\.(mp4|webm|mov|m4v)$/i.test(url);

const formatPrice = (price) => {
  if (!price) return "Me marrëveshje";
  return `${Number(price).toLocaleString("de-DE")} €`;
};

const getValue = (...values) => {
  const found = values.find(
    (v) => v !== undefined && v !== null && String(v).trim() !== ""
  );
  return found || "N/A";
};

const cleanHtml = (html = "") => {
  if (!html) return "";
  return String(html)
    .replace(/&amp;/g, "&")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
};

const normalizeCategory = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-");

const isFeaturedPost = (post) => {
  return (
    post?.featured === true ||
    post?.featured === 1 ||
    post?.featured === "1" ||
    post?.featured === "true" ||
    post?.is_featured === true ||
    post?.is_featured === 1 ||
    post?.is_featured === "1" ||
    post?.is_featured === "true"
  );
};

const getCoverImage = (post) => {
  const gallery = normalizeGalleryImages(post?.gallery_images);
  const image =
    post?.image_url ||
    gallery.find((item) => !isVideoUrl(item)) ||
    "https://placehold.co/420x260/eaf4ff/0f172a?text=Publiko";

  return buildMediaUrl(image);
};

const getRouteLink = (routeBase, item) => {
  const slug = makeSlug(item?.title || routeBase || "shpallje");
  return `/${routeBase}/${slug}-${item?.id}`;
};

const pickFeaturedOrLatest = (items) => {
  const sorted = [...items].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );

  const featured = sorted.filter(isFeaturedPost);
  return featured.length ? featured : sorted;
};

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M3 11L12 3L21 11" />
    <path d="M5 10V21H19V10" />
    <path d="M9 21V14H15V21" />
  </svg>
);

const AreaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M4 20H20" />
    <path d="M5 19V5" />
    <path d="M5 19L19 19L5 5V19Z" />
    <path d="M9 15H12" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M7 3V6" />
    <path d="M17 3V6" />
    <path d="M4 8H20" />
    <path d="M5 5H19V21H5V5Z" />
  </svg>
);

const RoomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M4 21V5H12V21" />
    <path d="M12 9H20V21" />
    <path d="M8 12H8.1" />
  </svg>
);

const BedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M4 11V20" />
    <path d="M20 14V20" />
    <path d="M4 15H20" />
    <path d="M6 11H11V15H4V13A2 2 0 0 1 6 11Z" />
    <path d="M11 15H20V13A3 3 0 0 0 17 10H11V15Z" />
  </svg>
);

const BathIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M5 12H21V14A5 5 0 0 1 16 19H10A5 5 0 0 1 5 14V12Z" />
    <path d="M7 12V5A2 2 0 0 1 9 3H11" />
    <path d="M14 6H10" />
    <path d="M8 19L7 21" />
    <path d="M18 19L19 21" />
  </svg>
);

const FloorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M5 19H19" />
    <path d="M7 17L17 7" />
    <path d="M8 13H12V9H16" />
  </svg>
);

const CompassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 21A9 9 0 1 0 12 3A9 9 0 0 0 12 21Z" />
    <path d="M15.5 8.5L13.5 14L8.5 15.5L10.5 10L15.5 8.5Z" />
  </svg>
);

const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 21S19 15.8 19 9A7 7 0 1 0 5 9C5 15.8 12 21 12 21Z" />
    <path d="M12 11.5A2.5 2.5 0 1 0 12 6.5A2.5 2.5 0 0 0 12 11.5Z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M22 16.9V20A2 2 0 0 1 19.8 22A19.8 19.8 0 0 1 2 4.2A2 2 0 0 1 4 2H7.1A2 2 0 0 1 9.1 3.7L9.8 6.7A2 2 0 0 1 9.2 8.6L7.9 9.9A16 16 0 0 0 14.1 16.1L15.4 14.8A2 2 0 0 1 17.3 14.2L20.3 14.9A2 2 0 0 1 22 16.9Z" />
  </svg>
);


const trackAnalyticsEvent = (eventType, postId, extra = {}) => {
  const payload = JSON.stringify({
    event_type: eventType,
    post_id: postId || null,
    page_url: window.location.pathname,
    ...extra
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(`${API_BASE}/api/analytics/track`, blob);
      return;
    }

    fetch(`${API_BASE}/api/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: payload,
      keepalive: true
    }).catch(() => {});
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
};

function FeaturedSidebarBox({ title, badge, items, routeBase, index }) {
  const visibleItems = useMemo(() => {
    if (!items.length) return [];
    if (items.length <= 3) return items.slice(0, 3);

    return Array.from({ length: 3 }, (_, i) => {
      return items[(index + i) % items.length];
    }).filter(Boolean);
  }, [items, index]);

  if (!visibleItems.length) return null;

  return (
    <div className="side-featured-box">
      <div className="side-featured-head">
        <h3>{title}</h3>
      </div>

      <div className="side-featured-list">
        {visibleItems.map((item) => (
          <Link
            to={getRouteLink(routeBase, item)}
            className="side-featured-card"
            key={`${routeBase}-${item.id}`}
          >
            <div className="side-featured-img">
              <img src={getCoverImage(item)} alt={item.title} loading="lazy" />
            </div>

            <div className="side-featured-info">
              <span>{badge}</span>
              <strong>{item.title}</strong>
              {item.price && <small>{formatPrice(item.price)}</small>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function RealEstateDetailsPage() {
  const params = useParams();

  const id = useMemo(() => {
    const raw = params.slug || params.id || "";
    const match = String(raw).match(/(\d+)$/);
    return match ? String(match[1]) : String(raw);
  }, [params.slug, params.id]);

  const [post, setPost] = useState(null);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [vehiclePosts, setVehiclePosts] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [vehicleSlideIndex, setVehicleSlideIndex] = useState(0);
  const [jobSlideIndex, setJobSlideIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    let ignore = false;

    const loadPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        if (!ignore) setPost(data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së pronës:", error);
        if (!ignore) setPost(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadPost();

    return () => {
      ignore = true;
    };
  }, [id]);
  useEffect(() => {
  const startTime = Date.now();

  return () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);

    trackAnalyticsEvent("time_on_page", post?.id || id, {
      duration_seconds: duration,
      category: post?.category || "patundshmeri"
    });
  };
}, [id, post?.id, post?.category]);

  useEffect(() => {
    let ignore = false;

    const loadSidebarAndSimilarPosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/posts`);
        const data = await res.json();
        if (ignore) return;

        const posts = Array.isArray(data) ? data : data?.posts || [];

        const realEstate = posts
          .filter((item) => String(item.id) !== String(id))
          .filter((item) =>
            normalizeCategory(item.category).includes("patundshmeri")
          )
          .sort(
            (a, b) =>
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
          );

        const vehicles = posts.filter((item) => {
          const cat = normalizeCategory(item.category);
          return (
            cat.includes("automjete") ||
            cat.includes("automjet") ||
            cat.includes("vetura") ||
            cat.includes("makina")
          );
        });

        const jobs = posts.filter((item) => {
          const cat = normalizeCategory(item.category);
          return (
            cat.includes("konkurse-pune") ||
            cat.includes("konkurs") ||
            cat.includes("pune") ||
            cat.includes("pun")
          );
        });

        setSimilarPosts(realEstate);
        setVehiclePosts(pickFeaturedOrLatest(vehicles));
        setJobPosts(pickFeaturedOrLatest(jobs));
      } catch (error) {
        console.error("Gabim gjatë marrjes së postimeve anësore:", error);
      }
    };

    loadSidebarAndSimilarPosts();

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    if (similarPosts.length <= 3) return;

    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % similarPosts.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [similarPosts.length]);

  useEffect(() => {
    if (vehiclePosts.length <= 3) return;

    const timer = setInterval(() => {
      setVehicleSlideIndex((prev) => (prev + 1) % vehiclePosts.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [vehiclePosts.length]);

  useEffect(() => {
    if (jobPosts.length <= 3) return;

    const timer = setInterval(() => {
      setJobSlideIndex((prev) => (prev + 1) % jobPosts.length);
    }, 4700);

    return () => clearInterval(timer);
  }, [jobPosts.length]);

  useEffect(() => {
    setActiveMediaIndex(0);
    setLightboxOpen(false);
  }, [post?.id]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  const city = getValue(post?.city, post?.location);
  const phone = getValue(post?.phone, post?.contact_phone);
  const whatsapp = getValue(post?.whatsapp, post?.whatsapp_number);
  const email = getValue(post?.email, post?.contact_email);

  const propertyType = getValue(
    post?.property_type,
    post?.type,
    post?.listing_type
  );
  const area = getValue(post?.area, post?.surface, post?.square_meters);
  const yearBuilt = getValue(
    post?.year_built,
    post?.construction_year,
    post?.year
  );
  const rooms = getValue(post?.rooms);
  const bedrooms = getValue(post?.bedrooms, post?.sleeping_rooms);
  const bathrooms = getValue(post?.bathrooms, post?.banjo);
  const floor = getValue(post?.floor, post?.kati);
  const orientation = getValue(post?.orientation, post?.orientim);
  const heating = getValue(post?.heating, post?.heating_system);
  const furnishing = getValue(post?.furnishing, post?.mobilimi);
  const features = getValue(
    post?.features,
    post?.amenities,
    post?.characteristics
  );

  const listingStatus = getValue(post?.status, post?.property_status);
  const listingPurpose = getValue(
    post?.purpose,
    post?.listing_purpose,
    post?.sale_type
  );
  const address = getValue(post?.address, post?.street);
  const neighborhood = getValue(post?.neighborhood, post?.lagjja);
  const parking = getValue(post?.parking, post?.garage);
  const elevator = getValue(post?.elevator, post?.lift);
  const balcony = getValue(post?.balcony, post?.terrace);
  const legalStatus = getValue(post?.legal_status, post?.documents);
  const ownership = getValue(post?.ownership, post?.owner_type);

  const pricePerM2 =
    post?.price && area !== "N/A" && Number(area)
      ? `${Math.round(Number(post.price) / Number(area)).toLocaleString(
          "de-DE"
        )} €/m²`
      : "N/A";

  const whatsappLink = useMemo(() => {
    const digits = String(whatsapp || "").replace(/\D/g, "");
    return digits && whatsapp !== "N/A" ? `https://wa.me/${digits}` : null;
  }, [whatsapp]);

  const phoneLink = phone && phone !== "N/A" ? `tel:${phone}` : null;
  const emailLink = email && email !== "N/A" ? `mailto:${email}` : null;

  const handlePhoneClick = () => {
    trackAnalyticsEvent("phone_click", post?.id);
  };

  const handleWhatsAppClick = () => {
    trackAnalyticsEvent("whatsapp_click", post?.id);
  };

  const handleEmailClick = () => {
    trackAnalyticsEvent("email_click", post?.id);
  };

  const mediaItems = useMemo(() => {
    const extra = normalizeGalleryImages(post?.gallery_images);
    const all = [post?.image_url, post?.video_url, ...extra]
      .filter(Boolean)
      .map(buildMediaUrl);

    return [...new Set(all)];
  }, [post]);

  const activeMedia = mediaItems[activeMediaIndex] || null;

  const visibleSimilarPosts = useMemo(() => {
  if (!similarPosts.length) return [];

  if (similarPosts.length <= 2) {
    return similarPosts.slice(0, 2);
  }

  return Array.from({ length: 2 }, (_, index) => {
    return similarPosts[(slideIndex + index) % similarPosts.length];
  }).filter(Boolean);
}, [similarPosts, slideIndex]);

  const specCards = [
    { icon: <HomeIcon />, label: "Lloji i pronës", value: propertyType },
    {
      icon: <AreaIcon />,
      label: "Sipërfaqja",
      value: area !== "N/A" ? `${area} m²` : "N/A"
    },
    { icon: <CalendarIcon />, label: "Viti i ndërtimit", value: yearBuilt },
    { icon: <RoomIcon />, label: "Dhomat", value: rooms },
    { icon: <BedIcon />, label: "Dhoma gjumi", value: bedrooms },
    { icon: <BathIcon />, label: "Banjo", value: bathrooms },
    { icon: <FloorIcon />, label: "Kati", value: floor },
    { icon: <CompassIcon />, label: "Orientimi", value: orientation },
    { icon: <HomeIcon />, label: "Qëllimi", value: listingPurpose },
    { icon: <AreaIcon />, label: "Çmimi / m²", value: pricePerM2 },
    { icon: <MapIcon />, label: "Lagjja", value: neighborhood },
    { icon: <MapIcon />, label: "Adresa", value: address },
    { icon: <HomeIcon />, label: "Parking/Garazh", value: parking },
    { icon: <FloorIcon />, label: "Ashensor", value: elevator },
    { icon: <HomeIcon />, label: "Ballkon/Terasë", value: balcony },
    { icon: <HomeIcon />, label: "Dokumentacioni", value: legalStatus },
    { icon: <HomeIcon />, label: "Pronësia", value: ownership },
    { icon: <HomeIcon />, label: "Statusi", value: listingStatus }
  ];

  const splitTags = (value) => {
    if (!value || value === "N/A") return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value)
      .split(/,|\|/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const featureTags = splitTags(features);
  const heatingTags = splitTags(heating);
  const furnishingTags = splitTags(furnishing);

  const goPrev = () => {
    if (!mediaItems.length) return;
    setActiveMediaIndex((prev) =>
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    if (!mediaItems.length) return;
    setActiveMediaIndex((prev) =>
      prev === mediaItems.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="property-page">
      <PublicHeader />

      <main className="property-wrap">
        {loading ? (
          <div className="property-state">Duke u ngarkuar...</div>
        ) : !post ? (
          <div className="property-state">Nuk u gjet prona.</div>
        ) : (
          <>
            <section className="property-hero">
              <div
                className="property-main-media"
                onClick={() =>
                  activeMedia &&
                  !isVideoUrl(activeMedia) &&
                  setLightboxOpen(true)
                }
                role="button"
                tabIndex={0}
              >
                {activeMedia ? (
                  isVideoUrl(activeMedia) ? (
                    <video
                      src={activeMedia}
                      controls
                      playsInline
                      className="property-media"
                    />
                  ) : (
                    <img
                      src={activeMedia}
                      alt={post.title || "Patundshmëri"}
                      className="property-media"
                      loading="eager"
                      decoding="async"
                    />
                  )
                ) : (
                  <div className="property-empty">Patundshmëri</div>
                )}

                {!isVideoUrl(activeMedia || "") && (
                  <div className="zoom-hint">Kliko foton për zmadhim</div>
                )}

                <div className="property-overlay" />

                <div className="property-badges">
                  <span>Patundshmëri</span>
                  <span>{propertyType}</span>
                  <span>{city}</span>
                </div>

                <div className="property-title-box">
                  <p>{area !== "N/A" ? `${area} m²` : "Prona"}</p>
                  <h1>{post.title}</h1>
                  <strong>{formatPrice(post.price)}</strong>
                </div>
              </div>

              {mediaItems.length > 1 && (
                <div className="property-thumbs">
                  {mediaItems.slice(0, 8).map((item, index) => (
                    <button
                      key={`${item}-${index}`}
                      type="button"
                      onClick={() => setActiveMediaIndex(index)}
                      className={activeMediaIndex === index ? "active" : ""}
                    >
                      {isVideoUrl(item) ? (
                        <video src={item} muted playsInline />
                      ) : (
                        <img src={item} alt={`Foto ${index + 1}`} loading="lazy" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="property-layout">
              <div className="property-content">
                <div className="property-price-card">
                  <div>
                    <span>Çmimi</span>
                    <strong>{formatPrice(post.price)}</strong>
                  </div>

                  <div className="property-actions">
                    {phoneLink && (
                      <a href={phoneLink} onClick={handlePhoneClick}>
                        <PhoneIcon /> Telefono
                      </a>
                    )}

                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="wa"
                        onClick={handleWhatsAppClick}
                      >
                        <PhoneIcon /> WhatsApp
                      </a>
                    )}

                    {emailLink && (
                      <a href={emailLink} onClick={handleEmailClick}>
                        Email
                      </a>
                    )}
                  </div>
                </div>

                <div className="property-spec-grid">
                  {specCards.map((item) => (
                    <div className="property-spec-card" key={item.label}>
                      <div className="spec-icon">{item.icon}</div>
                      <div>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="property-tags-box">
                  {featureTags.length > 0 && (
                    <div>
                      <h3>Karakteristikat</h3>
                      <div className="tag-list">
                        {featureTags.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {heatingTags.length > 0 && (
                    <div>
                      <h3>Sistemi i ngrohjes</h3>
                      <div className="tag-list">
                        {heatingTags.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {furnishingTags.length > 0 && (
                    <div>
                      <h3>Mobilimi</h3>
                      <div className="tag-list">
                        {furnishingTags.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="property-description">
                  <span>Përshkrimi</span>
                  <h2>Detajet e pronës</h2>

                  {post.description ? (
                    <div
                      className="property-html-description"
                      dangerouslySetInnerHTML={{
                        __html: cleanHtml(post.description)
                      }}
                    />
                  ) : (
                    <p>Nuk ka përshkrim për këtë pronë.</p>
                  )}
                </div>

                <div className="property-map-box">
                  <div className="section-title">
                    <span>
                      <MapIcon />
                    </span>
                    <h2>Lokacioni</h2>
                  </div>

                  {city !== "N/A" && <a className="location-link">{city}</a>}

                  <iframe
                    title="Lokacioni i pronës"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      city || "Pristina"
                    )}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {visibleSimilarPosts.length > 0 && (
                  <div className="similar-box">
                    <div className="similar-head">
                      <div>
                        <span>Shpallje të ngjashme</span>
                        <h2>Patundshmëri tjera</h2>
                      </div>

                      <div className="similar-controls">
                        <button
                          type="button"
                          onClick={() =>
                            setSlideIndex((prev) =>
                              prev === 0 ? similarPosts.length - 1 : prev - 1
                            )
                          }
                        >
                          ‹
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSlideIndex(
                              (prev) => (prev + 1) % similarPosts.length
                            )
                          }
                        >
                          ›
                        </button>
                      </div>
                    </div>

                    <div className="similar-grid">
                      {visibleSimilarPosts.map((item) => (
                        <Link
                          to={getRouteLink("patundshmeri", item)}
                          className="similar-card"
                          key={item.id}
                        >
                          <img src={getCoverImage(item)} alt={item.title} loading="lazy" />

                          <div>
                            <small>Patundshmëri</small>
                            <h3>{item.title}</h3>
                            <strong>{formatPrice(item.price)}</strong>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <aside className="property-sidebar">
                <div className="contact-box">
                  <span>Kontakt</span>
                  <h3>Kontakto direkt</h3>

                  {phone !== "N/A" && <p>{phone}</p>}
                  {whatsapp !== "N/A" && <p>{whatsapp}</p>}
                  {email !== "N/A" && <p>{email}</p>}

                  <div className="contact-buttons">
                    {phoneLink && (
                      <a href={phoneLink} onClick={handlePhoneClick}>
                        Tel
                      </a>
                    )}
                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleWhatsAppClick}
                      >
                        WA
                      </a>
                    )}
                    {emailLink && (
                      <a href={emailLink} onClick={handleEmailClick}>
                        Mail
                      </a>
                    )}
                  </div>
                </div>

                <FeaturedSidebarBox
                  title="Automjete të veçuara"
                  badge="Automjet"
                  items={vehiclePosts}
                  routeBase="automjete"
                  index={vehicleSlideIndex}
                />

                <FeaturedSidebarBox
                  title="Konkurse Pune të veçuara"
                  badge="Punë"
                  items={jobPosts}
                  routeBase="konkurse-pune"
                  index={jobSlideIndex}
                />
              </aside>
            </section>
          </>
        )}
      </main>

      {lightboxOpen && activeMedia && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button
            className="lightbox-close"
            onClick={() => setLightboxOpen(false)}
          >
            ×
          </button>

          {mediaItems.length > 1 && (
            <button
              className="lightbox-nav prev"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
            >
              ‹
            </button>
          )}

          <img
            src={activeMedia}
            alt={post?.title || "Patundshmëri"}
            onClick={(e) => e.stopPropagation()}
          />

          {mediaItems.length > 1 && (
            <button
              className="lightbox-nav next"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
            >
              ›
            </button>
          )}
        </div>
      )}

      <PublicFooter />

      <style>{`
  .property-page{
    min-height:100vh;
    background:#f8fbff;
    color:#07142d;
    -webkit-font-smoothing:antialiased;
    text-rendering:optimizeLegibility;
  }

  .property-wrap{
    width:min(100%,1700px);
    margin:0 auto;
    padding:88px 14px 58px;
  }

  .property-state{
    background:#fff;
    border:1px solid #e2e8f0;
    padding:20px;
    border-radius:18px;
    color:#475569;
    font-size:14px;
    font-weight:800;
    box-shadow:0 12px 34px rgba(15,23,42,.05);
  }

  .property-hero{
    display:grid;
    grid-template-columns:1fr;
    gap:8px;
    background:#fff;
    border:1px solid rgba(226,232,240,.95);
    border-radius:20px;
    padding:8px;
    overflow:hidden;
    box-shadow:0 14px 40px rgba(15,23,42,.055);
  }

  .property-main-media{
    position:relative;
    height:520px;
    border-radius:16px;
    overflow:hidden;
    background:#eef4ff;
    cursor:zoom-in;
  }

  .property-media{
    width:100%;
    height:100%;
    object-fit:cover;
    display:block;
    transition:none;
  }

  .property-empty{
    width:100%;
    height:100%;
    display:grid;
    place-items:center;
    font-size:28px;
    font-weight:950;
    background:#eef4ff;
  }

  .property-overlay{
    position:absolute;
    inset:0;
    pointer-events:none;
    background:linear-gradient(to top,rgba(0,0,0,.22),transparent 58%);
  }

  .zoom-hint{
    position:absolute;
    right:13px;
    bottom:13px;
    z-index:4;
    padding:7px 11px;
    border-radius:999px;
    background:rgba(255,255,255,.92);
    color:#07142d;
    font-size:10.5px;
    font-weight:950;
  }

  .property-badges{
    position:absolute;
    z-index:3;
    top:14px;
    left:14px;
    right:14px;
    display:flex;
    gap:6px;
    flex-wrap:wrap;
    pointer-events:none;
  }

  .property-badges span{
    min-height:29px;
    padding:0 10px;
    display:inline-flex;
    align-items:center;
    border-radius:999px;
    background:rgba(255,255,255,.92);
    color:#07142d;
    font-size:10.5px;
    font-weight:900;
  }

  .property-title-box{
    position:absolute;
    z-index:3;
    left:20px;
    right:20px;
    bottom:20px;
    color:#fff;
    pointer-events:none;
    text-shadow:0 10px 28px rgba(2,6,23,.35);
  }

  .property-title-box p{
    margin:0 0 6px;
    font-size:12px;
    font-weight:900;
    opacity:.92;
  }

  .property-title-box h1{
    margin:0;
    max-width:900px;
    font-size:40px;
    line-height:1;
    letter-spacing:-.045em;
    font-weight:950;
  }

  .property-title-box strong{
    display:block;
    margin-top:10px;
    font-size:25px;
    line-height:1;
    font-weight:950;
    color:#fff;
  }

  .property-thumbs{
    display:grid;
    grid-template-columns:repeat(8,minmax(0,1fr));
    gap:6px;
    padding:1px;
  }

  .property-thumbs button{
    width:100%;
    height:64px;
    border:1px solid #e2e8f0;
    padding:0;
    border-radius:9px;
    overflow:hidden;
    background:#eef4ff;
    cursor:pointer;
    transition:transform .18s ease,border-color .18s ease;
  }

  .property-thumbs button:hover{
    transform:scale(1.025);
  }

  .property-thumbs button.active{
    border:2px solid #c8d72f;
  }

  .property-thumbs img,
  .property-thumbs video{
    width:100%;
    height:100%;
    object-fit:contain;
    display:block;
    background:#eef4ff;
  }

  .property-layout{
    margin-top:16px;
    display:grid;
    grid-template-columns:minmax(0,1fr) 340px;
    gap:16px;
    align-items:start;
  }

  .property-content{
    display:grid;
    gap:16px;
    min-width:0;
  }

  .property-price-card,
  .property-description,
  .property-tags-box,
  .property-map-box,
  .contact-box,
  .similar-box,
  .side-featured-box{
    background:#fff;
    border:1px solid #e1e7ef;
    border-radius:17px;
    box-shadow:0 12px 34px rgba(15,23,42,.045);
  }

  .property-price-card{
    padding:18px;
    display:flex;
    justify-content:space-between;
    gap:14px;
    align-items:center;
  }

  .property-price-card span,
  .property-description>span,
  .contact-box span,
  .similar-head span{
    display:block;
    color:#64748b;
    font-size:10.5px;
    font-weight:900;
    margin-bottom:6px;
    text-transform:uppercase;
    letter-spacing:.055em;
  }

  .property-price-card strong{
    display:block;
    font-size:32px;
    line-height:1;
    letter-spacing:-.045em;
    font-weight:950;
  }

  .property-actions{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
    justify-content:flex-end;
  }

  .property-actions a{
    height:41px;
    padding:0 14px;
    display:inline-flex;
    gap:7px;
    align-items:center;
    justify-content:center;
    border-radius:12px;
    background:#07142d;
    color:#fff;
    text-decoration:none;
    font-size:11.5px;
    font-weight:950;
  }

  .property-actions a svg{
    width:15px;
    height:15px;
    stroke:currentColor;
    stroke-width:1.8;
  }

  .property-actions a.wa{
    background:#16a34a;
  }

  .property-spec-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:10px;
  }

  .property-spec-card{
    min-height:82px;
    display:flex;
    gap:10px;
    align-items:flex-start;
    padding:13px;
    border:1px solid #e1e7ef;
    border-radius:14px;
    background:#fff;
  }

  .spec-icon{
    width:34px;
    height:34px;
    flex:0 0 34px;
    border-radius:11px;
    display:grid;
    place-items:center;
    background:#fbfced;
    color:#a8b600;
  }

  .spec-icon svg,
  .section-title span svg{
    width:18px;
    height:18px;
    stroke:currentColor;
    stroke-width:1.8;
    stroke-linecap:round;
    stroke-linejoin:round;
  }

  .property-spec-card span{
    display:block;
    color:#64748b;
    font-size:11px;
    font-weight:850;
    margin-bottom:6px;
  }

  .property-spec-card strong{
    display:block;
    font-size:14px;
    line-height:1.18;
    color:#020b1f;
    font-weight:950;
    word-break:break-word;
  }

  .property-tags-box{
    padding:20px;
    display:grid;
    gap:20px;
  }

  .property-tags-box h3{
    margin:0 0 10px;
    font-size:18px;
    line-height:1.1;
    letter-spacing:-.03em;
  }

  .tag-list{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
  }

  .tag-list span{
    min-height:36px;
    display:inline-flex;
    align-items:center;
    padding:0 13px;
    border:1px solid #e1e7ef;
    border-radius:9px;
    background:#fff;
    color:#07142d;
    font-size:12.5px;
    font-weight:750;
  }

  .property-description{
    padding:22px;
  }

  .property-description h2{
    margin:0 0 13px;
    font-size:24px;
    line-height:1;
    letter-spacing:-.035em;
    font-weight:950;
  }

  .property-description p,
  .property-html-description p{
    margin:0 0 10px;
    color:#101827;
    font-size:14.5px;
    line-height:1.6;
  }

  .property-html-description{
    color:#101827;
    font-size:14.5px;
    line-height:1.6;
    word-break:break-word;
  }

  .property-html-description strong{
    color:#07142d;
    font-weight:950;
  }

  .section-title{
    display:flex;
    align-items:center;
    gap:10px;
    margin-bottom:13px;
  }

  .section-title span{
    width:38px;
    height:38px;
    border-radius:12px;
    display:grid;
    place-items:center;
    background:#fbfced;
    color:#a8b600;
  }

  .section-title h2{
    margin:0;
    font-size:25px;
    line-height:1;
    letter-spacing:-.04em;
    font-weight:950;
    color:#07142d;
  }

  .property-map-box{
    padding:20px;
  }

  .location-link{
    display:inline-flex;
    margin-bottom:13px;
    color:#2563eb;
    font-size:14px;
    font-weight:750;
    text-decoration:none;
  }

  .property-map-box iframe{
    width:100%;
    height:370px;
    border:0;
    display:block;
    background:#eef2f7;
    border-radius:13px;
  }

  .property-sidebar{
    position:sticky;
    top:94px;
    display:grid;
    gap:13px;
    min-width:0;
  }

  .contact-box{
    padding:16px;
  }

  .contact-box h3{
    margin:0 0 12px;
    font-size:20px;
    line-height:1;
    letter-spacing:-.035em;
    font-weight:950;
  }

  .contact-box p{
    margin:0 0 7px;
    background:#f8fafc;
    border:1px solid #e2e8f0;
    border-radius:12px;
    padding:10px;
    font-size:12.5px;
    line-height:1.35;
    font-weight:850;
    word-break:break-word;
  }

  .contact-buttons{
    display:flex;
    gap:7px;
    margin-top:11px;
    flex-wrap:wrap;
  }

  .contact-buttons a{
    flex:1;
    min-width:62px;
    height:38px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    border-radius:11px;
    background:#07142d;
    color:#fff;
    text-decoration:none;
    font-size:10.5px;
    font-weight:950;
  }

  .side-featured-box{
    padding:15px;
  }

  .side-featured-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    margin-bottom:11px;
  }

  .side-featured-head h3{
    margin:0;
    font-size:19px;
    line-height:1.06;
    letter-spacing:-.035em;
    font-weight:950;
    color:#07142d;
  }

  .side-featured-list{
    display:grid;
    gap:8px;
  }

  .side-featured-card{
    display:grid;
    grid-template-columns:82px 1fr;
    gap:9px;
    align-items:center;
    min-height:72px;
    padding:8px;
    border:1px solid #dbe4ef;
    border-radius:13px;
    background:#fff;
    text-decoration:none;
    color:#07142d;
    transition:border-color .2s ease,transform .2s ease,background .2s ease;
  }

  .side-featured-card:hover{
    transform:translateY(-2px);
    border-color:#c8d72f;
    background:#fbfdf4;
  }

  .side-featured-img{
    height:58px;
    background:#eaf4ff;
    overflow:hidden;
    display:grid;
    place-items:center;
    border-radius:10px;
  }

  .side-featured-img img{
    width:100%;
    height:100%;
    object-fit:contain;
    display:block;
    background:#eaf4ff;
  }

  .side-featured-info{
    min-width:0;
  }

  .side-featured-info span{
    display:inline-flex;
    margin-bottom:5px;
    background:#edf6ff;
    color:#075eea;
    padding:4px 7px;
    border-radius:999px;
    font-size:8.5px;
    font-weight:950;
    text-transform:uppercase;
  }

  .side-featured-info strong{
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
    margin:0;
    color:#07142d;
    font-size:12.5px;
    line-height:1.15;
    font-weight:950;
  }

  .side-featured-info small{
    display:block;
    margin-top:5px;
    color:#475569;
    font-size:10.5px;
    font-weight:900;
  }

  .similar-box{
    padding:20px;
  }

  .similar-head{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:12px;
    margin-bottom:14px;
  }

  .similar-head h2{
    margin:0;
    font-size:25px;
    line-height:1;
    letter-spacing:-.04em;
    font-weight:950;
  }

  .similar-controls{
    display:flex;
    gap:7px;
  }

  .similar-controls button{
    width:36px;
    height:36px;
    border:1px solid #e2e8f0;
    background:#fff;
    border-radius:999px;
    cursor:pointer;
    font-size:23px;
    line-height:1;
    font-weight:900;
    color:#07142d;
  }

  .similar-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:11px;
  }

  .similar-card{
    display:block;
    overflow:hidden;
    border:1px solid #e1e7ef;
    border-radius:15px;
    background:#fff;
    text-decoration:none;
    color:#07142d;
    transition:transform .22s ease,border-color .22s ease;
  }

  .similar-card:hover{
    transform:translateY(-3px);
    border-color:#c8d72f;
  }

  .similar-card img{
    width:100%;
    height:160px;
    object-fit:contain;
    display:block;
    background:#eef4ff;
  }

  .similar-card div{
    padding:12px;
  }

  .similar-card small{
    display:inline-flex;
    margin-bottom:7px;
    background:#fbfced;
    color:#8a9400;
    padding:4px 7px;
    border-radius:999px;
    font-size:8.5px;
    font-weight:950;
    text-transform:uppercase;
  }

  .similar-card h3{
    margin:0 0 8px;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
    font-size:14px;
    line-height:1.18;
    font-weight:950;
  }

  .similar-card strong{
    font-size:15.5px;
    font-weight:950;
  }

  .lightbox{
    position:fixed;
    inset:0;
    z-index:99999;
    background:rgba(2,6,23,.92);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px;
  }

  .lightbox img{
    max-width:96vw;
    max-height:92vh;
    object-fit:contain;
    border-radius:16px;
  }

  .lightbox-close{
    position:absolute;
    top:16px;
    right:20px;
    width:44px;
    height:44px;
    border:0;
    border-radius:999px;
    background:#fff;
    color:#07142d;
    font-size:30px;
    line-height:1;
    cursor:pointer;
    font-weight:900;
  }

  .lightbox-nav{
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    width:50px;
    height:50px;
    border:0;
    border-radius:999px;
    background:#fff;
    color:#07142d;
    font-size:36px;
    line-height:1;
    cursor:pointer;
    font-weight:900;
  }

  .lightbox-nav.prev{left:20px;}
  .lightbox-nav.next{right:20px;}

  @media(max-width:1180px){
    .property-layout{
      grid-template-columns:minmax(0,1fr) 315px;
    }

    .property-main-media{
      height:460px;
    }

    .property-spec-grid{
      grid-template-columns:repeat(2,1fr);
    }
  }

  @media(max-width:1020px){
    .property-wrap{
      padding-top:82px;
    }

    .property-layout{
      grid-template-columns:1fr;
    }

    .property-sidebar{
      position:relative;
      top:auto;
      grid-template-columns:1fr 1fr;
    }

    .contact-box{
      grid-column:1 / -1;
    }

    .property-main-media{
      height:410px;
    }

    .property-title-box h1{
      font-size:34px;
    }

    .property-thumbs{
      grid-template-columns:repeat(4,1fr);
    }

    .property-thumbs button{
      height:60px;
    }

    .property-price-card{
      flex-direction:column;
      align-items:flex-start;
    }

    .property-actions{
      justify-content:flex-start;
    }

    .similar-grid{
      grid-template-columns:1fr 1fr;
    }
  }

  @media(max-width:720px){
    .property-sidebar{
      grid-template-columns:1fr;
    }

    .property-main-media{
      height:335px;
    }

    .property-title-box h1{
      font-size:28px;
    }

    .property-title-box strong{
      font-size:22px;
    }
  }

  @media(max-width:620px){
    .property-wrap{
      padding:76px 8px 44px;
    }

    .property-hero{
      border-radius:17px;
      padding:6px;
      gap:6px;
    }

    .property-main-media{
      height:285px;
      border-radius:14px;
    }

    .property-thumbs{
      grid-template-columns:repeat(4,1fr);
      gap:5px;
      padding:0;
    }

    .property-thumbs button{
      height:50px;
      border-radius:8px;
    }

    .zoom-hint{
      display:none;
    }

    .property-badges{
      top:10px;
      left:10px;
      right:10px;
      gap:5px;
    }

    .property-badges span{
      min-height:25px;
      padding:0 8px;
      font-size:9px;
    }

    .property-title-box{
      left:13px;
      right:13px;
      bottom:13px;
    }

    .property-title-box p{
      font-size:10.5px;
      margin-bottom:5px;
    }

    .property-title-box h1{
      font-size:23px;
      line-height:1.05;
      letter-spacing:-.035em;
    }

    .property-title-box strong{
      margin-top:7px;
      font-size:19px;
    }

    .property-layout,
    .property-content{
      gap:12px;
    }

    .property-price-card{
      padding:15px;
      border-radius:15px;
    }

    .property-price-card strong{
      font-size:26px;
    }

    .property-actions{
      width:100%;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:7px;
    }

    .property-actions a{
      width:100%;
      height:40px;
      padding:0 8px;
      font-size:11px;
      border-radius:11px;
    }

    .property-actions a:last-child:nth-child(3){
      grid-column:1 / -1;
    }

    .property-spec-grid{
      grid-template-columns:repeat(2,1fr);
      gap:7px;
    }

    .property-spec-card{
      min-height:88px;
      padding:10px;
      flex-direction:column;
      gap:7px;
      border-radius:13px;
    }

    .spec-icon{
      width:30px;
      height:30px;
      flex-basis:30px;
      border-radius:10px;
    }

    .spec-icon svg{
      width:16px;
      height:16px;
    }

    .property-spec-card span{
      font-size:10px;
      margin-bottom:4px;
    }

    .property-spec-card strong{
      font-size:12.5px;
      line-height:1.16;
    }

    .property-tags-box,
    .property-description,
    .property-map-box{
      padding:15px 13px;
      border-radius:15px;
    }

    .property-tags-box{
      gap:16px;
    }

    .property-tags-box h3{
      font-size:16px;
    }

    .tag-list{
      gap:6px;
    }

    .tag-list span{
      min-height:32px;
      padding:0 10px;
      font-size:11.5px;
      border-radius:8px;
    }

    .property-description h2{
      font-size:20px;
      margin-bottom:11px;
    }

    .property-description p,
    .property-html-description,
    .property-html-description p{
      font-size:13.5px;
      line-height:1.6;
    }

    .section-title{
      gap:9px;
      margin-bottom:11px;
    }

    .section-title span{
      width:34px;
      height:34px;
      border-radius:10px;
    }

    .section-title h2{
      font-size:20px;
    }

    .location-link{
      font-size:12.5px;
      margin-bottom:10px;
    }

    .property-map-box iframe{
      height:270px;
      border-radius:11px;
    }

    .contact-box,
    .side-featured-box{
      padding:14px;
      border-radius:15px;
    }

    .contact-box h3{
      font-size:18px;
    }

    .contact-box p{
      font-size:12px;
      padding:9px;
      border-radius:11px;
    }

    .contact-buttons a{
      height:36px;
      font-size:10px;
      border-radius:10px;
    }

    .side-featured-head h3{
      font-size:17px;
    }

    .side-featured-card{
      grid-template-columns:78px 1fr;
      min-height:70px;
      gap:8px;
      padding:7px;
      border-radius:12px;
    }

    .side-featured-img{
      height:54px;
      border-radius:9px;
    }

    .side-featured-info span{
      font-size:8px;
      padding:4px 6px;
    }

    .side-featured-info strong{
      font-size:12px;
    }

    .side-featured-info small{
      font-size:10px;
    }

    .similar-box{
      padding:15px 13px;
      border-radius:16px;
      overflow:hidden;
    }

    .similar-head{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:10px;
      margin-bottom:12px;
    }

    .similar-head span{
      font-size:10px;
      margin-bottom:5px;
    }

    .similar-head h2{
      font-size:21px;
      line-height:1;
    }

    .similar-controls{
      display:flex;
      gap:8px;
      flex-shrink:0;
    }

    .similar-controls button{
      width:36px;
      height:36px;
      font-size:24px;
      border-radius:999px;
    }

    .similar-grid{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px;
    }

    .similar-card{
      border-radius:14px;
      overflow:hidden;
    }

    .similar-card img{
      height:145px;
      object-fit:cover;
      background:#eef4ff;
    }

    .similar-card div{
      padding:10px;
    }

    .similar-card small{
      font-size:8px;
      padding:4px 7px;
      margin-bottom:7px;
    }

    .similar-card h3{
      font-size:12.5px;
      line-height:1.18;
      min-height:30px;
      margin-bottom:7px;
    }

    .similar-card strong{
      font-size:13.5px;
    }

    .lightbox{
      padding:10px;
    }

    .lightbox-close{
      top:10px;
      right:10px;
      width:38px;
      height:38px;
      font-size:27px;
    }

    .lightbox-nav{
      width:38px;
      height:38px;
      font-size:31px;
    }

    .lightbox-nav.prev{left:8px;}
    .lightbox-nav.next{right:8px;}
  }

  @media(max-width:420px){
    .property-main-media{
      height:250px;
    }

    .property-title-box h1{
      font-size:20px;
    }

    .property-title-box strong{
      font-size:18px;
    }

    .property-actions{
      grid-template-columns:1fr;
    }

    .property-actions a:last-child:nth-child(3){
      grid-column:auto;
    }

    .property-spec-grid{
      gap:6px;
    }

    .property-spec-card{
      min-height:84px;
      padding:9px;
    }

    .property-spec-card strong{
      font-size:12px;
    }

    .similar-grid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:8px;
    }

    .similar-card img{
      height:128px;
    }

    .similar-card div{
      padding:9px;
    }

    .similar-card h3{
      font-size:11.5px;
      min-height:28px;
    }

    .similar-card strong{
      font-size:12.5px;
    }
  }
`}</style>
    </div>
  );
}