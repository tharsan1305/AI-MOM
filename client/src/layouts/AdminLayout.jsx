import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Image as ImageIcon, FileText,
  CreditCard, Settings, Bell, LogOut, Menu, X, Moon, Sun, Shield, BarChart2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const AdminLayout = () => {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!loading) {
      if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        navigate('/admin/login');
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axios.get('/api/admin/notifications?limit=1');
        if (res.data.success) {
          setUnreadCount(res.data.unread);
        }
      } catch (err) {
        // Silent error
      }
    };
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      fetchUnread();
    }
  }, [user]);

  if (loading || !user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">Loading admin...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'AI Analytics', path: '/admin/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Generated Images', path: '/admin/images', icon: <ImageIcon size={20} /> },
    { name: 'Prompt History', path: '/admin/prompts', icon: <FileText size={20} /> },
    { name: 'Subscriptions', path: '/admin/plans', icon: <FileText size={20} /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    { name: 'API Providers', path: '/admin/api-providers', icon: <Settings size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: <Shield size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
          <Link to="/admin" className="flex items-center gap-2 font-bold text-lg text-primary-600 dark:text-primary-400">
            <Shield size={24} />
            MinuteCraft Admin
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold capitalize">
              {location.pathname.split('/')[2] || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link to="/admin/notifications" className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default AdminLayout;
