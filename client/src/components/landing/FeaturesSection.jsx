import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, FileText, Calendar, Network, FileDown, Presentation, Users, Sparkles } from 'lucide-react';

const features = [
  { icon: BrainCircuit, title: 'AI Extraction', desc: 'Automatically identify decisions, action items, risks, and deadlines.' },
  { icon: FileText, title: 'Smart Summaries', desc: 'Generate dashboards and executive summaries in seconds.' },
  { icon: Calendar, title: 'Timeline Generation', desc: 'Convert meeting dates and deadlines into visual timelines.' },
  { icon: Network, title: 'Mind Maps', desc: 'Visualize complex discussions with AI-generated mind maps.' },
  { icon: FileDown, title: 'PDF Export', desc: 'Download high-quality PDF reports ready for distribution.' },
  { icon: Presentation, title: 'PowerPoint Export', desc: 'Export directly to PPTX for your next big presentation.' },
  { icon: Users, title: 'Team Collaboration', desc: 'Share reports with managers and teams instantly.' },
  { icon: Sparkles, title: 'AI Insights', desc: 'Get strategic recommendations based on meeting history.' },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-slate-50 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight break-words"
          >
            Powerful Features for Modern Teams
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto break-words"
          >
            Everything you need to turn chaotic meeting notes into structured intelligence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card h-full flex flex-col group break-words w-full"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed flex-1">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
