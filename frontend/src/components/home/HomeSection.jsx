import React from "react";
import { Link } from "react-router-dom";

import CategoryPosts from "../posts/CategoryPosts";
import VehicleCategoryPosts from "../posts/VehicleCategoryPosts";
import RealEstateCategoryPosts from "../posts/RealEstateCategoryPosts";
import JobCategoryPosts from "../posts/JobCategoryPosts";

export default function HomeSection({ title, category, subtitle }) {
  const normalizedCategory = String(category || "").toLowerCase();

  const renderPosts = () => {
    if (normalizedCategory === "automjete") {
      return (
        <VehicleCategoryPosts
          title=""
          category="automjete"
          variant="home"
          initialLimit={8}
          showMoreStep={8}
        />
      );
    }

    if (
      normalizedCategory === "patundshmeri" ||
      normalizedCategory === "patundshmëri"
    ) {
      return (
        <RealEstateCategoryPosts
          title=""
          category="patundshmeri"
          variant="home"
          initialLimit={8}
          showMoreStep={8}
        />
      );
    }

    if (
      normalizedCategory === "konkurse-pune" ||
      normalizedCategory === "konkurse pune"
    ) {
      return (
        <JobCategoryPosts
          title=""
          category="konkurse-pune"
          variant="home"
          initialLimit={8}
          showMoreStep={8}
        />
      );
    }

    return (
      <CategoryPosts
        title=""
        category={category}
        variant="home"
        initialLimit={8}
        showMoreStep={8}
      />
    );
  };

  return (
    <section className="home-section">
      <div className="home-section-head">
        <div>
          <div className="section-eyebrow">Publikime</div>
          <h2 className="home-section-title">{title}</h2>
          <p className="home-section-subtitle">{subtitle}</p>
        </div>

        <Link to={`/kategori/${category}`} className="home-section-link">
          Shiko më shumë
        </Link>
      </div>

      <div className="home-section-card">{renderPosts()}</div>
    </section>
  );
}