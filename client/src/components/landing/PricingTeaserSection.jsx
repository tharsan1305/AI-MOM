import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const PricingTeaserSection = () => {
  return (
    <section className="py-24 bg-slate-50 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 w-full">
          {/* Left Text */}
          <div className="w-full lg:w-1/2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight break-words"
            >
              Simple Pricing for Everyone
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-slate-600 mb-8 break-words"
            >
              Start for free and upgrade when your team needs more power. No hidden fees, cancel anytime.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4 mb-10"
            >
              {['Generous free tier', 'Unlimited reports on Pro', 'Cancel anytime'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <Check size={14} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/pricing" className="btn-primary inline-flex items-center gap-2">
                View Full Pricing <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>

          {/* Right Cards */}
          <div className="w-full lg:w-1/2 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {/* Free Teaser */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="card flex flex-col h-full"
              >
                <div className="text-xl font-bold text-slate-900 mb-2">Free</div>
                <div className="text-3xl font-extrabold text-slate-900 mb-6">$0<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <ul className="space-y-3 mb-6 flex-1 text-sm text-slate-600">
                  <li className="flex gap-2"><Check size={16} className="text-primary-500 flex-shrink-0 mt-0.5"/> 5 reports/month</li>
                  <li className="flex gap-2"><Check size={16} className="text-primary-500 flex-shrink-0 mt-0.5"/> Standard templates</li>
                  <li className="flex gap-2"><Check size={16} className="text-primary-500 flex-shrink-0 mt-0.5"/> PDF Export</li>
                </ul>
              </motion.div>

              {/* Pro Teaser */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="card flex flex-col h-full border-2 border-primary-400 shadow-xl shadow-primary-500/10 relative"
              >
                <div className="absolute -top-3 left-6 bg-gradient-primary text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-md">
                  Pro
                </div>
                <div className="text-xl font-bold text-slate-900 mb-2 mt-2">Professional</div>
                <div className="text-3xl font-extrabold text-slate-900 mb-6">$29<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <ul className="space-y-3 mb-6 flex-1 text-sm text-slate-600">
                  <li className="flex gap-2"><Check size={16} className="text-primary-500 flex-shrink-0 mt-0.5"/> Unlimited reports</li>
                  <li className="flex gap-2"><Check size={16} className="text-primary-500 flex-shrink-0 mt-0.5"/> Premium templates</li>
                  <li className="flex gap-2"><Check size={16} className="text-primary-500 flex-shrink-0 mt-0.5"/> PPTX Export</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTeaserSection;
