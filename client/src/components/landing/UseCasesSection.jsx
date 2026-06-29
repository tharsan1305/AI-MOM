import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Rocket, PenTool, Database } from 'lucide-react';

const cases = [
  { icon: Briefcase, title: 'Project Managers', desc: 'Keep stakeholders aligned with visual sprint summaries and automated timelines.' },
  { icon: Rocket, title: 'Agile Teams', desc: 'Turn messy retro boards into clean, actionable reports in seconds.' },
  { icon: PenTool, title: 'Agencies', desc: 'Deliver premium, branded meeting recaps to clients without extra design hours.' },
  { icon: Database, title: 'Product Ops', desc: 'Standardize documentation across departments with uniform templates.' },
];

const UseCasesSection = () => {
  return (
    <section className="py-24 bg-slate-50 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight break-words"
          >
            Built for Every Workflow
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto break-words"
          >
            MinuteCraft adapts to your role, helping you communicate faster and clearer.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
          {cases.map((c, index) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card flex flex-col h-full w-full break-words hover:border-primary-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white mb-6 shadow-md">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{c.title}</h3>
                <p className="text-slate-600 leading-relaxed flex-1">{c.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
