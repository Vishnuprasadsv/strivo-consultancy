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
    <div className="min-h-screen pt-28 px-4 sm:px-8 relative z-10 md:ml-64">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Profile</h1>
            <p className="text-white/50 text-sm">Manage your profile details and security</p>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative mb-6 group cursor-pointer" onClick={handleImageClick}>
            {isUploading ? (
              <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-blue-500/30 bg-black/40">
                 <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : adminUser.profileImage ? (
              <img 
                src={adminUser.profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500/30 group-hover:border-blue-400 transition-colors"
              />
            ) : (
              <AccountCircleIcon className="text-white/70 w-32 h-32 group-hover:text-white transition-colors" style={{ fontSize: '128px' }} />
            )}
            
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <EditIcon className="text-white" />
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange}
            />
          </div>

          {adminUser.username && <h2 className="text-2xl font-bold text-white mb-1">{adminUser.username}</h2>}
          {adminUser.role && <p className="text-blue-400 font-medium mb-1">{adminUser.role}</p>}
          {adminUser.email && <p className="text-white/50 text-sm">{adminUser.email}</p>}
        </div>

        {/* Change Password Section */}
        <div className="bg-black/20 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Current Password</label>
              <input 
                type="password" 
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="Enter current password"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">New Password</label>
                <input 
                  type="password" 
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isChangingPassword}
              className="mt-4 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

      </motion.div>
    </div>
  );
};

export default Profile;
