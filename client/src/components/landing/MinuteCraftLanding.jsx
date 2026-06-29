import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import UseCasesSection from './UseCasesSection';
import TestimonialsSection from './TestimonialsSection';
import PricingTeaserSection from './PricingTeaserSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';

const MinuteCraftLanding = () => {
  return (
    <div className="w-full bg-white font-sans text-slate-900 overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <TestimonialsSection />
      <PricingTeaserSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default MinuteCraftLanding;
