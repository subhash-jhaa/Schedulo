'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Check, Bell, Calendar as CalendarIcon, Clock, Mail, MapPin, ChevronLeft, ChevronRight, Globe, ChevronDown } from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0); // 0 for Scheduling, 1 for Workflows

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === 0 ? 1 : 0));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 0, label: 'Share your booking page' },
    { id: 1, label: 'Reduce no-shows' }
  ];

  const schedulingData = {
    company: "ACME Inc.",
    host: "Fatima Sy",
    meetingType: "Client Check-in",
    duration: "30 min",
    location: "Zoom",
    month: "July 2024",
    selectedDate: 22,
    availableDates: [16, 17, 19, 23, 24, 25],
    timeSlots: ["10:00am", "11:00am", "1:00pm", "2:30pm"]
  };

  const workflowItems = [
    { icon: <Mail size={16} />, title: 'Send reminder', time: '24 hours before', color: 'bg-emerald-50 text-emerald-600' },
    { icon: <CalendarIcon size={16} />, title: 'Update CRM', time: 'Immediately after', color: 'bg-blue-50 text-blue' },
    { icon: <Check size={16} />, title: 'Follow-up email', time: '2 hours after', color: 'bg-orange-50 text-orange-600' }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 26 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.09, duration: 0.6, ease: [0.16, 1, 0.3, 1] } })
  };

  return (
    <section className="bg-white pt-24 pb-48 overflow-hidden relative">
      <div className="max grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0}
          className="relative z-10"
        >
          <h1 className="hero-title">
            Easy <br />
            scheduling <br />
            <span className="text-ink">ahead</span>
          </h1>
          <p className="hero-sub font-bold">
            Join 20 million professionals who easily book meetings with the #1 scheduling tool.
          </p>
          
          <div className="btns-column">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-social bg-blue"
            >
              <div className="social-icon-box">
                 <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
              </div>
              <span className="btn-social-label text-white">Sign up with Google</span>
              <div className="btn-social-spacer" />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-social"
            >
              <div className="social-icon-box p-1.5">
                 <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
              </div>
              <span className="btn-social-label text-ink">Sign up with Microsoft</span>
              <div className="btn-social-spacer" />
            </motion.button>
          </div>

          <div className="or-row">
            <div className="or-line" />
            <span className="or-text">OR</span>
            <div className="or-line" />
          </div>

          <div className="email-row">
            <a href="/register">
              Sign up free with email.
            </a>
            <span>No credit card required</span>
          </div>

          <div className="mt-12">
            <p className="text-sm font-bold text-ink-muted">Trusted by more than <span className="text-ink font-black">100,000</span> of the world&apos;s leading organizations</p>
          </div>
        </motion.div>
        
        <div className="relative hero-right flex flex-col items-center">
          {/* Tabs Control */}
          <div className="flex bg-bg-surface p-1 rounded-2xl mb-8 border border-border-light z-20 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 relative ${
                  activeTab === tab.id ? 'text-blue' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-md border border-border-light -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[640px] aspect-[16/10]"
          >
            <AnimatePresence mode="wait">
              {activeTab === 0 ? (
                <motion.div
                  key="scheduling"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-white rounded-[20px] border border-border-light shadow-2xl overflow-hidden flex flex-col"
                >
                  <div className="px-6 py-4 border-b border-border-light bg-white">
                    <h3 className="text-xl font-black text-ink tracking-tight">Share your booking page</h3>
                  </div>
                  
                  <div className="flex flex-1 divide-x divide-border-light overflow-hidden">
                    {/* Left Profile Section */}
                    <div className="w-[28%] p-4 space-y-4 bg-bg-surface/30">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue rounded flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M13 3l-2 3H3v15h18V3h-8zm6 16H5V8h14v11z"/></svg>
                        </div>
                        <span className="text-[10px] font-black text-ink">{schedulingData.company}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-bg-surface">
                          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-ink-muted">{schedulingData.host}</p>
                          <h4 className="text-sm font-black text-ink leading-tight">{schedulingData.meetingType}</h4>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-ink-muted font-bold text-[10px]">
                          <Clock size={14} /> {schedulingData.duration}
                        </div>
                        <div className="flex items-center gap-2 text-ink-muted font-bold text-[10px]">
                          <MapPin size={14} /> {schedulingData.location}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 opacity-50">
                        <div className="h-1.5 w-full bg-border-light rounded-full" />
                        <div className="h-1.5 w-[80%] bg-border-light rounded-full" />
                        <div className="h-1.5 w-[60%] bg-border-light rounded-full" />
                      </div>
                    </div>

                    {/* Middle Calendar Section */}
                    <div className="flex-1 p-4 flex flex-col bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-ink">Select a Date & Time</span>
                        <div className="flex items-center gap-2">
                          <button className="text-ink-muted hover:text-ink" aria-label="Previous month"><ChevronLeft size={12} /></button>
                          <span className="text-[10px] font-black text-ink">{schedulingData.month}</span>
                          <button className="text-ink-muted hover:text-ink" aria-label="Next month"><ChevronRight size={12} /></button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-[8px] font-black text-ink-muted uppercase mb-2 text-center">
                        {['S', 'M', 'T_Tue', 'W', 'T_Thu', 'F', 'S_Sat'].map((d) => (
                          <div key={d}>{d.split('_')[0]}</div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center items-center">
                        {[30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1].map((d, i) => {
                          const isCurrentMonth = (i > 0 && i < 32);
                          const isSelected = d === schedulingData.selectedDate && isCurrentMonth;
                          const isAvailable = schedulingData.availableDates.includes(d) && isCurrentMonth;
                          
                          return (
                            <div 
                              key={i} 
                              className={`text-[10px] font-bold w-6 h-6 flex items-center justify-center mx-auto transition-all ${
                                isSelected ? 'bg-blue text-white rounded-full shadow-md' :
                                isAvailable ? 'text-blue bg-blue-light/30 rounded-full cursor-pointer hover:bg-blue/10' :
                                !isCurrentMonth ? 'text-ink-muted/20' : 'text-ink'
                              }`}
                            >
                              {d}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-auto pt-2">
                        <div className="flex items-center gap-1 text-[8px] font-bold text-ink-muted">
                          <Globe size={10} /> Eastern time <ChevronDown size={8} />
                        </div>
                      </div>
                    </div>

                    {/* Right Time Slots Section */}
                    <div className="w-[30%] p-4 flex flex-col gap-2 bg-white">
                      <p className="text-[9px] font-black text-ink-muted uppercase mb-1">Mon, {schedulingData.month.split(' ')[0]} {schedulingData.selectedDate}</p>
                      
                      {/* Mapping time slots instead of hardcoding */}
                      {schedulingData.timeSlots.map((t, idx) => {
                        const isConfirmed = t === "11:00am";
                        return (
                          <div key={t} className="flex flex-col gap-1.5 w-full">
                            {isConfirmed ? (
                              <>
                                <div className="p-2 bg-slate-700/90 rounded-lg text-center text-[11px] font-black text-white">{t}</div>
                                <motion.button 
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="p-2 bg-blue rounded-lg text-center text-[11px] font-black text-white shadow-md shadow-blue-500/20"
                                >
                                  Confirm
                                </motion.button>
                              </>
                            ) : (
                               <div className="p-2 border border-blue-light rounded-lg text-center text-[11px] font-black text-blue hover:bg-blue-light/10 transition-colors cursor-pointer">
                                 {t}
                               </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-xl border border-border-light flex items-center gap-3 min-w-[200px] z-20"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div className="text-[8px] font-black text-ink-muted uppercase tracking-wider">New Booking</div>
                      <div className="text-[10px] font-black text-ink">Success! 11:00am Zoom</div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="workflows"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-white rounded-[20px] border border-border-light shadow-2xl p-6 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                        <Bell size={18} />
                      </div>
                      <h3 className="text-lg font-black text-ink">Automated Workflows</h3>
                    </div>
                    <div className="px-2 py-0.5 bg-blue-light text-blue rounded-full text-[8px] font-black uppercase tracking-wider">Active</div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    {workflowItems.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-center justify-between p-3 rounded-xl border border-border-light bg-bg-surface/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}>
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-[11px] font-black text-ink">{item.title}</div>
                            <div className="text-[9px] font-bold text-ink-muted">{item.time}</div>
                          </div>
                        </div>
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-border-light flex items-center justify-between">
                    <div className="text-[10px] font-bold text-ink-muted italic">"Reduce no-shows by 40%"</div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-bg-surface overflow-hidden">
                          <img src={`https://i.pravatar.cc/150?u=${i+20}`} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10 pointer-events-none opacity-90">
              <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="600" cy="400" r="250" fill="var(--blue-light)" />
                <circle cx="200" cy="600" r="200" fill="#F0F9FF" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
