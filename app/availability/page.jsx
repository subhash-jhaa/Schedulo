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
import { useUser } from '@clerk/nextjs';
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
  const { user } = useUser();
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
      if (!user) return;
      try {
        const res = await fetch(`/api/availability?userId=${user.id}`);
        const data = await res.json();
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Map fetched data to our day structure
          const mappedDays = defaultDays.map(d => {
            const found = data.find(f => f.day === d.day);
            return found ? { 
              day: found.day, 
              enabled: found.enabled, 
              startTime: found.startTime, 
              endTime: found.endTime 
            } : d;
          });
          setDays(mappedDays);
          
          // Use common settings from the first record if available
          if (data[0].timezone) setTimezone(data[0].timezone);
          if (data[0].duration) setDuration(Number(data[0].duration));
          if (data[0].buffer) setBuffer(Number(data[0].buffer));
        }
      } catch (error) {
        console.error("Error loading availability:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    if (user) {
      loadAvailability();
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, timezone, duration, buffer })
      });
      
      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
      console.error("Error saving availability:", error);
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
      <div className="min-h-screen bg-[#080C10] flex text-white font-inter">
        <Sidebar />
        <main className="flex-1 ml-[240px] p-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 className="animate-spin text-[#00D4AA]" size={40} />
            <p className="text-sm opacity-40 font-inter">Loading your settings...</p>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C10] flex text-white font-inter">
      <Sidebar />
      
      <main className="flex-1 ml-[240px] p-10 overflow-auto">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-syne font-bold mb-2 tracking-tight">Your availability</h1>
          <p className="text-white opacity-40 text-lg">Set the times you're open for bookings</p>
        </header>

        <div className="max-w-3xl space-y-8">
          {/* Timezone Section */}
          <section className="p-8 bg-[#111820] border border-white border-opacity-5 rounded-3xl shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500 bg-opacity-10 rounded-xl text-blue-400">
                <Globe size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg font-syne">Your timezone</h3>
                <p className="text-xs opacity-40 text-white font-inter">Used to coordinate your booking slots with guests</p>
              </div>
            </div>
            
            <div className="relative">
              <select 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full appearance-none bg-[#080C10] border border-white border-opacity-10 p-4 px-5 rounded-xl text-white focus:ring-2 focus:ring-[#00D4AA]/20 focus:border-[#00D4AA] outline-none cursor-pointer hover:border-opacity-30 transition-all font-inter"
              >
                {!commonTimezones.includes(timezone) && (
                   <option value={timezone}>{timezone}</option>
                )}
                {commonTimezones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <Clock size={16} />
              </div>
            </div>
          </section>

          {/* Slot Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="p-8 bg-[#111820] border border-white border-opacity-5 rounded-3xl shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-500 bg-opacity-10 rounded-xl text-purple-400">
                  <Clock size={20} />
                </div>
                <h3 className="font-bold font-syne">Meeting duration</h3>
              </div>
              <select 
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-[#080C10] border border-white border-opacity-10 p-4 rounded-xl text-white outline-none cursor-pointer focus:border-[#00D4AA] focus:ring-2 focus:ring-[#00D4AA]/20 transition-all font-inter"
              >
                {durations.map(d => <option key={d} value={d}>{d} minutes</option>)}
              </select>
            </section>

            <section className="p-8 bg-[#111820] border border-white border-opacity-5 rounded-3xl shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-500 bg-opacity-10 rounded-xl text-orange-400">
                  <Settings2 size={20} />
                </div>
                <h3 className="font-bold font-syne">Buffer time</h3>
              </div>
              <select 
                value={buffer}
                onChange={(e) => setBuffer(Number(e.target.value))}
                className="w-full bg-[#080C10] border border-white border-opacity-10 p-4 rounded-xl text-white outline-none cursor-pointer focus:border-[#00D4AA] focus:ring-2 focus:ring-[#00D4AA]/20 transition-all font-inter"
              >
                {buffers.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </section>
          </div>

          {/* Day Grid */}
          <section className="p-8 bg-[#111820] border border-white border-opacity-5 rounded-3xl shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#00D4AA] bg-opacity-10 rounded-xl text-[#00D4AA]">
                <CalendarDays size={22} />
              </div>
              <h3 className="font-bold text-lg font-syne">Work hours</h3>
            </div>

            <div className="space-y-3">
              {days.map((day, i) => (
                <motion.div 
                  key={day.day}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                  className="flex flex-col sm:flex-row items-center justify-between p-5 bg-[#080C10] border border-white border-opacity-5 rounded-2xl group transition-all hover:border-opacity-10 bg-gradient-to-r hover:from-[#111820] hover:to-[#080C10]"
                >
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => toggleDay(i)}
                      className={`relative w-12 h-6 flex-shrink-0 rounded-full transition-all duration-300 border-none cursor-pointer ${day.enabled ? "bg-[#00D4AA]" : "bg-white bg-opacity-10"}`}
                    >
                      <motion.div 
                        initial={false}
                        animate={{ x: day.enabled ? 26 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" 
                      />
                    </button>
                    <span className={`font-bold w-16 transition-opacity font-syne ${day.enabled ? "opacity-100" : "opacity-30"}`}>
                      {day.day.slice(0,3)}
                    </span>
                  </div>

                  <div className={`flex items-center gap-4 transition-all w-full sm:w-auto justify-end ${day.enabled ? "opacity-100" : "opacity-20 pointer-events-none"}`}>
                    <select 
                      value={day.startTime}
                      onChange={(e) => updateTime(i, 'startTime', e.target.value)}
                      disabled={!day.enabled}
                      className="bg-transparent border border-white border-opacity-10 p-2.5 rounded-xl text-sm text-white outline-none cursor-pointer hover:border-opacity-30 focus:border-[#00D4AA] transition-all font-inter"
                    >
                      {timeSlots.map(t => <option key={t.value} value={t.value} className="bg-[#111820]">{t.label}</option>)}
                    </select>
                    <span className="opacity-20 text-xs font-inter uppercase tracking-widest">to</span>
                    <select 
                      value={day.endTime}
                      onChange={(e) => updateTime(i, 'endTime', e.target.value)}
                      disabled={!day.enabled}
                      className="bg-transparent border border-white border-opacity-10 p-2.5 rounded-xl text-sm text-white outline-none cursor-pointer hover:border-opacity-30 focus:border-[#00D4AA] transition-all font-inter"
                    >
                      {timeSlots.map(t => <option key={t.value} value={t.value} className="bg-[#111820]">{t.label}</option>)}
                    </select>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Save Button */}
          <div className="sticky bottom-6 pt-4 pb-2 z-10">
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl transition-all cursor-pointer border-none font-syne text-lg ${
                saveStatus === 'success' ? "bg-green-500 text-white" : 
                saveStatus === 'error' ? "bg-red-500 text-white" :
                "bg-gradient-to-r from-[#00D4AA] to-[#009BF2] text-black"
              }`}
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={24} />
              ) : saveStatus === 'success' ? (
                <>
                  <Check size={24} />
                  ✓ Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle size={24} />
                  Failed to save. Try again?
                </>
              ) : (
                "Save changes"
              )}
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}

    } catch (error) {
      console.error("Error saving availability:", error);
      setSaveStatus('error');
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
      <div className="min-h-screen bg-[#080C10] flex text-white font-inter">
        <Sidebar />
        <main className="flex-1 ml-[240px] p-10 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#00D4AA]" size={40} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C10] flex text-white font-inter">
      <Sidebar />
      
      <main className="flex-1 ml-[240px] p-10 overflow-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-syne font-bold mb-2">Your availability</h1>
          <p className="text-white opacity-40">Set the times you're open for bookings</p>
        </header>

        <div className="max-w-3xl space-y-10">
          {/* Timezone Section */}
          <section className="p-8 bg-[#111820] border border-white border-opacity-5 rounded-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500 bg-opacity-10 rounded-xl text-blue-400">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="font-bold">Your timezone</h3>
                <p className="text-xs opacity-40 text-white">This affects how guests see your slots</p>
              </div>
            </div>
            
            <select 
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-[#080C10] border border-white border-opacity-10 p-4 rounded-xl text-white focus:border-[#00D4AA] outline-none cursor-pointer hover:border-opacity-30 transition-all"
            >
              {[
                "UTC", "America/New_York", "Europe/London", "Asia/Kolkata", "Asia/Dubai", "Europe/Paris", "Pacific/Auckland"
              ].map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </section>

          {/* Slot Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="p-8 bg-[#111820] border border-white border-opacity-5 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-500 bg-opacity-10 rounded-xl text-purple-400">
                  <Clock size={20} />
                </div>
                <h3 className="font-bold">Meeting duration</h3>
              </div>
              <select 
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-[#080C10] border border-white border-opacity-10 p-4 rounded-xl text-white outline-none cursor-pointer focus:border-[#00D4AA] transition-all"
              >
                {durations.map(d => <option key={d} value={d}>{d} minutes</option>)}
              </select>
            </section>

            <section className="p-8 bg-[#111820] border border-white border-opacity-5 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-500 bg-opacity-10 rounded-xl text-orange-400">
                  <Settings2 size={20} />
                </div>
                <h3 className="font-bold">Buffer time</h3>
              </div>
              <select 
                value={buffer}
                onChange={(e) => setBuffer(Number(e.target.value))}
                className="w-full bg-[#080C10] border border-white border-opacity-10 p-4 rounded-xl text-white outline-none cursor-pointer focus:border-[#00D4AA] transition-all"
              >
                {buffers.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </section>
          </div>

          {/* Day Grid */}
          <section className="p-8 bg-[#111820] border border-white border-opacity-5 rounded-3xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-[#00D4AA] bg-opacity-10 rounded-xl text-[#00D4AA]">
                <CalendarDays size={20} />
              </div>
              <h3 className="font-bold">Work hours</h3>
            </div>

            <div className="space-y-4">
              {days.map((day, i) => (
                <motion.div 
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[#080C10] border border-white border-opacity-5 rounded-2xl group gap-4 sm:gap-0"
                >
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => toggleDay(i)}
                      className={"relative w-12 h-6 flex-shrink-0 rounded-full transition-all duration-300 border-none cursor-pointer " + (day.enabled ? "bg-[#00D4AA]" : "bg-white bg-opacity-10")}
                    >
                      <motion.div 
                        initial={false}
                        animate={{ x: day.enabled ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" 
                      />
                    </button>
                    <span className={"font-bold w-12 transition-opacity " + (day.enabled ? "opacity-100" : "opacity-30")}>{day.day.slice(0,3)}</span>
                  </div>

                  <div className={"flex items-center gap-4 transition-all w-full sm:w-auto justify-end " + (day.enabled ? "opacity-100" : "opacity-20 pointer-events-none")}>
                    <select 
                      value={day.startTime}
                      onChange={(e) => updateTime(i, 'startTime', e.target.value)}
                      className="bg-transparent border border-white border-opacity-10 p-2 rounded-lg text-sm text-white outline-none cursor-pointer"
                    >
                      {timeSlots.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <span className="opacity-40 text-xs text-white">to</span>
                    <select 
                      value={day.endTime}
                      onChange={(e) => updateTime(i, 'endTime', e.target.value)}
                      className="bg-transparent border border-white border-opacity-10 p-2 rounded-lg text-sm text-white outline-none cursor-pointer"
                    >
                      {timeSlots.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Save Button */}
          <div className="sticky bottom-6 pt-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={"w-full py-5 rounded-3xl font-bold flex items-center justify-center gap-3 shadow-2xl transition-all cursor-pointer border-none " + (
                saveStatus === 'success' ? "bg-green-500 text-white" : 
                saveStatus === 'error' ? "bg-red-500 text-white" :
                "bg-gradient-to-r from-[#00D4AA] to-[#009BF2] text-black hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : saveStatus === 'success' ? (
                <>
                  <Check size={20} />
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle size={20} />
                  Error!
                </>
              ) : (
                "Save availability"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
