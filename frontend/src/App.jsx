import { useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";

function App() {
  const { user } = useAuth();

  return (
    <div>
      <LandingPage />
    </div>
  );
}

export default App;
