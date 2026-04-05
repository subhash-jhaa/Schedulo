'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function LandingHero() {
  const router = useRouter();

  return (
    <section className="relative pt-40 md:pt-56 pb-64 overflow-visible bg-white">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2400&auto=format&fit=crop"
          alt="Lush green landscape"
          className="w-full h-[800px] object-cover object-center"
        />
        <div className="absolute inset-0 h-[800px] bg-black/10" />
        <div className="absolute top-0 w-full h-[800px] bg-gradient-to-t from-white via-white/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-5xl md:text-[5rem] leading-[1.05] font-semibold text-white tracking-tight mb-10 drop-shadow-sm"
        >
          Consistent Scheduling
          <br />
          marketing wins.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="max-w-md mx-auto mb-8 relative"
        >
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center p-2 pl-6 shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
            <div className="w-1 h-5 bg-white/50 rounded-full animate-pulse mr-2" />
            <input
              type="text"
              placeholder="Try booking a meeting..."
              className="bg-transparent text-white placeholder:text-white/80 flex-1 outline-none font-medium"
              disabled
            />
            <button className="bg-white text-slate-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="text-base text-white/90 mb-10 max-w-xl mx-auto font-medium drop-shadow-sm leading-relaxed"
        >
          Reach high intent clients by using intelligent scheduling to book meetings faster, with fewer clicks and zero
          friction across every platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button 
            onClick={() => router.push('/register')}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg"
          >
            Get started
          </button>
          <button 
            onClick={() => window.open('https://calendly.com', '_blank')}
            className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-white/30 transition-all shadow-lg"
          >
            View live demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
