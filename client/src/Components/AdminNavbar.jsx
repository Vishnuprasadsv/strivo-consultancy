import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiChevronDown, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import {
  getAdminStatsAPI,
  getAdminApplicationsAPI,
  getAdminInquiriesAPI,
  getReviewsAPI
} from '../services/allApi';
import Logo from '../assets/strivo logo.svg?react';

const navLinks = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Inquiries', path: '/admin/inquiries' },
  { name: 'Case Studies', path: '/admin/casestudies' },
  { name: 'Articles', path: '/admin/article' },
  { name: 'Careers', path: '/admin/career' },
];

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const userRole = adminUser?.role ? adminUser.role.toLowerCase() : '';
  const filteredNavLinks = navLinks.filter((link) => {
    if (userRole === 'hr') {
      return link.name === 'Careers';
    } else {
      return link.name !== 'Careers';
    }
  });
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [lastViewed, setLastViewed] = useState(() => {
    const saved = localStorage.getItem('adminNotificationsLastViewed');
    return saved ? new Date(saved) : new Date(0);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    if (showDropdown || showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showProfileDropdown]);

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
        const pendingApps = appsRes.data.data.filter(
          app => app.status === "pending"
        );
        applicationNotifications = pendingApps.map(app => ({
          id: app._id,
          type: "career",
          text: `New application: ${app.fullName} for ${app.appliedPosition}`,
          time: new Date(app.createdAt)
        }));
      }

      // Inquiries
      let inquiryNotifications = [];
      if (inquiryRes.status === 200) {
        inquiryNotifications = inquiryRes.data.map(inquiry => ({
          id: inquiry._id,
          type: "inquiry",
          text: `${inquiry.fullName} requested ${inquiry.service}`,
          time: new Date(inquiry.createdAt)
        }));
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
    } catch (err) {
      console.error("Failed to fetch notifications in navbar:", err);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    navigate('/admin/login');
  };

  // Check auth and hide on login pages
  const isAuthPage = ['/admin', '/admin/login', '/admin/register', '/admin/forgot-password', '/admin/reset-password'].includes(location.pathname);
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

      // Connect EventSource for real-time inquiry events
      const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries/events`);
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === "new_inquiry") {
            fetchNotifications();
          }
        } catch (err) {
          console.error("SSE parse error in navbar:", err);
        }
      };

      // Periodically refresh notifications in backend (every 15 seconds)
      const interval = setInterval(fetchNotifications, 15000);

      return () => {
        window.removeEventListener('notificationUpdate', handleUpdate);
        eventSource.close();
        clearInterval(interval);
      };
    }
  }, [location.pathname, isAdminRoute, isAuthPage]);

  if (!isAdminRoute || isAuthPage) return null;

  return (
    <>
      {/* Top horizontal Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] z-40 flex items-center justify-between px-8 md:px-16 lg:px-24"
        style={{ fontFamily: 'var(--font-primary)' }}
      >
        {/* Left: Logo */}
        <Link to={adminUser?.role?.toLowerCase() === 'hr' ? "/admin/career" : "/admin/dashboard"} className="flex items-center gap-2 flex-shrink-0">
          <Logo className="h-7 text-[var(--color-primary)] fill-[var(--color-primary)]" />
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 h-full">
          {filteredNavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative h-full flex items-center px-1 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'text-[var(--color-primary)]' 
                    : 'text-[var(--color-black)] hover:text-[var(--color-primary)]'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="adminNavUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--color-primary)] rounded-t-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 h-full flex-shrink-0">
          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleToggleDropdown}
              className="relative text-[var(--color-primary)] transition-all cursor-pointer border-none bg-transparent flex items-center justify-center p-2"
              title="Notifications"
            >
              <FiBell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-1 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold border border-white">
                  {notificationCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 shadow-2xl z-50 text-[var(--color-black)] flex flex-col gap-3">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
                  <span className="text-sm font-bold">Recent Notifications</span>
                  <span className="text-[10px] text-blue-600 font-semibold">{notificationCount} Pending</span>
                </div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-[var(--color-paragraph)] opacity-60 text-center py-4">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2 hover:bg-[var(--color-sub-bg)] rounded transition-colors cursor-pointer text-left"
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
                        <p className="text-xs text-[var(--color-black)] leading-snug">{n.text}</p>
                        <span className="text-[9px] text-[var(--color-paragraph)] opacity-60 block mt-1">
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

          {/* Vertical Separator (Desktop) */}
          <div className="h-6 w-[1px] bg-[var(--color-border)] hidden md:block"></div>

          {/* Admin Profile Dropdown (Desktop) */}
          <div className="relative hidden md:block" ref={profileDropdownRef}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 cursor-pointer border-none bg-transparent py-1.5 focus:outline-none"
            >
              <div className="text-right">
                {adminUser?.username && <p className="text-xs font-bold text-[var(--color-black)] leading-tight">{adminUser.username}</p>}
              </div>
              {adminUser?.profileImage ? (
                <img src={adminUser.profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-[var(--color-border)]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-[var(--color-border)]">
                  <FiUser size={16} />
                </div>
              )}
              <FiChevronDown size={14} className={`text-[var(--color-paragraph)] opacity-60 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2.5 w-48 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] shadow-xl py-1 z-50 text-left">
                <Link
                  to="/admin/profile"
                  onClick={() => setShowProfileDropdown(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition-colors"
                >
                  <FiUser size={14} />
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-sub-bg)] transition-colors border-none bg-transparent text-left cursor-pointer"
                >
                  <FiLogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="md:hidden text-[var(--color-paragraph)] opacity-70 hover:opacity-100 transition-opacity cursor-pointer border-none bg-transparent p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FiMenu size={22} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Slide-over Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden animate-fade"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-white z-50 md:hidden flex flex-col p-6 shadow-2xl"
              style={{ fontFamily: 'var(--font-primary)' }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <Logo className="h-6 text-[var(--color-primary)] fill-[var(--color-primary)]" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[var(--color-paragraph)] hover:text-black border-none bg-transparent cursor-pointer p-1"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="border-b border-[var(--color-border)] mb-6"></div>

              {/* Links */}
              <div className="flex flex-col gap-4 flex-1 text-left">
                {filteredNavLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-sm font-semibold transition-colors py-1.5 ${
                        isActive ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-black)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom user profile section */}
              <div className="border-t border-[var(--color-border)] pt-6 mt-auto flex flex-col gap-4 text-left">
                <Link 
                  to="/admin/profile" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  {adminUser?.profileImage ? (
                    <img src={adminUser.profileImage} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-[var(--color-border)]" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-[var(--color-border)]">
                      <FiUser size={16} />
                    </div>
                  )}
                  <div>
                    {adminUser?.username && <p className="text-xs font-bold text-[var(--color-black)] leading-tight">{adminUser.username}</p>}
                  </div>
                </Link>
                
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-sub-bg)] transition-colors border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-transparent justify-center cursor-pointer"
                >
                  <FiLogOut size={14} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-main-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] p-6 max-w-sm w-full shadow-2xl relative text-left"
          >
            <h3 className="text-lg font-bold text-[var(--color-black)] mb-2">Confirm Logout</h3>
            <p className="text-[var(--color-paragraph)] opacity-80 text-sm mb-6">Are you sure you want to log out of the admin panel?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] bg-transparent transition-colors font-semibold cursor-pointer text-xs"
                style={{ height: '34px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 border-none rounded-[var(--radius-sm)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition-colors font-semibold cursor-pointer text-xs"
                style={{ height: '34px' }}
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
