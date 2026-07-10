import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';

const Profile = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');

    if (!token || !user) {
      navigate('/admin/login');
    } else {
      setAdminUser(JSON.parse(user));
    }
  }, [navigate]);

  useEffect(() => {
    if (!passwordData.currentPassword || !adminUser?.username) {
      setIsCurrentPasswordVerified(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/verify-password`, {
          username: adminUser.username,
          password: passwordData.currentPassword
        });
        if (response.data?.success) {
          setIsCurrentPasswordVerified(true);
        } else {
          setIsCurrentPasswordVerified(false);
        }
      } catch (error) {
        setIsCurrentPasswordVerified(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [passwordData.currentPassword, adminUser]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('username', adminUser.username);

    setIsUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const newProfileImage = response.data.profileImage;
      const updatedUser = { ...adminUser, profileImage: newProfileImage };

      // Update state and local storage
      setAdminUser(updatedUser);
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));

      toast.success('Profile image updated successfully!');

      // Force reload navbar (since it reads from localStorage, or wait, it might need an event if not context. But simple reload or just navigate works, though it might not be strictly necessary if it reads from local storage on render. Wait, it reads on location change.)
      // We can dispatch a custom event if we want, or just let it be.
      window.dispatchEvent(new Event('storage')); // A hack to trigger storage events, but we can just let it refresh if needed.
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile image.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    // Password strength rules verification
    const pass = passwordData.newPassword;
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!(minLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
      setPasswordData(prev => ({
        ...prev,
        newPassword: '',
        confirmNewPassword: ''
      }));
      toast.error('Password does not meet expectation: must be at least 8 characters, with one uppercase letter, one lowercase letter, one special character, and one number.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/change-password`, {
        username: adminUser.username,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Password changed successfully! Please login again.');

      // Logout logic
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');

      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);

    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!adminUser) return null;

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10 bg-sub">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto bg-white p-5 md:p-6 shadow-card relative overflow-visible border border-[var(--color-border)] rounded-[var(--radius-sm)]"
      >
        <div className="text-center mb-4 pb-3 border-b border-[var(--color-border)] flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-primary)] uppercase tracking-wide" style={{ margin: 0 }}>
            Profile Settings
          </h1>
          <p className="text-xs text-[var(--color-paragraph)] opacity-70 mt-1" style={{ margin: 0 }}>
            Update profile image and security configurations
          </p>
        </div>

        {/* Profile Info Section */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="relative mb-2 group cursor-pointer" onClick={handleImageClick}>
            {isUploading ? (
              <div className="w-14 h-14 flex items-center justify-center border border-[var(--color-border)] bg-black/5" style={{ borderRadius: 'var(--radius-sm)' }}>
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : adminUser.profileImage ? (
              <img
                src={adminUser.profileImage}
                alt="Profile"
                className="w-14 h-14 object-cover border border-[var(--color-border)] transition-colors"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
            ) : (
              <AccountCircleIcon className="text-slate-400 w-14 h-14 transition-colors" style={{ fontSize: '56px' }} />
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" style={{ borderRadius: 'var(--radius-sm)' }}>
              <EditIcon className="text-white" style={{ fontSize: 16 }} />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-center">
            {adminUser.email && (
              <p className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 px-2.5 py-0.5 rounded-[var(--radius-sm)]" style={{ margin: 0 }}>
                {adminUser.email}
              </p>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mt-2">
          <h3 className="text-xs font-bold text-[var(--color-black)] uppercase tracking-wider text-center mb-3">
            Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3.5 max-w-md mx-auto">
            <div className="flex flex-col gap-3 text-left">
              <div>
                <label className="mb-1 block text-left text-xs font-bold text-[var(--color-black)] uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="input py-2 px-3 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm h-10 w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                  placeholder="Enter current password"
                />
              </div>

              {isCurrentPasswordVerified ? (
                <>
                  <div className="relative">
                    <label className="mb-1 block text-left text-xs font-bold text-[var(--color-black)] uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      onFocus={() => setShowRequirements(true)}
                      onBlur={() => setShowRequirements(false)}
                      className="input py-2 px-3 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm h-10 w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                      placeholder="Enter new password"
                    />
                    
                    {/* Floating absolutely positioned requirements tooltip */}
                    {showRequirements && (
                      <div className="absolute z-30 left-0 right-0 md:left-full md:-top-6 md:ml-4 mt-2 md:mt-0 w-full md:w-64 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 shadow-xl text-left">
                        <span className="text-[11px] font-bold text-[var(--color-black)] uppercase tracking-wider block mb-1">
                          Password Requirements:
                        </span>
                        <ul className="list-disc pl-4 text-xs text-[var(--color-paragraph)] flex flex-col gap-1 leading-relaxed">
                          <li>Must be at least <strong>8 characters</strong> long</li>
                          <li>Must contain at least <strong>one uppercase letter</strong></li>
                          <li>Must contain at least <strong>one lowercase letter</strong></li>
                          <li>Must contain at least <strong>one number</strong></li>
                          <li>Must contain at least <strong>one special character</strong></li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-left text-xs font-bold text-[var(--color-black)] uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={passwordData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      className="input py-2 px-3 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-sm h-10 w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                      placeholder="Confirm new password"
                    />
                  </div>
                </>
              ) : (
                <div className="bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] p-3 text-center">
                  <p className="text-xs text-[var(--color-paragraph)] leading-normal font-semibold" style={{ margin: 0 }}>
                    Please verify your current password to unlock the new password fields.
                  </p>
                </div>
              )}
            </div>

            {isCurrentPasswordVerified && (
              <div className="flex justify-center mt-1">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="btn px-6 text-xs font-bold h-10 w-full justify-center uppercase tracking-wider cursor-pointer border-none"
                >
                  {isChangingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            )}
          </form>
        </div>

      </motion.div>
    </div>
  );
};

export default Profile;
