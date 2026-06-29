import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  { 
    name: 'Sarah Jenkins', 
    role: 'Product Manager', 
    text: 'MinuteCraft completely changed how we handle post-meeting documentation. It saves me hours every week.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  { 
    name: 'David Chen', 
    role: 'Engineering Lead', 
    text: 'The automated timelines and action item extraction are flawless. Highly recommended for agile teams.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
  },
  { 
    name: 'Emily Rodriguez', 
    role: 'Agency Director', 
    text: 'Our clients love the professional PDF exports. It makes us look incredible without any extra effort.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-white relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight break-words"
          >
            Loved by Teams Worldwide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto break-words"
          >
            See what professionals are saying about their MinuteCraft experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card flex flex-col h-full relative group"
            >
              <div className="text-primary-200 text-6xl font-serif absolute top-4 right-6 group-hover:text-primary-300 transition-colors pointer-events-none select-none">
                "
              </div>
              <p className="text-slate-700 mb-8 relative z-10 text-lg leading-relaxed break-words flex-1 pt-4">
                {test.text}
              </p>
              <div className="flex items-center gap-4 mt-auto border-t border-slate-100 pt-6">
                <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full bg-slate-100" />
                <div>
                  <div className="font-bold text-slate-900">{test.name}</div>
                  <div className="text-sm text-slate-500 font-medium">{test.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
