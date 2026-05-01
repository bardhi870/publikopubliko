import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../../../components/layout/PublicHeader";
import PublicFooter from "../../../components/layout/PublicFooter";
import NewsHero from "../../../components/news/NewsHero";
import NewsSection from "../../../components/news/NewsSection";
import BreakingTicker from "../../../components/news/BreakingTicker";
import NewsCard from "../../../components/news/NewsCard";
import TrendingTopics from "../../../components/news/TrendingTopics";
import MostReadSection from "../../../components/news/MostReadSection";
import QuickHeadlines from "../../../components/news/QuickHeadlines";
import EditorsPicksSection from "../../../components/news/EditorsPicksSection";
import AdSlot from "../../../components/ads/AdSlot";
import { trackEvent } from "../../../utils/analytics";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const NEWS_VIDEO_URL =
  "https://res.cloudinary.com/dbz7fjuty/video/upload/v1777163867/0002-video_ofxnmp.mp4";

const LOGO_URL =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776969027/PUBLIKO_LOGO_pomulk.png";

export default function NewsHomePage() {
  const videoRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoMuted] = useState(true);

  useEffect(() => {
    trackEvent({
      event_type: "page_view",
      page_url: window.location.pathname,
      category: "lajme"
    });
  }, []);

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);

      trackEvent({
        event_type: "time_on_page",
        duration_seconds: duration,
        page_url: window.location.pathname,
        category: "lajme"
      });
    };
  }, []);

  const handleOfferClick = () => {
    trackEvent({
      event_type: "category_click",
      category: "oferta",
      page_url: window.location.pathname,
      element_name: "news_home_offer"
    });
  };

  const handleAdvertiseClick = () => {
    trackEvent({
      event_type: "post_click",
      page_url: window.location.pathname,
      element_name: "reklamo_me_ne"
    });
  };

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];

        const onlyNews = safeData.filter((item) =>
          ["vendi", "rajoni", "bota"].includes(item.category)
        );

        const sorted = [...onlyNews].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setPosts(sorted);
      })
      .catch((err) => {
        console.error("Gabim gjatë marrjes së lajmeve:", err);
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const featuredPosts = useMemo(() => {
    const featured = posts.filter((post) => post.featured);
    return featured.length >= 3 ? featured.slice(0, 3) : posts.slice(0, 3);
  }, [posts]);

  const breakingPosts = useMemo(() => {
    const breaking = posts.filter((post) => post.breaking);
    return breaking.length > 0 ? breaking.slice(0, 6) : posts.slice(0, 6);
  }, [posts]);

  const editorsPicks = useMemo(() => {
    if (!posts.length) return [];

    const mostReadTwo = [...posts]
      .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
      .slice(0, 2);

    const newestOne = [...posts]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .find((p) => !mostReadTwo.some((x) => x.id === p.id));

    return newestOne ? [...mostReadTwo, newestOne] : mostReadTwo;
  }, [posts]);

  const latestPosts = useMemo(() => {
    const excludedIds = new Set([
      ...featuredPosts.map((p) => p.id),
      ...breakingPosts.map((p) => p.id),
      ...editorsPicks.map((p) => p.id)
    ]);

    return posts.filter((post) => !excludedIds.has(post.id)).slice(0, 9);
  }, [posts, featuredPosts, breakingPosts, editorsPicks]);

  const vendiPosts = useMemo(
    () => posts.filter((post) => post.category === "vendi").slice(0, 6),
    [posts]
  );

  const rajoniPosts = useMemo(
    () => posts.filter((post) => post.category === "rajoni").slice(0, 6),
    [posts]
  );

  const botaPosts = useMemo(
    () => posts.filter((post) => post.category === "bota").slice(0, 6),
    [posts]
  );

  return (
    <div className="news-page">
      <PublicHeader />

      <main className="news-main">
        <div className="news-container">
          <BreakingTicker posts={breakingPosts} />

          <section className="news-video-hero">
            <video
              ref={videoRef}
              className="news-video"
              src={NEWS_VIDEO_URL}
              autoPlay
              muted={videoMuted}
              loop
              playsInline
            />

            <div className="news-video-shade" />

            <div className="news-video-content">
              <div className="news-video-kicker">Publiko.biz Newsroom</div>

              <h1>Lajmet më të fundit nga vendi, rajoni dhe bota.</h1>

              <p>
                Një eksperiencë moderne lajmesh me video, histori kryesore,
                breaking news dhe përmbajtje të organizuar qartë.
              </p>

              <div className="news-hero-actions">
                <Link
                  to="/kategori/oferta"
                  className="news-action-btn news-action-offer"
                  onClick={handleOfferClick}
                >
                  Oferta
                </Link>

                <Link
                  to="/reklamo-me-ne"
                  className="news-action-btn news-action-ad"
                  onClick={handleAdvertiseClick}
                >
                  Reklamo më ne
                </Link>
              </div>
            </div>
          </section>

          <div className="news-ad-wrap news-ad-after-video">
            <AdSlot placement="news_top_banner" />
          </div>

          {loading ? (
            <div className="news-state">Duke ngarkuar lajmet...</div>
          ) : posts.length === 0 ? (
            <div className="news-state">Nuk ka lajme për shfaqje.</div>
          ) : (
            <>
              <NewsHero posts={featuredPosts} />

              <div className="news-wide-grid">
                <EditorsPicksSection posts={editorsPicks} />
                <MostReadSection posts={posts} />
              </div>

              <div className="news-quick-cta">
                <Link
                  to="/kategori/oferta"
                  className="quick-cta-card offer"
                  onClick={handleOfferClick}
                >
                  <div className="cta-top">
                    <img src={LOGO_URL} alt="Publiko.biz" />
                    <span>Oferta</span>
                  </div>

                  <strong>Shiko ofertat aktive</strong>

                  <small>
                    Paketa, promovime dhe publikime të sponsorizuara për bizneset.
                  </small>
                </Link>

                <Link
                  to="/reklamo-me-ne"
                  className="quick-cta-card ads"
                  onClick={handleAdvertiseClick}
                >
                  <div className="cta-top">
                    <img src={LOGO_URL} alt="Publiko.biz" />
                    <span>Reklamo</span>
                  </div>

                  <strong>Rrite biznesin tënd</strong>

                  <small>
                    Banner, postime të sponsorizuara dhe hapësira premium.
                  </small>
                </Link>
              </div>

              <TrendingTopics posts={posts} />

              <div className="news-ad-wrap">
                <AdSlot placement="news_inline_1" />
              </div>

              {latestPosts.length > 0 && (
                <section className="latest-news-section">
                  <div className="latest-news-head">
                    <div className="latest-news-line" />
                    <div>
                      <h2>Të fundit</h2>
                      <p>Publikimet më të reja nga të gjitha kategoritë.</p>
                    </div>
                  </div>

                  <div className="latest-news-grid">
                    {latestPosts.map((post) => (
                      <NewsCard key={post.id} post={post} variant="default" />
                    ))}
                  </div>
                </section>
              )}

              <div className="news-category-wrap">
                <NewsSection
                  title="Vendi"
                  posts={vendiPosts}
                  viewAllLink="/lajme/vendi"
                />

                <NewsSection
                  title="Rajoni"
                  posts={rajoniPosts}
                  viewAllLink="/lajme/rajoni"
                />

                <NewsSection
                  title="Bota"
                  posts={botaPosts}
                  viewAllLink="/lajme/bota"
                />
              </div>

              <QuickHeadlines posts={posts} />
            </>
          )}
        </div>
      </main>

      <PublicFooter />

      <style>{`
        .news-page{
          min-height:100vh;
          background:
            radial-gradient(circle at top left, rgba(37,99,235,.08), transparent 32%),
            linear-gradient(180deg,#ffffff 0%,#f8fafc 45%,#ffffff 100%);
          color:#0f172a;
        }

        .news-main{
          width:100%;
          padding-top:96px;
        }

        .news-container{
          width:min(100%,2100px);
          margin:0 auto;
          padding:22px clamp(12px,2vw,28px) 76px;
        }

        .news-ad-wrap{
          max-width:1320px;
          margin:0 auto;
        }

        .news-ad-after-video{
          margin-bottom:48px;
        }

        .news-video-hero{
          position:relative;
          height:570px;
          margin:42px 0 24px;
          overflow:hidden;
          background:#020617;
          border:1px solid rgba(219,234,254,.9);
          box-shadow:0 24px 70px rgba(15,23,42,.16);
          isolation:isolate;
        }

        .news-video{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          transform:scale(1.025);
        }

        .news-video-shade{
          position:absolute;
          inset:0;
          background:
            linear-gradient(90deg, rgba(2,6,23,.90) 0%, rgba(2,6,23,.58) 43%, rgba(2,6,23,.10) 100%),
            linear-gradient(180deg, rgba(2,6,23,.06) 0%, rgba(2,6,23,.70) 100%);
        }

        .news-video-content{
          position:absolute;
          left:clamp(18px,4vw,56px);
          bottom:clamp(24px,4vw,56px);
          max-width:860px;
          color:#fff;
          z-index:2;
        }

        .news-video-kicker{
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

        .news-video-content h1{
          margin:0;
          font-size:clamp(42px,5.5vw,86px);
          line-height:.92;
          font-weight:950;
          letter-spacing:-.065em;
          text-shadow:0 10px 34px rgba(0,0,0,.36);
        }

        .news-video-content p{
          max-width:680px;
          margin:20px 0 0;
          color:rgba(255,255,255,.90);
          font-size:18px;
          line-height:1.65;
          font-weight:600;
        }

        .news-hero-actions{
          display:flex;
          align-items:center;
          gap:12px;
          flex-wrap:wrap;
          margin-top:24px;
        }

        .news-action-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-height:46px;
          padding:0 20px;
          border-radius:999px;
          text-decoration:none;
          font-weight:950;
          font-size:14px;
          border:1px solid rgba(255,255,255,.24);
          backdrop-filter:blur(14px);
          transition:transform .2s ease, opacity .2s ease, box-shadow .2s ease;
          box-shadow:0 14px 30px rgba(0,0,0,.18);
        }

        .news-action-btn:hover{
          transform:translateY(-2px);
        }

        .news-action-offer{
          background:linear-gradient(135deg,#34d399,#10b981);
          color:#052e16;
        }

        .news-action-ad{
          background:linear-gradient(135deg,#2563eb,#0284c7);
          color:#fff;
        }

        .news-quick-cta{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px;
          margin:36px 0;
        }

        .quick-cta-card{
          min-height:154px;
          padding:24px;
          text-decoration:none;
          border:1px solid #dbe3ea;
          background:#fff;
          position:relative;
          overflow:hidden;
          display:flex;
          flex-direction:column;
          justify-content:center;
          transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .quick-cta-card:hover{
          transform:translateY(-4px);
          box-shadow:0 22px 46px rgba(15,23,42,.12);
          border-color:#cbd5e1;
        }

        .quick-cta-card:before{
          content:"";
          position:absolute;
          right:-70px;
          top:-70px;
          width:190px;
          height:190px;
          border-radius:999px;
          opacity:.9;
        }

        .quick-cta-card:after{
          content:"";
          position:absolute;
          right:22px;
          bottom:18px;
          width:82px;
          height:82px;
          background:url("${LOGO_URL}") center/contain no-repeat;
          opacity:.09;
        }

        .quick-cta-card.offer{
          background:
            linear-gradient(135deg,rgba(236,253,245,.96),rgba(209,250,229,.78)),
            #ffffff;
        }

        .quick-cta-card.offer:before{
          background:rgba(16,185,129,.16);
        }

        .quick-cta-card.ads{
          background:
            linear-gradient(135deg,rgba(239,246,255,.98),rgba(219,234,254,.82)),
            #ffffff;
        }

        .quick-cta-card.ads:before{
          background:rgba(37,99,235,.14);
        }

        .cta-top{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:12px;
          position:relative;
          z-index:2;
        }

        .cta-top img{
          width:36px;
          height:36px;
          object-fit:contain;
          filter:drop-shadow(0 8px 16px rgba(15,23,42,.12));
        }

        .quick-cta-card span{
          font-size:12px;
          font-weight:950;
          letter-spacing:.08em;
          text-transform:uppercase;
        }

        .quick-cta-card.offer span{
          color:#059669;
        }

        .quick-cta-card.ads span{
          color:#2563eb;
        }

        .quick-cta-card strong{
          color:#0f172a;
          font-size:27px;
          line-height:1.05;
          font-weight:950;
          letter-spacing:-.045em;
          position:relative;
          z-index:2;
        }

        .quick-cta-card small{
          margin-top:10px;
          color:#475569;
          font-size:14px;
          line-height:1.55;
          font-weight:700;
          position:relative;
          z-index:2;
          max-width:620px;
        }

        .news-wide-grid{
          display:grid;
          grid-template-columns:minmax(0,1fr) minmax(330px,.42fr);
          gap:24px;
          align-items:start;
          margin:36px 0;
        }

        .news-state{
          background:#fff;
          border:1px solid #dbe3ea;
          padding:46px 24px;
          text-align:center;
          color:#64748b;
          font-weight:800;
        }

        .latest-news-section{
          display:flex;
          flex-direction:column;
          gap:22px;
          margin:44px 0 54px;
        }

        .latest-news-head{
          display:flex;
          align-items:center;
          gap:12px;
        }

        .latest-news-line{
          width:4px;
          height:42px;
          background:linear-gradient(180deg,#0f172a,#334155);
          flex:0 0 auto;
        }

        .latest-news-head h2{
          margin:0;
          font-size:34px;
          line-height:1.05;
          font-weight:950;
          letter-spacing:-.045em;
          color:#0f172a;
        }

        .latest-news-head p{
          margin:5px 0 0;
          color:#64748b;
          font-size:14px;
          font-weight:700;
        }

        .latest-news-grid{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:20px;
        }

        .news-category-wrap{
          display:grid;
          gap:36px;
          margin-top:24px;
        }

        @media(max-width:1180px){
          .news-main{ padding-top:88px; }
          .news-container{ width:min(100%,1180px); }
          .news-wide-grid{ grid-template-columns:1fr; }
          .news-video-hero{ height:500px; }
        }

        @media(max-width:920px){
          .news-main{ padding-top:82px; }
          .news-container{ padding:18px 14px 58px; }

          .latest-news-grid{
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:16px;
          }

          .news-video-hero{
            height:460px;
            margin:30px 0 18px;
          }

          .news-ad-after-video{
            margin-bottom:34px;
          }

          .news-quick-cta{
            grid-template-columns:1fr;
            gap:12px;
            margin:28px 0;
          }
        }

        @media(max-width:680px){
          .news-main{ padding-top:72px; }

          .news-container{
            padding:10px 10px 48px;
          }

          .news-video-hero{
            height:calc(100svh - 145px);
            min-height:430px;
            max-height:620px;
            margin:18px -10px 14px;
            border-left:0;
            border-right:0;
            box-shadow:0 18px 44px rgba(15,23,42,.18);
          }

          .news-ad-wrap{
            max-width:100%;
          }

          .news-ad-after-video{
            margin-bottom:28px;
          }

          .news-video-shade{
            background:
              linear-gradient(180deg, rgba(2,6,23,.10) 0%, rgba(2,6,23,.32) 32%, rgba(2,6,23,.94) 100%);
          }

          .news-video-content{
            left:16px;
            right:16px;
            bottom:20px;
            max-width:none;
          }

          .news-video-kicker{
            font-size:10px;
            padding:7px 10px;
            margin-bottom:12px;
          }

          .news-video-content h1{
            font-size:42px;
            line-height:.94;
            letter-spacing:-.058em;
          }

          .news-video-content p{
            font-size:14px;
            line-height:1.55;
            margin-top:14px;
          }

          .news-hero-actions{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
            margin-top:18px;
          }

          .news-action-btn{
            min-height:46px;
            width:100%;
            padding:0 12px;
            font-size:13px;
            box-sizing:border-box;
          }

          .quick-cta-card{
            min-height:126px;
            padding:18px;
          }

          .quick-cta-card:after{
            width:64px;
            height:64px;
            right:14px;
            bottom:12px;
          }

          .cta-top img{
            width:28px;
            height:28px;
          }

          .quick-cta-card strong{
            font-size:22px;
          }

          .quick-cta-card small{
            font-size:13px;
          }

          .latest-news-section{
            margin:34px 0 42px;
          }

          .latest-news-head h2{
            font-size:28px;
          }

          .latest-news-head p{
            font-size:13px;
          }

          .latest-news-grid{
            grid-template-columns:1fr;
          }

          .news-wide-grid{
            gap:18px;
            margin:28px 0;
          }

          .news-category-wrap{
            gap:28px;
          }
        }

        @media(max-width:420px){
          .news-main{ padding-top:68px; }

          .news-container{
            padding-left:8px;
            padding-right:8px;
          }

          .news-video-hero{
            height:calc(100svh - 128px);
            min-height:390px;
            margin-left:-8px;
            margin-right:-8px;
          }

          .news-video-content h1{
            font-size:36px;
          }

          .news-video-content p{
            font-size:13px;
          }

          .news-hero-actions{
            grid-template-columns:1fr;
          }
        }
      `}</style>
    </div>
  );
}