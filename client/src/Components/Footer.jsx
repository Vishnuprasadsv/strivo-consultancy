import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/strivo logo.svg?react';


const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const footerRef = useRef(null);
  const [logoColor, setLogoColor] = useState("var(--color-white)");

  useEffect(() => {
    if (footerRef.current) {
      const bgColor = window.getComputedStyle(footerRef.current).backgroundColor;
      const rgb = bgColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        // Use dark color for light backgrounds, and light color for dark backgrounds
        setLogoColor(luminance > 0.5 ? "var(--color-black)" : "var(--color-white)");
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <motion.footer 
      ref={footerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[var(--color-primary)] w-full border-t border-gray-500/30 pt-16 pb-12"
    >
      <div className="w-full px-[50px] grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1: Branding and Copyright */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 items-start">
            {/* <img src={logo} alt="Strivo Logo" className="h-10 w-auto object-contain" /> */}
            <Logo className="h-10 w-auto object-contain" style={{ color: logoColor }} />
          </div>
          <p className="text-[var(--color-main-paragraph)] text-sm leading-relaxed pr-4">
            © 2024 Strivo Consultancy. All rights reserved. Expert precision for enterprise growth.
          </p>
        </div>

        {/* Column 2: Company */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-[var(--font-bold)] text-base mb-1">Company</h3>
          <Link to="/about" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">About Us</Link>
          <Link to="/casestudies" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">Case Studies</Link>
          <Link to="/careerstrivo" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">Careers</Link>
          <Link to="/insights" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">Insights</Link>
        </div>

        {/* Column 3: Services */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-[var(--font-bold)] text-base mb-1">Services</h3>
          <Link to="/strategic" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">Strategic Planning</Link>
          <Link to="/operations" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">Operations Optimizations</Link>
          <Link to="/digital" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">Digital Transformation</Link>
          <Link to="/change" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">Change Management</Link>
        </div>

        {/* Column 4: Get in Touch */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-[var(--font-bold)] text-base mb-1">Get in Touch</h3>
          <Link to="/contact" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">Contact Us</Link>
          <Link to="/review" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">Add Review</Link>
          <Link to="/privacy-policy" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="text-[var(--color-main-paragraph)] hover:text-blue-400 transition-colors text-sm">Terms & Conditions</Link>
        </div>
      </div>
    </motion.footer>
    <AnimatePresence>
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[1000]"
        >
          <div
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-10 h-10 md:w-[50px] md:h-[50px] rounded-full bg-[var(--color-primary)] shadow-[0_8px_25px_rgba(71,100,255,0.4)] flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#3b55d9] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(71,100,255,0.6)]"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Footer;