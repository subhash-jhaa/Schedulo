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
  AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      fetchAppointments();
    };
    init();
  }, [supabase]);

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
  
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const thisWeekBookings = safeAppointments.filter(
    a => new Date(a.startTime) >= startOfWeek
  ).length;
  
  const totalHours = safeAppointments.reduce((acc, curr) => acc + (Number(curr.duration) / 60 || 0), 0).toFixed(1);

  return (
    <div className="min-h-screen bg-surface-dark flex text-white font-inter">
      <Sidebar />
      
      <main className="flex-1 ml-[240px] p-10 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 text-white">
          <div>
            <h1 className="text-3xl font-syne font-bold mb-2 text-white">
              Good {new Date().getHours() < 12 ? "morning" : "afternoon"}, {user?.user_metadata?.full_name?.split(" ")[0] || "there"}
            </h1>
            <p className="text-white opacity-40">Here is what is happening today.</p>
          </div>
          
          <button 
            onClick={copyLink}
            className="flex items-center gap-2 bg-white bg-opacity-5 border border-white border-opacity-10 px-6 py-3 rounded-xl hover:bg-opacity-10 transition-all font-medium text-white cursor-pointer"
          >
            {copied ? <Check size={18} className="text-brand" /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy booking link"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Bookings", value: totalBookings, icon: CalendarCheck },
            { label: "This Week", value: thisWeekBookings, icon: Users },
            { label: "Hours Booked", value: totalHours + "h", icon: Clock },
            { label: "Cancellations", value: cancelledBookings, icon: X }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-surface border border-white border-opacity-5 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white opacity-40 text-sm">{stat.label}</span>
                <stat.icon size={20} className="text-brand opacity-50" />
              </div>
              <div className="text-3xl font-syne font-bold">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Table */}
        <div className="bg-surface border border-white border-opacity-5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white border-opacity-5 flex justify-between items-center">
            <h2 className="text-xl font-syne font-bold">Upcoming Appointments</h2>
            <div className="p-2 hover:bg-white hover:bg-opacity-5 rounded-lg cursor-pointer transition-all">
              <MoreHorizontal size={20} className="opacity-40" />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 w-full bg-white bg-opacity-5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : safeAppointments.length === 0 ? (
              <div className="p-20 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white bg-opacity-5 rounded-full flex items-center justify-center mb-6">
                  <CalendarIcon size={32} className="opacity-20" />
                </div>
                <h3 className="text-xl font-bold mb-2">No upcoming meetings</h3>
                <p className="text-white opacity-40 mb-8 max-w-xs">Share your booking link to start receiving appointments from your guests.</p>
                <button 
                  onClick={copyLink}
                  className="bg-brand text-black px-8 py-3 rounded-xl font-bold hover:bg-brand-hover transition-all cursor-pointer border-none"
                >
                  Share Link
                </button>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-white opacity-30 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Guest</th>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Duration</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white divide-opacity-5">
                  {safeAppointments.map((app, i) => (
                    <motion.tr 
                      key={app.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white hover:bg-opacity-[0.02] transition-all group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={"w-10 h-10 " + colors[i % 5] + " rounded-full flex items-center justify-center text-black font-bold text-sm"}>
                            {getInitials(app.guestName)}
                          </div>
                          <div>
                            <div className="font-bold">{app.guestName}</div>
                            <div className="text-xs opacity-40">{app.guestEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">
                          {new Date(app.startTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </div>
                        <div className="text-xs opacity-40">
                          {new Date(app.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          <span style={{ opacity: 0.4, fontSize: 11 }}> {app.timezone || "UTC"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm opacity-60">
                        {Math.round((new Date(app.endTime) - new Date(app.startTime)) / 60000)} min
                      </td>
                      <td className="px-6 py-4">
                        <span className={"px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider " + (
                          app.status === "cancelled"
                            ? "bg-red-500 bg-opacity-20 text-red-400"
                            : "bg-green-500 bg-opacity-20 text-green-400"
                        )}>
                          {app.status === "cancelled" ? "Cancelled" : "Google Meet"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-white bg-transparent hover:bg-white hover:bg-opacity-5 rounded-lg transition-all border-none cursor-pointer text-sm">
                            Reschedule
                          </button>
                          {app.status !== 'cancelled' && (
                            <button 
                              onClick={() => {
                                setCancellingId(app.id);
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-red-400 bg-transparent hover:bg-red-400 hover:bg-opacity-5 rounded-lg transition-all border-none cursor-pointer text-sm"
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
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black bg-opacity-80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface border border-white border-opacity-5 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-400 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-syne font-bold mb-2 text-white">Cancel this meeting?</h3>
              <p className="text-white opacity-40 mb-8">
                Are you sure you want to cancel your meeting with {safeAppointments.find(a => a.id === cancellingId)?.guestName}? This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => cancelAppointment(cancellingId)}
                  className="w-full py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all border-none cursor-pointer"
                >
                  Yes, cancel meeting
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 bg-white bg-opacity-5 text-white rounded-xl font-bold hover:bg-opacity-10 transition-all border-none cursor-pointer"
                >
                  Keep it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
