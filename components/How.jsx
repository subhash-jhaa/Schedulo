'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function How() {
  return (
    <section className="py-24">
      <div className="max">
        <div className="mb-16">
          <p className="text-blue text-[13px] font-bold uppercase tracking-widest mb-3">Simple Process</p>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-ink max-w-lg leading-tight">The simplest way to schedule meetings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[ 
            {n:'01',t:'Connect calendars',p:'Sync Google, Outlook, and iCloud.'}, 
            {n:'02',t:'Set availability',p:'Define working hours and buffers.'}, 
            {n:'03',t:'Share link',p:'Send your personal booking link.'} 
          ].map((s,i)=>(
            <motion.div key={i} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }} className="relative bg-bg-subtle border border-border-light rounded-[20px] p-8 group">
              <div className="text-blue font-bold mb-4 flex items-center gap-2">
                <div className="w-4 h-[1.5px] bg-blue" /> STEP {s.n}
              </div>
              <h3 className="font-bold text-lg mb-4 text-ink">{s.t}</h3>
              <p className="text-sm text-ink-body leading-relaxed">{s.p}</p>
              <motion.div className="absolute bottom-0 left-0 h-[3px] bg-blue" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} style={{ originX: 0 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
