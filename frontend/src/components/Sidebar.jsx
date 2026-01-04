import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed, toggleSidebar, onLogout }) => {
    const sidebarRef = useRef(null);
    const location = useLocation();

    useGSAP(() => {
        gsap.to(sidebarRef.current, {
            width: isCollapsed ? '80px' : '280px',
            duration: 0.5,
            ease: 'power3.inOut'
        });
    }, [isCollapsed]);

    const menuItems = [
        {
            name: 'Dashboard', path: '/admin-dashboard', icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            )
        },
        {
            name: 'Reports', path: '#reports', icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            )
        },
        {
            name: 'Analytics', path: '#analytics', icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
            )
        }
    ];

    return (
        <div
            ref={sidebarRef}
            className="h-screen bg-[#1a1a1a] text-white fixed left-0 top-0 z-50 overflow-hidden flex flex-col shadow-2xl border-r border-stone-800"
            style={{ width: '280px' }}
        >
            <div className="p-6 flex items-center justify-between h-20">
                <div className={`font-bold text-xl tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                    <span className="text-[#8ED462]">Nagrik</span>Eye
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-stone-800 transition-colors text-stone-400 hover:text-white"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isCollapsed ? (
                            <polyline points="9 18 15 12 9 6"></polyline>
                        ) : (
                            <polyline points="15 18 9 12 15 6"></polyline>
                        )}
                    </svg>
                </button>
            </div>

            <nav className="flex-1 py-8 px-3 space-y-2">
                {menuItems.map((item) => (
                    <div key={item.name} className="relative group">
                        <Link
                            to={item.path}
                            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 ${location.pathname === item.path || (location.hash === item.path)
                                    ? 'bg-[#8ED462] text-black font-medium shadow-lg shadow-[#8ED462]/20'
                                    : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                                }`}
                        >
                            <div className="flex-shrink-0 w-6 h-6">{item.icon}</div>
                            <span
                                className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                                    }`}
                            >
                                {item.name}
                            </span>
                        </Link>
                        {isCollapsed && (
                            <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-stone-800">
                                {item.name}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-stone-800">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-4 px-3 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group"
                >
                    <div className="flex-shrink-0 w-6 h-6">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </div>
                    <span
                        className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                            }`}
                    >
                        Logout
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
