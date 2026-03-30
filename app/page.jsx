'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProductFrame from '../components/ProductFrame';
import Trust from '../components/Trust';
import How from '../components/How';
import Features from '../components/Features';
import Integrations from '../components/Integrations';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <Navbar />
      <HeroSection />
      <ProductFrame />
      <Trust />
      <How />
      <Features />
      <Integrations />
      <CTA />
      <Footer />
    </div>
  );
}
