import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <>
      <div className="py-24 bg-gray-900 relative z-10 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Transform Your Meetings?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-10"
          >
            Turn your meeting minutes into professional visual reports in seconds. Join thousands of professionals using MinuteCraft.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
              Start Free
            </button>
            <button className="px-8 py-4 bg-gray-800 text-white rounded-xl font-bold border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-colors">
              Book Demo
            </button>
          </motion.div>
        </div>
      </div>

      <footer className="bg-gray-950 py-12 relative z-10 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-950 rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">MinuteCraft</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2026 MinuteCraft. All rights reserved. <br className="md:hidden" />
            <span className="hidden md:inline"> | </span> Made with ❤️ by PRODIGIT ACADEMY
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
