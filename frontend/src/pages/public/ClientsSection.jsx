import React, { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fallbackClients = [
  {
    id: 1,
    name: "Publiko",
    image:
      "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776285534/ChatGPT_Image_Apr_15_2026_10_38_27_PM_bf2mf9.png",
    website: "",
    sort_order: 1,
    is_active: true
  },
  {
    id: 2,
    name: "Portal Pune",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    website: "",
    sort_order: 2,
    is_active: true
  },
  {
    id: 3,
    name: "Shpallje Pune",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
    website: "",
    sort_order: 3,
    is_active: true
  }
];

export default function ClientsSection() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadClients() {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/public-clients`);

        if (!res.ok) {
          throw new Error("Fallback");
        }

        const data = await res.json();

        if (!ignore) {
          setClients(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!ignore) {
          setClients(fallbackClients);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadClients();

    return () => {
      ignore = true;
    };
  }, []);

  const isMobile = screenWidth <= 768;

  const activeClients = useMemo(() => {
    return [...clients]
      .filter((client) =>
        typeof client.is_active !== "undefined"
          ? !!client.is_active
          : typeof client.isActive !== "undefined"
          ? !!client.isActive
          : client.status
          ? client.status === "Aktive"
          : true
      )
      .sort((a, b) => {
        const first =
          typeof a.sortOrder !== "undefined"
            ? Number(a.sortOrder || 0)
            : Number(a.sort_order || 0);

        const second =
          typeof b.sortOrder !== "undefined"
            ? Number(b.sortOrder || 0)
            : Number(b.sort_order || 0);

        return first - second;
      });
  }, [clients]);

  if (loading) {
    return <div style={emptyStateStyle}>Duke i ngarkuar klientët...</div>;
  }

  if (!activeClients.length) {
    return (
      <div style={emptyStateStyle}>
        Nuk ka klientë të publikuar për momentin.
      </div>
    );
  }

  return (
    <section
      style={{
        marginTop: isMobile ? "24px" : "40px"
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "860px",
          margin: isMobile ? "0 auto 22px" : "0 auto 30px"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? "8px 12px" : "9px 14px",
            borderRadius: "999px",
            background: "#eff6ff",
            color: "#1d4ed8",
            fontWeight: "700",
            fontSize: isMobile ? "12px" : "13px",
            marginBottom: "12px"
          }}
        >
          Klientët tanë
        </div>

        <h2
          style={{
            margin: "0 0 10px",
            color: "#0f172a",
            fontSize: isMobile ? "28px" : "42px",
            lineHeight: 1.05,
            fontWeight: "800",
            letterSpacing: "-0.03em"
          }}
        >
          Biznese që na kanë besuar
        </h2>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: isMobile ? "14px" : "16px",
            lineHeight: 1.75,
            maxWidth: "700px",
            marginInline: "auto"
          }}
        >
          Disa nga klientët dhe partnerët që kanë zgjedhur Publiko për
          prezencën dhe promovimin e tyre.
        </p>
      </div>

      <div
        style={{
          background: "#ffffff",
          borderRadius: isMobile ? "18px" : "24px",
          padding: isMobile ? "16px" : "24px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(auto-fit, minmax(170px, 1fr))",
            gap: isMobile ? "12px" : "14px"
          }}
        >
          {activeClients.map((client) => {
            const image = client.image || client.logo || "";
            const website = client.website || client.link || "";
            const content = (
              <div style={logoCardStyle}>
                <div style={logoBoxStyle}>
                  {image ? (
                    <img
                      src={image}
                      alt={client.name || "client"}
                      style={logoImageStyle}
                    />
                  ) : (
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                      Pa logo
                    </span>
                  )}
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    textAlign: "center",
                    fontSize: isMobile ? "13px" : "14px",
                    fontWeight: "700",
                    color: "#0f172a",
                    lineHeight: 1.4,
                    wordBreak: "break-word"
                  }}
                >
                  {client.name || "Klient"}
                </div>
              </div>
            );

            if (website) {
              return (
                <a
                  key={client.id}
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none"
                  }}
                >
                  {content}
                </a>
              );
            }

            return <div key={client.id}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}

const emptyStateStyle = {
  padding: "34px 18px",
  textAlign: "center",
  border: "1px dashed #cbd5e1",
  borderRadius: "16px",
  color: "#64748b",
  background: "#f8fafc"
};

const logoCardStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "14px",
  background: "#ffffff",
  transition: "all .2s ease",
  height: "100%",
  boxSizing: "border-box"
};

const logoBoxStyle = {
  height: "90px",
  borderRadius: "12px",
  background: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px",
  border: "1px solid #edf2f7",
  overflow: "hidden"
};

const logoImageStyle = {
  maxWidth: "100%",
  maxHeight: "64px",
  objectFit: "contain",
  display: "block"
};