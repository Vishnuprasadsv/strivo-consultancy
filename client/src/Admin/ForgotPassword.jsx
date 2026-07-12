import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Logo from '../assets/strivo logo.svg?react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);

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
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/forgot-password`, { email });
      if (response.data.otp) {
        toast.success(`OTP (Dev Mode): ${response.data.otp}`, { duration: 15000 });
      } else {
        toast.success('OTP sent successfully to your email!');
      }
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

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="text-center mb-4">
                <h2
                  className="mb-1 block text-center text-sm font-bold tracking-wider uppercase text-[var(--color-primary)]"
                >
                  RESET PASSWORD
                </h2>
                <p
                  className="opacity-70 block text-center text-xs"
                  style={{ color: 'var(--color-paragraph)' }}
                >
                  Enter your email ID to receive an OTP
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-3">
                <div className="space-y-0.5">
                  <label
                    className="block text-[10px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left"
                  >
                    EMAIL ID
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="input placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="btn w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
                    style={{ height: '36px' }}
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </div>
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
              className="w-full"
            >
              <div className="text-center mb-4">
                <h2
                  className="mb-1 block text-center text-sm font-bold tracking-wider uppercase text-[var(--color-primary)]"
                >
                  Enter OTP
                </h2>
                <p
                  className="opacity-70 block text-center text-xs"
                  style={{ color: 'var(--color-paragraph)' }}
                >
                  We sent a 6-digit code to <br />
                  <span style={{ fontWeight: 'bold', color: 'var(--color-black)' }}>{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="grid grid-cols-6 gap-2 w-full max-w-xs mx-auto">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-full h-10 text-center text-lg font-bold transition-all border"
                      style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-white)', color: 'var(--color-black)' }}
                    />
                  ))}
                </div>

                <div className="text-center">
                  {timer > 0 ? (
                    <p
                      className="opacity-70 text-center text-xs"
                      style={{ color: 'var(--color-paragraph)' }}
                    >
                      Code expires in <span style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatTime(timer)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      className="bg-transparent border-none p-0 cursor-pointer hover:underline text-xs font-semibold text-[var(--color-primary)]"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  disabled={isLoading || timer === 0}
                  type="submit"
                  className="btn w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
                  style={{ height: '36px' }}
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
              className="w-full"
            >
              <div className="text-center mb-4">
                <h2
                  className="mb-1 block text-center text-sm font-bold tracking-wider uppercase text-[var(--color-primary)]"
                >
                  Create New Password
                </h2>
                <p
                  className="opacity-70 block text-center text-xs"
                  style={{ color: 'var(--color-paragraph)' }}
                >
                  Please enter your new password below
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-3">
                <div className="space-y-0.5">
                  <label
                    className="block text-[10px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left"
                  >
                    NEW PASSWORD
                  </label>
                  <div className="relative">
                    <FiLock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--color-paragraph)', opacity: 0.5, fontSize: '14px' }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setShowRequirements(true)}
                      onBlur={() => setShowRequirements(false)}
                      placeholder="Enter new password"
                      className="input pl-9 pr-10 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all"
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-85 transition-opacity cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                      style={{ color: 'var(--color-paragraph)' }}
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
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

                <div className="space-y-0.5">
                  <label
                    className="block text-[10px] font-bold text-[var(--color-black)] uppercase tracking-wider text-left"
                  >
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <FiLock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--color-paragraph)', opacity: 0.5, fontSize: '14px' }}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="input pl-9 pr-10 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all"
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-85 transition-opacity cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                      style={{ color: 'var(--color-paragraph)' }}
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="btn w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
                    style={{ height: '36px' }}
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'Confirm Password'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mt-4">
          <Link
            to="/admin/login"
            className="hover:underline transition-colors text-xs font-semibold text-[var(--color-primary)]"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
