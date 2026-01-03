import React, { useState, useRef, useEffect } from 'react';

const FilterBar = ({ filter, setFilter, sort, setSort }) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef(null);

    const categories = [
        "All",
        "Potholes / Road Damage",
        "Illegal Construction",
        "Stray Cattle",
        "Garbage / Drainage",
        "Other"
    ];

    const sortOptions = [
        { value: "newest", label: "Newest First" },
        { value: "popular", label: "Most Voted" }
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-stone-200">

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat === "All" ? "" : cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${(filter === cat || (cat === "All" && filter === ""))
                            ? "bg-[#339966] text-white shadow-md shadow-green-500/20"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 min-w-[150px] relative" ref={sortRef}>
                <span className="text-sm text-stone-400 font-medium whitespace-nowrap">Sort by:</span>

                <div
                    className="relative min-w-[140px]"
                >
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:border-[#339966] transition-colors shadow-sm cursor-pointer"
                    >
                        {sortOptions.find(opt => opt.value === sort)?.label}
                        <svg
                            className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {isSortOpen && (
                        <div className="absolute top-full right-0 mt-1 w-full min-w-[160px] bg-white border border-stone-100 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSort(option.value);
                                        setIsSortOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${sort === option.value
                                            ? "bg-[#339966]/10 text-[#339966] font-semibold"
                                            : "text-stone-600 hover:bg-stone-50"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
