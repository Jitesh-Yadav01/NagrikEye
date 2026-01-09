import React from 'react';
import deniersLogo from '../assets/deniers.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1A1A1A] text-[#F5F5F2] py-20 px-4 md:px-12 font-sans relative z-20">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-[#333] pb-12">
        <div className="md:col-span-2">
          <h2 className="text-[32px] font-medium tracking-tight mb-6">Vista</h2>
          <p className="text-[18px] opacity-60 max-w-md leading-relaxed">
            Smart city advisory updates shaped for  residents.
          </p>
        </div>

        <div>
          <h3 className="text-[14px] font-medium mb-6 opacity-40 uppercase tracking-wider">Platform</h3>
          <ul className="space-y-4 text-[16px]">
            <li><a href="#" className="hover:opacity-100 opacity-70 transition-opacity">Advisories</a></li>
            <li><a href="#" className="hover:opacity-100 opacity-70 transition-opacity">Weather</a></li>
            <li><a href="#" className="hover:opacity-100 opacity-70 transition-opacity">Map View</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[14px] font-medium mb-6 opacity-40 uppercase tracking-wider">Connect</h3>
          <ul className="space-y-4 text-[16px]">
            <li><a href="#" className="hover:opacity-100 opacity-70 transition-opacity">Support</a></li>
            <li><a href="#" className="hover:opacity-100 opacity-70 transition-opacity">Community</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 opacity-40 text-sm">
        <p>© {currentYear} Vista - Smart City Advisory</p>
        <span>Made with ❤️ by Jitesh Yadav</span>
        <div className="flex items-center gap-2 relative group">
          <img src={deniersLogo} alt="Team Deniers" className="h-6 w-auto transition-transform duration-200 ease-out hover:scale-110" />
          <span>Team Deniers</span>
          <div className="fixed inset-0 hidden group-hover:flex items-center justify-center bg-black/97 pointer-events-none z-50">
            <img src={deniersLogo} alt="Team Deniers" className="h-92 w-auto" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
