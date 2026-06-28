import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { LayoutTemplate, Plus, Edit, Trash2, Crown, LayoutGrid } from 'lucide-react';

const AdminTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get('/api/templates/admin');
      if (res.data.success) {
        setTemplates(res.data.templates);
      }
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await axios.delete(`/api/templates/${id}`);
        toast.success('Template deleted');
        fetchTemplates();
      } catch (error) {
        toast.error('Failed to delete template');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><LayoutTemplate /> Template Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
          <Plus size={16} /> New Template
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Template</th>
              <th className="p-4 font-semibold text-gray-600">Category</th>
              <th className="p-4 font-semibold text-gray-600">Component</th>
              <th className="p-4 font-semibold text-gray-600">Premium</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map(t => (
              <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={t.thumbnailUrl} alt={t.name} className="w-12 h-8 object-cover rounded" />
                    <div>
                      <div className="font-semibold text-gray-800">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.description?.substring(0, 50)}...</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{t.category}</td>
                <td className="p-4 text-sm font-mono text-gray-500 bg-gray-100 rounded px-2 py-1 mx-4 inline-block">{t.componentName}</td>
                <td className="p-4">
                  {t.isPremium ? <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-max"><Crown size={12}/> PRO</span> : <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold w-max">FREE</span>}
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 p-2"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(t._id)} className="text-red-600 hover:text-red-800 p-2"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No templates found. Run the seed script to populate.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTemplatesPage;
