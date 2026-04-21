import React from "react";

import JobCategoryPosts from "./JobCategoryPosts";
import RealEstateCategoryPosts from "./RealEstateCategoryPosts";
import VehicleCategoryPosts from "./VehicleCategoryPosts";

export default function CategoryPosts(props) {
  const { category } = props;

  if (category === "konkurse-pune") {
    return <JobCategoryPosts {...props} />;
  }

  if (category === "patundshmeri") {
    return <RealEstateCategoryPosts {...props} />;
  }

  if (category === "automjete") {
    return <VehicleCategoryPosts {...props} />;
  }

  return null;
}