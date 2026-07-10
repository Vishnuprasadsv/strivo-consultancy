import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [location]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Password validation criteria check
    const minLength = newPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!(minLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
      setNewPassword('');
      setConfirmPassword('');
      toast.error('Password does not meet expectation: must be at least 8 characters, with one uppercase letter, one lowercase letter, one special character, and one number.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!token) {
      toast.error('Reset token is missing.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/reset-password`, {
        resetToken: token,
        newPassword
      });
      
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
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
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-visible"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-600/30 blur-[60px] -z-10 rounded-full pointer-events-none"></div>

        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Create New Password
          </motion.h2>
          <p className="text-white/60 text-sm">Enter your new secure password</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">New Password</label>
            <div className="relative">
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setShowRequirements(true)}
                onBlur={() => setShowRequirements(false)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />

              {/* Floating absolutely positioned requirements tooltip */}
              {showRequirements && (
                <div className="absolute z-30 left-0 right-0 md:left-full md:-top-6 md:ml-4 mt-2 md:mt-0 w-full md:w-64 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 shadow-xl text-left text-black">
                  <span className="text-[11px] font-bold uppercase tracking-wider block mb-1">
                    Password Requirements:
                  </span>
                  <ul className="list-disc pl-4 text-xs flex flex-col gap-1 leading-relaxed text-[var(--color-paragraph)]">
                    <li>Must be at least <strong>8 characters</strong> long</li>
                    <li>Must contain at least <strong>one uppercase letter</strong></li>
                    <li>Must contain at least <strong>one lowercase letter</strong></li>
                    <li>Must contain at least <strong>one number</strong></li>
                    <li>Must contain at least <strong>one special character</strong></li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">Confirm Password</label>
            <div className="relative">
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Update Password'
            )}
          </motion.button>
          
          <div className="text-center mt-4">
            <Link to="/admin/login" className="text-sm text-white/40 hover:text-white/60 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
