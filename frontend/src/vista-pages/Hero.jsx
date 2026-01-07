import React, { useEffect } from 'react';
import { useAppState } from '../vista-context/AppStateContext.jsx';
import LocationSection from '../vista-components/LocationSection.jsx';
import AlertBanner from '../vista-components/AlertBanner.jsx';
import CurrentWeather from '../vista-components/CurrentWeather.jsx';
import Forecast from '../vista-components/Forecast.jsx';
import Advice from '../vista-components/Advice.jsx';

const Hero = () => {
  const { detectLocation } = useAppState();

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return (
    <main className="flex-1 w-full py-8 space-y-10" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
      <div className="w-full mx-0 space-y-10">
        <LocationSection />
        <AlertBanner />
        <CurrentWeather />
        <Forecast />
        <Advice />
      </div>
    </main>
  );
};

export default Hero;
