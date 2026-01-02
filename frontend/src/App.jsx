import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div>
      <LandingPage />
    </div>
  );
}

export default App;
