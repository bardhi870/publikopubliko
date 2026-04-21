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

const searchWrapStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 12px 30px rgba(15,23,42,0.04)",
  marginBottom: "20px"
};

const fieldLabelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: "800",
  color: "#475569",
  marginBottom: "8px"
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #dbe3ee",
  outline: "none",
  fontSize: "15px",
  background: "#fff",
  boxSizing: "border-box"
};

const clearBtnStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  fontWeight: "700",
  cursor: "pointer"
};

const loadMoreBtnStyle = {
  padding: "13px 22px",
  borderRadius: "999px",
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "15px"
};

const titleStyle = {
  margin: 0,
  fontSize: "28px",
  fontWeight: "800",
  color: "#0f172a"
};

const mobileFilterIconBtnStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  border: "1px solid #dbe3ee",
  background: "#fff",
  color: "#0f172a",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)"
};

const normalize = (value) => String(value || "").trim().toLowerCase();

export default function JobCategoryPosts({ title, category }) {
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

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPostsByCategory(category);
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gabim gjatë marrjes së postimeve:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  const filterGridColumns =
    screenWidth > 1280
      ? "repeat(4, minmax(0, 1fr))"
      : screenWidth > 950
      ? "repeat(3, minmax(0, 1fr))"
      : screenWidth > 640
      ? "repeat(2, minmax(0, 1fr))"
      : "1fr";

  const cardGridColumns =
    screenWidth > 1400
      ? "repeat(5, minmax(0, 1fr))"
      : screenWidth > 1120
      ? "repeat(4, minmax(0, 1fr))"
      : screenWidth > 820
      ? "repeat(3, minmax(0, 1fr))"
      : "repeat(2, minmax(0, 1fr))";

  const filteredPosts = useMemo(() => {
    return [...posts]
      .filter((post) => {
        const query = normalize(jobSearch);
        const titleText = normalize(post.title);
        const descText = normalize(post.description);

        const postCity = normalize(post.city || post.location || post.job_city);
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
          (!selectedJobCategory || postCategory.includes(normalize(selectedJobCategory))) &&
          (!selectedExperience || postExperience.includes(normalize(selectedExperience))) &&
          (!selectedWorkHours || postWorkHours.includes(normalize(selectedWorkHours))) &&
          (!selectedLanguage || postLanguages.includes(normalize(selectedLanguage)))
        );
      })
      .sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
  }, [
    posts,
    jobSearch,
    selectedCity,
    selectedJobCategory,
    selectedExperience,
    selectedWorkHours,
    selectedLanguage
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

  if (loading) {
    return <p style={{ marginTop: "14px", color: "#475569" }}>Duke u ngarkuar...</p>;
  }

  return (
    <section style={{ marginBottom: "40px" }}>
      {title ? <h2 style={{ ...titleStyle, fontSize: isMobile ? "22px" : "28px", marginBottom: "18px" }}>{title}</h2> : null}

      {isMobile && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            style={mobileFilterIconBtnStyle}
          >
            Filtrat
          </button>
        </div>
      )}

      {(!isMobile || showMobileFilters) && (
        <div style={{ ...searchWrapStyle, padding: isMobile ? "14px" : "18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: filterGridColumns, gap: isMobile ? "12px" : "16px" }}>
            <div>
              <label style={fieldLabelStyle}>Kërko me fjalë kyçe</label>
              <input
                type="text"
                placeholder="Kërko sipas titullit ose përshkrimit..."
                value={jobSearch}
                onChange={(e) => {
                  setJobSearch(e.target.value);
                  setVisibleJobs(INITIAL_VISIBLE_JOBS);
                }}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={fieldLabelStyle}>Qyteti</label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setVisibleJobs(INITIAL_VISIBLE_JOBS);
                }}
                style={inputStyle}
              >
                <option value="">Qytetet</option>
                {CITY_OPTIONS.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={fieldLabelStyle}>Kategori</label>
              <select
                value={selectedJobCategory}
                onChange={(e) => {
                  setSelectedJobCategory(e.target.value);
                  setVisibleJobs(INITIAL_VISIBLE_JOBS);
                }}
                style={inputStyle}
              >
                <option value="">Kategoritë</option>
                {JOB_CATEGORY_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={fieldLabelStyle}>Përvojat</label>
              <select
                value={selectedExperience}
                onChange={(e) => {
                  setSelectedExperience(e.target.value);
                  setVisibleJobs(INITIAL_VISIBLE_JOBS);
                }}
                style={inputStyle}
              >
                <option value="">Përvojat</option>
                {EXPERIENCE_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={fieldLabelStyle}>Orët e punës</label>
              <select
                value={selectedWorkHours}
                onChange={(e) => {
                  setSelectedWorkHours(e.target.value);
                  setVisibleJobs(INITIAL_VISIBLE_JOBS);
                }}
                style={inputStyle}
              >
                <option value="">Orët e punës</option>
                {WORK_HOURS_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={fieldLabelStyle}>Gjuhët</label>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setVisibleJobs(INITIAL_VISIBLE_JOBS);
                }}
                style={inputStyle}
              >
                <option value="">Gjuhët</option>
                {LANGUAGE_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
              Gjithsej rezultate: <span style={{ color: "#0f172a", fontWeight: "800" }}>{filteredPosts.length}</span>
            </div>

            <button type="button" onClick={clearAllFilters} style={clearBtnStyle}>
              Largo filtrat
            </button>
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "32px 20px", textAlign: "center", color: "#64748b" }}>
          Nuk u gjet asnjë konkurs pune.
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: cardGridColumns, gap: isMobile ? "14px" : "22px", alignItems: "start", width: "100%" }}>
            {visiblePosts.map((post, index) => (
              <JobPostCard key={post.id} post={post} index={index} />
            ))}
          </div>

          {hasMoreJobs && (
            <div style={{ marginTop: "26px", display: "flex", justifyContent: "center" }}>
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