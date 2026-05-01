import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPostsByCategory } from "../../api/postApi";

export default function HomeNewsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadNews() {
      try {
        setLoading(true);

        const [vendi, rajoni, bota] = await Promise.all([
          getPostsByCategory("vendi"),
          getPostsByCategory("rajoni"),
          getPostsByCategory("bota")
        ]);

        if (alive) {
          setPosts([...vendi, ...rajoni, ...bota]);
        }
      } catch (error) {
        console.error("Gabim gjatë marrjes së lajmeve:", error);
        if (alive) setPosts([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadNews();

    return () => {
      alive = false;
    };
  }, []);

  const latestNews = useMemo(() => {
    return [...posts].sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
  }, [posts]);

  const mostRead = useMemo(() => {
    return [...posts]
      .sort((a, b) => Number(b.views_count || 0) - Number(a.views_count || 0))
      .slice(0, 5);
  }, [posts]);

  const mainPost = latestNews[0];
  const sidePosts = latestNews.slice(1, 5);

  if (loading) {
    return (
      <section className="home-news-section">
        <div className="home-news-empty">Duke u ngarkuar lajmet...</div>
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section className="home-news-section">
        <div className="home-news-empty">Nuk ka lajme të publikuara ende.</div>
      </section>
    );
  }

  return (
    <section className="home-news-section">
      <div className="home-news-head">
        <div>
          <div className="section-eyebrow news-eyebrow">
            <div className="news-icon">
              <span>N</span>
            </div>
            Lajme
          </div>

          <h2 className="home-section-title">Lajmet kryesore</h2>

          <p className="home-section-subtitle">
            Lajmet e fundit, më të lexuarat dhe temat kryesore të ditës.
          </p>
        </div>

        <Link to="/lajme" className="home-section-link">
          Shiko të gjitha →
        </Link>
      </div>

      <div className="home-news-layout">
        {mainPost && (
          <Link to={`/lajme/${mainPost.id}`} className="home-news-main">
            <img src={getImage(mainPost)} alt={mainPost.title || "Lajm"} />

            <div className="home-news-main-overlay">
              <span>{formatCategory(mainPost.category)}</span>
              <h3>{mainPost.title}</h3>
              <p>{stripHtml(mainPost.description).slice(0, 150)}...</p>

              <div>
                {formatDate(mainPost.created_at)} •{" "}
                {Number(mainPost.views_count || 0)} lexime
              </div>
            </div>
          </Link>
        )}

        <div className="home-news-side">
          {sidePosts.map((post) => (
            <Link key={post.id} to={`/lajme/${post.id}`} className="home-news-small">
              <img src={getImage(post)} alt={post.title || "Lajm"} />

              <div>
                <span>{formatCategory(post.category)}</span>
                <h4>{post.title}</h4>
                <small>
                  {formatDate(post.created_at)} • {Number(post.views_count || 0)} lexime
                </small>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="home-news-trending">
        <div className="home-news-trending-title">Më të lexuarat</div>

        <div className="home-news-trending-list">
          {mostRead.map((post, index) => (
            <Link key={post.id} to={`/lajme/${post.id}`} className="home-news-trending-item">
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span>{post.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function getImage(post) {
  return (
    post.image_url ||
    (Array.isArray(post.gallery_images) && post.gallery_images[0]) ||
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1400&auto=format&fit=crop"
  );
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value) {
  if (!value) return "Së fundmi";

  try {
    return new Date(value).toLocaleDateString("sq-AL", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return "Së fundmi";
  }
}

function formatCategory(category) {
  switch (category) {
    case "vendi":
      return "Vendi";
    case "rajoni":
      return "Rajoni";
    case "bota":
      return "Bota";
    default:
      return "Lajme";
  }
}