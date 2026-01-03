import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const container = useRef();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

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

    useGSAP(() => {
        if (loading) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.dash-header', {
            y: -20,
            opacity: 0,
            duration: 0.6
        })
            .from('.stat-card', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1
            }, '-=0.3')
            .from('.filter-bar', {
                y: 10,
                opacity: 0,
                duration: 0.4
            }, '-=0.2')
            .from('.issue-row', {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05
            }, '-=0.2');

    }, { scope: container, dependencies: [loading] });

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const reportRef = doc(db, 'reports', id);
            await updateDoc(reportRef, { status: newStatus });
        } catch (error) {
            console.error(error);
        }
    };

    const stats = {
        total: reports.length,
        pending: reports.filter(r => !r.status || r.status === 'pending').length,
        resolved: reports.filter(r => r.status === 'resolved').length
    };

    const filteredReports = reports.filter(r => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !r.status || r.status === 'pending';
        return r.status === filter;
    });

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div ref={container} className="min-h-screen bg-[#F5F5F2] font-sans p-6 lg:p-12 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="dash-header flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1a1a1a]">Admin Dashboard</h1>
                        <p className="text-stone-500 mt-1">Manage city issues and track resolution progress.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="stat-card bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                        <h3 className="text-stone-500 font-medium mb-2">Total Issues</h3>
                        <p className="text-4xl font-bold text-[#1a1a1a]">{stats.total}</p>
                    </div>
                    <div className="stat-card bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                        <h3 className="text-stone-500 font-medium mb-2">Pending</h3>
                        <p className="text-4xl font-bold text-orange-500">{stats.pending}</p>
                    </div>
                    <div className="stat-card bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                        <h3 className="text-stone-500 font-medium mb-2">Resolved</h3>
                        <p className="text-4xl font-bold text-green-600">{stats.resolved}</p>
                    </div>
                </div>

                <div className="filter-bar flex gap-2 mb-6 bg-white p-2 rounded-xl w-fit shadow-sm border border-stone-100">
                    {['all', 'pending', 'resolved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f
                                ? 'bg-[#1a1a1a] text-white'
                                : 'text-stone-500 hover:bg-stone-50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/50">
                                    <th className="p-4 font-semibold text-stone-500 text-sm">Issue</th>
                                    <th className="p-4 font-semibold text-stone-500 text-sm">Category</th>
                                    <th className="p-4 font-semibold text-stone-500 text-sm">Location</th>
                                    <th className="p-4 font-semibold text-stone-500 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-stone-500 text-sm">Date</th>
                                    <th className="p-4 font-semibold text-stone-500 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.map((report) => (
                                    <tr key={report.id} className="issue-row border-b border-stone-100 last:border-0 hover:bg-stone-50/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                                                    {report.imageFile ? (
                                                        <img src={report.imageFile} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-stone-200" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-[#1a1a1a] line-clamp-1 max-w-[200px]">
                                                    {report.description || "No description"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded-md text-xs font-bold bg-stone-100 text-stone-600">
                                                {report.selectedCategory || "General"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-stone-600 max-w-[200px] truncate">
                                            {report.location}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${report.status === 'resolved'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {report.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-stone-500">
                                            {report.createdAt?.seconds ? formatDistanceToNow(report.createdAt.toDate(), { addSuffix: true }) : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            {report.status !== 'resolved' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(report.id, 'resolved')}
                                                    className="px-3 py-1.5 bg-[#339966] text-white text-xs font-medium rounded-lg hover:bg-[#2b8056] transition-colors cursor-pointer"
                                                >
                                                    Mark Solved
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredReports.length === 0 && (
                            <div className="p-12 text-center text-stone-400">
                                No reports found in this category.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
