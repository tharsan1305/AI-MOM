import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      if (res.data.success) {
        setIsSent(true);
        toast.success('Password reset email sent');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 card p-10"
      >
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Enter your email to receive a reset link
          </p>
        </div>

        {isSent ? (
          <div className="mt-8 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-6 rounded-xl border border-green-200 dark:border-green-800 text-center">
            <Mail size={48} className="mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-bold mb-2">Check your inbox</h3>
            <p className="text-sm">We've sent a password reset link to <strong>{email}</strong>.</p>
            <button 
              onClick={() => setIsSent(false)}
              className="mt-6 text-sm font-bold text-green-600 hover:text-green-700 underline"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="input-field pl-10"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full btn-primary flex justify-center items-center gap-2"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'} <Send size={18} />
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            <ArrowLeft size={16} className="mr-1" /> Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
