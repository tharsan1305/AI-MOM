import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Settings, Save, AlertTriangle, Loader2 } from 'lucide-react';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    general: { websiteName: '', contactEmail: '', maintenanceMode: false, registrationEnabled: true },
    ai: { defaultProvider: '', defaultModel: '', maxTokensPerRequest: 4000, globalRateLimitPerMinute: 60 },
    auth: { jwtExpiryDays: 7, enableGoogleOAuth: true, passwordPolicy: { minLength: 8, requireUppercase: true, requireNumbers: true, requireSpecialChars: false } },
    branding: { companyName: '', logoUrl: '', theme: 'light', primaryColor: '#6366f1' },
    security: { sessionTimeoutMinutes: 120, maxLoginAttempts: 5, lockoutDurationMinutes: 15, requireEmailVerification: false },
    storage: { maxUploadSizeMB: 10, allowedFileTypes: [], retentionDays: 30 },
    backup: { autoBackupEnabled: true, backupFrequency: 'daily', retentionCount: 7 }
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

  const handleChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }));
  };

  const handleNestedChange = (category, subCategory, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { 
        ...prev[category], 
        [subCategory]: { ...prev[category][subCategory], [key]: value }
      }
    }));
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

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* General Settings */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Settings size={20} /> General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Website Name</label>
              <input type="text" value={settings.general?.websiteName || ''} onChange={(e) => handleChange('general', 'websiteName', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input type="email" value={settings.general?.contactEmail || ''} onChange={(e) => handleChange('general', 'contactEmail', e.target.value)} className="input-field" />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <input type="checkbox" checked={settings.general?.maintenanceMode || false} onChange={(e) => handleChange('general', 'maintenanceMode', e.target.checked)} className="w-5 h-5 text-primary-600 rounded" />
              <label className="font-medium text-red-600">Maintenance Mode</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={settings.general?.registrationEnabled || false} onChange={(e) => handleChange('general', 'registrationEnabled', e.target.checked)} className="w-5 h-5 text-primary-600 rounded" />
              <label className="font-medium">Enable Registrations</label>
            </div>
          </div>
        </div>

        {/* AI Configuration */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Settings size={20} /> AI Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Default Provider</label>
              <input type="text" value={settings.ai?.defaultProvider || ''} onChange={(e) => handleChange('ai', 'defaultProvider', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Model</label>
              <input type="text" value={settings.ai?.defaultModel || ''} onChange={(e) => handleChange('ai', 'defaultModel', e.target.value)} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Max Tokens / Req</label>
                <input type="number" value={settings.ai?.maxTokensPerRequest || 4000} onChange={(e) => handleChange('ai', 'maxTokensPerRequest', Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rate Limit / Min</label>
                <input type="number" value={settings.ai?.globalRateLimitPerMinute || 60} onChange={(e) => handleChange('ai', 'globalRateLimitPerMinute', Number(e.target.value))} className="input-field" />
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Settings size={20} /> Security & Auth</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Session Timeout (min)</label>
              <input type="number" value={settings.security?.sessionTimeoutMinutes || 120} onChange={(e) => handleChange('security', 'sessionTimeoutMinutes', Number(e.target.value))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Login Attempts</label>
              <input type="number" value={settings.security?.maxLoginAttempts || 5} onChange={(e) => handleChange('security', 'maxLoginAttempts', Number(e.target.value))} className="input-field" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <input type="checkbox" checked={settings.auth?.enableGoogleOAuth || false} onChange={(e) => handleChange('auth', 'enableGoogleOAuth', e.target.checked)} className="w-5 h-5 text-primary-600 rounded" />
            <label className="font-medium">Enable Google OAuth</label>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <input type="checkbox" checked={settings.security?.requireEmailVerification || false} onChange={(e) => handleChange('security', 'requireEmailVerification', e.target.checked)} className="w-5 h-5 text-primary-600 rounded" />
            <label className="font-medium">Require Email Verification</label>
          </div>
        </div>

        {/* Storage Settings */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Settings size={20} /> Storage & Backups</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Max Upload (MB)</label>
              <input type="number" value={settings.storage?.maxUploadSizeMB || 10} onChange={(e) => handleChange('storage', 'maxUploadSizeMB', Number(e.target.value))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Retention (Days)</label>
              <input type="number" value={settings.storage?.retentionDays || 30} onChange={(e) => handleChange('storage', 'retentionDays', Number(e.target.value))} className="input-field" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <input type="checkbox" checked={settings.backup?.autoBackupEnabled || false} onChange={(e) => handleChange('backup', 'autoBackupEnabled', e.target.checked)} className="w-5 h-5 text-primary-600 rounded" />
            <label className="font-medium">Automated Database Backups</label>
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
