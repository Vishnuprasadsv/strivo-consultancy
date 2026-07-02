import React, { useState, useEffect, useRef } from "react";
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
import { Link } from "react-router-dom";
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
// Comprehensive list of country codes (featuring India first)
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
    countryCode: "+91", // Default to India (+91)
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [agreePolicy, setAgreePolicy] = useState(false);

  // State for searchable country code dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  // Close country code dropdown when clicking outside
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
      // Allow only numbers, spaces, dashes, parentheses, and plus signs
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Required Field Validations
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.service) {
      newErrors.service = "Please select a service interest";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty";
    }
    if (!agreePolicy) {
      newErrors.agreePolicy =
        "Please accept the Privacy Policy before submitting.";
    }
    // Block submission and set errors if validation fails
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Clear errors and proceed to submit
    setErrors({});
    try {
      // Combine country code & phone number for payload submission
      const submissionData = {
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
      };
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/inquiries`,
        submissionData
      );
      alert("Inquiry submitted successfully!");
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
      alert("Failed to submit inquiry.");
    }
  };
  // Filter country codes list based on search query
  const filteredCountryCodes = countryCodes.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.includes(searchQuery)
  );
  return (
    <div className="flex flex-col min-h-screen font-sans overflow-hidden bg-main-bg">
      {/* Wrapper for Sections 1 & 2 */}
      <div className="w-full  pt-12 pb-24 flex-grow">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32">
          {/* Section 1: Hero */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-pure-black"
          >
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-pure-black">Let's Start a Conversation</h1>
              <p className="text-pure-black text-lg leading-relaxed max-w-lg">
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
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-medium">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className={`w-full bg-[#334155] text-white rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 transition-colors ${errors.fullName
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-gray-600/50 focus:ring-blue-500"
                        }`}
                    />
                    {errors.fullName && (
                      <span className="text-xs text-red-400 mt-0.5">{errors.fullName}</span>
                    )}
                  </div>
                  {/* Company */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-medium">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Corp"
                      className={`w-full bg-[#334155] text-white rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 transition-colors ${errors.company
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-gray-600/50 focus:ring-blue-500"
                        }`}
                    />
                    {errors.company && (
                      <span className="text-xs text-red-400 mt-0.5">{errors.company}</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email Address */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-medium">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@acme.com"
                      className={`w-full bg-[#334155] text-white rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 transition-colors ${errors.email
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-gray-600/50 focus:ring-blue-500"
                        }`}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-400 mt-0.5">{errors.email}</span>
                    )}
                  </div>
                  {/* Phone Number with Searchable Country Code Dropdown */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-300 font-medium">Phone Number</label>
                    <div className="flex items-center gap-2 w-full">
                      {/* Searchable Dropdown Container (Configured small - w-20) */}
                      <div className="relative w-[72px] flex-shrink-0" ref={dropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(!isDropdownOpen);
                            setSearchQuery(""); // Clear search on open
                          }}
                          className="w-full flex items-center justify-between bg-[#334155] text-white rounded-lg pl-3 pr-1.5 py-3 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer text-left text-sm"
                        >
                          <span className="truncate">{formData.countryCode}</span>
                          <ExpandMoreIcon fontSize="small" className="text-gray-400 shrink-0 ml-0.5" />
                        </button>

                        {/* Search Menu Panel (Floating dropdown menu) */}
                        {isDropdownOpen && (
                          <div className="absolute left-0 mt-1 w-64 bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                            {/* Search Box */}
                            <div className="p-2 border-b border-gray-700 bg-[#1e293b]">
                              <input
                                type="text"
                                placeholder="Search country..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#334155] text-white text-xs rounded px-2 py-1.5 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>

                            {/* Scrollable Results List */}
                            <div className="max-h-48 overflow-y-auto">
                              {filteredCountryCodes.length > 0 ? (
                                filteredCountryCodes.map((item) => (
                                  <button
                                    key={`${item.name}-${item.code}`}
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        countryCode: item.code,
                                      }));
                                      setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-[#334155] transition-colors flex justify-between items-center cursor-pointer"
                                  >
                                    <span className="truncate mr-2">{item.name}</span>
                                    <span className="text-gray-400 font-mono text-xs shrink-0">{item.code}</span>
                                  </button>
                                ))
                              ) : (
                                <div className="p-3 text-xs text-gray-500 text-center">
                                  No results found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Phone Input Field (Configured wide - flex-1) */}
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 000-0000"
                        className={`
    min-w-0
    flex-1
    bg-[#334155]
    text-white
    rounded-lg
    px-4
    py-3
    border
    focus:outline-none
    focus:ring-2
    transition-colors
    ${errors.phone
                            ? "border-red-500/50 focus:ring-red-500/30"
                            : "border-gray-600/50 focus:ring-blue-500"
                          }
  `}
                      />
                    </div>
                    {errors.phone && (
                      <span className="text-xs text-red-400 mt-0.5">{errors.phone}</span>
                    )}
                  </div>
                </div>
                {/* Service Interest */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300 font-medium">Service Interest</label>
                  <div className="relative">
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={`w-full bg-[#334155] text-white rounded-lg px-4 py-3 pr-12 border focus:outline-none focus:ring-2 appearance-none transition-colors ${errors.service
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-gray-600/50 focus:ring-blue-500"
                        }`}
                    >
                      <option value="">Select a specialized service...</option>
                      <option value="Strategy">Strategy</option>
                      <option value="Operations">Operations</option>
                      <option value="Digital Transformation">Digital Transformation</option>
                      <option value="Change Management">Change Management</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                      <ExpandMoreIcon />
                    </div>
                  </div>
                  {errors.service && (
                    <span className="text-xs text-red-400 mt-0.5">{errors.service}</span>
                  )}
                </div>
                {/* Message */}
                <div className="flex flex-col gap-2 flex-grow">
                  <label className="text-sm text-gray-300 font-medium">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project requirements and timelines..."
                    rows={6}
                    className={`w-full min-h-[150px] bg-[#334155] text-white placeholder-gray-400 rounded-lg px-4 py-3 border resize-none focus:outline-none focus:ring-2 transition-colors ${errors.message
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-gray-600/50 focus:ring-blue-500"
                      }`}
                  />
                  {errors.message && (
                    <span className="text-xs text-red-400 mt-0.5">{errors.message}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreePolicy}
                      onChange={(e) => setAgreePolicy(e.target.checked)}
                      className="
      mt-1
      h-4
      w-4
      rounded
      border-gray-500
      accent-blue-600
      cursor-pointer
      "
                    />

                    <span className="text-sm text-gray-300 leading-6">
                      I agree to the{" "}
                      <Link
                        to="/privacy-policy"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        Privacy Policy
                      </Link>{" "}
                      and consent to Strivo Consultancy storing my information to respond to my inquiry.
                    </span>
                  </label>

                  {errors.agreePolicy && (
                    <span className="text-xs text-red-400 ml-7">
                      {errors.agreePolicy}
                    </span>
                  )}
                </div>
                <motion.button
                  disabled={!agreePolicy}
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
mt-4
py-3
px-6
rounded-lg
font-semibold
flex items-center
justify-center
gap-2
w-full
transition-colors

${agreePolicy
                      ? "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
                      : "bg-gray-600 cursor-not-allowed text-gray-300"}
`}
                >
                  Send Message
                  <SendIcon fontSize="small" />
                </motion.button>
              </form>
            </div>
          </motion.section>
        </div>
      </div>
      {/* FAQ Accordion Section */}
      <div className="w-full bg-sub-bg py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariants}
            className="flex flex-col items-center text-pure-black"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
              <p className="text-pure-black">Quick answers to common inquiries before you reach out.</p>
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
                    color: 'var(--color-pure-black)',
                    borderRadius: '8px !important',
                    '&:before': { display: 'none' },
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    mb: '12px',
                    border: '1px solid var(--color-border-color)'
                  }}
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
                  <AccordionDetails sx={{ px: 3, pb: 3, color: 'var(--color-pure-black)', lineHeight: 1.6 }}>
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