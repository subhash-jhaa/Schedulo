'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#d4e0ed] h-20">
      <div className="max-w-[1280px] mx-auto h-full px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#006bff] rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <span className="text-2xl font-black text-[#0b3558] tracking-tight">Calendly</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-7">
            {['Features', 'Enterprise', 'Pricing', 'Resources'].map((item) => (
              <a key={item} href="#" className="text-[14px] font-bold text-[#476788] hover:text-[#006bff] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 text-[15px] font-bold text-[#0b3558] hover:text-[#006bff] transition-colors">
            Log in
          </button>
          <motion.button 
            whileHover={{ y: -1 }}
            className="px-6 py-3 bg-[#006bff] text-white text-[15px] font-bold rounded-full hover:bg-[#004eba] transition-all shadow-lg shadow-blue-500/10"
          >
            Get started free
          </motion.button>
        </div>
      </div>
    </nav>
  );
}


