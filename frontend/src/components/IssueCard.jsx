import React from "react";
import { formatDistanceToNow } from "date-fns";

const IssueCard = ({ report, onUpvote, currentUserId }) => {
    const {
        imageFile,
        location,
        selectedCategory,
        description,
        upvotes,
        createdAt,
        id,
        parentId, // User ID who posted
        status = "pending",
        upvotedBy = [] // Array of user IDs who upvoted
    } = report;

    // Check if current user has upvoted
    const hasUpvoted = currentUserId && upvotedBy.includes(currentUserId);

    // Format date if it exists (Firestore timestamp)
    const timeAgo = createdAt?.toDate
        ? formatDistanceToNow(createdAt.toDate(), { addSuffix: true })
        : "Just now";

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-48 w-full bg-stone-100 overflow-hidden group">
                {imageFile ? (
                    <img
                        src={imageFile}
                        alt={selectedCategory}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-50">
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </div>
                )}

                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${status === 'resolved'
                    ? 'bg-green-500/90 text-white shadow-lg shadow-green-500/20'
                    : 'bg-yellow-400/90 text-black shadow-lg shadow-yellow-400/20'
                    }`}>
                    {status}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#339966] bg-[#339966]/10 px-2 py-1 rounded-md uppercase">
                        {selectedCategory}
                    </span>
                    <span className="text-xs text-stone-400">{timeAgo}</span>
                </div>

                <h3 className="font-bold text-stone-800 text-lg mb-1 line-clamp-1">{location}</h3>
                <p className="text-stone-500 text-sm mb-4 line-clamp-3 flex-1">
                    {description || "No description provided."}
                </p>

                {/* Footer / Actions */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                        onClick={() => onUpvote(id)}
                        className={`flex items-center gap-2 transition-colors group cursor-pointer ${hasUpvoted ? "text-[#339966]" : "text-stone-500 hover:text-[#339966]"
                            }`}
                        title={hasUpvoted ? "Remove Vote" : "Upvote"}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${hasUpvoted ? "bg-[#339966]/20" : "bg-stone-50 group-hover:bg-[#339966]/10"
                            }`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill={hasUpvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors ${hasUpvoted ? "stroke-[#339966]" : "group-hover:stroke-[#339966]"
                                }`}>
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                        </div>
                        <span className="font-medium text-sm">{upvotes || 0} Votes</span>
                    </button>

                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-stone-400 hover:text-stone-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        View Map
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default IssueCard;
