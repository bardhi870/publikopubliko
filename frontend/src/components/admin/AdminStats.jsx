import React from "react";

export default function AdminStats({
  totalPosts,
  selectedCategoryFilter,
  selectedCategoryCount,
  categoryLabels
}) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
        color: "#fff",
        borderRadius: "28px",
        padding: "28px",
        boxShadow: "0 22px 60px rgba(15,23,42,0.18)",
        marginBottom: "24px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "18px",
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.14)",
              fontSize: "13px",
              marginBottom: "12px"
            }}
          >
            Admin Panel
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              lineHeight: 1.05,
              letterSpacing: "-0.03em"
            }}
          >
            Menaxhimi i portalit
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#dbeafe",
              maxWidth: "700px",
              lineHeight: 1.7
            }}
          >
            Shto, edito dhe menaxho lajme, patundshmëri, automjete dhe konkurse
            pune nga një dashboard i vetëm.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            minWidth: "320px"
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "22px",
              padding: "18px 20px"
            }}
          >
            <div
              style={{ fontSize: "13px", color: "#bfdbfe", marginBottom: "6px" }}
            >
              Gjithsej postime
            </div>
            <div style={{ fontSize: "34px", fontWeight: "900", lineHeight: 1 }}>
              {totalPosts}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "22px",
              padding: "18px 20px"
            }}
          >
            <div
              style={{ fontSize: "13px", color: "#bfdbfe", marginBottom: "6px" }}
            >
              {selectedCategoryFilter === "all"
                ? "Në filtrin aktual"
                : `Në kategorinë ${categoryLabels[selectedCategoryFilter]}`}
            </div>
            <div style={{ fontSize: "34px", fontWeight: "900", lineHeight: 1 }}>
              {selectedCategoryCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}