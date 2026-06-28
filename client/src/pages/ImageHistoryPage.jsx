import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Search, Trash2, Download, Image as ImageIcon, Clock, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ImageHistoryPage = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [deletingId, setDeletingId] = useState(null);

  const fetchImages = async (p = 1, q = '') => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/images/history', { params: { page: p, limit: 12, search: q } });
      if (res.data.success) {
        setImages(res.data.images);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error('Failed to load image history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchImages(page, search); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages(1, search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`/api/images/${id}`);
      if (res.data.success) {
        setImages(prev => prev.filter(img => img._id !== id));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
        toast.success('Image deleted');
      }
    } catch (err) {
      toast.error('Failed to delete image');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (imageUrl) => {
    try {
      const r = await fetch(imageUrl);
      const blob = await r.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_Image_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Downloaded!');
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <Link to="/image-generator" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-500 mb-3 font-medium">
            <ArrowLeft size={16} /> Back to Generator
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Generated Images</h1>
          <p className="text-slate-500 mt-1">{pagination.total} image{pagination.total !== 1 ? 's' : ''} generated</p>
        </div>
        <Link to="/image-generator" className="btn-primary flex items-center justify-center gap-2">
          <Sparkles size={20} /> Generate New
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-md">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..." className="input-field pl-12 pr-4" />
        </div>
      </form>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={40} className="animate-spin text-primary-500" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ImageIcon size={40} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No images yet</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">Start generating AI images and they'll appear here.</p>
          <Link to="/image-generator" className="btn-primary inline-flex items-center gap-2">
            <Sparkles size={18} /> Create Your First Image
          </Link>
        </div>
      ) : (
        <>
          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, idx) => (
              <motion.div key={img._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card p-0 overflow-hidden group">
                {/* Image */}
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="flex gap-2 w-full">
                      <button onClick={() => handleDownload(img.imageUrl)}
                        className="flex-1 bg-white/90 backdrop-blur-sm text-slate-900 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white transition-colors text-sm">
                        <Download size={16} /> Download
                      </button>
                      <button onClick={() => handleDelete(img._id)} disabled={deletingId === img._id}
                        className="bg-red-500/90 backdrop-blur-sm text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
                        {deletingId === img._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 font-medium mb-2">{img.prompt}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={12} />
                    <span>{new Date(img.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="ml-auto bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{img.size || '1024×1024'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="btn-secondary py-2 px-4 text-sm disabled:opacity-50">Previous</button>
              <span className="text-sm text-slate-500 px-4">Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="btn-secondary py-2 px-4 text-sm disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageHistoryPage;
