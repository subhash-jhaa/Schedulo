'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
      } else {
        console.error(result);
      }
    } catch (err) {
      setError(err.errors[0]?.longMessage || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/dashboard',
    });
  };

  const signInWithMicrosoft = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: 'oauth_microsoft',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/dashboard',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-jakarta text-ink">
      {/* Subtle background decoration similar to landing page */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-blue-light/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-light/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10 p-10 bg-white rounded-[40px] border border-border-light shadow-[0_32px_64px_-16px_rgba(11,53,88,0.1)] mx-4"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue/20">
              <CalendarIcon size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-ink tracking-tighter">Schedulo</span>
          </Link>
          <h1 className="text-3xl font-black text-ink tracking-tight">Welcome back</h1>
          <p className="text-ink-body font-bold mt-2">Sign in to your account</p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-border-light h-14 rounded-2xl font-black text-ink hover:border-blue hover:bg-bg-surface transition-all active:scale-[0.98]"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
            </div>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={signInWithMicrosoft}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-border-light h-14 rounded-2xl font-black text-ink hover:border-blue hover:bg-bg-surface transition-all active:scale-[0.98]"
          >
            <div className="w-6 h-6 flex items-center justify-center p-1">
              <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
            </div>
            Continue with Microsoft
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-border-light flex-1"></div>
          <span className="text-[10px] font-black text-ink-muted uppercase tracking-[0.2em]">OR EMAIL</span>
          <div className="h-px bg-border-light flex-1"></div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-black text-ink ml-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl border-2 border-border-light bg-bg-surface focus:border-blue focus:bg-white outline-none font-bold text-ink transition-all"
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-black text-ink">Password</label>
              <Link href="/forgot-password" size="sm" className="text-xs font-bold text-blue hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-5 pr-12 rounded-2xl border-2 border-border-light bg-bg-surface focus:border-blue focus:bg-white outline-none font-bold text-ink transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-blue text-white rounded-2xl font-black text-lg shadow-xl shadow-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign in to account'}
          </button>
        </form>

        <p className="text-center mt-10 text-ink-body font-bold">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue hover:underline font-black">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}