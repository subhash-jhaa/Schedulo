'use client';

import React from 'react';

export default function Trust() {
  return (
    <section className="bg-bg-subtle py-24 overflow-hidden border-b border-border-light">
      <div className="max flex flex-col items-center">
        <p className="text-[15px] font-black text-ink-muted uppercase tracking-[0.2em] mb-12">
          Trusted by <span className="text-blue">20,000,000+</span> users worldwide
        </p>
        <div className="flex flex-wrap justify-between items-center w-full max-w-5xl gap-10 opacity-60">
          {['Google', 'Netflix', 'Microsoft', 'Adobe', 'Stripe', 'eBay'].map(brand => (
            <div key={brand} className="text-3xl font-black text-ink-body tracking-tighter italic">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
