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

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/kategori/:category" element={<CategoryPage />} />
        <Route path="/kontakti" element={<ContactPage />} />
        <Route path="/reklamo-me-ne" element={<AdRequestPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

        {/* News routes */}
        <Route path="/lajme" element={<NewsHomePage />} />
        <Route path="/lajme/:category" element={<NewsCategoryPage />} />
        <Route path="/lajme/artikulli/:slug" element={<NewsArticlePage />} />

        {/* Detail pages */}
        <Route path="/konkurse-pune/:id" element={<JobDetailsPage />} />
        <Route path="/automjete/:id" element={<VehicleDetailsPage />} />
        <Route path="/patundshmeri/:id" element={<RealEstateDetailsPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/offers" element={<AdminOffers />} />
        <Route path="/admin/ads" element={<AdminAds />} />
        <Route path="/admin/stats" element={<AdminStats />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/ad-requests" element={<AdminAdRequests />} />
        <Route path="/admin/public-clients" element={<AdminPublicClients />} />
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