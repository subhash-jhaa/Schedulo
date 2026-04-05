'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from './constants';

export default function LandingTestimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-[2.75rem] font-semibold tracking-tight text-slate-900 mb-4">Trusted by real teams</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Schedulr is the full stack scheduling platform for the teams of the future: understand, analyze, route,
            build, and measure.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.company}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              className="md:col-span-1"
            >
              <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="font-bold text-xl text-slate-800 mb-4">{testimonial.company}</div>
                <p className="text-sm text-slate-700 leading-relaxed mb-8 flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={testimonial.avatar} alt={testimonial.author} className="w-10 h-10 bg-slate-100 rounded-full" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{testimonial.author}</div>
                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-1"
          >
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[60px] rounded-full -mr-10 -mt-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full -ml-10 -mb-10 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full justify-center text-center">
                <div className="text-[3rem] font-bold text-slate-900 leading-none mb-4">10,000+</div>
                <p className="text-slate-600 font-medium">teams monitor their scheduling performance with our app daily.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
