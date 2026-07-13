import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../assets/strivo logo.svg?react';


const Footer = () => {
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

  return (
    <>
    <motion.footer 
      ref={footerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[var(--color-primary)] py-16 px-8 md:px-16 lg:px-24 border-t border-[var(--color-border)]/20"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 select-none">
            <Logo className="w-10 h-10" style={{ fill: logoColor }} />
            <span className="font-primary font-bold text-xl uppercase tracking-wider" style={{ color: logoColor }}>Strivo</span>
          </div>
          <p className="text-[var(--color-main-paragraph)] text-sm leading-relaxed max-w-xs font-normal">
            Empowering organizations with cutting-edge consultancy, strategic planning, and operational excellence.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-[var(--font-bold)] text-base mb-1">Corporate</h3>
          <Link to="/about" className="text-[var(--color-main-paragraph)] hover:text-[var(--color-primary-hover)] transition-colors text-sm">About Us</Link>
          <Link to="/mission" className="text-[var(--color-main-paragraph)] hover:text-[var(--color-primary-hover)] transition-colors text-sm">Our Mission</Link>
          <Link to="/vision" className="text-[var(--color-main-paragraph)] hover:text-[var(--color-primary-hover)] transition-colors text-sm">Our Vision</Link>
          <Link to="/values" className="text-[var(--color-main-paragraph)] hover:text-[var(--color-primary-hover)] transition-colors text-sm">Core Values</Link>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-[var(--font-bold)] text-base mb-1">Solutions</h3>
          <Link to="/strategic-planning" className="text-[var(--color-main-paragraph)] hover:text-[var(--color-primary-hover)] transition-colors text-sm">Strategic Planning</Link>
          <Link to="/change-management" className="text-[var(--color-main-paragraph)] hover:text-[var(--color-primary-hover)] transition-colors text-sm">Change Management</Link>
          <Link to="/digital-transformation" className="text-[var(--color-main-paragraph)] hover:text-[var(--color-primary-hover)] transition-colors text-sm">Digital Transformation</Link>
          <Link to="/operational-excellence" className="text-[var(--color-main-paragraph)] hover:text-[var(--color-primary-hover)] transition-colors text-sm">Operational Excellence</Link>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-[var(--font-bold)] text-base mb-1">Get in Touch</h3>
          <Link to="/contact" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">Contact Us</Link>
          <Link to="/review" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">Add Review</Link>
          <Link to="/privacy-policy" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">Terms & Conditions</Link>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="max-w-[110rem] mx-auto w-full px-4 md:px-12 lg:px-[180px] mt-12 pt-8 border-t border-gray-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <Logo className="h-8 w-auto object-contain" style={{ color: logoColor }} />
          <p className="text-[var(--color-main-paragraph)] text-sm">
            © {new Date().getFullYear()} Strivo Consultancy. All rights reserved.
          </p>
        </div>
        <div className="text-[var(--color-main-paragraph)] text-decoration-none text-sm text-center md:text-right">
          Developed by: Interns at <a href="https://penoft.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C9C9C9] transition-colors text-base font-bold">Penoft Technologies</a> (PIP-04)
        </div>
      </div>
    </motion.footer>
    </>
  );
};

export default Footer;