import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '10,000+', label: 'Reports Generated' },
  { value: '95%', label: 'Time Saved' },
  { value: '500+', label: 'Teams' },
  { value: '4.9', label: 'Customer Rating' },
];

const StatisticsSection = () => {
  return (
    <div className="py-24 bg-white relative z-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
