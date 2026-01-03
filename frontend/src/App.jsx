import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import { Routes, Route, useLocation } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import LandingPage from "./pages/LandingPage";
import Posts from "./pages/Posts";
import AdminDashboard from "./pages/AdminDashboard";

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
      </Routes>
    </div>
  );
}

export default App;
