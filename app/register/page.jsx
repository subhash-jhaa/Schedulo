'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Calendar as CalendarIcon, Check, ArrowLeft, ArrowRight, User, Mail, Lock, ShieldCheck, Globe, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const CALENDAR_OPTIONS = [
  { id: 'google', name: 'Google Calendar', icon: <Globe size={24} />, desc: 'Sync with your Google workspace' },
  { id: 'outlook', name: 'Outlook Calendar', icon: <CalendarIcon size={24} />, desc: 'Sync with Microsoft account' },
  { id: 'skip', name: 'Skip for now', icon: <Check size={24} />, desc: 'Configure later in dashboard' },
];

export default function RegisterPage() {
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    username: '',
    calendar: 'google'
  });

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-border-light' };
    if (pwd.length < 6) return { score: 25, label: 'Weak', color: 'bg-red-500' };
    if (pwd.length < 10) return { score: 50, label: 'Fair', color: 'bg-orange-500' };
    if (/[!@#$%^&*]/.test(pwd)) return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 75, label: 'Good', color: 'bg-yellow-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleNext = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setStep(s => s + 1);
  };
  const handleStep2Continue = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.username.trim() || formData.password.length < 8) {
      setError('Please enter a username and a password with at least 8 characters.');
      return;
    }

    setError('');
    setStep(3);
  };
  const handleBack = () => setStep(s => s - 1);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username,
          },
        },
      });

      if (error) throw error;

      if (data?.session) {
        const syncRes = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            username: formData.username,
          }),
        });

        if (!syncRes.ok) {
          const errorData = await syncRes.json();
          throw new Error(errorData.error || 'Failed to sync user data');
        }

        router.push('/dashboard');
        router.refresh();
        return;
      }

      setVerifying(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: code,
        type: 'signup',
      });

      if (verifyError) throw verifyError;
      if (!session) throw new Error("Session not found after verification");

      // Sync user to our database
      const syncRes = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          username: formData.username
        })
      });

      if (!syncRes.ok) {
        const errorData = await syncRes.json();
        throw new Error(errorData.error || "Failed to sync user data");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-jakarta text-slate-900">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md z-10 p-10 bg-white rounded-[40px] border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.08)] mx-4"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mb-6 border border-brand/10">
              <Mail size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Check your email</h1>
            <p className="text-center text-slate-600 font-bold text-lg leading-relaxed">
              We&apos;ve sent a code to <span className="text-brand font-black">{formData.email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-3 text-center">
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-16 text-4xl font-black text-center tracking-[0.5em] px-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-brand focus:bg-white outline-none transition-all"
                placeholder="000000"
                required
              />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enter verification code</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-brand text-white rounded-2xl font-black text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Verify account'}
            </button>

            <button 
              type="button"
              className="w-full text-center text-sm font-black text-brand hover:underline"
              onClick={() => {
                setVerifying(false);
                setStep(1);
              }}
            >
              Wait, that&apos;s not my email
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-jakarta text-slate-900 py-20">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl z-10 p-10 bg-white rounded-[40px] border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.08)] mx-4"
      >
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand/20">
              <CalendarIcon size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">Schedulo</span>
          </Link>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step >= s ? 'w-8 bg-brand' : 'w-4 bg-slate-100'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create your account</h1>
                <p className="text-slate-600 font-bold">Join Schedulo to simplify your scheduling</p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 h-14 rounded-2xl font-black text-slate-700 hover:border-brand/40 hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
                  Sign up with Google
                </button>

                <button
                  type="button"
                  onClick={() => supabase.auth.signInWithOAuth({ provider: 'azure', options: { redirectTo: `${window.location.origin}/auth/callback` } })}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 h-14 rounded-2xl font-black text-slate-700 hover:border-brand/40 hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  <div className="w-5 h-5">
                    <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
                  </div>
                  Sign up with Microsoft
                </button>

                <div className="flex items-center gap-4">
                  <div className="h-px bg-slate-100 flex-1"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">OR EMAIL</span>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>
              </div>

              <form onSubmit={handleNext} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                      type="text"
                      className="w-full h-14 pl-12 pr-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-brand focus:bg-white outline-none font-bold text-slate-700 transition-all"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 ml-1">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                      type="email"
                      className="w-full h-14 pl-12 pr-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-brand focus:bg-white outline-none font-bold text-slate-700 transition-all"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-brand text-white rounded-2xl font-black text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center mt-4"
                >
                  Continue <ArrowRight className="ml-2" size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 font-black text-sm hover:text-brand mb-4 transition-colors">
                  <ArrowLeft size={16} /> Back
                </button>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Secure your account</h1>
                <p className="text-slate-600 font-bold">Pick a unique username and strong password</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 ml-1">Username</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-black pointer-events-none select-none whitespace-nowrap z-10 bg-slate-50/10 pr-1">
                      schedulo.me/
                    </span>
                    <input
                      type="text"
                      className="w-full h-14 pl-[135px] pr-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-brand focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300 relative z-20"
                      placeholder="username"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-brand focus:bg-white outline-none font-bold text-slate-700 transition-all"
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                      >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {formData.password && (
                    <div className="space-y-2 pt-2">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: `${strength.score}%` }} />
                      </div>
                      <p className="text-xs font-black text-slate-400 flex justify-between uppercase tracking-wider">
                        <span>Strength: {strength.label}</span>
                        <span>{strength.score}%</span>
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleStep2Continue}
                  className="w-full h-14 bg-brand text-white rounded-2xl font-black text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center mt-4"
                >
                  Continue <ArrowRight className="ml-2" size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 font-black text-sm hover:text-brand mb-4 transition-colors">
                  <ArrowLeft size={16} /> Back
                </button>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Calendar sync</h1>
                <p className="text-slate-600 font-bold">Where should we check for availability?</p>
              </div>

              <div className="grid gap-4">
                {CALENDAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({...formData, calendar: opt.id})}
                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left ${
                      formData.calendar === opt.id 
                      ? 'border-brand bg-brand/5 shadow-lg shadow-brand/5' 
                      : 'border-slate-100 hover:border-brand/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.calendar === opt.id ? 'bg-brand text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {opt.icon}
                    </div>
                    <div>
                      <div className="font-black text-slate-900">{opt.name}</div>
                      <div className="text-sm font-bold text-slate-500">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold">
                  {error}
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full h-16 bg-brand text-white rounded-2xl font-black text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center mt-4 disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Complete registration'}
              </button>

              <div className="bg-slate-50 p-5 rounded-3xl flex items-start gap-3">
                <ShieldCheck size={20} className="text-emerald-500 mt-1 flex-shrink-0" />
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  Your data is encrypted. We only sync your busy/free status and never share your meeting details with unauthorized parties.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center mt-12 text-slate-600 font-bold">
          Already have an account?{' '}
          <Link href="/login" className="text-brand hover:underline font-black">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
