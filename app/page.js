'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080C10] text-white font-inter relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(circle at 1px 1px, #00D4AA 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#00D4AA] to-[#008A6F] rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,212,170,0.3)]">
            <Calendar className="text-white" size={32} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-syne mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50 text-white">
            Scheduling, simplified.
          </h1>
          
          <p className="max-w-2xl text-xl text-white opacity-60 mb-10 leading-relaxed">
            The professional way to share your availability. Connect your calendar, 
            set your rules, and let Schedulo handle the rest.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#00D4AA] text-black px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-[#00F7C7] transition-all border-none cursor-pointer"
              >
                Get Started for Free <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white bg-opacity-5 border border-white border-opacity-10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-10 transition-all text-white cursor-pointer"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-[#111820] border border-white border-opacity-5 rounded-2xl text-left hover:border-[#00D4AA] hover:border-opacity-30 transition-all group"
          >
            <div className="w-12 h-12 bg-[#080C10] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="text-[#00D4AA]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Sync</h3>
            <p className="text-white opacity-50 leading-relaxed">Deep integration with Google Calendar ensures you're never double-booked.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 bg-[#111820] border border-white border-opacity-5 rounded-2xl text-left hover:border-[#00D4AA] hover:border-opacity-30 transition-all group"
          >
            <div className="w-12 h-12 bg-[#080C10] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="text-[#00D4AA]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Auth</h3>
            <p className="text-white opacity-50 leading-relaxed">Powered by Clerk for enterprise-grade security and session management.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 bg-[#111820] border border-white border-opacity-5 rounded-2xl text-left hover:border-[#00D4AA] hover:border-opacity-30 transition-all group"
          >
            <div className="w-12 h-12 bg-[#080C10] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="text-[#00D4AA]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Custom Rules</h3>
            <p className="text-white opacity-50 leading-relaxed">Set your buffer times, slot durations, and weekly availability with ease.</p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white border-opacity-5 py-10 text-center text-white text-opacity-30 text-sm">
        � 2026 Schedulo. Built for modern professionals.
      </footer>
    </div>
  );
}

