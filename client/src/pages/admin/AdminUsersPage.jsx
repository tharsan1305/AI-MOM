import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Edit, Trash2, Ban, CheckCircle, MoreVertical, Loader2, FileText, Activity } from 'lucide-react';

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

  // Modal states
  const [actionModal, setActionModal] = useState({ isOpen: false, user: null, type: null }); // type: 'status', 'plan', 'delete'
  const [actionReason, setActionReason] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const openModal = (user, type) => {
    setActionModal({ isOpen: true, user, type });
    setActionReason('');
    setSelectedPlan(user.plan);
  };

  const closeModal = () => {
    setActionModal({ isOpen: false, user: null, type: null });
    setActionReason('');
    setSelectedPlan('');
    setIsSubmitting(false);
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!actionReason.trim()) {
      toast.error('Reason is required for audit logs');
      return;
    }

    setIsSubmitting(true);
    const { user, type } = actionModal;

    try {
      if (type === 'delete') {
        const res = await axios.delete(`/api/admin/users/${user._id}`, {
          data: { reason: actionReason }
        });
        if (res.data.success) {
          toast.success('User deleted successfully');
          fetchUsers();
        }
      } else if (type === 'status') {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        const res = await axios.put(`/api/admin/users/${user._id}`, { 
          status: newStatus,
          reason: actionReason
        });
        if (res.data.success) {
          toast.success(`User ${newStatus}`);
          setUsers(users.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
        }
      } else if (type === 'plan') {
        const res = await axios.put(`/api/admin/users/${user._id}`, { 
          plan: selectedPlan,
          reason: actionReason
        });
        if (res.data.success) {
          toast.success(`User plan updated to ${selectedPlan}`);
          setUsers(users.map(u => u._id === user._id ? { ...u, plan: selectedPlan } : u));
        }
      }
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
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
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role & Plan</th>
              <th className="px-6 py-4">Engagement</th>
              <th className="px-6 py-4">Status</th>
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
                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold flex-shrink-0">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" alt="" /> : user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize tracking-wide
                        ${user.role === 'superadmin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' : 
                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {user.role}
                      </span>
                      <button 
                        onClick={() => openModal(user, 'plan')}
                        disabled={user.role === 'superadmin'}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize tracking-wide hover:opacity-80 transition-opacity cursor-pointer disabled:cursor-not-allowed disabled:hover:opacity-100
                        ${user.plan === 'pro' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30' : 
                          user.plan === 'enterprise' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 
                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {user.plan} <Edit size={10} className="inline ml-1 mb-0.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <FileText size={14} className="text-blue-500" />
                        <span className="font-semibold">{user.totalReports || 0} Reports</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Activity size={12} className="text-orange-500" />
                        Active {new Date(user.lastActive).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold capitalize tracking-wide
                      ${user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 
                        user.status === 'suspended' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' : 
                        'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                      {user.status === 'active' ? <CheckCircle size={12} /> : user.status === 'suspended' ? <Ban size={12} /> : <Trash2 size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        title={user.status === 'active' ? "Suspend User" : "Activate User"}
                        onClick={() => openModal(user, 'status')}
                        disabled={user.role === 'superadmin' || user.status === 'deleted'}
                        className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-orange-100 hover:text-orange-600 dark:bg-slate-700 dark:text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {user.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button 
                        title="Delete User"
                        onClick={() => openModal(user, 'delete')}
                        disabled={user.role === 'superadmin' || user.status === 'deleted'}
                        className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-red-100 hover:text-red-600 dark:bg-slate-700 dark:text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
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
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total} entries
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50">Prev</button>
            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50">Next</button>
          </div>
        </div>
      )}

      {/* Action Modal (Audit Trail Requirement) */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                {actionModal.type === 'delete' ? 'Delete User' : 
                 actionModal.type === 'status' ? (actionModal.user?.status === 'active' ? 'Suspend User' : 'Reactivate User') : 
                 'Change Plan Tier'}
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Action target: <strong className="text-slate-700 dark:text-slate-300">{actionModal.user?.email}</strong>
              </p>

              <form onSubmit={handleActionSubmit} className="space-y-4">
                
                {actionModal.type === 'plan' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">New Plan Tier</label>
                    <select 
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                )}

                {actionModal.type === 'delete' && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-100">
                    Warning: This action will soft-delete the user account. They will no longer be able to log in.
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason (Audit Log Required) *</label>
                  <textarea 
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    required
                    rows="3"
                    className="input-field w-full resize-none"
                    placeholder="e.g., Requested via support ticket #1234"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 btn-secondary py-2.5">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !actionReason.trim()} 
                    className={`flex-1 py-2.5 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50
                      ${actionModal.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700'}`}
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Action'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsersPage;
