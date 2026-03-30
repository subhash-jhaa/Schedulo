'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CTA() {
  const router = useRouter();
  return (
    <section className="py-32 px-4 bg-white">
      <div className="max bg-[#F2F8FF] rounded-[48px] p-24 text-center text-[#0B3558] relative overflow-hidden shadow-lg border border-[#E7EDF6]">
        <div className="absolute top-0 right-0 w-150 h-150 bg-[#006BFF] blur-[160px] opacity-10 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#006BFF] blur-[140px] opacity-10 translate-y-1/2 -translate-x-1/2" />
        
        <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight leading-[0.95] max-w-4xl mx-auto italic">
          Try Schedulo for <span className="text-[#006BFF]">free</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-[#68819B] mb-12 max-w-2xl mx-auto font-bold leading-relaxed">
          The Hub for every meeting. Create your account today and start scheduling in minutes.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12 relative z-10">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')} 
            className="w-full sm:w-auto bg-[#006BFF] text-white px-10 py-6 rounded-full font-black text-xl shadow-xl shadow-blue-500/20"
          >
            Sign up for free
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,107,255,0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href='mailto:sales@schedulo.app'} 
            className="w-full sm:w-auto border-2 border-[#006BFF] text-[#006BFF] px-10 py-6 rounded-full font-black text-xl hover:bg-[#F2F8FF] transition-colors"
          >
            Talk to sales
          </motion.button>
        </div>
        
        <div className="flex items-center justify-center gap-6 opacity-30 text-sm font-black uppercase tracking-widest text-[#0B3558]">
          <span>Google</span>
          <span>Microsoft</span>
          <span>Apple</span>
        </div>
      </div>
    </section>
  );
}
