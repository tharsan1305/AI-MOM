import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Crown, Heart, Sparkles, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TemplateGalleryPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Meeting Minutes', 'Roadmap', 'Project Status', 'SWOT Analysis', 'Startup', 'Flowchart', 'Marketing Report', 'Business Report', 'Research Report', 'Executive Summary'];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const url = activeCategory === 'All' ? '/api/templates' : `/api/templates?category=${activeCategory}`;
        const res = await axios.get(url);
        if (res.data.success) setTemplates(res.data.templates);
      } catch (error) {
        console.error("Failed to load templates", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Template Gallery</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Discover professionally designed layouts for every business need. Select a template to auto-structure your next meeting.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {templates.map(t => (
                <motion.div 
                  key={t._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img src={t.thumbnailUrl} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {t.isPremium && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                        <Crown size={12} /> PRO
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-1 rounded shadow">
                      {t.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">{t.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <button className="text-slate-400 hover:text-red-500 transition-colors"><Heart size={20} /></button>
                      <button 
                        onClick={() => navigate('/create')}
                        className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                      >
                        <Sparkles size={16} /> Use Template
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TemplateGalleryPage;
