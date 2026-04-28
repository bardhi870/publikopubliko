import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";
import { getPostById, getPostsByCategory } from "../../api/postApi";
import JobPostCard from "../../components/posts/JobPostCard";

const pageWrap = {
  background:
    "radial-gradient(circle at top left, rgba(37,99,235,0.08), transparent 34%), linear-gradient(180deg, #f8fafc 0%, #eef6ff 45%, #f8fafc 100%)",
  minHeight: "100vh"
};

const cardBase = {
  background: "rgba(255,255,255,0.96)",
  border: "1px solid #dbe7f5",
  boxShadow: "0 18px 45px rgba(15,23,42,0.06)"
};

function decodeHtmlEntities(value = "") {
  if (typeof window === "undefined") return value;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function cleanDescription(value = "") {
  const decoded = decodeHtmlEntities(value || "");

  return decoded
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

function pickFeaturedPosts(items = []) {
  const featured = items.filter((item) => item.featured);

  return (featured.length > 0 ? featured : items)
    .sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    );
}

function SidebarRotator({ title, posts, index, type }) {
  const visiblePosts = posts.slice(index, index + 3);

  if (!posts.length) return null;

  const isAuto = type === "auto";

  return (
    <div
      style={{
        ...cardBase,
        borderRadius: "24px",
        padding: "18px",
        overflow: "hidden"
      }}
    >
      <h3
        style={{
          margin: "0 0 14px",
          fontSize: "20px",
          color: "#07132b",
          fontWeight: "950"
        }}
      >
        {title}
      </h3>

      <div style={{ display: "grid", gap: "12px" }}>
        {visiblePosts.map((item) => (
          <Link
            key={item.id}
            to={isAuto ? `/automjete/${item.id}` : `/patundshmeri/${item.id}`}
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              border: "1px solid #e2e8f0",
              borderRadius: "0px",
              overflow: "hidden",
              background: "#fff",
              textDecoration: "none",
              cursor: "pointer",
              transition: "0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#2563eb";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src={item.image_url}
              alt={item.title}
              loading="lazy"
              style={{
                width: "92px",
                height: "74px",
                objectFit: "cover",
                flexShrink: 0,
                background: "#f1f5f9"
              }}
            />

            <div style={{ padding: "6px 8px", minWidth: 0 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "3px 6px",
                  background: "#eff6ff",
                  color: "#2563eb",
                  fontSize: "10px",
                  fontWeight: "950",
                  marginBottom: "6px"
                }}
              >
                {isAuto ? "AUTO" : "PRONA"}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "950",
                  color: "#0f172a",
                  lineHeight: "1.25",
                  maxHeight: "34px",
                  overflow: "hidden"
                }}
              >
                {item.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function JobDetailsPage() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [relatedIndex, setRelatedIndex] = useState(0);

  const [realEstateFeatured, setRealEstateFeatured] = useState([]);
  const [vehicleFeatured, setVehicleFeatured] = useState([]);
  const [realEstateIndex, setRealEstateIndex] = useState(0);
  const [vehicleIndex, setVehicleIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1400
  );

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [singlePost, allJobs, allRealEstate, allVehicles] =
          await Promise.all([
            getPostById(id),
            getPostsByCategory("konkurse-pune"),
            getPostsByCategory("patundshmeri"),
            getPostsByCategory("automjete")
          ]);

        setPost(singlePost);

        setRelatedPosts(
          (allJobs || [])
            .filter((item) => String(item.id) !== String(id))
            .sort(
              (a, b) =>
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime()
            )
        );

        setRealEstateFeatured(pickFeaturedPosts(allRealEstate || []));
        setVehicleFeatured(pickFeaturedPosts(allVehicles || []));

        setRelatedIndex(0);
        setRealEstateIndex(0);
        setVehicleIndex(0);
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

  const companyName = post?.company_name || post?.client_name || "Publiko";
  const jobCategory = post?.job_category || "-";
  const jobLocation = post?.job_location || "-";
  const positionsCount = post?.positions_count || "-";
  const extraLinkText = post?.link_text || post?.extra_link_text || "";
const extraLinkUrl = post?.link_url || post?.extra_link_url || "";


  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const descriptionHtml = useMemo(() => {
    return cleanDescription(post?.description || "");
  }, [post?.description]);

  const relatedVisibleCount = isMobile ? 1 : isTablet ? 2 : 3;
  const relatedMaxIndex = Math.max(relatedPosts.length - relatedVisibleCount, 0);

  useEffect(() => {
    if (relatedPosts.length <= relatedVisibleCount) return;

    const interval = setInterval(() => {
      setRelatedIndex((prev) => (prev >= relatedMaxIndex ? 0 : prev + 1));
    }, 3200);

    return () => clearInterval(interval);
  }, [relatedPosts.length, relatedVisibleCount, relatedMaxIndex]);

  useEffect(() => {
    if (realEstateFeatured.length <= 3) return;

    const maxIndex = Math.max(realEstateFeatured.length - 3, 0);

    const interval = setInterval(() => {
      setRealEstateIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3600);

    return () => clearInterval(interval);
  }, [realEstateFeatured.length]);

  useEffect(() => {
    if (vehicleFeatured.length <= 3) return;

    const maxIndex = Math.max(vehicleFeatured.length - 3, 0);

    const interval = setInterval(() => {
      setVehicleIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3900);

    return () => clearInterval(interval);
  }, [vehicleFeatured.length]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Linku u kopjua me sukses.");
    } catch (error) {
      alert("Nuk u kopjua linku.");
    }
  };

  const goPrevRelated = () => {
    setRelatedIndex((prev) => (prev <= 0 ? relatedMaxIndex : prev - 1));
  };

  const goNextRelated = () => {
    setRelatedIndex((prev) => (prev >= relatedMaxIndex ? 0 : prev + 1));
  };
  

  return (
    <div style={pageWrap}>
      <PublicHeader />

      <main
        style={{
          maxWidth: "1900px",
          margin: "0 auto",
          padding: isMobile ? "86px 10px 48px" : "118px 34px 84px"
        }}
      >
        {loading ? (
          <div
            style={{
              ...cardBase,
              borderRadius: "24px",
              padding: "28px",
              color: "#0f172a",
              fontWeight: "800"
            }}
          >
            Duke u ngarkuar...
          </div>
        ) : !post ? (
          <div
            style={{
              ...cardBase,
              borderRadius: "24px",
              padding: "28px",
              color: "#0f172a",
              fontWeight: "800"
            }}
          >
            Nuk u gjet konkursi.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                isMobile || isTablet ? "1fr" : "minmax(0, 1fr) 360px",
              gap: isMobile ? "16px" : "22px",
              alignItems: "start"
            }}
          >
            <section style={{ display: "grid", gap: isMobile ? "14px" : "18px" }}>
              <div
                style={{
                  ...cardBase,
                  borderRadius: isMobile ? "20px" : "28px",
                  padding: isMobile ? "14px" : "24px"
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      post.image_url && !isMobile
                        ? "280px minmax(0, 1fr)"
                        : "1fr",
                    gap: "22px",
                    alignItems: "center"
                  }}
                >
                  {post.image_url && (
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #dbe7f5",
                        borderRadius: "20px",
                        overflow: "hidden",
                        minHeight: isMobile ? "185px" : "225px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <img
                        src={post.image_url}
                        alt={post.title}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: isMobile ? "210px" : "240px",
                          objectFit: "contain",
                          display: "block",
                          background: "#fff",
                          padding: "14px",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "8px 14px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "950",
                        background: "rgba(37,99,235,0.10)",
                        color: "#1d4ed8",
                        marginBottom: "13px",
                        textTransform: "uppercase"
                      }}
                    >
                      Konkurs Pune
                    </div>

                    <h1
                      style={{
                        margin: "0 0 16px",
                        fontSize: isMobile ? "30px" : "46px",
                        lineHeight: "1.05",
                        color: "#07132b",
                        wordBreak: "break-word",
                        letterSpacing: "-0.055em"
                      }}
                    >
                      {post.title}
                    </h1>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px 20px",
                        color: "#475569",
                        fontSize: isMobile ? "13px" : "14px",
                        fontWeight: "800"
                      }}
                    >
                      {formattedDate && (
                        <div>
                          <strong style={{ color: "#0f172a" }}>
                            Publikuar:
                          </strong>{" "}
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
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "repeat(4, minmax(0, 1fr))",
                  gap: "14px"
                }}
              >
                {[
                  ["🏢", "Kompani", companyName],
                  ["📂", "Kategoritë", jobCategory],
                  ["📍", "Vendi i punës", jobLocation],
                  ["👥", "Numri i pozitave", positionsCount]
                ].map(([icon, label, value]) => (
                  <div
                    key={label}
                    style={{
                      ...cardBase,
                      borderRadius: "20px",
                      padding: isMobile ? "15px 16px" : "18px",
                      background:
                        "linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,251,255,0.94))",
                      border: "1px solid rgba(148,163,184,0.28)",
                      boxShadow: "0 16px 40px rgba(15,23,42,0.055)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "14px",
                          background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          boxShadow: "inset 0 0 0 1px rgba(37,99,235,0.12)"
                        }}
                      >
                        {icon}
                      </div>

                      <div>
                        <div style={{ color: "#64748b", fontSize: "13px", fontWeight: "750" }}>
                          {label}
                        </div>

                        <div
                          style={{
                            color: "#07132b",
                            fontWeight: "950",
                            marginTop: "4px",
                            fontSize: "15px",
                            lineHeight: "1.3",
                            wordBreak: "break-word"
                          }}
                        >
                          {value || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <article
              
                style={{
                  ...cardBase,
                  borderRadius: isMobile ? "20px" : "28px",
                  padding: isMobile ? "20px 16px" : "32px"
                }}
              >
                <h2
                  style={{
                    color: "#07132b",
                    fontWeight: "950",
                    fontSize: isMobile ? "24px" : "30px",
                    margin: "0 0 20px",
                    letterSpacing: "-0.035em"
                  }}
                >
                  Përshkrimi i konkursit
                </h2>

                <div
                  className="job-description-content"
                  dangerouslySetInnerHTML={{
                    __html: descriptionHtml || "Nuk ka përshkrim."
                  }}
                />

                <style>
                  {`
                    .job-description-content {
                      color: #1f2f46;
                      font-size: ${isMobile ? "15.5px" : "16.5px"};
                      line-height: 1.9;
                      word-break: break-word;
                      overflow-wrap: anywhere;
                    }

                    .job-description-content p {
                      margin: 0 0 16px;
                    }

                    .job-description-content strong,
                    .job-description-content b {
                      color: #07132b;
                      font-weight: 950;
                    }

                    .job-description-content ul,
                    .job-description-content ol {
                      margin: 14px 0 20px 22px;
                      padding: 0;
                    }

                    .job-description-content li {
                      margin: 9px 0;
                      padding-left: 4px;
                    }

                    .job-description-content h1,
                    .job-description-content h2,
                    .job-description-content h3 {
                      color: #07132b;
                      margin: 24px 0 12px;
                      line-height: 1.25;
                    }

                    .job-description-content a {
                      color: #2563eb;
                      font-weight: 850;
                      text-decoration: none;
                    }
                  `}
                </style>
              </article>
             

{extraLinkUrl && (
  <div
    style={{
      ...cardBase,
      borderRadius: "22px",
      padding: isMobile ? "16px" : "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "14px",
      flexWrap: "wrap"
    }}
  >
    <div>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "950",
          color: "#0f172a",
          marginBottom: "6px"
        }}
      >
        Link i jashtëm
      </div>

      <div
        style={{
          color: "#64748b",
          fontSize: "14px",
          fontWeight: "750",
          wordBreak: "break-all"
        }}
      >
        {extraLinkUrl}
      </div>
    </div>

    <a
      href={extraLinkUrl}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "13px 22px",
        borderRadius: "14px",
        background: "#2563eb",
        color: "#fff",
        textDecoration: "none",
        fontWeight: "950",
        fontSize: "14px",
        transition: "0.2s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1d4ed8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#2563eb";
      }}
    >
      {extraLinkText || "Hape linkun"}
    </a>
  </div>
)}
              

              <div
                style={{
                  ...cardBase,
                  borderRadius: "22px",
                  padding: isMobile ? "16px" : "20px"
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "950",
                    color: "#0f172a",
                    marginBottom: "14px"
                  }}
                >
                  Shpërndaje shpalljen
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {[
                    [
                      "Facebook",
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        currentUrl
                      )}`
                    ],
                    [
                      "WhatsApp",
                      `https://wa.me/?text=${encodeURIComponent(currentUrl)}`
                    ],
                    [
                      "Email",
                      `mailto:?subject=${encodeURIComponent(
                        post.title
                      )}&body=${encodeURIComponent(currentUrl)}`
                    ]
                  ].map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      target={label === "Email" ? undefined : "_blank"}
                      rel={label === "Email" ? undefined : "noreferrer"}
                      style={{
                        flex: "1 1 150px",
                        minWidth: "135px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "13px 16px",
                        borderRadius: "14px",
                        textDecoration: "none",
                        fontWeight: "850",
                        fontSize: "14px",
                        border: "1px solid #dbe3ee",
                        background: "#fff",
                        color: "#0f172a"
                      }}
                    >
                      {label}
                    </a>
                  ))}

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    style={{
                      flex: "1 1 150px",
                      minWidth: "135px",
                      padding: "13px 16px",
                      borderRadius: "14px",
                      fontWeight: "850",
                      fontSize: "14px",
                      border: "1px solid #dbe3ee",
                      background: "#fff",
                      color: "#0f172a",
                      cursor: "pointer"
                    }}
                  >
                    Kopjo linkun
                  </button>
                </div>
              </div>

              {relatedPosts.length > 0 && (
                <div
                  style={{
                    ...cardBase,
                    borderRadius: isMobile ? "20px" : "28px",
                    padding: isMobile ? "18px 14px" : "24px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "18px"
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize: isMobile ? "23px" : "26px",
                        fontWeight: "950",
                        color: "#07132b"
                      }}
                    >
                      Shpallje të ngjashme
                    </h2>

                    {relatedPosts.length > relatedVisibleCount && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={goPrevRelated}
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "999px",
                            border: "1px solid #dbe3ee",
                            background: "#fff",
                            color: "#0f172a",
                            cursor: "pointer",
                            fontWeight: "950"
                          }}
                        >
                          ‹
                        </button>

                        <button
                          type="button"
                          onClick={goNextRelated}
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "999px",
                            border: "1px solid #dbe3ee",
                            background: "#0f172a",
                            color: "#fff",
                            cursor: "pointer",
                            fontWeight: "950"
                          }}
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ overflow: "hidden", width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        transform: `translateX(calc(-${relatedIndex} * ((100% - ${
                          relatedVisibleCount - 1
                        } * 16px) / ${relatedVisibleCount} + 16px)))`,
                        transition: "transform 0.55s cubic-bezier(.22,1,.36,1)"
                      }}
                    >
                      {relatedPosts.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            flex: `0 0 calc((100% - ${
                              relatedVisibleCount - 1
                            } * 16px) / ${relatedVisibleCount})`,
                            minWidth: 0
                          }}
                        >
                          <JobPostCard post={item} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {relatedPosts.length > relatedVisibleCount && (
                    <div
                      style={{
                        marginTop: "16px",
                        display: "flex",
                        justifyContent: "center",
                        gap: "7px"
                      }}
                    >
                      {Array.from({ length: relatedMaxIndex + 1 }).map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setRelatedIndex(index)}
                          aria-label={`Shko te slide ${index + 1}`}
                          style={{
                            width: relatedIndex === index ? "22px" : "8px",
                            height: "8px",
                            borderRadius: "999px",
                            border: "none",
                            background:
                              relatedIndex === index ? "#0f172a" : "#cbd5e1",
                            cursor: "pointer",
                            transition: "0.2s ease"
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {!isMobile && (
              <aside
                style={{
                  display: "grid",
                  gap: "18px",
                  alignSelf: "start",
                  position: isTablet ? "static" : "sticky",
                  top: "108px"
                }}
              >
                <div
                  style={{
                    ...cardBase,
                    borderRadius: "24px",
                    padding: "24px"
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 18px",
                      fontSize: "22px",
                      color: "#07132b",
                      fontWeight: "950"
                    }}
                  >
                    Detajet e konkursit
                  </h3>

                  <div style={{ display: "grid" }}>
                    {[
                      ["Data e publikimit", formattedDate || "-"],
                      ["Lloji", "Konkurs pune"],
                      ["Kompania", companyName]
                    ].map(([label, value], index) => (
                      <div
                        key={label}
                        style={{
                          padding: index === 0 ? "0 0 16px" : "16px 0",
                          borderBottom:
                            index === 2 ? "none" : "1px solid #e2e8f0"
                        }}
                      >
                        <div
                          style={{
                            color: "#64748b",
                            fontSize: "14px",
                            marginBottom: "6px"
                          }}
                        >
                          {label}
                        </div>
                        <div style={{ color: "#0f172a", fontWeight: "950" }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <SidebarRotator
  title="Patundshmëri të veçuara"
  posts={realEstateFeatured}
  index={realEstateIndex}
  type="realestate"
/>

<SidebarRotator
  title="Automjete të veçuara"
  posts={vehicleFeatured}
  index={vehicleIndex}
  type="auto"
/>
              </aside>
            )}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}