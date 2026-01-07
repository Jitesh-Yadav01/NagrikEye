import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import smartCityImg from '../assets/smartcity.png';
import civicImg from '../assets/civic.png';
import ReportPopup from '../components/ReportPopup';
import Posts from './Posts';
import MapSection from '../components/MapSection';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    const container = useRef();
    const [isReportOpen, setIsReportOpen] = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.hero-line', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power4.out',
            delay: 0.2
        });

        tl.from('.hero-subhead', {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        }, '-=0.5');

        tl.from('.hero-image', {
            y: 30,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        }, '-=0.8');

        const section2Tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.section-2-trigger',
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            }
        });

        section2Tl.from('.section-2-content', {
            y: 50,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
            .from('.sc-image', {
                x: -50,
                autoAlpha: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.sc-title', {
                y: 30,
                autoAlpha: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.sc-desc', {
                y: 20,
                autoAlpha: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.sc-btn', {
                y: 20,
                autoAlpha: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.6');

    }, { scope: container });

    return (
        <div ref={container} className="w-full font-sans relative select-none" onContextMenu={(e) => e.preventDefault()} onCopy={(e) => e.preventDefault()}>
            <Navbar onOpenReport={() => setIsReportOpen(true)} />

            <section
                className="sticky top-0 w-full h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center z-0"
                style={{
                    background: 'radial-gradient(circle at 50% 40%, #a6e676 0%, #8ed462 100%)',
                    backgroundColor: '#8ed462'
                }}
            >

                <h1 className="text-[#2c2e2a] font-medium leading-[0.9] tracking-[-0.04em] mb-6 text-[clamp(60px,10vw,150px)]">
                    <div className="overflow-hidden">
                        <div className="hero-line">AI-Driven</div>
                    </div>
                    <div className="overflow-hidden">
                        <div className="hero-line">Civic Action</div>
                    </div>
                </h1>

                <div className="overflow-hidden">
                    <p className="hero-subhead text-[#2c2e2a] text-[17px] font-medium tracking-wide mb-12">
                        Empowering Citizens, Enabling Authorities
                    </p>
                </div>

                <div className="w-full max-w-4xl h-75 flex items-end justify-center">
                    <div className="relative w-full h-full">
                        <img
                            src={civicImg}
                            alt="Civic Action Overview"
                            className="hero-image w-full h-full object-contain object-bottom"
                        />
                    </div>
                </div>
            </section>

            <section id="mission" className="section-2-trigger relative w-full bg-[#F5F5F2] rounded-t-[50px] pt-32 pb-24 px-4 lg:px-12 z-10 shadow-[-10px_-10px_30px_rgba(0,0,0,0.05)] min-h-screen">

                <div className="section-2-content max-w-325 mx-auto mb-32">
                    <h2 className="text-[#2c2e2a] text-[28px] lg:text-[40px] leading-[1.2] font-medium max-w-3xl">
                        NagrikEye transforms everyday complaints into data-driven insights for faster decision-making, improved urban safety, and better governance.
                    </h2>
                </div>

                <div className="max-w-325 mx-auto grid lg:grid-cols-2 gap-12 items-center">

                    <div className="hidden lg:flex justify-center">
                        <img src={smartCityImg} alt="Smart City AI Analysis" className="sc-image w-full max-w-200 h-auto object-contain drop-shadow-xl" />
                    </div>

                    <div className="flex flex-col items-start text-left">
                        <h3 className="sc-title text-[50px] lg:text-[80px] leading-[0.95] font-medium text-[#2c2e2a] mb-6 tracking-tight">
                            Smart City. <br /> Smarter Action.
                        </h3>
                        <p className="sc-desc text-[18px] lg:text-[20px] text-[#2c2e2a] leading-relaxed mb-8 max-w-lg opacity-80">
                            Report unsafe construction, potholes, and traffic risks anonymously. Our AI analyzes and prioritizes issues so authorities can act where it matters most.
                        </p>

                        <div className="flex flex-wrap gap-4">

                            <button
                                onClick={() => setIsReportOpen(true)}
                                className="sc-btn px-8 py-3 bg-black text-white font-medium text-[16px] rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                Report Issue
                            </button>
                        </div>
                    </div>

                </div>

            </section>

            <Posts />
            <MapSection />
            <Footer />

            <ReportPopup isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
        </div>
    );
};

export default LandingPage;
