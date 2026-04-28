import React from "react";

import JobCategoryPosts from "./JobCategoryPosts";
import RealEstateCategoryPosts from "./RealEstateCategoryPosts";
import VehicleCategoryPosts from "./VehicleCategoryPosts";

export default function CategoryPosts(props) {
  const { category } = props;

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
      return <RealEstateCategoryPosts {...sharedProps} />;

    case "automjete":
      return <VehicleCategoryPosts {...sharedProps} />;

    case "lajme":
      return (
        <div style={{ padding: 18, color: "#64748b", fontWeight: 800 }}>
          Lajmet do t’i lidhim në hapin tjetër.
        </div>
      );

    default:
      return null;
  }
}