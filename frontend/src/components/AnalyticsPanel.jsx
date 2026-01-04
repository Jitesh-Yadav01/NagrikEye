import React, { useMemo } from 'react';

const AnalyticsPanel = ({ reports }) => {
    const analytics = useMemo(() => {
        const categories = {};
        const total = reports.length;

        reports.forEach(r => {
            const cat = r.selectedCategory || 'General';
            categories[cat] = (categories[cat] || 0) + 1;
        });

        return Object.entries(categories)
            .map(([name, count]) => ({
                name,
                count,
                percentage: total > 0 ? (count / total) * 100 : 0
            }))
            .sort((a, b) => b.count - a.count);
    }, [reports]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 h-full">
            <h3 className="text-lg font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8ED462]">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
                Issues by Category
            </h3>

            <div className="space-y-4">
                {analytics.map((item, index) => (
                    <div key={item.name} className="relative group">
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-medium text-stone-700">{item.name}</span>
                            <span className="text-stone-400 font-mono text-xs">{item.count}</span>
                        </div>
                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#1a1a1a] rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: `${item.percentage}%`,
                                    transitionDelay: `${index * 0.1}s`,
                                    backgroundColor: index === 0 ? '#1a1a1a' : index === 1 ? '#4a4a4a' : '#8ED462'
                                }}
                            />
                        </div>
                    </div>
                ))}

                {analytics.length === 0 && (
                    <div className="text-center text-stone-400 py-8 text-sm">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPanel;
