import React, { useMemo } from "react";

function parseOfferFeatures(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatPrice(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "0.00";
  return numeric.toFixed(2);
}

function normalizePhone(value) {
  return String(value || "").trim();
}

function normalizeWhatsapp(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizeMessenger(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("mailto:") ||
    raw.startsWith("tel:")
  ) {
    return raw;
  }

  return `https://${raw}`;
}

function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(15,23,42,${alpha})`;

  let clean = String(hex).replace("#", "").trim();

  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (clean.length !== 6) return `rgba(15,23,42,${alpha})`;

  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getContrastColor(hex) {
  if (!hex) return "#ffffff";

  let clean = String(hex).replace("#", "").trim();

  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (clean.length !== 6) return "#ffffff";

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? "#0f172a" : "#ffffff";
}

export default function OfferCard({ offer, featured = false }) {
  const features = useMemo(() => {
    return parseOfferFeatures(
      offer?.offer_features ?? offer?.offerFeatures ?? offer?.services
    );
  }, [offer]);

  const badgeText = String(offer?.offer_badge || offer?.offerBadge || "").trim();
  const phone = normalizePhone(offer?.phone);
  const whatsapp = normalizeWhatsapp(offer?.whatsapp);
  const messenger = normalizeMessenger(offer?.messenger);

  const hasBadge = Boolean(badgeText);
  const isHighlighted = Boolean(featured || hasBadge || offer?.highlighted);

  const hasPhone = Boolean(phone);
  const hasWhatsapp = Boolean(whatsapp);
  const hasMessenger = Boolean(messenger);
  const hasContacts = hasPhone || hasWhatsapp || hasMessenger;
  const hasFeatures = features.length > 0;

  const title = offer?.title || "Oferta";
  const description = offer?.description || "";
  const price = formatPrice(offer?.price);

  const backgroundColor = offer?.background_color || offer?.backgroundColor || "#ffffff";
  const textColor = offer?.text_color || offer?.textColor || "#0f172a";
  const buttonColor = offer?.button_color || offer?.buttonColor || "#2563eb";
  const buttonTextColor = getContrastColor(buttonColor);

  const registerHref = hasWhatsapp
    ? `https://wa.me/${whatsapp}`
    : hasPhone
      ? `tel:${phone}`
      : hasMessenger
        ? messenger
        : undefined;

  const registerTarget = hasWhatsapp || hasMessenger ? "_blank" : undefined;
  const registerRel = hasWhatsapp || hasMessenger ? "noreferrer" : undefined;

  return (
    <article
      className={`offer-card ${isHighlighted ? "offer-card-featured" : ""}`}
      style={{
        "--offer-bg": backgroundColor,
        "--offer-text": textColor,
        "--offer-muted": hexToRgba(textColor, 0.68),
        "--offer-soft": hexToRgba(textColor, 0.09),
        "--offer-border": hexToRgba(textColor, 0.13),
        "--offer-main": buttonColor,
        "--offer-main-soft": hexToRgba(buttonColor, 0.14),
        "--offer-main-shadow": hexToRgba(buttonColor, 0.22),
        "--offer-btn-text": buttonTextColor
      }}
    >
      <style>{`
        .offer-card {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 100%;
          border-radius: 30px;
          padding: 1px;
          background: linear-gradient(135deg, var(--offer-border), rgba(255,255,255,.92));
          box-shadow: 0 18px 50px rgba(15,23,42,.075);
          overflow: hidden;
          transform: translateZ(0);
          transition: transform .22s ease, box-shadow .22s ease;
        }

        .offer-card-featured {
          background: linear-gradient(135deg, var(--offer-main), rgba(255,255,255,.96));
          box-shadow: 0 26px 70px var(--offer-main-shadow);
        }

        .offer-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 28px 76px rgba(15,23,42,.11);
        }

        .offer-inner {
          position: relative;
          height: 100%;
          border-radius: 29px;
          padding: 34px 24px 24px;
          background:
            radial-gradient(circle at 85% 8%, var(--offer-main-soft), transparent 34%),
            linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.88)),
            var(--offer-bg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .offer-card-featured .offer-inner {
          padding-top: 42px;
        }

        .offer-badge {
          position: absolute;
          top: 14px;
          left: 16px;
          right: 16px;
          z-index: 3;
          min-height: 34px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 9px 14px;
          background: linear-gradient(135deg, var(--offer-main), rgba(15,23,42,.92));
          color: var(--offer-btn-text);
          font-size: 12px;
          font-weight: 950;
          line-height: 1;
          box-shadow: 0 12px 26px var(--offer-main-shadow);
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .offer-head {
          position: relative;
          z-index: 2;
          text-align: center;
          margin-top: 8px;
        }

        .offer-title {
          margin: 0;
          color: var(--offer-text);
          font-size: clamp(28px, 3vw, 40px);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -.055em;
          word-break: break-word;
        }

        .offer-description {
          max-width: 360px;
          margin: 12px auto 0;
          color: var(--offer-muted);
          font-size: 14px;
          line-height: 1.65;
          font-weight: 650;
          word-break: break-word;
        }

        .offer-price {
          position: relative;
          z-index: 2;
          margin: 24px 0 22px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 8px;
          flex-wrap: wrap;
          color: var(--offer-text);
        }

        .offer-price-number {
          font-size: clamp(44px, 5vw, 58px);
          line-height: .9;
          font-weight: 950;
          letter-spacing: -.075em;
        }

        .offer-price-euro {
          font-size: 21px;
          font-weight: 950;
          margin-bottom: 6px;
        }

        .offer-price-tax {
          font-size: 12.5px;
          color: var(--offer-muted);
          font-weight: 750;
          margin-bottom: 8px;
        }

        .offer-contacts {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 10px;
          margin-bottom: 16px;
        }

        .offer-contact {
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px 13px;
          border-radius: 16px;
          background: rgba(255,255,255,.64);
          border: 1px solid var(--offer-border);
          color: var(--offer-text);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(15,23,42,.035);
          box-sizing: border-box;
          overflow: hidden;
        }

        .offer-contact-icon {
          width: 27px;
          height: 27px;
          min-width: 27px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          background: var(--offer-main-soft);
          color: var(--offer-main);
          font-weight: 950;
        }

        .offer-contact-text {
          min-width: 0;
          flex: 1;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .offer-button {
          position: relative;
          z-index: 2;
          width: 100%;
          min-height: 54px;
          padding: 16px 18px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,.22);
          background: linear-gradient(135deg, var(--offer-main), rgba(15,23,42,.88));
          color: var(--offer-btn-text);
          font-weight: 950;
          font-size: 16px;
          letter-spacing: .01em;
          box-shadow: 0 16px 34px var(--offer-main-shadow);
          margin-bottom: 20px;
          box-sizing: border-box;
        }

        .offer-button-disabled {
          background: rgba(255,255,255,.62);
          color: var(--offer-muted);
          border: 1px solid var(--offer-border);
          box-shadow: none;
        }

        .offer-features {
          position: relative;
          z-index: 2;
          border-top: 1px solid var(--offer-border);
          padding-top: 18px;
          display: grid;
          gap: 13px;
          text-align: left;
          margin-top: auto;
        }

        .offer-feature {
          display: flex;
          align-items: flex-start;
          gap: 11px;
        }

        .offer-feature-dot {
          width: 23px;
          height: 23px;
          min-width: 23px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 950;
          margin-top: 1px;
        }

        .offer-feature-dot.yes {
          background: rgba(16,185,129,.13);
          color: #059669;
        }

        .offer-feature-dot.no {
          background: rgba(239,68,68,.12);
          color: #ef4444;
        }

        .offer-feature-text {
          color: var(--offer-text);
          font-size: 14px;
          line-height: 1.55;
          font-weight: 850;
          word-break: break-word;
        }

        .offer-feature.no .offer-feature-text {
          opacity: .62;
        }

        .offer-feature-note {
          margin-top: 4px;
          color: var(--offer-muted);
          font-size: 12px;
          line-height: 1.5;
          font-weight: 650;
        }

        .offer-empty-features {
          color: var(--offer-muted);
          text-align: center;
          font-size: 14px;
          font-weight: 750;
          padding: 4px 0;
        }

        @media (max-width: 768px) {
          .offer-card {
            border-radius: 24px;
            box-shadow: 0 14px 34px rgba(15,23,42,.07);
          }

          .offer-card:hover {
            transform: none;
          }

          .offer-inner {
            border-radius: 23px;
            padding: 28px 15px 19px;
          }

          .offer-card-featured .offer-inner {
            padding-top: 40px;
          }

          .offer-badge {
            top: 12px;
            left: 12px;
            right: 12px;
            min-height: 32px;
            font-size: 11px;
            padding: 8px 12px;
          }

          .offer-title {
            font-size: 30px;
            letter-spacing: -.045em;
          }

          .offer-description {
            font-size: 13px;
            line-height: 1.6;
            margin-top: 9px;
          }

          .offer-price {
            margin: 20px 0 18px;
          }

          .offer-price-number {
            font-size: 44px;
          }

          .offer-price-euro {
            font-size: 18px;
            margin-bottom: 5px;
          }

          .offer-contact {
            min-height: 46px;
            border-radius: 15px;
            padding: 11px 12px;
            font-size: 13px;
          }

          .offer-button {
            min-height: 50px;
            border-radius: 16px;
            font-size: 15px;
            margin-bottom: 17px;
          }

          .offer-features {
            padding-top: 16px;
            gap: 12px;
          }

          .offer-feature-text {
            font-size: 13.5px;
          }
        }

        @media (max-width: 390px) {
          .offer-inner {
            padding-left: 13px;
            padding-right: 13px;
          }

          .offer-title {
            font-size: 28px;
          }

          .offer-price-number {
            font-size: 40px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .offer-card {
            transition: none;
          }

          .offer-card:hover {
            transform: none;
          }
        }
      `}</style>

      {(badgeText || featured) && (
        <div className="offer-badge">{badgeText || "MË POPULLORJA"}</div>
      )}

      <div className="offer-inner">
        <div className="offer-head">
          <h2 className="offer-title">{title}</h2>

          {description ? (
            <p className="offer-description">{description}</p>
          ) : null}
        </div>

        <div className="offer-price">
          <span className="offer-price-number">{price}</span>
          <span className="offer-price-euro">€</span>
          <span className="offer-price-tax">/ pa TVSH</span>
        </div>

        {hasContacts ? (
          <div className="offer-contacts">
            {hasPhone ? (
              <a href={`tel:${phone}`} className="offer-contact">
                <span className="offer-contact-icon">☎</span>
                <span className="offer-contact-text">{phone}</span>
              </a>
            ) : null}

            {hasWhatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="offer-contact"
              >
                <span className="offer-contact-icon">W</span>
                <span className="offer-contact-text">{whatsapp}</span>
              </a>
            ) : null}

            {hasMessenger ? (
              <a
                href={messenger}
                target="_blank"
                rel="noreferrer"
                className="offer-contact"
              >
                <span className="offer-contact-icon">M</span>
                <span className="offer-contact-text">Messenger</span>
              </a>
            ) : null}
          </div>
        ) : null}

        {registerHref ? (
          <a
            href={registerHref}
            target={registerTarget}
            rel={registerRel}
            className="offer-button"
          >
            Regjistrohu
          </a>
        ) : (
          <div className="offer-button offer-button-disabled">
            Nuk ka kontakt aktiv
          </div>
        )}

        <div className="offer-features">
          {hasFeatures ? (
            features.map((feature, idx) => {
              const included = Boolean(feature?.included);

              return (
                <div
                  key={idx}
                  className={`offer-feature ${included ? "yes" : "no"}`}
                >
                  <span className={`offer-feature-dot ${included ? "yes" : "no"}`}>
                    {included ? "✓" : "×"}
                  </span>

                  <div>
                    <div className="offer-feature-text">{feature?.text}</div>

                    {feature?.note ? (
                      <div className="offer-feature-note">{feature.note}</div>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="offer-empty-features">
              Nuk ka opsione të shtuara ende.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}