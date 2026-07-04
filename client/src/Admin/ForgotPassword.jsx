import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../assets/strivo logo.png';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Timer logic for Step 2
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      toast.error('Please enter your email ID.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/forgot-password`, { email });
      toast.success('OTP sent successfully to your email!');
      setStep(2);
      setTimer(300); // Reset timer
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only keep the last digit typed
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/verify-otp`, {
        email,
        otp: otpValue,
      });
      
      setResetToken(response.data.resetToken);
      toast.success('OTP verified successfully!');
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/reset-password`, {
        resetToken,
        newPassword,
      });
      
      toast.success('Password changed successfully! Please login with your new password.');
      navigate('/admin/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
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
        className="w-full max-w-md card p-8 relative overflow-hidden"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <img src={logo} alt="Strivo Logo" className="h-10 object-contain" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 
                  className="mb-2 block text-center"
                  style={{ fontSize: 'var(--text-sub-heading)',  color: 'var(--color-black)' }}
                >
                  RESET PASSWORD
                </h2>
                <p 
                  className="opacity-70 block text-center"
                  style={{ fontSize: 'var(--text-medium)', fontWeight: 'var(--font-normal)', color: 'var(--color-paragraph)' }}
                >
                  Enter your email ID to receive an OTP
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <label 
                    className="ml-1 block"
                    style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
                  >
                    EMAIL ID
                  </label>
                  <div className="relative">
                    <FiMail 
                      className="absolute left-4 top-1/2 -translate-y-1/2" 
                      style={{ color: 'var(--color-paragraph)', opacity: 0.5 }}
                    />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="input pl-11 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all"
                      style={{ fontSize: 'var(--text-paragraph)', color: 'var(--color-paragraph)' }}
                    />
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="btn w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 
                  className="mb-2 block text-center"
                  style={{ fontSize: 'var(--text-sub-heading)', fontWeight: 'var(--font-normal)', color: 'var(--color-black)' }}
                >
                  Enter OTP
                </h2>
                <p 
                  className="opacity-70 block text-center"
                  style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-normal)', color: 'var(--color-paragraph)' }}
                >
                  We sent a 6-digit code to <br/>
                  <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-black)' }}>{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold transition-all border"
                      style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-white)', color: 'var(--color-black)' }}
                    />
                  ))}
                </div>

                <div className="text-center">
                  {timer > 0 ? (
                    <p 
                      className="opacity-70 text-center"
                      style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-normal)', color: 'var(--color-paragraph)' }}
                    >
                      Code expires in <span style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-bold)', fontFamily: 'monospace' }}>{formatTime(timer)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      className="bg-transparent border-none p-0 cursor-pointer hover:underline"
                      style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-primary)' }}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  disabled={isLoading || timer === 0}
                  type="submit"
                  className="btn w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 
                  className="mb-2 block text-center"
                  style={{ fontSize: 'var(--text-sub-heading)', fontWeight: 'var(--font-normal)', color: 'var(--color-black)' }}
                >
                  Create New Password
                </h2>
                <p 
                  className="opacity-70 block text-center"
                  style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-normal)', color: 'var(--color-paragraph)' }}
                >
                  Please enter your new password below
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <label 
                    className="ml-1 block"
                    style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
                  >
                    NEW PASSWORD
                  </label>
                  <div className="relative">
                    <FiLock 
                      className="absolute left-4 top-1/2 -translate-y-1/2" 
                      style={{ color: 'var(--color-paragraph)', opacity: 0.5 }}
                    />
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="input pl-11 pr-12 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all"
                      style={{ fontSize: 'var(--text-paragraph)', color: 'var(--color-paragraph)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-85 transition-opacity cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                      style={{ color: 'var(--color-paragraph)' }}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label 
                    className="ml-1 block"
                    style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
                  >
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <FiLock 
                      className="absolute left-4 top-1/2 -translate-y-1/2" 
                      style={{ color: 'var(--color-paragraph)', opacity: 0.5 }}
                    />
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="input pl-11 pr-12 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all"
                      style={{ fontSize: 'var(--text-paragraph)', color: 'var(--color-paragraph)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-85 transition-opacity cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                      style={{ color: 'var(--color-paragraph)' }}
                    >
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="btn w-full flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'Confirm Password'
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mt-6">
          <Link 
            to="/admin/login" 
            className="hover:underline transition-colors"
            style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-primary)' }}
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
