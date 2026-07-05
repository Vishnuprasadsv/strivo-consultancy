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

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');

    if (!token || !user) {
      navigate('/admin/login');
    } else {
      setAdminUser(JSON.parse(user));
    }
  }, [navigate]);

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
    <div className="min-h-screen pt-24 pb-4 px-4 relative z-10 md:ml-56 bg-sub">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto card p-4 shadow-card relative overflow-hidden"
      >
        <div className="text-center mb-2 pb-1.5 border-b border-[var(--color-border)] flex flex-col items-center">
          <h1 style={{ fontSize: '26px', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }}>
            Admin Profile
          </h1>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-paragraph)', opacity: 0.6, margin: '2px 0 0 0' }}>
            Manage your profile details and security
          </p>
        </div>

        {/* Profile Info Section */}
        <div className="flex flex-col items-center justify-center mb-3">
          <div className="relative mb-1.5 group cursor-pointer" onClick={handleImageClick}>
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
            {adminUser.username && (
              <h2 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-black)', margin: 0 }}>
                {adminUser.username}
              </h2>
            )}
            {adminUser.role && (
              <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)', margin: '1px 0 0 0' }}>
                {adminUser.role}
              </p>
            )}
            {adminUser.email && (
              <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-normal)', color: 'var(--color-paragraph)', opacity: 0.7, margin: '1px 0 0 0' }}>
                {adminUser.email}
              </p>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mt-2.5">
          <h3 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-black)', margin: '0 0 6px 0', textAlign: 'center' }}>
            Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-2.5 max-w-md mx-auto">
            <div className="flex flex-col gap-1.5">
              <div>
                <label
                  className="mb-1 block text-left"
                  style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="input py-2 px-3 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-xs h-9 w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                  placeholder="Current password"
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-left"
                  style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="input py-2 px-3 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-xs h-9 w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                  placeholder="New password"
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-left"
                  style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)' }}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="input py-2 px-3 placeholder:text-[var(--color-paragraph)] placeholder:opacity-40 transition-all text-xs h-9 w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex justify-center mt-0.5">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="btn px-5 text-xs h-9 w-full justify-center"
              >
                {isChangingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>

      </motion.div>
    </div>
  );
};

export default Profile;
