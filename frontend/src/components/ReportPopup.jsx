import React, { useState, useEffect, useRef } from "react";
import { uploadSingleImage } from "../utils/uploadSingleImage";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";

const ReportPopup = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("Reporting as:", user.uid);
    }
  }, [user]);

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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data && data.display_name) {
            setLocation(data.display_name);
          } else {
            setLocation(
              `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`
            );
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          setLocation(
            `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`
          );
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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setIsDropdownOpen(false);
      if (!isOpen) {
        setIsSubmitted(false);
        resetForm();
      }
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const resetForm = () => {
    setLocation("");
    setSelectedCategory("");
    setDescription("");
    setSelectedFile(null);
  };

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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = user ? user.uid : "anonymous";
    const email = user ? user.email : "anonymous@nagrikeye.com";

    try {
      let imageUrl = "";
      if (selectedFile) {
        imageUrl = await uploadSingleImage(selectedFile, uid);
      }

      await addDoc(collection(db, "reports"), {
        location,
        selectedCategory,
        description,
        upvotes: 0,
        parentId: uid,
        parentEmail: email,
        imageFile: imageUrl,
        createdAt: serverTimestamp(),
      });

      setIsSubmitted(true);
      resetForm();

    } catch (err) {
      console.error("Submission Error:", err);
      alert(`Failed to submit report: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative w-full h-auto max-h-[90vh] bg-[#F5F1E4] rounded-t-[50px] shadow-2xl overflow-y-auto animate-slide-up flex flex-col">
        <button
          onClick={onClose}
          className="absolute w-12 h-12 bg-[#F5E84E] rounded-full flex items-center justify-center hover:bg-[#ebd040] transition-colors z-50 shadow-sm top-[21.25px] right-[21.25px] cursor-pointer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {isSubmitted ? (
          <div className="w-full max-w-[1300px] mx-auto p-12 lg:p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-[#8ED462] rounded-full flex items-center justify-center mb-8 shadow-lg animate-bounce-subtle">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#0b3b08]">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="text-[32px] font-bold text-[#2c2e2a] mb-4">Report Submitted!</h2>
            <p className="text-[18px] text-[#2c2e2a]/80 mb-8 max-w-md">
              Thank you for helping keep our city safe. Your report has been anonymously recorded.
            </p>
            <button
              onClick={onClose}
              className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="w-full max-w-[1300px] mx-auto p-8 lg:p-12 pt-16">
            <h2 className="text-[32px] lg:text-[48px] font-medium text-[#2c2e2a] mb-8 relative inline-block">
              Report a Hazard
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 6 Q 5 0 10 6 T 20 6 T 30 6 T 40 6 T 50 6 T 60 6 T 70 6 T 80 6 T 90 6 T 100 6"
                  stroke="#8ED462"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </h2>

            <form className="space-y-8 max-w-4xl" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[15px] font-bold text-[#2c2e2a] uppercase tracking-wide">
                    LOCATION OF HAZARD *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Main Street, Pimpri"
                      className="w-full bg-transparent border-b border-black/20 pb-4 text-xl focus:border-black outline-none transition-colors placeholder:text-black/30 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      className="absolute right-0 top-0 text-black/50 hover:text-[#8ED462] transition-colors p-1 cursor-pointer"
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
                  <label className="text-[15px] font-bold text-[#2c2e2a] uppercase tracking-wide">
                    CATEGORY *
                  </label>
                  <div
                    className="bg-transparent border-b border-black/20 pb-4 text-xl cursor-pointer flex items-center justify-between"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span
                      className={
                        selectedCategory ? "text-black" : "text-black/30"
                      }
                    >
                      {selectedCategory || "Select Category"}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-xl mt-2 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
                      {[
                        "Potholes / Road Damage",
                        "Illegal Construction",
                        "Stray Cattle",
                        "Garbage / Drainage",
                        "Other",
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
                <label className="text-[15px] font-bold text-[#2c2e2a] uppercase tracking-wide">
                  DESCRIBE THE ISSUE
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide details like severity, nearby landmarks..."
                  className="bg-transparent border-b border-black/20 pb-4 text-2xl focus:border-black outline-none transition-colors placeholder:text-black/30 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[15px] font-bold text-[#2c2e2a] uppercase tracking-wide">
                  EVIDENCE (OPTIONAL)
                </label>
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
                    <span
                      className={selectedFile ? "text-black" : "text-black/30"
                      }
                    >
                      {selectedFile ? selectedFile.name : "Upload Photo"}
                    </span>
                    <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center group-hover:bg-[#8ED462] transition-colors">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:text-[#0b3b08]"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Submit Report Anonymously
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes bounce-subtle {
           0%, 100% { transform: translateY(0); }
           50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
           animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ReportPopup;
