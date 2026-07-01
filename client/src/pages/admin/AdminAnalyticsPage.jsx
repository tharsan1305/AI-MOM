import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2, Zap, DollarSign, Image as ImageIcon, Clock, Download, TrendingUp, AlertTriangle, Users, Cpu } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/api/admin/analytics/full');
      setData(res.data.data);
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

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="animate-spin text-primary-500" size={48} />
        <p className="text-slate-500 animate-pulse">Aggregating AI Data...</p>
      </div>
    );
  }

  const { kpis, trends, providers, models, topUsers, tokens, errors, activity } = data;
  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">AI Analytics Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400">Real-time business intelligence and token consumption metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAnalytics} className="btn-secondary">Refresh</button>
          <button onClick={handleExport} className="btn-primary flex items-center gap-2">
            <Download size={18} /> Export Full Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><Zap size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total AI Requests</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{kpis.totalRequests.allTime.toLocaleString()}</h3>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Today: {kpis.totalRequests.today}</span>
            <span>Week: {kpis.totalRequests.week}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center"><DollarSign size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total API Cost</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">${kpis.apiCost.allTime.toFixed(4)}</h3>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Today: ${kpis.apiCost.today.toFixed(4)}</span>
            <span>Week: ${kpis.apiCost.week.toFixed(4)}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center"><ImageIcon size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Images Generated</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{kpis.images.allTime.toLocaleString()}</h3>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Today: {kpis.images.today}</span>
            <span>Week: {kpis.images.week}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center"><Clock size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Avg Gen Time</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                {kpis.generationTime.avg > 1000 ? (kpis.generationTime.avg / 1000).toFixed(2) + 's' : kpis.generationTime.avg.toFixed(0) + 'ms'}
              </h3>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Fastest: {kpis.generationTime.fastest}ms</span>
            <span>Slowest: {kpis.generationTime.slowest}ms</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">API Cost Trend (30 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => '$'+val} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="cost" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">AI Requests Volume</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 & Provider Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Provider Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={providers} dataKey="requests" nameKey="provider" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {providers.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-2 overflow-x-auto">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Provider Performance</h3>
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 uppercase">
                <th className="pb-3">Provider</th>
                <th className="pb-3">Requests</th>
                <th className="pb-3">Success %</th>
                <th className="pb-3">Avg Time</th>
                <th className="pb-3">Avg Cost</th>
                <th className="pb-3">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {providers.map((p, i) => (
                <tr key={i} className="text-sm">
                  <td className="py-3 font-medium capitalize text-slate-800 dark:text-slate-200">{p.provider}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{p.requests.toLocaleString()}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{p.successRate}%</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{p.avgResponseTime?.toFixed(0)}ms</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">${p.avgCost?.toFixed(4)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.health === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {p.health}
                    </span>
                  </td>
                </tr>
              ))}
              {providers.length === 0 && <tr><td colSpan="6" className="py-4 text-center text-slate-500">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Minor Stats: Tokens, Users, Errors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-white font-bold"><Cpu size={20} /> Token Analytics</div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Total Tokens</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{tokens.totalTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Avg Tokens/Req</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{tokens.avgTokensPerRequest.toFixed(0)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Highest Token Request</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{tokens.highestTokenRequest.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-white font-bold"><Users size={20} /> User Activity</div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Daily Active (DAU)</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{activity.dau}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Weekly Active (WAU)</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{activity.wau}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Monthly Active (MAU)</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{activity.mau}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-white font-bold"><AlertTriangle size={20} /> Error Analytics</div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Failed Requests</span>
              <span className="font-medium text-red-500">{errors.failedRequests}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Overall Success Rate</span>
              <span className="font-medium text-emerald-500">{errors.successRate}%</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(errors.breakdown).map(([key, val]) => (
                <span key={key} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-300">
                  {key}: {val}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Users Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Top AI Users</h3>
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 uppercase">
              <th className="pb-3">User</th>
              <th className="pb-3">Plan</th>
              <th className="pb-3">AI Requests</th>
              <th className="pb-3">Downloads</th>
              <th className="pb-3">API Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {topUsers.map((u, i) => (
              <tr key={i} className="text-sm">
                <td className="py-3">
                  <div className="font-medium text-slate-800 dark:text-slate-200">{u.name}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.plan === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-400">{u.requests.toLocaleString()}</td>
                <td className="py-3 text-slate-600 dark:text-slate-400">{u.downloads.toLocaleString()}</td>
                <td className="py-3 font-medium text-slate-800 dark:text-slate-200">${u.cost?.toFixed(4)}</td>
              </tr>
            ))}
            {topUsers.length === 0 && <tr><td colSpan="5" className="py-4 text-center text-slate-500">No users found.</td></tr>}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminAnalyticsPage;
