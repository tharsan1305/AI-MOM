import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Settings, Save, AlertCircle, Key, Link as LinkIcon, Loader2, CheckCircle2, Zap } from 'lucide-react';

const AdminApiProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState('');

  // Local state for edits
  const [edits, setEdits] = useState({});

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/providers');
      if (res.data.success) {
        setProviders(res.data.providers || []);
        // Initialize edits state with existing models
        const initEdits = {};
        res.data.providers.forEach(p => {
          initEdits[p.name] = { model: p.model || '', apiKey: '' };
        });
        // Also ensure default providers exist in UI even if not in DB yet
        ['openai', 'gemini', 'claude', 'groq'].forEach(name => {
          if (!initEdits[name]) initEdits[name] = { model: '', apiKey: '' };
        });
        setEdits(initEdits);
      }
    } catch (error) {
      toast.error('Failed to load API providers');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (providerName, field, value) => {
    setEdits(prev => ({
      ...prev,
      [providerName]: {
        ...prev[providerName],
        [field]: value
      }
    }));
  };

  const handleSave = async (providerName) => {
    setSaving(providerName);
    try {
      const data = {};
      if (edits[providerName].apiKey) data.apiKey = edits[providerName].apiKey;
      if (edits[providerName].model) data.model = edits[providerName].model;

      const res = await axios.put(`/api/admin/providers/${providerName}`, data);
      if (res.data.success) {
        toast.success(`${providerName.toUpperCase()} configuration saved`);
        // Clear the apiKey edit field so we don't accidentally resend it
        handleEdit(providerName, 'apiKey', '');
        await fetchProviders();
      }
    } catch (error) {
      toast.error(`Failed to save ${providerName}`);
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (providerName) => {
    setTesting(providerName);
    try {
      const res = await axios.post(`/api/admin/providers/${providerName}/test`);
      if (res.data.success) {
        toast.success(`Successfully connected to ${providerName.toUpperCase()}`);
      }
      await fetchProviders();
    } catch (error) {
      const msg = error.response?.data?.message || 'Connection failed';
      toast.error(msg);
      await fetchProviders();
    } finally {
      setTesting('');
    }
  };

  const activateProvider = async (providerName) => {
    try {
      const res = await axios.post(`/api/admin/providers/${providerName}/activate`);
      if (res.data.success) {
        toast.success(`${providerName.toUpperCase()} is now Active!`);
        await fetchProviders();
      }
    } catch (error) {
      toast.error('Failed to activate provider');
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;

  const providerNames = ['openai', 'gemini', 'claude', 'groq'];

  return (
    <div className="max-w-5xl space-y-6 pb-20">
      
      <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 p-4 rounded-xl flex gap-3 shadow-sm border border-orange-100 dark:border-orange-900">
        <AlertCircle size={24} className="flex-shrink-0" />
        <div>
          <h3 className="font-bold">API Key Security</h3>
          <p className="text-sm mt-1">
            API keys are encrypted at rest using AES-256. For security, we never return the full key to this panel. 
            Only the active provider is used for real analysis.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Key size={20} /> AI Providers Configuration</h3>
        
        <div className="space-y-6">
          {providerNames.map(name => {
            const dbInfo = providers.find(p => p.name === name) || {};
            const isActive = dbInfo.isActive;
            const statusColor = dbInfo.lastTestStatus === 'success' ? 'text-emerald-500' : dbInfo.lastTestStatus === 'failed' ? 'text-red-500' : 'text-slate-400';

            return (
              <div key={name} className={`p-5 border-2 rounded-xl transition-all ${isActive ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50'}`}>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold capitalize text-xl text-slate-800 dark:text-slate-200">{name}</h4>
                    {isActive && (
                      <span className="px-2.5 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 text-xs font-bold rounded flex items-center gap-1 uppercase tracking-wider">
                        <Zap size={12} /> Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button 
                      type="button" 
                      onClick={() => activateProvider(name)}
                      disabled={isActive}
                      className={`py-1.5 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${isActive ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                    >
                      <CheckCircle2 size={16} />
                      Set Active
                    </button>
                    <button 
                      type="button" 
                      onClick={() => testConnection(name)}
                      disabled={testing === name}
                      className="btn-secondary py-1.5 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      {testing === name ? <Loader2 size={16} className="animate-spin" /> : <LinkIcon size={16} />}
                      Test Connection
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleSave(name)}
                      disabled={saving === name}
                      className="btn-primary py-1.5 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving === name ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Save Config
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">API Key</label>
                    <input 
                      type="password" 
                      placeholder={dbInfo.apiKey || "Enter new key..."} 
                      value={edits[name]?.apiKey || ''} 
                      onChange={(e) => handleEdit(name, 'apiKey', e.target.value)} 
                      className="input-field font-mono text-sm" 
                    />
                    <p className="text-xs text-slate-500 mt-1">Leave blank to keep existing key. {dbInfo.apiKey && 'Key is currently saved.'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Model</label>
                    <input 
                      type="text" 
                      placeholder="e.g. gpt-4o-mini" 
                      value={edits[name]?.model !== undefined ? edits[name].model : (dbInfo.model || '')} 
                      onChange={(e) => handleEdit(name, 'model', e.target.value)} 
                      className="input-field font-mono text-sm" 
                    />
                    <div className="flex items-center gap-2 text-xs font-medium mt-2">
                      <span className="text-slate-500">Status:</span>
                      <span className={`${statusColor} uppercase tracking-wider flex items-center gap-1`}>
                        {dbInfo.lastTestStatus || 'untested'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AdminApiProvidersPage;
