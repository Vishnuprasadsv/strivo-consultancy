import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo1 from '../assets/strivo logo.png';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password.');
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

      toast.success('Login successful!');
      navigate('/admin/dashboard'); // Or wherever you want them to go
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4 bg-sub">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md card py-6 px-8 relative overflow-hidden"
      >
        <div className="flex flex-col items-center gap-4 mb-5">
          <img src={logo1} alt="Strivo Logo" className="h-9 object-contain" />
        </div>

        <div className="text-center mb-5">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-1 block text-center"
            style={{ fontSize: 'var(--text-card-heading)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)' }}
          >
            ADMIN PORTAL
          </motion.h2>
          <p
            className="opacity-70 block text-center"
            style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-normal)', color: 'var(--color-paragraph)' }}
          >
            Secure access to Strivo management
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="ml-1 block"
              style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
            >
              USERNAME
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="input placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm py-2.5"
                style={{ color: 'var(--color-paragraph)' }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="ml-1 block"
              style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
            >
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pr-12 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm py-2.5"
                style={{ color: 'var(--color-paragraph)' }}
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
            <div className="flex justify-end pt-0.5">
              <Link
                to="/admin/forgot-password"
                className="hover:underline transition-colors block text-right"
                style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-medium)', color: 'var(--color-primary)' }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="btn w-full flex items-center justify-center gap-2 h-11"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;