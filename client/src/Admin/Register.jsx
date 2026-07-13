import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../assets/strivo logo.svg?react';

/**
 * Register Component
 * 
 * Reused login/register interface for both Admin and HR roles.
 * Optimized by a UI expert to fit perfectly within the viewport on all screens
 * with zero scrollbars, using custom compact spacing and typography.
 */
const Register = () => {
  // Input fields state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  const navigate = useNavigate();

  // Handle registration submission
  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required.';
    }

    if (password && confirmPassword) {
      const minLength = password.length >= 8;
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!(minLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
        newErrors.password = 'Password must be at least 8 characters, with one uppercase, one lowercase, one special character, and one number.';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match. Please verify.';
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      // Send registration request to the server API
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/register`,
        {
          username,
          email,
          role,
          password,
        }
      );

      // On successful registration:
      toast.success(response.data.message || 'Registration successful! Please login.', { icon: null });

      // Automatically switch to login page
      navigate('/admin/login');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      if (errorMsg.includes('not allowed')) {
        toast.error(`${errorMsg}. Please login.`, { icon: null, duration: 6000 });
      } else {
        toast.error(errorMsg, { icon: null });
      }
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
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm bg-white shadow-card border border-[var(--color-border)] rounded-[var(--radius-sm)] overflow-visible"
      >
        {/* Header with primary BG color */}
        <div className="bg-[var(--color-primary)] py-2.5 px-6 text-center rounded-t-[var(--radius-sm)]">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider m-0">
            REGISTER
          </h2>
        </div>

        {/* Body with white BG */}
        <div className="py-4 px-6">
          {/* Logo display */}
          <div className="flex flex-col items-center mb-3">
            <Logo className="h-6 text-[var(--color-primary)]" />
          </div>

          <form onSubmit={handleRegister} className="space-y-2.5">
            {/* Username Field */}
            <div className="space-y-0.5">
              <label className="block text-[10px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="input placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                style={inputStyle}
              />
              {errors.username && (
                <p className="text-red-500 text-[10px] mt-0.5 text-left font-semibold">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-0.5">
              <label className="block text-[10px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@strivo.com"
                className="input placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                style={inputStyle}
              />
              {errors.email && (
                <p className="text-red-500 text-[10px] mt-0.5 text-left font-semibold">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Role Field */}
            <div className="space-y-0.5">
              <label className="block text-[10px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left">
                Role Selection
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input transition-all w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] cursor-pointer"
                style={{ ...inputStyle, padding: '4px 8px' }}
              >
                <option value="Admin">Administrator</option>
                <option value="Hr">HR Manager</option>
              </select>
            </div>

            {/* Password Field */}
            <div className="space-y-0.5">
              <label className="block text-[10px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowRequirements(true)}
                  onBlur={() => setShowRequirements(false)}
                  placeholder="••••••••"
                  className="input pr-10 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
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
              {errors.password && (
                <p className="text-red-500 text-[10px] mt-0.5 text-left font-semibold">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-0.5">
              <label className="block text-[10px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-10 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-85 transition-opacity cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                  style={{ color: 'var(--color-paragraph)' }}
                >
                  {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] mt-0.5 text-left font-semibold">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Register Button */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading}
                type="submit"
                className="btn w-full flex items-center justify-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider"
                style={{ height: '36px' }}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  'Register'
                )}
              </motion.button>
            </div>
          </form>

          {/* Footer Redirect to Login */}
          <div className="text-center mt-3">
            <Link
              to="/admin/login"
              className="hover:underline transition-colors block text-center text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
