import { useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Posts from "./pages/Posts";

function App() {
  const { user } = useAuth();

  return (
    <div>
       {user ? (
        <>
        <Navbar/>
          <Routes>
           <Route path="/" element={<LandingPage/>}/>
           <Route path="/reports" element={<Posts/>}/>
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
