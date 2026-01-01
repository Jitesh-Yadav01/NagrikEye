import React, { useState, useEffect, useRef } from "react";
import logo from '../assets/logo.png';
import userAvatar from '../assets/user_avatar.svg';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
            setLocation(data.display_name);
          } else {
            setLocation(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          setLocation(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  useEffect(() => {
    if (isQuoteOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsDropdownOpen(false);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isQuoteOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="w-full fixed top-6 left-0 z-50 px-4 lg:px-6 font-sans">
        <div className="mx-auto flex items-stretch justify-between h-[68px] gap-[24px] max-w-[1306.5px]">
          <div className="flex items-center flex-grow shadow-sm bg-white rounded-[10px] pl-[17px] pr-[10.625px] h-full">
            <a href="#" className="flex items-center gap-2 group mr-auto">
              <span className="flex items-center justify-center">
                <img src={logo} alt="NagrikEye" className="h-[28px] w-auto" />
              </span>
              <span className="hidden lg:flex items-center ml-2">
                <span className="text-[20px] font-medium text-[#1a1a1a] tracking-normal">NagrikEye</span>
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-1 mr-6">
              {[
                { label: 'Report', hasDropdown: false },
                { label: 'Map', hasDropdown: false },
                { label: 'Insights', hasDropdown: true },
                { label: 'About', hasDropdown: false }
              ].map((item) => (
                <div key={item.label} className="relative group flex items-center justify-center px-[24px] h-[46.75px] cursor-pointer">
                  <span className="absolute inset-0 bg-[#F5F1E4] rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400 ease-[cubic-bezier(0.17,0.67,0.3,1.33)] z-0"></span>
                  <div className="relative z-10 flex items-center gap-1.5">
                    <span className="text-[18px] font-medium text-[#2C2E2A]">{item.label}</span>
                    {item.hasDropdown && (
                      <svg className="w-2.5 h-2.5 mt-0.5 text-[#1a1a1a]" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                        <path fill="none" stroke="currentColor" strokeWidth="1.5" d="m1 1 4 4 4-4"></path>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="bg-[#8ED462] rounded-full flex items-center justify-center hover:bg-[#7bc050] text-[#0b3b08] transition-colors flex-shrink-0 w-[40px] h-[40px]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              )}
            </button>
          </div>

          <div
            className="flex items-center justify-between shadow-sm flex-shrink-0 relative overflow-hidden group cursor-pointer bg-white rounded-[10px] h-full min-w-[192px]"
            onClick={() => setIsQuoteOpen(true)}
          >
            <div className="absolute right-[10px] top-1/2 -translate-y-1/2 bg-black rounded-full transition-all duration-[250ms] ease-[cubic-bezier(0.5,0,0,1)] w-[40px] h-[40px] group-hover:right-0 group-hover:w-full group-hover:h-full group-hover:rounded-[10px] z-0"></div>

            <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between w-full h-full px-[10px] z-10 relative">
              <span className="text-[#1a1a1a] text-[18px] font-medium ml-[8px] relative z-10 transition-colors duration-[400ms] ease-[cubic-bezier(0.17,0.67,0.3,1.33)] group-hover:text-white">
                Report Issue
              </span>
              <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden relative z-10 pointer-events-none">
                <img src={userAvatar} alt="User" />
              </div>
            </a>
          </div>

        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white rounded-[10px] p-6 shadow-xl max-w-[1306.5px] mx-auto flex flex-col gap-4">
            <a href="#" className="text-[18px] font-medium text-[#2C2E2A] hover:text-[#8ED462]">Report</a>
            <a href="#" className="text-[18px] font-medium text-[#2C2E2A] hover:text-[#8ED462]">Map</a>
            <a href="#" className="text-[18px] font-medium text-[#2C2E2A] hover:text-[#8ED462]">Insights</a>
            <a href="#" className="text-[18px] font-medium text-[#2C2E2A] hover:text-[#8ED462]">About</a>
            <hr className="border-gray-100" />
            <button onClick={() => setIsQuoteOpen(true)} className="bg-[#8ED462] text-[#0b3b08] px-6 py-3 rounded-full font-bold w-full flex items-center justify-center gap-2">
              Report Issue
            </button>
          </div>
        </div>
      </nav>

      {isQuoteOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={() => setIsQuoteOpen(false)}></div>
          <div className="relative w-full h-auto max-h-[90vh] bg-[#F5F1E4] rounded-t-[50px] shadow-2xl overflow-y-auto animate-slide-up flex flex-col">
            <button
              onClick={() => setIsQuoteOpen(false)}
              className="absolute w-12 h-12 bg-[#F5E84E] rounded-full flex items-center justify-center hover:bg-[#ebd040] transition-colors z-50 shadow-sm top-[21.25px] right-[21.25px]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="w-full max-w-[1300px] mx-auto p-8 lg:p-12 pt-16">
              <h2 className="text-[32px] lg:text-[48px] font-medium text-[#2c2e2a] mb-8 relative inline-block">
                Report a Hazard
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0 6 Q 5 0 10 6 T 20 6 T 30 6 T 40 6 T 50 6 T 60 6 T 70 6 T 80 6 T 90 6 T 100 6" stroke="#8ED462" strokeWidth="3" fill="none" />
                </svg>
              </h2>

              <form className="space-y-8 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-[15px] font-bold text-[#2c2e2a] uppercase tracking-wide">LOCATION OF HAZARD *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Main Street, Pimpri"
                        className="w-full bg-transparent border-b border-black/20 pb-4 text-xl focus:border-black outline-none transition-colors placeholder:text-black/30 pr-10"
                      />
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        className="absolute right-0 top-0 text-black/50 hover:text-[#8ED462] transition-colors p-1"
                        title="Auto-detect Location"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={isLocating ? "animate-spin" : ""}
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="22" y1="12" x2="18" y2="12"></line>
                          <line x1="6" y1="12" x2="2" y2="12"></line>
                          <line x1="12" y1="6" x2="12" y2="2"></line>
                          <line x1="12" y1="22" x2="12" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
                    <label className="text-[15px] font-bold text-[#2c2e2a] uppercase tracking-wide">CATEGORY *</label>
                    <div
                      className="bg-transparent border-b border-black/20 pb-4 text-xl cursor-pointer flex items-center justify-between"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span className={selectedCategory ? "text-black" : "text-black/30"}>
                        {selectedCategory || "Select Category"}
                      </span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-xl mt-2 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
                        {[
                          'Potholes / Road Damage',
                          'Illegal Construction',
                          'Stray Cattle',
                          'Garbage / Drainage',
                          'Other'
                        ].map((option) => (
                          <div
                            key={option}
                            className="px-6 py-3 text-lg hover:bg-[#F5F1E4] cursor-pointer transition-colors text-[#2c2e2a]"
                            onClick={() => {
                              setSelectedCategory(option);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-bold text-[#2c2e2a] uppercase tracking-wide">DESCRIBE THE ISSUE</label>
                  <textarea rows="3" placeholder="Provide details like severity, nearby landmarks..." className="bg-transparent border-b border-black/20 pb-4 text-2xl focus:border-black outline-none transition-colors placeholder:text-black/30 resize-none"></textarea>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-bold text-[#2c2e2a] uppercase tracking-wide">EVIDENCE (OPTIONAL)</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-between cursor-pointer bg-transparent border-b border-black/20 pb-4 text-xl group"
                    >
                      <span className={selectedFile ? "text-black" : "text-black/30"}>
                        {selectedFile ? selectedFile.name : "Upload Photo"}
                      </span>
                      <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center group-hover:bg-[#8ED462] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[#0b3b08]">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors">
                    Submit Report Anonymously
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
};

export default Navbar;
