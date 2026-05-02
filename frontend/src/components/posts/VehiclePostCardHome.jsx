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

export default function VehiclePostCardHome({ post, index = 0 }) {
  const image = post?.image_url || post?.image || "";
  const featured = isFeatured(post);
  const isNew = isNewPost(post?.created_at);

  return (
    <Link to={`/automjete/${post.id}`} className="vehicle-home-card">
      <div className="vehicle-home-media">
        {image ? (
          <img
            src={image}
            alt={post?.title || "Automjet"}
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="vehicle-home-empty">Automjet</div>
        )}

        <div className="vehicle-home-badges">
          {featured && <span className="vehicle-home-featured">Premium</span>}
          {!featured && isNew && <span className="vehicle-home-new">E re</span>}
        </div>
      </div>

      <div className="vehicle-home-body">
        <h3>{post?.title || "Automjet"}</h3>

        <p>{post?.city || post?.location || "Lokacion i panjohur"}</p>

        <div className="vehicle-home-bottom">
          <strong>{formatPrice(post?.price)}</strong>
          <span>Shiko →</span>
        </div>
      </div>
    </Link>
  );
}