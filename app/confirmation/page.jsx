'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ConfirmationContent() {
  const params = useSearchParams();
  const guestName = params.get('guest') || 'Guest';
  const hostName = params.get('host') || 'Host';
  const date = params.get('date') || '';
  const time = params.get('time') || '';
  const timezone = params.get('tz') || 'UTC';

  return (
    <div className="min-h-screen bg-[#080C10] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#111820] border border-white/5 rounded-2xl p-10 text-center">
        <div className="w-20 h-20 bg-[#00D4AA]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="#00D4AA" strokeWidth="2"/>
            <path d="M12 20l6 6 10-12" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-3xl font-syne font-bold mb-2">You are booked!</h1>
        <p className="text-white/40 mb-8">
          A confirmation has been sent to your email.
        </p>

        {date && (
          <div className="bg-[#080C10] rounded-xl p-5 text-left mb-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Meeting with</span>
              <span className="font-medium">{hostName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Date</span>
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Time</span>
              <span className="font-medium">{time} ({timezone})</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting+with+${hostName}&dates=${date}&details=Booked+via+Schedulo`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 bg-[#00D4AA] text-black font-bold rounded-xl hover:bg-[#00F7C7] transition-all text-sm"
          >
            Add to Google Calendar
          </a>
          <Link
            href="/"
            className="w-full py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-sm"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080C10]" />}>
      <ConfirmationContent />
    </Suspense>
  );
}
