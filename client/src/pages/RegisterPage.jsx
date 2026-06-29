import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingCard = ({ title, delay }) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ repeat: Infinity, duration: 5, delay, ease: "easeInOut" }}
    className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl text-white shadow-xl mb-4 w-full max-w-[260px] shadow-purple-900/20"
  >
    <div className="bg-gradient-to-br from-purple-500 to-orange-500 rounded-full p-1.5 shadow-inner flex-shrink-0">
      <Check size={16} className="text-white" />
    </div>
    <span className="font-semibold tracking-wide text-sm break-words">{title}</span>
  </motion.div>
);

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await register(name, email, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const success = await googleLogin(credentialResponse.credential);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-[#050523] font-sans selection:bg-purple-500/30 pb-16 lg:pb-0">
      
      {/* Promo Panel (Left Side - Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 border-r border-white/5 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/15 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] bg-orange-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
        
        {/* Particles Texture */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIiAvPgo8L3N2Zz4=')] mix-blend-overlay"></div>

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <div className="w-5 h-5 bg-[#050523] rounded-sm"></div>
          </div>
          <Link to="/" className="text-2xl font-extrabold text-white tracking-tight hover:opacity-80 transition-opacity">MinuteCraft</Link>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-grow flex flex-col justify-center max-w-md w-full mx-auto py-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-[1.2] tracking-tight break-words"
          >
            Create Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-orange-400">
              Free Account
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 mb-12 leading-relaxed font-medium break-words"
          >
            Join thousands of professionals transforming their meeting minutes into beautiful visual reports.
          </motion.p>

          <div className="relative pl-2 space-y-4">
            <FloatingCard title="Unlimited Extractions" delay={0} />
            <FloatingCard title="Premium Templates" delay={1.5} />
            <FloatingCard title="One-Click Export" delay={3} />
          </div>
        </div>

        {/* Features bottom text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 text-gray-500 text-sm font-semibold tracking-wide flex flex-wrap gap-x-3 gap-y-2"
        >
          <span>✓ No credit card required</span>
          <span className="text-gray-700">•</span>
          <span>✓ 14-day free trial on Pro</span>
        </motion.div>
      </div>

      {/* Form Panel (Right Side on Desktop, Full Width on Mobile) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#020212]/50 backdrop-blur-2xl">
        <div 
          className="w-full max-w-[420px] bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 opacity-100"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6 lg:hidden">
               <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center shadow-lg">
                 <div className="w-5 h-5 bg-[#050523] rounded-sm"></div>
               </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create an account</h2>
            <p className="text-gray-400 text-sm font-medium">Start transforming your meeting notes today.</p>
          </div>

          <div className="space-y-3 mb-8 w-full">
            <div className="flex justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-colors rounded-xl overflow-hidden h-[44px]">
               <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log('Login Failed')}
                  theme="filled_black"
                  size="large"
                  text="signup_with"
                  width="100%"
               />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8 w-full">
            <div className="h-px bg-white/10 flex-grow"></div>
            <span className="text-gray-500 text-xs font-bold tracking-[0.2em] whitespace-nowrap">OR REGISTER WITH EMAIL</span>
            <div className="h-px bg-white/10 flex-grow"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600 transition-all outline-none text-sm font-medium"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600 transition-all outline-none text-sm font-medium"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength="6"
                  className="w-full pl-10 pr-10 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600 transition-all outline-none text-sm font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-500">Must be at least 6 characters long</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 flex justify-center items-center gap-2 mt-6"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-400 w-full">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-white hover:text-purple-400 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
