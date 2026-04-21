import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicHeader from "../../../components/layout/PublicHeader";
import PublicFooter from "../../../components/layout/PublicFooter";
import NewsCard from "../../../components/news/NewsCard";
import NewsMediaSlider from "../../../components/news/NewsMediaSlider";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const categoryLabels = {
  vendi: "Vendi",
  rajoni: "Rajoni",
  bota: "Bota",
};

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

export default function NewsArticlePage() {
  const { slug } = useParams();
  const [allPosts, setAllPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];

        const onlyNews = safeData.filter((item) =>
          ["vendi", "rajoni", "bota"].includes(item.category)
        );

        setAllPosts(onlyNews);

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
          item.id !== post.id &&
          item.category === post.category
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
  }, [allPosts, post]);

  const articleContent =
    post?.content ||
    post?.description ||
    post?.excerpt ||
    "Përmbajtja e artikullit nuk është shtuar ende.";

  const mediaImages =
    Array.isArray(post?.gallery_images) && post.gallery_images.length > 0
      ? post.gallery_images
      : post?.image_url
      ? [post.image_url]
      : [];

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
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "20px 16px 64px",
        }}
      >
        {loading ? (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbe3ea",
              borderRadius: "0px",
              padding: "40px 24px",
              textAlign: "center",
              color: "#64748b",
              boxShadow: "none",
            }}
          >
            Duke ngarkuar artikullin...
          </div>
        ) : !post ? (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbe3ea",
              borderRadius: "0px",
              padding: "40px 24px",
              textAlign: "center",
              color: "#64748b",
              boxShadow: "none",
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
                borderRadius: "0px",
                background: "#ffffff",
                boxShadow: "none",
                border: "1px solid #dbe3ea",
                marginBottom: "28px",
                overflow: "hidden",
              }}
            >
              <NewsMediaSlider
                images={mediaImages}
                videoUrl={post.video_url || ""}
                height="520px"
              />

              <div
                style={{
                  padding: "30px",
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
                    fontSize: "clamp(32px,6vw,66px)",
                    lineHeight: 0.97,
                    fontWeight: 900,
                    letterSpacing: "-0.05em",
                  }}
                >
                  {post.title}
                </h1>

                {(post.excerpt || post.description) && (
                  <p
                    style={{
                      margin: 0,
                      color: "#475569",
                      fontSize: "17px",
                      lineHeight: 1.75,
                      maxWidth: "760px",
                    }}
                  >
                    {post.excerpt || post.description}
                  </p>
                )}
              </div>
            </section>

            <section
              className="article-layout"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1fr) 320px",
                gap: "24px",
                alignItems: "start",
              }}
            >
              <article
                style={{
                  background: "#fff",
                  border: "1px solid #dbe3ea",
                  borderRadius: "0px",
                  boxShadow: "none",
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    maxWidth: "860px",
                    fontSize: "18px",
                    lineHeight: 1.95,
                    color: "#334155",
                    whiteSpace: "pre-line",
                  }}
                >
                  {articleContent}
                </div>
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
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #dbe3ea",
                    borderRadius: "0px",
                    boxShadow: "none",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "#2563eb",
                      marginBottom: "8px",
                    }}
                  >
                    Kategoria
                  </div>

                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 900,
                      marginBottom: "10px",
                    }}
                  >
                    {categoryLabels[post.category]}
                  </div>

                  <Link
                    to={`/lajme/${post.category}`}
                    style={{
                      textDecoration: "none",
                      color: "#2563eb",
                      fontWeight: 700,
                    }}
                  >
                    Shiko më shumë →
                  </Link>
                </div>

                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #dbe3ea",
                    borderRadius: "0px",
                    boxShadow: "none",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "#2563eb",
                      marginBottom: "8px",
                    }}
                  >
                    Publikuar
                  </div>

                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                    }}
                  >
                    {formatDate(post.created_at)}
                  </div>
                </div>
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

            <style>
              {`
                @media (max-width:1080px){
                  .article-layout{
                    grid-template-columns:1fr !important;
                  }
                }

                @media (max-width:900px){
                  .related-news-grid{
                    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
                  }
                }

                @media (max-width:680px){
                  .related-news-grid{
                    grid-template-columns:1fr !important;
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