const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function getVisitorId() {
  let visitorId = localStorage.getItem("visitor_id");

  if (!visitorId) {
    visitorId =
      "visitor_" +
      Math.random().toString(36).slice(2) +
      Date.now().toString(36);

    localStorage.setItem("visitor_id", visitorId);
  }

  return visitorId;
}

function getSessionId() {
  let sessionId = sessionStorage.getItem("session_id");

  if (!sessionId) {
    sessionId =
      "session_" +
      Math.random().toString(36).slice(2) +
      Date.now().toString(36);

    sessionStorage.setItem("session_id", sessionId);
  }

  return sessionId;
}

function getDeviceType() {
  const width = window.innerWidth;

  if (width <= 768) return "mobile";
  if (width <= 1024) return "tablet";
  return "desktop";
}

function getBrowser() {
  const ua = navigator.userAgent;

  if (ua.includes("Edg")) return "edge";
  if (ua.includes("Chrome")) return "chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "safari";
  if (ua.includes("Firefox")) return "firefox";

  return "unknown";
}

function getOS() {
  const ua = navigator.userAgent;

  if (ua.includes("Windows")) return "windows";
  if (ua.includes("Mac")) return "macos";
  if (ua.includes("Android")) return "android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "ios";
  if (ua.includes("Linux")) return "linux";

  return "unknown";
}

export async function trackEvent({
  event_type,
  page_url = window.location.pathname,
  element_name = null,
  category = null,
  post_id = null,
  ad_id = null,
  referrer = document.referrer || "direct",
  metadata = {}
}) {
  try {
    await fetch(`${API_BASE}/api/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event_type,
        page_url,
        element_name,
        category,
        post_id,
        ad_id,
        session_id: getSessionId(),
        visitor_id: getVisitorId(),
        referrer,
        device_type: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        metadata
      })
    });
  } catch (error) {
    console.error("Analytics tracking failed:", error);
  }
}