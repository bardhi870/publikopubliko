import React from "react";
import { Link } from "react-router-dom";

const isFeatured = (post) =>
  post?.featured === true ||
  post?.featured === "true" ||
  post?.featured === 1 ||
  post?.featured === "1" ||
  post?.is_featured === true ||
  post?.is_featured === "true" ||
  post?.is_featured === 1 ||
  post?.is_featured === "1";

const isNewPost = (createdAt) => {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() <= 3 * 24 * 60 * 60 * 1000;
};

const formatPrice = (price) => {
  if (!price) return "Me marrëveshje";

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice)) return `${price} €`;

  return `${numericPrice.toLocaleString("de-DE")} €`;
};

export default function RealEstatePostCardHome({ post, index = 0 }) {
  const detailUrl = `/patundshmeri/${post?.id}`;
  const featured = isFeatured(post);
  const isNew = isNewPost(post?.created_at);

  return (
    <Link to={detailUrl} className="re-home-card">
      <div className="re-home-image">
        {post?.image_url ? (
          <img
            src={post.image_url}
            alt={post?.title || "Patundshmëri"}
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="re-home-fallback">Patundshmëri</div>
        )}

        <div className="re-home-badges">
          {featured && <span className="re-home-badge re-home-premium">Premium</span>}
          {!featured && isNew && <span className="re-home-badge re-home-new">E re</span>}
        </div>
      </div>

      <div className="re-home-body">
        <h3>{post?.title || "Patundshmëri"}</h3>

        <p className="re-home-city">
          {post?.city || post?.location || "Lokacion i panjohur"}
        </p>

        <div className="re-home-bottom">
          <span className="re-home-price">{formatPrice(post?.price)}</span>
          <span className="re-home-link">Shiko →</span>
        </div>
      </div>
    </Link>
  );
}