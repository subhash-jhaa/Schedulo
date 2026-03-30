'use client';

import React from 'react';
import { CheckCircle2, Calendar, Globe, Mail, Shield, Zap } from 'lucide-react';

export default function Features() {
  const features = [
    { title: 'Calendar sync', icon: <Calendar size={28} className="text-blue" />, desc: 'Works with your existing calendars to prevent double bookings.' },
    { title: 'Auto time zones', icon: <Globe size={28} className="text-blue" />, desc: 'Automatic detection for you and your guests. No more manual math.' },
    { title: 'Email triggers', icon: <Mail size={28} className="text-blue" />, desc: 'Send automatic reminders and thank-you notes to your guests.' },
    { title: '40+ integrations', icon: <Zap size={28} className="text-blue" />, desc: 'Connect with Zoom, Teams, Salesforce, and all your favorite tools.' },
    { title: 'Enterprise security', icon: <Shield size={28} className="text-blue" />, desc: 'SSO, SAML, and SOC2 compliance for your peace of mind.' },
    { title: 'Workflow automation', icon: <CheckCircle2 size={28} className="text-blue" />, desc: 'Scale your scheduling with automated workflows and tracking.' }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-ink mb-6 italic tracking-tight">
            Scheduling for every <span className="text-blue">scenario</span>
          </h2>
          <p className="text-xl text-ink-body font-medium leading-relaxed">
            Schedulo automates the entire meeting lifecycle—from booking to follow-up. 
            So you can spend your time on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-10 border border-border-light rounded-3xl hover:border-blue hover:bg-bg-subtle transition-all duration-300">
              <div className="mb-8 p-4 bg-blue-light w-fit rounded-2xl group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h4 className="text-2xl font-black text-ink mb-4">{f.title}</h4>
              <p className="text-lg text-ink-body font-medium leading-normal opacity-80">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
