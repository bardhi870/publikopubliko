import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";
import { getPostById } from "../../api/postApi";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

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

const normalizeCategory = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-");

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

const getDetailLink = (post) => {
  const category = normalizeCategory(post?.category);

  if (category.includes("patundshmeri")) return `/patundshmeri/${post.id}`;
  if (category.includes("konkurse") || category.includes("pune")) {
    return `/konkurse-pune/${post.id}`;
  }
  if (category.includes("automjete")) return `/automjete/${post.id}`;

  return `/kategori/${post?.category || ""}`;
};

const getPostImage = (post) => {
  const gallery = normalizeGalleryImages(post?.gallery_images);
  const firstImage = gallery.find((item) => !isVideoUrl(item));

  return (
    post?.image_url ||
    firstImage ||
    "https://placehold.co/700x460/eaf6ff/07142d?text=Automjet"
  );
};

const getRotatedPosts = (items, rotateIndex) => {
  if (!items.length) return [];
  if (items.length <= 3) return items.slice(0, 3);

  return Array.from({ length: 3 }, (_, index) => {
    return items[(rotateIndex + index) % items.length];
  }).filter(Boolean);
};

const FeaturedBox = ({ title, label, posts }) => (
  <div className="featured-box">
    <div className="featured-head">
      <h3>{title}</h3>
    </div>

    {posts.length > 0 ? (
      posts.map((item) => (
        <Link to={getDetailLink(item)} className="featured-card" key={item.id}>
          <img src={getPostImage(item)} alt={item.title} loading="lazy" />
          <div>
            <small>{label}</small>
            <strong>{item.title}</strong>
          </div>
        </Link>
      ))
    ) : (
      <div className="no-featured">Nuk ka postime të veçuara.</div>
    )}
  </div>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M4 13L6.1 7.8C6.5 6.7 7.6 6 8.8 6H15.2C16.4 6 17.5 6.7 17.9 7.8L20 13" />
    <path d="M5 13H19V18H5V13Z" />
    <path d="M7 18V20" />
    <path d="M17 18V20" />
    <path d="M7.5 15.5H7.6" />
    <path d="M16.4 15.5H16.5" />
  </svg>
);

const SpeedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M5 16A7 7 0 1 1 19 16" />
    <path d="M12 16L16 10" />
    <path d="M8 16H16" />
  </svg>
);

const GearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5A3.5 3.5 0 0 0 12 15.5Z" />
    <path d="M19.4 15A8.4 8.4 0 0 0 19.5 9L21 7L18 4L16 5.5A8.4 8.4 0 0 0 10 5.4L8 4L5 7L6.5 9A8.4 8.4 0 0 0 6.4 15L5 17L8 20L10 18.5A8.4 8.4 0 0 0 16 18.6L18 20L21 17L19.4 15Z" />
  </svg>
);

const FuelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M7 3H14V21H7V3Z" />
    <path d="M14 8H16.5L19 10.5V18C19 19.1 18.1 20 17 20H14" />
    <path d="M9 7H12" />
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

const WheelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 21A9 9 0 1 0 12 3A9 9 0 0 0 12 21Z" />
    <path d="M12 15A3 3 0 1 0 12 9A3 3 0 0 0 12 15Z" />
    <path d="M12 3V9" />
    <path d="M12 15V21" />
    <path d="M3 12H9" />
    <path d="M15 12H21" />
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

export default function VehicleDetailsPage() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [propertySidePosts, setPropertySidePosts] = useState([]);
  const [jobSidePosts, setJobSidePosts] = useState([]);
  const [similarVehiclePosts, setSimilarVehiclePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [rotateIndex, setRotateIndex] = useState(0);
  const [similarIndex, setSimilarIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së automjetit:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  useEffect(() => {
    const loadRelatedPosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/posts`);
        const data = await res.json();
        const posts = Array.isArray(data) ? data : data?.posts || [];

        const otherPosts = posts
          .filter((item) => Number(item.id) !== Number(id))
          .sort(
            (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
          );

        const featuredPosts = otherPosts.filter(
          (item) =>
            item.featured === true ||
            item.featured === "true" ||
            item.is_featured === true
        );

        setPropertySidePosts(
          featuredPosts.filter((item) =>
            normalizeCategory(item.category).includes("patundshmeri")
          )
        );

        setJobSidePosts(
          featuredPosts.filter((item) => {
            const category = normalizeCategory(item.category);
            return category.includes("konkurse") || category.includes("pune");
          })
        );

        setSimilarVehiclePosts(
          otherPosts.filter((item) =>
            normalizeCategory(item.category).includes("automjete")
          )
        );
      } catch (error) {
        console.error("Gabim gjatë marrjes së postimeve të ngjashme:", error);
      }
    };

    loadRelatedPosts();
  }, [id]);

  useEffect(() => {
    const maxLength = Math.max(propertySidePosts.length, jobSidePosts.length);
    if (maxLength <= 3) return;

    const timer = setInterval(() => {
      setRotateIndex((prev) => (prev + 1) % maxLength);
    }, 4500);

    return () => clearInterval(timer);
  }, [propertySidePosts.length, jobSidePosts.length]);



  useEffect(() => {
    setActiveMediaIndex(0);
    setLightboxOpen(false);
    setRotateIndex(0);
    setSimilarIndex(0);
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

  const mileage = getValue(post?.mileage, post?.kilometers);
  const power = getValue(post?.power, post?.horsepower, post?.hp);
  const transmission = getValue(post?.gearbox, post?.transmission);
  const driveType = getValue(post?.drive_type, post?.system, post?.drivetrain);
  const fuelType = getValue(post?.fuel, post?.fuel_type);
  const year = getValue(post?.year, post?.vehicle_year);

  const bodyType = getValue(post?.body_type, post?.vehicle_type);
  const series = getValue(post?.series);
  const doors = getValue(post?.doors);
  const seats = getValue(post?.seats);
  const exteriorColor = getValue(post?.exterior_color, post?.color);
  const interiorColor = getValue(post?.interior_color);
  const weight = getValue(post?.weight);
  const engineCapacity = getValue(post?.engine_capacity, post?.engine);
  const condition = getValue(post?.condition, post?.vehicle_condition);

  const whatsappLink = useMemo(() => {
    const digits = String(whatsapp || "").replace(/\D/g, "");
    return digits && whatsapp !== "N/A" ? `https://wa.me/${digits}` : null;
  }, [whatsapp]);

  const phoneLink = phone && phone !== "N/A" ? `tel:${phone}` : null;
  const emailLink = email && email !== "N/A" ? `mailto:${email}` : null;

  const mediaItems = useMemo(() => {
    const extra = normalizeGalleryImages(post?.gallery_images);
    const all = [post?.image_url, post?.video_url, ...extra].filter(Boolean);
    return [...new Set(all)];
  }, [post]);

  const activeMedia = mediaItems[activeMediaIndex] || post?.image_url || null;

  const rotatedPropertyPosts = useMemo(
    () => getRotatedPosts(propertySidePosts, rotateIndex),
    [propertySidePosts, rotateIndex]
  );

  const rotatedJobPosts = useMemo(
    () => getRotatedPosts(jobSidePosts, rotateIndex),
    [jobSidePosts, rotateIndex]
  );

const similarPages = useMemo(() => {
  if (!similarVehiclePosts.length) return [];
  const pages = [];
  for (let index = 0; index < similarVehiclePosts.length; index += 3) {
    pages.push(similarVehiclePosts.slice(index, index + 3));
  }
  return pages;
}, [similarVehiclePosts]);

const safeSimilarIndex =
  similarPages.length > 0 ? similarIndex % similarPages.length : 0;

useEffect(() => {
  if (similarPages.length <= 1) return;

  const timer = setInterval(() => {
    setSimilarIndex((prev) => (prev + 1) % similarPages.length);
  }, 3000);

  return () => clearInterval(timer);
}, [similarPages.length]);

  const specCards = [
    { icon: <SpeedIcon />, label: "Kilometrazh", value: mileage !== "N/A" ? `${mileage} km` : "N/A" },
    { icon: <CarIcon />, label: "Fuqia", value: power !== "N/A" ? `${power} hp` : "N/A" },
    { icon: <GearIcon />, label: "Transmetimi", value: transmission },
    { icon: <WheelIcon />, label: "Sistemi", value: driveType },
    { icon: <FuelIcon />, label: "Karburanti", value: fuelType },
    { icon: <CalendarIcon />, label: "Viti", value: year }
  ];

  const infoRows = [
    ["Lloji i Drajverit", driveType],
    ["Seria", series],
    ["Lloji i Automjetit", bodyType],
    ["Dyer", doors],
    ["Ngjyra e Jashtme", exteriorColor],
    ["Ulëse", seats],
    ["Ngjyra e Brendshme", interiorColor],
    ["Pesha", weight !== "N/A" ? `${weight} kg` : "N/A"],
    ["Lloji i Karburantit", fuelType],
    ["Viti", year],
    ["Kapaciteti i Motorrit", engineCapacity],
    ["Kushti", condition],
    ["Transmetimi", transmission]
  ];

  const goPrev = () => {
    setActiveMediaIndex((prev) =>
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setActiveMediaIndex((prev) =>
      prev === mediaItems.length - 1 ? 0 : prev + 1
    );
  };

  const goSimilarPrev = () => {
    if (!similarPages.length) return;
    setSimilarIndex((prev) => (prev === 0 ? similarPages.length - 1 : prev - 1));
  };

  const goSimilarNext = () => {
    if (!similarPages.length) return;
    setSimilarIndex((prev) => (prev + 1) % similarPages.length);
  };

  return (
    <div className="vehicle-page">
      <PublicHeader />

      <main className="vehicle-wrap">
        {loading ? (
          <div className="vehicle-state">Duke u ngarkuar...</div>
        ) : !post ? (
          <div className="vehicle-state">Nuk u gjet automjeti.</div>
        ) : (
          <>
            <section className="vehicle-hero">
              <div
                className="vehicle-main-media"
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
                    <video src={activeMedia} controls playsInline className="vehicle-media" />
                  ) : (
                    <img src={activeMedia} alt={post.title} className="vehicle-media" />
                  )
                ) : (
                  <div className="vehicle-empty">Automjet</div>
                )}

                {!isVideoUrl(activeMedia || "") && (
                  <div className="zoom-hint">Kliko foton për zmadhim</div>
                )}

                <div className="vehicle-overlay" />

                <div className="vehicle-badges">
                  <span>Automjet</span>
                  <span>{condition}</span>
                  <span>{city}</span>
                </div>

                <div className="vehicle-title-box">
                  <p>{year !== "N/A" ? year : "N/A"}</p>
                  <h1>{post.title}</h1>
                  <strong>{formatPrice(post.price)}</strong>
                </div>
              </div>

              {mediaItems.length > 1 && (
                <div className="vehicle-thumbs">
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
                        <img src={item} alt={`Foto ${index + 1}`} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="vehicle-layout">
              <div className="vehicle-content">
                <div className="vehicle-price-card">
                  <div>
                    <span>Çmimi</span>
                    <strong>{formatPrice(post.price)}</strong>
                  </div>

                  <div className="vehicle-actions">
                    {phoneLink && (
                      <a href={phoneLink}>
                        <PhoneIcon /> Telefono
                      </a>
                    )}
                    {whatsappLink && (
                      <a href={whatsappLink} target="_blank" rel="noreferrer" className="wa">
                        <PhoneIcon /> WhatsApp
                      </a>
                    )}
                    {emailLink && <a href={emailLink}>Email</a>}
                  </div>
                </div>

                <div className="vehicle-spec-grid">
                  {specCards.map((item) => (
                    <div className="vehicle-spec-card" key={item.label}>
                      <div className="spec-icon">{item.icon}</div>
                      <div>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="vehicle-info-box">
                  <div className="section-title">
                    <span><CarIcon /></span>
                    <h2>Informacioni i Veturës</h2>
                  </div>

                  <div className="vehicle-info-grid">
                    {infoRows.map(([label, value]) => (
                      <div className="info-row" key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="vehicle-description">
                  <span>Përshkrimi</span>
                  <h2>Detajet e automjetit</h2>

                  {post.description ? (
                    <div
                      className="vehicle-html-description"
                      dangerouslySetInnerHTML={{ __html: cleanHtml(post.description) }}
                    />
                  ) : (
                    <p>Nuk ka përshkrim për këtë automjet.</p>
                  )}
                </div>

                <div className="vehicle-map-box">
                  <div className="section-title">
                    <span><MapIcon /></span>
                    <h2>Lokacioni</h2>
                  </div>

                  <iframe
                    title="Lokacioni i automjetit"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(city || "Pristina")}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              <aside className="vehicle-sidebar">
                <div className="contact-box">
                  <span>Kontakt</span>
                  <h3>Kontakto direkt</h3>

                  {phone !== "N/A" && <p>{phone}</p>}
                  {whatsapp !== "N/A" && <p>{whatsapp}</p>}
                  {email !== "N/A" && <p>{email}</p>}

                  <div className="contact-buttons">
                    {phoneLink && <a href={phoneLink}>Tel</a>}
                    {whatsappLink && (
                      <a href={whatsappLink} target="_blank" rel="noreferrer">
                        WA
                      </a>
                    )}
                    {emailLink && <a href={emailLink}>Mail</a>}
                  </div>
                </div>

                <FeaturedBox
                  title="Patundshmëri të veçuara"
                  label="PRONA"
                  posts={rotatedPropertyPosts}
                />

                <FeaturedBox
                  title="Konkurse Pune të veçuara"
                  label="PUNË"
                  posts={rotatedJobPosts}
                />
              </aside>
            </section>

            <section className="similar-section">
              <div className="similar-head">
                <div>
                  <span>Automjete</span>
                  <h2>Shpallje të ngjashme</h2>
                </div>

                {similarPages.length > 1 && (
                  <div className="similar-controls">
                    <button type="button" onClick={goSimilarPrev} aria-label="Mbrapa">
                      ‹
                    </button>
                    <button type="button" onClick={goSimilarNext} aria-label="Para">
                      ›
                    </button>
                  </div>
                )}
              </div>

              {similarPages.length > 0 ? (
                <>
                  <div className="similar-slider">
                    <div
                      className="similar-track"
                      style={{ transform: `translateX(-${safeSimilarIndex * 100}%)` }}
                    >
                      {similarPages.map((page, pageIndex) => (
                        <div className="similar-slide" key={`similar-page-${pageIndex}`}>
                          {page.map((item) => (
                            <Link
                              to={getDetailLink(item)}
                              className="similar-card"
                              key={item.id}
                            >
                              <div className="similar-media">
                                <img src={getPostImage(item)} alt={item.title} loading="lazy" />

                                <div className="similar-top">
                                  <span>Automjet</span>
                                  {(item.featured === true ||
                                    item.featured === "true" ||
                                    item.is_featured === true) && <b>★</b>}
                                </div>
                              </div>

                              <div className="similar-body">
                                <div className="similar-location">
                                  📍 {getValue(item.city, item.location)}
                                </div>

                                <h3>{item.title}</h3>

                                <div className="similar-tags">
                                  {getValue(item.year, item.vehicle_year) !== "N/A" && (
                                    <span>{getValue(item.year, item.vehicle_year)}</span>
                                  )}
                                  {getValue(item.fuel, item.fuel_type) !== "N/A" && (
                                    <span>{getValue(item.fuel, item.fuel_type)}</span>
                                  )}
                                  {getValue(item.gearbox, item.transmission) !== "N/A" && (
                                    <span>{getValue(item.gearbox, item.transmission)}</span>
                                  )}
                                </div>

                                <div className="similar-footer">
                                  <strong>{formatPrice(item.price)}</strong>
                                  <span>Shiko detajet →</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {similarPages.length > 1 && (
                    <div className="similar-dots">
                      {similarPages.map((_, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setSimilarIndex(index)}
                          className={index === safeSimilarIndex ? "active" : ""}
                          aria-label={`Slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="similar-empty">
                  Nuk ka automjete tjera për momentin.
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {lightboxOpen && activeMedia && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
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
            alt={post?.title || "Automjet"}
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
        .vehicle-page{min-height:100vh;background:#fff;color:#07142d;}
        .vehicle-wrap{width:min(100%,2000px);margin:0 auto;padding:96px 16px 70px;}
        .vehicle-state{background:#fff;border:1px solid #e2e8f0;padding:24px;border-radius:22px;color:#475569;font-weight:800;}

        .vehicle-hero{display:grid;grid-template-columns:1fr;gap:10px;background:#fff;border:1px solid rgba(226,232,240,.95);border-radius:24px;padding:10px;overflow:hidden;}
        .vehicle-main-media{position:relative;height:560px;border-radius:18px;overflow:hidden;background:#eaf0f8;cursor:zoom-in;}
        .vehicle-media{width:100%;height:100%;object-fit:cover;display:block;transition:transform .55s ease;}
        .vehicle-main-media:hover .vehicle-media{transform:scale(1.035);}
        .vehicle-empty{width:100%;height:100%;display:grid;place-items:center;font-size:34px;font-weight:950;background:#eef4ff;}
        .vehicle-overlay{position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.18),transparent 54%);}
        .zoom-hint{position:absolute;right:16px;bottom:16px;z-index:4;padding:9px 13px;border-radius:999px;background:rgba(255,255,255,.92);color:#07142d;font-size:12px;font-weight:950;}
        .vehicle-badges{position:absolute;z-index:3;top:18px;left:18px;right:18px;display:flex;gap:8px;flex-wrap:wrap;pointer-events:none;}
        .vehicle-badges span{min-height:34px;padding:0 14px;display:inline-flex;align-items:center;border-radius:999px;background:rgba(255,255,255,.92);color:#07142d;font-size:12px;font-weight:900;}
        .vehicle-title-box{position:absolute;z-index:3;left:24px;right:24px;bottom:24px;color:#fff;pointer-events:none;}
        .vehicle-title-box p{margin:0 0 8px;font-weight:900;opacity:.92;}
        .vehicle-title-box h1{margin:0;max-width:820px;font-size:50px;line-height:.98;letter-spacing:-.052em;font-weight:950;}
        .vehicle-title-box strong{display:block;margin-top:12px;font-size:32px;font-weight:950;color:#fff;}

        .vehicle-thumbs{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;padding:2px;}
        .vehicle-thumbs button{width:100%;height:74px;border:1px solid #e2e8f0;padding:0;border-radius:10px;overflow:hidden;background:#fff;cursor:pointer;transition:transform .2s ease,border-color .2s ease;}
        .vehicle-thumbs button:hover{transform:scale(1.03);}
        .vehicle-thumbs button.active{border:2px solid #00e4f4;}
        .vehicle-thumbs img,.vehicle-thumbs video{width:100%;height:100%;object-fit:cover;display:block;}

        .vehicle-layout{margin-top:20px;display:grid;grid-template-columns:minmax(0,1fr) 350px;gap:20px;align-items:start;}
        .vehicle-content{display:grid;gap:20px;}
        .vehicle-price-card,.vehicle-description,.vehicle-info-box,.vehicle-map-box,.contact-box,.featured-box{background:#fff;border:1px solid #e1e7ef;border-radius:20px;}
        .vehicle-price-card{padding:24px;display:flex;justify-content:space-between;gap:18px;align-items:center;}
        .vehicle-price-card span,.vehicle-description>span,.contact-box span{display:block;color:#64748b;font-size:12px;font-weight:900;margin-bottom:8px;}
        .vehicle-price-card strong{display:block;font-size:44px;line-height:1;letter-spacing:-.05em;font-weight:950;}
        .vehicle-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;}
        .vehicle-actions a{height:48px;padding:0 18px;display:inline-flex;gap:8px;align-items:center;justify-content:center;border-radius:14px;background:#07142d;color:#fff;text-decoration:none;font-size:13px;font-weight:950;}
        .vehicle-actions a svg{width:17px;height:17px;stroke:currentColor;stroke-width:1.8;}
        .vehicle-actions a.wa{background:#16a34a;}

        .vehicle-spec-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
        .vehicle-spec-card{min-height:96px;display:flex;gap:14px;align-items:flex-start;padding:18px;border:1px solid #e1e7ef;border-radius:16px;background:#fff;}
        .spec-icon{width:42px;height:42px;flex:0 0 42px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(135deg,#fff8e8,#fff);color:#f4b000;border:1px solid #8af3fd;}
        .spec-icon svg,.section-title span svg{width:22px;height:22px;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}
        .vehicle-spec-card span{display:block;color:#64748b;font-size:13px;font-weight:850;margin-bottom:16px;}
        .vehicle-spec-card strong{display:block;font-size:19px;line-height:1.15;color:#020b1f;font-weight:950;}

        .section-title{display:flex;align-items:center;gap:14px;margin-bottom:24px;}
        .section-title span{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#fff8e8,#fff);color:#f4b000;border:1px solid #8ac7fd;}
        .section-title h2{margin:0;font-size:34px;line-height:1;letter-spacing:-.045em;font-weight:950;color:#07142d;}
        .vehicle-info-box{padding:26px 34px 34px;}
        .vehicle-info-grid{display:grid;grid-template-columns:1fr 1fr;column-gap:34px;}
        .info-row{display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:70px;border-bottom:1px solid #e6ebf2;padding:0 8px;}
        .info-row span{color:#334155;font-size:17px;font-weight:500;}
        .info-row strong{color:#020b1f;font-size:17px;font-weight:950;text-align:right;}

        .vehicle-description{padding:28px 32px;}
        .vehicle-description h2{margin:0 0 18px;font-size:30px;letter-spacing:-.04em;font-weight:950;}
        .vehicle-description p,.vehicle-html-description p{margin:0 0 12px;color:#334155;font-size:17px;line-height:1.85;}
        .vehicle-html-description strong{color:#07142d;font-weight:950;}
        .vehicle-html-description{color:#334155;font-size:17px;line-height:1.85;word-break:break-word;}
        .vehicle-html-description br{display:none;}
        .vehicle-map-box{padding:26px 28px 32px;}
        .vehicle-map-box iframe{width:100%;height:460px;border:0;display:block;background:#eef2f7;}

        .vehicle-sidebar{position:sticky;top:100px;display:grid;gap:16px;}
        .contact-box,.featured-box{padding:20px;}
        .contact-box h3,.featured-head h3{margin:0 0 16px;font-size:25px;line-height:1;letter-spacing:-.04em;font-weight:950;}
        .contact-box p{margin:0 0 8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:12px;font-size:14px;font-weight:850;word-break:break-word;}
        .contact-buttons{display:flex;gap:9px;margin-top:14px;flex-wrap:wrap;}
        .contact-buttons a{flex:1;min-width:70px;height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:13px;background:#07142d;color:#fff;text-decoration:none;font-size:12px;font-weight:950;}

        .featured-card{display:grid;grid-template-columns:86px minmax(0,1fr);gap:12px;padding:9px;border:1px solid #dbe3ee;background:#fff;text-decoration:none;color:#07142d;margin-bottom:10px;}
        .featured-card img{width:86px;height:64px;object-fit:cover;background:#e2e8f0;}
        .featured-card small{display:inline-flex;margin-bottom:6px;background:#eff6ff;color:#2563eb;padding:5px 8px;font-size:10px;font-weight:950;text-transform:uppercase;}
        .featured-card strong{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:14px;line-height:1.2;font-weight:950;}
        .no-featured{padding:16px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;font-size:14px;line-height:1.6;font-weight:700;}

        .similar-section{margin-top:28px;background:#fff;border:1px solid #e1e7ef;border-radius:24px;padding:18px 18px 14px;overflow:hidden;}
        .similar-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px;}
        .similar-head span{display:block;color:#64748b;font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;}
        .similar-head h2{margin:0;color:#07142d;font-size:32px;line-height:1;letter-spacing:-.05em;font-weight:950;}
        .similar-controls{display:flex;gap:9px;align-items:center;}
        .similar-controls button{width:40px;height:40px;border-radius:999px;border:1px solid #dbe3ee;background:#fff;color:#07142d;font-size:24px;line-height:1;font-weight:950;cursor:pointer;transition:transform .2s ease,background .2s ease,color .2s ease;}
        .similar-controls button:hover{transform:translateY(-2px);background:#07142d;color:#fff;}
        .similar-slider{width:100%;overflow:hidden;}
        .similar-track{display:flex;width:100%;transition:transform .65s cubic-bezier(.22,.8,.22,1);will-change:transform;}
        .similar-slide{min-width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;}
        .similar-card{min-height:390px;border:1px solid #f4b400;border-radius:18px;overflow:hidden;background:#fff;text-decoration:none;color:#07142d;display:flex;flex-direction:column;transition:transform .25s ease,box-shadow .25s ease;}
        .similar-card:hover{transform:translateY(-4px);box-shadow:0 18px 44px rgba(2,6,23,.12);}
        .similar-media{height:190px;position:relative;background:#eaf6ff;overflow:hidden;}
        .similar-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .45s ease;}
        .similar-card:hover .similar-media img{transform:scale(1.045);}
        .similar-top{position:absolute;inset:12px 12px auto 12px;display:flex;justify-content:space-between;align-items:center;gap:8px;}
        .similar-top span{display:inline-flex;height:30px;align-items:center;border-radius:999px;padding:0 12px;background:rgba(255,255,255,.96);color:#07142d;font-size:11px;font-weight:950;box-shadow:0 10px 22px rgba(15,23,42,.12);}
        .similar-top b{width:34px;height:34px;border-radius:999px;display:grid;place-items:center;background:#f4b000;color:#fff;font-size:14px;box-shadow:0 12px 24px rgba(244,176,0,.28);}
        .similar-body{padding:17px 16px 14px;display:flex;flex-direction:column;flex:1;}
        .similar-location{color:#475569;font-size:13px;font-weight:900;margin-bottom:10px;}
        .similar-body h3{margin:0;font-size:18px;line-height:1.2;font-weight:950;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        .similar-tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px;}
        .similar-tags span{height:30px;padding:0 10px;border-radius:999px;background:#f8fafc;border:1px solid #dbe3ee;display:inline-flex;align-items:center;color:#475569;font-size:11px;font-weight:900;}
        .similar-footer{margin-top:auto;padding-top:16px;border-top:1px solid #e5eaf1;display:flex;justify-content:space-between;align-items:center;gap:12px;}
        .similar-footer strong{color:#07142d;font-size:16px;font-weight:950;}
        .similar-footer span{color:#07142d;font-size:13px;font-weight:950;white-space:nowrap;}
        .similar-dots{display:flex;justify-content:center;align-items:center;gap:7px;margin-top:16px;}
        .similar-dots button{width:8px;height:8px;padding:0;border:0;border-radius:999px;background:#cbd5e1;cursor:pointer;transition:width .2s ease,background .2s ease;}
        .similar-dots button.active{width:22px;background:#07142d;}
        .similar-empty{padding:18px;border-radius:18px;background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;font-weight:800;}

        .lightbox{position:fixed;inset:0;z-index:99999;background:rgba(2,6,23,.92);display:flex;align-items:center;justify-content:center;padding:28px;}
        .lightbox img{max-width:96vw;max-height:92vh;object-fit:contain;border-radius:18px;}
        .lightbox-close{position:absolute;top:18px;right:24px;width:48px;height:48px;border:0;border-radius:999px;background:#fff;color:#07142d;font-size:34px;line-height:1;cursor:pointer;font-weight:900;}
        .lightbox-nav{position:absolute;top:50%;transform:translateY(-50%);width:56px;height:56px;border:0;border-radius:999px;background:#fff;color:#07142d;font-size:42px;line-height:1;cursor:pointer;font-weight:900;}
        .lightbox-nav.prev{left:24px;}
        .lightbox-nav.next{right:24px;}

        @media(max-width:1100px){
          .vehicle-layout{grid-template-columns:1fr;}
          .vehicle-sidebar{position:relative;top:auto;}
        }

        @media(max-width:980px){
          .vehicle-wrap{padding-top:86px;}
          .vehicle-main-media{height:420px;}
          .vehicle-title-box h1{font-size:38px;}
          .vehicle-thumbs{grid-template-columns:repeat(4,1fr);}
          .vehicle-thumbs button{height:68px;}
          .vehicle-spec-grid,.vehicle-info-grid{grid-template-columns:1fr 1fr;}
          .vehicle-price-card{flex-direction:column;align-items:flex-start;}
          .vehicle-actions{justify-content:flex-start;}
          .similar-slide{grid-template-columns:repeat(2,minmax(0,1fr));}
        }

        @media(max-width:620px){
          .vehicle-wrap{padding:82px 10px 54px;}
          .vehicle-hero{border-radius:20px;padding:8px;}
          .vehicle-main-media{height:300px;border-radius:16px;}
          .vehicle-thumbs{grid-template-columns:repeat(4,1fr);gap:6px;padding:0;}
          .vehicle-thumbs button{height:58px;border-radius:9px;}
          .zoom-hint{display:none;}
          .vehicle-title-box{left:16px;right:16px;bottom:18px;}
          .vehicle-title-box h1{font-size:29px;}
          .vehicle-title-box strong{font-size:27px;}
          .vehicle-price-card{padding:20px;}
          .vehicle-price-card strong{font-size:34px;}
          .vehicle-actions{width:100%;display:grid;grid-template-columns:1fr 1fr;}
          .vehicle-actions a{width:100%;padding:0 10px;}
          .vehicle-spec-grid{grid-template-columns:repeat(2,1fr);gap:10px;}
          .vehicle-spec-card{min-height:112px;padding:14px;flex-direction:column;gap:12px;}
          .spec-icon{width:40px;height:40px;}
          .vehicle-spec-card span{font-size:12px;margin-bottom:8px;}
          .vehicle-spec-card strong{font-size:16px;}
          .vehicle-info-grid{grid-template-columns:1fr;}
          .section-title h2{font-size:27px;}
          .vehicle-info-box{padding:20px 14px 24px;}
          .info-row{min-height:64px;padding:0 6px;}
          .info-row span,.info-row strong{font-size:15px;}
          .vehicle-description,.vehicle-map-box{padding:20px 16px 24px;}
          .vehicle-map-box iframe{height:320px;}
          .featured-card{grid-template-columns:78px minmax(0,1fr);}
          .featured-card img{width:78px;height:58px;}
          .similar-section{padding:14px;border-radius:20px;}
          .similar-head h2{font-size:25px;}
          .similar-slide{grid-template-columns:1fr;}
          .similar-card{min-height:auto;}
          .similar-media{height:215px;}
          .similar-controls button{width:38px;height:38px;}
          .lightbox{padding:12px;}
          .lightbox-close{top:12px;right:12px;}
          .lightbox-nav{width:44px;height:44px;font-size:34px;}
          .lightbox-nav.prev{left:10px;}
          .lightbox-nav.next{right:10px;}
        }
      `}</style>
    </div>
  );
}
