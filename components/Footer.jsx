'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border-light">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-ink-muted font-medium">
        <div className="font-bold text-ink text-lg">Schedulo</div>
        <p>Built with Next.js 16</p>
        <div className="flex gap-6 uppercase tracking-wider">{['Privacy', 'Terms', 'Contact'].map(l=><a key={l} href="#" className="hover:text-blue transition-colors">{l}</a>)}</div>
      </div>
    </footer>
  );
}
