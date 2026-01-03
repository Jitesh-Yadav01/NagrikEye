import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Navbar from "../components/Navbar";
import IssueCard from "../components/IssueCard";
import FilterBar from "../components/FilterBar";
import { useAuth } from "../context/AuthContext";
import ReportPopup from "../components/ReportPopup";

const Posts = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Reuse Navbar and Popup logic
  // We need to pass onOpenReport to Navbar so the 'Report' button works there too

  useEffect(() => {
    // Basic query - we'll sort client-side or simple server-side
    // For simplicity with variable filters, let's fetch all (usually limit(50)) and filter/sort client side for this scale
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(fetchedReports);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Device ID logic for anonymous voting
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("nagrikeye_device_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("nagrikeye_device_id", id);
    }
    setDeviceId(id);
  }, []);

  const handleUpvote = async (reportId) => {
    if (!deviceId) return; // Should not happen

    const reportRef = doc(db, "reports", reportId);
    try {
      const reportSnap = await getDoc(reportRef);
      if (reportSnap.exists()) {
        const reportData = reportSnap.data();
        const hasUpvoted = reportData.upvotedBy?.includes(deviceId);

        if (hasUpvoted) {
          // Remove upvote (toggle)
          await updateDoc(reportRef, {
            upvotes: increment(-1),
            upvotedBy: arrayRemove(deviceId)
          });
        } else {
          // Add upvote
          await updateDoc(reportRef, {
            upvotes: increment(1),
            upvotedBy: arrayUnion(deviceId)
          });
        }
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const filteredReports = reports
    .filter((r) => filter ? r.selectedCategory === filter : true)
    .sort((a, b) => {
      if (sort === "popular") {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      // Default newest (already sorted by query, but simple fallback)
      return b.createdAt?.seconds - a.createdAt?.seconds;
    });

  return (
    <div className="min-h-screen bg-[#F5F1E4] font-sans text-[#2c2e2a]">
      {/* Navbar with Report Handler */}
      <Navbar onOpenReport={() => setIsReportOpen(true)} />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-20">

        {/* Header */}
        <div className="mb-8 mt-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2c2e2a] mb-2">Community Feed</h1>
          <p className="text-lg text-stone-500 max-w-2xl">
            Real-time updates on civic issues reported by citizens. Together we build a better city.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
        />

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#339966]"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-2xl border border-stone-200">
            <p className="text-xl text-stone-400 font-medium">No reports found matching your criteria.</p>
            <button
              onClick={() => setFilter("")}
              className="mt-4 text-[#339966] font-bold hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReports.map((report) => (
              <IssueCard
                key={report.id}
                report={report}
                currentUserId={deviceId}
                onUpvote={handleUpvote}
              />
            ))}
          </div>
        )}
      </main>

      {/* Report Popup (Global Access) */}
      <ReportPopup isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  );
};

export default Posts;