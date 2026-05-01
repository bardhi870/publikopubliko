import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import JobCategoryPosts from "./JobCategoryPosts";
import RealEstateCategoryPosts from "./RealEstateCategoryPosts";
import VehicleCategoryPosts from "./VehicleCategoryPosts";
import { getPostsByCategory } from "../../api/postApi";

export default function CategoryPosts(props) {
  const category = String(props.category || "").trim().toLowerCase();

  const sharedProps = {
    initialLimit: props.initialLimit ?? 16,
    showMoreStep: props.showMoreStep ?? 16,
    variant: props.variant || "category",
    filters: props.filters || {},
    ...props
  };

  switch (category) {
    case "konkurse-pune":
      return <JobCategoryPosts {...sharedProps} />;

    case "patundshmeri":
    case "patundshmëri":
      return <RealEstateCategoryPosts {...sharedProps} category="patundshmeri" />;

    case "automjete":
      return <VehicleCategoryPosts {...sharedProps} />;

    case "lajme":
      return <NewsHomePosts {...sharedProps} />;

    default:
      return null;
  }
}

function NewsHomePosts({ variant = "home", initialLimit = 8 }) {
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

        const allNews = [...vendi, ...rajoni, ...bota];

        if (alive) {
          setPosts(allNews);
        }
      } catch (error) {
        console.error("Gabim gjatë marrjes së lajmeve:", error);

        if (alive) {
          setPosts([]);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      alive = false;
    };
  }, []);

  const visiblePosts = useMemo(() => {
    const sorted = [...posts];

    if (variant === "most-read") {
      sorted.sort(
        (a, b) => Number(b.views_count || 0) - Number(a.views_count || 0)
      );
    } else {
      sorted.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
    }

    return sorted.slice(0, initialLimit);
  }, [posts, variant, initialLimit]);

  if (loading) {
    return <div className="news-home-empty">Duke u ngarkuar lajmet...</div>;
  }

  if (!visiblePosts.length) {
    return <div className="news-home-empty">Nuk ka lajme të publikuara ende.</div>;
  }

  return (
    <div className="news-home-grid">
      {visiblePosts.map((post) => {
        const image =
          post.image_url ||
          (Array.isArray(post.gallery_images) && post.gallery_images.length
            ? post.gallery_images[0]
            : "") ||
          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop";

        return (
          <Link
            key={post.id}
            to={`/lajme/${post.id}`}
            className="news-home-card"
          >
            <div className="news-home-media">
              <img src={image} alt={post.title || "Lajm"} loading="lazy" />

              <span className="news-home-badge">
                {variant === "most-read" ? "Më i lexuar" : "E re"}
              </span>
            </div>

            <div className="news-home-body">
              <h3>{post.title || "Pa titull"}</h3>

              {post.description && (
                <p>
                  {stripHtml(post.description).length > 120
                    ? `${stripHtml(post.description).slice(0, 120)}...`
                    : stripHtml(post.description)}
                </p>
              )}

              <div className="news-home-meta">
                <span>{formatDate(post.created_at)}</span>
                <span>{Number(post.views_count || 0)} lexime</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
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