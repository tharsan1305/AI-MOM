import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Menu, X, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 21H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-primary">
                MeetGraph<span className="text-slate-900 dark:text-white"> AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {!token && (
              <>
                <Link to="/#features" className="text-slate-600 hover:text-primary-600 font-medium transition-colors dark:text-slate-300 dark:hover:text-primary-400">Features</Link>
                <Link to="/#how-it-works" className="text-slate-600 hover:text-primary-600 font-medium transition-colors dark:text-slate-300 dark:hover:text-primary-400">How it Works</Link>
                <Link to="/#pricing" className="text-slate-600 hover:text-primary-600 font-medium transition-colors dark:text-slate-300 dark:hover:text-primary-400">Pricing</Link>
              </>
            )}
            
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {token ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium dark:text-slate-300">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/image-generator" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium dark:text-slate-300">
                    <Sparkles size={20} />
                    <span>AI Images</span>
                  </Link>
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-primary-500 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="font-semibold text-slate-600 hover:text-primary-600 transition-colors dark:text-slate-300">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 dark:text-slate-300"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 shadow-lg absolute w-full left-0">
          <div className="flex flex-col space-y-4">
            {!token && (
              <>
                <Link to="/#features" className="text-lg font-medium p-2" onClick={() => setIsMenuOpen(false)}>Features</Link>
                <Link to="/#how-it-works" className="text-lg font-medium p-2" onClick={() => setIsMenuOpen(false)}>How it Works</Link>
                <Link to="/#pricing" className="text-lg font-medium p-2" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-4 flex flex-col gap-3">
                  <Link to="/login" className="btn-secondary text-center" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </div>
              </>
            )}
            
            {token && (
              <>
                <div className="flex items-center gap-3 p-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-primary-500 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <p className="font-bold">{user?.name}</p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <Link to="/dashboard" className="flex items-center gap-3 p-2 text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
                <Link to="/image-generator" className="flex items-center gap-3 p-2 text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                  <Sparkles size={20} /> AI Images
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 p-2 text-lg font-medium text-red-500 w-full text-left">
                  <LogOut size={20} /> Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
