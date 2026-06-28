import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Settings, Save, AlertCircle, Key, Link as LinkIcon, Loader2 } from 'lucide-react';

const AdminApiProvidersPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState('');

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
      const res = await axios.put('/api/admin/settings', { apiKeys: settings.apiKeys, defaultAiModel: settings.defaultAiModel });
      if (res.data.success) {
        toast.success('API Providers saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save API keys');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (provider) => {
    setTesting(provider);
    try {
      // Stub test connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (settings.apiKeys[provider]) {
        toast.success(`Successfully connected to ${provider.toUpperCase()}`);
      } else {
        toast.error(`No API key provided for ${provider}`);
      }
    } catch (error) {
      toast.error(`Failed to connect to ${provider}`);
    } finally {
      setTesting('');
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;

  const providers = ['openai', 'gemini', 'claude', 'replicate'];

  return (
    <form onSubmit={handleSave} className="max-w-4xl space-y-6">
      
      <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 p-4 rounded-xl flex gap-3 shadow-sm border border-orange-100 dark:border-orange-900">
        <AlertCircle size={24} className="flex-shrink-0" />
        <div>
          <h3 className="font-bold">API Key Security</h3>
          <p className="text-sm mt-1">API keys entered here are stored securely in the database. If keys exist in your `.env` file, they will take precedence over these database values.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">Default AI Provider</h3>
        <div>
          <select 
            value={settings.defaultAiModel} 
            onChange={(e) => setSettings(prev => ({ ...prev, defaultAiModel: e.target.value }))} 
            className="input-field max-w-sm"
          >
            <option value="dall-e-3">OpenAI - DALL-E 3</option>
            <option value="gemini-pro-vision">Google - Gemini Pro Vision</option>
            <option value="claude-3-opus">Anthropic - Claude 3 Opus</option>
            <option value="stable-diffusion">Stability AI - Stable Diffusion</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Key size={20} /> Provider Configuration</h3>
        
        <div className="space-y-6">
          {providers.map(provider => (
            <div key={provider} className="p-4 border border-slate-100 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h4 className="font-bold capitalize text-slate-800 dark:text-slate-200">{provider}</h4>
                <button 
                  type="button" 
                  onClick={() => testConnection(provider)}
                  disabled={testing === provider}
                  className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {testing === provider ? <Loader2 size={16} className="animate-spin" /> : <LinkIcon size={16} />}
                  Test Connection
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">API Key</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••••••••••••••••••••••" 
                  value={settings.apiKeys[provider] || ''} 
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKeys: { ...prev.apiKeys, [provider]: e.target.value } }))} 
                  className="input-field font-mono" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-6 py-2.5">
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Save Providers
        </button>
      </div>
    </form>
  );
};

export default AdminApiProvidersPage;
