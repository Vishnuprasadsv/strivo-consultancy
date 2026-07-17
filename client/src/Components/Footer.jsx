import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../assets/strivo logo.svg?react';

// MUI Icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';


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
      <div className="max-w-[110rem] mx-auto w-full px-4 md:px-12 lg:px-[180px] grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
        {/* Column 1: Headquarters & Social Media */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-3 text-[var(--color-main-paragraph)]">
          <h3 className="text-white font-[var(--font-bold)] text-base mb-1">Headquarters</h3>
          <div className="flex flex-col gap-2 text-sm text-[var(--color-main-paragraph)]">
            <div className="flex items-start gap-2">
              <LocationOnIcon fontSize="small" className="text-gray-300 mt-0.5 shrink-0" />
              <span className="text-gray-300 leading-relaxed">
                TechPark Tower, Infopark Expressway,<br />
                Kakkanad, Kochi, Kerala 682042
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon fontSize="small" className="text-gray-300 shrink-0" />
              <a href="tel:+914841234567" className="text-gray-300 hover:text-white transition-colors">
                +91 484 123 4567
              </a>
            </div>
            <div className="flex items-center gap-2">
              <EmailIcon fontSize="small" className="text-gray-300 shrink-0" />
              <a href="mailto:strivoc@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                strivoc@gmail.com
              </a>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <a
              href="https://linkedin.com/company/strivo-consultancy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[var(--color-primary)] hover:scale-110 transition-all duration-300 shadow-sm"
              aria-label="LinkedIn"
            >
              <LinkedInIcon fontSize="small" />
            </a>
            <a
              href="https://facebook.com/strivo-consultancy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[var(--color-primary)] hover:scale-110 transition-all duration-300 shadow-sm"
              aria-label="Facebook"
            >
              <FacebookIcon fontSize="small" />
            </a>
            <a
              href="https://twitter.com/strivo_consult"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[var(--color-primary)] hover:scale-110 transition-all duration-300 shadow-sm"
              aria-label="Twitter/X"
            >
              <XIcon fontSize="small" />
            </a>
            <a
              href="https://instagram.com/strivo_consultancy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[var(--color-primary)] hover:scale-110 transition-all duration-300 shadow-sm"
              aria-label="Instagram"
            >
              <InstagramIcon fontSize="small" />
            </a>
            <a
              href="https://youtube.com/@strivo-consultancy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[var(--color-primary)] hover:scale-110 transition-all duration-300 shadow-sm"
              aria-label="YouTube"
            >
              <YouTubeIcon fontSize="small" />
            </a>
          </div>
        </div>

        {/* Column 2: Services */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-4 md:items-center">
          <h3 className="text-white font-[var(--font-bold)] text-base mb-1">Services</h3>
          <Link to="/strategic" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">Strategic Planning</Link>
          <Link to="/operations" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">Operations Optimizations</Link>
          <Link to="/digital" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">Digital Transformation</Link>
          <Link to="/change" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">Change Management</Link>
        </div>

        {/* Column 3: Get in Touch */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-4 md:items-end md:text-right">
          <h3 className="text-white font-[var(--font-bold)] text-base mb-1">Get in Touch</h3>
          <Link to="/about" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">About Us</Link>
          <Link to="/careerstrivo" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">Careers</Link>
          <Link to="/contact" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">Contact Us</Link>
          <Link to="/review" className="text-[var(--color-main-paragraph)] hover:text-[#C9C9C9] transition-colors text-sm">Add Review</Link>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="max-w-[110rem] mx-auto w-full px-4 md:px-12 lg:px-[180px] mt-12 pt-8 border-t border-gray-500/30 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
          <Logo className="h-8 w-auto object-contain" style={{ color: logoColor }} />
          <p className="text-[var(--color-main-paragraph)] text-sm">
            © {new Date().getFullYear()} Strivo Consultancy. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs whitespace-nowrap">
            <Link to="/privacy-policy" className="text-[var(--color-main-paragraph)] hover:text-white transition-colors whitespace-nowrap">Privacy Policy</Link>
            <span className="text-gray-500">|</span>
            <Link to="/terms-and-conditions" className="text-[var(--color-main-paragraph)] hover:text-white transition-colors whitespace-nowrap">Terms & Conditions</Link>
          </div>
        </div>
        <div className="text-[var(--color-main-paragraph)] text-decoration-none text-sm text-center lg:text-right">
          Developed by: Interns at <a href="https://penoft.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C9C9C9] transition-colors text-base font-bold">Penoft Technologies</a> (PIP-04)
        </div>
      </div>
    </motion.footer>
    </>
  );
};

export default Footer;