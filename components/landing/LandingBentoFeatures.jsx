'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import { ROUTING_BARS } from './constants';

export default function LandingBentoFeatures() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-[2.75rem] font-semibold tracking-tight text-slate-900 mb-16 leading-tight"
        >
          Scheduling agents that work
          <br />
          across all channels
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#f8fafc] border border-slate-100 rounded-[2rem] p-8 flex flex-col h-full hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Native Integrations</h3>
            <p className="text-slate-500 text-sm mb-8">Works seamlessly where you already work. Zero configuration required.</p>

            <div className="mt-auto grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 border border-slate-100 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
                  alt="Google Calendar"
                  className="w-8 h-8"
                />
                <span className="text-xs font-semibold text-slate-700">Google Cal</span>
              </div>
              <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 border border-slate-100 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg"
                  alt="Outlook"
                  className="w-8 h-8"
                />
                <span className="text-xs font-semibold text-slate-700">Outlook</span>
              </div>
              <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 border border-slate-100 shadow-sm">
                <Video className="w-8 h-8 text-blue-500" />
                <span className="text-xs font-semibold text-slate-700">Zoom</span>
              </div>
              <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 border border-slate-100 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg"
                  alt="Teams"
                  className="w-8 h-8"
                />
                <span className="text-xs font-semibold text-slate-700">Teams</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#f8fafc] border border-slate-100 rounded-[2rem] p-8 flex flex-col h-full hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Automated Routing</h3>
            <p className="text-slate-500 text-sm mb-8">Send leads to the right rep instantly based on form responses.</p>

            <div className="mt-auto bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-end gap-3 h-32 pt-4">
                {ROUTING_BARS.map((height, index) => (
                  <div key={index} className="flex-1 bg-slate-100 rounded-t-md relative group">
                    <div
                      className={`absolute bottom-0 w-full rounded-t-md transition-all duration-500 ${index === 3 ? 'bg-indigo-600' : 'bg-slate-200 group-hover:bg-indigo-300'}`}
                      style={{ height: `${height}%` }}
                    >
                      {index === 3 ? (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-md font-bold whitespace-nowrap">
                          Peak
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#f8fafc] border border-slate-100 rounded-[2rem] p-8 flex flex-col h-full overflow-hidden relative hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Conversion Lift</h3>
            <p className="text-slate-500 text-sm mb-8">Increase meeting booked rates by reducing friction.</p>

            <div className="mt-auto relative h-40 flex items-center justify-center">
              <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-md">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                <path
                  d="M 10 50 A 40 40 0 0 1 75 15"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="125.6"
                  strokeDashoffset="0"
                />
              </svg>
              <div className="absolute bottom-4 text-center">
                <div className="text-4xl font-bold text-slate-900">80%</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-1">Completion</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
