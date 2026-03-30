'use client';

import React from 'react';

export default function Integrations() {
  return (
    <section className="py-24">
      <div className="max text-center mb-16">
        <h2 className="text-3xl font-extrabold mb-4 text-ink">Works where you do</h2>
        <p className="text-ink-muted">Connect Schedulo with your daily tools.</p>
      </div>
      <div className="max grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Google Calendar', 'Outlook', 'Zoom', 'Slack', 'Zapier', 'Stripe', 'Notion', 'Google Meet'].map(t=>(
          <div key={t} className="bg-white border border-border-light p-5 rounded-xl flex items-center gap-4 font-bold text-sm shadow-sm">{t}</div>
        ))}
      </div>
    </section>
  );
}
