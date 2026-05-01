import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PublicHeader from "../../../components/layout/PublicHeader";
import PublicFooter from "../../../components/layout/PublicFooter";
import NewsCard from "../../../components/news/NewsCard";
import AdSlot from "../../../components/ads/AdSlot";
import { trackEvent } from "../../../utils/analytics";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const HERO_VIDEO_URL =
  "https://res.cloudinary.com/dbz7fjuty/video/upload/v1777163867/0002-video_ofxnmp.mp4";

const categoryConfig = {
  vendi: {
    title: "Vendi",
    eyebrow: "Lajme Kombëtare",
    description:
      "Ngjarjet më të rëndësishme nga vendi, të organizuara qartë dhe me paraqitje editoriale moderne."
  },
  rajoni: {
    title: "Rajoni",
    eyebrow: "Lajme Rajonale",
    description:
      "Zhvillimet kryesore nga rajoni, me përmbajtje të kuruar dhe paraqitje të pastër profesionale."
  },
  bota: {
    title: "Bota",
    eyebrow: "Lajme Ndërkombëtare",
    description:
      "Historitë dhe zhvillimet më të rëndësishme nga bota, në një faqe moderne dhe serioze lajmesh."
  }
};

const portalSections = [
  {
    title: "Patundshmëri",
    category: "patundshmeri",
    link: "/kategori/patundshmeri",
    badge: "Prona"
  },
  {
    title: "Automjete",
    category: "automjete",
    link: "/kategori/automjete",
    badge: "Auto"
  },
  {
    title: "Konkurse pune",
    category: "konkurse-pune",
    link: "/kategori/konkurse-pune",
    badge: "Punë"
  }
];

function stripHtml(html = "") {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function getPostImage(post) {
  if (Array.isArray(post?.gallery_images) && post.gallery_images.length > 0) {
    return post.gallery_images[0];
  }

  if (typeof post?.gallery_images === "string") {
    try {
      const parsed = JSON.parse(post.gallery_images);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {
      return post?.image_url || "";
    }
  }

  return post?.image_url || "";
}

function getPostText(post) {
  return stripHtml(post?.excerpt || post?.description || "").slice(0, 105);
}

function getPostPrice(post) {
  if (!post?.price) return "";
  return `${Number(post.price).toLocaleString("de-DE")} €`;
}

function getPostLink(post) {
  if (post.category === "patundshmeri") return `/patundshmeri/${post.id}`;
  if (post.category === "automjete") return `/automjete/${post.id}`;
  if (post.category === "konkurse-pune") return `/konkurse-pune/${post.id}`;
  return `/kategori/${post.category}`;
}

function InlineSponsoredCard() {
  return (
    <div className="category-inline-ad">
      <AdSlot placement="news_inline_1" />
    </div>
  );
}

function PortalMiniCard({ post, badge }) {
  const image = getPostImage(post);
  const text = getPostText(post);
  const price = getPostPrice(post);

  return (
    <Link to={getPostLink(post)} className="portal-mini-card">
      <div className="portal-mini-media">
        {image ? (
          <img src={image} alt={post.title || "Postim"} loading="lazy" />
        ) : (
          <div className="portal-mini-placeholder" />
        )}
      </div>

      <div className="portal-mini-body">
        <span>{badge}</span>
        <h4>{post.title}</h4>

        {text && <p>{text}...</p>}

        {price && <strong>{price}</strong>}
      </div>
    </Link>
  );
}

export default function NewsCategoryPage() {
  const { category } = useParams();

  const [allPosts, setAllPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  trackEvent({
    event_type: "page_view",
    page_url: window.location.pathname,
    category: category || "lajme"
  });
}, [category]);

useEffect(() => {
  const startTime = Date.now();

  return () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);

    trackEvent({
      event_type: "time_on_page",
      duration_seconds: duration,
      page_url: window.location.pathname,
      category: category || "lajme"
    });
  };
}, [category]);

  const config = categoryConfig[category] || {
    title: "Lajme",
    eyebrow: "Kategori",
    description: "Përmbajtje editoriale e organizuar sipas kategorive."
  };

  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];

        const activePosts = safeData.filter((item) => item.is_active !== false);

        const filtered = activePosts
          .filter((item) => item.category === category)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setAllPosts(activePosts);
        setPosts(filtered);
      })
      .catch((err) => {
        console.error("Gabim gjatë marrjes së lajmeve:", err);
        setAllPosts([]);
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  const sortedFeaturedPosts = useMemo(() => {
    return posts
      .filter((post) => post.featured)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [posts]);

  const selectedTopPosts = useMemo(() => {
    if (sortedFeaturedPosts.length > 0) {
      return sortedFeaturedPosts.slice(0, 4);
    }

    return posts.slice(0, 4);
  }, [posts, sortedFeaturedPosts]);

  const heroPost = useMemo(() => selectedTopPosts[0] || null, [selectedTopPosts]);

  const sidePosts = useMemo(
    () => selectedTopPosts.slice(1, 4),
    [selectedTopPosts]
  );

  const gridPosts = useMemo(() => {
    const selectedIds = new Set(selectedTopPosts.map((item) => item.id));
    return posts.filter((item) => !selectedIds.has(item.id));
  }, [posts, selectedTopPosts]);

  const gridWithInlineAd = useMemo(() => {
    if (!gridPosts.length) return [];

    const items = [...gridPosts];
    const insertIndex = Math.min(4, items.length);

    items.splice(insertIndex, 0, {
      __type: "ad-inline",
      id: "news-inline-ad"
    });

    return items;
  }, [gridPosts]);

  const portalPostsByCategory = useMemo(() => {
    return portalSections.reduce((acc, section) => {
      const categoryPosts = allPosts
        .filter((item) => item.category === section.category)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const featured = categoryPosts.filter((item) => item.featured);

      acc[section.category] =
        featured.length > 0 ? featured.slice(0, 4) : categoryPosts.slice(0, 4);

      return acc;
    }, {});
  }, [allPosts]);

  return (
    <div className="news-category-page">
      <PublicHeader />

      <main className="news-category-main">
        <section className="category-hero">
          <video
            className="category-hero-video"
            src={HERO_VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="category-hero-overlay" />

          <div className="category-hero-content">
            <span>{config.eyebrow}</span>
            <h1>{config.title}</h1>
            <p>{config.description}</p>
          </div>
        </section>

        <div className="category-ad-wrap">
          <AdSlot placement="news_top_banner" />
        </div>

        {loading ? (
          <div className="category-state">Duke ngarkuar lajmet...</div>
        ) : posts.length === 0 ? (
          <div className="category-state">Nuk ka lajme në këtë kategori.</div>
        ) : (
          <>
            <section className="category-lead-layout">
              {heroPost && (
                <div className="category-lead-main">
                  <NewsCard post={heroPost} variant="large" />
                </div>
              )}

              {sidePosts.length > 0 && (
                <aside className="category-lead-side">
                  <div className="side-title">
                    {sortedFeaturedPosts.length > 0 ? "Të zgjedhura" : "Më të rejat"}
                  </div>

                  {sidePosts.map((post) => (
                    <NewsCard key={post.id} post={post} variant="default" />
                  ))}
                </aside>
              )}
            </section>

            {gridWithInlineAd.length > 0 && (
              <section className="category-grid-section">
                <div className="category-section-head">
                  <div className="section-line" />

                  <div>
                    <h2>Lajmet e fundit</h2>
                    <p>Publikimet më të reja në kategorinë {config.title}.</p>
                  </div>
                </div>

                <div className="news-category-grid">
                  {gridWithInlineAd.map((item, index) => {
                    if (item.__type === "ad-inline") {
                      return (
                        <InlineSponsoredCard
                          key={item.id || `inline-ad-${index}`}
                        />
                      );
                    }

                    return (
                      <NewsCard key={item.id} post={item} variant="default" />
                    );
                  })}
                </div>
              </section>
            )}

            <section className="portal-extra-section">
              <div className="portal-extra-head">
                <div className="section-line" />

                <div>
                  <h2>Shiko edhe shpalljet e fundit</h2>
                 
                </div>
              </div>

              <div className="portal-extra-grid">
                {portalSections.map((section) => {
                  const items = portalPostsByCategory[section.category] || [];

                  return (
                    <div key={section.category} className="portal-extra-box">
                      <div className="portal-extra-box-head">
                        <div>
                          <span>{section.badge}</span>
                          <h3>{section.title}</h3>
                        </div>
<Link
  to={section.link}
  onClick={() =>
    trackEvent({
      event_type: "category_click",
      category: section.category,
      page_url: window.location.pathname,
      element_name: "portal_extra_view_all"
    })
  }
>
  Shiko të gjitha →
</Link>
                        <Link to={section.link}>Shiko të gjitha →</Link>
                      </div>

                      {items.length > 0 ? (
                        <div className="portal-mini-list">
                          {items.map((item) => (
                            <PortalMiniCard
                              key={item.id}
                              post={item}
                              badge={section.badge}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="portal-empty">
                          Ende nuk ka postime në këtë kategori.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>

      <PublicFooter />

      <style>{`
        .news-category-page{
          min-height:100vh;
          background:
            radial-gradient(circle at top left, rgba(37,99,235,.08), transparent 30%),
            linear-gradient(180deg,#ffffff 0%,#f8fafc 48%,#ffffff 100%);
          color:#0f172a;
        }

        .news-category-main{
          width:min(100%,2100px);
          margin:0 auto;
          padding:112px clamp(12px,2vw,28px) 76px;
        }

        .category-hero{
          position:relative;
          overflow:hidden;
          min-height:340px;
          display:flex;
          align-items:flex-end;
          padding:46px;
          margin-bottom:24px;
          background:#020617;
          border:1px solid rgba(219,234,254,.9);
          box-shadow:0 24px 70px rgba(15,23,42,.14);
          isolation:isolate;
        }

        .category-hero-video{
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          transform:scale(1.04);
          z-index:-3;
        }

        .category-hero-overlay{
          position:absolute;
          inset:0;
          background:
            linear-gradient(90deg, rgba(2,6,23,.90), rgba(2,6,23,.52), rgba(2,6,23,.12)),
            linear-gradient(180deg, rgba(2,6,23,.10), rgba(2,6,23,.72));
          z-index:-1;
        }

        .category-hero-content{
          max-width:920px;
          color:#fff;
          position:relative;
          z-index:2;
        }

        .category-hero-content span{
          display:inline-flex;
          padding:8px 13px;
          border-radius:999px;
          background:rgba(255,255,255,.14);
          border:1px solid rgba(255,255,255,.22);
          backdrop-filter:blur(12px);
          font-size:12px;
          font-weight:950;
          letter-spacing:.08em;
          text-transform:uppercase;
          margin-bottom:16px;
        }

        .category-hero-content h1{
          margin:0;
          font-size:clamp(46px,6vw,92px);
          line-height:.88;
          font-weight:950;
          letter-spacing:-.07em;
          text-shadow:0 10px 34px rgba(0,0,0,.36);
        }

        .category-hero-content p{
          max-width:760px;
          margin:20px 0 0;
          color:rgba(255,255,255,.92);
          font-size:18px;
          line-height:1.7;
          font-weight:650;
        }

        .category-ad-wrap{
          max-width:1320px;
          margin:0 auto 34px;
        }

        .category-state{
          background:#fff;
          border:1px solid rgba(15,23,42,.08);
          padding:46px 24px;
          text-align:center;
          color:#64748b;
          font-weight:850;
        }

        .category-lead-layout{
          display:grid;
          grid-template-columns:minmax(0,1.35fr) minmax(360px,.65fr);
          gap:20px;
          align-items:stretch;
          margin-bottom:44px;
        }

        .category-lead-main,
        .category-lead-side{
          min-width:0;
        }

        .category-lead-side{
          display:grid;
          gap:18px;
          align-content:start;
        }

        .side-title{
          display:flex;
          align-items:center;
          gap:10px;
          font-size:15px;
          font-weight:950;
          color:#0f172a;
          letter-spacing:-.02em;
          padding:0 0 2px;
        }

        .side-title::before{
          content:"";
          width:4px;
          height:24px;
          background:linear-gradient(180deg,#0f172a,#334155);
          display:block;
        }

        .category-grid-section{
          margin-top:8px;
        }

        .category-section-head,
        .portal-extra-head{
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:20px;
        }

        .section-line{
          width:4px;
          height:42px;
          background:linear-gradient(180deg,#0f172a,#334155);
          flex:0 0 auto;
        }

        .category-section-head h2,
        .portal-extra-head h2{
          margin:0;
          font-size:34px;
          line-height:1.05;
          font-weight:950;
          letter-spacing:-.045em;
          color:#0f172a;
        }

        .category-section-head p,
        .portal-extra-head p{
          margin:5px 0 0;
          color:#64748b;
          font-size:14px;
          font-weight:700;
        }

        .news-category-grid{
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:20px;
          align-items:stretch;
        }

        .category-inline-ad{
          min-width:0;
          align-self:stretch;
          display:flex;
          align-items:stretch;
        }

        .category-inline-ad > *{
          width:100%;
        }

        .portal-extra-section{
          margin-top:56px;
          padding-top:34px;
          border-top:1px solid #dbe3ea;
        }

        .portal-extra-grid{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:18px;
        }

        .portal-extra-box{
          background:#fff;
          border:1px solid #dbe3ea;
          padding:18px;
          min-width:0;
        }

        .portal-extra-box-head{
          display:flex;
          justify-content:space-between;
          gap:14px;
          align-items:flex-start;
          margin-bottom:16px;
        }

        .portal-extra-box-head span{
          display:inline-flex;
          padding:6px 9px;
          background:#eff6ff;
          color:#2563eb;
          font-size:11px;
          font-weight:950;
          text-transform:uppercase;
          letter-spacing:.06em;
          margin-bottom:9px;
        }

        .portal-extra-box-head h3{
          margin:0;
          color:#0f172a;
          font-size:24px;
          line-height:1;
          font-weight:950;
          letter-spacing:-.045em;
        }

        .portal-extra-box-head a{
          text-decoration:none;
          color:#2563eb;
          font-size:13px;
          font-weight:900;
          white-space:nowrap;
        }

        .portal-mini-list{
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .portal-mini-card{
          display:grid;
          grid-template-columns:118px minmax(0,1fr);
          gap:14px;
          min-height:118px;
          border:1px solid #e2e8f0;
          text-decoration:none;
          color:#0f172a;
          background:#fff;
          overflow:hidden;
          transition:border-color .2s ease;
        }

        .portal-mini-card:hover{
          border-color:#2563eb;
        }

        .portal-mini-card:hover h4{
          color:#2563eb;
        }

        .portal-mini-media{
          background:#f1f5f9;
          overflow:hidden;
        }

        .portal-mini-media img,
        .portal-mini-placeholder{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          min-height:118px;
        }

        .portal-mini-placeholder{
          background:linear-gradient(135deg,#f1f5f9,#e2e8f0);
        }

        .portal-mini-body{
          padding:12px 12px 12px 0;
          min-width:0;
        }

        .portal-mini-body span{
          display:inline-flex;
          padding:5px 8px;
          background:#eff6ff;
          color:#2563eb;
          font-size:10px;
          font-weight:950;
          text-transform:uppercase;
          margin-bottom:7px;
        }

        .portal-mini-body h4{
          margin:0;
          color:#0f172a;
          font-size:15px;
          line-height:1.25;
          font-weight:950;
          letter-spacing:-.02em;
        }

        .portal-mini-body p{
          margin:6px 0 0;
          color:#64748b;
          font-size:13px;
          line-height:1.45;
        }

        .portal-mini-body strong{
          display:block;
          margin-top:7px;
          color:#0f172a;
          font-size:14px;
          font-weight:950;
        }

        .portal-empty{
          border:1px dashed #cbd5e1;
          background:#f8fafc;
          color:#64748b;
          padding:18px;
          font-size:14px;
          font-weight:700;
        }

        @media(max-width:1440px){
          .news-category-grid{
            grid-template-columns:repeat(3,minmax(0,1fr));
          }

          .portal-extra-grid{
            grid-template-columns:1fr;
          }
        }

        @media(max-width:1180px){
          .news-category-main{
            padding-top:96px;
          }

          .category-lead-layout{
            grid-template-columns:1fr;
          }

          .category-lead-side{
            grid-template-columns:repeat(3,minmax(0,1fr));
          }
        }

        @media(max-width:920px){
          .news-category-main{
            padding:86px 14px 58px;
          }

          .category-hero{
            min-height:320px;
            padding:30px 24px;
          }

          .news-category-grid{
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:16px;
          }

          .category-lead-side{
            grid-template-columns:repeat(2,minmax(0,1fr));
          }
        }

        @media(max-width:680px){
          .news-category-main{
            padding:74px 10px 48px;
          }

          .category-hero{
            min-height:330px;
            padding:24px 16px;
            margin-bottom:18px;
            border-left:0;
            border-right:0;
          }

          .category-hero-overlay{
            background:linear-gradient(180deg, rgba(2,6,23,.14), rgba(2,6,23,.92));
          }

          .category-hero-content span{
            font-size:10px;
            padding:7px 10px;
            margin-bottom:12px;
          }

          .category-hero-content h1{
            font-size:44px;
            line-height:.92;
          }

          .category-hero-content p{
            font-size:14px;
            line-height:1.55;
            margin-top:14px;
          }

          .category-ad-wrap{
            margin-bottom:26px;
          }

          .category-lead-layout{
            gap:18px;
            margin-bottom:34px;
          }

          .category-lead-side{
            grid-template-columns:1fr;
            gap:16px;
          }

          .news-category-grid{
            grid-template-columns:1fr;
          }

          .category-section-head h2,
          .portal-extra-head h2{
            font-size:28px;
          }

          .category-section-head p,
          .portal-extra-head p{
            font-size:13px;
          }

          .portal-extra-section{
            margin-top:44px;
            padding-top:28px;
          }

          .portal-extra-box{
            padding:14px;
          }

          .portal-extra-box-head{
            flex-direction:column;
          }

          .portal-mini-card{
            grid-template-columns:1fr;
          }

          .portal-mini-media img,
          .portal-mini-placeholder{
            height:190px;
          }

          .portal-mini-body{
            padding:12px;
          }
        }

        @media(max-width:420px){
          .news-category-main{
            padding-left:8px;
            padding-right:8px;
          }

          .category-hero{
            min-height:340px;
          }

          .category-hero-content h1{
            font-size:38px;
          }

          .category-hero-content p{
            font-size:13px;
          }
        }
      `}</style>
    </div>
  );
}