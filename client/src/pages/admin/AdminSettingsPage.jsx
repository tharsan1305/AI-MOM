import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Settings, Save, AlertCircle } from 'lucide-react';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    defaultAiModel: 'dall-e-3',
    maintenanceMode: false,
    registrationEnabled: true,
    paymentsEnabled: false,
    imageGenEnabled: true,
    apiKeys: { openai: '', gemini: '', claude: '', replicate: '' },
    globalLimits: { defaultPromptLimitDaily: 3, maxUploadSizeMB: 10 }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      const res = await axios.put('/api/admin/settings', settings);
      if (res.data.success) {
        toast.success('Settings saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleApiKeyChange = (key, value) => {
    setSettings(prev => ({ ...prev, apiKeys: { ...prev.apiKeys, [key]: value } }));
  };

  const handleLimitChange = (key, value) => {
    setSettings(prev => ({ ...prev, globalLimits: { ...prev.globalLimits, [key]: Number(value) } }));
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <form onSubmit={handleSave} className="max-w-4xl space-y-8">
      
      {/* Feature Toggles */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Settings size={20} /> Feature Toggles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disables app access for non-admins' },
            { id: 'registrationEnabled', label: 'User Registration', desc: 'Allow new users to sign up' },
            { id: 'paymentsEnabled', label: 'Payments Module', desc: 'Enable Stripe/Razorpay integration' },
            { id: 'imageGenEnabled', label: 'Image Generation', desc: 'Allow AI image generation feature' }
          ].map(toggle => (
            <div key={toggle.id} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={toggle.id}
                  type="checkbox"
                  checked={settings[toggle.id]}
                  onChange={(e) => setSettings(prev => ({ ...prev, [toggle.id]: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={toggle.id} className="font-medium text-slate-700 dark:text-slate-300">{toggle.label}</label>
                <p className="text-slate-500">{toggle.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Limits */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Global Default Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Free User Daily Prompt Limit</label>
            <input type="number" min="0" value={settings.globalLimits.defaultPromptLimitDaily} onChange={(e) => handleLimitChange('defaultPromptLimitDaily', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Upload Size (MB)</label>
            <input type="number" min="1" value={settings.globalLimits.maxUploadSizeMB} onChange={(e) => handleLimitChange('maxUploadSizeMB', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default AI Model</label>
            <select value={settings.defaultAiModel} onChange={(e) => setSettings(prev => ({ ...prev, defaultAiModel: e.target.value }))} className="input-field">
              <option value="dall-e-3">DALL-E 3</option>
              <option value="gemini-pro-vision">Gemini Pro Vision</option>
            </select>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-bold">API Key Configuration</h3>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 p-4 rounded-lg flex gap-3 mb-6">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">These keys are encrypted in the database. Leave blank if configured in <code>.env</code> file. Environment variables take precedence.</p>
        </div>
        <div className="space-y-4">
          {['openai', 'gemini', 'claude', 'replicate'].map(key => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">{key} API Key</label>
              <input type="password" placeholder="••••••••••••••••" value={settings.apiKeys[key]} onChange={(e) => handleApiKeyChange(key, e.target.value)} className="input-field" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? 'Saving...' : <><Save size={20} /> Save Configuration</>}
        </button>
      </div>
    </form>
  );
};

export default AdminSettingsPage;
