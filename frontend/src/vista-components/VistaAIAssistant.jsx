import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';

const VistaAIAssistant = ({ onClose }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const chatEndRef = useRef(null);

    const API_KEY = import.meta.env.VITE_OPEN_ROUTER_API?.trim();

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        // 1. Create Data Persistence (Session) if not exists
        let targetSessionId = currentSessionId;
        if (!targetSessionId) {
             try {
                const docRef = await addDoc(collection(db, 'ai_sessions'), {
                    createdAt: serverTimestamp(),
                    title: userMsg.substring(0, 30) + "...",
                    source: 'vista' // This tag allows filtering
                });
                targetSessionId = docRef.id;
                setCurrentSessionId(targetSessionId);
             } catch (err) {
                 console.error("Error creating session", err);
             }
        }

        // 2. Save User Message
        if (targetSessionId) {
            try {
                await addDoc(collection(db, 'ai_sessions', targetSessionId, 'messages'), {
                    role: 'user',
                    content: userMsg,
                    createdAt: serverTimestamp()
                });
            } catch (err) { console.error("Error saving msg", err); }
        }

        if (!API_KEY) {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I cannot connect to the AI service at the moment (API Key missing)." }]);
                setLoading(false);
            }, 500);
            return;
        }

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "NagrikEye Vista"
                },
                body: JSON.stringify({
                    "model": "mistralai/mistral-7b-instruct:free",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are Vista AI, a smart city and agriculture assistant. Help users with weather, crops, and city issues. Be concise."
                        },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { "role": "user", "content": userMsg }
                    ]
                })
            });
            const json = await response.json();
            if (json.choices && json.choices.length > 0) {
                const aiMsg = json.choices[0].message.content;
                setMessages(prev => [...prev, { role: 'assistant', content: aiMsg }]);

                // 3. Save AI Message
                if (targetSessionId) {
                     await addDoc(collection(db, 'ai_sessions', targetSessionId, 'messages'), {
                        role: 'assistant',
                        content: aiMsg,
                        createdAt: serverTimestamp()
                    });
                }
            }
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white text-[#1a1a1a]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#1a1a1a] text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8ED462]"></span>
                    Vista Assistant
                </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        <div className="mb-4">
                            <i className="fas fa-robot text-4xl text-[#8ED462] opacity-50"></i>
                        </div>
                        <p>How can I help you today?</p>
                        <p className="text-sm mt-2">Ask about weather, social recommendations, or local updates of the city.</p>
                    </div>
                )}
                
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-[#1a1a1a] text-white rounded-tr-sm' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                        }`}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-200">
                             <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-[#8ED462] rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-[#8ED462] rounded-full animate-bounce delay-75"></span>
                                <span className="w-1.5 h-1.5 bg-[#8ED462] rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#8ED462] focus:ring-1 focus:ring-[#8ED462] transition-all text-sm"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#1a1a1a] hover:text-[#8ED462] disabled:opacity-50 transition-colors"
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VistaAIAssistant;
