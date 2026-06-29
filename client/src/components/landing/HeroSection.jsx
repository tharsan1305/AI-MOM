import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Star, Users, Clock, FileCheck2 } from 'lucide-react';
import PremiumHeroBackground from '../PremiumHeroBackground';

const HeroSection = () => {
  return (
    <PremiumHeroBackground>
      <div className="flex flex-col items-center justify-center z-10 w-full max-w-7xl mx-auto px-4 py-20 lg:py-32 text-center relative mt-16 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-primary-100 text-primary-700 font-semibold text-sm mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
          Craft Meeting Minutes Into Visual Intelligence
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-snug break-words max-w-5xl mx-auto"
        >
          Transform Meeting Minutes Into 
          <span className="text-transparent bg-clip-text bg-gradient-primary block mt-2">
            Professional AI Infographics
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-2xl text-gray-600 mb-10 max-w-3xl leading-relaxed break-words"
        >
          Convert meetings, project discussions, and MOM documents into beautiful AI-generated visual reports. Extract action items, decisions, deadlines, and insights automatically.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
        >
          <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-lg">
            Start Free <ArrowRight size={20} />
          </button>
          <button className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-lg bg-white/80 backdrop-blur-md">
            <Play size={20} /> Watch Demo
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mx-auto border-t border-slate-200/60 pt-10"
        >
          {[
            { icon: FileCheck2, value: '10,000+', label: 'Reports Generated' },
            { icon: Clock, value: '95%', label: 'Time Saved' },
            { icon: Users, value: '500+', label: 'Teams Using Us' },
            { icon: Star, value: '4.9/5', label: 'User Rating' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600 mb-3">
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium break-words">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </PremiumHeroBackground>
  );
};

export default HeroSection;
