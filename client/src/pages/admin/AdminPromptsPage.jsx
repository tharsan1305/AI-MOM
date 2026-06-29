import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Loader2, CheckCircle, XCircle, Code, ChevronDown, ChevronUp, FileText } from 'lucide-react';

const AdminPromptsPage = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');

  // Expanded row state
  const [expandedId, setExpandedId] = useState(null);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/prompts', { 
        params: { page, limit: 15, search, status: statusFilter, provider: providerFilter } 
      });
      setPrompts(res.data.prompts);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch prompt history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchPrompts(), 400);
    return () => clearTimeout(timer);
  }, [page, search, statusFilter, providerFilter]);

  const toggleExpand = (id) => {
    if (expandedId === id) setExpandedId(null);
    else setExpandedId(id);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header & Filters */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="relative max-w-md w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search raw notes..."
            className="input-field pl-10 py-2 text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        
        <div className="flex gap-3">
          <select 
            value={providerFilter}
            onChange={(e) => { setProviderFilter(e.target.value); setPage(1); }}
            className="input-field py-2 text-sm w-auto min-w-[140px]"
          >
            <option value="">All Providers</option>
            <option value="gemini">Gemini</option>
            <option value="groq">Groq</option>
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field py-2 text-sm w-auto min-w-[140px]"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">AI Engine</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center"><Loader2 className="animate-spin mx-auto text-primary-500" size={24} /></td></tr>
            ) : prompts.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No prompt logs found.</td></tr>
            ) : (
              prompts.map(prompt => (
                <React.Fragment key={prompt._id}>
                  <tr className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${expandedId === prompt._id ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white">{new Date(prompt.createdAt).toLocaleDateString()}</span>
                        <span className="text-xs text-slate-500">{new Date(prompt.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{prompt.userId?.name || 'Unknown / Guest'}</span>
                        <span className="text-xs text-slate-500">{prompt.userId?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 dark:bg-blue-900/30 w-max">
                          {prompt.aiProvider}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono w-max">
                          {prompt.aiModel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {prompt.status === 'success' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize tracking-wide bg-green-100 text-green-700 dark:bg-green-900/30">
                          <CheckCircle size={14} /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize tracking-wide bg-red-100 text-red-700 dark:bg-red-900/30">
                          <XCircle size={14} /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleExpand(prompt._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                      >
                        {expandedId === prompt._id ? (
                          <><ChevronUp size={16} /> Hide details</>
                        ) : (
                          <><Code size={16} /> View payload</>
                        )}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Row */}
                  {expandedId === prompt._id && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-b-4 border-slate-200 dark:border-slate-700">
                        
                        {prompt.status === 'failed' && (
                          <div className="mb-4 p-4 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-900/50 font-mono text-sm">
                            <strong className="block mb-1 font-sans">Error Message:</strong>
                            {prompt.errorMessage || 'Unknown error occurred'}
                          </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          
                          {/* Raw Notes Column */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              <FileText size={16} /> Raw Input Notes
                            </h4>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap max-h-96 overflow-y-auto">
                              {prompt.rawNotes}
                            </div>
                          </div>

                          {/* JSON Output Column */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              <Code size={16} /> Structured JSON Output
                            </h4>
                            <div className="bg-slate-900 text-emerald-400 rounded-xl p-4 text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                              {prompt.jsonOutput ? JSON.stringify(prompt.jsonOutput, null, 2) : '// No JSON output generated'}
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

export default AdminPromptsPage;
