import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import LogoAnimation from './LogoAnimation';

const LoadingScreen = ({ onLoadingComplete }) => {
    const containerRef = useRef(null);

    const handleLogoAnimationComplete = () => {
        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: onLoadingComplete
        });
    };

    return (
        <div
            ref={containerRef}
                className="fixed inset-0 z-100 flex items-center justify-center bg-[#f5f1e4]"
        >
            <LogoAnimation onComplete={handleLogoAnimationComplete} />
        </div>
    );
};

export default LoadingScreen;
