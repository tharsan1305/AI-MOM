import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Settings, Save, AlertTriangle, Loader2 } from 'lucide-react';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    defaultAiModel: 'gemini-1.5-flash',
    maintenanceMode: false,
    registrationEnabled: true,
    paymentsEnabled: false,
    rateLimiterEnabled: true,
    featureFlags: {
      enableIllustratedTemplates: true,
      enablePdfExport: false
    },
    globalLimits: { 
      defaultPromptLimitDaily: 3, 
      maxUploadSizeMB: 10 
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/admin/settings');
        if (res.data.success && res.data.settings) {
          setSettings(res.data.settings);
        }
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Reason is required for audit logs');
      return;
    }
    
    setSaving(true);
    try {
      const payload = { ...settings, reason };
      const res = await axios.put('/api/admin/settings', payload);
      if (res.data.success) {
        toast.success('Global settings updated');
        setReason(''); // Reset reason after successful save
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLimitChange = (key, value) => {
    setSettings(prev => ({ ...prev, globalLimits: { ...prev.globalLimits, [key]: Number(value) } }));
  };

  const handleFeatureFlagChange = (key, value) => {
    setSettings(prev => ({ ...prev, featureFlags: { ...prev.featureFlags, [key]: value } }));
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;
  }

  return (
    <form onSubmit={handleSave} className="max-w-4xl space-y-8 pb-20">
      
      {/* Warning Banner */}
      <div className="bg-amber-50 text-amber-900 border border-amber-200 p-5 rounded-xl flex gap-4 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-100 shadow-sm">
        <AlertTriangle size={24} className="shrink-0 text-amber-500 mt-0.5" />
        <div>
          <h3 className="font-bold text-lg mb-1">Global Impact Warning</h3>
          <p className="text-sm opacity-90 leading-relaxed">
            Changes made here affect all users platform-wide immediately. Toggling Maintenance Mode will forcefully log out all non-admin users. All changes require an audit reason.
          </p>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Settings size={20} /> Platform Feature Toggles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disables app access for non-admins' },
            { id: 'rateLimiterEnabled', label: 'Global Rate Limiter', desc: 'Enforce API request limits to prevent abuse' },
            { id: 'registrationEnabled', label: 'User Registration', desc: 'Allow new users to sign up' },
            { id: 'paymentsEnabled', label: 'Payments Module', desc: 'Enable Stripe checkout and billing' }
          ].map(toggle => (
            <div key={toggle.id} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={toggle.id}
                  type="checkbox"
                  checked={settings[toggle.id] || false}
                  onChange={(e) => setSettings(prev => ({ ...prev, [toggle.id]: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={toggle.id} className={`font-medium ${toggle.id === 'maintenanceMode' && settings[toggle.id] ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>
                  {toggle.label}
                </label>
                <p className="text-slate-500 text-xs mt-0.5">{toggle.desc}</p>
              </div>
            </div>
          ))}

          {/* Nested Feature Flags */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enableIllustratedTemplates"
                type="checkbox"
                checked={settings.featureFlags?.enableIllustratedTemplates || false}
                onChange={(e) => handleFeatureFlagChange('enableIllustratedTemplates', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enableIllustratedTemplates" className="font-medium text-slate-700 dark:text-slate-300">
                Illustrated Templates
              </label>
              <p className="text-slate-500 text-xs mt-0.5">Enable the premium visual report template</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enablePdfExport"
                type="checkbox"
                checked={settings.featureFlags?.enablePdfExport || false}
                onChange={(e) => handleFeatureFlagChange('enablePdfExport', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enablePdfExport" className="font-medium text-slate-700 dark:text-slate-300">
                PDF Export
              </label>
              <p className="text-slate-500 text-xs mt-0.5">Enable experimental PDF generation (Beta)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Limits */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Global Default Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Free User Daily Prompt Limit</label>
            <input type="number" min="0" value={settings.globalLimits?.defaultPromptLimitDaily || 3} onChange={(e) => handleLimitChange('defaultPromptLimitDaily', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Upload Size (MB)</label>
            <input type="number" min="1" value={settings.globalLimits?.maxUploadSizeMB || 10} onChange={(e) => handleLimitChange('maxUploadSizeMB', e.target.value)} className="input-field" />
          </div>
        </div>
      </div>

      {/* Audit Log Reason */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Audit Reason (Required) *</label>
          <textarea 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows="2"
            className="input-field w-full resize-none bg-white dark:bg-slate-800"
            placeholder="e.g., Scheduled weekend maintenance"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving || !reason.trim()} className="btn-primary flex items-center gap-2 py-3 px-8 text-lg rounded-xl disabled:opacity-50">
          {saving ? <><Loader2 size={20} className="animate-spin" /> Saving...</> : <><Save size={20} /> Save Global Settings</>}
        </button>
      </div>
    </form>
  );
};

export default AdminSettingsPage;
