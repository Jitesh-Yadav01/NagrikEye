import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { formatDistanceToNow } from 'date-fns';
import Sidebar from '../components/Sidebar';
import DashboardMap from '../components/DashboardMap';
import AnalyticsPanel from '../components/AnalyticsPanel';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const container = useRef();
    const dropdownRef = useRef(null);

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

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
                ...doc.data()
            }));
            setReports(reportsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useGSAP(() => {
        if (loading) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.dash-header', {
            y: -20, opacity: 0, duration: 0.6
        })
            .from('.content-grid', {
                y: 20, opacity: 0, duration: 0.6, stagger: 0.1
            }, '-=0.3')
            .from('.filter-bar', {
                y: 10, opacity: 0, duration: 0.4
            }, '-=0.2');

    }, { scope: container, dependencies: [loading] });

    useGSAP(() => {
        if (loading || !container.current) return;

        const rows = container.current.querySelectorAll('.issue-row');
        if (rows.length > 0) {
            gsap.fromTo(rows,
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, { scope: container, dependencies: [statusFilter, categoryFilter, searchQuery, reports, loading] });


    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const reportRef = doc(db, 'reports', id);
            await updateDoc(reportRef, { status: newStatus });
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const handleExport = () => {
        const header = ['ID', 'Description', 'Category', 'Location', 'Status', 'Date'];
        const rows = reports.map(r => [
            r.id,
            `"${r.description || ''}"`,
            r.selectedCategory || 'General',
            `"${r.location || ''}"`,
            r.status || 'pending',
            r.createdAt?.toDate().toISOString() || ''
        ]);

        const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'nagrikeye_reports.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const categories = ['All Categories', ...new Set(reports.map(r => r.selectedCategory || 'General'))];

    const stats = {
        total: reports.length,
        pending: reports.filter(r => !r.status || r.status === 'pending').length,
        resolved: reports.filter(r => r.status === 'resolved').length
    };

    const filteredReports = reports.filter(r => {
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'pending' ? (!r.status || r.status === 'pending') : r.status === statusFilter);

        const matchesCategory = categoryFilter === 'all' ||
            (categoryFilter === 'All Categories') ||
            (r.selectedCategory || 'General') === categoryFilter;

        const matchesSearch = searchQuery === '' ||
            (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesStatus && matchesCategory && matchesSearch;
    });

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

                    <div className="dash-header mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative">

                        {/* Mobile Header / Hamburger */}
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
                            <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard Overview</h1>
                            <p className="text-stone-500">Welcome back, Admin</p>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button onClick={handleExport} className="flex-1 md:flex-none justify-center px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="content-grid grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="stat-card bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between h-[160px]">
                                <div>
                                    <span className="text-stone-500 text-sm font-medium uppercase tracking-wider">Total Reports</span>
                                    <h3 className="text-5xl font-bold mt-2">{stats.total}</h3>
                                </div>
                                <div className="text-sm text-stone-400">Lifetime issues reported</div>
                            </div>
                            <div className="stat-card bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between h-[160px]">
                                <div>
                                    <span className="text-stone-500 text-sm font-medium uppercase tracking-wider">Pending</span>
                                    <h3 className="text-5xl font-bold mt-2 text-orange-500">{stats.pending}</h3>
                                </div>
                                <div className="text-sm text-orange-500/60 font-medium">Requires attention</div>
                            </div>
                            <div className="stat-card bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between h-[160px]">
                                <div>
                                    <span className="text-stone-500 text-sm font-medium uppercase tracking-wider">Resolved</span>
                                    <h3 className="text-5xl font-bold mt-2 text-[#8ED462]">{stats.resolved}</h3>
                                </div>
                                <div className="text-sm text-green-600/60 font-medium"> successfully fixed</div>
                            </div>
                        </div>

                        <div id="analytics" className="lg:row-span-2">
                            <AnalyticsPanel reports={reports} />
                        </div>

                        <div className="col-span-1 lg:col-span-2">
                            <DashboardMap reports={reports} />
                        </div>

                    </div>

                    <div className="filter-bar bg-white p-4 rounded-2xl shadow-sm border border-stone-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-40">
                        <div className="flex gap-2 bg-stone-100 p-1 rounded-xl w-full md:w-auto">
                            {['all', 'pending', 'resolved'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300 ${statusFilter === f
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-stone-500 hover:text-stone-700'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">

                            <div className="relative z-50 w-full md:w-[250px]" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-left text-sm font-medium flex items-center justify-between hover:border-black transition-colors focus:border-black shadow-sm"
                                >
                                    <span className="truncate mr-2 block text-[#1a1a1a]">
                                        {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
                                    </span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>

                                {isCategoryDropdownOpen && (
                                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                                        {categories.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => {
                                                    setCategoryFilter(c === 'All Categories' ? 'all' : c);
                                                    setIsCategoryDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#2563EB] hover:text-white transition-colors flex items-center justify-between group ${(categoryFilter === 'all' && c === 'All Categories') || categoryFilter === c
                                                    ? 'bg-[#2563EB] text-white'
                                                    : 'text-[#1a1a1a]'
                                                    }`}
                                            >
                                                {c}
                                                {((categoryFilter === 'all' && c === 'All Categories') || categoryFilter === c) && (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative flex-1 md:w-[300px]">
                                <input
                                    type="text"
                                    placeholder="Search issues..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm outline-none focus:border-black transition-colors"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div id="reports" className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-stone-100 bg-stone-50/50">
                                        <th className="p-5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Issue Detail</th>
                                        <th className="p-5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Category</th>
                                        <th className="p-5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Location</th>
                                        <th className="p-5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Status</th>
                                        <th className="p-5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Reported</th>
                                        <th className="p-5 font-semibold text-stone-500 text-xs uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.map((report) => (
                                        <tr key={report.id} className="issue-row border-b border-stone-100 last:border-0 hover:bg-stone-50/30 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0 shadow-inner">
                                                        {report.imageFile ? (
                                                            <img src={report.imageFile} alt="" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                                    <polyline points="21 15 16 10 5 21"></polyline>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="block font-semibold text-[#1a1a1a] line-clamp-1 max-w-[200px] mb-1">
                                                            {report.description || "No description"}
                                                        </span>
                                                        <span className="text-xs text-stone-400 font-mono">#{report.id.slice(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200">
                                                    {report.selectedCategory || "General"}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 text-sm text-stone-600 max-w-[200px] truncate">
                                                    <svg className="w-4 h-4 text-stone-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {report.location}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${report.status === 'resolved'
                                                    ? 'bg-[#8ED462]/20 text-green-700'
                                                    : 'bg-orange-100/80 text-orange-700'
                                                    }`}>
                                                    <span className={`w-2 h-2 rounded-full ${report.status === 'resolved' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                                    {report.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="p-5 text-sm text-stone-500">
                                                {report.createdAt?.seconds ? formatDistanceToNow(report.createdAt.toDate(), { addSuffix: true }) : '-'}
                                            </td>
                                            <td className="p-5 text-right">
                                                {report.status !== 'resolved' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(report.id, 'resolved')}
                                                        className="px-4 py-2 bg-[#8ED462] text-black text-xs font-bold rounded-xl hover:bg-[#7bc450] transition-transform active:scale-95 shadow-sm shadow-[#8ED462]/20 cursor-pointer"
                                                    >
                                                        Mark Solved
                                                    </button>
                                                )}
                                                {report.status === 'resolved' && (
                                                    <span className="px-4 py-2 text-xs font-medium text-stone-400">
                                                        Completed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredReports.length === 0 && (
                                <div className="p-20 text-center flex flex-col items-center justify-center text-stone-400">
                                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium text-stone-500">No reports found</p>
                                    <p className="text-sm">Try adjusting your search or filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
