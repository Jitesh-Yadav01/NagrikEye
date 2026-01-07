import CityView from "./pages/CityView";
import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import { Routes, Route, useLocation } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import LandingPage from "./pages/LandingPage";
import Posts from "./pages/Posts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminAI from "./pages/AdminAI";
import AdminAIHistory from "./pages/AdminAIHistory";

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(location.pathname === "/");

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />

        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-reports" element={<AdminReports />} />
        <Route path="/admin-analytics" element={<AdminAnalytics />} />
        <Route path="/admin-ai" element={<AdminAI />} />
        <Route path="/admin-ai-history" element={<AdminAIHistory />} />
      </Routes>
    </div>
  );
}

export default App;
