'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Pricing() {
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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const plans = [
    {
      name: 'Basic', price: '$0',
      desc: 'Everything you need to get started with basic scheduling.',
      features: ['1 Calendar connection', 'Unlimited active polls', 'Personalized booking link'],
      buttonText: 'Get Started', popular: false, bgButton: 'bg-white border-2 border-blue text-blue hover:bg-blue/5'
    },
    {
      name: 'Professional', price: '$12',
      desc: 'The most flexible way for individuals to schedule meetings.',
      features: ['6 Calendar connections', 'Multiple event types', 'Group meetings'],
      buttonText: 'Try for free', popular: true, bgButton: 'bg-blue text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02]'
    },
    {
      name: 'Teams', price: '$16',
      desc: 'Everything in Pro plus features for collaboration & reporting.',
      features: ['Admin management', 'Team scheduling', 'Custom branding'],
      buttonText: 'Try for free', popular: false, bgButton: 'bg-white border-2 border-blue text-blue hover:bg-blue/5'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-bg-subtle">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants} className="text-center mb-20"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-ink mb-6 tracking-tight">
            Plans for every <span className="text-blue">team size</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-ink-body font-medium max-w-2xl mx-auto">
            Simple, transparent pricing that scales with you. No hidden fees.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan, i) => (
            <motion.div 
              key={i} variants={itemVariants} whileHover={{ y: -10 }}
              className={`relative p-10 rounded-[40px] border-2 transition-all bg-white border-transparent hover:border-blue ${plan.popular ? 'shadow-2xl shadow-blue-500/10 z-10' : 'shadow-sm hover:shadow-xl'}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -track-x-1/2 -translate-x-1/2 bg-blue text-white px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-lg">Most Popular</div>
              )}
              <div className="text-2xl font-black text-ink mb-2">{plan.name}</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black text-ink">{plan.price}</span>
                <span className="text-ink-body font-bold">/mo</span>
              </div>
              <p className="text-lg text-ink-body font-medium leading-relaxed mb-8 h-20">{plan.desc}</p>
              <div className="space-y-4 mb-10">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-ink-body font-bold text-sm">
                    <Check size={18} className="text-blue flex-shrink-0" /> {feat}
                  </div>
                ))}
              </div>
              <Link href="/register" className={`block text-center py-5 rounded-2xl font-black text-lg transition-all ${plan.bgButton}`}>
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
