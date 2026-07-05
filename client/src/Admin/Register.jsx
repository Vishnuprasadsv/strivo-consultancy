import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo1 from '../assets/strivo logo.png';

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

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please verify.', { icon: null });
      return;
    }

    // Passwords should be secure (minimum 6 characters)
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.', { icon: null });
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
            <img src={logo1} alt="Strivo Logo" className="h-10 object-contain" />
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
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4 bg-sub">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md card p-8 relative overflow-hidden"
      >
        {/* Logo container */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <img src={logo1} alt="Strivo Logo" className="h-10 object-contain" />
        </div>

        {/* Heading Section */}
        <div className="text-center mb-8">
          <h2
            className="mb-2 block text-center tracking-wide"
            style={{ fontSize: 'var(--text-card-heading)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)' }}
          >
            ADMIN REGISTER
          </h2>
          <p
            className="opacity-70 block text-center"
            style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-normal)', color: 'var(--color-paragraph)' }}
          >
            Create the primary administrator account
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Username Field */}
          <div className="space-y-2">
            <label
              className="ml-1 block uppercase"
              style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
            >
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="input placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm"
              style={{ color: 'var(--color-paragraph)' }}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              className="ml-1 block uppercase"
              style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@strivo.com"
              className="input placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm"
              style={{ color: 'var(--color-paragraph)' }}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              className="ml-1 block uppercase"
              style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pr-12 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm"
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
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label
              className="ml-1 block uppercase"
              style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input pr-12 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm"
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
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isLoading}
            type="submit"
            className="btn w-full flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Register Admin'
            )}
          </motion.button>
        </form>

        {/* Footer Redirect to Login */}
        <div className="text-center mt-6">
          <Link
            to="/admin/login"
            className="hover:underline transition-colors block text-center"
            style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-primary)' }}
          >
            Already have an account? Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
