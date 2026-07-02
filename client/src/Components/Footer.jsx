import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/strivo logo.png';


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
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;