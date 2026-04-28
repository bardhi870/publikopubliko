import React, { useEffect, useMemo, useState } from "react";
import { getPostsByCategory } from "../../api/postApi";
import JobPostCard from "./JobPostCard";
import {
  CITY_OPTIONS,
  EXPERIENCE_OPTIONS,
  INITIAL_VISIBLE_JOBS,
  JOB_CATEGORY_OPTIONS,
  LANGUAGE_OPTIONS,
  LOAD_MORE_STEP,
  WORK_HOURS_OPTIONS
} from "../../constants/postFilterOptions";

const normalize = (value) => String(value || "").trim().toLowerCase();

const normalizeCategorySlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

const isPostFeatured = (post) =>
  post?.featured === true ||
  post?.featured === "true" ||
  post?.featured === 1 ||
  post?.featured === "1";

const softCard = {
  background: "rgba(255,255,255,0.96)",
  border: "1px solid rgba(203,213,225,0.75)",
  boxShadow: "0 14px 34px rgba(15,23,42,0.055)"
};

const fieldLabelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "600",
  color: "#64748b",
  marginBottom: "7px"
};

const inputStyle = {
  width: "100%",
  height: "44px",
  padding: "0 12px",
  borderRadius: "14px",
  border: "1px solid #dbe3ee",
  outline: "none",
  fontSize: "14px",
  background: "#fff",
  boxSizing: "border-box",
  color: "#0f172a",
  fontWeight: "500"
};

const clearBtnStyle = {
  height: "40px",
  padding: "0 15px",
  borderRadius: "999px",
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  fontWeight: "600",
  cursor: "pointer"
};

const loadMoreBtnStyle = {
  padding: "14px 24px",
  borderRadius: "999px",
  border: "1px solid #0f172a",
  background: "#0f172a",
  color: "#fff",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "15px",
  boxShadow: "0 14px 30px rgba(15,23,42,0.16)"
};

export default function JobCategoryPosts({ title, category, variant }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [jobSearch, setJobSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedJobCategory, setSelectedJobCategory] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedWorkHours, setSelectedWorkHours] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [visibleJobs, setVisibleJobs] = useState(INITIAL_VISIBLE_JOBS);

  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const isMobile = screenWidth <= 640;
  const isTablet = screenWidth > 640 && screenWidth <= 1024;
  const isHomeVariant = variant === "home";

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchPosts = async () => {
      try {
        setLoading(true);

        const formattedCategory = normalizeCategorySlug(category);
        const data = await getPostsByCategory(formattedCategory);

        if (!ignore) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Gabim gjatë marrjes së postimeve:", error);
        if (!ignore) setPosts([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, [category]);

  const filterGridColumns =
    screenWidth >= 1500
      ? "repeat(6, minmax(0, 1fr))"
      : screenWidth >= 1150
      ? "repeat(3, minmax(0, 1fr))"
      : screenWidth >= 700
      ? "repeat(2, minmax(0, 1fr))"
      : "1fr";

  const cardGridColumns =
    screenWidth >= 1800
      ? "repeat(5, minmax(0, 1fr))"
      : screenWidth >= 1420
      ? "repeat(4, minmax(0, 1fr))"
      : screenWidth >= 1060
      ? "repeat(3, minmax(0, 1fr))"
      : screenWidth >= 340
      ? "repeat(2, minmax(0, 1fr))"
      : "1fr";

  const filteredPosts = useMemo(() => {
    return [...posts]
      .filter((post) => {
        if (isHomeVariant) return true;

        const query = normalize(jobSearch);
        const titleText = normalize(post.title);
        const descText = normalize(post.description);

        const postCity = normalize(
          post.job_location || post.city || post.location || post.job_city
        );

        const postCategory = normalize(
          post.job_category || post.category_name || post.industry || post.sector
        );

        const postExperience = normalize(
          post.experience || post.job_experience || post.experience_level
        );

        const postWorkHours = normalize(
          post.work_hours || post.job_type || post.employment_type
        );

        const postLanguages = normalize(
          Array.isArray(post.languages)
            ? post.languages.join(", ")
            : post.languages || post.language
        );

        return (
          (!query || titleText.includes(query) || descText.includes(query)) &&
          (!selectedCity || postCity.includes(normalize(selectedCity))) &&
          (!selectedJobCategory ||
            postCategory.includes(normalize(selectedJobCategory))) &&
          (!selectedExperience ||
            postExperience.includes(normalize(selectedExperience))) &&
          (!selectedWorkHours ||
            postWorkHours.includes(normalize(selectedWorkHours))) &&
          (!selectedLanguage ||
            postLanguages.includes(normalize(selectedLanguage)))
        );
      })
      .sort((a, b) => {
        const aFeatured = isPostFeatured(a);
        const bFeatured = isPostFeatured(b);

        if (aFeatured && !bFeatured) return -1;
        if (!aFeatured && bFeatured) return 1;

        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      });
  }, [
    posts,
    jobSearch,
    selectedCity,
    selectedJobCategory,
    selectedExperience,
    selectedWorkHours,
    selectedLanguage,
    isHomeVariant
  ]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleJobs),
    [filteredPosts, visibleJobs]
  );

  const hasMoreJobs = visibleJobs < filteredPosts.length;

  const clearAllFilters = () => {
    setJobSearch("");
    setSelectedCity("");
    setSelectedJobCategory("");
    setSelectedExperience("");
    setSelectedWorkHours("");
    setSelectedLanguage("");
    setVisibleJobs(INITIAL_VISIBLE_JOBS);
    setShowMobileFilters(false);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setVisibleJobs(INITIAL_VISIBLE_JOBS);
  };

  const FilterBlock = ({ label, children }) => (
    <div>
      <label style={fieldLabelStyle}>{label}</label>
      {children}
    </div>
  );

  if (loading) {
    return (
      <section
        style={{
          width: "100%",
          maxWidth: "2000px",
          margin: "0 auto 42px",
          padding: isMobile ? "0 2px" : "0"
        }}
      >
        <div
          style={{
            ...softCard,
            borderRadius: "22px",
            padding: "24px",
            color: "#64748b",
            fontWeight: "600"
          }}
        >
          Duke u ngarkuar...
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        width: "100%",
        maxWidth: "2000px",
        margin: "0 auto 46px",
        padding: isMobile ? "0 0" : isTablet ? "0 2px" : "0"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "column" : "row",
          marginBottom: "16px"
        }}
      >
        {title ? (
          <div>
            <div
              style={{
                display: "inline-flex",
                padding: "7px 12px",
                borderRadius: "999px",
                background: "#eff6ff",
                color: "#1d4ed8",
                fontSize: "12px",
                fontWeight: "700",
                marginBottom: "9px"
              }}
            >
              KONKURSE PUNE
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? "23px" : "32px",
                lineHeight: "1.08",
                fontWeight: "850",
                color: "#07132b",
                letterSpacing: "-0.035em"
              }}
            >
              {title}
            </h2>
          </div>
        ) : (
          <div />
        )}

        {!isHomeVariant && (
          <div
            style={{
              ...softCard,
              borderRadius: "999px",
              padding: "8px 13px",
              color: "#64748b",
              fontSize: "14px",
              fontWeight: "600",
              whiteSpace: "nowrap"
            }}
          >
            Rezultate:{" "}
            <span style={{ color: "#0f172a", fontWeight: "750" }}>
              {filteredPosts.length}
            </span>
          </div>
        )}
      </div>

      {!isHomeVariant && isMobile && (
        <button
          type="button"
          onClick={() => setShowMobileFilters((prev) => !prev)}
          style={{
            width: "100%",
            height: "48px",
            marginBottom: "12px",
            borderRadius: "16px",
            border: "1px solid #bfdbfe",
            background: showMobileFilters
              ? "linear-gradient(135deg,#0f172a,#2563eb)"
              : "#fff",
            color: showMobileFilters ? "#fff" : "#0f172a",
            cursor: "pointer",
            fontWeight: "750",
            fontSize: "15px",
            boxShadow: "0 10px 24px rgba(15,23,42,0.06)"
          }}
        >
          {showMobileFilters ? "Mbyll filtrat" : "Hap filtrat"}
        </button>
      )}

      {!isHomeVariant && (!isMobile || showMobileFilters) && (
        <div
          style={{
            ...softCard,
            borderRadius: isMobile ? "18px" : "24px",
            padding: isMobile ? "13px" : "18px",
            marginBottom: "18px"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: filterGridColumns,
              gap: isMobile ? "10px" : "14px",
              alignItems: "end"
            }}
          >
            <FilterBlock label="Kërko me fjalë kyçe">
              <input
                type="text"
                placeholder="Titulli ose përshkrimi..."
                value={jobSearch}
                onChange={handleFilterChange(setJobSearch)}
                style={inputStyle}
              />
            </FilterBlock>

            <FilterBlock label="Qyteti">
              <select
                value={selectedCity}
                onChange={handleFilterChange(setSelectedCity)}
                style={inputStyle}
              >
                <option value="">Të gjitha qytetet</option>
                {CITY_OPTIONS.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </FilterBlock>

            <FilterBlock label="Kategori">
              <select
                value={selectedJobCategory}
                onChange={handleFilterChange(setSelectedJobCategory)}
                style={inputStyle}
              >
                <option value="">Të gjitha kategoritë</option>
                {JOB_CATEGORY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </FilterBlock>

            <FilterBlock label="Përvoja">
              <select
                value={selectedExperience}
                onChange={handleFilterChange(setSelectedExperience)}
                style={inputStyle}
              >
                <option value="">Të gjitha përvojat</option>
                {EXPERIENCE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </FilterBlock>

            <FilterBlock label="Orët e punës">
              <select
                value={selectedWorkHours}
                onChange={handleFilterChange(setSelectedWorkHours)}
                style={inputStyle}
              >
                <option value="">Çdo orar</option>
                {WORK_HOURS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </FilterBlock>

            <FilterBlock label="Gjuhët">
              <select
                value={selectedLanguage}
                onChange={handleFilterChange(setSelectedLanguage)}
                style={inputStyle}
              >
                <option value="">Të gjitha gjuhët</option>
                {LANGUAGE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </FilterBlock>
          </div>

          <div
            style={{
              marginTop: "14px",
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center"
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "550"
              }}
            >
              Shfaqen{" "}
              <span style={{ color: "#0f172a", fontWeight: "700" }}>
                {visiblePosts.length}
              </span>{" "}
              nga{" "}
              <span style={{ color: "#0f172a", fontWeight: "700" }}>
                {filteredPosts.length}
              </span>
            </div>

            <button type="button" onClick={clearAllFilters} style={clearBtnStyle}>
              Largo filtrat
            </button>
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div
          style={{
            ...softCard,
            borderRadius: "22px",
            padding: isMobile ? "30px 18px" : "42px 24px",
            textAlign: "center",
            color: "#64748b",
            fontWeight: "600"
          }}
        >
          Nuk u gjet asnjë konkurs pune.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: cardGridColumns,
              gap: isMobile ? "10px" : "20px",
              alignItems: "stretch",
              width: "100%"
            }}
          >
            {visiblePosts.map((post, index) => (
              <JobPostCard key={post.id} post={post} index={index} />
            ))}
          </div>

          {hasMoreJobs && (
            <div
              style={{
                marginTop: "28px",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <button
                type="button"
                onClick={() => setVisibleJobs((prev) => prev + LOAD_MORE_STEP)}
                style={loadMoreBtnStyle}
              >
                Shfaq më shumë punë
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}