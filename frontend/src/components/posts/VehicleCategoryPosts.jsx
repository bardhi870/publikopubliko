import React, { useEffect, useMemo, useState } from "react";
import { getPostsByCategory } from "../../api/postApi";
import VehiclePostCard from "./VehiclePostCard";
import {
  CITY_OPTIONS,
  VEHICLE_FUEL_OPTIONS,
  VEHICLE_GEARBOX_OPTIONS,
  VEHICLE_YEAR_OPTIONS
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

export default function VehicleCategoryPosts({ title, category }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicleCity, setSelectedVehicleCity] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedGearbox, setSelectedGearbox] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

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
    screenWidth > 1100
      ? "repeat(3, minmax(0, 1fr))"
      : screenWidth > 640
      ? "repeat(2, minmax(0, 1fr))"
      : "1fr";

  const filteredPosts = useMemo(() => {
    return [...posts]
      .filter((post) => {
        const query = normalize(vehicleSearch);
        const postTitle = normalize(post.title);
        const postCity = normalize(post.city || post.location);
        const postFuel = normalize(post.fuel || post.fuel_type);
        const postGearbox = normalize(post.gearbox || post.transmission);
        const postYear = normalize(post.year || post.vehicle_year);

        return (
          (!query || postTitle.includes(query)) &&
          (!selectedVehicleCity || postCity.includes(normalize(selectedVehicleCity))) &&
          (!selectedFuel || postFuel.includes(normalize(selectedFuel))) &&
          (!selectedGearbox || postGearbox.includes(normalize(selectedGearbox))) &&
          (!selectedYear || postYear.includes(normalize(selectedYear)))
        );
      })
      .sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
  }, [
    posts,
    vehicleSearch,
    selectedVehicleCity,
    selectedFuel,
    selectedGearbox,
    selectedYear
  ]);

  const clearVehicleFilters = () => {
    setVehicleSearch("");
    setSelectedVehicleCity("");
    setSelectedFuel("");
    setSelectedGearbox("");
    setSelectedYear("");
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
              <label style={fieldLabelStyle}>Kërko automjet</label>
              <input
                type="text"
                placeholder="BMW, Golf, Mercedes..."
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={fieldLabelStyle}>Qyteti</label>
              <select
                value={selectedVehicleCity}
                onChange={(e) => setSelectedVehicleCity(e.target.value)}
                style={inputStyle}
              >
                <option value="">Të gjitha qytetet</option>
                {CITY_OPTIONS.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={fieldLabelStyle}>Karburanti</label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                style={inputStyle}
              >
                <option value="">Të gjitha</option>
                {VEHICLE_FUEL_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={fieldLabelStyle}>Ndërruesi</label>
              <select
                value={selectedGearbox}
                onChange={(e) => setSelectedGearbox(e.target.value)}
                style={inputStyle}
              >
                <option value="">Të gjitha</option>
                {VEHICLE_GEARBOX_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={fieldLabelStyle}>Viti</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={inputStyle}
              >
                <option value="">Të gjitha</option>
                {VEHICLE_YEAR_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
              Gjithsej automjete: <span style={{ color: "#0f172a", fontWeight: "800" }}>{filteredPosts.length}</span>
            </div>

            <button type="button" onClick={clearVehicleFilters} style={clearBtnStyle}>
              Largo filtrat
            </button>
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "32px 20px", textAlign: "center", color: "#64748b" }}>
          Nuk u gjet asnjë automjet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cardGridColumns,
            gap: isMobile ? "14px" : "22px",
            alignItems: "start",
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto"
          }}
        >
          {filteredPosts.map((post, index) => (
            <VehiclePostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}