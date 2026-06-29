import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PricingSection = () => {
  return (
    <div className="py-24 bg-gray-50 relative z-10 w-full">
      <div className="max-w-7xl w-full mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto items-stretch justify-items-center">
          {/* Free Tier */}
          <div
            className="w-full max-w-sm h-full flex flex-col justify-between overflow-visible bg-white p-8 rounded-3xl border border-gray-200 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex-grow break-words">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-extrabold text-gray-900 mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['5 reports/month', 'Basic AI extraction', 'Standard templates', 'PDF Export'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600 gap-3">
                    <Check size={20} className="text-purple-600" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-bold hover:border-gray-900 transition-colors">
              Get Started
            </button>
          </div>

          {/* Pro Tier */}
          <div
            className="w-full max-w-sm h-full flex flex-col justify-between overflow-visible bg-white p-8 rounded-3xl border-2 border-purple-400 shadow-xl shadow-purple-500/10 transform lg:scale-105 lg:-translate-y-5 transition-all duration-300 hover:-translate-y-7 relative z-10"
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap shadow-md">
              Most Popular
            </div>
            <div className="flex-grow mt-6 break-words">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-extrabold text-gray-900 mb-6">$29<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Unlimited reports', 'Advanced AI insights', 'Premium templates', 'PPTX & PDF Export', 'Team sharing'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600 gap-3">
                    <Check size={20} className="text-purple-600" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold hover:opacity-90 transition-opacity">
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Tier */}
          <div
            className="w-full max-w-sm h-full flex flex-col justify-between overflow-visible bg-white p-8 rounded-3xl border border-gray-200 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex-grow break-words">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-extrabold text-gray-900 mb-6">Custom</div>
              <ul className="space-y-4 mb-8">
                {['Custom AI models', 'SSO & SAML', 'Dedicated support', 'Custom templates', 'API access'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600 gap-3">
                    <Check size={20} className="text-purple-600" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-bold hover:border-gray-900 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
