import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, UserPlus, FileText, Activity, Server, TrendingUp, Loader2 
} from 'lucide-react';
import { 
  Users, UserPlus, FileText, Activity, Server, TrendingUp, Loader2,
  DollarSign, Clock, Database, Image as ImageIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/analytics')
      ]);
      
      let data = {};
      if (statsRes.data.success) {
        data.kpis = statsRes.data.kpis;
        data.charts = statsRes.data.charts;
        data.widgets = statsRes.data.widgets;
      }
      setDashboard(data);
    } catch (error) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000); // 1 min auto refresh
    return () => clearInterval(interval);
  }, []);

  if (loading || !dashboard?.kpis || !dashboard?.charts) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;
  }

  const { kpis, charts, widgets } = dashboard;

  const statCards = [
    { title: 'Total Users', value: kpis.totalUsers, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { title: 'New Users (Today)', value: kpis.newUsersToday, icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { title: 'Active Users (Today)', value: kpis.activeUsersToday, icon: Activity, color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/30' },
    { title: 'Total Reports', value: kpis.totalReports, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Reports Today', value: kpis.reportsToday, icon: FileText, color: 'text-sky-500', bg: 'bg-sky-100 dark:bg-sky-900/30' },
    { title: 'Total Images', value: kpis.totalImages, icon: ImageIcon, color: 'text-fuchsia-500', bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30' },
    { title: 'Total API Requests', value: kpis.totalApiRequests, icon: Database, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { title: 'Total API Cost', value: `$${kpis.totalApiCost}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Avg Response Time', value: `${kpis.avgResponseTime}ms`, icon: Clock, color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  ];

  return (
    <div className="space-y-6 max-w-7xl pb-20">
      
      {/* AI Provider Health Banner */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-4 rounded-xl shadow-sm border bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <Server size={24} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-bold flex items-center gap-2">
              Active Provider: <span className="capitalize">{kpis.activeProvider}</span>
            </h3>
            <div className="text-sm opacity-80 mt-0.5 flex items-center gap-3">
              <span>Most Used Model: <span className="font-bold tracking-wide">{kpis.mostUsedModel}</span></span>
              <span>•</span>
              <span>Requests Today: <strong>{kpis.apiRequestsToday}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 30-Day Daily Report Volume Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-500" /> Report Volume
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.reportTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c5af0" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7c5af0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} minTickGap={30} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
              />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#7c5af0" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorReports)" 
                  activeDot={{ r: 6, fill: '#7c5af0', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 30-Day API Usage Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Database size={20} className="text-orange-500" /> API Requests
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.apiTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;
