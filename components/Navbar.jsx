'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 transition-all duration-300">
      <div className="max-w-[1280px] mx-auto h-full px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform">
              <Calendar size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">Schedulo</span>
          </Link>
          
         
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2.5 text-[15px] font-bold text-[#0b3558] hover:text-[#006bff] transition-colors">
            Log in
          </Link>
          <motion.div whileHover={{ y: -1 }}>
            <Link 
              href="/register"
              className="px-6 py-3 bg-[#006bff] text-white text-[15px] font-bold rounded-full hover:bg-[#004eba] transition-all shadow-lg shadow-blue-500/10 inline-block"
            >
              Get started free
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}


