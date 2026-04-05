import React from 'react';
import { FOOTER_LINKS } from './constants';
import Logo from './Logo';

export default function LandingFooter() {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <Logo variant="footer" />

        <div className="flex gap-6 text-sm font-medium text-slate-500">
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-slate-900 transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-slate-200 text-center text-sm text-slate-400">
        © 2026 Schedulr Inc. All rights reserved.
      </div>
    </footer>
  );
}
