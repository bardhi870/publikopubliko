import React from "react";
import { Link } from "react-router-dom";

import useAdminPosts from "../../hooks/useAdminPosts";
import AdminStats from "../../components/admin/AdminStats";
import AdminPostForm from "../../components/admin/AdminPostForm";
import AdminPostsList from "../../components/admin/AdminPostsList";

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
        <div style={styles.topCard}>
          <div style={styles.topHeader}>
            <div>
              <h1 style={styles.pageTitle}>Dashboard Admin</h1>
              <p style={styles.pageSubtitle}>
                Menaxhim profesional i postimeve, klientëve dhe përmbajtjes publike.
              </p>
            </div>

            <div style={styles.totalBadge}>
              Gjithsej postime: <strong>{posts.length}</strong>
            </div>
          </div>

          <div style={styles.navWrap}>
            <Link to="/admin" style={activeBtnStyle}>
              Dashboard
            </Link>

            <Link to="/admin/clients" style={btnStyle}>
              Klientët
            </Link>

            <Link to="/admin/ads" style={btnStyle}>
              Reklamat
            </Link>

            <Link to="/admin/public-clients" style={btnStyle}>
              Klientët tanë
            </Link>

            <Link to="/admin/offers" style={btnStyle}>
              Ofertat
            </Link>

            <Link to="/admin/ad-requests" style={btnStyle}>
              Reklamo me ne
            </Link>

            <Link to="/admin/payments" style={btnStyle}>
              Pagesat
            </Link>
          </div>
        </div>

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

        <div style={styles.categoryCard}>
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
        </div>

        <div className="admin-dashboard-grid" style={styles.mainGrid}>
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                {editingId ? "Përditëso postimin" : "Krijo postim të ri"}
              </h3>

              <p style={styles.cardSubtitle}>
                Plotëso postimin me të dhënat, fotot, videon dhe renditjen e kopertinës.
              </p>
            </div>

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

          <div style={styles.listCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Lista e postimeve</h3>

              <p style={styles.cardSubtitle}>
                Kartat janë më profesionale, më kompakte dhe shumë më të lexueshme.
              </p>
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
            />
          </div>
        </div>

        <style>{`
          @media (max-width: 1180px) {
            .admin-dashboard-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .admin-category-scroll {
              flex-wrap: nowrap !important;
              overflow-x: auto !important;
              padding-bottom: 4px;
            }

            .admin-category-scroll::-webkit-scrollbar {
              height: 6px;
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
    padding: "24px 14px 48px"
  },

  container: {
    maxWidth: "1440px",
    margin: "0 auto"
  },

  topCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "24px",
    marginBottom: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 18px 40px rgba(15,23,42,0.06)"
  },

  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "16px"
  },

  pageTitle: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: "-0.03em"
  },

  pageSubtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6
  },

  totalBadge: {
    padding: "11px 15px",
    borderRadius: "14px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
    fontWeight: "800",
    fontSize: "14px"
  },

  navWrap: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
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
    borderRadius: "22px",
    padding: "18px",
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
    fontSize: "20px",
    fontWeight: "900",
    color: "#0f172a"
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px"
  },

  filterCountBadge: {
    padding: "9px 12px",
    borderRadius: "12px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontWeight: "700",
    fontSize: "13px"
  },

  categoryButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(340px, 440px) minmax(0, 1fr)",
    gap: "20px",
    alignItems: "start"
  },

  formCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 16px 40px rgba(15,23,42,0.05)"
  },

  listCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 16px 40px rgba(15,23,42,0.05)"
  },

  cardHeader: {
    marginBottom: "14px"
  },

  cardTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "900",
    color: "#0f172a"
  },

  cardSubtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6
  }
};

const btnStyle = {
  textDecoration: "none",
  background: "#0f172a",
  color: "#fff",
  padding: "11px 16px",
  borderRadius: "12px",
  fontWeight: "700",
  fontSize: "14px",
  boxShadow: "0 8px 18px rgba(15,23,42,0.14)"
};

const activeBtnStyle = {
  ...btnStyle,
  background: "linear-gradient(135deg, #2563eb, #3b82f6)"
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
  whiteSpace: "nowrap"
};

const categoryActiveBtnStyle = {
  ...categoryBtnStyle,
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "#ffffff",
  border: "1px solid #2563eb",
  boxShadow: "0 10px 22px rgba(37,99,235,0.22)"
};