import React from 'react';
import { useNavigate } from 'react-router-dom';
import vistaLogo from '../assets/vista.png';
import visLogo from '../assets/vislogo.png';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header 
      className="shadow-sm" 
      style={{ 
        backgroundImage: `url(${vistaLogo})`, 
        backgroundSize: '400px auto', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        backgroundColor: '#000000', 
        width: '100vw', 
        height: '100px', 
        marginLeft: 'calc(-50vw + 50%)', 
        marginRight: 'calc(-50vw + 50%)' 
      }}
    >
      <div className="w-full h-full py-4 flex items-center justify-between" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
        <div className="flex items-center space-x-3">
          <img src={visLogo} alt="Vista Logo" className="h-24 w-auto" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Vista</h1>
            <p className="text-sm text-white/90 drop-shadow-md">Smart City Advisory</p>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="transition-all duration-200 px-4 py-2 rounded-[8px] hover:shadow-md" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}
        >
          <i className="fas fa-arrow-left mr-2"></i>
          <span className="hidden md:inline">Back</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
