import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Clock, Trash2, Download, Image as ImageIcon, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const HistoryPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/infographic/history?search=${searchTerm}`);
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [searchTerm]); // Re-fetch on search change

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const res = await axios.delete(`/api/infographic/${id}`);
        if (res.data.success) {
          toast.success('Project deleted');
          setProjects(projects.filter(p => p._id !== id));
        }
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Project History</h1>
          <p className="text-slate-500 mt-1">View and manage all your generated infographics.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="input-field pl-10 w-full"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin text-primary-500" size={32} />
        </div>
      ) : projects.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No projects found</h3>
          <p className="text-slate-500 mb-6">You haven't created any infographics yet, or none match your search.</p>
          <Link to="/create-report" className="btn-primary inline-flex">Create New Infographic</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="card p-0 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              {/* Preview Image or Placeholder */}
              <div className="h-48 bg-slate-100 dark:bg-slate-800 relative border-b border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <ImageIcon size={40} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">{project.template} template</span>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' :
                    project.status === 'processing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1" title={project.title}>
                  {project.title}
                </h3>
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <Clock size={14} className="mr-1" />
                  {new Date(project.createdAt).toLocaleDateString()}
                  <span className="mx-2">•</span>
                  <span className="capitalize">{project.template}</span>
                </div>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <Link 
                    to={`/infographic/${project._id}`}
                    className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-bold"
                  >
                    View <ExternalLink size={16} className="ml-1" />
                  </Link>
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete"
                      onClick={() => handleDelete(project._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
