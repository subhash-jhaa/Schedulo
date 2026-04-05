'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Calendar as CalendarIcon, 
  Clock, 
  MoreHorizontal, 
  CalendarCheck,
  Users,
  X,
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: '', time: '' });
  const [aiBriefing, setAiBriefing] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      fetchAppointments();
      fetchAiBriefing();
    };
    init();
  }, [supabase]);

  const fetchAiBriefing = async () => {
    try {
      const res = await fetch("/api/ai/briefing");
      if (!res.ok) return; // Silent return for missing key/error
      const data = await res.json();
      if (data.status === 'no_key') {
        setAiBriefing(null);
      } else {
        setAiBriefing(data.summary);
      }
    } catch (e) {
      // Don't log or error out on missing key
      setAiBriefing(null);
    } finally {
      setAiLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      // Ensure data is an array
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const slug = user?.user_metadata?.username || user?.email?.split("@")[0];
    const link = typeof window !== 'undefined' ? `${window.location.origin}/book/${slug}` : '';
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
// ... rest of the functions
  const cancelAppointment = async (id) => {
    try {
      const res = await fetch("/api/appointments/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" })
      });
      if (res.ok) {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    } finally {
      setIsModalOpen(false);
      setCancellingId(null);
    }
  };

  const rescheduleAppointment = async (id) => {
    const appt = safeAppointments.find(a => a.id === id);
    if (!newSlot.date || !newSlot.time || !appt) return;
    try {
      const duration = (new Date(appt.endTime) - new Date(appt.startTime));
      const newStart = new Date(`${newSlot.date}T${newSlot.time}`);
      const newEnd = new Date(newStart.getTime() + duration);

      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'confirmed',
          startTime: newStart.toISOString(),
          endTime: newEnd.toISOString(),
        }),
      });
      if (res.ok) {
        fetchAppointments();
        setIsRescheduleOpen(false);
        setReschedulingId(null);
      }
    } catch (error) {
      console.error('Reschedule error:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const colors = [
    "bg-brand",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500"
  ];

  // Safe checks for array operations
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const totalBookings = safeAppointments.length;
  const cancelledBookings = safeAppointments.filter(a => a.status === "cancelled").length;
  
  const todayDate = new Date();
  const startOfWeek = new Date(todayDate);
  startOfWeek.setDate(todayDate.getDate() - todayDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const thisWeekBookings = safeAppointments.filter(
    a => new Date(a.startTime) >= startOfWeek
  ).length;
  
  const totalHours = safeAppointments.reduce((acc, curr) => acc + (Number(curr.duration) / 60 || 0), 0).toFixed(1);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans antialiased text-slate-900">
      <Sidebar />
      
      <main className="flex-1 md:ml-[280px] p-8 pt-16 md:pt-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">
                Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "Chief"}
              </h1>
              <p className="text-slate-600 font-medium">Here&apos;s your schedule overview for today.</p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={copyLink}
                className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md hover:border-brand/30 transition-all font-bold text-slate-700 active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-xl bg-brand/5 flex items-center justify-center text-brand">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </div>
                <span>{copied ? "Copied!" : "Share Link"}</span>
              </button>
            </div>
          </div>

          {/* AI Briefing Widget */}
          <AnimatePresence>
            {(aiBriefing || aiLoading) && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 p-1 bg-gradient-to-r from-brand via-blue-500 to-purple-500 rounded-[32px] shadow-xl shadow-brand/10"
              >
                <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[30px] flex gap-6 items-center">
                  <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-brand flex-shrink-0 animate-pulse">
                    <Sparkles size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Smart Assistant</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-1">
                        <Zap size={10} fill="currentColor" />
                        Live
                      </span>
                    </div>
                    {aiLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-slate-800 leading-relaxed italic">
                        &quot;{aiBriefing}&quot;
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Confirmed", value: totalBookings - cancelledBookings, icon: CalendarCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
              { label: "New This Week", value: thisWeekBookings, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Time Booked", value: totalHours + "h", icon: Clock, color: "text-brand", bg: "bg-brand/5" },
              { label: "Cancelled", value: cancelledBookings, icon: X, color: "text-rose-500", bg: "bg-rose-50" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white border border-slate-200/60 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <stat.icon size={22} strokeWidth={2.5} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                </div>
                <div className="text-4xl font-black tracking-tight text-slate-900">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white border border-slate-200/60 rounded-[40px] shadow-sm overflow-hidden p-2">
            <div className="p-8 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Updates on your newest bookings</p>
              </div>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-colors">
                <MoreHorizontal size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="overflow-x-auto px-4 pb-4">
              {loading ? (
                <div className="p-10 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 w-full bg-slate-50 rounded-3xl animate-pulse" />
                  ))}
                </div>
              ) : safeAppointments.length === 0 ? (
                <div className="py-24 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center mb-6 border border-slate-200">
                    <CalendarIcon size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Ready to fill your calendar?</h3>
                  <p className="text-slate-500 font-bold mb-8 max-w-xs mx-auto">Your booking link is active and waiting for your first guest.</p>
                  <button 
                    onClick={copyLink}
                    className="bg-brand text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Share Your Link
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">
                      <th className="px-6 py-4">Participant</th>
                      <th className="px-6 py-4">Timing</th>
                      <th className="px-6 py-4 text-center">Duration</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4 text-right pr-10">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeAppointments.map((app, i) => (
                      <motion.tr 
                        key={app.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="group hover:bg-slate-50 transition-all rounded-3xl"
                      >
                        <td className="px-6 py-5 first:rounded-l-[28px]">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${colors[i % 5]} rounded-2xl flex items-center justify-center text-white/90 font-black text-lg border-4 border-white shadow-sm shadow-slate-200`}>
                              {getInitials(app.guestName)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-black text-slate-900 truncate">{app.guestName}</div>
                              <div className="text-xs font-bold text-slate-500 truncate">{app.guestEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-black text-slate-700">
                            {new Date(app.startTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </div>
                          <div className="text-xs font-bold text-brand">
                            {new Date(app.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500">
                            {Math.round((new Date(app.endTime) - new Date(app.startTime)) / 60000)} MIN
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${app.status === 'cancelled' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                              {app.status === "cancelled" ? "Cancelled" : "G-Meet Link"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 last:rounded-r-[28px] text-right pr-6">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setReschedulingId(app.id);
                                setIsRescheduleOpen(true);
                                setNewSlot({ date: '', time: '' });
                              }}
                              className="p-3 text-slate-500 hover:text-brand hover:bg-white rounded-xl transition-all font-black text-xs uppercase tracking-widest border border-transparent hover:border-slate-200"
                            >
                              Reschedule
                            </button>
                            {app.status !== 'cancelled' && (
                              <button 
                                onClick={() => {
                                  setCancellingId(app.id);
                                  setIsModalOpen(true);
                                }}
                                className="p-3 text-rose-400 hover:bg-rose-50 rounded-xl transition-all font-black text-xs uppercase tracking-widest"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/40 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-10 rounded-[40px] max-w-sm w-full text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-200"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-rose-500 border border-rose-100">
                <AlertCircle size={36} strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-3 text-slate-900">Cancel meeting?</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                This will notify <span className="text-slate-900 font-black">{safeAppointments.find(a => a.id === cancellingId)?.guestName}</span>. This action is permanent.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => cancelAppointment(cancellingId)}
                  className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-rose-200 hover:bg-rose-600 active:scale-[0.98] transition-all"
                >
                  Confirm Cancellation
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-5 bg-slate-50 text-slate-500 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all mt-2"
                >
                  Never mind
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRescheduleOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/40 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-10 rounded-[40px] max-w-sm w-full text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-200"
            >
              <h3 className="text-2xl font-black tracking-tight mb-6">Reschedule</h3>
              <div className="space-y-4 text-left mb-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">New Date</label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={e => setNewSlot(s => ({ ...s, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">New Time</label>
                  <input
                    type="time"
                    value={newSlot.time}
                    onChange={e => setNewSlot(s => ({ ...s, time: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => rescheduleAppointment(reschedulingId)}
                  disabled={!newSlot.date || !newSlot.time}
                  className="w-full py-4 bg-brand text-white rounded-2xl font-black text-base shadow-lg shadow-brand/20 hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Confirm Reschedule
                </button>
                <button
                  onClick={() => setIsRescheduleOpen(false)}
                  className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-base hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
