'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Link as LinkIcon, Check, Loader2, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', username: '' });

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;
      setUser(currentUser);

      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setDbUser(data);
        setForm({ name: data.name || '', username: data.username || '' });
      }
      setLoading(false);
    };
    init();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, username: form.username }),
      });
      if (!res.ok) throw new Error('Failed');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/book/${form.username}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans antialiased text-slate-900">
      <Sidebar />
      <main className="flex-1 md:ml-[280px] p-8 pt-16 md:pt-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tight mb-2">Settings</h1>
            <p className="text-slate-600 font-medium">Manage your profile and booking link.</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-3xl animate-pulse border border-slate-200" />)}
            </div>
          ) : (
            <div className="space-y-6">

              {/* Profile Card */}
              <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 shadow-sm">
                <h2 className="text-xl font-black tracking-tight mb-6">Profile</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:border-brand transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                      <input
                        type="text"
                        value={form.username}
                        onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/\s/g, '') }))}
                        className="w-full pl-9 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:border-brand transition-colors"
                        placeholder="yourname"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-slate-100 font-bold text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className={`mt-6 w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all ${
                    saveStatus === 'success' ? 'bg-emerald-500 text-white' :
                    saveStatus === 'error' ? 'bg-rose-500 text-white' :
                    'bg-brand text-white shadow-lg shadow-brand/20'
                  }`}
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> :
                   saveStatus === 'success' ? <><Check size={18} /> Saved!</> :
                   saveStatus === 'error' ? <><AlertCircle size={18} /> Failed — try again</> :
                   'Save Changes'}
                </motion.button>
              </div>

              {/* Booking Link Card */}
              <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 shadow-sm">
                <h2 className="text-xl font-black tracking-tight mb-2">Your Booking Link</h2>
                <p className="text-slate-500 font-medium text-sm mb-5">Share this link for others to book time with you.</p>
                <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3.5">
                  <LinkIcon size={16} className="text-slate-400 flex-shrink-0" />
                  <span className="flex-1 font-bold text-slate-700 text-sm truncate">
                    {typeof window !== 'undefined' ? `${window.location.origin}/book/${form.username}` : ''}
                  </span>
                  <button onClick={copyLink} className="flex-shrink-0 p-2 hover:bg-slate-200 rounded-xl transition-colors">
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-400" />}
                  </button>
                  <a href={`/book/${form.username}`} target="_blank" rel="noreferrer" className="flex-shrink-0 p-2 hover:bg-slate-200 rounded-xl transition-colors">
                    <ExternalLink size={16} className="text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Calendar Status Card */}
              <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 shadow-sm">
                <h2 className="text-xl font-black tracking-tight mb-5">Connected Calendar</h2>
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className={`w-3 h-3 rounded-full ${dbUser?.googleAccessToken ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <div>
                    <p className="font-black text-slate-800 text-sm">Google Calendar</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {dbUser?.googleAccessToken ? 'Connected — events sync automatically' : 'Not connected'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
