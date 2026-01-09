import React, { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import IssueCard from "../components/IssueCard";
import FilterBar from "../components/FilterBar";
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const Posts = () => {
  const container = useRef();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("newest");
  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const uniqueReports = fetchedReports.filter((report, index, self) =>
        index === self.findIndex((r) => r.id === report.id)
      );
      setReports(uniqueReports);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [deviceId] = useState(() => {
    let id = localStorage.getItem("nagrikeye_device_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("nagrikeye_device_id", id);
    }
    return id;
  });

  const handleUpvote = async (reportId) => {
    if (!deviceId) return;

    const reportRef = doc(db, "reports", reportId);
    try {
      const reportSnap = await getDoc(reportRef);
      if (reportSnap.exists()) {
        const reportData = reportSnap.data();
        const hasUpvoted = reportData.upvotedBy?.includes(deviceId);

        if (hasUpvoted) {
          await updateDoc(reportRef, {
            upvotes: increment(-1),
            upvotedBy: arrayRemove(deviceId)
          });
        } else {
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
    .filter((r) => {
      if (!filter) return true;
      if (filter === "hazard" || filter === "social" || filter === "electricity" || filter === "gas" || filter === "municipal") {
        return r.reportType === filter;
      }
      return r.selectedCategory === filter;
    })
    .sort((a, b) => {
      if (sort === "popular") {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      return b.createdAt?.seconds - a.createdAt?.seconds;
    });

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    tl.fromTo('.posts-header',
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo('.posts-filter',
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );
  }, { scope: container });

  useGSAP(() => {
    if (loading) return;

    gsap.fromTo('.posts-card',
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
        overwrite: 'auto'
      }
    );
  }, { scope: container, dependencies: [loading, filteredReports] });

  return (
    <section ref={container} id="reports" className="w-full bg-[#F5F5F2] pt-0 pb-32 px-4 lg:px-12 relative z-10 font-sans">
      <div className="max-w-350 mx-auto">

        <div className="posts-header mb-12 text-center md:text-left">
          <h2 className="text-[50px] lg:text-[80px] leading-[0.95] font-medium text-[#2c2e2a] mb-6 tracking-tight">Community Feed</h2>
          <p className="text-[18px] lg:text-[20px] text-[#2c2e2a] max-w-2xl leading-relaxed opacity-80">
            Real-time updates on civic issues reported by citizens. Together we build a better city.
          </p>
        </div>

        <div className="posts-filter relative z-50">
          <FilterBar
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#339966]"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
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
              <div key={report.id} className="posts-card h-full">
                <IssueCard
                  report={report}
                  currentUserId={deviceId}
                  onUpvote={handleUpvote}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Posts;