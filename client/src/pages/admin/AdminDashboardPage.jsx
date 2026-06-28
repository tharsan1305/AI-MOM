import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Activity, Image as ImageIcon, DollarSign, 
  TrendingUp, CreditCard, Loader2, BarChart2 
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [statsRes, analyticsRes, systemRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/analytics'),
        axios.get('/api/admin/system')
      ]);
      
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (analyticsRes.data.success) setCharts(analyticsRes.data.charts);
      if (systemRes.data.success) setSystem(systemRes.data.system);
    } catch (error) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000); // 30s auto refresh
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats || !charts || !system) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Premium Users', value: stats.premiumUsers, icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'New Today', value: stats.newUsersToday, icon: TrendingUp, color: 'text-accent-500', bg: 'bg-accent-100 dark:bg-accent-900/30' },
    { title: 'Total Images', value: stats.totalImages, icon: ImageIcon, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/30' },
    { title: 'Prompts Today', value: stats.promptsUsedToday, icon: BarChart2, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { title: "Today's Revenue", value: `$${stats.revenue.today}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { title: 'Monthly Revenue', value: `$${stats.revenue.monthly}`, icon: DollarSign, color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/30' },
  ];

  return (
    <div className="space-y-6">
      
      {/* System Status Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${system.database.status === 'connected' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-sm font-medium">DB: {system.database.status}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Activity size={16} /> RAM: {system.server.memory.usagePercent}%
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Users size={16} /> Online Sessions: {system.network.activeSessions}
          </div>
        </div>
        <div className="text-xs text-slate-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 ${card.bg} ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-4">User Growth (Last 6 Months)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c5af0" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7c5af0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="users" stroke="#7c5af0" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prompt Usage */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Prompt Usage (Last 6 Months)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.promptUsage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="prompts" fill="#fb923c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Revenue */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Revenue (Last 6 Months)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `$${value}`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
