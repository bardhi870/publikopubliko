import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Të gjitha lajmet", path: "/lajme", description: "Faqja kryesore e lajmeve" },
  { label: "Vendi", path: "/lajme/vendi", description: "Lajme nga vendi" },
  { label: "Rajoni", path: "/lajme/rajoni", description: "Zhvillime nga rajoni" },
  { label: "Bota", path: "/lajme/bota", description: "Ngjarje nga bota" },
];

export default function NewsMenuDropdown({ mobile = false, onNavigate }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const wrapperRef = useRef(null);

  const isNewsRoute = location.pathname.startsWith("/lajme");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (mobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          style={{
            width: "100%",
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.06)",
            color: "#ffffff",
            borderRadius: "18px",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            backdropFilter: "blur(12px)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Lajme</span>
            {isNewsRoute && (
              <span
                style={{
                  fontSize: "11px",
                  padding: "4px 8px",
                  borderRadius: "999px",
                  background: "rgba(96,165,250,0.18)",
                  color: "#bfdbfe",
                  border: "1px solid rgba(147,197,253,0.16)",
                }}
              >
                Aktiv
              </span>
            )}
          </span>

          <span
            style={{
              fontSize: "14px",
              transition: "transform 0.25s ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </button>

        {open && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "8px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {menuItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  style={{
                    textDecoration: "none",
                    borderRadius: "14px",
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    background: active ? "rgba(96,165,250,0.12)" : "transparent",
                    border: active
                      ? "1px solid rgba(147,197,253,0.18)"
                      : "1px solid transparent",
                    color: active ? "#ffffff" : "rgba(255,255,255,0.92)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: active ? "rgba(255,255,255,0.74)" : "rgba(255,255,255,0.58)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.description}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          border: "none",
          background: "transparent",
          color: isNewsRoute ? "#0f172a" : "#334155",
          fontSize: "15px",
          fontWeight: isNewsRoute ? 800 : 700,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          padding: "10px 0",
        }}
      >
        <span>Lajme</span>
        <span
          style={{
            fontSize: "12px",
            transition: "transform 0.25s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </button>

      <div
        style={{
          position: "absolute",
          top: "calc(100% + 14px)",
          left: 0,
          minWidth: "320px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: "22px",
          boxShadow: "0 24px 60px rgba(15,23,42,0.12)",
          padding: "10px",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transform: open ? "translateY(0)" : "translateY(8px)",
          transition:
            "opacity 0.22s ease, transform 0.22s ease, visibility 0.22s ease",
          zIndex: 1000,
        }}
      >
       

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  padding: "12px 14px",
                  borderRadius: "16px",
                  background: active ? "rgba(37,99,235,0.08)" : "transparent",
                  border: active
                    ? "1px solid rgba(37,99,235,0.12)"
                    : "1px solid transparent",
                  transition: "background 0.22s ease, transform 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(15,23,42,0.04)";
                    e.currentTarget.style.transform = "translateX(2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    color: active ? "#0f172a" : "#1e293b",
                  }}
                >
                  {item.label}
                </span>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}