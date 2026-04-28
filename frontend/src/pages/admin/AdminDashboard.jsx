import React from "react";

import useAdminPosts from "../../hooks/useAdminPosts";
import AdminStats from "../../components/admin/AdminStats";
import AdminPostForm from "../../components/admin/AdminPostForm";
import AdminPostsList from "../../components/admin/AdminPostsList";
import AdminTopNav from "../../components/admin/AdminTopNav";

import {
  CATEGORY_LABELS,
  CATEGORY_OPTIONS
} from "../../constants/postCategories";

export default function AdminDashboard() {
  const {
    posts,
    editingId,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    formData,
    filteredPosts,
    selectedCategoryCount,
    postsByCategory,

    isRealEstate,
    isOffer,
    showPriceField,
    showContactFields,

    selectedImages,
    selectedVideo,
    videoIsCover,

    setCoverImage,
    setVideoAsCover,

    moveSelectedImageLeft,
    moveSelectedImageRight,

    removeSelectedImage,
    removeSelectedVideo,

    handleChange,
    handleFileChange,
    handleEdit,
    handleDelete,
    handleSubmit,
    resetForm,
    toggleFeatured,

    addOfferFeature,
    removeOfferFeature,
    handleOfferFeatureChange
  } = useAdminPosts();

  const selectedClientForPost = JSON.parse(
    localStorage.getItem("selectedClientForPost") || "null"
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.heroCard}>
          <div style={styles.heroGlow} />

          <div style={styles.heroTop}>
            <div style={styles.heroLeft}>
              <div style={styles.heroBadge}>Admin Panel</div>

              <h1 style={styles.heroTitle}>Menaxhimi i portalit</h1>

              <p style={styles.heroSubtitle}>
                Shto, edito dhe menaxho lajme, patundshmëri, automjete dhe konkurse
                pune nga një dashboard i vetëm.
              </p>

              <div style={styles.heroNavWrap}>
                <AdminTopNav />
              </div>
            </div>

            <div style={styles.heroStatsWrap}>
              <div style={styles.heroStatCard}>
                <div style={styles.heroStatLabel}>Gjithsej postime</div>
                <div style={styles.heroStatValue}>{posts.length}</div>
              </div>

              <div style={styles.heroStatCard}>
                <div style={styles.heroStatLabel}>Në filtrin aktual</div>
                <div style={styles.heroStatValue}>{selectedCategoryCount}</div>
              </div>
            </div>
          </div>
        </section>

        {selectedClientForPost ? (
          <div style={styles.clientBox}>
            <div style={styles.clientTitle}>Klienti i zgjedhur për postim</div>
            <div style={styles.clientText}>
              Po krijon postim për:{" "}
              <strong>{selectedClientForPost.fullName}</strong>
              {selectedClientForPost.businessName
                ? ` • ${selectedClientForPost.businessName}`
                : ""}
              {selectedClientForPost.serviceType
                ? ` • ${selectedClientForPost.serviceType}`
                : ""}
            </div>
          </div>
        ) : null}

        <div style={styles.statsCard}>
          <AdminStats
            totalPosts={posts.length}
            selectedCategoryFilter={selectedCategoryFilter}
            selectedCategoryCount={selectedCategoryCount}
            categoryLabels={CATEGORY_LABELS}
          />
        </div>

        <section style={styles.categoryCard}>
          <div style={styles.categoryHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Kategoritë</h3>
              <p style={styles.sectionSubtitle}>
                Ndaje shpejt përmbajtjen sipas kategorisë.
              </p>
            </div>

            <div style={styles.filterCountBadge}>
              Totali në filtër: {selectedCategoryCount}
            </div>
          </div>

          <div className="admin-category-scroll" style={styles.categoryButtons}>
            <button
              type="button"
              onClick={() => setSelectedCategoryFilter("all")}
              style={
                selectedCategoryFilter === "all"
                  ? categoryActiveBtnStyle
                  : categoryBtnStyle
              }
            >
              Të gjitha ({posts.length})
            </button>

            {postsByCategory.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setSelectedCategoryFilter(item.value)}
                style={
                  selectedCategoryFilter === item.value
                    ? categoryActiveBtnStyle
                    : categoryBtnStyle
                }
              >
                {item.label} ({item.count})
              </button>
            ))}
          </div>
        </section>

        <section style={styles.formSectionCard}>
          <div style={styles.sectionTopRow}>
            <div>
              <h3 style={styles.sectionMainTitle}>
                {editingId ? "Përditëso postimin" : "Krijo postim të ri"}
              </h3>

              <p style={styles.sectionMainSubtitle}>
                Plotëso postimin me të dhënat, fotot, videon dhe renditjen e
                kopertinës në një formë të pastër dhe të organizuar.
              </p>
            </div>

            <div style={styles.sectionMiniBadge}>
              {editingId ? "Edit mode" : "New post"}
            </div>
          </div>

          <div style={styles.formInnerWrap}>
            <AdminPostForm
              editingId={editingId}
              formData={formData}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              selectedImages={selectedImages}
              selectedVideo={selectedVideo}
              videoIsCover={videoIsCover}
              setCoverImage={setCoverImage}
              setVideoAsCover={setVideoAsCover}
              moveSelectedImageLeft={moveSelectedImageLeft}
              moveSelectedImageRight={moveSelectedImageRight}
              removeSelectedImage={removeSelectedImage}
              removeSelectedVideo={removeSelectedVideo}
              handleSubmit={handleSubmit}
              resetForm={resetForm}
              categoryOptions={CATEGORY_OPTIONS}
              showPriceField={showPriceField}
              isRealEstate={isRealEstate}
              showContactFields={showContactFields}
              isOffer={isOffer}
              addOfferFeature={addOfferFeature}
              removeOfferFeature={removeOfferFeature}
              handleOfferFeatureChange={handleOfferFeatureChange}
            />
          </div>
        </section>

        <section style={styles.listSectionCard}>
          <div style={styles.sectionTopRow}>
            <div>
              <h3 style={styles.sectionMainTitle}>Lista e postimeve</h3>

              <p style={styles.sectionMainSubtitle}>
                Kartat janë më profesionale, më kompakte dhe shumë më të
                lexueshme.
              </p>
            </div>

            <div style={styles.sectionMiniBadge}>
              {filteredPosts.length} postime
            </div>
          </div>

          <AdminPostsList
  filteredPosts={filteredPosts}
  posts={posts}
  postsByCategory={postsByCategory}
  selectedCategoryFilter={selectedCategoryFilter}
  setSelectedCategoryFilter={setSelectedCategoryFilter}
  categoryLabels={CATEGORY_LABELS}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggleFeatured={toggleFeatured}
/>
        </section>

        <style>{`
          @media (max-width: 1180px) {
            .admin-category-scroll {
              flex-wrap: nowrap !important;
              overflow-x: auto !important;
              padding-bottom: 4px;
            }

            .admin-category-scroll::-webkit-scrollbar {
              height: 6px;
            }
          }

          @media (max-width: 980px) {
            .admin-dashboard-hero-top {
              grid-template-columns: 1fr !important;
            }

            .admin-dashboard-hero-stats {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              max-width: 100% !important;
            }
          }

          @media (max-width: 768px) {
            .admin-dashboard-hero-stats {
              grid-template-columns: 1fr 1fr !important;
            }
          }

          @media (max-width: 640px) {
            .admin-dashboard-hero-stats {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef4ff 45%, #f8fafc 100%)",
    padding: "8px 14px 48px"
  },

  container: {
    maxWidth: "1620px",
    margin: "0 auto"
  },

  heroCard: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0f1f4d 0%, #1d3d9f 58%, #2563eb 100%)",
    borderRadius: "30px",
    padding: "26px",
    marginBottom: "22px",
    boxShadow: "0 22px 60px rgba(37,99,235,0.22)"
  },

  heroGlow: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(circle at top right, rgba(255,255,255,0.16), transparent 24%), radial-gradient(circle at bottom left, rgba(255,255,255,0.08), transparent 20%)"
  },

  heroTop: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 0.8fr)",
    gap: "22px",
    alignItems: "start"
  },

  heroLeft: {
    minWidth: 0
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "14px"
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(32px, 4vw, 52px)",
    lineHeight: 1.02,
    fontWeight: "900",
    letterSpacing: "-0.04em"
  },

  heroSubtitle: {
    margin: "14px 0 0",
    color: "rgba(255,255,255,0.92)",
    fontSize: "15px",
    lineHeight: 1.8,
    maxWidth: "760px",
    fontWeight: "500"
  },

  heroNavWrap: {
    marginTop: "22px"
  },

  heroStatsWrap: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    alignSelf: "start"
  },

  heroStatCard: {
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "22px",
    padding: "18px 18px",
    backdropFilter: "blur(12px)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)"
  },

  heroStatLabel: {
    color: "rgba(255,255,255,0.80)",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "8px"
  },

  heroStatValue: {
    color: "#ffffff",
    fontSize: "36px",
    lineHeight: 1,
    fontWeight: "900"
  },

  clientBox: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1e3a8a",
    padding: "16px 18px",
    borderRadius: "18px",
    marginBottom: "20px",
    boxShadow: "0 10px 24px rgba(37,99,235,0.08)"
  },

  clientTitle: {
    fontWeight: "900",
    marginBottom: "6px",
    fontSize: "15px"
  },

  clientText: {
    lineHeight: 1.7,
    fontSize: "14px"
  },

  statsCard: {
    marginBottom: "20px"
  },

  categoryCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "18px 18px 18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 16px 40px rgba(15,23,42,0.05)",
    marginBottom: "20px"
  },

  categoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "14px"
  },

  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "900",
    color: "#0f172a"
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px"
  },

  filterCountBadge: {
    padding: "10px 13px",
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontWeight: "800",
    fontSize: "13px"
  },

  categoryButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  formSectionCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 18px 44px rgba(15,23,42,0.06)",
    marginBottom: "22px"
  },

  listSectionCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 18px 44px rgba(15,23,42,0.06)"
  },

  sectionTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px"
  },

  sectionMainTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: "-0.02em"
  },

  sectionMainSubtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.7,
    maxWidth: "760px"
  },

  sectionMiniBadge: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
    fontWeight: "800",
    fontSize: "13px"
  },

  formInnerWrap: {
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    border: "1px solid #e8eef8",
    borderRadius: "24px",
    padding: "16px"
  }
};

const categoryBtnStyle = {
  border: "1px solid #dbeafe",
  background: "#ffffff",
  color: "#0f172a",
  padding: "10px 14px",
  borderRadius: "999px",
  fontWeight: "800",
  fontSize: "13px",
  cursor: "pointer",
  whiteSpace: "nowrap",
  boxShadow: "0 4px 14px rgba(15,23,42,0.04)"
};

const categoryActiveBtnStyle = {
  ...categoryBtnStyle,
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "#ffffff",
  border: "1px solid #2563eb",
  boxShadow: "0 10px 22px rgba(37,99,235,0.22)"
};