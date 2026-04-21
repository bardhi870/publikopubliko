import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";
import { getPostById } from "../../api/postApi";

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

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  const isMobile = screenWidth <= 768;

  const city = post?.city || post?.location || "";
  const year = post?.year || post?.vehicle_year || "";
  const fuel = post?.fuel || post?.fuel_type || "";
  const gearbox = post?.gearbox || post?.transmission || "";
  const mileage = post?.mileage || post?.kilometers || "";
  const phone = post?.phone || post?.contact_phone || "";
  const whatsapp = post?.whatsapp || post?.whatsapp_number || "";
  const email = post?.email || post?.contact_email || "";
  const status = post?.status || "Aktiv";

  const whatsappLink = useMemo(() => {
    const digits = String(whatsapp || "").replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : null;
  }, [whatsapp]);

  const phoneLink = phone ? `tel:${phone}` : null;
  const emailLink = email ? `mailto:${email}` : null;
  const hasAnyContact = phoneLink || whatsappLink || emailLink;

  const galleryImages = useMemo(() => {
    const extra = normalizeGalleryImages(post?.gallery_images);
    const all = [post?.image_url, ...extra].filter(Boolean);
    return [...new Set(all)];
  }, [post?.image_url, post?.gallery_images]);

  const activeImage =
    galleryImages[activeImageIndex] || post?.image_url || null;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [post?.id]);

  const statCardStyle = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: isMobile ? "18px" : "22px",
    padding: isMobile ? "14px" : "18px",
    boxShadow: "0 10px 26px rgba(15,23,42,0.04)"
  };

  const contactIconButton = (bg, shadow) => ({
    width: isMobile ? "52px" : "58px",
    height: isMobile ? "52px" : "58px",
    borderRadius: "18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: bg,
    boxShadow: shadow,
    textDecoration: "none",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
  });

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <PublicHeader />

      <main
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: isMobile ? "16px 12px 40px" : "30px 20px 64px"
        }}
      >
        {loading ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: isMobile ? "20px" : "28px",
              padding: isMobile ? "20px" : "28px",
              color: "#475569"
            }}
          >
            Duke u ngarkuar...
          </div>
        ) : !post ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: isMobile ? "20px" : "28px",
              padding: isMobile ? "20px" : "28px",
              color: "#475569"
            }}
          >
            Nuk u gjet automjeti.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: isMobile ? "16px" : "22px"
            }}
          >
            <section
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: isMobile ? "24px" : "34px",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(15,23,42,0.06)"
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    !isMobile && galleryImages.length > 1
                      ? "minmax(0, 1fr) 190px"
                      : "1fr",
                  gap: !isMobile && galleryImages.length > 1 ? "12px" : "0",
                  padding: !isMobile && galleryImages.length > 1 ? "12px" : "0"
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: isMobile ? "250px" : "500px",
                    overflow: "hidden",
                    background: "#e2e8f0",
                    borderRadius:
                      !isMobile && galleryImages.length > 1 ? "24px" : "0"
                  }}
                >
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)",
                        color: "#166534",
                        fontWeight: "900",
                        fontSize: isMobile ? "24px" : "34px"
                      }}
                    >
                      Automjet
                    </div>
                  )}

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.16) 44%, rgba(15,23,42,0) 100%)"
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      top: isMobile ? "14px" : "18px",
                      left: isMobile ? "14px" : "20px",
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap"
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: isMobile ? "7px 11px" : "8px 14px",
                        borderRadius: "999px",
                        background: "rgba(255,255,255,0.95)",
                        color: "#0f172a",
                        fontSize: isMobile ? "11px" : "12px",
                        fontWeight: "800"
                      }}
                    >
                      Automjet
                    </span>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: isMobile ? "7px 11px" : "8px 14px",
                        borderRadius: "999px",
                        background: "rgba(15,23,42,0.88)",
                        color: "#fff",
                        fontSize: isMobile ? "11px" : "12px",
                        fontWeight: "800"
                      }}
                    >
                      {status}
                    </span>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      left: isMobile ? "14px" : "24px",
                      right: isMobile ? "14px" : "24px",
                      bottom: isMobile ? "16px" : "24px"
                    }}
                  >
                    {city ? (
                      <div
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          fontSize: isMobile ? "13px" : "15px",
                          fontWeight: "700",
                          marginBottom: "8px"
                        }}
                      >
                        📍 {city}
                      </div>
                    ) : null}

                    <h1
                      style={{
                        margin: 0,
                        color: "#fff",
                        fontSize: isMobile ? "30px" : "50px",
                        lineHeight: 0.98,
                        fontWeight: "900",
                        letterSpacing: "-0.04em",
                        wordBreak: "break-word",
                        textShadow: "0 10px 28px rgba(0,0,0,0.18)"
                      }}
                    >
                      {post.title}
                    </h1>
                  </div>
                </div>

                {!isMobile && galleryImages.length > 1 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: "repeat(4, 1fr)",
                      gap: "12px",
                      minHeight: "500px"
                    }}
                  >
                    {galleryImages.slice(0, 4).map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        style={{
                          border: activeImageIndex === index
                            ? "2px solid #2563eb"
                            : "1px solid #e2e8f0",
                          padding: 0,
                          margin: 0,
                          borderRadius: "18px",
                          overflow: "hidden",
                          cursor: "pointer",
                          background: "#fff",
                          boxShadow:
                            activeImageIndex === index
                              ? "0 10px 24px rgba(37,99,235,0.18)"
                              : "0 8px 20px rgba(15,23,42,0.04)"
                        }}
                      >
                        <img
                          src={image}
                          alt={`Foto ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            minHeight: "0",
                            objectFit: "cover",
                            display: "block"
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isMobile && galleryImages.length > 1 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                    padding: "10px 12px 0"
                  }}
                >
                  {galleryImages.slice(0, 4).map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      style={{
                        border: activeImageIndex === index
                          ? "2px solid #2563eb"
                          : "1px solid #e2e8f0",
                        padding: 0,
                        margin: 0,
                        borderRadius: "14px",
                        overflow: "hidden",
                        cursor: "pointer",
                        background: "#fff"
                      }}
                    >
                      <img
                        src={image}
                        alt={`Foto ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "78px",
                          objectFit: "cover",
                          display: "block"
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div
                style={{
                  padding: isMobile ? "16px" : "26px"
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1fr) auto",
                    gap: isMobile ? "18px" : "20px",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "800",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "8px"
                      }}
                    >
                      Çmimi
                    </div>

                    <div
                      style={{
                        fontSize: isMobile ? "34px" : "46px",
                        fontWeight: "900",
                        color: "#0f172a",
                        lineHeight: 1,
                        letterSpacing: "-0.04em"
                      }}
                    >
                      {post.price ? `${post.price} €` : "Me marrëveshje"}
                    </div>
                  </div>

                  {hasAnyContact && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: isMobile ? "flex-start" : "flex-end"
                      }}
                    >
                      {phoneLink && (
                        <a
                          href={phoneLink}
                          aria-label="Telefono"
                          title="Telefono"
                          style={contactIconButton(
                            "#0f172a",
                            "0 10px 24px rgba(15,23,42,0.18)"
                          )}
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M22 16.92V19.92C22 20.47 21.79 21 21.41 21.39C21.02 21.77 20.49 21.99 19.94 22C16.36 21.61 12.93 20.39 9.93 18.44C7.15 16.69 4.81 14.35 3.06 11.57C1.1 8.56 -0.11 5.11 0 1.5C0.01 0.95 0.23 0.42 0.61 0.03C1 -0.35 1.53 -0.56 2.08 -0.56H5.08C6.06 -0.57 6.91 0.13 7.1 1.09C7.24 1.79 7.46 2.47 7.76 3.12C8.03 3.71 7.89 4.41 7.41 4.88L6.14 6.15C7.57 8.67 9.65 10.75 12.17 12.18L13.44 10.91C13.91 10.44 14.61 10.3 15.2 10.57C15.85 10.87 16.53 11.09 17.23 11.23C18.2 11.43 18.89 12.29 18.88 13.27V16.27"
                              stroke="#ffffff"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      )}

                      {whatsappLink && (
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="WhatsApp"
                          title="WhatsApp"
                          style={contactIconButton(
                            "#16a34a",
                            "0 10px 24px rgba(22,163,74,0.24)"
                          )}
                        >
                          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                            <path
                              d="M27.1 4.9C24.2 2 20.3.4 16.2.4C7.7.4.8 7.3.8 15.8C.8 18.5 1.5 21.1 2.8 23.3L.4 31.2L8.5 28.9C10.6 30.1 13.1 30.8 15.7 30.8H15.8C24.3 30.8 31.2 23.9 31.2 15.4C31.2 11.3 29.6 7.8 27.1 4.9Z"
                              fill="#ffffff"
                            />
                            <path
                              d="M24.3 19.6C23.9 19.4 21.9 18.4 21.5 18.2C21.1 18 20.8 17.9 20.5 18.3C20.2 18.7 19.3 19.8 19.1 20C18.9 20.2 18.7 20.3 18.3 20.1C15.9 18.9 14.4 17.8 13 15.4C12.6 14.7 13.4 14.8 14.1 13.4C14.2 13.2 14.2 13 14.1 12.8C14 12.6 13.3 10.6 13 9.8C12.7 9.1 12.4 9.2 12.2 9.2H11.5C11.3 9.2 11 9.3 10.8 9.5C10.6 9.7 9.9 10.4 9.9 11.8C9.9 13.2 10.9 14.5 11.1 14.7C11.3 14.9 14 19 18.1 20.8C20.7 21.9 21.7 22 22.5 21.9C23 21.8 24.1 21 24.3 20.3C24.6 19.7 24.6 19.7 24.3 19.6Z"
                              fill="#16a34a"
                            />
                          </svg>
                        </a>
                      )}

                      {emailLink && (
                        <a
                          href={emailLink}
                          aria-label="Email"
                          title="Email"
                          style={contactIconButton(
                            "#2563eb",
                            "0 10px 24px rgba(37,99,235,0.24)"
                          )}
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M4 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H4C2.9 18 2 17.1 2 16V8C2 6.9 2.9 6 4 6Z"
                              stroke="#ffffff"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M22 8L12 14L2 8"
                              stroke="#ffffff"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, minmax(0, 1fr))",
                gap: isMobile ? "10px" : "14px"
              }}
            >
              <div style={statCardStyle}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Viti
                </div>
                <div style={{ fontSize: isMobile ? "15px" : "19px", fontWeight: "800", color: "#0f172a" }}>
                  {year || "—"}
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Karburanti
                </div>
                <div style={{ fontSize: isMobile ? "15px" : "19px", fontWeight: "800", color: "#0f172a" }}>
                  {fuel || "—"}
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Ndërruesi
                </div>
                <div style={{ fontSize: isMobile ? "15px" : "19px", fontWeight: "800", color: "#0f172a" }}>
                  {gearbox || "—"}
                </div>
              </div>

              <div style={statCardStyle}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Kilometra
                </div>
                <div style={{ fontSize: isMobile ? "15px" : "19px", fontWeight: "800", color: "#0f172a" }}>
                  {mileage ? `${mileage} km` : "—"}
                </div>
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.35fr 0.85fr",
                gap: isMobile ? "16px" : "18px"
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: isMobile ? "22px" : "28px",
                  padding: isMobile ? "18px 16px" : "28px 26px",
                  boxShadow: "0 12px 34px rgba(15,23,42,0.04)"
                }}
              >
                <h2
                  style={{
                    margin: "0 0 14px",
                    fontSize: isMobile ? "22px" : "30px",
                    fontWeight: "900",
                    letterSpacing: "-0.03em",
                    color: "#0f172a"
                  }}
                >
                  Përshkrimi
                </h2>

                <div
                  style={{
                    color: "#475569",
                    lineHeight: 1.9,
                    fontSize: isMobile ? "14px" : "16px",
                    whiteSpace: "pre-line"
                  }}
                >
                  {post.description || "Nuk ka përshkrim për këtë automjet."}
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: isMobile ? "22px" : "28px",
                  padding: isMobile ? "18px 16px" : "28px 24px",
                  boxShadow: "0 12px 34px rgba(15,23,42,0.04)",
                  height: "fit-content"
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "10px"
                  }}
                >
                  Kontakt
                </div>

                <h3
                  style={{
                    margin: "0 0 16px",
                    fontSize: isMobile ? "22px" : "28px",
                    lineHeight: 1.05,
                    fontWeight: "900",
                    letterSpacing: "-0.03em",
                    color: "#0f172a"
                  }}
                >
                  Kontakto direkt
                </h3>

                <p
                  style={{
                    margin: "0 0 18px",
                    color: "#64748b",
                    lineHeight: 1.75,
                    fontSize: isMobile ? "14px" : "15px"
                  }}
                >
                  Përdor ikonat më poshtë për të kontaktuar menjëherë për këtë automjet.
                </p>

                {hasAnyContact ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "18px"
                      }}
                    >
                      {phoneLink && (
                        <a href={phoneLink} aria-label="Telefono" title="Telefono" style={contactIconButton("#0f172a", "0 10px 24px rgba(15,23,42,0.18)")}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M22 16.92V19.92C22 20.47 21.79 21 21.41 21.39C21.02 21.77 20.49 21.99 19.94 22C16.36 21.61 12.93 20.39 9.93 18.44C7.15 16.69 4.81 14.35 3.06 11.57C1.1 8.56 -0.11 5.11 0 1.5C0.01 0.95 0.23 0.42 0.61 0.03C1 -0.35 1.53 -0.56 2.08 -0.56H5.08C6.06 -0.57 6.91 0.13 7.1 1.09C7.24 1.79 7.46 2.47 7.76 3.12C8.03 3.71 7.89 4.41 7.41 4.88L6.14 6.15C7.57 8.67 9.65 10.75 12.17 12.18L13.44 10.91C13.91 10.44 14.61 10.3 15.2 10.57C15.85 10.87 16.53 11.09 17.23 11.23C18.2 11.43 18.89 12.29 18.88 13.27V16.27"
                              stroke="#ffffff"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      )}

                      {whatsappLink && (
                        <a href={whatsappLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp" style={contactIconButton("#16a34a", "0 10px 24px rgba(22,163,74,0.24)")}>
                          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                            <path
                              d="M27.1 4.9C24.2 2 20.3.4 16.2.4C7.7.4.8 7.3.8 15.8C.8 18.5 1.5 21.1 2.8 23.3L.4 31.2L8.5 28.9C10.6 30.1 13.1 30.8 15.7 30.8H15.8C24.3 30.8 31.2 23.9 31.2 15.4C31.2 11.3 29.6 7.8 27.1 4.9Z"
                              fill="#ffffff"
                            />
                            <path
                              d="M24.3 19.6C23.9 19.4 21.9 18.4 21.5 18.2C21.1 18 20.8 17.9 20.5 18.3C20.2 18.7 19.3 19.8 19.1 20C18.9 20.2 18.7 20.3 18.3 20.1C15.9 18.9 14.4 17.8 13 15.4C12.6 14.7 13.4 14.8 14.1 13.4C14.2 13.2 14.2 13 14.1 12.8C14 12.6 13.3 10.6 13 9.8C12.7 9.1 12.4 9.2 12.2 9.2H11.5C11.3 9.2 11 9.3 10.8 9.5C10.6 9.7 9.9 10.4 9.9 11.8C9.9 13.2 10.9 14.5 11.1 14.7C11.3 14.9 14 19 18.1 20.8C20.7 21.9 21.7 22 22.5 21.9C23 21.8 24.1 21 24.3 20.3C24.6 19.7 24.6 19.7 24.3 19.6Z"
                              fill="#16a34a"
                            />
                          </svg>
                        </a>
                      )}

                      {emailLink && (
                        <a href={emailLink} aria-label="Email" title="Email" style={contactIconButton("#2563eb", "0 10px 24px rgba(37,99,235,0.24)")}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M4 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H4C2.9 18 2 17.1 2 16V8C2 6.9 2.9 6 4 6Z"
                              stroke="#ffffff"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M22 8L12 14L2 8"
                              stroke="#ffffff"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      )}
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      {phone && (
                        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px 14px", color: "#0f172a", fontWeight: "700", fontSize: "14px", wordBreak: "break-word" }}>
                          {phone}
                        </div>
                      )}

                      {whatsapp && (
                        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px 14px", color: "#0f172a", fontWeight: "700", fontSize: "14px", wordBreak: "break-word" }}>
                          {whatsapp}
                        </div>
                      )}

                      {email && (
                        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px 14px", color: "#0f172a", fontWeight: "700", fontSize: "14px", wordBreak: "break-word" }}>
                          {email}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "16px", color: "#64748b", fontSize: "14px", lineHeight: 1.7 }}>
                    Nuk ka të dhëna kontakti për këtë automjet.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}