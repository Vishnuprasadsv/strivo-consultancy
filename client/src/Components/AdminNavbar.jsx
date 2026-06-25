import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ArticleIcon from '@mui/icons-material/Article';
import WorkIcon from '@mui/icons-material/Work';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import logo from '../assets/strivo logo.png';
import logo2 from '../assets/strivo logo 2.png';

const navLinks = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { name: 'Inquiries', path: '/admin/inquiries', icon: <QuestionAnswerIcon /> },
  { name: 'Case Studies', path: '/admin/casestudies', icon: <LibraryBooksIcon /> },
  { name: 'Article', path: '/admin/article', icon: <ArticleIcon /> },
  { name: 'Career', path: '/admin/career', icon: <WorkIcon /> },
];

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Check auth and hide on login pages
  const isAuthPage = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'].includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute && !isAuthPage) {
      const user = localStorage.getItem('adminUser');
      if (user) {
        setAdminUser(JSON.parse(user));
      }
    }
  }, [location.pathname, isAdminRoute, isAuthPage]);

  if (!isAdminRoute || isAuthPage) return null;

  return (
    <>
      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 md:left-64 right-0 h-20 bg-white/5 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-4 md:px-8"
      >
        {/* Search */}
        <div className="flex items-center bg-black/20 border border-white/10 rounded-full px-4 py-2 w-48 md:w-96">
          <SearchIcon className="text-white/50 mr-2" fontSize="small" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-white w-full placeholder-white/50 text-sm"
          />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="relative text-white/70 hover:text-white transition-colors cursor-pointer">
            <NotificationsIcon />
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-white/10">
            <div className="text-right hidden md:block">
              {adminUser?.username && <p className="text-sm font-medium text-white">{adminUser.username}</p>}
              {adminUser?.role && <p className="text-xs text-white/50">{adminUser.role}</p>}
            </div>
            {adminUser?.profileImage ? (
              <img src={adminUser.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30" />
            ) : (
              <AccountCircleIcon className="text-white/70 w-10 h-10" style={{ fontSize: '40px' }} />
            )}
          </div>
        </div>
      </motion.nav>

      {/* Left Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 h-screen w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 z-50 hidden md:flex flex-col"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <img src={logo} alt="Strivo Logo" className="h-10 w-auto" />
          <img src={logo2} alt="Strivo Logo Text" className="h-6 w-auto" />
        </div>
        
        <div className="mx-6 border-b border-white/10 mb-6"></div>

        {/* Nav Links */}
        <div className="flex-1 px-4 flex flex-col gap-2 relative">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 group cursor-pointer ${
                  isActive ? 'text-blue-500 font-medium' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-admin-nav-bg"
                    className="absolute inset-0 bg-blue-600/10 rounded-xl border-r-[3px] border-blue-400"
                    initial={false}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  {link.icon}
                </span>
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Profile and Logout */}
        <div className="p-4 mt-auto mb-4 flex flex-col gap-2">
          <Link
            to="/admin/profile"
            className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 group cursor-pointer ${
              location.pathname === '/admin/profile' ? 'text-blue-500 font-medium' : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {location.pathname === '/admin/profile' && (
              <motion.div
                layoutId="active-admin-nav-bg"
                className="absolute inset-0 bg-blue-600/10 rounded-xl border-r-[3px] border-blue-400"
                initial={false}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center">
              <AccountCircleIcon />
            </span>
            <span className="relative z-10">Profile</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="relative flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 group cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full text-left font-medium"
          >
            <span className="relative z-10 flex items-center justify-center">
              <LogoutIcon />
            </span>
            <span className="relative z-10">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminNavbar;
