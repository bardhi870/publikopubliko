import React, { useEffect, useMemo, useState } from "react";
import PublicHeader from "../../../components/layout/PublicHeader";
import PublicFooter from "../../../components/layout/PublicFooter";
import NewsHero from "../../../components/news/NewsHero";
import NewsSection from "../../../components/news/NewsSection";
import BreakingTicker from "../../../components/news/BreakingTicker";
import NewsCard from "../../../components/news/NewsCard";
import TrendingTopics from "../../../components/news/TrendingTopics";
import MostReadSection from "../../../components/news/MostReadSection";
import QuickHeadlines from "../../../components/news/QuickHeadlines";
import EditorsPicksSection from "../../../components/news/EditorsPicksSection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function NewsHomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];

        const onlyNews = safeData.filter((item) =>
          ["vendi", "rajoni", "bota"].includes(item.category)
        );

        const sorted = [...onlyNews].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setPosts(sorted);
      })
      .catch((err) => {
        console.error("Gabim gjatë marrjes së lajmeve:", err);
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const featuredPosts = useMemo(() => {
    const featured = posts.filter((post) => post.featured);

    if (featured.length >= 3) {
      return featured.slice(0, 3);
    }

    return posts.slice(0, 3);
  }, [posts]);

  const breakingPosts = useMemo(() => {
    const breaking = posts.filter((post) => post.breaking);

    if (breaking.length > 0) {
      return breaking.slice(0, 6);
    }

    return posts.slice(0, 6);
  }, [posts]);

  const editorsPicks = useMemo(() => {
    if (!posts.length) return [];

    const mostReadTwo = [...posts]
      .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
      .slice(0, 2);

    const newestOne = [...posts]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .find((p) => !mostReadTwo.some((x) => x.id === p.id));

    return newestOne ? [...mostReadTwo, newestOne] : mostReadTwo;
  }, [posts]);

  const latestPosts = useMemo(() => {
    const excludedIds = new Set([
      ...featuredPosts.map((p) => p.id),
      ...breakingPosts.map((p) => p.id),
      ...editorsPicks.map((p) => p.id),
    ]);

    return posts
      .filter((post) => !excludedIds.has(post.id))
      .slice(0, 6);
  }, [posts, featuredPosts, breakingPosts, editorsPicks]);

  const vendiPosts = useMemo(
    () => posts.filter((post) => post.category === "vendi").slice(0, 4),
    [posts]
  );

  const rajoniPosts = useMemo(
    () => posts.filter((post) => post.category === "rajoni").slice(0, 4),
    [posts]
  );

  const botaPosts = useMemo(
    () => posts.filter((post) => post.category === "bota").slice(0, 4),
    [posts]
  );

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
          padding: "18px 16px 60px",
        }}
      >
        <BreakingTicker posts={breakingPosts} />

        <div
          style={{
            marginTop: "20px",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                padding: "7px 12px",
                borderRadius: "999px",
                background: "rgba(37,99,235,0.08)",
                color: "#1d4ed8",
                border: "1px solid rgba(37,99,235,0.10)",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Editorial Newsroom
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(34px, 5vw, 62px)",
                lineHeight: 0.96,
                fontWeight: 900,
                letterSpacing: "-0.05em",
                color: "#0f172a",
                maxWidth: "900px",
              }}
            >
              Lajmet më të fundit nga vendi, rajoni dhe bota.
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "720px",
                color: "#475569",
                fontSize: "16px",
                lineHeight: 1.7,
              }}
            >
              Një faqe moderne lajmesh me strukturë të pastër, histori kryesore,
              seksione editoriale dhe përmbajtje të organizuar qartë.
            </p>
          </div>
        </div>

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
            Duke ngarkuar lajmet...
          </div>
        ) : posts.length === 0 ? (
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
            Nuk ka lajme për shfaqje.
          </div>
        ) : (
          <>
            <NewsHero posts={featuredPosts} />

            <EditorsPicksSection posts={editorsPicks} />

            <TrendingTopics posts={posts} />

            <MostReadSection posts={posts} />

            {latestPosts.length > 0 && (
              <section
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  marginBottom: "46px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "28px",
                      borderRadius: "0px",
                      background: "linear-gradient(180deg, #0f172a, #334155)",
                    }}
                  />

                  <h2
                    style={{
                      margin: 0,
                      fontSize: "30px",
                      lineHeight: 1.05,
                      fontWeight: 900,
                      letterSpacing: "-0.04em",
                      color: "#0f172a",
                    }}
                  >
                    Të fundit
                  </h2>
                </div>

                <div
                  className="latest-news-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "18px",
                  }}
                >
                  {latestPosts.map((post) => (
                    <NewsCard key={post.id} post={post} variant="default" />
                  ))}
                </div>
              </section>
            )}

            <NewsSection
              title="Vendi"
              posts={vendiPosts}
              viewAllLink="/lajme/vendi"
            />

            <NewsSection
              title="Rajoni"
              posts={rajoniPosts}
              viewAllLink="/lajme/rajoni"
            />

            <NewsSection
              title="Bota"
              posts={botaPosts}
              viewAllLink="/lajme/bota"
            />

            <QuickHeadlines posts={posts} />
          </>
        )}
      </main>

      <PublicFooter />

      <style>
        {`
          @media (max-width: 1024px) {
            .latest-news-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 680px) {
            .latest-news-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}