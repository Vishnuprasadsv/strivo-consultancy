import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/strivo logo.png';


const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-black w-full border-t border-gray-500/30 pt-16 pb-12"
    >
      <div className="w-full px-[50px] grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1: Branding and Copyright */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 items-start">
            <img src={logo} alt="Strivo Logo" className="h-10 w-auto object-contain" />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed pr-4">
            © 2024 Strivo Consultancy. All rights reserved. Expert precision for enterprise growth.
          </p>
        </div>

        {/* Column 2: Company */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-base mb-1">Company</h3>
          <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">About Us</Link>
          <Link to="/casestudies" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Case Studies</Link>
          <Link to="/careerstrivo" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Careers</Link>
          <Link to="/insights" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Insights</Link>
        </div>

        {/* Column 3: Services */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-base mb-1">Services</h3>
          <Link to="/strategic" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Strategic Planning</Link>
          <Link to="/operations" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Operations Optimizations</Link>
          <Link to="/digital" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Digital Transformation</Link>
          <Link to="/change" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Change Management</Link>
        </div>

        {/* Column 4: Get in Touch */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-base mb-1">Get in Touch</h3>
          <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Contact Us</Link>
          <Link to="/review" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Add Review</Link>
          <Link to="/privacy-policy" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">Terms & Conditions</Link>
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
          className="fixed bottom-8 right-8 z-[1000]"
        >
          <div
            onClick={() => {
              const target = document.getElementById("hero-section");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="w-[50px] h-[50px] rounded-full bg-[#4764FF] shadow-[0_8px_25px_rgba(71,100,255,0.4)] flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#3b55d9] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(71,100,255,0.6)]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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