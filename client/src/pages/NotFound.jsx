import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiHelpCircle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-main-bg)] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex items-center justify-center mb-6"
        >
          {/* Main big 404 text with subtle gradient */}
          <h1 className="text-9xl font-extrabold text-[var(--color-primary)] tracking-widest select-none opacity-10">
            404
          </h1>
          <div className="absolute text-5xl font-extrabold text-[var(--color-primary)]">
            Oops!
          </div>
        </motion.div>

        {/* Text Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-[var(--color-black)] uppercase tracking-wide">
            Page Not Found
          </h2>
          <p className="text-sm text-[var(--color-paragraph)] max-w-sm mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10"
        >
          <Link
            to="/"
            className="btn inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded shadow-md hover:shadow-lg transition-all"
            style={{ minHeight: '42px' }}
          >
            <FiHome size={14} />
            Back to Homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
