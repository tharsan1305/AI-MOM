import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Loader2, Calendar, FileJson, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [uniqueActions, setUniqueActions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Expanded row for JSON Diff
  const [expandedId, setExpandedId] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/audit-logs', {
        params: { page, limit: 15, search, actionType: actionFilter, startDate, endDate }
      });
      if (res.data.success) {
        setLogs(res.data.logs);
        setUniqueActions(res.data.uniqueActions);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLogs();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, actionFilter, startDate, endDate]);

  const toggleExpand = (id) => {
    if (expandedId === id) setExpandedId(null);
    else setExpandedId(id);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden pb-20">
      
      {/* Header & Filters */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="relative max-w-sm w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search admin, action, or target ID..."
            className="input-field pl-10 py-2 text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="input-field py-2 text-sm w-auto min-w-[150px]"
          >
            <option value="">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            <input 
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="input-field py-2 text-sm"
            />
            <span className="text-slate-400">to</span>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="input-field py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Admin</th>
              <th className="px-6 py-4">Action Taken</th>
              <th className="px-6 py-4">Target & Reason</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center"><Loader2 className="animate-spin mx-auto text-primary-500" size={24} /></td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No audit logs found.</td></tr>
            ) : (
              logs.map(log => (
                <React.Fragment key={log._id}>
                  <tr className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${expandedId === log._id ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{new Date(log.createdAt).toLocaleDateString()}</span>
                        <span className="text-xs">{new Date(log.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShieldAlert size={16} className="text-indigo-500" />
                        <span className="font-medium text-slate-900 dark:text-white">{log.adminName || 'Unknown Admin'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 tracking-wide uppercase">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 max-w-[300px]">
                        <span className="text-xs font-mono text-slate-500 truncate" title={`${log.targetType}: ${log.targetId}`}>
                          <strong>{log.targetType}:</strong> {log.targetId}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate" title={log.reason}>
                          "{log.reason}"
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleExpand(log._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors dark:bg-primary-900/30 dark:hover:bg-primary-900/50"
                      >
                        {expandedId === log._id ? (
                          <><ChevronUp size={16} /> Hide Diff</>
                        ) : (
                          <><FileJson size={16} /> View Diff</>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row: JSON Diff */}
                  {expandedId === log._id && (
                    <tr>
                      <td colSpan="5" className="px-6 py-6 bg-slate-50 dark:bg-slate-900/30 border-b-4 border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          
                          {/* Before State */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Before Action</h4>
                            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto shadow-inner">
                              {log.beforeValue ? JSON.stringify(log.beforeValue, null, 2) : '// No previous state'}
                            </div>
                          </div>

                          {/* After State */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">After Action</h4>
                            <div className="bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-4 text-xs font-mono text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto shadow-inner">
                              {log.afterValue ? JSON.stringify(log.afterValue, null, 2) : '// No new state'}
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
  );
};

export default AdminAuditLogsPage;
