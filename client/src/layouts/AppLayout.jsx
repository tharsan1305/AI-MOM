import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // Desktop: always open by default
      } else {
        setSidebarOpen(false); // Mobile: closed by default
      }
    };
    
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when navigating
  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      
      {/* Mobile Top Bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-40">
          <div className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
            MinuteCraft
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
          >
            <Menu size={24} />
          </button>
        </div>
      )}

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar 
          isMobile={isMobile} 
          closeSidebar={closeSidebarOnMobile} 
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden relative ${isMobile ? 'pt-14' : ''}`}>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-20">
            <Outlet />
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default AppLayout;
