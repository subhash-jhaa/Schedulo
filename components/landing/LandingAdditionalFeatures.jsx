'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ADDITIONAL_FEATURES } from './constants';

export default function LandingAdditionalFeatures() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            Full stack scheduling agents for every team
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Understand where your brand shows up, optimize availability to capture intent, and track performance across
            channels with clear insights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {ADDITIONAL_FEATURES.map((feature, index) => {
            const Icon = feature.Icon;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                key={feature.title}
                className="flex gap-4 p-6 rounded-[2rem] border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="text-slate-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
