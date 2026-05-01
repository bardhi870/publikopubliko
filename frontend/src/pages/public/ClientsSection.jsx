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
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
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

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function loadClients() {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/public-clients`, {
          signal: controller.signal
        });

        if (!res.ok) throw new Error("Fallback");

        const data = await res.json();

        if (!ignore) {
          setClients(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!ignore && err.name !== "AbortError") {
          setClients(fallbackClients);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadClients();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

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
    return <div className="clients-empty-state">Duke i ngarkuar klientët...</div>;
  }

  if (!activeClients.length) {
    return (
      <div className="clients-empty-state">
        Nuk ka klientë të publikuar për momentin.
      </div>
    );
  }

  return (
    <section className="clients-section">
      <style>{`
        .clients-section {
          width: 100%;
          margin-top: clamp(26px, 4vw, 54px);
          position: relative;
          isolation: isolate;
        }

        .clients-section::before {
          content: "";
          position: absolute;
          inset: -40px 0 auto;
          height: 260px;
          background:
            radial-gradient(circle at 18% 22%, rgba(37,99,235,.11), transparent 34%),
            radial-gradient(circle at 82% 8%, rgba(20,184,166,.10), transparent 32%);
          pointer-events: none;
          z-index: -1;
        }

        .clients-header {
          text-align: center;
          max-width: 900px;
          margin: 0 auto clamp(22px, 3vw, 34px);
          padding: 0 14px;
        }

        .clients-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 9px 15px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: #1d4ed8;
          font-weight: 900;
          font-size: 13px;
          margin-bottom: 13px;
          border: 1px solid rgba(191,219,254,.95);
          box-shadow: 0 12px 26px rgba(37,99,235,.10);
        }

        .clients-title {
          margin: 0;
          color: #0f172a;
          font-size: clamp(30px, 4vw, 50px);
          line-height: 1.03;
          font-weight: 950;
          letter-spacing: -.05em;
        }

        .clients-title span {
          background: linear-gradient(135deg, #2563eb, #0f766e);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .clients-subtitle {
          margin: 14px auto 0;
          color: #64748b;
          font-size: clamp(14px, 1.45vw, 17px);
          line-height: 1.8;
          max-width: 720px;
          font-weight: 600;
        }

        .clients-shell {
          max-width: 1440px;
          margin: 0 auto;
          padding: clamp(14px, 2vw, 24px);
          border-radius: clamp(22px, 3vw, 34px);
          background:
            linear-gradient(135deg, rgba(255,255,255,.98), rgba(248,250,252,.94)),
            radial-gradient(circle at top right, rgba(59,130,246,.10), transparent 34%);
          box-shadow: 0 24px 70px rgba(15,23,42,.075);
          border: 1px solid rgba(226,232,240,.95);
          overflow: hidden;
          position: relative;
        }

        .clients-shell::before {
          content: "";
          position: absolute;
          top: -110px;
          right: -90px;
          width: 280px;
          height: 280px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(20,184,166,.13), transparent 72%);
          pointer-events: none;
        }

        .clients-shell::after {
          content: "";
          position: absolute;
          bottom: -120px;
          left: -100px;
          width: 300px;
          height: 300px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(37,99,235,.10), transparent 72%);
          pointer-events: none;
        }

        .clients-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
        }

        .client-link {
          display: block;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }

        .client-card {
          height: 100%;
          min-height: 154px;
          box-sizing: border-box;
          border: 1px solid rgba(226,232,240,.95);
          border-radius: 22px;
          padding: 14px;
          background: rgba(255,255,255,.88);
          box-shadow: 0 14px 30px rgba(15,23,42,.045);
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .client-link:hover .client-card,
        .client-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px rgba(15,23,42,.08);
          border-color: rgba(147,197,253,.95);
        }

        .client-logo-box {
          height: 94px;
          border-radius: 17px;
          background:
            linear-gradient(135deg, #f8fafc, #ffffff);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 13px;
          border: 1px solid rgba(237,242,247,.98);
          overflow: hidden;
        }

        .client-logo {
          max-width: 100%;
          max-height: 68px;
          object-fit: contain;
          display: block;
          filter: saturate(1.02) contrast(1.02);
        }

        .client-placeholder {
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
        }

        .client-name {
          margin-top: 12px;
          text-align: center;
          font-size: 14px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.35;
          word-break: break-word;
        }

        .clients-empty-state {
          padding: 34px 18px;
          text-align: center;
          border: 1px dashed #cbd5e1;
          border-radius: 18px;
          color: #64748b;
          background: #f8fafc;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .clients-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .clients-section {
            margin-top: 28px;
          }

          .clients-header {
            margin-bottom: 20px;
          }

          .clients-badge {
            padding: 8px 13px;
            font-size: 12px;
            margin-bottom: 11px;
          }

          .clients-title {
            font-size: clamp(29px, 8.5vw, 38px);
            line-height: 1.06;
          }

          .clients-subtitle {
            font-size: 14px;
            line-height: 1.7;
            margin-top: 11px;
          }

          .clients-shell {
            border-radius: 24px;
            padding: 12px;
          }

          .clients-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .client-card {
            min-height: 138px;
            border-radius: 18px;
            padding: 10px;
            box-shadow: 0 10px 22px rgba(15,23,42,.045);
          }

          .client-link:hover .client-card,
          .client-card:hover {
            transform: none;
          }

          .client-logo-box {
            height: 78px;
            border-radius: 14px;
            padding: 10px;
          }

          .client-logo {
            max-height: 56px;
          }

          .client-name {
            margin-top: 9px;
            font-size: 13px;
            line-height: 1.3;
          }
        }

        @media (max-width: 380px) {
          .clients-grid {
            gap: 9px;
          }

          .client-card {
            min-height: 128px;
            padding: 9px;
          }

          .client-logo-box {
            height: 70px;
          }

          .client-logo {
            max-height: 50px;
          }

          .client-name {
            font-size: 12.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .client-card {
            transition: none;
          }

          .client-link:hover .client-card,
          .client-card:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="clients-header">
        <div className="clients-badge">Klientët tanë</div>

        <h2 className="clients-title">
          Biznese që na kanë <span>besuar</span>
        </h2>

        <p className="clients-subtitle">
          Disa nga klientët dhe partnerët që kanë zgjedhur Publiko për prezencën,
          promovimin dhe paraqitjen e tyre profesionale.
        </p>
      </div>

      <div className="clients-shell">
        <div className="clients-grid">
          {activeClients.map((client) => {
            const image = client.image || client.logo || "";
            const website = client.website || client.link || "";

            const content = (
              <div className="client-card">
                <div className="client-logo-box">
                  {image ? (
                    <img
                      src={image}
                      alt={client.name || "Klient"}
                      className="client-logo"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="client-placeholder">Pa logo</span>
                  )}
                </div>

                <div className="client-name">{client.name || "Klient"}</div>
              </div>
            );

            if (website) {
              return (
                <a
                  key={client.id}
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="client-link"
                  aria-label={`Hape ${client.name || "klientin"}`}
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