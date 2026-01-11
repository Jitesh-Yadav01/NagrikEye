import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vistaLogo from '../assets/vista.png';
import visLogo from '../assets/vislogo.png';

const Header = ({ isMobile, toggleSidebar }) => {
  const navigate = useNavigate();
  const isDesktop = !isMobile;

  return (
    <header
      className="relative shadow-sm"
      style={{
        backgroundColor: '#000000',
        width: '100%',
        height: '100px',
        ...(isDesktop
          ? {
              backgroundImage: `url(${vistaLogo})`,
              backgroundSize: '400px auto',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }
          : {})
      }}
    >
      {isDesktop && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src={vistaLogo} alt="" className="h-full max-h-[120px] w-auto object-contain opacity-2" />
        </div>
      )}

      <div className="relative w-full h-full py-4 flex items-center justify-between" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
        <div className="flex items-center space-x-3">
          <img src={visLogo} alt="Vista Logo" className="h-24 w-auto" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Vista</h1>
            <p className="text-sm text-white/90 drop-shadow-md">Smart City Advisory</p>
          </div>
        </div>
        
        {isMobile ? (
           <button
             onClick={toggleSidebar}
             className="text-white p-2"
           >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
             </svg>
           </button>
        ) : (
            <button
              onClick={() => navigate('/')}
              className="transition-all duration-200 px-4 py-2 rounded-[8px] hover:shadow-md cursor-pointer"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              <span>Back</span>
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;
