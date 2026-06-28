import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2, TrendingUp, Zap, BarChart2, DollarSign, Image as ImageIcon, CheckCircle, XCircle, Download } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminAnalyticsPage = () => {
  const [data, setData] = useState({
    overview: null,
    costTrends: null,
    providers: null,
    topics: null,
    tokens: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, costTrendsRes, providersRes, topicsRes, tokensRes] = await Promise.all([
        axios.get('/api/admin/analytics/overview'),
        axios.get('/api/admin/analytics/cost-trends'),
        axios.get('/api/admin/analytics/providers'),
        axios.get('/api/admin/analytics/topics'),
        axios.get('/api/admin/analytics/tokens'),
      ]);

      setData({
        overview: overviewRes.data.data,
        costTrends: costTrendsRes.data.data,
        providers: providersRes.data.data,
        topics: topicsRes.data.data,
        tokens: tokensRes.data.data,
      });
    } catch (error) {
      console.error('Failed to load analytics data', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // 30s live update
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    window.location.href = 'http://localhost:5000/api/admin/reports/analytics-excel';
  };

  if (loading || !data.overview) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;
  }

  const { overview, costTrends, providers, topics, tokens } = data;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">AI Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400">Comprehensive business intelligence and AI usage metrics.</p>
        </div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <Download size={18} /> Export Excel
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total AI Requests</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{overview.totalRequests.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total API Cost</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">${overview.totalCost}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ImageIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Images Generated</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{overview.totalImages.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <BarChart2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Avg Generation Time</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{overview.avgGenTimeMs}ms</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cost Trend Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">API Cost Trends (7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => '$'+val} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value) => ['$' + value.toFixed(2), 'Cost']}
                />
                <Area type="monotone" dataKey="cost" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Provider Performance */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Provider Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">Provider</th>
                  <th className="pb-3 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">Requests</th>
                  <th className="pb-3 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">Avg Time</th>
                  <th className="pb-3 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {providers.map((p, idx) => (
                  <tr key={idx}>
                    <td className="py-4 text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">{p.provider}</td>
                    <td className="py-4 text-sm text-slate-500 dark:text-slate-400">{p.totalRequests}</td>
                    <td className="py-4 text-sm text-slate-500 dark:text-slate-400">{p.avgGenTimeMs}ms</td>
                    <td className="py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">${p.totalCost}</td>
                  </tr>
                ))}
                {providers.length === 0 && (
                  <tr><td colSpan="4" className="py-6 text-center text-slate-500">No provider data yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminAnalyticsPage;
