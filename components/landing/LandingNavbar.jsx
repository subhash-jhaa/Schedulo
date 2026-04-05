'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { MOBILE_NAV_LINKS, NAV_LINKS } from './constants';
import Logo from './Logo';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-50 px-4 pt-6 flex justify-center"
    >
      <nav className="w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-full px-6 py-3 flex justify-between items-center transition-all duration-300">
        <Logo />

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-slate-900 flex items-center gap-1 transition-colors">
              {link.label}
              {link.hasChevron ? <ChevronDown size={14} /> : null}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Log in</button>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all">
            Sign up
          </button>
        </div>

        <button className="md:hidden text-slate-800" onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isOpen && (
        <div className="absolute top-24 left-4 right-4 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-4 shadow-xl md:hidden">
          {MOBILE_NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="font-medium text-slate-800">
              {link.label}
            </a>
          ))}
          <hr className="border-slate-100 my-2" />
          <button className="bg-slate-100 text-slate-900 p-3 rounded-xl font-medium">Log in</button>
          <button className="bg-slate-900 text-white p-3 rounded-xl font-medium">Sign up</button>
        </div>
      )}
    </motion.div>
  );
}
