import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Search, Home, FileText, Image as ImageIcon, Settings, 
  PanelLeftClose, PanelLeft, LogOut, Loader2, Sparkles, X, LayoutTemplate
} from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const Sidebar = ({ isMobile, closeSidebar, isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Collapse state for desktop
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/user/stats');
      if (res.data.success && res.data.stats.recentProjects) {
        setRecentReports(res.data.stats.recentProjects);
      }
    } catch (error) {
      console.error('Failed to fetch recents', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleCollapse = () => {
    if (isMobile) {
      closeSidebar();
    } else {
      setCollapsed(!collapsed);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'My Reports', path: '/history', icon: <FileText size={20} /> },
    { name: 'Templates', path: '/templates', icon: <LayoutTemplate size={20} /> },
    { name: 'Image Gen', path: '/image-generator', icon: <ImageIcon size={20} /> },
    { name: 'Settings', path: '/profile', icon: <Settings size={20} /> },
  ];

  const filteredRecents = recentReports.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className={`h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out
        ${collapsed && !isMobile ? 'w-20' : 'w-72'}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 shrink-0">
        {(!collapsed || isMobile) && (
          <div className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 truncate">
            MinuteCraft
          </div>
        )}
        <button 
          onClick={toggleCollapse}
          className={`p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors ${collapsed && !isMobile ? 'mx-auto' : ''}`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isMobile ? <X size={20} /> : (collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />)}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col px-3 py-4 gap-6 scrollbar-thin">
        
        {/* New Button */}
        <div>
          <Link 
            to="/create-report" 
            onClick={closeSidebar}
            className={`flex items-center justify-center gap-2 bg-gradient-primary text-white font-bold rounded-xl transition-transform hover:scale-[1.02] active:scale-95 shadow-glow-primary ${collapsed && !isMobile ? 'p-3 aspect-square' : 'py-3 px-4'}`}
          >
            <Plus size={20} />
            {(!collapsed || isMobile) && <span>New Infographic</span>}
          </Link>
        </div>

        {/* Main Nav */}
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeSidebar}
                title={link.name}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800/50'
                } ${collapsed && !isMobile ? 'justify-center' : ''}`}
              >
                <div className={`${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                  {link.icon}
                </div>
                {(!collapsed || isMobile) && <span className="truncate">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Search & Recents */}
        {(!collapsed || isMobile) && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-slate-100 transition-all placeholder-slate-400"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Recent Reports</h3>
              
              {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary-500" size={16} /></div>
              ) : filteredRecents.length === 0 ? (
                <p className="text-xs text-slate-400 px-1 text-center py-4">
                  {searchQuery ? 'No matching reports' : 'No recent reports'}
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredRecents.map((report) => (
                    <Link 
                      key={report._id} 
                      to={`/infographic/${report._id}`}
                      onClick={closeSidebar}
                      className={`block px-2 py-2 rounded-lg text-sm transition-colors ${
                        location.pathname === `/infographic/${report._id}`
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="truncate">{report.title}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Section Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
        {(!collapsed || isMobile) ? (
          <div className="flex items-center gap-3 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded-xl hover:border-primary-300 dark:hover:border-primary-900/50 transition-colors group cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.name}
              </div>
              <div className="text-xs text-slate-500 truncate capitalize flex items-center gap-1 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${user?.plan === 'pro' ? 'bg-primary-500' : 'bg-slate-400'}`}></span>
                {user?.plan} Plan
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title={`${user?.name} - ${user?.plan} Plan`}>
            <div onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold cursor-pointer shrink-0 shadow-md">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
          </div>
        )}

        {/* Upgrade / Logout Actions */}
        <div className={`mt-3 flex gap-2 ${collapsed && !isMobile ? 'flex-col items-center' : ''}`}>
          {user?.plan === 'free' && (
            <Link 
              to="/pricing"
              className={`flex-1 flex justify-center items-center gap-1.5 py-1.5 px-2 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 rounded-lg text-xs font-bold transition-colors ${collapsed && !isMobile ? 'w-full' : ''}`}
              title="Upgrade to Pro"
            >
              <Sparkles size={14} />
              {(!collapsed || isMobile) && 'Upgrade'}
            </Link>
          )}
          <button 
            onClick={handleLogout}
            className={`flex justify-center items-center gap-1.5 py-1.5 px-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors ${user?.plan === 'free' && (!collapsed || isMobile) ? 'flex-none' : 'flex-1'} ${collapsed && !isMobile ? 'w-full' : ''}`}
            title="Log Out"
          >
            <LogOut size={14} />
            {(!collapsed || isMobile) && (!user || user.plan !== 'free') && 'Log Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
