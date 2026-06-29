import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { handleRazorpayCheckout } from '../utils/razorpay';

const PricingPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleFreeStart = () => {
    if (!user) {
      navigate('/register');
    }
  };

  const handleProUpgrade = async () => {
    if (!user) {
      navigate('/register?plan=pro');
      return;
    }
    
    if (user.plan === 'pro') return;

    await handleRazorpayCheckout('pro', 29, (newPlan) => {
      setUser({ ...user, plan: newPlan });
    });
  };

  return (
    <div className="py-24 bg-gray-50 relative z-10 w-full min-h-screen flex flex-col items-center pt-32">
      <div className="max-w-7xl w-full mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Choose the plan that fits your team's workflow. Upgrade or downgrade at any time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto items-stretch justify-items-center">
          {/* Free Tier */}
          <div className="w-full max-w-sm h-full flex flex-col justify-between overflow-visible bg-white p-8 rounded-3xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="flex-grow break-words">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-extrabold text-gray-900 mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['5 reports/month', 'Basic AI extraction', 'Standard templates', 'PDF Export'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600 gap-3 break-words">
                    <Check size={20} className="text-primary-600 flex-shrink-0" /> 
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={handleFreeStart} 
              disabled={user?.plan === 'free'}
              className={`w-full ${user?.plan === 'free' ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-secondary'}`}
            >
              {user?.plan === 'free' ? 'Current Plan' : 'Get Started'}
            </button>
          </div>

          {/* Pro Tier */}
          <div className="w-full max-w-sm h-full flex flex-col justify-between overflow-visible bg-white p-8 rounded-3xl border-2 border-primary-400 shadow-xl shadow-primary-500/10 transform lg:scale-105 transition-all duration-300 relative z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap shadow-md">
              Most Popular
            </div>
            <div className="flex-grow mt-2 break-words">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-extrabold text-gray-900 mb-6">$29<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Unlimited reports', 'Advanced AI insights', 'Premium templates', 'PPTX & PDF Export', 'Team sharing'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600 gap-3 break-words">
                    <Check size={20} className="text-primary-600 flex-shrink-0" /> 
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={handleProUpgrade}
              disabled={user?.plan === 'pro'}
              className={`w-full flex items-center justify-center gap-2 ${user?.plan === 'pro' ? 'bg-slate-100 text-slate-500 cursor-not-allowed font-bold py-3 px-6 rounded-xl border border-slate-200' : 'btn-primary'}`}
            >
              {user?.plan === 'pro' ? 'Current Plan' : <><Sparkles size={18} /> Upgrade to Pro</>}
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="w-full max-w-sm h-full flex flex-col justify-between overflow-visible bg-white p-8 rounded-3xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="flex-grow break-words">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-extrabold text-gray-900 mb-6">Custom</div>
              <ul className="space-y-4 mb-8">
                {['Custom AI models', 'SSO & SAML', 'Dedicated support', 'Custom templates', 'API access'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600 gap-3 break-words">
                    <Check size={20} className="text-primary-600 flex-shrink-0" /> 
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a href="mailto:sales@minutecraft.ai" className="btn-secondary w-full block text-center">
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
