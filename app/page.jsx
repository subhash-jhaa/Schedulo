import LandingAdditionalFeatures from '../components/landing/LandingAdditionalFeatures';
import LandingBentoFeatures from '../components/landing/LandingBentoFeatures';
import LandingDashboardMockup from '../components/landing/LandingDashboardMockup';
import LandingFooter from '../components/landing/LandingFooter';
import LandingHero from '../components/landing/LandingHero';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingTestimonials from '../components/landing/LandingTestimonials';

export default function Page() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingDashboardMockup />
        <LandingBentoFeatures />
        <LandingTestimonials />
        <LandingAdditionalFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}
