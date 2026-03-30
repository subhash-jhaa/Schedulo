'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, MapPin, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductFrame() {
  const [selectedSlot, setSelectedSlot] = useState('10:30');
  const slots = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30'];
  return (
    <section className="pb-16 px-4">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max bg-white border border-border-light rounded-[28px] overflow-hidden shadow-2xl">
        <div className="h-10 bg-bg-subtle border-b border-border-light flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 max-w-[400px] h-6 bg-white border border-border-light rounded-md mx-auto flex items-center px-3 text-[11px] text-ink-muted">
            schedulo.app/book/sarah-chen
          </div>
        </div>
        <div className="flex flex-col md:flex-row min-h-[500px]">
          <div className="w-full md:w-[320px] bg-white border-r border-border-light p-8">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue to-[#7C3AED] flex items-center justify-center text-white font-bold text-xl mb-6 shadow-md">SC</div>
            <h3 className="font-bold text-ink text-lg">Sarah Chen</h3>
            <p className="text-ink-muted text-sm mb-4">Product Lead · Acme Corp</p>
            <h2 className="font-extrabold text-ink text-xl mb-8 leading-tight tracking-tight">30-Minute Meeting</h2>
            <div className="space-y-4 mb-8 text-ink-body text-sm">
              <div className="flex items-center gap-3"><Clock size={16} /> 30 minutes</div>
              <div className="flex items-center gap-3"><Calendar size={16} /> Next available: Today</div>
              <div className="flex items-center gap-3"><MapPin size={16} /> Google Meet included</div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0FDF4] border border-[#DCFCE7] text-[#16A34A] text-[12px] font-bold rounded-full"><Check size={12} /> Free · No sign-up needed</div>
          </div>
          <div className="flex-1 p-8 bg-white">
            <div className="flex items-center justify-between mb-8 px-4 font-bold text-ink text-lg">
              <h4>April 2025</h4>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-bg-subtle rounded-full cursor-pointer"><ChevronLeft size={20} /></button>
                <button className="p-2 hover:bg-bg-subtle rounded-full cursor-pointer"><ChevronRight size={20} /></button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4 mb-4 px-4 text-[10px] uppercase font-bold text-ink-muted tracking-widest">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d=><div key={d} className="text-center">{d}</div>)}
            </div>
            <div className="grid grid-cols-5 gap-3 max-h-[380px] overflow-y-auto px-4">
              {slots.map((s,i)=>(
                <button 
                  key={i} 
                  onClick={()=>setSelectedSlot(s)} 
                  className={`py-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer
                    ${selectedSlot === s
                      ? 'bg-blue text-white border-blue'
                      : 'bg-white text-ink-body border-border-light hover:bg-blue-light hover:text-blue hover:border-blue'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-border-light text-center text-[11px] text-ink-muted">
              Times shown in <strong>Asia/Kolkata (IST)</strong>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
