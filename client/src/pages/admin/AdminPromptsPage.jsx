import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Trash2, Download, ExternalLink, Loader2 } from 'lucide-react';

const AdminPromptsPage = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/prompts', { params: { page, limit: 12, search } });
      setPrompts(res.data.prompts);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch prompt history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchPrompts(), 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  const deletePrompt = async (id) => {
    if (!window.confirm('Delete this prompt and associated image record?')) return;
    try {
      const res = await axios.delete(`/api/admin/prompts/${id}`);
      if (res.data.success) {
        fetchPrompts();
        toast.success('Record deleted');
      }
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search prompts..."
            className="input-field pl-10 py-2 text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <button className="btn-secondary py-2 px-4 flex items-center gap-2">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={40} /></div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No prompt history found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {prompts.map(prompt => (
            <div key={prompt._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col">
              <div className="aspect-video bg-slate-100 dark:bg-slate-900 relative group">
                <img src={prompt.imageUrl} alt={prompt.prompt} className="w-full h-full object-contain" loading="lazy" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a href={prompt.imageUrl} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform">
                    <ExternalLink size={18} />
                  </a>
                  <button onClick={() => deletePrompt(prompt._id)} className="p-2 bg-red-500 rounded-full text-white hover:scale-110 transition-transform">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-3 mb-3 flex-1" title={prompt.prompt}>
                  "{prompt.prompt}"
                </p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 mt-auto">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{prompt.userId?.name || 'Unknown User'}</span>
                    <span className="text-xs text-slate-500">{new Date(prompt.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{prompt.userId?.email || 'N/A'}</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">{prompt.model}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50">Prev</button>
          <span className="text-sm text-slate-500">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminPromptsPage;
