'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Clock, 
  Settings2, 
  Check, 
  Loader2,
  CalendarDays,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from "@/components/Sidebar";

// Generate time slots from 6:00 AM to 11:00 PM in 30-min increments
const timeSlots = [];
for (let h = 6; h <= 23; h++) {
  ['00', '30'].forEach(m => {
    const hour = h;
    const min = m;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    
    // Stop at 11:30 PM if needed, but requirements say 11:00 PM
    if (h === 23 && m === '30') return;
    
    timeSlots.push({ 
      value: `${hour.toString().padStart(2, '0')}:${min}`, 
      label: `${displayHour}:${min} ${ampm}` 
    });
  });
}

const defaultDays = [
  { day: 'Monday', enabled: true, startTime: '09:00', endTime: '17:00' },
  { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
  { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
  { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
  { day: 'Friday', enabled: true, startTime: '09:00', endTime: '17:00' },
  { day: 'Saturday', enabled: false, startTime: '09:00', endTime: '17:00' },
  { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '17:00' },
];

const durations = [15, 30, 45, 60, 90];
const buffers = [
  { label: 'None', value: 0 },
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 }
];

// Common timezones for the selector
const commonTimezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Australia/Sydney",
  "Pacific/Auckland"
];

export default function AvailabilityPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [days, setDays] = useState(defaultDays);
  const [timezone, setTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return "UTC";
    }
  });
  const [duration, setDuration] = useState(30);
  const [buffer, setBuffer] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadAvailability = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      if (!currentUser) {
        setInitialLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/availability");
        const data = await res.json();
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Map fetched data to our day structure
          const mappedDays = defaultDays.map(d => {
            const found = data.find(f => {
              const dayIndex = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(d.day);
              return f.dayOfWeek === dayIndex;
            });
            return found ? { 
              day: d.day, 
              enabled: found.isActive, 
              startTime: found.startTime.slice(0, 5), 
              endTime: found.endTime.slice(0, 5) 
            } : d;
          });
          setDays(mappedDays);
          
          if (data[0].slotDuration) setDuration(Number(data[0].slotDuration));
          if (data[0].bufferTime) setBuffer(Number(data[0].bufferTime));
        }
      } catch (error) {
        console.error("Error loading availability:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadAvailability();
  }, [supabase]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days,
          duration,
          buffer,
          timezone,   // ← ADD THIS — `timezone` is already in component state
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDay = (index) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], enabled: !newDays[index].enabled };
    setDays(newDays);
  };

  const updateTime = (index, field, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex font-sans antialiased text-slate-900">
        <Sidebar />
        <main className="flex-1 md:ml-[280px] p-8 pt-16 md:pt-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 bg-brand/5 rounded-3xl flex items-center justify-center text-brand">
              <Loader2 className="animate-spin" size={32} />
            </div>
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Synchronizing...</p>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans antialiased text-slate-900">
      <Sidebar />
      
      <main className="flex-1 md:ml-[280px] p-8 pt-16 md:pt-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">Availability Rules</h1>
            <p className="text-slate-500 font-medium text-lg">Define when you are reachable for new appointments.</p>
          </header>

          <div className="space-y-8">
            {/* Timezone Section */}
            <section className="p-8 bg-white border border-slate-200/60 rounded-[40px] shadow-sm relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand/5 rounded-full blur-3xl transition-all group-hover:scale-150" />
              
              <div className="flex items-center gap-5 mb-8 relative">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                  <Globe size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-tight text-slate-900">Global Timezone</h3>
                  <p className="text-sm font-bold text-slate-500 mt-0.5">Slots will automatically convert for your guests</p>
                </div>
              </div>
              
              <div className="relative max-w-md">
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 p-5 pr-12 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-brand/10 focus:border-brand outline-none cursor-pointer transition-all hover:bg-white"
                >
                  {!commonTimezones.includes(timezone) && (
                     <option value={timezone}>{timezone}</option>
                  )}
                  {commonTimezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Clock size={20} />
                </div>
              </div>
            </section>

            {/* Slot Settings Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="p-8 bg-white border border-slate-200/60 rounded-[40px] shadow-sm">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center border border-purple-100">
                    <Clock size={22} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-black text-lg tracking-tight text-slate-900">Meeting Length</h3>
                </div>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-slate-700 font-bold outline-none cursor-pointer focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
                >
                  {durations.map(d => <option key={d} value={d}>{d} minutes</option>)}
                </select>
              </section>

              <section className="p-8 bg-white border border-slate-200/60 rounded-[40px] shadow-sm">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center border border-orange-100">
                    <Settings2 size={22} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-black text-lg tracking-tight text-slate-900">Gap Buffer</h3>
                </div>
                <select 
                  value={buffer}
                  onChange={(e) => setBuffer(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-slate-700 font-bold outline-none cursor-pointer focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
                >
                  {buffers.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </section>
            </div>

            {/* Day Grid */}
            <section className="p-10 bg-white border border-slate-200/60 rounded-[48px] shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 bg-brand/5 text-brand rounded-2xl flex items-center justify-center border border-brand/10 shadow-sm shadow-brand/5">
                  <CalendarDays size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tight text-slate-900">Weekly Schedule</h3>
                  <p className="text-sm font-bold text-slate-600 mt-0.5">Toggle and adjust your active hours</p>
                </div>
              </div>

              <div className="space-y-4">
                {days.map((day, i) => (
                  <motion.div 
                    key={day.day}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                    className={`flex flex-col md:flex-row items-center justify-between p-5 md:p-6 rounded-3xl transition-all duration-300 border ${
                      day.enabled 
                      ? "bg-slate-50/50 border-slate-200 shadow-sm" 
                      : "bg-white border-transparent opacity-40 grayscale"
                    }`}
                  >
                    <div className="flex items-center gap-8 w-full md:w-auto mb-4 md:mb-0">
                      {/* Custom Toggle Switch */}
                      <button 
                        onClick={() => toggleDay(i)}
                        className={`relative w-14 h-7 flex-shrink-0 rounded-full transition-all duration-300 border-none cursor-pointer ${day.enabled ? "bg-brand" : "bg-slate-300"}`}
                      >
                        <motion.div 
                          initial={false}
                          animate={{ x: day.enabled ? 32 : 4 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md" 
                        />
                      </button>
                      <span className={`font-black w-24 text-lg tracking-tight ${day.enabled ? "text-slate-900" : "text-slate-400"}`}>
                        {day.day}
                      </span>
                    </div>

                    <div className={`flex items-center gap-4 transition-all w-full md:w-auto justify-end ${day.enabled ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                      <div className="relative group">
                        <select 
                          value={day.startTime}
                          onChange={(e) => updateTime(i, 'startTime', e.target.value)}
                          disabled={!day.enabled}
                          className="bg-white border-2 border-slate-200 px-4 py-3 rounded-2xl text-sm font-black text-slate-700 outline-none cursor-pointer hover:border-brand focus:border-brand transition-all shadow-sm"
                        >
                          {timeSlots.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">to</span>
                      <div className="relative">
                        <select 
                          value={day.endTime}
                          onChange={(e) => updateTime(i, 'endTime', e.target.value)}
                          disabled={!day.enabled}
                          className="bg-white border-2 border-slate-200 px-4 py-3 rounded-2xl text-sm font-black text-slate-700 outline-none cursor-pointer hover:border-brand focus:border-brand transition-all shadow-sm"
                        >
                          {timeSlots.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Save Button */}
            <div className="sticky bottom-8 pt-8 pb-4 z-20">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full h-20 rounded-[32px] font-black text-xl shadow-2xl flex items-center justify-center gap-4 transition-all cursor-pointer border-none ${
                  saveStatus === 'success' ? "bg-emerald-500 text-white shadow-emerald-200" : 
                  saveStatus === 'error' ? "bg-rose-500 text-white shadow-rose-200" :
                  "bg-brand text-white shadow-brand/20 hover:bg-brand-hover"
                }`}
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={28} />
                ) : saveStatus === 'success' ? (
                  <>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Check size={24} strokeWidth={3} />
                    </div>
                    <span>Settings Updated</span>
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <AlertCircle size={24} strokeWidth={3} />
                    </div>
                    <span>Connection Failed</span>
                  </>
                ) : (
                  "Update Availability"
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
