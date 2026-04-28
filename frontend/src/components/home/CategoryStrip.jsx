import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { label: "Automjete", to: "/kategori/automjete" },
  { label: "Patundshmëri", to: "/kategori/patundshmeri" },
  { label: "Konkurse Pune", to: "/kategori/konkurse-pune" },
  { label: "Lajme", to: "/kategori/lajme" }
];

export default function CategoryStrip() {
  return (
    <section className="category-strip">
      {categories.map((item) => (
        <Link key={item.to} to={item.to} className="category-strip-card">
          {item.label}
        </Link>
      ))}
    </section>
  );
}