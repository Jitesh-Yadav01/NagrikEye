import React from 'react';

const MapSection = () => {
    return (
        <section id="map" className="w-full bg-[#F5F5F2] pb-32 px-4 lg:px-12 relative z-10 font-sans">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-12 text-center md:text-left">
                    <h2 className="text-[50px] lg:text-[80px] leading-[0.95] font-medium text-[#2c2e2a] mb-6 tracking-tight">
                        Impact Map
                    </h2>
                    <p className="text-[18px] lg:text-[20px] text-[#2c2e2a] max-w-2xl leading-relaxed opacity-80">
                        Visualizing active civic reports across Pimpri-Chinchwad.
                    </p>
                </div>

                <div className="w-full h-[500px] rounded-[30px] overflow-hidden shadow-[-10px_-10px_30px_rgba(0,0,0,0.05)] relative bg-gray-200">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        title="Pimpri Chinchwad Map"
                        src="https://maps.google.com/maps?q=Pimpri-Chinchwad,Pune&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        className="w-full h-full grayscale-[10%] contrast-[1.1]"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default MapSection;
