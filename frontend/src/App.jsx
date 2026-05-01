import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./pages/public/HomePage";
import CategoryPage from "./pages/public/CategoryPage";
import ContactPage from "./pages/public/ContactPage";
import AdRequestPage from "./pages/public/AdRequestPage";
import JobDetailsPage from "./pages/public/JobDetailsPage";
import VehicleDetailsPage from "./pages/public/VehicleDetailsPage";
import RealEstateDetailsPage from "./pages/public/RealEstateDetailsPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";

import NewsHomePage from "./pages/public/news/NewsHomePage";
import NewsCategoryPage from "./pages/public/news/NewsCategoryPage";
import NewsArticlePage from "./pages/public/news/NewsArticlePage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import ProtectedAdminRoute from "./pages/admin/ProtectedAdminRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOffers from "./pages/admin/AdminOffers";
import AdminClients from "./pages/admin/AdminClients";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminAdRequests from "./pages/admin/AdminAdRequests";
import AdminPublicClients from "./pages/admin/AdminPublicClients";
import AdminStats from "./pages/admin/AdminStats";
import AdminAds from "./pages/admin/AdminAds";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import AdSlot from "./components/ads/AdSlot";

function ProtectedAdmin({ children }) {
  return <ProtectedAdminRoute>{children}</ProtectedAdminRoute>;
}

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kategori/:category" element={<CategoryPage />} />
        <Route path="/kontakti" element={<ContactPage />} />
        <Route path="/reklamo-me-ne" element={<AdRequestPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

        <Route path="/lajme" element={<NewsHomePage />} />
        <Route path="/lajme/:category" element={<NewsCategoryPage />} />
        <Route path="/lajme/artikulli/:slug" element={<NewsArticlePage />} />

        <Route path="/konkurse-pune/:slug" element={<JobDetailsPage />} />
        <Route path="/automjete/:slug" element={<VehicleDetailsPage />} />
        <Route path="/patundshmeri/:slug" element={<RealEstateDetailsPage />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
        <Route path="/admin/offers" element={<ProtectedAdmin><AdminOffers /></ProtectedAdmin>} />
        <Route path="/admin/ads" element={<ProtectedAdmin><AdminAds /></ProtectedAdmin>} />
        <Route path="/admin/stats" element={<ProtectedAdmin><AdminStats /></ProtectedAdmin>} />
        <Route path="/admin/analytics" element={<ProtectedAdmin><AdminAnalytics /></ProtectedAdmin>} />
        <Route path="/admin/clients" element={<ProtectedAdmin><AdminClients /></ProtectedAdmin>} />
        <Route path="/admin/payments" element={<ProtectedAdmin><AdminPayments /></ProtectedAdmin>} />
        <Route path="/admin/ad-requests" element={<ProtectedAdmin><AdminAdRequests /></ProtectedAdmin>} />
        <Route path="/admin/public-clients" element={<ProtectedAdmin><AdminPublicClients /></ProtectedAdmin>} />
      </Routes>

      {!isAdmin && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            pointerEvents: "auto"
          }}
        >
          <AdSlot placement="mobile_sticky_bottom" />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;