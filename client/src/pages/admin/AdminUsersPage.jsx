import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Edit, Trash2, Ban, CheckCircle, Shield, MoreVertical, Loader2 } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  
  // Filter states
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users', {
        params: { page, limit: 10, search, role: roleFilter, status: statusFilter, plan: planFilter }
      });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, roleFilter, statusFilter, planFilter]);

  const toggleUserStatus = async (user) => {
    try {
      const newStatus = user.status === 'active' ? 'suspended' : 'active';
      const res = await axios.put(`/api/admin/users/${user._id}`, { status: newStatus });
      if (res.data.success) {
        setUsers(users.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
        toast.success(`User ${newStatus}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await axios.delete(`/api/admin/users/${id}`);
      if (res.data.success) {
        fetchUsers();
        toast.success('User deleted');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header & Filters */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="relative max-w-sm w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="input-field pl-10 py-2 text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={roleFilter} 
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="input-field py-2 text-sm w-auto"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field py-2 text-sm w-auto"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="deleted">Deleted</option>
          </select>
          
          <select 
            value={planFilter} 
            onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
            className="input-field py-2 text-sm w-auto"
          >
            <option value="">All Plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role & Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center"><Loader2 className="animate-spin mx-auto text-primary-500" size={24} /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold flex-shrink-0">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" alt="" /> : user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.role === 'superadmin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' : 
                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {user.role}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.plan === 'pro' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30' : 
                          user.plan === 'enterprise' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 
                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {user.plan}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 
                        user.status === 'suspended' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' : 
                        'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                      {user.status === 'active' ? <CheckCircle size={12} /> : user.status === 'suspended' ? <Ban size={12} /> : <Trash2 size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        title={user.status === 'active' ? "Suspend" : "Activate"}
                        onClick={() => toggleUserStatus(user)}
                        disabled={user.role === 'superadmin'}
                        className="p-1.5 text-slate-400 hover:text-orange-500 transition-colors disabled:opacity-30"
                      >
                        {user.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                      </button>
                      <button 
                        title="Delete"
                        onClick={() => deleteUser(user._id)}
                        disabled={user.role === 'superadmin'}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-30"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button 
                        title="Edit / Reset Password"
                        onClick={() => toast('Edit User Modal Coming Soon')}
                        className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing {(page - 1) * 10 + 1} to Math.min(page * 10, pagination.total) of {pagination.total} entries
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50">Prev</button>
            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
