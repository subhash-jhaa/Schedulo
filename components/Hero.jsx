'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Clock, MapPin } from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const fadeUp = {
    hidden: { opacity: 0, y: 26 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.09, duration: 0.6, ease: [0.16, 1, 0.3, 1] } })
  };
  return (
    <section className="bg-white pt-32 pb-24 overflow-hidden relative">
      <div className="max grid grid-cols-1 lg:grid-cols-2 gap-20 items-center text-left">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0}
          className="relative z-10"
        >
          <h1 className="text-6xl lg:text-[84px] leading-[0.95] font-black text-[#0B3558] mb-10 tracking-tight">
            Easy <br />
            scheduling <br />
            <span className="text-[#0B3558]">ahead</span>
          </h1>
          <p className="text-xl text-[#68819B] mb-12 leading-relaxed max-w-md font-bold">
            Join 20 million professionals who easily book meetings with the #1 scheduling tool.
          </p>
          
          <div className="space-y-4 max-w-sm mb-10">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-[#006BFF] text-white font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all border-2 border-[#006BFF]"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                 <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
              </div>
              <span className="text-lg">Sign up with Google</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-[#0B3558] text-white font-black rounded-xl shadow-lg shadow-slate-900/20 transition-all border-2 border-[#0B3558]"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5">
                 <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
              </div>
              <span className="text-lg">Sign up with Microsoft</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-4 max-w-sm mb-6">
            <div className="h-px bg-[#E7EDF6] flex-1" />
            <span className="text-[10px] font-black text-[#68819B] uppercase tracking-widest">OR</span>
            <div className="h-px bg-[#E7EDF6] flex-1" />
          </div>

          <div className="flex items-center gap-3">
            <a href="/register" className="text-[#006BFF] font-black text-sm hover:underline underline-offset-4 decoration-2">
              Sign up free with email.
            </a>
            <span className="text-sm text-[#68819B] font-bold">No credit card required</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Abstract Colored Shapes Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10 pointer-events-none opacity-90">
             <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="600" cy="400" r="250" fill="#006BFF" />
                <path d="M150 200 L450 100 L550 500 L250 600 Z" fill="#C026D3" fillOpacity="0.8" />
                <circle cx="350" cy="550" r="200" fill="#0EA5E9" fillOpacity="0.7" />
             </svg>
          </div>

          <div className="bg-white rounded-[32px] border border-[#E7EDF6] shadow-2xl overflow-hidden scale-110">
             <div className="p-8 border-b border-[#E7EDF6]">
                <h3 className="text-2xl font-black text-[#0B3558]">Share your booking page</h3>
             </div>
             <div className="flex divide-x divide-[#E7EDF6] h-[400px]">
                <div className="w-1/3 p-8 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#006BFF] flex items-center justify-center text-white font-bold">AS</div>
                      <div className="text-sm font-black text-[#0B3558]">ACME Inc.</div>
                   </div>
                   <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#F8F9FB] border-2 border-white shadow-sm">
                         <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs font-bold text-[#68819B]">Fatima Sy</div>
                      <div className="text-lg font-black text-[#0B3558]">Client Check-in</div>
                   </div>
                   <div className="space-y-3 pt-4 border-t border-[#E7EDF6]">
                      <div className="flex items-center gap-3 text-[#68819B] font-bold text-xs"><Clock size={16} /> 30 min</div>
                      <div className="flex items-center gap-3 text-[#68819B] font-bold text-xs"><MapPin size={16} /> Zoom</div>
                   </div>
                </div>
                <div className="flex-1 p-8">
                   <div className="grid grid-cols-7 gap-1 text-[10px] font-black text-[#68819B] uppercase mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-center">{d}</div>)}
                   </div>
                   <div className="grid grid-cols-7 gap-2">
                      {[...Array(31)].map((_, i) => (
                         <div key={i} className={`h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${i + 1 === 22 ? 'bg-[#006BFF] text-white' : 'hover:bg-[#F2F8FF] text-[#0B3558]'}`}>
                            {i+1}
                         </div>
                      ))}
                   </div>
                </div>
                <div className="w-1/4 p-6 bg-[#F8F9FB] flex flex-col gap-3">
                   <div className="text-[10px] font-black text-[#68819B] uppercase mb-2">Monday, July 22</div>
                   {[ '10:00am', '11:00am', '1:00pm', '2:00pm' ].map((t, idx) => (
                      <div key={t} className={`p-3 rounded-lg border-2 text-center text-xs font-black transition-all ${idx === 1 ? 'bg-[#0B3558] text-white border-[#0B3558]' : 'bg-white border-[#E7EDF6] text-[#006BFF]'}`}>
                         {t}
                      </div>
                   ))}
                   <button className="mt-2 w-full py-3 bg-[#006BFF] text-white rounded-lg text-xs font-black">Confirm</button>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="max mt-24 text-center">
        <p className="text-sm font-bold text-[#68819B]">Trusted by more than <span className="text-[#0B3558] font-black">100,000</span> of the world&apos;s leading organizations</p>
      </div>
    </section>
  );
}
