import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicHeader from "../../../components/layout/PublicHeader";
import PublicFooter from "../../../components/layout/PublicFooter";
import NewsCard from "../../../components/news/NewsCard";
import NewsMediaSlider from "../../../components/news/NewsMediaSlider";
import { trackEvent } from "../../../utils/analytics";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const categoryLabels = {
  vendi: "Vendi",
  rajoni: "Rajoni",
  bota: "Bota",
};

const portalSections = [
  {
    title: "Patundshmëri",
    subtitle: "Shiko pronat më të fundit në platformë.",
    category: "patundshmeri",
    link: "/patundshmeri",
    badge: "Prona"
  },
  {
    title: "Automjete",
    subtitle: "Automjetet e fundit të publikuara.",
    category: "automjete",
    link: "/automjete",
    badge: "Auto"
  },
  {
    title: "Konkurse pune",
    subtitle: "Mundësitë më të reja për punësim.",
    category: "konkurse-pune",
    link: "/konkurse-pune",
    badge: "Punë"
  }
];

function formatDate(date) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("sq-AL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function stripHtml(html = "") {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function normalizeUrl(url = "") {
  const clean = String(url || "").trim();
  if (!clean) return "";
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  return `https://${clean}`;
}

function getPostImage(post) {
  if (Array.isArray(post?.gallery_images) && post.gallery_images.length > 0) {
    return post.gallery_images[0];
  }

  return post?.image_url || "";
}

function getPostText(post) {
  return stripHtml(post?.excerpt || post?.description || "").slice(0, 120);
}

function getPostPrice(post) {
  if (!post?.price) return "";
  return `${Number(post.price).toLocaleString("de-DE")} €`;
}

function MiniPortalCard({ item, badge }) {
  const image = getPostImage(item);
  const text = getPostText(item);
  const price = getPostPrice(item);

  return (
    <Link
      to={`/${item.category}/${item.slug || item.id}`}
      className="portal-mini-card"
      style={{
        display: "grid",
        gridTemplateColumns: "120px minmax(0,1fr)",
        gap: "14px",
        textDecoration: "none",
        color: "#0f172a",
        border: "1px solid #dbe3ea",
        background: "#fff",
        minHeight: "120px",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          background: "#f1f5f9",
          minHeight: "120px",
          overflow: "hidden"
        }}
      >
        {image ? (
          <img
            src={image}
            alt={item.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block"
            }}
          />
        ) : null}
      </div>

      <div
        style={{
          padding: "14px 14px 14px 0",
          minWidth: 0
        }}
      >
        <div
          style={{
            display: "inline-flex",
            marginBottom: "8px",
            padding: "5px 8px",
            background: "#eff6ff",
            color: "#2563eb",
            fontSize: "11px",
            fontWeight: 900,
            textTransform: "uppercase"
          }}
        >
          {badge}
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            lineHeight: 1.25,
            fontWeight: 900,
            letterSpacing: "-0.02em"
          }}
        >
          {item.title}
        </h3>

        {text && (
          <p
            style={{
              margin: "7px 0 0",
              color: "#64748b",
              fontSize: "13px",
              lineHeight: 1.55
            }}
          >
            {text}...
          </p>
        )}

        {price && (
          <div
            style={{
              marginTop: "8px",
              color: "#0f172a",
              fontSize: "14px",
              fontWeight: 900
            }}
          >
            {price}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function NewsArticlePage() {
  const { slug } = useParams();
  const [allPosts, setAllPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  trackEvent({
    event_type: "page_view",
    page_url: window.location.pathname,
    category: post?.category || "lajme"
  });
}, [post?.id]);
useEffect(() => {
  const startTime = Date.now();

  return () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);

    trackEvent({
      event_type: "time_on_page",
      duration_seconds: duration,
      page_url: window.location.pathname,
      category: post?.category || "lajme",
      post_id: post?.id
    });
  };
}, [post?.id]);

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];
        const onlyNews = safeData.filter((item) =>
          ["vendi", "rajoni", "bota"].includes(item.category)
        );

        setAllPosts(safeData);

        const found =
          onlyNews.find((item) => item.slug === slug) ||
          onlyNews.find((item) => String(item.id) === String(slug)) ||
          null;

        setPost(found);

        if (found?.id) {
          fetch(`${API_URL}/api/posts/${found.id}/view`, {
            method: "PATCH",
          }).catch((err) => {
            console.error("Gabim në views count:", err);
          });
        }
      })
      .catch((err) => {
        console.error("Gabim gjatë marrjes së artikullit:", err);
        setAllPosts([]);
        setPost(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];

    return allPosts
      .filter(
        (item) =>
          ["vendi", "rajoni", "bota"].includes(item.category) &&
          item.id !== post.id &&
          item.category === post.category
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
  }, [allPosts, post]);

  const portalPostsByCategory = useMemo(() => {
  return portalSections.reduce((acc, section) => {
    acc[section.category] = allPosts
      .filter((item) =>
        item.category === section.category &&
        item.is_active !== false && // vetëm aktive
        (item.image_url || (item.gallery_images && item.gallery_images.length > 0)) // vetëm me foto
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4);

    return acc;
  }, {});
}, [allPosts]);

  const articleContent =
    post?.content ||
    post?.description ||
    post?.excerpt ||
    "<p>Përmbajtja e artikullit nuk është shtuar ende.</p>";

  const mediaImages =
    Array.isArray(post?.gallery_images) && post.gallery_images.length > 0
      ? post.gallery_images
      : post?.image_url
      ? [post.image_url]
      : [];

  const externalLink = post?.external_link || post?.externalLink || "";

  const externalLinkLabel =
    post?.external_link_label || post?.externalLinkLabel || "Hap linkun";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
      }}
    >
      <PublicHeader />

      <main
        style={{
          maxWidth: "2000px",
          margin: "0 auto",
          padding: "20px 38px 64px",
        }}
      >
        {loading ? (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbe3ea",
              padding: "40px 24px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Duke ngarkuar artikullin...
          </div>
        ) : !post ? (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbe3ea",
              padding: "40px 24px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Artikulli nuk u gjet.
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "18px" }}>
              <Link
                to={post.category ? `/lajme/${post.category}` : "/lajme"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                  color: "#2563eb",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "10px 14px",
                  borderRadius: "999px",
                  background: "rgba(37, 100, 235, 0.17)",
                  border: "1px solid rgba(37,99,235,0.10)",
                }}
              >
                ← Kthehu te {categoryLabels[post.category] || "Lajmet"}
              </Link>
            </div>

            <section
              style={{
                background: "#ffffff",
                border: "1px solid #dbe3ea",
                marginBottom: "28px",
                overflow: "hidden",
              }}
            >
              <NewsMediaSlider
                images={mediaImages}
                videoUrl={post.video_url || ""}
                height="620px"
              />

              <div
                style={{
                  padding: "34px",
                  borderTop: "1px solid #dbe3ea",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <span
                    style={{
                      padding: "7px 12px",
                      borderRadius: "999px",
                      background: "rgba(37,99,235,0.08)",
                      color: "#2563eb",
                      fontSize: "12px",
                      fontWeight: 800,
                      border: "1px solid rgba(37,99,235,0.10)",
                    }}
                  >
                    {categoryLabels[post.category] || "Lajm"}
                  </span>

                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {formatDate(post.created_at)}
                  </span>

                  {typeof post.views_count !== "undefined" && (
                    <span
                      style={{
                        color: "#64748b",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      • {post.views_count || 0} lexime
                    </span>
                  )}
                </div>

                <h1
                  style={{
                    margin: "0 0 12px",
                    color: "#0f172a",
                    fontSize: "clamp(36px,5vw,76px)",
                    lineHeight: 0.97,
                    fontWeight: 900,
                    letterSpacing: "-0.05em",
                    maxWidth: "1400px",
                  }}
                >
                  {post.title}
                </h1>

                {externalLink && (
  <a
    href={normalizeUrl(externalLink)}
    target="_blank"
    rel="noreferrer"
    onClick={() =>
      trackEvent({
        event_type: "post_click",
        element_name: "external_link",
        post_id: post?.id,
        page_url: window.location.pathname
      })
    }
    style={{
      display: "inline-flex",
      marginTop: "20px",
      padding: "13px 18px",
      background: "#2563eb",
      color: "#fff",
      textDecoration: "none",
      fontWeight: 900,
      fontSize: "14px",
    }}
  >
    {externalLinkLabel} →
  </a>
)}
              </div>
            </section>

            <section
              className="article-layout"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1fr) 360px",
                gap: "24px",
                alignItems: "start",
              }}
            >
              <article
                style={{
                  background: "#fff",
                  border: "1px solid #dbe3ea",
                  padding: "32px",
                }}
              >
                <div
                  className="post-rich-text"
                  style={{
                    maxWidth: "1180px",
                    fontSize: "19px",
                    lineHeight: 1.95,
                    color: "#334155",
                  }}
                  dangerouslySetInnerHTML={{ __html: articleContent }}
                />

                {externalLink && (
                  <a
                    href={normalizeUrl(externalLink)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      marginTop: "28px",
                      padding: "14px 20px",
                      background: "#0f172a",
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 900,
                      fontSize: "14px",
                    }}
                  >
                    {externalLinkLabel} →
                  </a>
                )}
              </article>

              <aside
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  position: "sticky",
                  top: "100px",
                }}
              >
                <div className="side-card">
                  <div className="side-label">Kategoria</div>
                  <div className="side-title">{categoryLabels[post.category]}</div>

                  <Link to={`/lajme/${post.category}`} className="side-link">
                    Shiko më shumë →
                  </Link>
                </div>

                <div className="side-card">
                  <div className="side-label">Publikuar</div>
                  <div className="side-title-small">
                    {formatDate(post.created_at)}
                  </div>
                </div>

                {externalLink && (
                  <div className="side-card">
                    <div className="side-label">Link ekstra</div>

                    <a
                      href={normalizeUrl(externalLink)}
                      target="_blank"
                      rel="noreferrer"
                      className="side-btn"
                    >
                      {externalLinkLabel} →
                    </a>
                  </div>
                )}
              </aside>
            </section>

            {relatedPosts.length > 0 && (
              <section
                style={{
                  marginTop: "40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "30px",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Lexo gjithashtu
                </h2>

                <div
                  className="related-news-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
                    gap: "18px",
                  }}
                >
                  {relatedPosts.map((item) => (
                    <NewsCard key={item.id} post={item} />
                  ))}
                </div>
              </section>
            )}

            <section className="portal-bottom-section">
              <div className="portal-bottom-head">
                <div>
                  <div className="portal-kicker">Nga Publiko</div>
                  <h2>Shiko edhe kategori tjera</h2>
                  <p>
                    Zbulo shpallje të fundit nga patundshmëritë, automjetet dhe
                    konkurset e punës.
                  </p>
                </div>

                <Link to="/" className="portal-all-link">
                  Shko në ballinë →
                </Link>
              </div>

              <div className="portal-section-grid">
                {portalSections.map((section) => {
                  const items = portalPostsByCategory[section.category] || [];

                  return (
                    <div key={section.category} className="portal-category-box">
                      <div className="portal-category-top">
                        <div>
                          <span>{section.badge}</span>
                          <h3>{section.title}</h3>
                          <p>{section.subtitle}</p>
                        </div>

                        <Link to={section.link}>Shiko të gjitha →</Link>
                      </div>

                      {items.length > 0 ? (
                        <div className="portal-mini-list">
                          {items.map((item) => (
                            <MiniPortalCard
                              key={item.id}
                              item={item}
                              badge={section.badge}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="portal-empty">
                          Ende nuk ka postime në këtë kategori.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <style>
              {`
                .side-card{
                  background:#fff;
                  border:1px solid #dbe3ea;
                  padding:20px;
                }

                .side-label{
                  font-size:12px;
                  font-weight:800;
                  letter-spacing:.08em;
                  text-transform:uppercase;
                  color:#2563eb;
                  margin-bottom:8px;
                }

                .side-title{
                  font-size:20px;
                  font-weight:900;
                  margin-bottom:10px;
                }

                .side-title-small{
                  font-size:16px;
                  font-weight:700;
                }

                .side-link{
                  text-decoration:none;
                  color:#2563eb;
                  font-weight:700;
                }

                .side-btn{
                  display:inline-flex;
                  width:100%;
                  justify-content:center;
                  padding:13px 14px;
                  background:#2563eb;
                  color:#fff;
                  text-decoration:none;
                  font-weight:900;
                  box-sizing:border-box;
                }

                .post-rich-text p{
                  margin:0 0 18px;
                }

                .post-rich-text h1,
                .post-rich-text h2,
                .post-rich-text h3{
                  color:#0f172a;
                  line-height:1.18;
                  margin:26px 0 14px;
                  letter-spacing:-0.03em;
                }

                .post-rich-text h1{font-size:38px;}
                .post-rich-text h2{font-size:30px;}
                .post-rich-text h3{font-size:24px;}

                .post-rich-text img{
                  width:100%;
                  max-height:620px;
                  object-fit:cover;
                  display:block;
                  margin:28px 0;
                  border-radius:0;
                }

                .post-rich-text iframe{
                  width:100%;
                  min-height:460px;
                  display:block;
                  margin:28px 0;
                  border:0;
                }

                .post-rich-text strong{
                  color:#0f172a;
                  font-weight:900;
                }

                .post-rich-text ul,
                .post-rich-text ol{
                  margin:0 0 18px 24px;
                  padding:0;
                }

                .post-rich-text a{
                  color:#2563eb;
                  font-weight:800;
                }

                .portal-bottom-section{
                  margin-top:54px;
                  border:1px solid #dbe3ea;
                  background:#f8fafc;
                  padding:28px;
                }

                .portal-bottom-head{
                  display:flex;
                  justify-content:space-between;
                  gap:18px;
                  align-items:flex-end;
                  margin-bottom:22px;
                }

                .portal-kicker{
                  color:#2563eb;
                  font-weight:900;
                  text-transform:uppercase;
                  letter-spacing:.08em;
                  font-size:12px;
                  margin-bottom:8px;
                }

                .portal-bottom-head h2{
                  margin:0;
                  font-size:34px;
                  line-height:1;
                  font-weight:900;
                  letter-spacing:-.05em;
                }

                .portal-bottom-head p{
                  margin:10px 0 0;
                  color:#64748b;
                  max-width:680px;
                  line-height:1.7;
                }

                .portal-all-link{
                  text-decoration:none;
                  background:#0f172a;
                  color:#fff;
                  padding:13px 16px;
                  font-weight:900;
                  white-space:nowrap;
                }

                .portal-section-grid{
                  display:grid;
                  grid-template-columns:repeat(3,minmax(0,1fr));
                  gap:18px;
                }

                .portal-category-box{
                  background:#fff;
                  border:1px solid #dbe3ea;
                  padding:18px;
                }

                .portal-category-top{
                  display:flex;
                  justify-content:space-between;
                  gap:14px;
                  margin-bottom:16px;
                  align-items:flex-start;
                }

                .portal-category-top span{
                  display:inline-flex;
                  background:#eff6ff;
                  color:#2563eb;
                  padding:6px 9px;
                  font-size:11px;
                  font-weight:900;
                  text-transform:uppercase;
                  margin-bottom:9px;
                }

                .portal-category-top h3{
                  margin:0;
                  font-size:24px;
                  font-weight:900;
                  letter-spacing:-.04em;
                }

                .portal-category-top p{
                  margin:7px 0 0;
                  color:#64748b;
                  font-size:14px;
                  line-height:1.55;
                }

                .portal-category-top a{
                  color:#2563eb;
                  text-decoration:none;
                  font-weight:900;
                  font-size:13px;
                  white-space:nowrap;
                }

                .portal-mini-list{
                  display:flex;
                  flex-direction:column;
                  gap:12px;
                }

                .portal-empty{
                  border:1px dashed #cbd5e1;
                  padding:18px;
                  color:#64748b;
                  font-size:14px;
                  background:#f8fafc;
                }

                .portal-mini-card:hover h3{
                  color:#2563eb;
                }

                @media (max-width:1180px){
                  .portal-section-grid{
                    grid-template-columns:1fr;
                  }
                }

                @media (max-width:1080px){
                  .article-layout{
                    grid-template-columns:1fr !important;
                  }

                  aside{
                    position:static !important;
                  }
                }

                @media (max-width:900px){
                  main{
                    padding-left:18px !important;
                    padding-right:18px !important;
                  }

                  .related-news-grid{
                    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
                  }

                  .portal-bottom-head{
                    flex-direction:column;
                    align-items:flex-start;
                  }
                }

                @media (max-width:680px){
                  .related-news-grid{
                    grid-template-columns:1fr !important;
                  }

                  .portal-mini-card{
                    grid-template-columns:1fr !important;
                  }

                  .portal-mini-card > div:first-child{
                    height:190px;
                  }
                }
              `}
            </style>
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}