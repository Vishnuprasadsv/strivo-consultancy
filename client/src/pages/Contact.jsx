import React, { useState } from "react";
import { motion } from 'framer-motion';
import contactImg from '../assets/contact_page.png';
import axios from "axios";

// MUI components
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

// MUI icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';


const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/inquiries",
        formData
      );

      alert("Inquiry submitted successfully!");

      setFormData({
        fullName: "",
        company: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });

    } catch (error) {
      console.log(error);
      alert("Failed to submit inquiry.");
    }
  };
  return (
    <div className="bg-transparent text-white min-h-screen pt-12 pb-24 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32">

        {/* Section 1: Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">Let's Start a Conversation</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
              Whether you're looking to scale your infrastructure, optimize workflows, or explore new technological frontiers, our team of experts is ready to assist. Reach out to discuss how Premium Enterprise can accelerate your growth.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <img src={contactImg} alt="Contact Enterprise Solutions" className="w-full h-auto object-cover" />
          </div>
        </motion.section>

        {/* Section 2: Contact Info & Form */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column: Cards */}
          <div className="space-y-4">
            <div className="bg-[#1e293b] p-6 rounded-xl flex items-start gap-4 hover:bg-[#253247] transition-colors border border-gray-700/50">
              <div className="text-blue-500 mt-1"><LocationOnIcon /></div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Headquarters</h3>
                <p className="text-gray-400 text-sm leading-relaxed">100 Innovation Way<br />Tech District, Suite 400<br />San Francisco, CA 94105</p>
              </div>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-xl flex items-start gap-4 hover:bg-[#253247] transition-colors border border-gray-700/50">
              <div className="text-blue-500 mt-1"><PhoneIcon /></div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Direct Line</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Support: +1 (800) 555-0199<br />Sales: +1 (800) 555-0198</p>
              </div>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-xl flex items-start gap-4 hover:bg-[#253247] transition-colors border border-gray-700/50">
              <div className="text-blue-500 mt-1"><EmailIcon /></div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Electronic Mail</h3>
                <p className="text-gray-400 text-sm leading-relaxed">hello@premiumenterprise.com<br />support@premiumenterprise.com</p>
              </div>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-xl flex items-start gap-4 hover:bg-[#253247] transition-colors border border-gray-700/50">
              <div className="text-blue-500 mt-1"><AccessTimeIcon /></div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Business Hours</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Monday - Friday: 8:00 AM - 6:00 PM (PST)<br />Weekend support available for enterprise clients.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-[#1e293b] p-8 rounded-xl h-full flex flex-col border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
            <form className="flex-grow flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Corp"
                    className="..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@acme.com"
                    className="..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="..."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">Service Interest</label>
                <div className="relative">
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-[#334155] text-white rounded-lg px-4 py-3 pr-12 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select a specialized service...</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Operations">Operations</option>
                    <option value="Digital Transformation">Digital Transformation</option>
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                    <ExpandMoreIcon />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-grow">
                <label className="text-sm text-gray-300">Message</label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project requirements and timelines..."
                  rows={6}
                  className="w-full min-h-[150px] bg-[#334155] text-white placeholder-gray-400 rounded-lg px-4 py-3 border border-gray-600/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 w-full cursor-pointer"

              >
                Send Message
                <SendIcon fontSize="small" />
              </motion.button>
            </form>
          </div>
        </motion.section>

        {/* Section 3: FAQ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariants}
          className="flex flex-col items-center"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-400">Quick answers to common inquiries before you reach out.</p>
          </div>

          <div className="w-full max-w-3xl space-y-3">
            {[
              { q: 'What is typical response time for inquiries?', a: 'We typically respond within 24 business hours.' },
              { q: 'Do you offer custom SLA agreements?', a: 'Yes, we tailor Service Level Agreements to meet the specific operational needs of our enterprise clients.' },
              { q: 'Can we schedule an in-person discovery session?', a: 'Absolutely. Our consultants are available for on-site discovery sessions depending on your location and project scope.' },
              { q: 'What industries do you specialize in?', a: 'We specialize across various sectors including FinTech, Healthcare IT, Logistics, and Enterprise SaaS.' }
            ].map((faq, index) => (
              <Accordion
                key={index}
                disableGutters
                sx={{
                  backgroundColor: '#1e293b',
                  color: 'white',
                  borderRadius: '8px !important',
                  '&:before': { display: 'none' },
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  mb: '12px',
                  border: '1px solid rgba(75, 85, 99, 0.5)'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  sx={{
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    '& .MuiAccordionSummary-content': { margin: '12px 0' }
                  }}
                >
                  {faq.q}
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, color: '#9ca3af', lineHeight: 1.6 }}>
                  {faq.a}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default Contact;
