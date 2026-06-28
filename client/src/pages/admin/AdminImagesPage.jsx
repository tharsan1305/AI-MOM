import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2, Trash2, Download, ExternalLink } from 'lucide-react';

const AdminImagesPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('/api/admin/prompts'); // Using existing endpoint
        if (res.data.success) {
          setImages(res.data.prompts);
        }
      } catch (error) {
        toast.error('Failed to load images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image permanently?')) return;
    try {
      const res = await axios.delete(`/api/admin/prompts/${id}`);
      if (res.data.success) {
        toast.success('Image deleted');
        setImages(images.filter(img => img._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Generated Images</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage all AI generated images across the platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map(image => (
          <div key={image._id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group">
            <div className="relative aspect-square">
              <img src={image.imageUrl} alt={image.prompt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a href={image.imageUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors">
                  <ExternalLink size={20} />
                </a>
                <button onClick={() => handleDelete(image._id)} className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-800 dark:text-slate-200 font-medium line-clamp-2" title={image.prompt}>
                {image.prompt}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{image.userId?.email || 'Unknown'}</span>
                <span>{new Date(image.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="uppercase">{image.model}</span>
                <span>{image.resolution || image.size}</span>
              </div>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
            No images generated yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImagesPage;
