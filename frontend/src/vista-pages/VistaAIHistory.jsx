import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const VistaAIHistory = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(
            collection(db, 'ai_sessions'), 
            where('source', '==', 'vista'),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAtDate: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
            }));
            setSessions(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const deleteSession = async (e, sessionId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this chat?')) {
            try {
                await deleteDoc(doc(db, 'ai_sessions', sessionId));
            } catch (error) {
                console.error("Error deleting session:", error);
            }
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6">
            <div className="flex items-center gap-3 mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">AI History</h1>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-[#8ED462] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : sessions.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-100 shadow-sm">
                    <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-300">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2-2z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">No history yet</h3>
                    <p className="text-stone-500 mb-6">Start a conversation with the AI Assistant to see it here.</p>
                    <button
                        onClick={() => navigate('/vista/ai')}
                        className="bg-[#1a1a1a] text-white px-6 py-3 rounded-xl hover:bg-[#8ED462] hover:text-black transition-all font-medium"
                    >
                        Start New Chat
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            onClick={() => navigate(`/vista/ai?session=${session.id}`)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-[#8ED462] transition-all cursor-pointer group flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-bold text-lg mb-1 group-hover:text-[#5c8a00] transition-colors text-[#1a1a1a]">{session.title || 'Untitled Chat'}</h3>
                                <div className="flex items-center gap-4 text-sm text-stone-400">
                                    <span className="flex items-center gap-1">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        {session.createdAtDate?.toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        {session.createdAtDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={(e) => deleteSession(e, session.id)}
                                className="p-3 text-stone-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete chat"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VistaAIHistory;
