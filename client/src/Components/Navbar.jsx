import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/strivo logo.svg?react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Case Studies', path: '/casestudies' },
  { name: 'Insights', path: '/insights' },
  { name: 'Career', path: '/careerstrivo' },
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
    if (path === '/') return 'Home';
    if (path.startsWith('/insights') || path.startsWith('/article')) return 'Insights';
    if (path === '/about') return 'About';
    if (path === '/services') return 'Services';
    if (path === '/casestudies') return 'Case Studies';
    if (path === '/careerstrivo') return 'Career';
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
        className="bg-white text-black w-full sticky top-0 z-50 border-b border-[var(--color-border)] hidden md:block"
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
  <div className="flex items-center justify-between h-20">

    {/* Logo */}
    <motion.div
      variants={itemVariants}
      className="flex-shrink-0"
    >
      <Logo className="h-10 xl:h-12 text-[var(--color-primary)]" />
    </motion.div>

    {/* Navigation */}
    <ul className="hidden lg:flex items-center whitespace-nowrap gap-3 xl:gap-6">
      {navLinks.map((link) => (
        <motion.li
          variants={itemVariants}
          key={link.name}
          className="relative"
        >
          <Link
            to={link.path}
            className="
              px-2 xl:px-3
              py-2
              text-sm xl:text-base
              font-bold
              text-[var(--color-primary)]
              transition-all
            "
          >
            {link.name}
          </Link>

          {activeTab === link.name && (
            <motion.div
              layoutId="active-underline"
              className="absolute left-1 right-1 bottom-0 h-[10px] border-b-[3px] border-[var(--color-primary)] rounded-[3px]"
            />
          )}
        </motion.li>
      ))}
    </ul>

    {/* CTA */}
    <motion.div
      variants={itemVariants}
      className="hidden lg:flex items-center"
    >
      <Link
        to="/contact"
        className="btn text-sm xl:text-base"
      >
        Contact Us
      </Link>
    </motion.div>

    {/* Mobile Menu Button */}
    <button className="lg:hidden">
      ☰
    </button>

  </div>
</div>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="md:hidden w-full sticky top-0 z-50 bg-[var(--color-white)] border-b border-[var(--color-border)] flex items-center justify-between px-4 h-16"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          {/* <img src={logo} alt="Strivo Logo" className="h-8 w-auto" /> */}
          <Logo className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto text-[var(--color-primary)]" />
        </motion.div>
        <motion.button
          variants={itemVariants}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-primary p-2"
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
            className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-[var(--color-border)] z-40 overflow-hidden"
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
                      className={`block px-4 py-3 rounded-lg transition-colors font-bold text-navlink ${activeTab === link.name ? 'bg-[var(--color-sub-bg)]' : 'hover:bg-gray-900 hover:text-[var(--color-primary)]'
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
                      className={`block px-4 py-3 rounded-lg transition-colors font-bold text-navlink ${activeTab === link.name ? 'bg-gray-900' : 'hover:bg-gray-900 hover:text-[var(--color-primary)]'
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
                  className="btn w-full"
                >
                  Contact Us
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