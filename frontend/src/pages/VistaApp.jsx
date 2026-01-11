import React, { useState, useEffect, useRef } from 'react';
import { AppStateProvider } from '../vista-context/AppStateContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import vistaLogo from '../assets/vista.svg';
import LoadingScreen from '../components/LoadingScreen';
import VistaFooter from '../vista-components/Footer.jsx';
import Header from '../vista-components/Header.jsx';

const VistaApp = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mainContentRef = useRef(null);

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
    if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const vistaMenuItems = [
    {
        name: 'Overview', path: '/vista', icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        )
    },
    {
        name: 'Weather', path: '/vista/weather', icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.6 6A5 5 0 0 0 10 2a5 5 0 0 0-7.6 6.4c-.1.5-.1 1 0 1.5A5.5 5.5 0 0 0 1 14.5 5.5 5.5 0 0 0 6.5 20h11A5.5 5.5 0 0 0 23 14.5a5.5 5.5 0 0 0-2.4-4.8c.4-1.1.4-2.4 0-3.6z"></path></svg>
        )
    },
    {
        name: 'Forecast', path: '/vista/forecast', icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        )
    },
    {
        name: 'AI Assistant', path: '/vista/ai', icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path><path d="M12 18a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2z"></path><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path></svg>
        )
    },
    {
        name: 'AI History', path: '/vista/ai-history', icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        )
    }
  ];

  const vistaLogoContent = (
      <Link to="/vista" className="flex items-center gap-0">
           <img src={vistaLogo} alt="Vista" className="h-22 w-22 object-contain" />
           <span className="text-white font-semibold text-xl tracking-tight">Vista</span>
      </Link>
  );

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <AppStateProvider>
      <div className="min-h-screen bg-[#F5F5F2] font-sans flex text-[#1a1a1a]">
        <Sidebar 
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onLogout={() => navigate('/login')}
            isMobile={isMobile}
            menuItems={vistaMenuItems}
            logoContent={vistaLogoContent}
            backgroundColor="#000000"
        />
        
        <main
            ref={mainContentRef}
            className="flex-1 transition-all duration-500 ease-in-out w-full overflow-y-auto h-screen flex flex-col justify-between"
            style={{ marginLeft: isMobile ? '0px' : (isSidebarCollapsed ? '80px' : '280px') }}
        >
             <Header isMobile={isMobile} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

             <div className="flex-1">
                <Outlet />
             </div>
             <VistaFooter />
        </main>
      </div>
    </AppStateProvider>
  );
};

export default VistaApp;
