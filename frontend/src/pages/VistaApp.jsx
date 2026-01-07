import React from 'react';
import { AppStateProvider } from '../vista-context/AppStateContext.jsx';
import Header from '../vista-components/Header.jsx';
import VistaFooter from '../vista-components/Footer.jsx';
import Hero from '../vista-pages/Hero.jsx';

const VistaApp = () => {
  return (
    <AppStateProvider>
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F5F5F2' }}>
        <Header />
        <Hero />
        <VistaFooter />
      </div>
    </AppStateProvider>
  );
};

export default VistaApp;
