import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../assets/strivo logo.svg?react';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const role = user.role ? user.role.toLowerCase() : '';
        if (role === 'hr') {
          navigate('/admin/career', { replace: true });
        } else {
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (err) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/login`, {
        username,
        password,
      });

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data));

      // Store token as cookie
      document.cookie = `token=${response.data.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;

      toast.success('Login successful!');
      
      const role = response.data.role ? response.data.role.toLowerCase() : '';
      if (role === 'hr') {
        navigate('/admin/career');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // UI Expert custom styles for compact input height and labels
  const inputStyle = {
    height: '34px',
    padding: '6px 12px',
    fontSize: '13px',
    color: 'var(--color-paragraph)'
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4 bg-sub py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm bg-white shadow-card border border-[var(--color-border)] rounded-[var(--radius-sm)] p-5 relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-3">
          <Logo className="h-6 text-[var(--color-primary)]" />
        </div>

        <div className="text-center mb-4">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-1 block text-center text-sm font-bold tracking-wider uppercase text-[var(--color-primary)]"
          >
            Management Login
          </motion.h2>
          <p
            className="opacity-70 block text-center text-xs"
            style={{ color: 'var(--color-paragraph)' }}
          >
            Secure access to Strivo management
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-0.5">
            <label
              className="block text-[10px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left"
            >
              USERNAME
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="input placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all"
                style={inputStyle}
              />
              {errors.username && (
                <p className="text-red-500 text-[10px] mt-0.5 text-left font-semibold">
                  {errors.username}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-0.5">
            <label
              className="block text-[10px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left"
            >
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pr-12 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-85 transition-opacity cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                style={{ color: 'var(--color-paragraph)' }}
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[10px] mt-0.5 text-left font-semibold">
                {errors.password}
              </p>
            )}
            <div className="flex justify-end pt-0.5">
              <Link
                to="/admin/forgot-password"
                className="hover:underline transition-colors block text-right text-xs font-semibold text-[var(--color-primary)]"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
              type="submit"
              className="btn w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
              style={{ height: '36px' }}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </div>
        </form>

        <div className="text-center mt-3 flex flex-col gap-2">
          <Link
            to="/admin/register"
            className="hover:underline transition-colors block text-center text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]"
          >
            Create an Account
          </Link>
          <div className="border-t border-[var(--color-border)] my-1"></div>
          <Link
            to="/"
            className="hover:underline transition-colors block text-center text-xs font-bold uppercase tracking-wider text-[var(--color-paragraph)] opacity-80 flex items-center justify-center gap-1.5"
          >
            <span>←</span> Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;