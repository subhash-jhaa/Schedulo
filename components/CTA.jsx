'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CTA() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="py-24 px-4 bg-white overflow-hidden">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-[1240px] mx-auto bg-[#F2F8FF] rounded-[48px] p-10 md:p-24 text-center text-[#0B3558] relative overflow-hidden border border-[#D9E6F6] shadow-[0_32px_64px_-16px_rgba(11,53,88,0.08)]"
      >
        {/* Subtle decorative circles as seen in design */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/40 rounded-full blur-3xl pointer-events-none" 
        />
        
        <motion.h2 
          variants={itemVariants}
          className="text-5xl md:text-[82px] font-black mb-8 tracking-tighter leading-[0.95] max-w-4xl mx-auto select-none"
        >
          Try Schedulo for <span className="text-[#006BFF]">free</span>
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-2xl text-[#68819B] mb-12 max-w-2xl mx-auto font-bold leading-relaxed tracking-tight"
        >
          The Hub for every meeting. Create your account today and <br className="hidden md:block" /> start scheduling in minutes.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16 relative z-10"
        >
          <motion.button 
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/register')} 
            className="w-full sm:w-auto bg-[#006BFF] text-white px-10 py-5 rounded-full font-black text-xl shadow-[0_20px_40px_rgba(0,107,255,0.3)] transition-all"
          >
            Sign up for free
          </motion.button>
          <motion.button 
            whileHover={{ y: -4, scale: 1.02, backgroundColor: '#ffffff' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href='mailto:sales@schedulo.app'} 
            className="w-full sm:w-auto border-2 border-[#006BFF] text-[#006BFF] px-10 py-5 rounded-full font-black text-xl bg-[#F2F8FF] shadow-[0_4px_12px_rgba(0,107,255,0.04)] transition-all"
          >
            Talk to sales
          </motion.button>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center gap-10 opacity-30 text-[11px] font-black uppercase tracking-[0.2em] text-[#0B3558] select-none"
        >
          <span>Google</span>
          <span>Microsoft</span>
          <span>Apple</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
