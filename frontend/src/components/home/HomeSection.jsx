import React from "react";
import { Link } from "react-router-dom";

import VehicleCategoryPosts from "../posts/VehicleCategoryPosts";
import RealEstateCategoryPosts from "../posts/RealEstateCategoryPosts";
import JobCategoryPosts from "../posts/JobCategoryPosts";

const META = {
  patundshmeri: {
    eyebrow: "Prona",
    badge: "Premium listings",
    letter: "P",
    link: "/kategori/patundshmeri",
    className: "realestate"
  },
  automjete: {
    eyebrow: "Auto",
    badge: "Të reja",
    letter: "A",
    link: "/kategori/automjete",
    className: "vehicles"
  },
  "konkurse-pune": {
    eyebrow: "Karrierë",
    badge: "Pozita aktive",
    letter: "K",
    link: "/kategori/konkurse-pune",
    className: "jobs"
  }
};

export default function HomeSection({ title, category, subtitle }) {
  const normalizedCategory = String(category || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const meta = META[normalizedCategory] || {
    eyebrow: "Publikime",
    badge: "Të fundit",
    letter: "P",
    link: `/kategori/${normalizedCategory}`,
    className: "default"
  };

  const renderPosts = () => {
    if (normalizedCategory === "automjete") {
      return (
        <VehicleCategoryPosts
          title=""
          category="automjete"
          variant="home"
          initialLimit={6}
          showMoreStep={6}
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
          initialLimit={6}
          showMoreStep={6}
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
          initialLimit={6}
          showMoreStep={6}
        />
      );
    }

    return null;
  };

  return (
    <section className={`home-section home-section-${meta.className}`}>
      <div className="home-section-head">
        <div className="home-section-heading">
          <div className="section-eyebrow">
            <span className="home-section-logo">{meta.letter}</span>
            <span>{meta.eyebrow}</span>
            <b>{meta.badge}</b>
          </div>

          <h2 className="home-section-title">{title}</h2>

          {subtitle && <p className="home-section-subtitle">{subtitle}</p>}
        </div>

        <Link to={meta.link} className="home-section-link">
          Shiko më shumë
          <span>→</span>
        </Link>
      </div>

      <div className="home-section-card">{renderPosts()}</div>
    </section>
  );
}