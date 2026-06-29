import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
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
            Transform Meeting Minutes <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-orange-400">
              Into Actionable Insights
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 mb-12 leading-relaxed font-medium break-words"
          >
            Convert your meeting discussions into beautiful visual reports, AI summaries, timelines, and executive dashboards.
          </motion.p>

          <div className="relative pl-2 space-y-4">
            <FloatingCard title="AI Summary" delay={0} />
            <FloatingCard title="Action Items" delay={1.5} />
            <FloatingCard title="Timeline Report" delay={3} />
          </div>
        </div>

        {/* Features bottom text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 text-gray-500 text-sm font-semibold tracking-wide flex flex-wrap gap-x-3 gap-y-2"
        >
          <span>✓ AI-powered extraction</span>
          <span className="text-gray-700">•</span>
          <span>✓ Professional infographics</span>
          <span className="text-gray-700">•</span>
          <span>✓ Instant exports</span>
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
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-gray-400 text-sm font-medium">Please enter your details to sign in.</p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-colors rounded-xl overflow-hidden h-[44px]">
               <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log('Login Failed')}
                  theme="filled_black"
                  size="large"
                  text="continue_with"
                  width="100%"
               />
            </div>
            
            <button type="button" className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl transition-all text-sm font-semibold tracking-wide">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Continue with GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8 w-full">
            <div className="h-px bg-white/10 flex-grow"></div>
            <span className="text-gray-500 text-xs font-bold tracking-[0.2em]">OR</span>
            <div className="h-px bg-white/10 flex-grow"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
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
              <div className="flex justify-between items-center mb-1.5 w-full">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
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
            </div>

            <div className="flex items-center pt-1 w-full">
              <input
                id="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-black/40 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900 cursor-pointer accent-purple-500"
              />
              <label htmlFor="remember_me" className="ml-2 text-sm font-medium text-gray-400 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 flex justify-center items-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-400 w-full">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-white hover:text-purple-400 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
