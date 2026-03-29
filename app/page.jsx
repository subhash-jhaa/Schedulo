'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Globe, 
  Mail, 
  ShieldCheck, 
  Smartphone, 
  ChevronRight, 
  ArrowRight,
  Play,
  CheckCircle2,
  Users,
  Timer,
  Zap,
  Slack,
  Video,
  Database,
  Layout,
  MousePointer2,
  CalendarDays
} from 'lucide-react';

const features = [
  { icon: Calendar, title: "Calendar Sync", desc: "Connect Google, Outlook, and iCloud calendars seamlessly." },
  { icon: Globe, title: "Time Zone Magic", desc: "Auto-detect and convert slots to any guest's local time." },
  { icon: MousePointer2, title: "Shareable Link", desc: "Your personal booking page, always live, always ready." },
  { icon: Mail, title: "Email Notifications", desc: "Instant confirmations and reminders for you and guests." },
  { icon: ShieldCheck, title: "Secure Auth", desc: "Enterprise-grade security powered by Clerk authentication." },
  { icon: Smartphone, title: "Fully Responsive", desc: "Book from anywhere—laptop, tablet, or mobile phone." }
];

const steps = [
  { id: "01", title: "Connect calendar", desc: "Sync your existing schedules in one click." },
  { id: "02", title: "Set availability", desc: "Define your working hours and meeting rules." },
  { id: "03", title: "Share link and relax", desc: "Let people book you without the back-and-forth." }
];

const testimonials = [
  { quote: "The cleanest scheduling tool I've ever used. My clients love it.", author: "Sarah J.", role: "Freelance Designer" },
  { quote: "Schedulo saved me 10+ hours of admin work every single week.", author: "Marcus K.", role: "Sales Lead" },
  { quote: "Finally, a booking app that doesn't feel like it's from 2010.", author: "Elena R.", role: "Startup Founder" },
  { quote: "The timezone detection is flawless. No more missed meetings.", author: "David W.", role: "Global Consultant" },
  { quote: "Integration was a breeze. Had my first booking in 5 minutes.", author: "Chloe L.", role: "Yoga Instructor" },
  { quote: "Beautiful UI, powerful features. It's the full package.", author: "James T.", role: "Tech Educator" }
];

const integrations = [
  { name: "Google Calendar", color: "bg-blue-500" },
  { name: "Outlook", color: "bg-blue-600" },
  { name: "Zoom", color: "bg-blue-400" },
  { name: "Slack", color: "bg-purple-500" },
  { name: "Zapier", color: "bg-orange-500" },
  { name: "Stripe", color: "bg-indigo-500" },
  { name: "Notion", color: "bg-white text-black" },
  { name: "Google Meet", color: "bg-green-500" }
];

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-[#080C10] text-white font-inter selection:bg-[#00D4AA]/30 overflow-x-hidden">
      
      {/* 1. STICKY NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-[#080C10]/80 backdrop-blur-xl border-white/10 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group no-underline text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00D4AA] to-[#008A6F] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,212,170,0.2)] group-hover:scale-110 transition-transform">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="font-syne font-bold text-2xl tracking-tight">Schedulo</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it works', 'Integrations'].map((link) => (
              <Link key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity no-underline text-white capitalize">
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="px-6 py-2.5 text-sm font-bold opacity-60 hover:opacity-100 transition-all bg-transparent border-none text-white cursor-pointer">Log in</button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-2.5 bg-gradient-to-r from-[#00D4AA] to-[#009BF2] text-black rounded-full text-sm font-black font-syne shadow-xl shadow-[#00D4AA]/20 hover:scale-105 active:scale-95 transition-all border-none cursor-pointer">
                Get started free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00D4AA]/5 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#009BF2]/5 blur-[100px] rounded-full -ml-40 -mb-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 border-opacity-20 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4AA]"></span>
              </span>
              <span className="text-[10px] uppercase font-black tracking-[0.2em] opacity-80">Now with AI-powered scheduling</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-6xl md:text-8xl font-syne font-black tracking-tight leading-[1.1] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Scheduling that works <br className="hidden md:block" />
              the way you do
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl opacity-40 max-w-2xl mx-auto mb-12 leading-relaxed font-inter px-4">
              Share your link. Let people book instantly. No more "what time works for you" emails. Just simple, beautiful scheduling.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
              <Link href="/register">
                <button className="group w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#00D4AA] to-[#009BF2] text-black rounded-3xl text-xl font-black font-syne shadow-2xl shadow-[#00D4AA]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-none cursor-pointer">
                  Get started free
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-3xl text-xl font-bold font-syne transition-all flex items-center gap-3 cursor-pointer">
                <Play size={20} fill="currentColor" />
                Watch demo
              </button>
            </div>
          </FadeIn>

          {/* Interactive Mockup */}
          <FadeIn delay={0.4}>
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00D4AA] to-[#009BF2] opacity-20 blur-2xl rounded-3xl" />
              <div className="relative bg-[#111820] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 grid grid-cols-7 gap-4 aspect-[21/9] content-start">
                {/* Mockup Rows */}
                {Array.from({ length: 28 }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 212, 170, 0.1)", borderColor: "rgba(0, 212, 170, 0.4)" }}
                    className="aspect-square bg-[#080C10] border border-white/5 rounded-xl cursor-pointer transition-colors"
                  />
                ))}
                {/* Overlay Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00D4AA] text-black px-6 py-3 rounded-2xl font-black font-syne text-sm shadow-2xl flex items-center gap-3 animate-bounce">
                  <CheckCircle2 size={18} />
                  Confirmed: 30m Meeting
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. STATS BAR */}
      <section className="py-12 border-y border-white/5 bg-[#0D131A]">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 text-center">
            {[
              { val: "2.4M+", label: "meetings" },
              { val: "180K+", label: "hours saved" },
              { val: "52K+", label: "users" },
              { val: "40+", label: "integrations" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-syne font-black text-[#00D4AA]">{stat.val}</span>
                <span className="text-sm font-bold uppercase tracking-wider opacity-30">{stat.label}</span>
                {i < 3 && <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10 ml-12" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-syne font-black mb-6">Everything you need to <br/> schedule like a pro</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-[#00D4AA] to-[#009BF2] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-10 bg-[#111820] border border-white/5 rounded-[40px] hover:border-[#00D4AA]/30 transition-all hover:bg-gradient-to-b hover:from-[#111820] hover:to-[#0D131A] group">
                  <div className="w-16 h-16 rounded-2xl bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <f.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-syne font-bold mb-4">{f.title}</h3>
                  <p className="opacity-40 leading-relaxed font-inter">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="py-32 px-6 bg-[#0D131A] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#00D4AA]/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-syne font-black mb-6">Built for simplicity</h2>
            <p className="opacity-40 max-w-xl mx-auto font-inter">Follow these three simple steps to start reclaim your calendar.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {steps.map((s, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-32 h-32 rounded-full bg-[#111820] border-4 border-[#080C10] flex items-center justify-center mx-auto mb-10 shadow-2xl group hover:border-[#00D4AA] transition-colors">
                  <span className="text-4xl font-syne font-black text-[#00D4AA]">0{i+1}</span>
                </div>
                <h3 className="text-2xl font-syne font-bold mb-4">{s.title}</h3>
                <p className="opacity-40 font-inter px-8 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-syne font-black mb-6">Loved by thousands of <br/> creators and companies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-8 bg-[#111820] border border-white/5 rounded-3xl relative">
                  <p className="text-lg font-inter mb-8 italic opacity-80 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D4AA] to-[#009BF2] flex items-center justify-center text-black font-black text-sm">
                      {t.author[0]}
                    </div>
                    <div>
                      <p className="font-syne font-bold text-sm">{t.author}</p>
                      <p className="text-xs opacity-40 font-inter">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INTEGRATIONS GRID */}
      <section id="integrations" className="py-32 px-6 bg-[#0D131A]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-syne font-black mb-16">Connect your stack</h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {integrations.map((tool, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.2)" }}
                className="flex items-center gap-4 px-8 py-5 bg-[#111820] border border-white border-opacity-5 rounded-2xl cursor-pointer transition-all"
              >
                <div className={`w-3 h-3 rounded-full ${tool.color}`} />
                <span className="font-bold text-sm tracking-wide">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA BANNER */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative p-1 bg-gradient-to-r from-[#00D4AA] to-[#009BF2] rounded-[40px] overflow-hidden">
            <div className="bg-[#111820] rounded-[39px] p-12 md:p-24 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00D4AA]/10 blur-[100px] rounded-full -mr-40 -mt-20 pointer-events-none" />
              
              <h2 className="text-4xl md:text-6xl font-syne font-black leading-tight mb-8">Start scheduling <br/> smarter today</h2>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link href="/register">
                  <button className="px-12 py-5 bg-[#00D4AA] text-black rounded-2xl text-xl font-black font-syne shadow-2xl hover:scale-105 active:scale-95 transition-all border-none cursor-pointer">
                    Join Schedulo Now
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-xl font-bold font-syne hover:bg-white/10 transition-all cursor-pointer">
                    Preview Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-8 no-underline text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00D4AA] to-[#008A6F] rounded-xl flex items-center justify-center">
                <Calendar className="text-white" size={24} />
              </div>
              <span className="font-syne font-bold text-2xl tracking-tight">Schedulo</span>
            </Link>
            <p className="opacity-40 max-w-sm font-inter leading-relaxed">The modern standard for scheduling. Reach peak productivity by automating your bookings.</p>
          </div>
          
          <div>
            <h4 className="font-syne font-bold mb-8 uppercase text-xs tracking-widest opacity-60">Company</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              {['About', 'Privacy', 'Terms', 'Security'].map(l => (
                <li key={l}><Link href="#" className="opacity-40 hover:opacity-100 transition-opacity no-underline text-white text-sm">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-syne font-bold mb-8 uppercase text-xs tracking-widest opacity-60">Product</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              {['Features', 'Integrations', 'Pricing', 'API'].map(l => (
                <li key={l}><Link href="#" className="opacity-40 hover:opacity-100 transition-opacity no-underline text-white text-sm">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
          <p className="text-xs opacity-30 font-inter">© 2026 Schedulo Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 opacity-30">
            <span className="text-[10px] font-black uppercase tracking-widest">Built with Next.js · Neon · Vercel · Framer Motion</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
