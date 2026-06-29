import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-24 bg-white relative z-10 w-full overflow-hidden">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

          <div className="relative z-10 px-6 py-16 md:py-20 lg:px-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="lg:max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight break-words">
                Ready to transform your meetings?
              </h2>
              <p className="text-lg md:text-xl text-slate-300 break-words">
                Join thousands of professionals saving hours every week. Try MinuteCraft free today.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap px-8 py-4 text-lg">
                Get Started Free <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
