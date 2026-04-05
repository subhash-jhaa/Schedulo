import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10 p-10 bg-white rounded-[40px] border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.08)] mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 border border-red-100">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Authentication Error</h1>
          <p className="text-center text-slate-600 font-bold text-lg leading-relaxed">
            Something went wrong during authentication. The code may have expired or is invalid.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
          >
            Try signing in again
          </Link>

          <Link
            href="/register"
            className="w-full h-14 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            Create a new account
          </Link>

          <Link
            href="/"
            className="w-full text-center text-sm font-black text-slate-600 hover:text-slate-900 py-3 transition-colors"
          >
            Back to home
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500 font-bold mt-8 leading-relaxed">
          If you continue to experience issues, please contact support or try again later.
        </p>
      </div>
    </div>
  );
}
