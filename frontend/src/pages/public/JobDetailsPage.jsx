import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";
import { getPostsByCategory } from "../../api/postApi";
import JobPostCard from "../../components/posts/JobPostCard";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

function decodeHtmlEntities(value = "") {
  if (typeof window === "undefined") return value;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function cleanDescription(value = "") {
  const decoded = decodeHtmlEntities(value || "");

  return decoded
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

function trackAnalyticsEvent(eventType, payload = {}) {
  const body = JSON.stringify({
    event_type: eventType,
    ...payload
  });

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(`${API_BASE}/api/analytics/track`, blob);
      return;
    }

    fetch(`${API_BASE}/api/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch((error) => {
      console.error("Analytics tracking error:", error);
    });
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
}

function pickFeaturedPosts(items = []) {
  const featured = items.filter((item) => item.featured);

  return (featured.length > 0 ? featured : items).sort(
    (a, b) =>
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
  );
}

function SidebarRotator({ title, posts, index, type }) {
  const visiblePosts = posts.slice(index, index + 3);
  if (!posts.length) return null;

  const isAuto = type === "auto";

  return (
    <div className="job-side-card">
      <h3>{title}</h3>

      <div className="job-side-list">
        {visiblePosts.map((item) => (
          <Link
            key={item.id}
            to={isAuto ? `/automjete/${item.id}` : `/patundshmeri/${item.id}`}
            className="job-side-link"
          >
            <div className="job-side-img-wrap">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title || "Shpallje"}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span>Pa foto</span>
              )}
            </div>

            <div className="job-side-info">
              <span className="job-side-badge">{isAuto ? "AUTO" : "PRONA"}</span>
              <strong>{item.title || "Shpallje"}</strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function JobDetailsPage() {
  const { slug } = useParams();

  const id = useMemo(() => {
    const match = String(slug || "").match(/(\d+)$/);
    return match ? String(match[1]) : "";
  }, [slug]);

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [relatedIndex, setRelatedIndex] = useState(0);

  const [realEstateFeatured, setRealEstateFeatured] = useState([]);
  const [vehicleFeatured, setVehicleFeatured] = useState([]);
  const [realEstateIndex, setRealEstateIndex] = useState(0);
  const [vehicleIndex, setVehicleIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setPost(null);
      setLoading(false);
      return;
    }

    let ignore = false;

    async function loadData() {
      try {
        setLoading(true);

        const [allJobs, allRealEstate, allVehicles] = await Promise.all([
          getPostsByCategory("konkurse-pune"),
          getPostsByCategory("patundshmeri"),
          getPostsByCategory("automjete")
        ]);

        if (ignore) return;

        const jobs = Array.isArray(allJobs) ? allJobs : [];

        const singlePost = jobs.find((item) => String(item.id) === String(id));

        setPost(singlePost || null);

        setRelatedPosts(
          jobs
            .filter((item) => String(item.id) !== String(id))
            .sort(
              (a, b) =>
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime()
            )
        );

        setRealEstateFeatured(pickFeaturedPosts(allRealEstate || []));
        setVehicleFeatured(pickFeaturedPosts(allVehicles || []));
        setRelatedIndex(0);
        setRealEstateIndex(0);
        setVehicleIndex(0);
      } catch (error) {
        console.error("Gabim gjatë marrjes së konkursit:", error);
        if (!ignore) setPost(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [id]);

  const formattedDate = useMemo(() => {
    if (!post?.created_at) return "";
    return new Date(post.created_at).toLocaleDateString("sq-AL");
  }, [post]);

  const postTitle = post?.title || post?.name || "Konkurs pune";
  const companyName = post?.company_name || post?.client_name || "Publiko";
  const jobCategory = post?.job_category || "-";
  const jobLocation = post?.job_location || "-";
  const positionsCount = post?.positions_count || "-";
  const extraLinkText = post?.link_text || post?.extra_link_text || "";
  const extraLinkUrl = post?.link_url || post?.extra_link_url || "";

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const descriptionHtml = useMemo(() => {
    return cleanDescription(post?.description || "");
  }, [post?.description]);

  useEffect(() => {
    if (!post?.id) return;

    trackAnalyticsEvent("post_view", {
      post_id: post.id,
      page_url: currentUrl
    });
  }, [post?.id, currentUrl]);

  useEffect(() => {
  const startTime = Date.now();

  return () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);

    trackAnalyticsEvent("time_on_page", {
      post_id: post?.id || id,
      page_url: currentUrl,
      duration_seconds: duration
    });
  };
}, [post?.id, id, currentUrl]);

  const relatedVisibleCount = 3;
  const relatedMaxIndex = Math.max(relatedPosts.length - relatedVisibleCount, 0);

  useEffect(() => {
    if (relatedPosts.length <= relatedVisibleCount) return;

    const interval = setInterval(() => {
      setRelatedIndex((prev) => (prev >= relatedMaxIndex ? 0 : prev + 1));
    }, 3800);

    return () => clearInterval(interval);
  }, [relatedPosts.length, relatedMaxIndex]);

  useEffect(() => {
    if (realEstateFeatured.length <= 3) return;

    const maxIndex = Math.max(realEstateFeatured.length - 3, 0);
    const interval = setInterval(() => {
      setRealEstateIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4300);

    return () => clearInterval(interval);
  }, [realEstateFeatured.length]);

  useEffect(() => {
    if (vehicleFeatured.length <= 3) return;

    const maxIndex = Math.max(vehicleFeatured.length - 3, 0);
    const interval = setInterval(() => {
      setVehicleIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4600);

    return () => clearInterval(interval);
  }, [vehicleFeatured.length]);

  const handleCopyLink = async () => {
    try {
      trackAnalyticsEvent("post_click", {
        post_id: post?.id || id,
        page_url: currentUrl
      });
      await navigator.clipboard.writeText(currentUrl);
      alert("Linku u kopjua me sukses.");
    } catch {
      alert("Nuk u kopjua linku.");
    }
  };

  const goPrevRelated = () => {
    setRelatedIndex((prev) => (prev <= 0 ? relatedMaxIndex : prev - 1));
  };

  const goNextRelated = () => {
    setRelatedIndex((prev) => (prev >= relatedMaxIndex ? 0 : prev + 1));
  };

  const handleExternalLinkClick = () => {
    trackAnalyticsEvent("post_click", {
      post_id: post?.id || id,
      page_url: currentUrl
    });
  };

  const handleShareClick = (type) => {
    const eventType =
      type === "WhatsApp"
        ? "whatsapp_click"
        : type === "Email"
        ? "email_click"
        : "post_click";

    trackAnalyticsEvent(eventType, {
      post_id: post?.id || id,
      page_url: currentUrl
    });
  };

  return (
    <div className="job-page">
      <style>{`
        .job-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 7% 0%, rgba(37,99,235,.10), transparent 30%),
            radial-gradient(circle at 94% 4%, rgba(14,165,233,.08), transparent 28%),
            linear-gradient(180deg, #f8fbff 0%, #eef6ff 46%, #f8fafc 100%);
          color:#07132b;
        }

        .job-main {
          width:min(100%, 1700px);
          margin: 0 auto;
          padding: 108px 22px 74px;
        }

        .job-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 20px;
          align-items: start;
        }

        .job-content {
          display: grid;
          gap: 14px;
          min-width: 0;
        }

        .job-card,
        .job-side-card,
        .job-state-card {
          position:relative;
          background:
            radial-gradient(circle at 96% 0%, rgba(37,99,235,.045), transparent 28%),
            rgba(255,255,255,.97);
          border: 1px solid rgba(191,219,254,.78);
          box-shadow:
            0 18px 44px rgba(15,23,42,.065),
            inset 0 1px 0 rgba(255,255,255,.9);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .job-card {
          border-radius: 24px;
          overflow:hidden;
        }

        .job-card::before,
        .job-side-card::before{
          content:"";
          position:absolute;
          left:18px;
          right:18px;
          top:0;
          height:1px;
          background:linear-gradient(90deg, transparent, rgba(37,99,235,.35), transparent);
          pointer-events:none;
        }

        .job-hero {
          padding: 22px;
          background:
            radial-gradient(circle at 0% 0%, rgba(37,99,235,.12), transparent 34%),
            radial-gradient(circle at 100% 14%, rgba(14,165,233,.10), transparent 30%),
            linear-gradient(135deg, rgba(255,255,255,.99), rgba(248,251,255,.94));
        }

        .job-hero-grid {
          display: grid;
          grid-template-columns: 242px minmax(0, 1fr);
          gap: 20px;
          align-items: center;
        }

        .job-logo-box {
          position:relative;
          background: #fff;
          border: 1px solid rgba(191,219,254,.88);
          border-radius: 20px;
          overflow: hidden;
          min-height: 198px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:0 14px 30px rgba(15,23,42,.055);
        }

        .job-logo-box img {
          width: 100%;
          height: 208px;
          object-fit: contain;
          display: block;
          background: #fff;
          padding: 14px;
          box-sizing: border-box;
        }

        .job-badge {
          display: inline-flex;
          align-items:center;
          gap:7px;
          width: fit-content;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 950;
          background: linear-gradient(135deg,#eff6ff,#dbeafe);
          color: #1d4ed8;
          margin-bottom: 11px;
          text-transform: uppercase;
          letter-spacing: .065em;
          border:1px solid rgba(191,219,254,.9);
          box-shadow:0 10px 22px rgba(37,99,235,.10);
        }

        .job-badge::before{
          content:"";
          width:7px;
          height:7px;
          border-radius:999px;
          background:#2563eb;
          box-shadow:0 0 0 4px rgba(37,99,235,.12);
        }

        .job-detail-title {
          display: block;
          margin: 0 0 12px;
          font-size: clamp(30px, 3.2vw, 46px);
          line-height: .98;
          color: #07132b;
          word-break: break-word;
          letter-spacing: -.06em;
          font-weight: 950;
          min-height: 42px;
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 12px;
          color: #475569;
          font-size: 12.5px;
          font-weight: 800;
        }

        .job-meta div{
          min-height:32px;
          display:inline-flex;
          align-items:center;
          padding:0 11px;
          border-radius:999px;
          background:rgba(255,255,255,.82);
          border:1px solid rgba(219,234,254,.82);
        }

        .job-meta strong {
          color: #0f172a;
          font-weight: 950;
          margin-right:4px;
        }

        .job-info-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .job-info-card {
          overflow: hidden;
          padding: 14px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(255,255,255,.99), rgba(248,251,255,.96));
          border: 1px solid rgba(191,219,254,.78);
          box-shadow: 0 12px 28px rgba(15,23,42,.045);
        }

        .job-info-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .job-info-icon {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 14px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 0 1px rgba(37,99,235,.12);
        }

        .job-info-icon svg {
          width: 18px;
          height: 18px;
          display: block;
        }

        .job-info-text {
          min-width: 0;
        }

        .job-info-label {
          color: #64748b;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: .05em;
        }

        .job-info-value {
          color: #07132b;
          font-weight: 950;
          margin-top: 4px;
          font-size: 13px;
          line-height: 1.25;
          word-break: break-word;
        }

        .job-description-card {
          padding: 28px;
        }

        .job-section-title {
          color: #07132b;
          font-weight: 950;
          font-size: 24px;
          margin: 0 0 16px;
          letter-spacing: -.04em;
        }

        .job-description-content {
          color: #1f2f46;
          font-size: 15px;
          line-height: 1.82;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .job-description-content p {
          margin: 0 0 14px;
        }

        .job-description-content strong,
        .job-description-content b {
          color: #07132b;
          font-weight: 950;
        }

        .job-description-content ul,
        .job-description-content ol {
          margin: 12px 0 17px 20px;
          padding: 0;
        }

        .job-description-content li {
          margin: 7px 0;
          padding-left: 4px;
        }

        .job-description-content h1,
        .job-description-content h2,
        .job-description-content h3 {
          color: #07132b;
          margin: 20px 0 10px;
          line-height: 1.2;
        }

        .job-description-content a {
          color: #2563eb;
          font-weight: 850;
          text-decoration: none;
        }

        .job-extra-link,
        .job-share-card {
          padding: 17px;
        }

        .job-extra-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 13px;
          flex-wrap: wrap;
        }

        .job-extra-title,
        .job-share-title {
          font-size: 15px;
          font-weight: 950;
          color: #0f172a;
          margin-bottom: 5px;
        }

        .job-extra-url {
          color: #64748b;
          font-size: 12.5px;
          font-weight: 750;
          word-break: break-all;
        }

        .job-primary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 11px 18px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #0284c7);
          color: #fff;
          text-decoration: none;
          font-weight: 950;
          font-size: 12.5px;
          border: 0;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(37,99,235,.20);
        }

        .job-share-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .job-share-btn {
          flex: 1 1 120px;
          min-width: 118px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 11px 13px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
          font-size: 12.5px;
          border: 1px solid rgba(191,219,254,.85);
          background: #fff;
          color: #1d4ed8;
          cursor: pointer;
          box-shadow:0 10px 22px rgba(37,99,235,.07);
        }

        .job-related-card {
          padding: 17px;
          overflow: hidden;
          border-radius: 24px;
        }

        .job-related-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 13px;
        }

        .job-related-head h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 950;
          color: #07132b;
          letter-spacing: -.04em;
        }

        .job-slider-buttons {
          display: flex;
          gap: 7px;
          flex-shrink: 0;
        }

        .job-slide-btn {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid rgba(191,219,254,.95);
          background: #fff;
          color: #1d4ed8;
          cursor: pointer;
          font-weight: 950;
          box-shadow:0 8px 18px rgba(37,99,235,.08);
        }

        .job-slide-btn.dark {
          background: linear-gradient(135deg,#2563eb,#0284c7);
          color: #fff;
          border-color:rgba(125,211,252,.75);
        }

        .job-slider-window {
          overflow: hidden;
          width: 100%;
        }

        .job-slider-track {
          display: flex;
          gap: 12px;
          transition: transform .45s cubic-bezier(.22,1,.36,1);
          will-change: transform;
        }

        .job-slide-item {
          flex: 0 0 calc((100% - 24px) / 3);
          min-width: 0;
        }

        .job-dots {
          margin-top: 13px;
          display: flex;
          justify-content: center;
          gap: 6px;
        }

        .job-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          border: none;
          background: #cbd5e1;
          cursor: pointer;
          transition: .18s ease;
        }

        .job-dot.active {
          width: 20px;
          background: #2563eb;
        }

        .job-aside {
          display: grid;
          gap: 13px;
          align-self: start;
          position: sticky;
          top: 100px;
        }

        .job-side-card {
          border-radius: 22px;
          padding: 14px;
          overflow: hidden;
        }

        .job-side-card h3 {
          margin: 0 0 11px;
          font-size: 15.5px;
          color: #07132b;
          font-weight: 950;
          letter-spacing: -.03em;
        }

        .job-side-list {
          display: grid;
          gap: 8px;
        }

        .job-side-link {
          display: grid;
          grid-template-columns: 72px minmax(0, 1fr);
          gap: 9px;
          align-items: center;
          border: 1px solid rgba(219,234,254,.86);
          border-radius: 15px;
          overflow: hidden;
          background: #fff;
          text-decoration: none;
          min-height: 66px;
          transition: .16s ease;
          box-shadow:0 8px 18px rgba(15,23,42,.035);
        }

        .job-side-link:hover {
          border-color: #60a5fa;
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(37,99,235,.10);
        }

        .job-side-img-wrap {
          width: 72px;
          height: 66px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 9.5px;
          font-weight: 800;
        }

        .job-side-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .job-side-info {
          padding: 6px 9px 6px 0;
          min-width: 0;
        }

        .job-side-badge {
          display: inline-flex;
          padding: 3px 7px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 8px;
          font-weight: 950;
          margin-bottom: 5px;
          border-radius: 999px;
        }

        .job-side-info strong {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 11.5px;
          font-weight: 950;
          color: #0f172a;
          line-height: 1.22;
          overflow: hidden;
        }

        .job-detail-list {
          display: grid;
        }

        .job-detail-row {
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .job-detail-row:first-child {
          padding-top: 0;
        }

        .job-detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .job-detail-label {
          color: #64748b;
          font-size: 11.5px;
          margin-bottom: 4px;
          font-weight: 800;
        }

        .job-detail-value {
          color: #0f172a;
          font-weight: 950;
          font-size: 13px;
          line-height: 1.35;
        }

        .job-state-card {
          border-radius: 22px;
          padding: 24px;
          color: #0f172a;
          font-weight: 850;
        }

        @media (max-width: 1100px) {
          .job-main {
            padding: 96px 16px 58px;
          }

          .job-layout {
            grid-template-columns: 1fr;
          }

          .job-aside {
            position: static;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .job-aside .job-side-card:first-child {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .job-main {
            padding: 80px 8px 44px;
          }

          .job-layout,
          .job-content {
            gap: 11px;
          }

          .job-card {
            border-radius: 18px;
          }

          .job-hero {
            padding: 12px;
          }

          .job-hero-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .job-logo-box {
            border-radius: 15px;
            min-height: 145px;
          }

          .job-logo-box img {
            height: 165px;
            padding: 12px;
          }

          .job-badge {
            font-size: 9px;
            padding: 6px 9px;
            margin-bottom: 8px;
          }

          .job-detail-title {
            font-size: 24px;
            line-height: 1.05;
            letter-spacing: -.045em;
            min-height: 28px;
          }

          .job-meta {
            font-size: 11px;
            gap: 6px;
          }

          .job-meta div{
            min-height:29px;
            padding:0 9px;
          }

          .job-info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px;
          }

          .job-info-card {
            padding: 9px;
            border-radius: 14px;
          }

          .job-info-inner {
            gap: 7px;
          }

          .job-info-icon {
            width: 30px;
            height: 30px;
            min-width: 30px;
            border-radius: 10px;
          }

          .job-info-icon svg {
            width: 15px;
            height: 15px;
          }

          .job-info-label {
            font-size: 9px;
          }

          .job-info-value {
            font-size: 11px;
            line-height: 1.2;
          }

          .job-description-card {
            padding: 16px 12px;
          }

          .job-section-title {
            font-size: 18px;
            margin-bottom: 12px;
          }

          .job-description-content {
            font-size: 13.5px;
            line-height: 1.72;
          }

          .job-extra-link,
          .job-share-card {
            padding: 13px 11px;
          }

          .job-share-btn {
            flex: 1 1 calc(50% - 8px);
            min-width: 0;
            padding: 10px 9px;
            font-size: 11.5px;
            border-radius: 999px;
          }

          .job-related-card {
            padding: 10px;
            border-radius: 18px;
          }

          .job-related-head {
            margin-bottom: 10px;
          }

          .job-related-head h2 {
            font-size: 16px;
            line-height: 1.15;
          }

          .job-slide-btn {
            width: 29px;
            height: 29px;
            font-size: 13px;
          }

          .job-slider-track {
            gap: 8px;
          }

          .job-slide-item {
            flex: 0 0 calc((100% - 8px) / 2);
          }

          .job-dots {
            margin-top: 10px;
          }

          .job-dot {
            width: 6px;
            height: 6px;
          }

          .job-dot.active {
            width: 18px;
          }

          .job-aside {
            display: grid;
            position: static;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .job-side-card {
            border-radius: 18px;
            padding: 10px;
          }

          .job-side-card h3 {
            font-size: 14px;
            margin-bottom: 9px;
          }

          .job-side-link {
            grid-template-columns: 64px minmax(0, 1fr);
            min-height: 59px;
            border-radius: 13px;
          }

          .job-side-img-wrap {
            width: 64px;
            height: 59px;
          }

          .job-side-info strong {
            font-size: 10.8px;
            line-height: 1.2;
          }

          .job-side-badge {
            font-size: 7.5px;
            padding: 2px 5px;
          }
        }

        @media (max-width: 390px) {
          .job-main {
            padding-left: 5px;
            padding-right: 5px;
          }

          .job-detail-title {
            font-size: 22px;
          }

          .job-related-head h2 {
            font-size: 15px;
          }

          .job-slide-btn {
            width: 28px;
            height: 28px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .job-slider-track,
          .job-side-link,
          .job-dot {
            transition: none;
          }

          .job-side-link:hover {
            transform: none;
          }
        }
      `}</style>

      <PublicHeader />

      <main className="job-main">
        {loading ? (
          <div className="job-state-card">Duke u ngarkuar...</div>
        ) : !post ? (
          <div className="job-state-card">Nuk u gjet konkursi.</div>
        ) : (
          <div className="job-layout">
            <section className="job-content">
              <div className="job-card job-hero">
                <div className="job-hero-grid">
                  {post.image_url && (
                    <div className="job-logo-box">
                      <img
                        src={post.image_url}
                        alt={postTitle}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                      />
                    </div>
                  )}

                  <div>
                    <div className="job-badge">Konkurs Pune</div>

                    <h1 className="job-detail-title">{postTitle}</h1>

                    <div className="job-meta">
                      {formattedDate && (
                        <div>
                          <strong>Publikuar:</strong> {formattedDate}
                        </div>
                      )}

                      <div>
                        <strong>Kategoria:</strong> Konkurse Pune
                      </div>

                      <div>
                        <strong>Kompania:</strong> {companyName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="job-info-grid">
                {[
                  [
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-7h6v7M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>,
                    "Kompani",
                    companyName
                  ],
                  [
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 7a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>,
                    "Kategori",
                    jobCategory
                  ],
                  [
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 10.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>,
                    "Lokacioni",
                    jobLocation
                  ],
                  [
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 21v-2a4 4 0 0 0-3-3.87M17 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>,
                    "Pozita",
                    positionsCount
                  ]
                ].map(([icon, label, value]) => (
                  <div className="job-info-card" key={label}>
                    <div className="job-info-inner">
                      <div className="job-info-icon">{icon}</div>
                      <div className="job-info-text">
                        <div className="job-info-label">{label}</div>
                        <div className="job-info-value">{value || "-"}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <article className="job-card job-description-card">
                <h2 className="job-section-title">Përshkrimi i konkursit</h2>
                <div
                  className="job-description-content"
                  dangerouslySetInnerHTML={{
                    __html: descriptionHtml || "Nuk ka përshkrim."
                  }}
                />
              </article>

              {extraLinkUrl && (
                <div className="job-card job-extra-link">
                  <div>
                    <div className="job-extra-title">Link i jashtëm</div>
                    <div className="job-extra-url">{extraLinkUrl}</div>
                  </div>

                  <a
                    href={extraLinkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="job-primary-btn"
                    onClick={handleExternalLinkClick}
                  >
                    {extraLinkText || "Hape linkun"}
                  </a>
                </div>
              )}

              <div className="job-card job-share-card">
                <div className="job-share-title">Shpërndaje shpalljen</div>

                <div className="job-share-grid">
                  {[
                    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`],
                    ["WhatsApp", `https://wa.me/?text=${encodeURIComponent(currentUrl)}`],
                    ["Email", `mailto:?subject=${encodeURIComponent(postTitle)}&body=${encodeURIComponent(currentUrl)}`]
                  ].map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      target={label === "Email" ? undefined : "_blank"}
                      rel={label === "Email" ? undefined : "noreferrer"}
                      className="job-share-btn"
                      onClick={() => handleShareClick(label)}
                    >
                      {label}
                    </a>
                  ))}

                  <button type="button" onClick={handleCopyLink} className="job-share-btn">
                    Kopjo linkun
                  </button>
                </div>
              </div>

              {relatedPosts.length > 0 && (
                <div className="job-card job-related-card">
                  <div className="job-related-head">
                    <h2>Shpallje të ngjashme</h2>

                    {relatedPosts.length > relatedVisibleCount && (
                      <div className="job-slider-buttons">
                        <button type="button" onClick={goPrevRelated} className="job-slide-btn">‹</button>
                        <button type="button" onClick={goNextRelated} className="job-slide-btn dark">›</button>
                      </div>
                    )}
                  </div>

                  <div className="job-slider-window">
                    <div
                      className="job-slider-track"
                      style={{
                        transform:
                          typeof window !== "undefined" && window.innerWidth <= 768
                            ? `translateX(calc(-${relatedIndex} * ((100% - 8px) / 2 + 8px)))`
                            : `translateX(calc(-${relatedIndex} * ((100% - 24px) / 3 + 12px)))`
                      }}
                    >
                      {relatedPosts.map((item) => (
                        <div className="job-slide-item" key={item.id}>
                          <JobPostCard post={item} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {relatedPosts.length > relatedVisibleCount && (
                    <div className="job-dots">
                      {Array.from({ length: relatedMaxIndex + 1 }).map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setRelatedIndex(index)}
                          aria-label={`Shko te slide ${index + 1}`}
                          className={`job-dot ${relatedIndex === index ? "active" : ""}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            <aside className="job-aside">
              <div className="job-side-card">
                <h3>Detajet e konkursit</h3>

                <div className="job-detail-list">
                  {[
                    ["Data e publikimit", formattedDate || "-"],
                    ["Lloji", "Konkurs pune"],
                    ["Kompania", companyName]
                  ].map(([label, value]) => (
                    <div className="job-detail-row" key={label}>
                      <div className="job-detail-label">{label}</div>
                      <div className="job-detail-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <SidebarRotator title="Patundshmëri të veçuara" posts={realEstateFeatured} index={realEstateIndex} type="realestate" />
              <SidebarRotator title="Automjete të veçuara" posts={vehicleFeatured} index={vehicleIndex} type="auto" />
            </aside>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}