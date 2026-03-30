'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Mail, MessageSquare, ArrowRight, Share2, Globe, Clock, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: "Share your booking page",
      description: "Share your scheduling link directly with invitees, or embed your availability in an email or on your website.",
      icon: <Share2 size={24} />,
      image: (
        <div className="relative w-full h-112.5 bg-[#F9FAFB] rounded-3xl border border-[#E7EDF6] overflow-hidden shadow-2xl flex items-center justify-center p-8">
          <div className="bg-white rounded-xl shadow-lg border border-[#E7EDF6] w-full max-w-lg overflow-hidden flex flex-col h-80">
            <div className="p-4 border-b border-[#E7EDF6] flex items-center justify-between bg-white">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] font-bold text-[#68819B] bg-[#F8F9FB] px-3 py-1 rounded-full border border-[#E7EDF6]">schedulo.app/amy-smith</div>
              <div className="w-5 h-5 rounded-full bg-[#E7F2FF]" />
            </div>
            <div className="flex-1 flex divide-x divide-[#E7EDF6]">
               <div className="w-1/3 p-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#006BFF] flex items-center justify-center text-white font-bold">AS</div>
                  <div className="space-y-1">
                    <div className="h-3 w-16 bg-[#0B3558] rounded-full opacity-10" />
                    <div className="h-2 w-12 bg-[#0B3558] rounded-full opacity-5" />
                  </div>
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-2">
                       <Clock size={12} className="#68819B" />
                       <div className="h-2 w-10 bg-[#68819B]/10 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                       <Globe size={12} className="#68819B" />
                       <div className="h-2 w-14 bg-[#68819B]/10 rounded-full" />
                    </div>
                  </div>
               </div>
               <div className="flex-1 p-6">
                  <div className="flex justify-between mb-6">
                    <div className="h-4 w-24 bg-[#0B3558] rounded-full opacity-10" />
                  </div>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {[...Array(28)].map((_, i) => (
                      <div key={i} className={h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors }>
                        {i + 1}
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
          <div className="absolute top-1/2 right-12 transform translate-x-1/4 -translate-y-1/2 scale-110">
             <div className="bg-[#E7F2FF] text-[#006BFF] p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#006BFF]/10 rotate-3">
                <div className="w-8 h-8 rounded-lg bg-[#006BFF] text-white flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <div>
                   <div className="text-[10px] font-bold opacity-60">Invite sent!</div>
                   <div className="text-[12px] font-bold">Zoom Link Included</div>
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Reduce no-shows and stay on track",
      description: "Schedule meeting reminders, follow-up emails, or SMS messages to improve meeting attendance and results.",
      icon: <Bell size={24} />,
      image: (
        <div className="relative w-full h-112.5 bg-[#F8F9FA] rounded-3xl border border-[#E7EDF6] overflow-hidden shadow-2xl flex items-center justify-center p-12">
           <div className="grid grid-cols-1 gap-8 w-full max-w-md">
              <div className="space-y-6">
                 <div className="bg-white p-6 rounded-2xl border border-[#E7EDF6] shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <MessageSquare size={16} />
                       </div>
                       <div className="text-sm font-bold text-[#0B3558]">Text Reminder</div>
                    </div>
                    <div className="h-12 w-full bg-[#F8F9FB] rounded-xl flex items-center px-4">
                       <div className="h-2 w-2/3 bg-[#68819B]/10 rounded-full" />
                    </div>
                 </div>
                 <div className="flex justify-center -my-3">
                    <div className="h-8 w-px border-l-2 border-dashed border-[#006BFF]/30" />
                 </div>
                 <div className="bg-[#006BFF] text-white p-6 rounded-2xl shadow-blue-900/10 shadow-xl space-y-4">
                    <div className="flex items-center gap-3">
                       <Clock size={16} />
                       <div className="text-sm font-bold">24 hours before</div>
                    </div>
                 </div>
                 <div className="flex justify-center -my-3">
                    <div className="h-8 w-px border-l-2 border-dashed border-[#006BFF]/30" />
                 </div>
                 <div className="bg-[#0b3558] text-white p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="flex items-center gap-3">
                       <CheckCircle size={16} className="text-emerald-400" />
                       <div className="text-sm font-bold">Attendance confirmed</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F2FF] text-[#006BFF] font-bold text-xs mb-8 uppercase tracking-widest">
              How Schedulo Works
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0B3558] mb-12 leading-[1.1] tracking-tight">
              Simple scheduling, <span className="text-[#006BFF] italic">automated</span>
            </h2>
            
            <div className="space-y-6">
              {tabs.map((tab, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={w-full text-left group cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 }
                >
                  <div className="flex items-start gap-6">
                    <div className={p-4 rounded-xl transition-colors duration-300 }>
                      {tab.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={	ext-2xl font-black mb-3 transition-colors }>{tab.title}</h4>
                      <p className={	ext-lg font-medium leading-relaxed transition-colors }>
                        {tab.description}
                      </p>
                      {activeTab === index && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="mt-6 flex items-center gap-2 text-[#006BFF] font-bold text-sm"
                        >
                          Learn more <ArrowRight size={16} />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {tabs[activeTab].image}
              </motion.div>
            </AnimatePresence>

            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#006BFF]/5 blur-[100px] rounded-full -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 blur-[100px] rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
