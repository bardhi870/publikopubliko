import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LOGO =
  "https://res.cloudinary.com/dbz7fjuty/image/upload/v1776969027/PUBLIKO_LOGO_pomulk.png";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      const adminToken =
        data.token ||
        data.adminToken ||
        data.accessToken ||
        data.jwt;

      if (!adminToken) {
        alert("Token nuk erdhi nga backend-i.");
        return;
      }

      localStorage.setItem("adminToken", adminToken);
      localStorage.setItem("token", adminToken);
      localStorage.setItem("admin_token", adminToken);

      if (data.admin || data.user) {
        localStorage.setItem("adminUser", JSON.stringify(data.admin || data.user));
      }

      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("Gabim gjatë login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <style>{`
        *{box-sizing:border-box}

        .admin-login-page{
          min-height:100vh;
          position:relative;
          overflow:hidden;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:24px;
          font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          background:
            radial-gradient(circle at 16% 16%, rgba(59,130,246,.65), transparent 34%),
            radial-gradient(circle at 84% 22%, rgba(14,165,233,.42), transparent 32%),
            radial-gradient(circle at 50% 92%, rgba(37,99,235,.55), transparent 36%),
            linear-gradient(135deg,#020617 0%,#0f172a 42%,#172554 100%);
        }

        .admin-login-page::before{
          content:"";
          position:absolute;
          inset:-2px;
          background-image:
            linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px);
          background-size:54px 54px;
          mask-image:linear-gradient(to bottom, rgba(0,0,0,.9), transparent 84%);
          opacity:.7;
        }

        .admin-login-page::after{
          content:"";
          position:absolute;
          width:520px;
          height:520px;
          border-radius:999px;
          background:linear-gradient(135deg, rgba(96,165,250,.28), rgba(14,165,233,.08));
          filter:blur(10px);
          right:-180px;
          bottom:-210px;
          border:1px solid rgba(255,255,255,.16);
        }

        .orb{
          position:absolute;
          border-radius:999px;
          filter:blur(.2px);
          opacity:.9;
          animation:float 9s ease-in-out infinite;
        }

        .orb.one{
          width:170px;
          height:170px;
          left:9%;
          top:18%;
          background:linear-gradient(135deg, rgba(59,130,246,.45), rgba(255,255,255,.08));
          border:1px solid rgba(255,255,255,.16);
        }

        .orb.two{
          width:96px;
          height:96px;
          right:17%;
          top:15%;
          background:linear-gradient(135deg, rgba(125,211,252,.34), rgba(37,99,235,.10));
          border:1px solid rgba(255,255,255,.14);
          animation-delay:1.4s;
        }

        .orb.three{
          width:130px;
          height:130px;
          left:20%;
          bottom:13%;
          background:linear-gradient(135deg, rgba(30,64,175,.40), rgba(255,255,255,.08));
          border:1px solid rgba(255,255,255,.14);
          animation-delay:2.2s;
        }

        @keyframes float{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-18px)}
        }

        .login-shell{
          width:min(100%,1040px);
          position:relative;
          z-index:2;
          display:grid;
          grid-template-columns:1fr 440px;
          gap:22px;
          align-items:stretch;
        }

        .brand-panel{
          min-height:560px;
          border-radius:34px;
          padding:34px;
          position:relative;
          overflow:hidden;
          color:#fff;
          border:1px solid rgba(255,255,255,.16);
          background:
            linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.035)),
            rgba(15,23,42,.36);
          box-shadow:0 30px 100px rgba(0,0,0,.32);
          backdrop-filter:blur(22px);
        }

        .brand-panel::after{
          content:"";
          position:absolute;
          inset:auto -120px -160px auto;
          width:420px;
          height:420px;
          border-radius:999px;
          background:rgba(59,130,246,.28);
          filter:blur(14px);
        }

        .brand-top{
          display:flex;
          align-items:center;
          gap:14px;
          position:relative;
          z-index:2;
        }

        .brand-logo{
          width:58px;
          height:58px;
          border-radius:18px;
          background:rgba(255,255,255,.96);
          padding:8px;
          object-fit:contain;
          box-shadow:0 18px 36px rgba(0,0,0,.22);
        }

        .brand-name{
          font-size:24px;
          font-weight:900;
          letter-spacing:-.04em;
          margin:0;
        }

        .brand-label{
          font-size:13px;
          color:rgba(226,232,240,.8);
          margin:2px 0 0;
        }

        .brand-content{
          position:relative;
          z-index:2;
          margin-top:86px;
          max-width:520px;
        }

        .pill{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:9px 12px;
          border-radius:999px;
          background:rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.16);
          color:#dbeafe;
          font-size:12px;
          font-weight:800;
          letter-spacing:.08em;
          text-transform:uppercase;
        }

        .brand-title{
          margin:20px 0 14px;
          font-size:50px;
          line-height:.98;
          letter-spacing:-.07em;
          font-weight:950;
        }

        .brand-title span{
          background:linear-gradient(135deg,#ffffff,#bfdbfe,#60a5fa);
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }

        .brand-desc{
          max-width:480px;
          font-size:16px;
          line-height:1.7;
          color:rgba(226,232,240,.82);
          margin:0;
        }

        .stats-row{
          position:absolute;
          left:34px;
          right:34px;
          bottom:34px;
          z-index:2;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:12px;
        }

        .stat-card{
          padding:15px;
          border-radius:20px;
          background:rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.13);
          backdrop-filter:blur(12px);
        }

        .stat-card strong{
          display:block;
          font-size:22px;
          letter-spacing:-.04em;
        }

        .stat-card span{
          display:block;
          margin-top:3px;
          font-size:12px;
          color:rgba(226,232,240,.76);
        }

        .login-card{
          min-height:560px;
          border-radius:34px;
          padding:30px;
          background:rgba(255,255,255,.94);
          border:1px solid rgba(255,255,255,.45);
          box-shadow:0 30px 100px rgba(0,0,0,.34);
          backdrop-filter:blur(24px);
          display:flex;
          flex-direction:column;
          justify-content:center;
        }

        .mobile-logo{
          display:none;
          width:74px;
          height:74px;
          margin:0 auto 14px;
          object-fit:contain;
          border-radius:22px;
          background:#fff;
          padding:10px;
          box-shadow:0 18px 40px rgba(15,23,42,.14);
        }

        .login-kicker{
          display:inline-flex;
          width:max-content;
          margin:0 auto 14px;
          padding:8px 12px;
          border-radius:999px;
          background:#eff6ff;
          color:#1d4ed8;
          font-size:12px;
          font-weight:900;
          letter-spacing:.08em;
          text-transform:uppercase;
        }

        .login-title{
          margin:0;
          text-align:center;
          color:#020617;
          font-size:30px;
          font-weight:950;
          letter-spacing:-.06em;
        }

        .login-subtitle{
          margin:10px auto 28px;
          text-align:center;
          color:#64748b;
          font-size:14px;
          line-height:1.55;
          max-width:310px;
        }

        .field{
          margin-bottom:14px;
        }

        .field label{
          display:block;
          font-size:13px;
          font-weight:900;
          color:#0f172a;
          margin-bottom:8px;
        }

        .input-wrap{
          position:relative;
        }

        .input-wrap input{
          width:100%;
          height:52px;
          border-radius:16px;
          border:1px solid #dbe3ef;
          background:#f8fafc;
          outline:none;
          padding:0 15px;
          color:#0f172a;
          font-size:14px;
          font-weight:650;
          transition:.22s ease;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.75);
        }

        .input-wrap input:focus{
          border-color:#2563eb;
          background:#fff;
          box-shadow:0 0 0 5px rgba(37,99,235,.10);
        }

        .password-btn{
          position:absolute;
          right:10px;
          top:50%;
          transform:translateY(-50%);
          border:none;
          background:#eaf2ff;
          color:#1d4ed8;
          font-size:12px;
          font-weight:900;
          border-radius:12px;
          padding:8px 10px;
          cursor:pointer;
        }

        .login-options{
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin:4px 0 18px;
          color:#64748b;
          font-size:13px;
        }

        .remember{
          display:flex;
          align-items:center;
          gap:8px;
        }

        .remember input{
          accent-color:#2563eb;
        }

        .submit-btn{
          width:100%;
          height:54px;
          border:none;
          border-radius:18px;
          cursor:pointer;
          color:#fff;
          font-size:15px;
          font-weight:950;
          letter-spacing:-.01em;
          background:linear-gradient(135deg,#2563eb,#1d4ed8,#1e40af);
          box-shadow:0 18px 36px rgba(37,99,235,.36);
          transition:.22s ease;
        }

        .submit-btn:hover{
          transform:translateY(-2px);
          box-shadow:0 24px 48px rgba(37,99,235,.44);
        }

        .submit-btn:disabled{
          opacity:.75;
          cursor:not-allowed;
          transform:none;
        }

        .secure-note{
          margin-top:18px;
          padding:13px 14px;
          border-radius:18px;
          background:linear-gradient(135deg,#f8fafc,#eff6ff);
          border:1px solid #e5edf8;
          color:#64748b;
          text-align:center;
          font-size:12.5px;
          line-height:1.45;
        }

        .footer-note{
          margin:18px 0 0;
          text-align:center;
          color:#94a3b8;
          font-size:12px;
        }

        @media (max-width:900px){
          .login-shell{
            grid-template-columns:1fr;
            max-width:460px;
          }
          .brand-panel{
            display:none;
          }
          .login-card{
            min-height:auto;
            padding:28px 22px;
          }
          .mobile-logo{
            display:block;
          }
        }

        @media (max-width:420px){
          .admin-login-page{
            padding:14px;
          }
          .login-card{
            border-radius:26px;
          }
          .login-title{
            font-size:26px;
          }
        }
      `}</style>

      <div className="orb one" />
      <div className="orb two" />
      <div className="orb three" />

      <div className="login-shell">
        <section className="brand-panel">
          <div className="brand-top">
            <img className="brand-logo" src={LOGO} alt="Publiko" />
            <div>
              <h1 className="brand-name">Publiko</h1>
              <p className="brand-label">Business Management Platform</p>
            </div>
          </div>

          <div className="brand-content">
            <div className="pill">Admin Dashboard</div>
            <h2 className="brand-title">
              Menaxho <span>platformën</span> me stil profesional.
            </h2>
            <p className="brand-desc">
              Kontrollo shpalljet, reklamat, klientët, statistikat dhe kërkesat
              nga një panel i sigurt, modern dhe premium.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <strong>24/7</strong>
              <span>Kontroll</span>
            </div>
            <div className="stat-card">
              <strong>Pro</strong>
              <span>Panel</span>
            </div>
            <div className="stat-card">
              <strong>JWT</strong>
              <span>Security</span>
            </div>
          </div>
        </section>

        <form className="login-card" onSubmit={handleLogin}>
          <img className="mobile-logo" src={LOGO} alt="Publiko" />

          <div className="login-kicker">Secure Access</div>
          <h2 className="login-title">Kyçu në Admin</h2>
          <p className="login-subtitle">
            Vendos kredencialet për të hyrë në panelin e menaxhimit.
          </p>

          <div className="field">
            <label>Email adresa</label>
            <div className="input-wrap">
              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Fjalëkalimi</label>
            <div className="input-wrap">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={{ paddingRight: "88px" }}
              />
              <button
                type="button"
                className="password-btn"
                onClick={() => setShowPass((prev) => !prev)}
              >
                {showPass ? "Fsheh" : "Shfaq"}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" defaultChecked />
              <span>Më mbaj të kyçur</span>
            </label>
            <span>Admin only</span>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Duke u kyçur..." : "Hyr në Dashboard"}
          </button>

          <div className="secure-note">
            Qasja është e mbrojtur me token. Pa login, faqet e adminit nuk hapen.
          </div>

          <p className="footer-note">© Publiko Platform · Admin System</p>
        </form>
      </div>
    </div>
  );
}