import React, { useEffect, useMemo, useState } from "react";

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

  if (clean.length !== 6) {
    return `rgba(15,23,42,${alpha})`;
  }

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

  if (clean.length !== 6) {
    return "#ffffff";
  }

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? "#0f172a" : "#ffffff";
}

export default function OfferCard({ offer, featured = false }) {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1100;

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

  const registerHref = hasWhatsapp
    ? `https://wa.me/${whatsapp}`
    : hasPhone
    ? `tel:${phone}`
    : hasMessenger
    ? messenger
    : undefined;

  const registerTarget = hasWhatsapp || hasMessenger ? "_blank" : undefined;
  const registerRel = hasWhatsapp || hasMessenger ? "noreferrer" : undefined;

  const wrapperTransform = isMobile
    ? "none"
    : isHovered
    ? isHighlighted
      ? "translateY(-10px) scale(1.01)"
      : "translateY(-6px)"
    : isHighlighted
    ? "translateY(-4px)"
    : "none";

  const title = offer?.title || "Oferta";
  const description = offer?.description || "";
  const price = formatPrice(offer?.price);

  const backgroundColor =
    offer?.background_color || offer?.backgroundColor || "#ffffff";
  const textColor = offer?.text_color || offer?.textColor || "#0f172a";
  const buttonColor = offer?.button_color || offer?.buttonColor || "#2563eb";
  const buttonTextColor = getContrastColor(buttonColor);

  const cardBorderColor = isHighlighted
    ? hexToRgba(buttonColor, 0.45)
    : hexToRgba(textColor, 0.12);

  const softTextColor = hexToRgba(textColor, 0.72);
  const softBorderColor = hexToRgba(textColor, 0.10);
  const softPanelColor = hexToRgba("#ffffff", 0.58);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: isMobile ? "24px" : "32px",
        padding: "1px",
        background: isHighlighted
          ? `linear-gradient(135deg, ${hexToRgba(buttonColor, 0.95)} 0%, ${hexToRgba(
              backgroundColor,
              0.95
            )} 100%)`
          : `linear-gradient(135deg, ${hexToRgba(textColor, 0.12)} 0%, ${hexToRgba(
              backgroundColor,
              0.85
            )} 100%)`,
        boxShadow: isHighlighted
          ? `0 24px 70px ${hexToRgba(buttonColor, 0.20)}`
          : "0 18px 48px rgba(15,23,42,0.08)",
        transform: wrapperTransform,
        transition: "all .28s ease",
        overflow: "visible",
        width: "100%"
      }}
      onMouseEnter={() => {
        if (!isMobile) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setIsHovered(false);
      }}
    >
      {(badgeText || featured) && (
        <div
          style={{
            position: "absolute",
            top: isMobile ? "-14px" : "-16px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: isMobile ? "9px 16px" : "10px 18px",
            borderRadius: "999px",
            background: `linear-gradient(135deg, ${buttonColor} 0%, ${hexToRgba(
              textColor,
              0.95
            )} 100%)`,
            color: buttonTextColor,
            fontSize: isMobile ? "11px" : "12px",
            fontWeight: "800",
            lineHeight: 1,
            letterSpacing: "0.01em",
            boxShadow: `0 12px 28px ${hexToRgba(buttonColor, 0.24)}`,
            whiteSpace: "nowrap",
            maxWidth: "calc(100% - 28px)"
          }}
        >
          {badgeText || "✨ Oferta premium"}
        </div>
      )}

      <div
        style={{
          position: "relative",
          background: `linear-gradient(180deg, ${hexToRgba(
            backgroundColor,
            0.97
          )} 0%, ${hexToRgba(backgroundColor, 0.93)} 100%)`,
          borderRadius: isMobile ? "23px" : "31px",
          padding: isMobile ? "30px 16px 22px" : "38px 26px 28px",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          minHeight: isMobile ? "auto" : "100%",
          overflow: "hidden",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-70px",
            width: isMobile ? "160px" : "220px",
            height: isMobile ? "160px" : "220px",
            borderRadius: "999px",
            background: `radial-gradient(circle, ${hexToRgba(
              buttonColor,
              isHighlighted ? 0.18 : 0.10
            )} 0%, rgba(255,255,255,0) 72%)`,
            pointerEvents: "none"
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-90px",
            left: "-70px",
            width: isMobile ? "170px" : "230px",
            height: isMobile ? "170px" : "230px",
            borderRadius: "999px",
            background: `radial-gradient(circle, ${hexToRgba(
              backgroundColor,
              0.28
            )} 0%, rgba(255,255,255,0) 75%)`,
            pointerEvents: "none"
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginBottom: isMobile ? "16px" : "22px"
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              color: textColor,
              fontSize: isMobile ? "29px" : isTablet ? "33px" : "38px",
              lineHeight: 1.02,
              fontWeight: "900",
              letterSpacing: "-0.05em",
              wordBreak: "break-word"
            }}
          >
            {title}
          </h2>

          {description ? (
            <p
              style={{
                margin: "0 auto",
                color: softTextColor,
                fontSize: isMobile ? "13px" : "14px",
                lineHeight: 1.7,
                maxWidth: "360px",
                wordBreak: "break-word"
              }}
            >
              {description}
            </p>
          ) : null}
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginBottom: isMobile ? "18px" : "22px"
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: "7px",
              flexWrap: "wrap",
              color: textColor
            }}
          >
            <span
              style={{
                fontSize: isMobile ? "42px" : "54px",
                lineHeight: 0.95,
                fontWeight: "900",
                letterSpacing: "-0.06em"
              }}
            >
              {price}
            </span>

            <span
              style={{
                fontSize: isMobile ? "17px" : "20px",
                fontWeight: "900",
                marginBottom: isMobile ? "5px" : "7px",
                color: textColor
              }}
            >
              €
            </span>

            <span
              style={{
                fontSize: isMobile ? "12px" : "13px",
                color: softTextColor,
                fontWeight: "600",
                marginBottom: isMobile ? "6px" : "9px"
              }}
            >
              / pa TVSH
            </span>
          </div>
        </div>

        {hasContacts ? (
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "grid",
              gap: "11px",
              marginBottom: isMobile ? "18px" : "20px"
            }}
          >
            {hasPhone ? (
              <a
                href={`tel:${phone}`}
                style={contactLinkStyle(isMobile, softPanelColor, softBorderColor, textColor)}
              >
                <span style={phoneIconStyle}>📞</span>
                <span style={contactTextStyle}>{phone}</span>
              </a>
            ) : null}

            {hasWhatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                style={contactLinkStyle(isMobile, softPanelColor, softBorderColor, textColor)}
              >
                <span style={whatsappIconStyle}>🟢</span>
                <span style={contactTextStyle}>{whatsapp}</span>
              </a>
            ) : null}

            {hasMessenger ? (
              <a
                href={messenger}
                target="_blank"
                rel="noreferrer"
                style={contactLinkStyle(isMobile, softPanelColor, softBorderColor, textColor)}
              >
                <span style={messengerIconStyle}>✉</span>
                <span style={contactTextStyle}>Messenger</span>
              </a>
            ) : null}
          </div>
        ) : null}

        {registerHref ? (
          <a
            href={registerHref}
            target={registerTarget}
            rel={registerRel}
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              padding: isMobile ? "15px 16px" : "16px 18px",
              borderRadius: isMobile ? "16px" : "18px",
              display: "block",
              textAlign: "center",
              textDecoration: "none",
              border: `1px solid ${hexToRgba(buttonColor, 0.24)}`,
              background: `linear-gradient(135deg, ${buttonColor} 0%, ${hexToRgba(
                buttonColor,
                0.75
              )} 100%)`,
              color: buttonTextColor,
              fontWeight: "900",
              fontSize: isMobile ? "15px" : "16px",
              letterSpacing: "0.01em",
              boxShadow: `0 16px 34px ${hexToRgba(buttonColor, 0.22)}`,
              marginBottom: isMobile ? "18px" : "20px",
              boxSizing: "border-box"
            }}
          >
            Regjistrohu
          </a>
        ) : (
          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              padding: isMobile ? "15px 16px" : "16px 18px",
              borderRadius: isMobile ? "16px" : "18px",
              textAlign: "center",
              border: `1px solid ${softBorderColor}`,
              background: softPanelColor,
              color: softTextColor,
              fontWeight: "800",
              fontSize: isMobile ? "15px" : "16px",
              marginBottom: isMobile ? "18px" : "20px",
              boxSizing: "border-box"
            }}
          >
            Nuk ka kontakt aktiv
          </div>
        )}

        <div
          style={{
            position: "relative",
            zIndex: 2,
            borderTop: `1px solid ${softBorderColor}`,
            paddingTop: isMobile ? "16px" : "20px",
            display: "grid",
            gap: isMobile ? "13px" : "14px",
            textAlign: "left"
          }}
        >
          {hasFeatures ? (
            features.map((feature, idx) => {
              const included = Boolean(feature?.included);

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px"
                  }}
                >
                  <span
                    style={{
                      width: isMobile ? "22px" : "24px",
                      height: isMobile ? "22px" : "24px",
                      minWidth: isMobile ? "22px" : "24px",
                      borderRadius: "999px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: included
                        ? "rgba(16,185,129,0.12)"
                        : "rgba(239,68,68,0.12)",
                      color: included ? "#10b981" : "#ef4444",
                      fontWeight: "900",
                      fontSize: isMobile ? "12px" : "13px",
                      marginTop: "1px"
                    }}
                  >
                    {included ? "✓" : "✕"}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        color: textColor,
                        fontSize: isMobile ? "13.5px" : "14px",
                        lineHeight: 1.55,
                        fontWeight: included ? "800" : "700",
                        opacity: included ? 1 : 0.72,
                        wordBreak: "break-word"
                      }}
                    >
                      {feature?.text}
                    </div>

                    {feature?.note ? (
                      <div
                        style={{
                          marginTop: "4px",
                          fontSize: "12px",
                          color: softTextColor,
                          lineHeight: 1.55,
                          wordBreak: "break-word"
                        }}
                      >
                        {feature.note}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                color: softTextColor,
                fontSize: isMobile ? "13px" : "14px",
                textAlign: "center",
                paddingTop: "4px"
              }}
            >
              Nuk ka opsione të shtuara ende.
            </div>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: isMobile ? "23px" : "31px",
            boxShadow: `inset 0 0 0 1px ${cardBorderColor}`,
            pointerEvents: "none"
          }}
        />
      </div>
    </div>
  );
}

function contactLinkStyle(isMobile, background, border, color) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "12px",
    padding: isMobile ? "13px 14px" : "14px 15px",
    borderRadius: isMobile ? "15px" : "16px",
    background,
    border: `1px solid ${border}`,
    boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
    color,
    textDecoration: "none",
    fontWeight: "700",
    fontSize: isMobile ? "13px" : "14px",
    minHeight: isMobile ? "50px" : "52px",
    boxSizing: "border-box",
    width: "100%",
    overflow: "hidden",
    backdropFilter: "blur(8px)"
  };
}

const contactTextStyle = {
  wordBreak: "break-word",
  textAlign: "left",
  minWidth: 0,
  flex: 1
};

const phoneIconStyle = {
  width: "26px",
  height: "26px",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  fontSize: "13px",
  boxShadow: "inset 0 0 0 1px rgba(226,232,240,0.7)"
};

const whatsappIconStyle = {
  width: "26px",
  height: "26px",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "10px",
  fontWeight: 900,
  flexShrink: 0,
  boxShadow: "0 8px 18px rgba(34,197,94,0.25)"
};

const messengerIconStyle = {
  width: "26px",
  height: "26px",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 900,
  flexShrink: 0,
  boxShadow: "0 8px 18px rgba(37,99,235,0.22)"
};