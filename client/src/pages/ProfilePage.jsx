import { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Camera, Save, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setAvatarBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await axios.put('/api/user/profile', { name, avatarBase64 });
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Profile updated successfully');
        setAvatarBase64(null); // Clear pending upload
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsSavingPassword(true);
    try {
      const res = await axios.put('/api/user/password', { currentPassword, newPassword });
      if (res.data.success) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile, preferences, and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation/Tabs */}
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-bold rounded-lg transition-colors">
            Profile Information
          </button>
          {!user?.googleId && (
            <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 font-medium rounded-lg transition-colors">
              Security
            </button>
          )}
          <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 font-medium rounded-lg transition-colors flex justify-between items-center">
            Billing
            <span className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded-full">{user?.plan}</span>
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Form */}
          <div className="card p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Information</h2>
            <form onSubmit={handleProfileSubmit}>
              {/* Avatar Upload */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-md overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-slate-400" />
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors shadow-lg"
                  >
                    <Camera size={14} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Profile Photo</h3>
                  <p className="text-sm text-slate-500">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      className="input-field pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      disabled
                      className="input-field pl-10 opacity-60 cursor-not-allowed"
                      value={user?.email || ''}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Email address cannot be changed</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSavingProfile || (name === user?.name && !avatarBase64)}
                  className="btn-primary flex items-center gap-2 px-6 disabled:opacity-50"
                >
                  <Save size={18} /> {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Password Form - Hide if Google Login */}
          {!user?.googleId && (
            <div className="card p-8 border-red-100 dark:border-red-900/30">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      className="input-field pl-10"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      minLength="6"
                      className="input-field pl-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      minLength="6"
                      className="input-field pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSavingPassword || !currentPassword || !newPassword}
                    className="btn-secondary flex items-center gap-2 disabled:opacity-50"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
