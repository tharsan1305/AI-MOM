import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Palette, Image as ImageIcon, Type, Save, CheckCircle2 } from 'lucide-react';

const BrandKitPage = () => {
  const [brand, setBrand] = useState({ logoUrl: '', primaryColor: '#3B82F6', fontFamily: 'Inter' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await axios.get('/api/brand');
        if (res.data.success && res.data.brandKit) {
          setBrand(res.data.brandKit);
        }
      } catch (error) {
        toast.error('Failed to load Brand Kit');
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/brand', brand);
      toast.success('Brand Kit saved successfully!');
    } catch (error) {
      toast.error('Failed to save Brand Kit');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center">Loading Brand Kit...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Brand Kit</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Configure your company's visual identity. These settings will automatically apply to all generated infographics.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 space-y-10">
        
        {/* Logo Section */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><ImageIcon className="text-primary-500" /> Company Logo</h2>
          <div className="flex items-end gap-6">
            <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden">
              {brand.logoUrl ? (
                <img src={brand.logoUrl} alt="Brand Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <ImageIcon size={32} className="text-slate-400" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Logo Image URL</label>
              <input 
                type="text" 
                value={brand.logoUrl} 
                onChange={(e) => setBrand({ ...brand, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="input-field"
              />
              <p className="text-xs text-slate-500">Paste a direct link to your transparent PNG logo.</p>
            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        {/* Color Section */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Palette className="text-primary-500" /> Primary Brand Color</h2>
          <div className="flex items-center gap-6">
            <div 
              className="w-16 h-16 rounded-full shadow-inner border-4 border-white dark:border-slate-800"
              style={{ backgroundColor: brand.primaryColor }}
            ></div>
            <div className="flex-1 max-w-xs space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hex Code</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={brand.primaryColor} 
                  onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                  className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                />
                <input 
                  type="text" 
                  value={brand.primaryColor} 
                  onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                  className="input-field font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="btn-primary py-3 px-8 flex items-center gap-2 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Save size={20} /> {saving ? 'Saving...' : 'Save Brand Kit'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BrandKitPage;
