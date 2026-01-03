import React, { useState } from "react";
import logo from '../assets/logo.svg';
import userAvatar from '../assets/user_avatar.svg';
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { logout } from "../firebase/auth";

const Navbar = ({ onOpenReport }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <nav className="hidden lg:block w-full fixed top-6 left-0 z-50 px-6 font-sans">
        <div className="mx-auto flex items-stretch justify-between h-[68px] gap-[24px] max-w-[1306.5px]">
          <div className="flex items-center flex-grow shadow-sm bg-white rounded-[10px] pl-[17px] pr-[10.625px] h-full">
            <Link to="/" className="flex items-center gap-2 group mr-auto">
              <span className="flex items-center justify-center">
                <img src={logo} alt="NagrikEye" className="h-[28px] w-auto" />
              </span>
              <span className="flex items-center ml-2">
                <span className="text-[20px] font-medium text-[#1a1a1a] tracking-normal">NagrikEye</span>
              </span>
            </Link>

            <div className="flex items-center gap-1 mr-6">
              {[
                { label: 'Recent Reports', hasDropdown: false, path: "#reports" },
                { label: 'Map', hasDropdown: false, path: "" },
                { label: 'Insights', hasDropdown: true, path: "/reports" },
                { label: 'About', hasDropdown: false, path: "/reports" }
              ].map((item) => (
                <div key={item.label} className="relative group flex items-center justify-center px-[24px] h-[46.75px] cursor-pointer">
                  <span className="absolute inset-0 bg-[#F5F1E4] rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400 ease-[cubic-bezier(0.17,0.67,0.3,1.33)] z-0"></span>
                  <div className="relative z-10 flex items-center gap-1.5">
                    <a href={item.path} className="text-[18px] font-medium text-[#2C2E2A]">{item.label}</a>
                    {item.hasDropdown && (
                      <svg className="w-2.5 h-2.5 mt-0.5 text-[#1a1a1a]" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                        <path fill="none" stroke="currentColor" strokeWidth="1.5" d="m1 1 4 4 4-4"></path>
                      </svg>
                    )}
                  </div>
                </div>
              ))}

              <div className="relative group flex items-center justify-center px-[20px] h-[40px] cursor-pointer ml-2">
                <span className="absolute inset-0 bg-[#1a1a1a] rounded-full transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:bg-black"></span>
                <span className="relative z-10 text-[16px] font-medium text-white">
                  {user ? (
                    <button onClick={logout}>Logout</button>
                  ) : (
                    <Link to="/login">Login</Link>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-between shadow-sm flex-shrink-0 relative overflow-hidden group cursor-pointer bg-white rounded-[10px] h-full min-w-[192px]"
            onClick={onOpenReport}
          >
            <div className="absolute right-[10px] top-1/2 -translate-y-1/2 bg-black rounded-full transition-all duration-[250ms] ease-[cubic-bezier(0.5,0,0,1)] w-[40px] h-[40px] group-hover:right-0 group-hover:w-full group-hover:h-full group-hover:rounded-[10px] z-0"></div>

            <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between w-full h-full px-[10px] z-10 relative">
              <span className="text-[#1a1a1a] text-[18px] font-medium ml-[8px] relative z-10 transition-colors duration-[400ms] ease-[cubic-bezier(0.17,0.67,0.3,1.33)] group-hover:text-white">
                Report Issue
              </span>
              <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden relative z-10 pointer-events-none">
                <img src={user?.photoURL ? user.photoURL : userAvatar} alt="User" className="w-full h-full object-cover" />
              </div>
            </a>
          </div>
        </div>
      </nav>


      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out font-sans ${isMobileMenuOpen ? 'bg-[#8ED462] pointer-events-auto' : 'bg-transparent pointer-events-none h-auto'
          }`}
      >
        <div className="flex flex-col p-4 pointer-events-auto">

          <div className="bg-white rounded-[10px] shadow-sm px-[12px] py-[8px] flex items-center justify-between min-h-[61px]">
            <Link to="/" className="flex items-center gap-2 pl-1">
              <img src={logo} alt="NagrikEye" className="h-[24px] w-auto" />
              <span className="text-[18px] font-medium text-[#1a1a1a]">NagrikEye</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenReport}
                className="bg-[#F5F1E4] hover:bg-[#ebe5d5] text-[#1a1a1a] px-4 py-2 rounded-[8px] text-[15px] font-medium transition-colors"
                style={{ borderRadius: '8px' }}
              >
                Report
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${isMobileMenuOpen ? 'bg-[#8ED462] text-[#0b3b08]' : 'bg-[#8ED462] text-[#0b3b08]'
                  }`}
              >
                {isMobileMenuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>


          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'
              }`}
          >
            <div className="bg-white rounded-[10px] shadow-sm flex flex-col py-2">
              <a href="#reports" className="px-5 py-3 text-[18px] font-medium text-[#1a1a1a] border-b border-gray-100 hover:bg-gray-50 flex items-center justify-between">
                Recent Reports
              </a>
              <a href="#" className="px-5 py-3 text-[18px] font-medium text-[#1a1a1a] border-b border-gray-100 hover:bg-gray-50 flex items-center justify-between">
                Map
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </a>
              <a href="#" className="px-5 py-3 text-[18px] font-medium text-[#1a1a1a] border-b border-gray-100 hover:bg-gray-50 flex items-center justify-between">
                Insights
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </a>
              <a href="#" className="px-5 py-3 text-[18px] font-medium text-[#1a1a1a] hover:bg-gray-50">
                About
              </a>
            </div>
          </div>


          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] delay-75 overflow-hidden ${isMobileMenuOpen ? 'max-h-[100px] opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'
              }`}
          >
            <div className="bg-[#1a1a1a] rounded-[10px] shadow-sm px-5 py-3 flex items-center justify-between group cursor-pointer">
              <span className="text-[18px] font-medium text-white group-hover:scale-105 transition-transform duration-300">
                {user ? (
                  <button onClick={logout}>Logout</button>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </span>
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center overflow-hidden group-hover:bg-white/20 transition-colors">
                <img src={user?.photoURL ? user.photoURL : userAvatar} alt="Login" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>


        {isMobileMenuOpen && (
          <div className="absolute inset-0 z-[-1]" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}
      </div>
    </>
  );
};

export default Navbar;
