import React, { useEffect } from 'react';
import { useAppState } from '../vista-context/AppStateContext.jsx';
import { useAuth } from '../context/AuthContext';
import LocationSection from '../vista-components/LocationSection.jsx';
import AlertBanner from '../vista-components/AlertBanner.jsx';
const Hero = () => {
  const { detectLocation } = useAppState();
  const { user } = useAuth();

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return (
    <div className="w-full max-w-[1600px] mx-auto p-0 md:p-6 space-y-4 md:space-y-8">
      <div className="flex flex-col gap-1 px-4 md:px-0 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">Overview</h1>
          <p className="text-stone-500">Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-1">Total Locations</div>
            <div className="text-4xl font-bold text-[#1a1a1a] mb-2">12</div>
            <div className="text-stone-400 text-sm">Detected sessions</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-1">Alerts</div>
            <div className="text-4xl font-bold text-orange-500 mb-2">2</div>
            <div className="text-orange-300 text-sm">Active notifications</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-1">Status</div>
            <div className="text-4xl font-bold text-[#8ED462] mb-2">Active</div>
            <div className="text-[#8ED462]/80 text-sm">System operational</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#8ED462] rounded-full"></span>
              Live Geolocation
          </h2>
          <LocationSection />
      </div>

      <AlertBanner />
    </div>
  );
};

export default Hero;
