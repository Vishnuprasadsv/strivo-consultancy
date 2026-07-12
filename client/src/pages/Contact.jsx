import React, { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import contactImg from '../assets/contact_page.png';
import axios from "axios";
import { toast } from 'react-toastify';
// MUI components
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Box, Typography } from '@mui/material';
// MUI icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import { Link } from "react-router-dom";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const countryCodes = [
  { code: "+91", name: "India (+91)" },
  { code: "+1", name: "United States (+1)" },
  { code: "+44", name: "United Kingdom (+44)" },
  { code: "+61", name: "Australia (+61)" },
  { code: "+1", name: "Canada (+1)" },
  { code: "+49", name: "Germany (+49)" },
  { code: "+33", name: "France (+33)" },
  { code: "+65", name: "Singapore (+65)" },
  { code: "+971", name: "United Arab Emirates (+971)" },
  { code: "+81", name: "Japan (+81)" },
  { code: "+86", name: "China (+86)" },
  { code: "+55", name: "Brazil (+55)" },
  { code: "+27", name: "South Africa (+27)" },
  { code: "+31", name: "Netherlands (+31)" },
  { code: "+39", name: "Italy (+39)" },
  { code: "+34", name: "Spain (+34)" },
  { code: "+7", name: "Russia (+7)" },
  { code: "+82", name: "South Korea (+82)" },
  { code: "+92", name: "Pakistan (+92)" },
  { code: "+880", name: "Bangladesh (+880)" },
  { code: "+966", name: "Saudi Arabia (+966)" },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    countryCode: "+91",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [agreePolicy, setAgreePolicy] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "phone") {
      finalValue = value.replace(/[^0-9+\-\s()]/g, "");
    }
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const isValidCompanyName = (name) => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return false;
    // Block purely numeric company names (e.g. 11111111)
    if (/^\d+$/.test(trimmed)) return false;
    // Block single character repeated (e.g. aaaaa or bbbbb)
    if (/^(.)\1+$/i.test(trimmed)) return false;
    // Block consecutive identical character sequences (3+ times e.g. "aaa")
    if (/(.)\1{2,}/i.test(trimmed)) return false;
    // Block simple repeating 2-char pattern e.g. abababab
    if (/^(.{2})\1+$/i.test(trimmed)) return false;
    return true;
  };

  const getPhoneValidationRules = (code) => {
    switch (code) {
      case "+91": return { min: 10, max: 10, label: "10 digits" };
      case "+1": return { min: 10, max: 10, label: "10 digits" };
      case "+44": return { min: 10, max: 10, label: "10 digits" };
      case "+61": return { min: 9, max: 9, label: "9 digits" };
      case "+65": return { min: 8, max: 8, label: "8 digits" };
      case "+971": return { min: 9, max: 9, label: "9 digits" };
      case "+86": return { min: 11, max: 11, label: "11 digits" };
      case "+81": return { min: 10, max: 10, label: "10 digits" };
      case "+49": return { min: 10, max: 11, label: "10-11 digits" };
      case "+33": return { min: 9, max: 9, label: "9 digits" };
      case "+55": return { min: 10, max: 11, label: "10-11 digits" };
      case "+27": return { min: 9, max: 9, label: "9 digits" };
      case "+31": return { min: 9, max: 9, label: "9 digits" };
      case "+39": return { min: 10, max: 10, label: "10 digits" };
      case "+34": return { min: 9, max: 9, label: "9 digits" };
      case "+7": return { min: 10, max: 10, label: "10 digits" };
      case "+82": return { min: 9, max: 10, label: "9-10 digits" };
      case "+92": return { min: 10, max: 10, label: "10 digits" };
      case "+880": return { min: 10, max: 10, label: "10 digits" };
      case "+966": return { min: 9, max: 9, label: "9 digits" };
      default: return { min: 8, max: 15, label: "8 to 15 digits" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    } else if (!isValidCompanyName(formData.company)) {
      newErrors.company = "Please enter a valid company name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "invalid mail id";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const digits = formData.phone.replace(/\D/g, "");
      const rules = getPhoneValidationRules(formData.countryCode);
      if (digits.length < rules.min || digits.length > rules.max) {
        newErrors.phone = `Phone number must be valid (${rules.label})`;
      }
    }

    if (!formData.service) newErrors.service = "Please select a service interest";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    if (!agreePolicy) {
      newErrors.agreePolicy = "Please accept the Privacy Policy before submitting.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      const submissionData = {
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
      };
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/inquiries`,
        submissionData
      );
      setFormData({
        fullName: "",
        company: "",
        email: "",
        countryCode: "+91",
        phone: "",
        service: "",
        message: "",
      });
      setAgreePolicy(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit inquiry.");
    }
  };

  const filteredCountryCodes = countryCodes.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.includes(searchQuery)
  );

  return (
    <div className="flex flex-col min-h-screen font-sans overflow-hidden bg-main">
      
      {/* Section 1: Hero */}
      <Box
        component={motion.section}
        id="hero-section"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        sx={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-white)",
          py: { xs: 8, md: 12 },
          px: { xs: 2, sm: 6, md: 16, lg: "180px" },
          display: "flex",
          alignItems: "center",
          border: "none",
          boxShadow: "none",
        }}
      >
        <Box className="max-w-[1440px] mx-auto w-full">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 5, lg: 8 },
            }}
          >
            <Box sx={{ width: "100%", maxWidth: { xs: "100%", lg: "620px" } }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  component="h1"
                  sx={{
                    fontFamily: "var(--font-primary)",
                    fontSize: { xs: "32px", sm: "40px", md: "var(--text-main-heading)" },
                    fontWeight: "var(--font-normal)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.5px",
                    color: "var(--color-white)",
                    mb: 3,
                  }}
                >
                  Let's Start a Conversation
                </Typography>
                <Typography
                  component="p"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1.1rem" },
                    color: "rgba(255, 255, 255, 0.85)",
                    lineHeight: 1.7,
                    textAlign: "left",
                  }}
                >
                  Whether you're looking to scale your infrastructure, optimize workflows, or explore new technological frontiers, our team of experts is ready to assist. Reach out to discuss how Premium Enterprise can accelerate your growth.
                </Typography>
              </motion.div>
            </Box>

            <Box sx={{ width: { xs: "100%", lg: "45%" }, display: "flex", justifyContent: "center" }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{ width: "100%" }}
              >
                <Box
                  component="img"
                  src={contactImg}
                  alt="Contact Enterprise Solutions"
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: { xs: "280px", md: "380px" },
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </motion.div>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Wrapper for Sections 2+ */}
      <div className="w-full flex-grow py-16 px-6 md:px-16 lg:px-[180px]">
        <div className="max-w-[1440px] mx-auto space-y-20">
          
          {/* Section 2: Contact Info & Form */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUpVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-stretch"
          >
            {/* Left Column: Info Cards & Map container */}
            <div className="flex flex-col gap-4 w-full h-full justify-between">
              <div className="bg-[var(--color-sub-bg)] p-6 rounded-[var(--radius-sm)] flex items-start gap-4 border border-gray-200">
                <div className="text-[var(--color-primary)] mt-1"><LocationOnIcon /></div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-1">Headquarters</h3>
                  <p className="paragraph text-gray-700 text-sm leading-relaxed">TechPark Tower<br />Infopark Expressway<br />Kakkanad, Kochi, Kerala 682042</p>
                </div>
              </div>
              <div className="bg-[var(--color-sub-bg)] p-6 rounded-[var(--radius-sm)] flex items-start gap-4 border border-gray-200">
                <div className="text-[var(--color-primary)] mt-1"><PhoneIcon /></div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-1">Direct Line</h3>
                  <p className="paragraph text-gray-700 text-sm leading-relaxed">Support: +91 484 123 4567<br />Sales: +91 484 123 4568</p>
                </div>
              </div>
              <div className="bg-[var(--color-sub-bg)] p-6 rounded-[var(--radius-sm)] flex items-start gap-4 border border-gray-200">
                <div className="text-[var(--color-primary)] mt-1"><EmailIcon /></div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-1">Electronic Mail</h3>
                  <p className="paragraph text-gray-700 text-sm leading-relaxed">strivoc@gmail.com<br />hrstrivoc@gmail.com</p>
                </div>
              </div>
              <div className="bg-[var(--color-sub-bg)] p-6 rounded-[var(--radius-sm)] flex items-start gap-4 border border-gray-200">
                <div className="text-[var(--color-primary)] mt-1"><AccessTimeIcon /></div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-1">Business Hours</h3>
                  <p className="paragraph text-gray-700 text-sm leading-relaxed">Monday - Friday: 8:00 AM - 6:00 PM (PST)<br />Weekend support available for enterprise clients.</p>
                </div>
              </div>
              
              {/* Map container */}
              <div className="bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)] border border-gray-200 overflow-hidden min-h-[240px] flex-grow w-full">
                <iframe
                  src="https://www.google.com/maps?q=Kochi,Kerala&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  title="Office Location Map"
                />
              </div>
            </div>
            
            {/* Right Column: Form Container */}
            <div className="bg-[var(--color-sub-bg)] p-6 sm:p-8 rounded-[var(--radius-sm)] w-full border border-gray-200 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">Send us a message</h2>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="paragraph text-sm text-black font-medium">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className={`paragraph w-full bg-white text-black placeholder-gray-500 rounded-[var(--radius-sm)] px-4 py-3 border focus:outline-none focus:ring-2 transition-colors ${errors.fullName ? "border-red-500 focus:ring-red-500/30" : "border-gray-300 focus:ring-blue-500"}`}
                      />
                      {errors.fullName && <span className="text-xs text-red-400 mt-0.5">{errors.fullName}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="paragraph text-sm text-black font-medium">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                        className={`paragraph w-full bg-white text-black placeholder-gray-500 rounded-[var(--radius-sm)] px-4 py-3 border focus:outline-none focus:ring-2 transition-colors ${errors.company ? "border-red-500 focus:ring-red-500/30" : "border-gray-300 focus:ring-blue-500"}`}
                      />
                      {errors.company && <span className="text-xs text-red-400 mt-0.5">{errors.company}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="paragraph text-sm text-black font-medium">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane@acme.com"
                        className={`paragraph w-full bg-white text-black placeholder-gray-500 rounded-[var(--radius-sm)] px-4 py-3 border focus:outline-none focus:ring-2 transition-colors ${errors.email ? "border-red-500 focus:ring-red-500/30" : "border-gray-300 focus:ring-blue-500"}`}
                      />
                      {errors.email && <span className="text-xs text-red-400 mt-0.5">{errors.email}</span>}
                    </div>
                    
                    {/* Integrated Unified Phone Textbox */}
                    <div className="flex flex-col gap-2">
                      <label className="paragraph text-sm text-black font-medium">Phone Number</label>
                      <div 
                        className={`flex items-center w-full bg-white rounded-[var(--radius-sm)] border transition-colors focus-within:ring-2 ${
                          errors.phone 
                            ? "border-red-500 focus-within:ring-red-500/30" 
                            : "border-gray-300 focus-within:ring-blue-500"
                        }`}
                      >
                        {/* Country Code Dropdown Container (Minimized layout width) */}
                        <div className="relative shrink-0" ref={dropdownRef}>
                          <button
                            type="button"
                            onClick={() => {
                              setIsDropdownOpen(!isDropdownOpen);
                              setSearchQuery("");
                            }}
                            className="paragraph h-full flex items-center justify-between text-black pl-3 pr-1 py-3 bg-transparent focus:outline-none text-sm w-auto max-w-[64px]"
                          >
                            <span className="truncate">{formData.countryCode}</span>
                            <ExpandMoreIcon fontSize="small" className="text-gray-500 shrink-0 ml-0.5" />
                          </button>

                          {/* Dropdown Options List */}
                          {isDropdownOpen && (
                            <div className="absolute left-0 mt-1 w-64 bg-white border border-gray-300 rounded-[var(--radius-sm)] shadow-xl z-50 overflow-hidden paragraph">
                              <div className="p-2 border-b border-gray-200 bg-white">
                                <input
                                  type="text"
                                  placeholder="Search country..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="w-full bg-white text-black text-xs rounded-[var(--radius-sm)] px-2 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                operational />
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                {filteredCountryCodes.length > 0 ? (
                                  filteredCountryCodes.map((item) => (
                                    <button
                                      key={`${item.name}-${item.code}`}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({ ...prev, countryCode: item.code }));
                                        setIsDropdownOpen(false);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm text-black hover:bg-gray-100 transition-colors flex justify-between items-center"
                                    >
                                      <span className="truncate mr-2">{item.name}</span>
                                      <span className="text-gray-500 font-mono text-xs shrink-0">{item.code}</span>
                                    </button>
                                  ))
                                ) : (
                                  <div className="p-3 text-xs text-gray-500 text-center">No results found</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Phone Number Input Field (Expands to occupy full remainder) */}
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 000-0000"
                          className="paragraph min-w-0 flex-1 bg-transparent text-black placeholder-gray-500 pl-2 pr-4 py-3 focus:outline-none"
                        />
                      </div>
                      {errors.phone && <span className="text-xs text-red-400 mt-0.5">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="paragraph text-sm text-black font-medium">Service Interest</label>
                    <div className="relative">
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`paragraph w-full bg-white text-black rounded-[var(--radius-sm)] px-4 py-3 pr-12 border border-gray-300 focus:outline-none focus:ring-2 appearance-none transition-colors ${errors.service ? "border-red-500 focus:ring-red-500/30" : "border-gray-300 focus:ring-blue-500"}`}
                      >
                        <option value="">Select a specialized service...</option>
                        <option value="Strategy">Strategy</option>
                        <option value="Operations">Operations</option>
                        <option value="Digital Transformation">Digital Transformation</option>
                        <option value="Change Management">Change Management</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
                        <ExpandMoreIcon />
                      </div>
                    </div>
                    {errors.service && <span className="text-xs text-red-400 mt-0.5">{errors.service}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="paragraph text-sm text-black font-medium">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project requirements and timelines..."
                      rows={5}
                      className={`paragraph w-full min-h-[120px] bg-white text-black placeholder-gray-500 rounded-[var(--radius-sm)] px-4 py-3 border border-gray-300 resize-none focus:outline-none focus:ring-2 transition-colors ${errors.message ? "border-red-500 focus:ring-red-500/30" : "border-gray-300 focus:ring-blue-500"}`}
                    />
                    {errors.message && <span className="text-xs text-red-400 mt-0.5">{errors.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreePolicy}
                        onChange={(e) => setAgreePolicy(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded-[var(--radius-sm)] border-gray-300 accent-blue-600"
                      />
                      <span className="paragraph text-sm text-gray-700 leading-6">
                        I agree to the{" "}
                        <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline">
                          Privacy Policy
                        </Link>{" "}
                        and consent to Strivo Consultancy storing my information to respond to my inquiry.
                      </span>
                    </label>
                    {errors.agreePolicy && <span className="text-xs text-red-400 ml-7">{errors.agreePolicy}</span>}
                  </div>

                  <motion.button
                    disabled={!agreePolicy}
                    type="submit"
                    whileHover={{ scale: agreePolicy ? 1.01 : 1 }}
                    whileTap={{ scale: agreePolicy ? 0.99 : 1 }}
                    className={`mt-2 py-3 px-6 rounded-[var(--radius-sm)] font-semibold flex items-center justify-center gap-2 w-full transition-colors paragraph ${agreePolicy ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                  >
                    <span>Send Message</span>
                    <SendIcon fontSize="small" />
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="w-full bg-sub py-20 px-6 md:px-16 lg:px-[180px]">
        <div className="max-w-[1440px] mx-auto">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariants}
            className="flex flex-col items-center text-pure-black"
          >
            <div className="text-center mb-10">
              <h2 className="sub-heading text-2xl md:text-3xl mb-3 font-bold">Frequently Asked Questions</h2>
              <p className="paragraph text-sm md:text-base">Quick answers to common inquiries before you reach out.</p>
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
                    backgroundColor: 'var(--color-main-bg)',
                    borderRadius: 'var(--radius-sm)',
                    '&:before': { display: 'none' },
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    mb: '12px',
                    border: '1px solid var(--color-border-color)'
                  }}
                  className="paragraph"
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'var(--color-pure-black)' }} />}
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
                  <AccordionDetails sx={{ px: 3, pb: 3 }} className="paragraph">
                    {faq.a}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default Contact;