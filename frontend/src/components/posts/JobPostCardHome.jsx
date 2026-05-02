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

export default function JobPostCardHome({ post }) {
  const featured = isFeatured(post);
  const isNew = isNewPost(post?.created_at);

  return (
    <Link to={`/konkurse-pune/${post?.id}`} className="job-home-card">
      <div className="job-home-body">
        <div className="job-home-badges">
          {featured && <span className="job-home-premium">Premium</span>}
          {!featured && isNew && <span className="job-home-new">E re</span>}
        </div>

        <h3>{post?.title || "Konkurs Pune"}</h3>

        <p>{post?.company_name || "Kompani"}</p>

        <span className="job-home-city">
          {post?.job_location || post?.city || post?.location || "Lokacion"}
        </span>
      </div>
    </Link>
  );
}