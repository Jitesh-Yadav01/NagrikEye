import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#1A1A1A] text-[#F5F5F2] py-20 px-4 md:px-12 font-sans relative z-20">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-[#333] pb-12">

                {/* Brand */}
                <div className="md:col-span-2">
                    <h2 className="text-[32px] font-medium tracking-tight mb-6">NagrikEye</h2>
                    <p className="text-[18px] opacity-60 max-w-md leading-relaxed">
                        Empowering citizens of Pimpri-Chinchwad to build a safer, smarter, and more responsive city through AI-driven civic action.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h3 className="text-[14px] font-medium mb-6 opacity-40 uppercase tracking-wider">Platform</h3>
                    <ul className="space-y-4 text-[16px]">
                        <li><a href="#" className="hover:opacity-100 opacity-70 transition-opacity">Home</a></li>
                        <li><a href="#reports" className="hover:opacity-100 opacity-70 transition-opacity">Recent Reports</a></li>
                        <li><a href="#" className="hover:opacity-100 opacity-70 transition-opacity">Our Mission</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-[14px] font-medium mb-6 opacity-40 uppercase tracking-wider">Connect</h3>
                    <ul className="space-y-4 text-[16px]">
                        <li><a href="#" className="hover:opacity-100 opacity-70 transition-opacity">Contact Authorities</a></li>
                        <li><a href="#" className="hover:opacity-100 opacity-70 transition-opacity">Twitter / X</a></li>
                        <li><a href="#" className="hover:opacity-100 opacity-70 transition-opacity">LinkedIn</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto pt-8 flex flex-col md:flex-row justify-between items-center opacity-40 text-sm">
                <p>&copy; {new Date().getFullYear()} NagrikEye. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
