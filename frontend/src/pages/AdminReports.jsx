import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AdminReports = () => {
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
    const [selectedReport, setSelectedReport] = useState(null);

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
        if (loading || !container.current) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.page-header', {
            y: -20, opacity: 0, duration: 0.6
        })
            .from('.controls-grid', {
                y: 20, opacity: 0, duration: 0.6, stagger: 0.1
            }, '-=0.3');

    }, { scope: container, dependencies: [loading] });

    useGSAP(() => {
        if (loading || !container.current) return;

        const rows = container.current.querySelectorAll('.report-row');
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
            console.error(error);
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
                            <h1 className="text-4xl font-bold tracking-tight mb-2">Reports Management</h1>
                            <p className="text-stone-500">View, filter, and manage all citizen reports</p>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button onClick={handleExport} className="flex-1 md:flex-none justify-center px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="controls-grid grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-50">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border-none shadow-sm focus:ring-2 focus:ring-[#8ED462] outline-none transition-all"
                            />
                            <svg className="absolute left-4 top-3.5 text-stone-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>

                        <div className="flex bg-white p-1 rounded-xl shadow-sm">
                            {['all', 'pending', 'resolved'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${statusFilter === status
                                        ? 'bg-black text-white shadow-md'
                                        : 'text-stone-500 hover:bg-stone-50'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        <div className="relative z-50" ref={dropdownRef}>
                            <button
                                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                className="w-full px-4 py-3 bg-white rounded-xl shadow-sm flex items-center justify-between hover:bg-stone-50 transition-colors group"
                            >
                                <span className={`text-sm font-medium ${categoryFilter === 'all' ? 'text-stone-500' : 'text-[#1a1a1a]'}`}>
                                    {categoryFilter === 'all' || categoryFilter === 'All Categories' ? 'Filter by Category' : categoryFilter}
                                </span>
                                <svg
                                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className={`text-stone-400 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {isCategoryDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setCategoryFilter(cat);
                                                setIsCategoryDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 transition-colors flex items-center justify-between ${categoryFilter === cat ? 'bg-stone-50 text-[#8ED462] font-medium' : 'text-stone-600'
                                                }`}
                                        >
                                            {cat}
                                            {categoryFilter === cat && (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-stone-50 border-b border-stone-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Issue</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {filteredReports.map((report) => (
                                        <tr
                                            key={report.id}
                                            onClick={() => setSelectedReport(report)}
                                            className="report-row hover:bg-stone-50/50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {(report.imageFile || report.imageUrl || report.image) ? (
                                                        <img src={report.imageFile || report.imageUrl || report.image} alt="Issue" className="w-12 h-12 rounded-lg object-cover shadow-sm bg-stone-200" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-[#1a1a1a] line-clamp-1">{report.description || 'No description'}</div>
                                                        <div className="text-xs text-stone-400 font-mono mt-1">ID: {report.id.slice(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
                                                    {report.selectedCategory || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-stone-600 max-w-[200px] truncate" title={report.location}>
                                                {report.location || 'Unknown Location'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-stone-500 font-mono">
                                                {report.createdAt?.toDate().toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${!report.status || report.status === 'pending'
                                                    ? 'bg-orange-50 text-orange-600 border-orange-100'
                                                    : 'bg-[#8ED462]/10 text-green-700 border-[#8ED462]/20'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${!report.status || report.status === 'pending' ? 'bg-orange-500' : 'bg-green-600'
                                                        }`}></span>
                                                    {(!report.status || report.status === 'pending') ? 'Pending' : 'Resolved'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {(!report.status || report.status === 'pending') ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusUpdate(report.id, 'resolved');
                                                        }}
                                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a1a1a] text-white hover:bg-green-600 transition-colors shadow-sm"
                                                    >
                                                        Mark Resolved
                                                    </button>
                                                ) : (
                                                    <span className="text-xs font-medium text-stone-400 flex items-center justify-end gap-1">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                                        Completed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredReports.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-stone-500">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                                    </div>
                                                    <p>No reports found matching your filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {selectedReport && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedReport(null)}
                    ></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                        <div className="relative h-64 bg-stone-100">
                            {(selectedReport.imageFile || selectedReport.imageUrl || selectedReport.image) ? (
                                <img
                                    src={selectedReport.imageFile || selectedReport.imageUrl || selectedReport.image}
                                    alt="Issue Detail"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-400">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                </div>
                            )}
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 uppercase tracking-wider">
                                            {selectedReport.selectedCategory || 'General'}
                                        </span>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${!selectedReport.status || selectedReport.status === 'pending'
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'bg-[#8ED462]/20 text-green-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${!selectedReport.status || selectedReport.status === 'pending' ? 'bg-orange-500' : 'bg-green-600'}`}></span>
                                            {(!selectedReport.status || selectedReport.status === 'pending') ? 'Pending' : 'Resolved'}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">{selectedReport.description}</h2>
                                    <div className="flex items-center gap-2 text-stone-500 text-sm">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        {selectedReport.location}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 border-t border-stone-100 pt-6">
                                <div>
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Reported On</p>
                                    <p className="font-medium text-[#1a1a1a]">
                                        {selectedReport.createdAt?.toDate().toLocaleString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Report ID</p>
                                    <p className="font-mono text-sm text-[#1a1a1a]">{selectedReport.id}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                {(!selectedReport.status || selectedReport.status === 'pending') ? (
                                    <button
                                        onClick={() => {
                                            handleStatusUpdate(selectedReport.id, 'resolved');
                                            setSelectedReport({ ...selectedReport, status: 'resolved' });
                                        }}
                                        className="w-full sm:w-auto px-6 py-3 bg-[#1a1a1a] text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg active:scale-95"
                                    >
                                        Mark as Resolved
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-3 rounded-xl">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                        Issue Resolved
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default AdminReports;
