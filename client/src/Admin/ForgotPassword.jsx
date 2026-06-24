import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!username) {
      toast.error('Please enter your username.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/admin/forgot-password', {
        username,
      });
      
      // In a real app, this sends an email. Here we show the mock token for testing.
      toast.success('Reset link requested successfully!');
      
      // For testing purposes, we navigate directly to reset password with the token
      // In a real scenario, the user would click a link in their email
      if (response.data.resetToken) {
        toast.info(`Mock Token received: ${response.data.resetToken.substring(0, 10)}...`, { duration: 5000 });
        navigate(`/admin/reset-password?token=${response.data.resetToken}`);
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-600/30 blur-[60px] -z-10 rounded-full pointer-events-none"></div>

        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Reset Password
          </motion.h2>
          <p className="text-white/60 text-sm">Enter your username to receive a reset link</p>
        </div>

        <form onSubmit={handleRequestReset} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">Username</label>
            <div className="relative">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Send Reset Link'
            )}
          </motion.button>

          <div className="text-center mt-4">
            <Link to="/admin/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
