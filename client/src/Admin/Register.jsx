import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../assets/strivo logo.svg?react';

/**
 * AdminRegistration Component
 * 
 * Purpose: 
 * Allows the initial administrator to register in the system. 
 * If an admin is already registered in the database, registration is locked 
 * and multiple registrations are blocked.
 * 
 * Style Guidelines:
 * - Strictly follows the client's design variables in index.css (Poppins font, primary #4764FF, bg-sub background, etc.).
 * - Uses Tailwind CSS classes for structure, padding, spacing, and responsiveness.
 * - Displays toast messages without any icons to maintain a highly professional look.
 */
const Register = () => {
  // Input fields state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  const navigate = useNavigate();

  // Step 1: When page loads, check if an admin is already registered in the database
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/check-registered`
        );
        if (response.data.registered) {
          setIsAlreadyRegistered(true);
        }
      } catch (error) {
        console.error('Error verifying admin registration status:', error);
      }
    };
    checkAdminStatus();
  }, []);

  // Step 2: Handle the form submission when registering the admin
  const handleRegister = async (e) => {
    e.preventDefault();

    // Field verification - ensure all inputs are provided
    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all the required fields.', { icon: null });
      return;
    }

    // Password validation criteria check
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(minLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
      setPassword('');
      setConfirmPassword('');
      toast.error('Password does not meet expectation: must be at least 8 characters, with one uppercase letter, one lowercase letter, one special character, and one number.', { icon: null });
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please verify.', { icon: null });
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
          password,
        }
      );

      // On successful registration:
      toast.success(response.data.message || 'Admin registered successfully!', { icon: null });
      
      // Automatically switch to the admin login page
      navigate('/admin/login');
    } catch (error) {
      // If server returns error, display the clean error message (e.g. 'Multiple admin registration not allowed')
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg, { icon: null });
      
      // If error is due to registration lock, set status to locked
      if (error.response?.status === 400 && errorMsg.toLowerCase().includes('not allowed')) {
        setIsAlreadyRegistered(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If already registered, render the locked warning screen and hide the form
  if (isAlreadyRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4 bg-sub">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md card p-8 text-center"
        >
          {/* Logo display */}
          <div className="flex flex-col items-center gap-4 mb-8">
            {/* <img src={logo1} alt="Strivo Logo" className="h-10 object-contain" /> */}
             <Logo className="h-10 text-[var(--color-primary)]" />
          </div>

          <h2
            className="mb-4 font-semibold tracking-wider text-center"
            style={{ fontSize: '18px', color: 'var(--color-danger)' }}
          >
            REGISTRATION LOCKED
          </h2>

          <p
            className="opacity-80 block text-center mb-6 leading-relaxed"
            style={{ fontSize: 'var(--text-small)', color: 'var(--color-paragraph)' }}
          >
            Multiple admin registration not allowed. An administrator account already exists.
          </p>

          <Link
            to="/admin/login"
            className="btn w-full flex items-center justify-center"
          >
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  // Regular registration form UI
  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4 bg-sub pt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white shadow-card border border-[var(--color-border)] rounded-[var(--radius-sm)] overflow-visible"
      >
        {/* Header with primary BG color */}
        <div className="bg-[var(--color-primary)] py-4 px-6 text-center rounded-t-[var(--radius-sm)]">
          <h2 className="text-base font-bold text-white uppercase tracking-wider m-0">
            Admin Register
          </h2>
        </div>

        {/* Body with white BG */}
        <div className="p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="input py-2 px-3 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm h-10 w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                style={{ color: 'var(--color-paragraph)' }}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@strivo.com"
                className="input py-2 px-3 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm h-10 w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                style={{ color: 'var(--color-paragraph)' }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowRequirements(true)}
                  onBlur={() => setShowRequirements(false)}
                  placeholder="••••••••"
                  className="input py-2 px-3 pr-10 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm h-10 w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
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

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input py-2 px-3 pr-10 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm h-10 w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                  style={{ color: 'var(--color-paragraph)' }}
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
            </div>

            {/* Register Button */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading}
                type="submit"
                className="btn w-full flex items-center justify-center gap-2 cursor-pointer h-10 text-xs font-bold uppercase tracking-wider"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  'Register Admin'
                )}
              </motion.button>
            </div>
          </form>

          {/* Footer Redirect to Login */}
          <div className="text-center mt-4">
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
