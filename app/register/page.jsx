'use client';

import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Calendar, Check, ArrowLeft, ArrowRight, User, Mail, Lock, ShieldCheck, Globe } from 'lucide-react';
import Link from 'next/link';

const CALENDAR_OPTIONS = [
  { id: 'google', name: 'Google Calendar', icon: <Globe size={20} />, desc: 'Sync with your Google workspace' },
  { id: 'outlook', name: 'Outlook Calendar', icon: <Calendar size={20} />, desc: 'Sync with Microsoft account' },
  { id: 'skip', name: 'Skip for now', icon: <Check size={20} />, desc: 'Configure later in dashboard' },
];

export default function RegisterPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
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
    if (!pwd) return { score: 0, label: 'None', color: 'bg-white/10' };
    if (pwd.length < 6) return { score: 25, label: 'Weak', color: 'bg-red-500' };
    if (pwd.length < 10) return { score: 50, label: 'Fair', color: 'bg-orange-500' };
    if (/[!@#$%^&*]/.test(pwd)) return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 75, label: 'Good', color: 'bg-yellow-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleRegister = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    if (!isLoaded) return;
    setLoading(true);
    setError('');

    try {
      // Step 1: Create the sign up
      const res = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.fullName.split(' ')[0] || 'User',
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
        username: formData.username
      });

      // Step 2: Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Step 3: Switch UI to verification
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
        console.log(JSON.stringify(completeSignUp, null, 2));
        setError("Verification incomplete. Please check all fields.");
      }

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/dashboard');
      }
    } catch (err) {
      console.error("Verification Error:", err);
      setError(err.errors?.[0]?.longMessage || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080C10] relative overflow-hidden font-inter text-white p-4">
        <div className="absolute inset-0 z-0 opacity-20" style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, #00D4AA 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md z-10 bg-[#111820] rounded-2xl border border-white/5 shadow-2xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-[#00D4AA]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#00D4AA]">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold font-syne mb-2">Check your email</h2>
          <p className="text-white/50 mb-8">We've sent a 6-digit verification code to <br/><span className="text-white">{formData.email}</span></p>
          
          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-[#080C10] border border-white/10 rounded-xl h-12 text-center text-xl tracking-[1em] font-bold focus:ring-2 focus:ring-[#00D4AA]/50 focus:border-[#00D4AA] outline-none transition-all"
              maxLength={6}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-[#00D4AA] text-black h-12 rounded-xl font-bold hover:bg-[#00F7C7] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Continue'}
            </button>
            <button 
              type="button"
              onClick={() => setVerifying(false)}
              className="text-white/30 text-sm hover:text-white transition-colors"
            >
              Back to registration
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080C10] relative overflow-hidden font-inter text-white p-4">
      {/* Grid Texture */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ 
        backgroundImage: `radial-gradient(circle at 1px 1px, #00D4AA 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg z-10 bg-[#111820] rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className="h-full bg-[#00D4AA]"
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold font-syne tracking-tight">Create account</h2>
                  <p className="text-white/50 mt-2">Get started for free today</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-[#080C10] border border-white/10 rounded-xl h-12 pl-12 pr-4 focus:ring-2 focus:ring-[#00D4AA]/50 focus:border-[#00D4AA] transition-all outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#080C10] border border-white/10 rounded-xl h-12 pl-12 pr-4 focus:ring-2 focus:ring-[#00D4AA]/50 focus:border-[#00D4AA] transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-[#080C10] border border-white/10 rounded-xl h-12 pl-12 pr-4 focus:ring-2 focus:ring-[#00D4AA]/50 focus:border-[#00D4AA] transition-all outline-none"
                      />
                    </div>
                    {/* Strength Meter */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex gap-1 h-1 flex-1 mr-4 rounded-full overflow-hidden bg-white/5">
                        <motion.div 
                          className={`h-full ${strength.color}`} 
                          animate={{ width: `${strength.score}%` }} 
                        />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                        {strength.label}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!formData.fullName || !formData.email || formData.password.length < 6}
                  onClick={handleNext}
                  className="w-full bg-[#00D4AA] text-black h-12 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Next <ArrowRight size={18} />
                </motion.button>

                <p className="text-center text-sm text-white/40">
                  Already have an account? <Link href="/login" className="text-[#00D4AA] font-bold hover:underline">Sign in</Link>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold font-syne tracking-tight">Pick a username</h2>
                  <p className="text-white/50 mt-2">This is your public booking link</p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      type="text"
                      placeholder="username"
                      value={formData.username}
                      onChange={e => setFormData({...formData, 
                        username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                      className="w-full bg-[#080C10] border border-white/10 rounded-xl h-12 pl-12 pr-4 focus:ring-2 focus:ring-[#00D4AA]/50 focus:border-[#00D4AA] transition-all outline-none"
                    />
                  </div>
                  <p className="text-xs text-[#00D4AA] font-mono px-2">
                    Your link: schedulo.app/{formData.username || 'username'}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleBack} className="flex-1 h-12 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={formData.username.length < 4}
                    className="flex-2 bg-[#00D4AA] text-black h-12 rounded-xl font-bold hover:bg-[#00F7C7] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Next <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold font-syne tracking-tight">Sync your calendars</h2>
                  <p className="text-white/50 mt-2">Prevent double bookings automatically</p>
                </div>

                <div className="space-y-3">
                  {CALENDAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setFormData({...formData, calendar: opt.id})}
                      className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 text-left ${
                        formData.calendar === opt.id 
                          ? 'border-[#00D4AA] bg-[#00D4AA]/5 shadow-[0_0_20px_rgba(0,212,170,0.1)]' 
                          : 'border-white/5 bg-[#080C10] hover:border-white/10'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${formData.calendar === opt.id ? 'bg-[#00D4AA] text-black' : 'bg-white/5 text-white/50'}`}>
                        {opt.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{opt.name}</h4>
                        <p className="text-xs text-white/40">{opt.desc}</p>
                      </div>
                      {formData.calendar === opt.id && <Check className="ml-auto text-[#00D4AA]" size={18} />}
                    </button>
                  ))}
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={handleBack} 
                    className="flex-1 h-12 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all text-sm"
                  >
                    Back
                  </button>
                  <button 
                    type="button"
                    onClick={handleRegister}
                    disabled={loading}
                    className="flex-2 bg-[#00D4AA] text-black h-12 rounded-xl font-bold hover:bg-[#00F7C7] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
