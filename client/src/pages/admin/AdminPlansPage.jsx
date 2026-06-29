import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Loader2, AlertTriangle, CreditCard, RefreshCw, XCircle, CheckCircle } from 'lucide-react';

const AdminPlansPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/subscriptions', {
        params: { page, limit: 10, search, status: statusFilter, plan: planFilter }
      });
      if (res.data.success) {
        setSubscriptions(res.data.subscriptions);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSubscriptions();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, statusFilter, planFilter]);

  return (
    <div className="space-y-6 max-w-7xl pb-20">
      
      {/* Stripe Missing Banner */}
      <div className="bg-orange-50 text-orange-900 border border-orange-200 p-5 rounded-xl flex gap-4 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-100 shadow-sm">
        <AlertTriangle size={24} className="shrink-0 text-orange-500" />
        <div>
          <h3 className="font-bold text-lg mb-1">Awaiting Payment Processor Integration</h3>
          <p className="text-sm opacity-90 leading-relaxed">
            Real billing needs a provider like <strong>Stripe</strong> integrated before this is production-ready. The database schema (<code>stripeCustomerId</code>, <code>stripeSubscriptionId</code>, etc.) is fully built and ready to map to Stripe webhooks. Any records below currently represent manual or placeholder assignments.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Header & Filters */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="relative max-w-sm w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user name or email..."
              className="input-field pl-10 py-2 text-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          
          <div className="flex gap-3">
            <select 
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
              className="input-field py-2 text-sm w-auto min-w-[120px]"
            >
              <option value="">All Plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="input-field py-2 text-sm w-auto min-w-[120px]"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="past_due">Past Due</option>
              <option value="canceled">Canceled</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Subscriber</th>
                <th className="px-6 py-4">Plan & Cycle</th>
                <th className="px-6 py-4">Payment Processor</th>
                <th className="px-6 py-4">Renewal Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center"><Loader2 className="animate-spin mx-auto text-primary-500" size={24} /></td></tr>
              ) : subscriptions.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No subscription records found.</td></tr>
              ) : (
                subscriptions.map(sub => (
                  <tr key={sub._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center font-bold shrink-0">
                          {sub.userId?.avatar ? <img src={sub.userId.avatar} className="w-full h-full rounded-full" alt="" /> : sub.userId?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{sub.userId?.name || 'Unknown User'}</p>
                          <p className="text-xs text-slate-500">{sub.userId?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize tracking-wide
                          ${sub.planTier === 'pro' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30' : 
                            sub.planTier === 'enterprise' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 
                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                          {sub.planTier}
                        </span>
                        <span className="text-xs text-slate-500 capitalize">{sub.billingCycle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <CreditCard size={14} />
                          {sub.stripeCustomerId ? <span className="font-mono">{sub.stripeCustomerId}</span> : <span>Manual / None</span>}
                        </div>
                        {sub.stripeSubscriptionId && (
                          <div className="text-[10px] text-slate-400 font-mono pl-5">
                            {sub.stripeSubscriptionId}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.currentPeriodEnd ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(sub.currentPeriodEnd).toLocaleDateString()}</span>
                          {sub.cancelAtPeriodEnd && <span className="text-[10px] text-red-500 font-bold uppercase">Cancels at end</span>}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Lifetime / N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize tracking-wide
                        ${sub.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 
                          sub.status === 'past_due' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' : 
                          'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                        {sub.status === 'active' ? <CheckCircle size={14} /> : sub.status === 'past_due' ? <RefreshCw size={14} /> : <XCircle size={14} />}
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total} entries
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminPlansPage;
