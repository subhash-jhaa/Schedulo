'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Globe, LayoutDashboard, Settings, Users } from 'lucide-react';
import { DASHBOARD_STATS } from './constants';

export default function LandingDashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative -mt-48 md:-mt-64 z-20 max-w-[1200px] mx-auto px-4 md:px-6 mb-32"
    >
      <div className="bg-white/40 backdrop-blur-2xl border border-white/60 p-2 md:p-3 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.1)]">
        <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 flex flex-col md:flex-row h-[500px] md:h-[700px] shadow-sm">
          <div className="hidden md:flex w-64 bg-[#f8fafc] flex-col border-r border-slate-100 p-4">
            <div className="flex items-center gap-2 px-2 mb-8 mt-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Calendar className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900">Workspace</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl shadow-sm border border-slate-100 text-sm font-semibold text-slate-900">
                <LayoutDashboard size={16} className="text-indigo-600" /> Overview
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                <Clock size={16} /> Meeting Insights
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                <Users size={16} /> Team Analytics
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                <Globe size={16} /> Routing Forms
              </div>
            </div>

            <div className="mt-auto space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                <Settings size={16} /> Settings
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
              <div className="font-semibold text-slate-900 text-lg">Overview</div>
              <div className="flex items-center gap-4">
                <button className="text-sm text-slate-500 font-medium flex items-center gap-1 border border-slate-200 py-1.5 px-3 rounded-lg hover:bg-slate-50">
                  <Calendar size={14} /> Last 30 Days
                </button>
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                  A
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Performance</h2>
              <p className="text-sm text-slate-500 mb-8">Track how your scheduling links are performing across channels.</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {DASHBOARD_STATS.map((stat) => (
                  <div key={stat.label} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="text-sm text-slate-500 mb-2">{stat.label}</div>
                    <div className="flex items-end gap-3">
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-xs font-medium mb-1 text-emerald-600">{stat.trend}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-slate-100 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-8">
                  <div className="font-semibold text-slate-900">Weekly Volume</div>
                  <div className="flex gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" /> Outlook
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-sky-400" /> Google
                    </div>
                  </div>
                </div>

                <div className="h-48 w-full relative">
                  <svg viewBox="0 0 800 200" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                    {[0, 50, 100, 150, 200].map((y) => (
                      <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    ))}
                    <path d="M0,150 Q100,120 200,140 T400,80 T600,100 T800,40" fill="none" stroke="#6366f1" strokeWidth="3" />
                    <path
                      d="M0,150 Q100,120 200,140 T400,80 T600,100 T800,40 L800,200 L0,200 Z"
                      fill="url(#gradient)"
                      opacity="0.1"
                    />
                    <path
                      d="M0,180 Q100,160 200,170 T400,130 T600,150 T800,90"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />

                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute top-[20%] left-[50%] w-3 h-3 bg-indigo-600 border-2 border-white rounded-full shadow-md" />
                  <div className="absolute top-[5%] left-[50%] -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded-md font-medium shadow-xl">
                    Feb 18: 42 Bookings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
