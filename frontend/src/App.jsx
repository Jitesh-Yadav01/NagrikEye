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
import VistaApp from "./pages/VistaApp";
import CurrentWeather from "./vista-components/CurrentWeather";
import Forecast from "./vista-components/Forecast";
import VistaAIAssistant from "./vista-components/VistaAIAssistant";
import Hero from "./vista-pages/Hero";
import VistaAIHistory from "./vista-pages/VistaAIHistory";

function App() {
  useAuth();
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
        <Route path="/vista" element={<VistaApp />}>
          <Route index element={<Hero />} />
          <Route path="weather" element={<div className="w-full p-0 md:p-6"><CurrentWeather /></div>} />
          <Route path="forecast" element={<div className="w-full p-0 md:p-6"><Forecast /></div>} />
          <Route path="ai" element={<div className="h-[calc(100vh-100px)] w-full mb-8"><VistaAIAssistant /></div>} />
          <Route path="ai-history" element={<VistaAIHistory />} />
        </Route>

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
