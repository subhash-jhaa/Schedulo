'use client';

import React from 'react';
import { motion } from 'framer-motion';

const tools = [
  { name: 'Google Calendar', logo: 'https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png' },
  { name: 'Outlook', logo: 'https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/brand-icons/product/svg/outlook_48x1.svg' },
  { name: 'Zoom', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Zoom_Video_Communications_logo.svg' },
  { name: 'Slack', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
  { name: 'Zapier', logo: 'https://cdn.worldvectorlogo.com/logos/zapier-2.svg' },
  { name: 'Stripe', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
  { name: 'Notion', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
  { name: 'Google Meet', logo: 'https://www.gstatic.com/images/branding/product/1x/meet_2020q4_48dp.png' }
];

export default function Integrations() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="py-32 bg-white">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max text-center mb-16"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-4xl lg:text-5xl font-black mb-6 text-[#0B3558] tracking-tight"
        >
          Works where you do
        </motion.h2>
        <motion.p 
          variants={itemVariants}
          className="text-lg text-[#68819B] font-bold max-w-2xl mx-auto"
        >
          Connect Schedulo with your daily tools to automate your workflow and keep everything in sync.
        </motion.p>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {tools.map((tool) => (
          <motion.div 
            key={tool.name} 
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
            className="group bg-white border-2 border-[#E7EDF6] p-7 rounded-[22px] flex items-center gap-5 font-black text-[#0B3558] transition-all hover:border-[#006BFF] hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
          >
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center p-1 bg-[#F8F9FB] rounded-xl group-hover:bg-white transition-colors">
              <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-lg tracking-tight">{tool.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
