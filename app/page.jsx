'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Integrations from '../components/Integrations';
import Pricing from '../components/Pricing';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="landing-wrapper pt-20">
      <Navbar />
      <Hero />
      <Features />
      <Integrations />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
