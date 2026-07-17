import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import {
  Box,
  Typography
} from '@mui/material';
import {
  AccountTree,
  Settings,      
  AutoGraph,      
  WorkspacePremium, 
} from "@mui/icons-material";
import precisionProcess from '../assets/precisionProcess.jpg'
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { FiArrowLeft } from 'react-icons/fi';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Operations = () => {
  const navigate = useNavigate();
  const AnimatedCounter = ({ target, duration = 1500, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef(null);
    const [hasStarted, setHasStarted] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHasStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
  
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
  
      return () => observer.disconnect();
    }, []);
  
    useEffect(() => {
      if (!hasStarted) return;
  
      let startTime = null;
      const endVal = parseInt(target, 10);
  
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const rate = Math.min(progress / duration, 1);
        const currentCount = Math.floor(rate * endVal);
        setCount(currentCount);
        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          setCount(endVal);
        }
      };
  
      requestAnimationFrame(animate);
    }, [hasStarted, target, duration]);
  
    return <span ref={elementRef}>{count}{suffix}</span>;
  };

  const impactMetrics = [
    {
      value: 40,
      suffix: "%",
      label: "OPERATIONAL EFFICIENCY",
      icon: <Settings sx={{ fontSize: 32 }} />,
    },
    {
      value: 65,
      suffix: "%",
      label: "REVENUE GROWTH",
      icon: <AutoGraph sx={{ fontSize: 32 }} />,
    },
    {
      value: 30,
      suffix: "%",
      label: "TIME REDUCTION",
      icon: <AccountTree sx={{ fontSize: 32 }} />,
    },
    {
      value: 3,
      suffix: "x",
      label: "MARKET EXPANSION",
      icon: <WorkspacePremium sx={{ fontSize: 32 }} />,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-sub">
      
      {/* ========================================================================= */}
      {/* TOP BANNER HERO                                                           */}
      {/* ========================================================================= */}
      <div
        style={{
          backgroundColor: "var(--color-primary)",
          minHeight: "320px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="max-w-[110rem] w-full mx-auto px-4 md:px-12 lg:px-[180px] py-10 text-white"
          style={{
            filter: "drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.2))"
          }}
        >
          {/* Centered on mobile via items-center and text-center md:text-left */}
          <div className="max-w-4xl flex flex-col items-center md:items-start text-center md:text-left">
            <button 
              onClick={() => navigate("/services")} 
              className="text-white/80 hover:text-white transition-colors flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer bg-white/10 hover:bg-white/20 rounded-md px-4 py-1.5 border border-white/20"
            >
              <FiArrowLeft size={16} /> Back to Services
            </button>
            <h1 className="main-heading text-white leading-tight mb-4 text-3xl md:text-4xl lg:text-5xl w-full text-center md:text-left">
              Operations Optimization
            </h1>
            <p className="paragraph text-white/90 max-w-3xl text-sm md:text-base leading-relaxed">
              Optimize business operations by streamlining processes, improving efficiency, and implementing scalable solutions that drive sustainable growth and operational excellence.
            </p>
          </div>
        </motion.section>
      </div>

      {/* ========================================================================= */}
      {/* SECOND SECTION: Enterprise Architecture Card                              */}
      {/* ========================================================================= */}
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-sub py-6 md:py-12 px-4 md:px-12 lg:px-[180px]">
          <div className="max-w-[1440px] mx-auto">
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUpVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 items-stretch bg-white var(--radius-sm) overflow-hidden border border-black/5 shadow-[0_15px_35px_rgba(0,0,0,0.03)]"
            >
              {/* Centered on mobile, left-aligned on desktop */}
              <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
                <h2 className="sub-heading mb-4 text-center lg:text-left w-full">
                  Architecting Operational Excellence
                </h2>
                <p className="paragraph mb-6 leading-relaxed text-sm md:text-base text-gray-700">
                  Organizations thrive when engineering, talent, and workflows move in lockstep. We target structural friction and design high-impact models that scale seamlessly.
                </p>
                
                <Button
                  variant="contained"
                  onClick={() => navigate("/contact")}
                  sx={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-btn-text)",
                    minWidth: "130px",
                    width: "max-content",
                    height: "42px",
                    flexGrow: 0,
                    borderRadius: "var(--radius-sm)",
                    fontWeight: "var(--font-bold)",
                    boxShadow: "var(--shadow-button)",
                    transition: "all var(--transition-speed) ease",
                    textTransform: "none", 
                    "&:hover": {
                      backgroundColor: "var(--color-primary)", 
                      opacity: 0.9,
                    },
                  }}
                >
                  Schedule Consultation
                </Button>
              </div>
              
              <div className="h-64 sm:h-80 lg:h-auto min-h-[250px] relative w-full overflow-hidden order-1 lg:order-2">
                <img 
                  alt="Operational excellence illustration" 
                  className="absolute inset-0 w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJgsChU0yTK8RMWxphON2ie81nOFWArko__RFbW3N21PEAz6C3NM-TE2HiZaWadpaDSCU5KTcVsNBHkqC_u_N5ZQes7-jHfSVtClljZCNcJfYBvrEdcUSHv3W9DNSB8bspImBZJhVh0ZGTk-MPH7SGX4TWVqdbS5jdZ17wsP0hVeswdKJVpjN_AlCFFin7_6VzQWvkE6tVcHOEOsdjdD_PBb4xULhO3BhapOILD1Y6CRoBUnscC65_BnCSpyZLMgZeE_T15vMBXg" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent lg:w-1/4"></div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Section 2: Service Overview */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
          className="w-full bg-sub py-6 md:py-12"
        >
          {/* Centered Section Header */}
          <div className="flex flex-col items-center text-center mb-12 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center border border-[#374151]">
                <svg className="text-[var(--color-white)] w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="pre-heading uppercase tracking-widest">Service Overview</span>
            </div>
            <h2 className="sub-heading text-center">Precision in Every Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="order-2 md:order-1"
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: { xs: "100%", md: "520px", lg: "600px" },
                  mx: "auto",
                }}
              >
                {/* Dotted Pattern */}
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: "-12px", md: "-25px" },
                    left: { xs: "-12px", md: "-25px" },
                    width: { xs: 80, md: 120 },
                    height: { xs: 80, md: 120 },
                    backgroundImage:
                      "radial-gradient(var(--color-primary) 2px, transparent 2px)",
                    backgroundSize: "16px 16px",
                    opacity: 0.15,
                    zIndex: 0,
                  }}
                />

                {/* Blue Background Shape */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: "-12px", md: "-20px" },
                    right: { xs: "-12px", md: "-20px" },
                    width: "80%",
                    height: "80%",
                    background:
                      "radial-gradient(circle, var(--color-primary) 35%, transparent 100%)",
                    borderRadius: "3px",
                    zIndex: 0,
                  }}
                />

                {/* Image */}
                <Box
                  component="img"
                  src={precisionProcess}
                  alt="Business Consulting"
                  sx={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    objectFit: "cover",
                    borderRadius: "3px",
                    position: "relative",
                    zIndex: 2,
                    boxShadow: "0 20px 50px rgba(0,0,0,.15)",
                    transition: ".4s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                />
              </Box>
            </motion.div>
                                    
            {/* Centered on mobile via flex items-center md:items-start text-center md:text-left */}
            <div className="order-1 md:order-2 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
              <ul className="space-y-4 text-left w-full">
                {[
                  { title: 'Process efficiency enhancement', desc: 'Identify and eliminate bottlenecks across your operations.' },
                  { title: 'Operational streamlining', desc: 'Simplify complex workflows for maximum productivity.' },
                  { title: 'Workflow optimization', desc: 'Design data-driven paths for task execution.' },
                  { title: 'Automation opportunities', desc: 'Leverage technology to handle repetitive tasks.' },
                  { title: 'Resource allocation improvements', desc: 'Direct your capital and talent where it matters most.' },
                  { title: 'Performance measurement systems', desc: 'Establish KPIs to monitor ongoing operational health.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="text-[var(--color-primary)] w-6 h-6 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <div>
                      <strong className="text-base text-[var(--color-primary)] block">{item.title}</strong>
                      <span className="paragraph">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Section 7: CTA Banner */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
          className="w-full py-6 md:py-12"
        >
          <div className="bg-main var(--radius-sm) p-12 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6 flex flex-col items-center">
              <h2 className="sub-heading w-full text-center">Ready to Transform Operational Performance?</h2>
              <p className="paragraph text-center">
                Partner with our specialists to optimize workflows and reduce inefficiencies. Engage with us to discuss your immediate challenges.
              </p>
              <Link to="/contact" className="btn inline-flex items-center justify-center text-sm px-8 py-4 mt-4 ">
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Section 3: Core Capabilities / Operations Pillars */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
          className="w-full bg-sub py-6 md:py-12"
        >
          <div className="mb-12 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="sub-heading w-full text-center md:text-left">Operations Pillars</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Supply Chain & Logistics',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
                desc: 'Restructuring logistics frameworks, implementing automated tracking, and predictive inventory management.'
              },
              {
                title: 'Workflow & Automation',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
                desc: 'Identifying redundancies and building streamlined workflows that leverage modern automation tools.'
              },
              {
                title: 'Cost & Waste Reduction',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />,
                desc: 'Analyzing expenditure to uncover opportunities for substantial margin improvement without quality loss.'
              }
            ].map((pillar, idx) => (
              <div key={idx} className="card hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.1)] transition-all duration-200 bg-main text-left">
                <svg className="text-[var(--color-primary)] w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{pillar.icon}</svg>
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">{pillar.title}</h3>
                <p className="paragraph">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Strategic Framework Section */}
      <div className="w-full bg-main py-6 md:py-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUpVariants}
          >
            <div className="text-center flex flex-col items-center justify-center w-full">
              <span className="pre-heading inline-block px-3 py-1 rounded-full bg-white border border-[#374151] uppercase tracking-[3px] mb-4 mx-auto">
                4-Step Optimization Process
              </span>
              <h2 className="sub-heading mb-16 w-full text-center">
                Operations Methodology
              </h2>
              <div className="relative flex flex-col lg:flex-row gap-6 isolate w-full">
                <div className="hidden lg:block absolute top-[48px] left-[10%] right-[10%] h-[2px] bg-[var(--color-primary)] z-0" />

                {[
                  {
                    num: 1,
                    title: 'Operational Audit',
                    items: ['Process Mapping', 'Inefficiency Identification', 'Cost Analysis']
                  },
                  {
                    num: 2,
                    title: 'Solution Design',
                    items: ['Workflow Redesign', 'Automation Planning', 'Resource Allocation']
                  },
                  {
                    num: 3,
                    title: 'Implementation',
                    items: ['System Integration', 'Change Management', 'Training & Rollout']
                  },
                  {
                    num: 4,
                    title: 'Optimization',
                    items: ['Performance Tracking', 'KPI Monitoring', 'Continuous Tuning']
                  }
                ].map((step) => (
                  <div
                    key={step.num}
                    className="card flex-1 min-h-[340px] h-full flex flex-col justify-between relative z-20 bg-sub p-6 border border-gray-100 transition-all duration-200 text-left hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xl font-semibold mb-6 shadow-sm">
                        {step.num}
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4 tracking-tight min-h-[56px] flex items-center">
                        {step.title}
                      </h3>
                    </div>

                    <ul className="space-y-3 flex-grow flex flex-col justify-start">
                      {step.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm paragraph font-medium leading-relaxed">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
      
      {/* Section 8: Final Conversion Banner */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
          className="w-full bg-sub text-center py-6 md:py-12"
        >
          <div className="flex flex-col items-center justify-center">
            <h2 className="sub-heading mb-6 w-full text-center">What Could Operational Efficiency Unlock For Your Business?</h2>
            <p className="paragraph mb-10 max-w-3xl mx-auto text-center">
              The difference between market leaders and followers is relentless optimization. Let’s build your blueprint for tomorrow.
            </p>
            <Link to="/contact" className="btn inline-flex items-center justify-center text-sm px-8 py-4 mt-4 ">
              Contact Our Team
            </Link>
          </div>
        </motion.section>
      </div>
      
      {/* Impact Metrics Section */}
      <Box
        component="section"
        id="impact-metrics-section"
        sx={{
          backgroundColor: "var(--color-main-bg)",
          py: { xs: 6, md: 8 },
          px: { xs: 2, lg: "155px" },
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Box
              component="p"
              className="pre-heading"
              sx={{
                textTransform: "uppercase",
                mb: 1.5,
                textAlign: "center"
              }}
            >
              Proven Results
            </Box>
            <Box
              component="h2"
              className="sub-heading"
              sx={{
                color: "var(--color-primary)",
                mb: 2,
                textAlign: "center"
              }}
            >
              Our Impact Metrics
            </Box>
          </Box>

          {/* Styled Grid Card Container */}
          <Box
            className="card"
            sx={{
              background: "var(--color-primary)",
              p: { xs: 5, md: 7 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: { xs: 4, md: 2 },
              boxShadow: "0 20px 40px rgba(1, 41, 89, 0.15)",
            }}
          >
            {impactMetrics.map((metric, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    right: 0,
                    top: "15%",
                    height: "70%",
                    width: "1px",
                    background: "rgba(255,255,255,0.15)",
                    display: index !== impactMetrics.length - 1 ? { xs: "none", md: "block" } : "none",
                  }
                }}
              >
                {/* Circular Icon Wrapper */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                    color: "#fff",
                  }}
                >
                  {metric.icon}
                </Box>

                {/* Counter Numbers */}
                <Box sx={{ display: "flex", alignItems: "baseline", mb: 0.5 }}>
                  <Box
                    sx={{
                      color: "#fff",
                      fontSize: "2.8rem",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    <AnimatedCounter target={metric.value} />
                  </Box>
                  <Box
                    sx={{
                      color: "#fff",
                      fontSize: "2.8rem",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {metric.suffix}
                  </Box>
                </Box>

                {/* Subtitle / Description */}
                <Box
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {metric.label}
                </Box>
              </Box>
            ))}
          </Box>
        </div>
      </Box>

      {/* Section 6: Strategic Excellence in Action */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
          className="w-full py-6 md:py-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            {/* Added left-aligned internal text alignment but centered layout rules inside responsive mobile classes */}
            <div className="bg-main rounded-[var(--radius-sm)] p-8 flex flex-col justify-between items-center md:items-start text-center md:text-left">
              <div className="w-full flex flex-col items-center md:items-start">
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] border border-[#374151] text-xs font-semibold text-white">Manufacturing</span>
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] border border-[#374151] text-xs font-semibold text-white">Operations</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4 text-center md:text-left w-full">Optimizing Global Supply Chains</h3>
                <p className="paragraph mb-4 text-left"><strong>Challenge:</strong> A multi-national manufacturer faced a 15% margin erosion due to fragmented supply chains and rising geopolitical tensions.</p>
                <p className="paragraph mb-8 text-left"><strong>Solution:</strong> We restructured the core logistics framework, implementing automated tracking and predictive inventory management to drastically reduce bottlenecks.</p>
              </div>
              <Link
                to="/casestudies"
                className="inline-flex items-center gap-2 text-[var(--color-primary)] text-sm font-medium hover:text-[var(--color-primary-hover)] transition-colors group"
              >
                Read Full Case Study
                <ArrowForwardIcon
                  sx={{
                    fontSize: 18,
                    transition: "transform 0.3s ease",
                  }}
                  className="group-hover:translate-x-1"
                />
              </Link>
            </div>
            <div className="bg-main rounded-[var(--radius-sm)] p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
              <div className="absolute inset-0 z-10 pointer-events-none"></div>
              <div className="w-full h-full flex items-end justify-between gap-2 px-4 relative z-0 opacity-50">
                <div className="w-1/6 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-hover)] h-[20%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-hover)] h-[35%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-hover)] h-[45%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-hover)] h-[70%] rounded-t-sm relative"></div>
                <div className="w-1/6 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-hover)] h-[90%] rounded-t-sm relative "></div>
              </div>
              <div className="absolute top-8 left-8 right-8 z-20 text-center">
                <h4 className="text-sm font-medium paragraph mb-1">+60% Efficiency Gain</h4>
                <p className="text-xs font-semibold text-gray-400">Over 36 Months</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

    </div>
  );
};

export default Operations;