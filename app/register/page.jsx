'use client';

import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Calendar as CalendarIcon, Check, ArrowLeft, ArrowRight, User, Mail, Lock, ShieldCheck, Globe, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const CALENDAR_OPTIONS = [
  { id: 'google', name: 'Google Calendar', icon: <Globe size={24} />, desc: 'Sync with your Google workspace' },
  { id: 'outlook', name: 'Outlook Calendar', icon: <CalendarIcon size={24} />, desc: 'Sync with Microsoft account' },
  { id: 'skip', name: 'Skip for now', icon: <Check size={24} />, desc: 'Configure later in dashboard' },
];

export default function RegisterPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
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
  const handleBack = () => setStep(s => s - 1);

  const handleRegister = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    if (!isLoaded) return;
    setLoading(true);
    setError('');

    try {
      const res = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.fullName.split(' ')[0] || 'User',
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
        username: formData.username
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err) {
      console.error("Clerk Registration Full Error:", err);
      const errorMessage = err.errors?.[0]?.longMessage || err.message || 'Failed to create account';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== 'complete') {
        setError("Verification incomplete. Please check all fields.");
      }

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });

        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: completeSignUp.createdUserId,
            email: formData.email,
            fullName: formData.fullName,
            username: formData.username
          })
        });

        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Failed to verify');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-jakarta text-ink">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-blue-light/30 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-light/20 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md z-10 p-10 bg-white rounded-[40px] border border-border-light shadow-[0_32px_64px_-16px_rgba(11,53,88,0.1)] mx-4"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-blue-light rounded-2xl flex items-center justify-center text-blue mb-6">
              <Mail size={32} />
            </div>
            <h1 className="text-3xl font-black text-ink tracking-tight mb-3">Check your email</h1>
            <p className="text-center text-ink-body font-bold text-lg leading-relaxed">
              We've sent a code to <span className="text-blue font-black">{formData.email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-3 text-center">
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-16 text-4xl font-black text-center tracking-[0.5em] px-4 rounded-2xl border-2 border-border-light bg-bg-surface focus:border-blue focus:bg-white outline-none transition-all"
                placeholder="000000"
                required
              />
              <p className="text-xs font-bold text-ink-muted">Enter the 6-digit verification code</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-blue text-white rounded-2xl font-black text-lg shadow-xl shadow-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Verify account'}
            </button>

            <button 
              type="button"
              className="w-full text-center text-sm font-black text-blue hover:underline"
              onClick={() => {
                setVerifying(false);
                setStep(1);
              }}
            >
              Wait, that's not my email
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-jakarta text-ink py-20">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-blue-light/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-light/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl z-10 p-10 bg-white rounded-[40px] border border-border-light shadow-[0_32px_64px_-16px_rgba(11,53,88,0.1)] mx-4"
      >
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue/20">
              <CalendarIcon size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-ink tracking-tighter">Schedulo</span>
          </Link>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step >= s ? 'w-8 bg-blue' : 'w-4 bg-border-light'}`} />
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
                <h1 className="text-3xl font-black text-ink tracking-tight mb-2">Create your account</h1>
                <p className="text-ink-body font-bold">Join Schedulo to simplify your scheduling</p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => signUp.authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: '/sso-callback', redirectUrlComplete: '/dashboard' })}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-border-light h-14 rounded-2xl font-black text-ink hover:border-blue hover:bg-bg-surface transition-all active:scale-[0.98]"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
                  Sign up with Google
                </button>

                <button
                  type="button"
                  onClick={() => signUp.authenticateWithRedirect({ strategy: 'oauth_microsoft', redirectUrl: '/sso-callback', redirectUrlComplete: '/dashboard' })}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-border-light h-14 rounded-2xl font-black text-ink hover:border-blue hover:bg-bg-surface transition-all active:scale-[0.98]"
                >
                  <div className="w-5 h-5">
                    <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
                  </div>
                  Sign up with Microsoft
                </button>

                <div className="flex items-center gap-4">
                  <div className="h-px bg-border-light flex-1"></div>
                  <span className="text-[10px] font-black text-ink-muted uppercase tracking-[0.2em]">OR EMAIL</span>
                  <div className="h-px bg-border-light flex-1"></div>
                </div>
              </div>

              <form onSubmit={handleNext} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-black text-ink ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-muted" size={20} />
                    <input
                      type="text"
                      className="w-full h-14 pl-12 pr-5 rounded-2xl border-2 border-border-light bg-bg-surface focus:border-blue focus:bg-white outline-none font-bold text-ink transition-all"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-ink ml-1">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-muted" size={20} />
                    <input
                      type="email"
                      className="w-full h-14 pl-12 pr-5 rounded-2xl border-2 border-border-light bg-bg-surface focus:border-blue focus:bg-white outline-none font-bold text-ink transition-all"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-blue text-white rounded-2xl font-black text-lg shadow-xl shadow-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center mt-4"
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
                <button onClick={handleBack} className="flex items-center gap-2 text-ink-muted font-black text-sm hover:text-blue mb-4 transition-colors">
                  <ArrowLeft size={16} /> Back
                </button>
                <h1 className="text-3xl font-black text-ink tracking-tight mb-2">Secure your account</h1>
                <p className="text-ink-body font-bold">Pick a unique username and strong password</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-black text-ink ml-1">Username</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-muted font-black">schedulo.me/</span>
                    <input
                      type="text"
                      className="w-full h-14 pl-[115px] pr-5 rounded-2xl border-2 border-border-light bg-bg-surface focus:border-blue focus:bg-white outline-none font-bold text-ink transition-all"
                      placeholder="username"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-ink ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-muted" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-border-light bg-bg-surface focus:border-blue focus:bg-white outline-none font-bold text-ink transition-all"
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {formData.password && (
                    <div className="space-y-2 pt-2">
                      <div className="h-2 w-full bg-border-light rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: `${strength.score}%` }} />
                      </div>
                      <p className="text-xs font-black text-ink-muted flex justify-between uppercase tracking-wider">
                        <span>Strength: {strength.label}</span>
                        <span>{strength.score}%</span>
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full h-14 bg-blue text-white rounded-2xl font-black text-lg shadow-xl shadow-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center mt-4"
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
                <button onClick={handleBack} className="flex items-center gap-2 text-ink-muted font-black text-sm hover:text-blue mb-4 transition-colors">
                  <ArrowLeft size={16} /> Back
                </button>
                <h1 className="text-3xl font-black text-ink tracking-tight mb-2">Calendar sync</h1>
                <p className="text-ink-body font-bold">Where should we check for availability?</p>
              </div>

              <div className="grid gap-4">
                {CALENDAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFormData({...formData, calendar: opt.id})}
                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left ${
                      formData.calendar === opt.id 
                      ? 'border-blue bg-blue-light/20 shadow-lg shadow-blue/5' 
                      : 'border-border-light hover:border-blue/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.calendar === opt.id ? 'bg-blue text-white' : 'bg-bg-surface text-ink-muted'}`}>
                      {opt.icon}
                    </div>
                    <div>
                      <div className="font-black text-ink">{opt.name}</div>
                      <div className="text-sm font-bold text-ink-muted">{opt.desc}</div>
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
                className="w-full h-16 bg-blue text-white rounded-2xl font-black text-lg shadow-xl shadow-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center mt-4 disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Complete registration'}
              </button>

              <div className="bg-bg-surface p-5 rounded-3xl flex items-start gap-3">
                <ShieldCheck size={20} className="text-emerald-500 mt-1 flex-shrink-0" />
                <p className="text-xs font-bold text-ink-muted leading-relaxed">
                  Your data is encrypted. We only sync your busy/free status and never share your meeting details with unauthorized parties.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center mt-12 text-ink-body font-bold">
          Already have an account?{' '}
          <Link href="/login" className="text-blue hover:underline font-black">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
