import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Wand2, Download, CheckCircle2, ChevronRight, Zap, Shield, Image as ImageIcon } from 'lucide-react';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-semibold mb-8 border border-primary-100 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
              MeetGraph AI 2.0 is Live
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
              Transform Meeting Notes into <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-primary">Professional Infographics</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              Convert your MOM, project discussions, and meeting notes into beautiful, actionable visual reports using AI. Stop reading boring text documents.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center gap-2">
                Get Started Free <ChevronRight size={20} />
              </Link>
              <button className="btn-secondary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center gap-2">
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose MeetGraph AI?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need to visualize your meetings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center p-8">
              <div className="w-16 h-16 mx-auto bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6 dark:bg-primary-900/50 dark:text-primary-400">
                <Wand2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">AI-Powered Extraction</h3>
              <p className="text-slate-600 dark:text-slate-400">Our advanced AI automatically extracts action items, key outcomes, and deadlines from messy meeting notes.</p>
            </div>
            <div className="card text-center p-8">
              <div className="w-16 h-16 mx-auto bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-6 dark:bg-accent-900/50 dark:text-accent-400">
                <ImageIcon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Beautiful Templates</h3>
              <p className="text-slate-600 dark:text-slate-400">Choose from Corporate, Timeline, Mind Map, and more. Instantly generate Canva-style professional graphics.</p>
            </div>
            <div className="card text-center p-8">
              <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 dark:bg-green-900/50 dark:text-green-400">
                <Download size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Multiple Exports</h3>
              <p className="text-slate-600 dark:text-slate-400">Download your infographics as PNG, JPG, PDF, or even PowerPoint presentations in just one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Three simple steps to visual perfection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 dark:from-primary-800 dark:via-primary-600 dark:to-primary-800"></div>

            {[
              { icon: <FileText size={24} />, title: '1. Paste Notes', desc: 'Upload your MOM PDF, Word doc, or just paste raw meeting text.' },
              { icon: <Wand2 size={24} />, title: '2. AI Magic', desc: 'Our AI structures your notes and selects the best infographic layout.' },
              { icon: <Download size={24} />, title: '3. Download', desc: 'Export your professional infographic and share it with the team.' }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-800 rounded-full border-4 border-primary-100 dark:border-primary-900 shadow-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Simple Pricing</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Start free, upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="card p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-2 dark:text-white">Free</h3>
              <p className="text-slate-500 mb-6">Perfect for trying out</p>
              <div className="text-4xl font-bold mb-8 dark:text-white">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                {['5 Infographics / month', 'Standard Templates', 'PNG Export', 'Basic AI Extraction'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <CheckCircle2 size={20} className="text-green-500" /> {feature}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-secondary w-full text-center">Get Started</Link>
            </div>

            {/* Pro Tier */}
            <div className="card p-8 flex flex-col relative border-2 border-primary-500 transform md:-translate-y-4 shadow-glow-primary">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</div>
              <h3 className="text-2xl font-bold mb-2 dark:text-white">Pro</h3>
              <p className="text-slate-500 mb-6">For professionals & managers</p>
              <div className="text-4xl font-bold mb-8 dark:text-white">$19<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                {['Unlimited Infographics', 'Premium Canva Templates', 'PDF & PPT Export', 'Advanced AI Insights', 'No Watermark'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <CheckCircle2 size={20} className="text-primary-500" /> {feature}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary w-full text-center">Upgrade to Pro</Link>
            </div>

            {/* Enterprise Tier */}
            <div className="card p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-2 dark:text-white">Enterprise</h3>
              <p className="text-slate-500 mb-6">For teams and companies</p>
              <div className="text-4xl font-bold mb-8 dark:text-white">Custom</div>
              <ul className="space-y-4 mb-8 flex-grow">
                {['Everything in Pro', 'Custom Brand Colors/Logos', 'Team Collaboration', 'API Access', 'Dedicated Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <CheckCircle2 size={20} className="text-slate-800 dark:text-slate-200" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary w-full text-center">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
