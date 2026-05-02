import React, { useEffect, useMemo, useState } from "react";
import { getPostsByCategory } from "../../api/postApi";
import JobPostCard from "./JobPostCard";
import JobPostCardHome from "./JobPostCardHome";
import {
  INITIAL_VISIBLE_JOBS,
  LOAD_MORE_STEP
} from "../../constants/postFilterOptions";

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ");

const normalizeCategorySlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

const stripHtml = (html = "") =>
  String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isPostFeatured = (post) =>
  post?.featured === true ||
  post?.featured === "true" ||
  post?.featured === 1 ||
  post?.featured === "1" ||
  post?.is_featured === true ||
  post?.is_featured === "true" ||
  post?.is_featured === 1 ||
  post?.is_featured === "1";

const isPostNew = (createdAt) => {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() <= 3 * 24 * 60 * 60 * 1000;
};

const softIncludes = (postValue, selectedValue) => {
  const postClean = normalize(postValue);
  const selectedClean = normalize(selectedValue);

  if (!selectedClean) return true;
  if (!postClean) return false;

  return postClean.includes(selectedClean) || selectedClean.includes(postClean);
};

const shuffle = (items) => [...items].sort(() => 0.5 - Math.random());

function FilterBlock({ label, children }) {
  return (
    <div className="jobs-filter-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export default function JobCategoryPosts({
  title,
  category,
  variant,
  initialLimit = 4
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [jobSearch, setJobSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedJobCategory, setSelectedJobCategory] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedWorkHours, setSelectedWorkHours] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [visibleJobs, setVisibleJobs] = useState(INITIAL_VISIBLE_JOBS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const isHomeVariant = variant === "home";

  useEffect(() => {
    let ignore = false;

    async function fetchPosts() {
      try {
        setLoading(true);
        const formattedCategory = normalizeCategorySlug(category);
        const data = await getPostsByCategory(formattedCategory);

        if (!ignore) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Gabim gjatë marrjes së postimeve:", error);

        if (!ignore) {
          setPosts([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, [category]);

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      if (isHomeVariant) return true;

      const query = normalize(jobSearch);
      const titleText = normalize(post.title);
      const descText = normalize(stripHtml(post.description));

      const postCity = normalize(
        post.job_location || post.city || post.location || post.job_city || ""
      );

      const postCategory = normalize(
        post.job_category ||
          post.category_name ||
          post.industry ||
          post.sector ||
          post.department ||
          ""
      );

      const postExperience = normalize(
        post.experience ||
          post.job_experience ||
          post.experience_level ||
          post.seniority ||
          ""
      );

      const postWorkHours = normalize(
        post.work_hours ||
          post.job_type ||
          post.employment_type ||
          post.schedule ||
          ""
      );

      const postLanguages = normalize(
        Array.isArray(post.languages)
          ? post.languages.join(" ")
          : post.languages || post.language || post.required_languages || ""
      );

      const matchesSearch =
        !query ||
        titleText.includes(query) ||
        descText.includes(query) ||
        postCity.includes(query) ||
        postCategory.includes(query) ||
        postExperience.includes(query) ||
        postWorkHours.includes(query) ||
        postLanguages.includes(query);

      return (
        matchesSearch &&
        softIncludes(postCity, selectedCity) &&
        softIncludes(postCategory, selectedJobCategory) &&
        softIncludes(postExperience, selectedExperience) &&
        softIncludes(postWorkHours, selectedWorkHours) &&
        softIncludes(postLanguages, selectedLanguage)
      );
    });

    const sortNewest = (items) =>
      [...items].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );

    const featured = sortNewest(filtered.filter(isPostFeatured));
    const fresh = sortNewest(
      filtered.filter((post) => !isPostFeatured(post) && isPostNew(post.created_at))
    );
    const normal = sortNewest(
      filtered.filter((post) => !isPostFeatured(post) && !isPostNew(post.created_at))
    );

    if (isHomeVariant) {
      const rotatedFeatured = shuffle(featured);
      const rotatedNormal = shuffle(normal);
      const finalPosts = [...rotatedFeatured, ...rotatedNormal, ...fresh];

      return finalPosts.slice(0, initialLimit);
    }

    return [...featured, ...fresh, ...normal];
  }, [
    posts,
    jobSearch,
    selectedCity,
    selectedJobCategory,
    selectedExperience,
    selectedWorkHours,
    selectedLanguage,
    isHomeVariant,
    initialLimit
  ]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleJobs),
    [filteredPosts, visibleJobs]
  );

  const hasMoreJobs = !isHomeVariant && visibleJobs < filteredPosts.length;

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

  if (loading) {
    return <div className="jobs-loading">Duke u ngarkuar...</div>;
  }

  if (isHomeVariant) {
    return (
      <div className="home-clean-grid">
        {filteredPosts.map((post, index) => (
          <JobPostCardHome key={post.id || index} post={post} index={index} />
        ))}
      </div>
    );
  }

  return (
    <section className="jobs-section">
      <style>{categoryCss}</style>

      <div className="jobs-section-head">
        {title ? (
          <div>
            <div className="jobs-eyebrow">KONKURSE PUNE</div>
            <h2 className="jobs-title">{title}</h2>
          </div>
        ) : (
          <div />
        )}

        <div className="jobs-count-pill">
          <span>{filteredPosts.length}</span>
          konkurse
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowMobileFilters((prev) => !prev)}
        className={`jobs-mobile-filter-btn ${showMobileFilters ? "active" : ""}`}
      >
        {showMobileFilters ? (
          <>
            <span>×</span> Mbyll
          </>
        ) : (
          <>
            <svg className="jobs-filter-icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M7 12h10M10 17h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Filtrat
          </>
        )}
      </button>

      <div className={`jobs-filters-card ${showMobileFilters ? "open" : ""}`}>
        <div className="jobs-filter-top">
          <div>
            <div className="jobs-filter-pill">Kërkim i avancuar</div>
            <h3 className="jobs-filter-title">Filtro konkurset</h3>
          </div>

          <div className="jobs-mobile-count-box">
            <strong>{filteredPosts.length}</strong>
            <span>konkurse</span>
          </div>
        </div>

        <div className="jobs-filters-grid">
          <FilterBlock label="Kërko konkurs">
            <div className="jobs-search-wrap">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Titulli, përshkrimi, kategoria..."
                value={jobSearch}
                onChange={handleFilterChange(setJobSearch)}
              />
            </div>
          </FilterBlock>

          <FilterBlock label="Qyteti">
            <input
              type="text"
              placeholder="Shkruaj qytetin..."
              value={selectedCity}
              onChange={handleFilterChange(setSelectedCity)}
            />
          </FilterBlock>

          <FilterBlock label="Kategori">
            <input
              type="text"
              placeholder="P.sh. IT, shitje, mjekësi..."
              value={selectedJobCategory}
              onChange={handleFilterChange(setSelectedJobCategory)}
            />
          </FilterBlock>

          <FilterBlock label="Përvoja">
            <input
              type="text"
              placeholder="P.sh. junior, senior, 1 vit..."
              value={selectedExperience}
              onChange={handleFilterChange(setSelectedExperience)}
            />
          </FilterBlock>

          <FilterBlock label="Orari">
            <input
              type="text"
              placeholder="P.sh. full time, part time..."
              value={selectedWorkHours}
              onChange={handleFilterChange(setSelectedWorkHours)}
            />
          </FilterBlock>

          <FilterBlock label="Gjuhët">
            <input
              type="text"
              placeholder="P.sh. anglisht, gjermanisht..."
              value={selectedLanguage}
              onChange={handleFilterChange(setSelectedLanguage)}
            />
          </FilterBlock>
        </div>

        <div className="jobs-filter-bottom">
          <div className="jobs-visible-count">
            Rezultate: <span>{filteredPosts.length}</span>
          </div>

          <button type="button" onClick={clearAllFilters} className="jobs-clear-btn">
            Largo filtrat
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="jobs-empty">Nuk u gjet asnjë konkurs pune.</div>
      ) : (
        <>
          <div className="jobs-grid">
            {visiblePosts.map((post, index) => (
              <JobPostCard key={post.id || index} post={post} index={index} />
            ))}
          </div>

          {hasMoreJobs && (
            <div className="jobs-load-more-wrap">
              <button
                type="button"
                onClick={() => setVisibleJobs((prev) => prev + LOAD_MORE_STEP)}
                className="jobs-load-more-btn"
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

const categoryCss = `
  .jobs-section {
    width: 100%;
    max-width: 1640px;
    margin: 0 auto 54px;
    position: relative;
    padding: 0 4px;
  }

  .jobs-section-head {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 16px;
    padding: 22px 24px;
    border-radius: 26px;
    background:
      radial-gradient(circle at 8% 0%, rgba(37,99,235,.16), transparent 32%),
      radial-gradient(circle at 92% 18%, rgba(14,165,233,.12), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,.99), rgba(248,251,255,.94));
    border: 1px solid rgba(191,219,254,.92);
    box-shadow:
      0 18px 44px rgba(15,23,42,.065),
      inset 0 1px 0 rgba(255,255,255,.9);
  }

  .jobs-section-head::after{
    content:"";
    position:absolute;
    inset:auto 18px 0 18px;
    height:1px;
    background:linear-gradient(90deg, transparent, rgba(37,99,235,.42), transparent);
  }

  .jobs-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 12px;
    border-radius: 999px;
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    color: #1d4ed8;
    font-size: 10px;
    font-weight: 950;
    margin-bottom: 9px;
    letter-spacing: .08em;
    border: 1px solid rgba(191,219,254,.9);
    text-transform: uppercase;
    box-shadow: 0 10px 22px rgba(37,99,235,.10);
  }

  .jobs-eyebrow::before{
    content:"";
    width:7px;
    height:7px;
    border-radius:999px;
    background:#2563eb;
    box-shadow:0 0 0 4px rgba(37,99,235,.12);
  }

  .jobs-title {
    margin: 0;
    font-size: clamp(30px, 3.4vw, 48px);
    line-height: .96;
    font-weight: 950;
    color: #07132b;
    letter-spacing: -.06em;
  }

  .jobs-count-pill {
    min-width: 112px;
    background: rgba(255,255,255,.90);
    border: 1px solid rgba(191,219,254,.92);
    box-shadow:
      0 14px 30px rgba(15,23,42,.06),
      inset 0 1px 0 rgba(255,255,255,.9);
    border-radius: 21px;
    padding: 12px 15px;
    color: #64748b;
    font-size: 12px;
    font-weight: 900;
    white-space: nowrap;
    text-align: center;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .jobs-count-pill span {
    color: #1d4ed8;
    font-size: 27px;
    font-weight: 950;
    display: block;
    line-height: .95;
    letter-spacing: -.04em;
  }

  .jobs-loading,
  .jobs-empty {
    background: rgba(255,255,255,.98);
    border: 1px solid rgba(191,219,254,.88);
    box-shadow: 0 18px 44px rgba(15,23,42,.06);
    border-radius: 24px;
    padding: 28px 18px;
    color: #64748b;
    font-weight: 850;
    text-align: center;
  }

  .jobs-mobile-filter-btn {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 9px;
    width: fit-content;
    height: 44px;
    margin: 0 0 12px auto;
    padding: 0 18px;
    border-radius: 999px;
    border: 1px solid rgba(191,219,254,.95);
    background: linear-gradient(135deg,#ffffff,#eff6ff);
    color: #1d4ed8;
    cursor: pointer;
    font-weight: 950;
    font-size: 13px;
    box-shadow: 0 12px 26px rgba(37,99,235,.10);
  }

  .jobs-mobile-filter-btn.active {
    background: linear-gradient(135deg,#1d4ed8,#0284c7);
    color: #fff;
    border-color: rgba(125,211,252,.75);
  }

  .jobs-filter-icon {
    width: 17px;
    height: 17px;
    display: block;
  }

  .jobs-filters-card {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(circle at 7% 0%, rgba(37,99,235,.10), transparent 30%),
      radial-gradient(circle at 96% 8%, rgba(14,165,233,.10), transparent 28%),
      linear-gradient(180deg, rgba(255,255,255,.99), rgba(248,251,255,.95));
    border: 1px solid rgba(191,219,254,.88);
    box-shadow:
      0 18px 44px rgba(15,23,42,.06),
      inset 0 1px 0 rgba(255,255,255,.85);
    border-radius: 26px;
    padding: 18px;
    margin-bottom: 18px;
  }

  .jobs-filters-card::before{
    content:"";
    position:absolute;
    left:18px;
    right:18px;
    top:0;
    height:1px;
    background:linear-gradient(90deg, transparent, rgba(37,99,235,.35), transparent);
  }

  .jobs-filter-top {
    display: none;
  }

  .jobs-filters-grid {
    display: grid;
    grid-template-columns: 1.45fr repeat(5, minmax(0, 1fr));
    gap: 12px;
    align-items: end;
  }

  .jobs-filter-field label {
    display: block;
    font-size: 10.5px;
    font-weight: 950;
    color: #334155;
    margin-bottom: 7px;
    letter-spacing: .02em;
  }

  .jobs-search-wrap {
    position: relative;
  }

  .jobs-search-wrap svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 17px;
    height: 17px;
    color: #64748b;
    pointer-events: none;
  }

  .jobs-filter-field input {
    width: 100%;
    height: 44px;
    padding: 0 13px;
    border-radius: 15px;
    border: 1px solid #dbeafe;
    outline: none;
    font-size: 13px;
    background: rgba(255,255,255,.96);
    box-sizing: border-box;
    color: #0f172a;
    font-weight: 750;
    box-shadow: 0 8px 18px rgba(15,23,42,.035);
    transition:border-color .18s ease, box-shadow .18s ease, background .18s ease;
  }

  .jobs-search-wrap input {
    padding-left: 42px;
  }

  .jobs-filter-field input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 4px rgba(37,99,235,.10);
    background:#fff;
  }

  .jobs-filter-field input::placeholder{
    color:#94a3b8;
    font-weight:750;
  }

  .jobs-filter-bottom {
    margin-top: 13px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .jobs-visible-count {
    color: #64748b;
    font-size: 13px;
    font-weight: 850;
  }

  .jobs-visible-count span {
    color: #0f172a;
    font-weight: 950;
  }

  .jobs-clear-btn {
    height: 38px;
    padding: 0 15px;
    border-radius: 999px;
    border: 1px solid #bfdbfe;
    background: #fff;
    color: #1d4ed8;
    font-weight: 950;
    cursor: pointer;
    font-size: 12.5px;
    box-shadow: 0 10px 22px rgba(37,99,235,.08);
  }

  .jobs-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 15px;
    align-items: stretch;
    width: 100%;
  }

  .jobs-load-more-wrap {
    margin-top: 26px;
    display: flex;
    justify-content: center;
  }

  .jobs-load-more-btn {
    padding: 13px 22px;
    border-radius: 999px;
    border: 1px solid rgba(37,99,235,.75);
    background: linear-gradient(135deg,#2563eb,#0284c7);
    color: #fff;
    font-weight: 950;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 16px 34px rgba(37,99,235,.22);
  }

  @media (max-width: 1800px) {
    .jobs-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (max-width: 1420px) {
    .jobs-filters-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .jobs-filter-field:first-child {
      grid-column: 1 / -1;
    }

    .jobs-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 1060px) {
    .jobs-filters-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .jobs-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
  }

  @media (max-width: 640px) {
    .jobs-section {
      margin-bottom: 34px;
      padding: 0;
    }

    .jobs-section-head {
      display: block;
      padding: 18px 16px;
      border-radius: 22px;
      margin-bottom: 12px;
    }

    .jobs-eyebrow {
      font-size: 9px;
      padding: 6px 10px;
      margin-bottom: 8px;
    }

    .jobs-title {
      font-size: 32px;
      line-height: .95;
    }

    .jobs-count-pill {
      display: none;
    }

    .jobs-mobile-filter-btn {
      display: inline-flex;
    }

    .jobs-filters-card {
      display: none;
      border-radius: 22px;
      padding: 14px;
      margin-bottom: 14px;
    }

    .jobs-filters-card.open {
      display: block;
    }

    .jobs-filter-top {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: start;
      margin-bottom: 14px;
    }

    .jobs-filter-pill {
      display: inline-flex;
      width: fit-content;
      padding: 6px 10px;
      border-radius: 999px;
      background: #dbeafe;
      color: #1d4ed8;
      font-size: 10px;
      font-weight: 950;
      margin-bottom: 7px;
    }

    .jobs-filter-title {
      margin: 0;
      color: #0f172a;
      font-size: 22px;
      line-height: 1.05;
      font-weight: 950;
      letter-spacing: -.05em;
    }

    .jobs-mobile-count-box {
      min-width: 80px;
      border-radius: 16px;
      border: 1px solid #dbeafe;
      background: #fff;
      padding: 10px 9px;
      text-align: center;
    }

    .jobs-mobile-count-box strong {
      display: block;
      color: #1d4ed8;
      font-size: 25px;
      line-height: .95;
      font-weight: 950;
    }

    .jobs-mobile-count-box span {
      color: #64748b;
      font-size: 11px;
      font-weight: 900;
    }

    .jobs-filters-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .jobs-filter-field:first-child {
      grid-column: 1 / -1;
    }

    .jobs-filter-field label {
      font-size: 10.5px;
      margin-bottom: 6px;
    }

    .jobs-filter-field input {
      height: 46px;
      border-radius: 14px;
      font-size: 13px;
      padding: 0 12px;
    }

    .jobs-search-wrap input {
      padding-left: 42px;
    }

    .jobs-filter-bottom {
      margin-top: 12px;
    }

    .jobs-visible-count {
      font-size: 12px;
    }

    .jobs-clear-btn {
      height: 42px;
      font-size: 12px;
      padding: 0 15px;
    }

    .jobs-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .jobs-load-more-wrap {
      margin-top: 20px;
    }

    .jobs-load-more-btn {
      width: 100%;
      padding: 12px 16px;
      font-size: 13px;
    }

    .jobs-loading,
    .jobs-empty {
      border-radius: 17px;
      padding: 24px 14px;
      font-size: 13px;
    }
  }

  @media (max-width: 360px) {
    .jobs-filters-grid {
      gap: 9px;
    }

    .jobs-filter-field input {
      height: 42px;
      font-size: 12.5px;
    }

    .jobs-title {
      font-size: 29px;
    }

    .jobs-filter-title {
      font-size: 20px;
    }

    .jobs-mobile-count-box {
      min-width: 74px;
    }
  }

  @media (max-width: 330px) {
    .jobs-grid {
      grid-template-columns: 1fr;
    }
  }
`;
