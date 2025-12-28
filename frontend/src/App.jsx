import { useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";

function App() {
  const { user } = useAuth();  
  return (
    <div>
      {user ? (
        <>
          <Navbar/>
          <Routes>
           <Route path="/" element={<Dashboard/>}/>
           <Route path="/profile" element={<Profile/>}/>
          </Routes>
        </>
      ) : (
        <>
          <Auth/>
        </>
      )}
    </div>
  );
}

export default App;
