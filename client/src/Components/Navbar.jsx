import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/strivo logo.png';
import logo2 from '../assets/strivo logo 2.png';

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Case Studies', path: '/casestudies' },
  { name: 'Insights', path: '/insights' },
];

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';

  const getActiveTab = () => {
    const path = location.pathname;
    if (['/contact', '/strategic', '/operations', '/change', '/digital'].includes(path)) return null;
    if (path === '/' || path === '/home') return 'Home';
    if (path.startsWith('/insights') || path.startsWith('/article')) return 'Insights';
    if (path === '/about') return 'About';
    if (path === '/services') return 'Services';
    if (path === '/casestudies') return 'Case Studies';
    return null;
  };

  const activeTab = getActiveTab();

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-black text-white w-full sticky top-0 z-50 border-b-2 border-gray-500/30 hidden md:block rounded-b-2xl"
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-20">
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <img src={logo} alt="Strivo Logo" className="h-10 w-auto" />
            <img src={logo2} alt="Strivo Logo Text" className="h-10 w-auto" />
          </motion.div>

          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <motion.li variants={itemVariants} key={link.name} className="relative">
                {link.path !== '#' ? (
                  <Link
                    to={link.path}
                    className={`px-3 py-2 block transition-all duration-150 ease-in-out font-medium ${activeTab === link.name ? 'text-blue-600' : 'text-white hover:text-gray-300'
                      }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className={`px-3 py-2 block transition-all duration-150 ease-in-out font-medium ${activeTab === link.name ? 'text-blue-600' : 'text-white hover:text-gray-300'
                      }`}
                  >
                    {link.name}
                  </a>
                )}
                {activeTab === link.name && (
                  <motion.div
                    layoutId="active-underline"
                    className="absolute left-1 right-1 bottom-0 h-[10px] border-b-[3px] border-blue-600 rounded-[12px]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    initial={false}
                  />
                )}
              </motion.li>
            ))}
          </ul>

          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <Link 
              to="/contact" 
              className={`cursor-pointer px-5 py-2 rounded-full transition-colors text-sm font-medium shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] ${
                isContactPage ? 'bg-blue-600 text-white' : 'bg-black border border-blue-600 text-white hover:bg-blue-900/30'
              }`}
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="md:hidden w-full sticky top-0 z-50 bg-black border-b-2 border-gray-500/30 flex items-center justify-between px-4 h-16 rounded-b-3xl"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <img src={logo} alt="Strivo Logo" className="h-8 w-auto" />
          <img src={logo2} alt="Strivo Logo Text" className="h-8 w-auto" />
        </motion.div>
        <motion.button
          variants={itemVariants}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </motion.button>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-black border-b border-gray-800 z-40 overflow-hidden"
          >
            <ul className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.path !== '#' ? (
                    <Link
                      to={link.path}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === link.name ? 'bg-gray-900 text-blue-600' : 'text-white hover:bg-gray-900 hover:text-gray-300'
                        }`}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === link.name ? 'bg-gray-900 text-blue-600' : 'text-white hover:bg-gray-900 hover:text-gray-300'
                        }`}
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
              <div className=" border-t border-gray-800 mt-2 pt-4 flex flex-col gap-3">
                <Link 
                  to="/contact" 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                  className={`cursor-pointer w-full text-center px-4 py-3 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)] text-sm font-medium block ${
                    isContactPage ? 'bg-blue-600 text-white' : 'bg-black border border-blue-600 text-white'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;