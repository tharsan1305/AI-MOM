import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { step: '1', title: 'Upload Meeting Notes', desc: 'Paste your raw transcript or upload MOM documents in seconds.' },
  { step: '2', title: 'AI Processing', desc: 'MinuteCraft extracts decisions, action items, and timelines instantly.' },
  { step: '3', title: 'Select Template', desc: 'Choose from our library of premium infographic and presentation layouts.' },
  { step: '4', title: 'Export & Share', desc: 'Download high-quality PDFs or PPTX files ready for your team.' }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight break-words"
          >
            How MinuteCraft Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto break-words"
          >
            From raw notes to stunning visual reports in four simple steps.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-slate-200 z-0"></div>

          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center group w-full"
            >
              <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center text-xl font-bold text-slate-400 mb-6 group-hover:border-primary-500 group-hover:text-primary-600 group-hover:shadow-glow-primary transition-all duration-300">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 break-words">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed break-words">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
