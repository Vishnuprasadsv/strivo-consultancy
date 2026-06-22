import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/strivo logo.png';
import logo2 from '../assets/strivo logo 2.png';

const Footer = () => {
  return (
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
            <img src={logo2} alt="Strivo Logo Text" className="h-8 w-auto object-contain" />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed pr-4">
            © 2024 Strivo Consultancy. All rights reserved. Expert precision for enterprise growth.
          </p>
        </div>

        {/* Column 2: Services */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-base mb-1">Services</h3>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Strategy</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Operations</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Digital Transformation</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Market Analysis</a>
        </div>

        {/* Column 3: Company */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-base mb-1">Company</h3>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Home</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Case Studies</a>
        </div>

        {/* Column 4: Legal */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-base mb-1">Legal</h3>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;