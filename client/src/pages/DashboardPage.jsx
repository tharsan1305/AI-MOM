import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Clock, Download, Image as ImageIcon, FileText, ArrowRight, Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalInfographics: 0, totalDownloads: 0, recentProjects: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/user/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Generated', value: stats.totalInfographics, icon: <ImageIcon size={24} className="text-primary-500" />, bg: 'bg-primary-100 dark:bg-primary-900/30' },
    { title: 'Downloads', value: stats.totalDownloads, icon: <Download size={24} className="text-green-500" />, bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Saved Templates', value: 4, icon: <FileText size={24} className="text-accent-500" />, bg: 'bg-accent-100 dark:bg-accent-900/30' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
        </div>
        <Link to="/create" className="btn-primary flex items-center justify-center gap-2">
          <Plus size={20} /> New Infographic
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map((card, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="card flex items-center p-6"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-6 ${card.bg}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
              ) : (
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{card.value}</h3>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Projects</h2>
            <Link to="/history" className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="card overflow-hidden p-0">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading projects...</div>
            ) : stats.recentProjects.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <FileText size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No projects yet</h3>
                <p className="text-slate-500 mb-6">Create your first AI infographic from your meeting notes.</p>
                <Link to="/create" className="btn-primary inline-flex">Get Started</Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.recentProjects.map((project) => (
                  <div key={project._id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg flex items-center justify-center">
                        <ImageIcon size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{project.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><Clock size={14} /> {new Date(project.createdAt).toLocaleDateString()}</span>
                          <span className="capitalize px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs">{project.template}</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/infographic/${project._id}`} className="btn-secondary py-2 px-4 text-sm">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
          <div className="card p-6 space-y-4">
            <Link to="/create" className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-all dark:border-slate-700 dark:hover:border-primary-500 dark:hover:bg-primary-900/20 group">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Create New</h4>
                <p className="text-sm text-slate-500">Paste notes or upload file</p>
              </div>
            </Link>
            
            <Link to="/image-generator" className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-accent-500 hover:bg-accent-50 transition-all dark:border-slate-700 dark:hover:border-accent-500 dark:hover:bg-accent-900/20 group">
              <div className="w-10 h-10 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">AI Image Generator</h4>
                <p className="text-sm text-slate-500">Create images from text prompts</p>
              </div>
            </Link>
            
            <Link to="/profile" className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-accent-500 hover:bg-accent-50 transition-all dark:border-slate-700 dark:hover:border-accent-500 dark:hover:bg-accent-900/20 group">
              <div className="w-10 h-10 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <User size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Account Settings</h4>
                <p className="text-sm text-slate-500">Manage profile & billing</p>
              </div>
            </Link>
          </div>
          
          <div className="bg-gradient-primary rounded-2xl p-6 text-white shadow-glow-primary">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Zap size={20} /> Pro Tip</h3>
            <p className="text-sm text-primary-100 mb-4">
              For best results, make sure your meeting notes clearly mention action items and assignees. The AI will automatically structure them into a neat timeline.
            </p>
            <Link to="/create" className="text-sm font-bold flex items-center gap-1 hover:text-primary-200 transition-colors">
              Try it now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add missing icon import

export default DashboardPage;
