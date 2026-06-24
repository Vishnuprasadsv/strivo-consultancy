import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin/login');
    } else {
      setAdminUser(JSON.parse(user));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (!adminUser) return null;

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-8 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-white/50 text-sm">Manage your platform data here</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all border border-red-500/30 font-medium"
          >
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6">
            <h3 className="text-blue-300 text-sm font-medium mb-1">Welcome Back</h3>
            <p className="text-2xl font-bold text-white capitalize">{adminUser.username}</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2 flex items-center">
             <div>
               <h3 className="text-white/70 text-sm font-medium mb-2">System Status</h3>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></div>
                 <p className="text-white font-medium">All backend services operational.</p>
               </div>
             </div>
          </div>
        </div>
        
        <div className="mt-8 bg-black/20 border border-white/10 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
            <p className="text-white/40 text-center">Dashboard content and widgets will be placed here.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
