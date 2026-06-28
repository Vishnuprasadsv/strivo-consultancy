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
import {
  getAdminStatsAPI,
  getAdminApplicationsAPI,
  getAdminInquiriesAPI,
  getReviewsAPI
} from '../services/allApi';
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
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef(null);
  const [lastViewed, setLastViewed] = useState(() => {
    const saved = localStorage.getItem('adminNotificationsLastViewed');
    return saved ? new Date(saved) : new Date(0);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleToggleDropdown = () => {
    const nextShow = !showDropdown;
    setShowDropdown(nextShow);
    if (nextShow) {
      const now = new Date();
      setLastViewed(now);
      localStorage.setItem('adminNotificationsLastViewed', now.toISOString());
      setNotificationCount(0);
    }
  };

  // Fetch count of pending actions and list of top 5 new applications
  const fetchNotifications = async () => {
    try {

      const [statsRes, appsRes, inquiryRes, reviewsRes] =
        await Promise.all([
          getAdminStatsAPI(),
          getAdminApplicationsAPI(),
          getAdminInquiriesAPI(),
          getReviewsAPI()
        ]);

     
      // Applications

      let applicationNotifications = [];

      if (appsRes.status === 200 && appsRes.data?.success) {

        const pendingApps =
          appsRes.data.data.filter(
            app => app.status === "pending"
          );

        applicationNotifications =
          pendingApps.map(app => ({

            id: app._id,

            type: "career",

            text:
              `New application: ${app.fullName} for ${app.appliedPosition}`,

            time:
              new Date(app.createdAt)

          }));

      }


      // Inquiries

      let inquiryNotifications = [];

      if (inquiryRes.status === 200) {

  inquiryNotifications = inquiryRes.data.map(

    inquiry => ({

      id: inquiry._id,

      type: "inquiry",

      text:
        `${inquiry.fullName} requested ${inquiry.service}`,

      time:
        new Date(inquiry.createdAt)

    })

  );

}


      // Reviews
      let reviewNotifications = [];
      if (reviewsRes.status === 200 && reviewsRes.data?.success) {
        const newReviews = reviewsRes.data.data.filter(
          review => (new Date() - new Date(review.createdAt)) < 24 * 60 * 60 * 1000
        );
        reviewNotifications = newReviews.map(review => ({
          id: review._id,
          type: "review",
          text: `New review from ${review.fullName}`,
          time: new Date(review.createdAt)
        }));
      }

      // Combine notifications
      const allNotifications = [
        ...applicationNotifications,
        ...inquiryNotifications,
        ...reviewNotifications
      ]
        .sort((a, b) => b.time - a.time)
        .slice(0, 5);

      setNotifications(allNotifications);

      const unreadCount = allNotifications.filter(n => n.time > lastViewed).length;
      setNotificationCount(unreadCount);

    }

    catch (err) {

      console.error(
        "Failed to fetch notifications in navbar:",
        err
      );

    }
  };
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

      // Initial load of notifications
      fetchNotifications();

      // Listen to event emitted by CareerAdmin when an action is taken or data loaded
      const handleUpdate = () => fetchNotifications();
      window.addEventListener('notificationUpdate', handleUpdate);

      // Periodically refresh notifications in backend (every 15 seconds)
      const interval = setInterval(fetchNotifications, 15000);

      return () => {
        window.removeEventListener('notificationUpdate', handleUpdate);
        clearInterval(interval);
      };
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleToggleDropdown}
              className="relative text-white/70 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
              title="Notifications"
            >
              <NotificationsIcon />
              {notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border border-black">
                  {notificationCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-black border border-white/10 rounded-2xl p-4 shadow-2xl z-50 text-white flex flex-col gap-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-sm font-bold">Recent Notifications</span>
                  <span className="text-xxs text-blue-400 font-semibold">{notificationCount} Pending</span>
                </div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-white/40 text-center py-4">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        onClick={() => {
                          if (n.type === "career") {
                            navigate("/admin/career");
                          } else if (n.type === "inquiry") {
                            navigate("/admin/inquiries");
                          } else if (n.type === "review") {
                            navigate("/admin/dashboard");
                          }
                          setShowDropdown(false);
                        }}
                      >
                        <p className="text-xs text-white/80 leading-snug">{n.text}</p>
                        <span className="text-[9px] text-white/40 block mt-1">
                          {Math.floor((new Date() - n.time) / 60000) < 60
                            ? `${Math.max(0, Math.floor((new Date() - n.time) / 60000))}m ago`
                            : n.time.toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 group cursor-pointer ${isActive ? 'text-blue-500 font-medium' : 'text-white/70 hover:text-white hover:bg-white/5'
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
            className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 group cursor-pointer ${location.pathname === '/admin/profile' ? 'text-blue-500 font-medium' : 'text-white/70 hover:text-white hover:bg-white/5'
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
