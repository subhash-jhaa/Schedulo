'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  Check, 
  CalendarCheck, 
  Mail, 
  User, 
  FileText,
  Loader2,
  Globe,
  ArrowRight,
  ChevronRight,
  TriangleAlert,
  ArrowBigLeft
} from 'lucide-react';
import { format, addDays, isSameDay, startOfDay, parseISO, addMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { generateSlots } from '@/lib/utils';

export default function BookingPage() {
  const { username } = useParams();
  const router = useRouter();

  // State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hostData, setHostData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', note: '' });
  const [error, setError] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);

  // Timezone detection
  const userTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return "UTC";
    }
  }, []);

  // Next 14 days
  const next14Days = useMemo(() => {
    const dates = [];
    const today = startOfDay(new Date());
    for (let i = 0; i < 14; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  }, []);

  // Fetch host details & availability
  useEffect(() => {
    const fetchHostInfo = async () => {
      try {
        const res = await fetch(`/api/host/availability/${username}`);
        if (!res.ok) throw new Error("Host not found or unavailable");
        const data = await res.json();
        setHostData(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHostInfo();
  }, [username]);

  // Derived slots for selected date
  const availableSlots = useMemo(() => {
    if (!hostData?.availability) return [];
    
    // Convert current selected date to its day of week (0-6)
    const dayOfWeek = selectedDate.getDay();
    const daySetting = hostData.availability.find(a => a.dayOfWeek === dayOfWeek);

    if (!daySetting || !daySetting.isActive) return [];

    // Filter appointments for this specific day
    const dayAppointments = hostData.appointments?.filter(app => 
      isSameDay(new Date(app.startTime), selectedDate)
    );

    // generateSlots expects { startTime, endTime, duration, buffer, enabled }
    return generateSlots(
      { 
        startTime: daySetting.startTime, 
        endTime: daySetting.endTime, 
        duration: daySetting.slotDuration, 
        buffer: daySetting.bufferTime,
        enabled: daySetting.isActive 
      }, 
      dayAppointments?.map(app => ({
        time: format(new Date(app.startTime), 'HH:mm'),
        status: app.status
      }))
    );
  }, [hostData, selectedDate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!guestInfo.name || !guestInfo.email) return;

    setIsSubmitting(true);
    try {
      // Calculate start and end time based on selected slot
      const [h, m] = selectedSlot.split(':').map(Number);
      const startTime = new Date(selectedDate);
      startTime.setHours(h, m, 0, 0);
      
      const duration = hostData.availability[0]?.slotDuration || 30;
      const endTime = addMinutes(startTime, duration);

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostUserId: hostData.host.id,
          guestName: guestInfo.name,
          guestEmail: guestInfo.email,
          guestNote: guestInfo.note,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          timezone: userTimezone,
          status: 'confirmed'
        })
      });

      if (!res.ok) throw new Error("Booking failed");
      
      const sessionData = await res.json();
      setConfirmationData({
        ...sessionData,
        host: hostData.host,
        duration,
        startTime: startTime,
        endTime: endTime
      });
      setStep(3);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(" ").map(n => n[0]).join("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080C10] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#00D4AA]" size={48} />
          <p className="font-syne text-lg opacity-40">Connecting to Schedulo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#080C10] flex items-center justify-center text-white p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <TriangleAlert size={32} />
          </div>
          <h1 className="text-2xl font-syne font-bold mb-2">Oops!</h1>
          <p className="opacity-40 mb-8">{error}</p>
          <button 
            onClick={() => router.push("/")}
            className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border-none text-white font-bold cursor-pointer"
          >
            Take me home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C10] text-white flex items-center justify-center p-4 sm:p-8 font-inter">
      <div className="w-full max-w-5xl bg-[#111820] border border-white/5 rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] relative">
        
        {/* LEFT PANEL: Host Info */}
        <div className="w-full md:w-[320px] p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between bg-gradient-to-b from-[#111820] to-[#0D131A]">
          <div className="space-y-8">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00D4AA] to-[#009BF2] flex items-center justify-center text-black text-2xl font-black font-syne shadow-lg">
                {getInitials(hostData.host.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#111820] rounded-full" />
            </div>

            <div>
              <p className="text-[#00D4AA] text-sm font-black uppercase tracking-widest mb-2 opacity-60">Meeting with</p>
              <h1 className="text-3xl font-syne font-bold tracking-tight mb-6">{hostData.host.name}</h1>
              
              <div className="space-y-4 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#00D4AA]">
                    <Clock size={16} />
                  </div>
                  <span className="text-sm font-medium">30 min meeting</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#00D4AA]">
                    <Calendar size={16} />
                  </div>
                  <span className="text-sm font-medium">Video call provided after booking</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 opacity-20">
              <div className="w-8 h-8 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
                <CalendarCheck size={16} />
              </div>
              <span className="text-xs font-bold font-syne uppercase tracking-wider">Powered by Schedulo</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Dynamic Steps */}
        <div className="flex-1 min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: PICK A DATE & TIME */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 p-8 md:p-12 flex flex-col"
              >
                <h2 className="text-2xl font-syne font-bold mb-8">Select a date & time</h2>
                
                {/* Horizontal Date Strip */}
                <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
                  {next14Days.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const dayName = format(date, 'EEE');
                    const dayNum = format(date, 'd');
                    const monName = format(date, 'MMM');
                    const hasAvailability = hostData.availability.some(a => a.dayOfWeek === date.getDay() && a.isActive);

                    return (
                      <button 
                        key={date.toISOString()}
                        onClick={() => {
                          if (hasAvailability) {
                            setSelectedDate(date);
                            setSelectedSlot(null);
                          }
                        }}
                        className={`flex-shrink-0 w-[5.5rem] p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border cursor-pointer border-opacity-10
                          ${isSelected ? 'bg-white text-black border-white shadow-xl scale-105' : 
                            hasAvailability ? 'bg-white/5 text-white border-white hover:border-opacity-30' : 
                            'opacity-20 border-white cursor-not-allowed line-through'
                          }`}
                      >
                        <span className={`text-[10px] uppercase font-black tracking-widest ${isSelected ? 'opacity-40' : 'opacity-40'}`}>{dayName}</span>
                        <span className="text-2xl font-syne font-bold">{dayNum}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{monName}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Slots Grid */}
                <div className="flex-1 mt-4">
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableSlots.map((slot) => {
                        const [h, m] = slot.split(':').map(Number);
                        const displayTime = format(new Date().setHours(h, m), 'h:mm a');
                        return (
                          <motion.button 
                            key={slot}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedSlot(slot);
                              setStep(2);
                            }}
                            className="p-4 bg-white/5 border border-white border-opacity-5 rounded-2xl text-sm font-bold hover:border-[#00D4AA] hover:bg-[#00D4AA]/5 hover:text-[#00D4AA] transition-all cursor-pointer text-center"
                          >
                            {displayTime}
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-12">
                      <Clock size={48} className="mb-4 text-white/20" />
                      <p className="font-syne text-center">No slots available for this day.<br/>Please select another date.</p>
                    </div>
                  )}
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 opacity-40 text-[10px] font-bold uppercase tracking-widest bg-white/5 py-3 px-6 rounded-full w-fit mx-auto">
                  <Globe size={12} />
                  <span>Times shown in {userTimezone.replace('_', ' ')}</span>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ENTER DETAILS */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 p-8 md:p-12 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border-none cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-syne font-bold">Enter your details</h2>
                </div>

                <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-6">
                  <div className="p-4 bg-[#00D4AA]/10 rounded-2xl text-[#00D4AA]">
                    <CalendarCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-[#00D4AA] mb-1 tracking-widest opacity-60">Meeting at</p>
                    <p className="font-syne font-bold text-lg">
                      {format(selectedDate, 'EEEE, MMMM d')} · {format(new Date().setHours(...selectedSlot.split(':')), 'h:mm a')}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-40 px-1">Your Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        value={guestInfo.name}
                        onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-[#00D4AA] focus:ring-4 focus:ring-[#00D4AA]/10 transition-all font-inter text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-40 px-1">Your Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-[#00D4AA] focus:ring-4 focus:ring-[#00D4AA]/10 transition-all font-inter text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-40 px-1">Add a Note (Optional)</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-6 opacity-20" size={18} />
                      <textarea 
                        rows={3}
                        placeholder="Please tell us a bit about why you'd like to meet..."
                        value={guestInfo.note}
                        onChange={(e) => setGuestInfo({...guestInfo, note: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-[#00D4AA] focus:ring-4 focus:ring-[#00D4AA]/10 transition-all font-inter text-white resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full py-5 rounded-3xl bg-gradient-to-r from-[#00D4AA] to-[#009BF2] text-black font-black font-syne text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#00D4AA]/20 hover:scale-[1.02] active:scale-[0.98] transition-all border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (
                      <>
                        <span>Confirm booking</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: CONFIRMATION */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center"
              >
                {/* Animated Checkmark */}
                <div className="w-24 h-24 rounded-full bg-green-500/10 border-4 border-green-500 flex items-center justify-center mb-8 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                  >
                    <Check size={48} className="text-green-500" strokeWidth={3} />
                  </motion.div>
                </div>

                <h2 className="text-4xl font-syne font-black mb-4">You're booked!</h2>
                <p className="opacity-40 text-lg mb-10">A confirmation email has been sent to {guestInfo.email}</p>

                <div className="w-full max-w-sm bg-white/5 border border-white/5 p-8 rounded-[32px] mb-10 space-y-6 text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-[#00D4AA] tracking-widest opacity-60">With</p>
                    <p className="font-syne font-bold text-xl">{confirmationData.host.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-[#00D4AA] tracking-widest opacity-60">When</p>
                    <p className="font-inter font-medium text-lg">
                      {format(confirmationData.startTime, 'EEEE, MMM d, yyyy')}<br/>
                      {format(confirmationData.startTime, 'h:mm a')} - {format(confirmationData.endTime, 'h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-sm space-y-3">
                  <a 
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting+with+${encodeURIComponent(confirmationData.host.name)}&dates=${format(confirmationData.startTime, "yyyyMMdd'T'HHmmss'Z'")}/${format(confirmationData.endTime, "yyyyMMdd'T'HHmmss'Z'")} &details=${encodeURIComponent(guestInfo.note || '')}`}
                    target="_blank"
                    className="w-full py-4 bg-white text-black font-bold font-syne rounded-2xl flex items-center justify-center gap-3 no-underline shadow-lg border-none cursor-pointer hover:bg-opacity-90 transition-all"
                  >
                    <span>Add to Google Calendar</span>
                    <ChevronRight size={18} />
                  </a>
                  
                  <div className="pt-8 mt-8 border-t border-white/5 opacity-40 text-sm">
                    Need to cancel? Email <a href={`mailto:${confirmationData.host.email}`} className="text-white underline">{confirmationData.host.email}</a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
