import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Loader2, AlertTriangle, CreditCard, ExternalLink, Download, Receipt, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/payments', {
        params: { page, limit: 15, search, status: statusFilter, method: methodFilter }
      });
      if (res.data.success) {
        setPayments(res.data.payments);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch payment ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPayments();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, statusFilter, methodFilter]);

  return (
    <div className="space-y-6 max-w-7xl pb-20">
      
      {/* Stripe Missing Banner */}
      <div className="bg-orange-50 text-orange-900 border border-orange-200 p-5 rounded-xl flex gap-4 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-100 shadow-sm">
        <AlertTriangle size={24} className="shrink-0 text-orange-500 mt-0.5" />
        <div>
          <h3 className="font-bold text-lg mb-1">Live Payments Not Configured</h3>
          <p className="text-sm opacity-90 leading-relaxed">
            This Payment Ledger is built against a production-ready schema, but it currently lacks a live payment processor (like Stripe or PayPal) to automatically generate receipts and handle transactions. The UI below is fully functional for when live webhook ingestion begins.
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
              placeholder="Search user or transaction ID..."
              className="input-field pl-10 py-2 text-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          
          <div className="flex gap-3">
            <select 
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
              className="input-field py-2 text-sm w-auto min-w-[140px]"
            >
              <option value="">All Methods</option>
              <option value="stripe">Stripe (Card)</option>
              <option value="paypal">PayPal</option>
              <option value="manual">Manual / Comped</option>
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="input-field py-2 text-sm w-auto min-w-[140px]"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid (Approved)</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center"><Loader2 className="animate-spin mx-auto text-primary-500" size={24} /></td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">No payment records found.</td></tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 dark:text-white text-base">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: payment.currency || 'USD' }).format(payment.amount)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {payment.transactionId || payment._id.toString().slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center font-bold shrink-0">
                          {payment.userId?.avatar ? <img src={payment.userId.avatar} className="w-full h-full rounded-full" alt="" /> : payment.userId?.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{payment.userId?.name || 'Unknown User'}</span>
                          <span className="text-xs text-slate-500">{payment.userId?.email || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400">
                          <CreditCard size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{payment.method}</span>
                          {payment.cardLast4 && <span className="text-xs text-slate-500 font-mono">•••• {payment.cardLast4}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex flex-col">
                        <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                        <span className="text-xs">{new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize tracking-wide
                        ${payment.status === 'paid' || payment.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 
                          payment.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' : 
                          payment.status === 'refunded' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 
                          'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                        {payment.status === 'paid' || payment.status === 'approved' ? <CheckCircle size={14} /> : 
                         payment.status === 'pending' ? <Clock size={14} /> : 
                         payment.status === 'refunded' ? <RefreshCw size={14} /> : <XCircle size={14} />}
                        {payment.status === 'approved' ? 'Paid' : payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.receiptUrl ? (
                        <a 
                          href={payment.receiptUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center justify-center p-2 text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors dark:bg-primary-900/30 dark:hover:bg-primary-900/50"
                          title="View Receipt"
                        >
                          <Receipt size={18} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No receipt</span>
                      )}
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
              Showing {(page - 1) * 15 + 1} to {Math.min(page * 15, pagination.total)} of {pagination.total} entries
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

export default AdminPaymentsPage;
