import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";
import { getPostById, getPostsByCategory } from "../../api/postApi";
import JobPostCard from "../../components/posts/JobPostCard";

const pageWrap = {
  background: "#f8fafc",
  minHeight: "100vh"
};

const infoCardStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  padding: "16px 18px",
  boxSizing: "border-box"
};

const actionBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "13px 22px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "800",
  fontSize: "15px",
  border: "none",
  cursor: "pointer",
  transition: "0.2s ease"
};

const shareBtnBase = {
  flex: "1 1 170px",
  minWidth: "150px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "13px 16px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "14px",
  border: "1px solid #dbe3ee",
  background: "#fff",
  color: "#0f172a",
  cursor: "pointer"
};

export default function JobDetailsPage() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1400
  );

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [singlePost, allJobs] = await Promise.all([
          getPostById(id),
          getPostsByCategory("konkurse-pune")
        ]);

        setPost(singlePost);

        const filteredRelated = (allJobs || [])
          .filter((item) => String(item.id) !== String(id))
          .slice(0, 4);

        setRelatedPosts(filteredRelated);
      } catch (error) {
        console.error("Gabim gjatë marrjes së konkursit:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1100;

  const formattedDate = useMemo(() => {
    if (!post?.created_at) return "";
    return new Date(post.created_at).toLocaleDateString("sq-AL");
  }, [post]);

  const companyName = post?.client_name || "Publiko";
  const contactValue = post?.phone || post?.whatsapp || "Nuk ka";
  const cleanWhatsapp = post?.whatsapp
    ? post.whatsapp.replace(/\D/g, "")
    : "";

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Linku u kopjua me sukses.");
    } catch (error) {
      console.error("Gabim gjatë kopjimit të linkut:", error);
      alert("Nuk u kopjua linku.");
    }
  };

  return (
    <div style={pageWrap}>
      <PublicHeader />

      <main
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: isMobile ? "18px 12px 50px" : "30px 18px 70px"
        }}
      >
        {loading ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "24px",
              padding: "26px",
              boxShadow: "0 16px 40px rgba(15,23,42,0.05)"
            }}
          >
            Duke u ngarkuar...
          </div>
        ) : !post ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "24px",
              padding: "26px",
              boxShadow: "0 16px 40px rgba(15,23,42,0.05)"
            }}
          >
            Nuk u gjet konkursi.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet || isMobile
                ? "1fr"
                : "minmax(0, 2fr) 330px",
              gap: "24px",
              alignItems: "start"
            }}
          >
            <section
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: isMobile ? "20px" : "26px",
                padding: isMobile ? "14px" : "18px",
                boxShadow: "0 16px 40px rgba(15,23,42,0.06)"
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    post.image_url && !isMobile ? "280px minmax(0, 1fr)" : "1fr",
                  gap: "18px",
                  alignItems: "start",
                  marginBottom: "18px"
                }}
              >
                {post.image_url && (
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "18px",
                      overflow: "hidden",
                      minHeight: isMobile ? "180px" : "220px"
                    }}
                  >
                    <img
                      src={post.image_url}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: isMobile ? "220px" : "260px",
                        objectFit: "contain",
                        display: "block",
                        background: "#fff"
                      }}
                    />
                  </div>
                )}

                <div style={{ paddingTop: "4px" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "7px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "800",
                      background: "rgba(37,99,235,0.10)",
                      color: "#1d4ed8",
                      marginBottom: "12px"
                    }}
                  >
                    Konkurs Pune
                  </div>

                  <h1
                    style={{
                      margin: "0 0 16px",
                      fontSize: isMobile ? "26px" : "34px",
                      lineHeight: "1.18",
                      color: "#0f172a",
                      wordBreak: "break-word"
                    }}
                  >
                    {post.title}
                  </h1>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "18px",
                      color: "#475569",
                      fontSize: "14px",
                      marginBottom: "10px"
                    }}
                  >
                    {formattedDate && (
                      <div>
                        <strong style={{ color: "#0f172a" }}>Publikuar:</strong>{" "}
                        {formattedDate}
                      </div>
                    )}

                    <div>
                      <strong style={{ color: "#0f172a" }}>Kategoria:</strong>{" "}
                      Konkurse Pune
                    </div>

                    <div>
                      <strong style={{ color: "#0f172a" }}>Kompania:</strong>{" "}
                      {companyName}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px",
                  marginBottom: "22px"
                }}
              >
                <div style={infoCardStyle}>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      marginBottom: "6px"
                    }}
                  >
                    Kompania
                  </div>
                  <div style={{ color: "#0f172a", fontWeight: "800" }}>
                    {companyName}
                  </div>
                </div>

                <div style={infoCardStyle}>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      marginBottom: "6px"
                    }}
                  >
                    Kategoria
                  </div>
                  <div style={{ color: "#0f172a", fontWeight: "800" }}>
                    Punësim
                  </div>
                </div>

                <div style={infoCardStyle}>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      marginBottom: "6px"
                    }}
                  >
                    Kontakti
                  </div>
                  <div style={{ color: "#0f172a", fontWeight: "800" }}>
                    {contactValue}
                  </div>
                </div>
              </div>

              <div
                style={{
                  color: "#0f172a",
                  fontWeight: "800",
                  fontSize: isMobile ? "21px" : "24px",
                  marginBottom: "14px"
                }}
              >
                Përshkrimi i konkursit
              </div>

              <div
                style={{
                  color: "#334155",
                  fontSize: isMobile ? "15px" : "16px",
                  lineHeight: "1.9",
                  whiteSpace: "pre-line"
                }}
              >
                {post.description}
              </div>

              {(post.phone || post.whatsapp) && (
                <div
                  style={{
                    marginTop: "28px",
                    paddingTop: "22px",
                    borderTop: "1px solid #e2e8f0",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px"
                  }}
                >
                  {post.phone && (
                    <a
                      href={`tel:${post.phone}`}
                      style={{
                        ...actionBtn,
                        background: "#0f172a",
                        color: "#fff"
                      }}
                    >
                      Telefono
                    </a>
                  )}

                  {post.whatsapp && (
                    <a
                      href={`https://wa.me/${cleanWhatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        ...actionBtn,
                        background: "#16a34a",
                        color: "#fff"
                      }}
                    >
                      Kontakto në WhatsApp
                    </a>
                  )}
                </div>
              )}

              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "22px",
                  borderTop: "1px solid #e2e8f0"
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "800",
                    color: "#0f172a",
                    marginBottom: "14px"
                  }}
                >
                  Shpërndaje shpalljen
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px"
                  }}
                >
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      currentUrl
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={shareBtnBase}
                  >
                    Facebook
                  </a>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={shareBtnBase}
                  >
                    WhatsApp
                  </a>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(
                      post.title
                    )}&body=${encodeURIComponent(currentUrl)}`}
                    style={shareBtnBase}
                  >
                    Email
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    style={shareBtnBase}
                  >
                    Kopjo linkun
                  </button>
                </div>
              </div>

              {relatedPosts.length > 0 && (
                <div
                  style={{
                    marginTop: "34px",
                    paddingTop: "24px",
                    borderTop: "1px solid #e2e8f0"
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 18px",
                      fontSize: isMobile ? "22px" : "24px",
                      fontWeight: "800",
                      color: "#0f172a"
                    }}
                  >
                    Shpallje të ngjashme
                  </h2>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "18px"
                    }}
                  >
                    {relatedPosts.map((item) => (
                      <JobPostCard key={item.id} post={item} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            <aside
              style={{
                display: "grid",
                gap: "18px",
                alignSelf: "start",
                position: isTablet || isMobile ? "static" : "sticky",
                top: "18px"
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "24px",
                  padding: "20px",
                  boxShadow: "0 16px 40px rgba(15,23,42,0.06)"
                }}
              >
                <h3
                  style={{
                    margin: "0 0 16px",
                    fontSize: "20px",
                    color: "#0f172a"
                  }}
                >
                  Overview
                </h3>

                <div style={{ display: "grid", gap: "14px" }}>
                  <div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "14px",
                        marginBottom: "4px"
                      }}
                    >
                      Data e publikimit
                    </div>
                    <div style={{ color: "#0f172a", fontWeight: "800" }}>
                      {formattedDate || "-"}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "14px",
                        marginBottom: "4px"
                      }}
                    >
                      Lloji
                    </div>
                    <div style={{ color: "#0f172a", fontWeight: "800" }}>
                      Konkurs pune
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "14px",
                        marginBottom: "4px"
                      }}
                    >
                      Kompania
                    </div>
                    <div style={{ color: "#0f172a", fontWeight: "800" }}>
                      {companyName}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "14px",
                        marginBottom: "4px"
                      }}
                    >
                      Kontakti
                    </div>
                    <div style={{ color: "#0f172a", fontWeight: "800" }}>
                      {contactValue}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  border: "1px solid #bfdbfe",
                  borderRadius: "24px",
                  padding: "20px"
                }}
              >
                <div
                  style={{
                    color: "#1e3a8a",
                    fontWeight: "900",
                    fontSize: "20px",
                    lineHeight: "1.3",
                    marginBottom: "10px"
                  }}
                >
                  Apliko ose kontakto menjëherë
                </div>

                <div
                  style={{
                    color: "#334155",
                    fontSize: "14px",
                    lineHeight: "1.7",
                    marginBottom: "16px"
                  }}
                >
                  Përdor kontaktet më poshtë për të marrë më shumë informata
                  rreth kësaj pozite.
                </div>

                <div style={{ display: "grid", gap: "10px" }}>
                  {post.phone && (
                    <a
                      href={`tel:${post.phone}`}
                      style={{
                        ...actionBtn,
                        background: "#fff",
                        color: "#0f172a",
                        border: "1px solid #cbd5e1"
                      }}
                    >
                      Thirr tani
                    </a>
                  )}

                  {post.whatsapp && (
                    <a
                      href={`https://wa.me/${cleanWhatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        ...actionBtn,
                        background: "#16a34a",
                        color: "#fff"
                      }}
                    >
                      Dërgo mesazh
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}