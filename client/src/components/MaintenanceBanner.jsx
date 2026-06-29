import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MaintenanceBanner = () => {
  const { user } = useAuth();
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    // If the user is an admin, they bypass maintenance mode anyway.
    // However, it might be good for admins to see the banner so they know it's on.
    const checkMaintenance = async () => {
      try {
        const res = await axios.get('/api/settings/public');
        if (res.data.success && res.data.maintenanceMode) {
          setIsMaintenance(true);
        } else {
          setIsMaintenance(false);
        }
      } catch (error) {
        // Assume false if the server is unreachable, or maybe we can't check
      }
    };

    checkMaintenance();
    // Re-check periodically
    const interval = setInterval(checkMaintenance, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  // Also listen for 503s globally via axios interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 503 && error.response.data?.isMaintenance) {
          setIsMaintenance(true);
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  if (!isMaintenance) return null;

  // We show an unmistakable full screen overlay for non-admins to block interaction.
  // Admins get a top banner to remind them it's on.
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  if (isAdmin) {
    return (
      <div className="bg-amber-500 text-amber-950 font-bold px-4 py-3 flex items-center justify-center gap-2 z-50 relative shadow-md">
        <AlertTriangle size={20} />
        Maintenance Mode is currently ACTIVE. Regular users cannot access the app.
      </div>
    );
  }

  // Full screen block for non-admins
  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[9999] flex flex-col items-center justify-center text-center p-6">
      <div className="bg-amber-500/20 text-amber-500 w-24 h-24 rounded-full flex items-center justify-center mb-8 animate-pulse shadow-[0_0_50px_rgba(245,158,11,0.3)]">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Under Maintenance</h1>
      <p className="text-xl text-slate-300 max-w-xl">
        MinuteCraft AI is currently undergoing scheduled maintenance to upgrade our systems. 
        We will be back online shortly. Thank you for your patience!
      </p>
    </div>
  );
};

export default MaintenanceBanner;
