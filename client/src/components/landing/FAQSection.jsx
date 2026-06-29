import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How accurate is the AI extraction?',
    a: 'Our AI uses advanced NLP models specifically tuned for professional discourse, achieving over 95% accuracy in identifying action items, decisions, and deadlines from standard meeting transcripts.'
  },
  {
    q: 'Can I use MinuteCraft with Zoom or Microsoft Teams?',
    a: 'Yes! You can export your meeting transcripts or raw notes from any platform and paste them directly into MinuteCraft. We are also working on direct integrations.'
  },
  {
    q: 'Are my meeting notes secure?',
    a: 'Absolutely. We use enterprise-grade encryption for all data in transit and at rest. We never use your private meeting data to train our foundational models.'
  },
  {
    q: 'Can I customize the export templates?',
    a: 'Yes, users on the Pro and Enterprise plans can customize colors, fonts, and logos to match their brand kit before exporting to PDF or PPTX.'
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-white relative z-10 w-full overflow-hidden">
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight break-words"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 break-words"
          >
            Everything you need to know about the product and billing.
          </motion.p>
        </div>

        <div className="space-y-4 w-full">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white w-full"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-slate-900 text-lg break-words pr-4">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed break-words">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
