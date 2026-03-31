'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Globe, Mail, Shield, Zap } from 'lucide-react';

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const features = [
    { title: 'Calendar sync', icon: <Calendar size={28} className="text-blue" />, desc: 'Works with your existing calendars to prevent double bookings.' },
    { title: 'Auto time zones', icon: <Globe size={28} className="text-blue" />, desc: 'Automatic detection for you and your guests. No more manual math.' },
    { title: 'Email triggers', icon: <Mail size={28} className="text-blue" />, desc: 'Send automatic reminders and thank-you notes to your guests.' },
    { title: '40+ integrations', icon: <Zap size={28} className="text-blue" />, desc: 'Connect with Zoom, Teams, Salesforce, and all your favorite tools.' },
    { title: 'Enterprise security', icon: <Shield size={28} className="text-blue" />, desc: 'SSO, SAML, and SOC2 compliance for your peace of mind.' },
    { title: 'Workflow automation', icon: <CheckCircle2 size={28} className="text-blue" />, desc: 'Scale your scheduling with automated workflows and tracking.' }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-black text-ink mb-6 tracking-tight"
          >
            Scheduling for every <span className="text-blue">scenario</span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-ink-body font-medium leading-relaxed"
          >
            Schedulo automates the entire meeting lifecycle—from booking to follow-up. 
            So you can spend your time on what matters.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group p-10 border border-transparent rounded-3xl hover:border-blue hover:bg-bg-subtle transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="mb-8 p-4 bg-blue-light w-fit rounded-2xl group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h4 className="text-2xl font-black text-ink mb-4">{f.title}</h4>
              <p className="text-lg text-ink-body font-medium leading-normal opacity-80">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
