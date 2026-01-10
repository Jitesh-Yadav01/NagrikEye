import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '../hooks/useSidebar';

const AdminAI = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("");
    const [analyzing, setAnalyzing] = useState(false);


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionIdFromUrl = queryParams.get('session');

    const [currentSessionId, setCurrentSessionId] = useState(sessionIdFromUrl || null);
    const [chatHistory, setChatHistory] = useState([]);

    const [input, setInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);

    const { isSidebarCollapsed, toggleSidebar, isMobile } = useSidebar();

    const [summaryRange, setSummaryRange] = useState('daily');
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const chatEndRef = useRef(null);
    const API_KEY = import.meta.env.VITE_OPEN_ROUTER_API?.trim();

    const formatReportsForAI = (data) => {
        return data.slice(0, 50).map(r =>
            `- [${r.status || 'Pending'}] ${r.selectedCategory}: ${r.description} (${r.location}) - ${r.createdAtDate?.toLocaleDateString()}`
        ).join('\n');
    };

    const cleanAIResponse = (text) => {
        return text.replace(/<s>/g, '')
            .replace(/<\/s>/g, '')
            .replace(/\[INST\]/g, '')
            .replace(/\[\/INST\]/g, '')
            .replace(/\[OUTST\]/g, '')
            .replace(/\[\/OUTST\]/g, '')
            .trim();
    };

    const generateSummary = async (filteredReports, rangeText) => {
        if (!API_KEY) {
            setSummary("API Key required to generate analysis.");
            return;
        }
        setAnalyzing(true);
        const reportText = formatReportsForAI(filteredReports);
        const rangeLabel = rangeText === 'daily' ? 'Today' : rangeText === 'monthly' ? 'This Month' : 'Selected Range';

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "NagrikEye"
                },
                body: JSON.stringify({
                    "model": "mistralai/mistral-7b-instruct:free",
                    "messages": [
                        {
                            "role": "system",
                            "content": `You are NagrikEye AI. Analyze these city issues for ${rangeLabel}. Identify top critical areas. 
                            RULES:
                            1. Use standard Markdown formatting (bold **text**, lists -).
                            2. Do NOT use XML tags or special tokens.
                            3. Be concise and professional.`
                        },
                        {
                            "role": "user",
                            "content": reportText || "No new reports found for this period."
                        }
                    ]
                })
            });
            const json = await response.json();
            if (json.choices && json.choices.length > 0) {
                const cleanText = cleanAIResponse(json.choices[0].message.content);
                setSummary(cleanText);
            }
        } catch (error) {
            console.error("Summary error:", error);
        } finally {
            setAnalyzing(false);
        }
    };

    useEffect(() => {

        setCurrentSessionId(sessionIdFromUrl);
    }, [sessionIdFromUrl]);

    useEffect(() => {
        const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAtDate: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
            }));
            setReports(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentSessionId) {
            setChatHistory([]);
            return;
        }
        const q = query(
            collection(db, 'ai_sessions', currentSessionId, 'messages'),
            orderBy('createdAt', 'asc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => doc.data());
            setChatHistory(messages);
        });
        return () => unsubscribe();
    }, [currentSessionId]);

    useEffect(() => {
        if (!loading && reports.length > 0 && !summary && summaryRange === 'daily' && API_KEY) {
            generateSummary(reports, 'daily');
        } else if (!API_KEY && !summary) {
            setSummary("API Key required for new analysis.");
        }
    }, [loading, reports, API_KEY, summary, summaryRange, generateSummary]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    useGSAP(() => {
        gsap.from(".ai-card", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power3.out"
        });
    }, []);

    const createNewSession = async () => {
        try {
            const docRef = await addDoc(collection(db, 'ai_sessions'), {
                createdAt: serverTimestamp(),
                title: "New Chat"
            });
            setCurrentSessionId(docRef.id);
            setChatHistory([]);

        } catch (error) {
            console.error("Error creating session:", error);
        }
    };



    const filterReportsByRange = (data, range) => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (range === 'daily') {
            return data.filter(r => r.createdAtDate >= startOfDay);
        } else if (range === 'monthly') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return data.filter(r => r.createdAtDate >= startOfMonth);
        } else if (range === 'custom' && customStartDate && customEndDate) {
            const start = new Date(customStartDate);
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59);
            return data.filter(r => r.createdAtDate >= start && r.createdAtDate <= end);
        }
        return data.slice(0, 50);
    };

    const handleSummaryFilterChange = (range) => {
        setSummaryRange(range);
        setDropdownOpen(false);
        if (range !== 'custom') {
            const filtered = filterReportsByRange(reports, range);
            generateSummary(filtered, range);
        }
    };

    const handleCustomFilterApply = () => {
        if (customStartDate && customEndDate) {
            const filtered = filterReportsByRange(reports, 'custom');
            generateSummary(filtered, 'custom');
        }
    };





    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !API_KEY) return;

        if (!currentSessionId) {
            await createNewSession();
        }

        const userMsg = input;
        setInput("");
        setChatLoading(true);

        let targetSessionId = currentSessionId;
        if (!targetSessionId) {
            const docRef = await addDoc(collection(db, 'ai_sessions'), {
                createdAt: serverTimestamp(),
                title: userMsg.substring(0, 30) + "..."
            });
            targetSessionId = docRef.id;
            setCurrentSessionId(targetSessionId);
        }

        try {
            await addDoc(collection(db, 'ai_sessions', targetSessionId, 'messages'), {
                role: 'user',
                content: userMsg,
                createdAt: serverTimestamp()
            });

            if (chatHistory.length === 0) {
                await setDoc(doc(db, 'ai_sessions', targetSessionId), {
                    title: userMsg.substring(0, 30) + "..."
                }, { merge: true });
            }

            const reportText = formatReportsForAI(reports);
            const conversation = [
                {
                    "role": "system",
                    "content": `You are NagrikEye AI. Use Markdown. No raw tokens.`
                },
                ...chatHistory.map(m => ({ role: m.role, content: m.content })),
                { "role": "user", "content": `Context:\n${reportText}\n\nQuestion: ${userMsg}` }
            ];

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "NagrikEye"
                },
                body: JSON.stringify({
                    "model": "mistralai/mistral-7b-instruct:free",
                    "messages": conversation
                })
            });

            const json = await response.json();

            if (json.choices && json.choices.length > 0) {
                const aiMsg = cleanAIResponse(json.choices[0].message.content);
                await addDoc(collection(db, 'ai_sessions', targetSessionId, 'messages'), {
                    role: 'assistant',
                    content: aiMsg,
                    createdAt: serverTimestamp()
                });
            }
        } catch (error) {
            console.error("Chat error", error);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F2] font-sans flex text-[#1a1a1a]">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />

            <main
                className="flex-1 p-4 lg:p-8 w-full flex gap-6 h-screen overflow-hidden"
                style={{ marginLeft: isMobile ? '0px' : (isSidebarCollapsed ? '80px' : '280px') }}
            >
                <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">

                    <div className="flex items-center justify-between shrink-0 gap-4">
                        <div className="flex items-center gap-3">
                            {isMobile && (
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 bg-white rounded-lg border border-stone-200 shadow-sm text-[#1a1a1a] active:scale-95 transition-transform"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </svg>
                                </button>
                            )}
                            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
                                <span className="text-[#8ED462]">AI</span> Insight Hub
                            </h1>
                        </div>


                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-sm flex items-center gap-2 text-sm font-medium hover:bg-stone-50 transition-colors"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                {summaryRange === 'daily' ? 'Today' : summaryRange === 'monthly' ? 'This Month' : 'Custom'}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                    <button onClick={() => handleSummaryFilterChange('daily')} className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50">Daily Briefing</button>
                                    <button onClick={() => handleSummaryFilterChange('monthly')} className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50">Monthly Overview</button>
                                    <button onClick={() => handleSummaryFilterChange('custom')} className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50">Custom Range</button>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">

                        <div className="ai-card bg-white rounded-3xl shadow-sm border border-stone-100 flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex flex-col gap-4">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <div className="p-2 bg-[#e9fabe] rounded-lg text-[#5c8a00]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    </div>
                                    {summaryRange === 'custom' ? 'Custom Analysis' : 'Auto-Briefing'}
                                </h2>
                                {summaryRange === 'custom' && (
                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                        <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#8ED462]" />
                                        <span className="text-stone-400">-</span>
                                        <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#8ED462]" />
                                        <button onClick={handleCustomFilterApply} className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors">Analyze</button>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
                                {analyzing ? (
                                    <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-3">
                                        <div className="w-8 h-8 border-4 border-[#8ED462] border-t-transparent rounded-full animate-spin"></div>
                                        <p className="animate-pulse">Analyzing reports...</p>
                                    </div>
                                ) : (
                                    <div className="prose prose-stone prose-sm max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                strong: ({ ...props }) => <span className="font-bold text-[#1a1a1a] bg-[#e9fabe] px-1 rounded-sm" {...props} />,
                                                ul: ({ ...props }) => <ul className="list-disc list-outside ml-4 space-y-1" {...props} />,
                                                li: ({ ...props }) => <li className="pl-1 marker:text-[#8ED462]" {...props} />
                                            }}
                                        >
                                            {summary || "No data available."}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="ai-card bg-white rounded-3xl shadow-sm border border-stone-100 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <div className="p-2 bg-[#e9fabe] rounded-lg text-[#5c8a00]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2-2z"></path></svg>
                                    </div>
                                    Chat Assistant
                                </h2>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                                {(!chatHistory || chatHistory.length === 0) && (
                                    <div className="h-full flex flex-col items-center justify-center text-stone-300 gap-4">
                                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2-2z"></path></svg>
                                        </div>
                                        <p>{!API_KEY ? "Select a conversation from AI History to view" : "Start a new conversation about city data"}</p>
                                    </div>
                                )}
                                {chatHistory.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-[#1a1a1a] text-white rounded-tr-sm'
                                            : 'bg-white border border-stone-100 text-[#1a1a1a] rounded-tl-sm'
                                            }`}>
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    strong: ({ ...props }) => <span className="font-semibold" {...props} />
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div className="flex justify-start animate-in fade-in">
                                        <div className="bg-white border border-stone-100 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center shadow-sm">
                                            <div className="w-2 h-2 bg-[#8ED462] rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-[#8ED462] rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-[#8ED462] rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-100">
                                <div className="relative flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={!API_KEY ? "Read-only mode (No API Key detected)" : "Ask about reports..."}
                                        disabled={!API_KEY}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 pr-14 focus:outline-none focus:border-[#8ED462] focus:bg-white focus:ring-4 focus:ring-[#8ED462]/10 transition-all shadow-sm disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || chatLoading || !API_KEY}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#8ED462] hover:text-black disabled:opacity-50 disabled:bg-stone-200 disabled:text-stone-400 transition-all duration-200"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    </button>
                                </div>
                                {!API_KEY && <p className="text-xs text-stone-400 mt-2 text-center">Read-only mode enabled.</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminAI;
