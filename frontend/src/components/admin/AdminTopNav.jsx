import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  UserSquare,
  Tag,
  Mail,
  CreditCard,
  BarChart3,
  LineChart,
  LogOut
} from "lucide-react";

export default function AdminTopNav() {
  const location = useLocation();

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, color: "blue" },
    { to: "/admin/clients", label: "Klientët", icon: Users, color: "emerald" },
    { to: "/admin/ads", label: "Reklamat", icon: Megaphone, color: "violet" },
    { to: "/admin/public-clients", label: "Klientët tanë", icon: UserSquare, color: "amber" },
    { to: "/admin/offers", label: "Ofertat", icon: Tag, color: "rose" },
    { to: "/admin/ad-requests", label: "Kërkesat", icon: Mail, color: "orange" },
    { to: "/admin/payments", label: "Pagesat", icon: CreditCard, color: "cyan" },
    { to: "/admin/stats", label: "Statistikat", icon: BarChart3, color: "slate" },
    { to: "/admin/analytics", label: "Analytics", icon: LineChart, color: "indigo" }
  ];

  const isItemActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  return (
    <>
      <div className="admin-top-nav">
        <div className="admin-nav-left">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`admin-top-nav-link admin-top-nav-${item.color} ${
                  isActive ? "active" : ""
                }`}
              >
                <span className="admin-top-nav-icon-wrap">
                  <Icon size={16} strokeWidth={2.3} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="admin-top-nav-link admin-top-nav-logout"
          >
            <span className="admin-top-nav-icon-wrap">
              <LogOut size={16} strokeWidth={2.3} />
            </span>
            <span>Dil</span>
          </button>
        </div>
      </div>

      <style>{`
        .admin-top-nav {
          width: 100%;
          padding: 8px 14px 14px;
          overflow: visible;
        }

        .admin-nav-left {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          overflow: visible;
        }

        .admin-top-nav-link {
          text-decoration: none;
          color: #fff;
          padding: 13px 18px;
          border-radius: 17px;
          font-weight: 850;
          font-size: 14px;
          white-space: nowrap;
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 12px 28px rgba(15,23,42,0.14);
          transition: all 0.22s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          flex: 0 0 auto;
        }

        .admin-top-nav-link::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.13) 0%,
            rgba(255,255,255,0.00) 100%
          );
          pointer-events: none;
        }

        .admin-top-nav-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(15,23,42,0.2);
        }

        .admin-top-nav-link.active {
          transform: translateY(-1px) scale(1.015);
          box-shadow: 0 18px 38px rgba(15,23,42,0.24);
          border-color: rgba(255,255,255,0.28);
        }

        .admin-top-nav-icon-wrap {
          width: 23px;
          height: 23px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: rgba(255,255,255,0.18);
          flex-shrink: 0;
        }

        .admin-top-nav-blue { background: linear-gradient(135deg, #2563eb, #3b82f6); }
        .admin-top-nav-emerald { background: linear-gradient(135deg, #059669, #10b981); }
        .admin-top-nav-violet { background: linear-gradient(135deg, #7c3aed, #8b5cf6); }
        .admin-top-nav-amber { background: linear-gradient(135deg, #d97706, #f59e0b); }
        .admin-top-nav-rose { background: linear-gradient(135deg, #e11d48, #f43f5e); }
        .admin-top-nav-orange { background: linear-gradient(135deg, #ea580c, #f97316); }
        .admin-top-nav-cyan { background: linear-gradient(135deg, #0891b2, #06b6d4); }
        .admin-top-nav-slate { background: linear-gradient(135deg, #334155, #475569); }
        .admin-top-nav-indigo { background: linear-gradient(135deg, #4338ca, #6366f1); }
        .admin-top-nav-logout {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          border: none;
        }

        @media (max-width: 1200px) {
          .admin-nav-left {
            gap: 10px;
          }

          .admin-top-nav-link {
            padding: 12px 15px;
            font-size: 13px;
            min-height: 48px;
          }
        }

        @media (max-width: 768px) {
          .admin-top-nav {
            padding: 8px 10px 14px;
          }

          .admin-nav-left {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .admin-top-nav-link {
            width: 100%;
            padding: 12px 10px;
            font-size: 13px;
            border-radius: 15px;
          }
        }
      `}</style>
    </>
  );
}