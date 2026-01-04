import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AnalyticsPanel from '../components/AnalyticsPanel';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { format, subDays, isSameDay, startOfDay } from 'date-fns';

const AdminAnalytics = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const container = useRef();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarCollapsed(true);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reportsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAtDate: doc.data().createdAt?.toDate()
            }));
            setReports(reportsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, navigate]);

    useGSAP(() => {
        if (loading || !container.current) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.page-header', { y: -20, opacity: 0, duration: 0.6 })
            .from('.metrics-card', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
            .from('.chart-section', { y: 20, opacity: 0, duration: 0.6 }, '-=0.2')
            .from('.recent-activity', { x: 20, opacity: 0, duration: 0.6 }, '-=0.4');

    }, { scope: container, dependencies: [loading] });

    const analyticsData = useMemo(() => {
        const total = reports.length;
        const resolved = reports.filter(r => r.status === 'resolved').length;
        const pending = total - resolved;
        const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(startOfDay(new Date()), 6 - i);
            return {
                date,
                label: format(date, 'EEE'),
                count: reports.filter(r => r.createdAtDate && isSameDay(startOfDay(r.createdAtDate), date)).length
            };
        });

        const maxDailyReports = Math.max(...last7Days.map(d => d.count), 1);

        return { total, resolved, pending, resolutionRate, last7Days, maxDailyReports };
    }, [reports]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#F5F5F2]">Loading...</div>;

    return (
        <div ref={container} className="min-h-screen bg-[#F5F5F2] font-sans flex text-[#1a1a1a]">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                onLogout={handleLogout}
                isMobile={isMobile}
            />

            <main
                className="flex-1 transition-all duration-500 ease-in-out p-6 lg:p-12 w-full"
                style={{ marginLeft: isMobile ? '0px' : (isSidebarCollapsed ? '80px' : '280px') }}
            >
                <div className="max-w-[1600px] mx-auto">
                    <div className="page-header mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative">
                        {isMobile && (
                            <div className="w-full flex items-center justify-between mb-2">
                                <button
                                    onClick={() => setIsSidebarCollapsed(false)}
                                    className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm text-[#1a1a1a] active:scale-95 transition-transform"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </svg>
                                </button>
                                <div className="text-sm font-bold text-[#8ED462] tracking-wider uppercase">NagrikEye</div>
                            </div>
                        )}

                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-2">Analytics Overview</h1>
                            <p className="text-stone-500">Visual insights and data trends</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="metrics-card bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                            <div className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-2">Total Reports</div>
                            <div className="text-4xl font-bold text-[#1a1a1a]">{analyticsData.total}</div>
                        </div>
                        <div className="metrics-card bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                            <div className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-2">Resolution Rate</div>
                            <div className="text-4xl font-bold text-[#8ED462]">{analyticsData.resolutionRate}%</div>
                        </div>
                        <div className="metrics-card bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                            <div className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-2">Pending Issues</div>
                            <div className="text-4xl font-bold text-orange-500">{analyticsData.pending}</div>
                        </div>
                        <div className="metrics-card bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                            <div className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-2">Resolved</div>
                            <div className="text-4xl font-bold text-green-600">{analyticsData.resolved}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="chart-section bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                <h3 className="text-lg font-bold mb-6">Reports Trend (Last 7 Days)</h3>
                                <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                                    {analyticsData.last7Days.map((day, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                            <div className="w-full bg-[#F5F5F2] rounded-t-lg relative overflow-hidden h-48 flex items-end">
                                                <div
                                                    className="w-full bg-[#1a1a1a] group-hover:bg-[#8ED462] transition-colors duration-300 rounded-t-lg"
                                                    style={{ height: `${(day.count / analyticsData.maxDailyReports) * 100}%`, minHeight: '4px' }}
                                                ></div>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {day.count}
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-stone-500">{day.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="chart-section">
                                <AnalyticsPanel reports={reports} />
                            </div>
                        </div>

                        <div className="recent-activity bg-white p-6 rounded-2xl shadow-sm border border-stone-100 h-fit">
                            <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                            <div className="space-y-6">
                                {reports.slice(0, 5).map((report) => (
                                    <div key={report.id} className="flex gap-4 group">
                                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200">
                                            {report.status === 'resolved' ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#8ED462]"></div>
                                            ) : (
                                                <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-[#1a1a1a] truncate">{report.description}</div>
                                            <div className="text-xs text-stone-500 mt-0.5">{report.location}</div>
                                            <div className="text-xs text-stone-400 mt-1 font-mono">
                                                {report.createdAtDate ? format(report.createdAtDate, 'MMM d, h:mm a') : 'Unknown Date'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {reports.length === 0 && (
                                    <div className="text-center text-stone-400 py-4 text-sm">No recent activity</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminAnalytics;
