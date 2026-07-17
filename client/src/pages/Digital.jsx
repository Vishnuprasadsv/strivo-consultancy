import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { AccountTree, Settings, AutoGraph, WorkspacePremium } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import digitalTransformation from '../assets/digitalTransformation.jpg';
import digitalTransformationServices from '../assets/digitalTransformationServices.jpg';
import { FiArrowLeft } from 'react-icons/fi';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

// Pure JSX Counter Component
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

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
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
      setCount(Math.floor(rate * endVal));
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(endVal);
      }
    };

    let animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, target, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
};

const Digital = () => {
  const navigate = useNavigate();

  const impactMetrics = [
    { value: 40, suffix: "%", label: "OPERATIONAL EFFICIENCY", icon: <Settings sx={{ fontSize: 32 }} /> },
    { value: 65, suffix: "%", label: "REVENUE GROWTH", icon: <AutoGraph sx={{ fontSize: 32 }} /> },
    { value: 30, suffix: "%", label: "TIME REDUCTION", icon: <AccountTree sx={{ fontSize: 32 }} /> },
    { value: 3, suffix: "x", label: "MARKET EXPANSION", icon: <WorkspacePremium sx={{ fontSize: 32 }} /> },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-sub">

      {/* TOP BANNER HERO */}
      <div style={{ backgroundColor: "var(--color-primary)", minHeight: "320px", display: "flex", alignItems: "center" }}>
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="max-w-[110rem] w-full mx-auto px-4 md:px-12 lg:px-[180px] py-10 text-white"
          style={{ filter: "drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.2))" }}
        >
          <div className="max-w-4xl flex flex-col items-center text-center md:items-start md:text-left">
            <button
              onClick={() => navigate("/services")}
              className="text-white/80 hover:text-white transition-colors flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer bg-white/10 hover:bg-white/20 rounded-md px-4 py-1.5 border border-white/20"
            >
              <FiArrowLeft size={16} /> Back to Services
            </button>
            <h1 className="main-heading text-white leading-tight mb-4 text-3xl md:text-4xl lg:text-5xl">
              Digital Transformation
            </h1>
            <p className="paragraph text-white/90 max-w-3xl text-sm md:text-base leading-relaxed">
              Accelerate innovation through technology modernization, cloud transformation, automation, data intelligence, and digital customer experiences.
            </p>
          </div>
        </motion.section>
      </div>

      {/* ENTERPRISE ARCHITECTURE */}
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-sub py-6 md:py-12 px-4 md:px-12 lg:px-[180px]">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 items-stretch bg-white var(--radius-sm) overflow-hidden border border-black/5 shadow-[0_15px_35px_rgba(0,0,0,0.03)]"
          >
            {/* Added items-center text-center logic for mobile screens */}
            <div className="p-6 sm:p-10 md:p-12 flex flex-col items-center text-center lg:items-start lg:text-left justify-center order-2 lg:order-1">
              <h2 className="sub-heading mb-4">Architecting Digital Excellence</h2>
              <p className="paragraph mb-6 leading-relaxed text-sm md:text-base text-gray-700">
                Modernize infrastructure, streamline business channels, and empower workforce productivity. We optimize structural codebases and scale custom systems seamlessly.
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
                  borderRadius: "var(--radius-sm)",
                  fontWeight: "var(--font-bold)",
                  boxShadow: "var(--shadow-button)",
                  transition: "all var(--transition-speed) ease",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "var(--color-primary)", opacity: 0.9 },
                }}
              >
                Schedule Consultation
              </Button>
            </div>
            <div className="h-64 sm:h-80 lg:h-auto min-h-[250px] relative w-full overflow-hidden order-1 lg:order-2">
              <img
                alt="Enterprise technology transformation illustration"
                className="absolute inset-0 w-full h-full object-cover"
                src={digitalTransformation}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent lg:w-1/4"></div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* SERVICE OVERVIEW */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
          className="w-full bg-sub py-6 md:py-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 md:order-1"
            >
              <Box sx={{ position: "relative", width: "100%", maxWidth: { xs: "100%", md: "520px", lg: "600px" }, mx: "auto" }}>
                <Box sx={{ position: "absolute", top: { xs: "-12px", md: "-25px" }, left: { xs: "-12px", md: "-25px" }, width: { xs: 80, md: 120 }, height: { xs: 80, md: 120 }, backgroundImage: "radial-gradient(var(--color-primary) 2px, transparent 2px)", backgroundSize: "16px 16px", opacity: 0.15, zIndex: 0 }} />
                <Box sx={{ position: "absolute", bottom: { xs: "-12px", md: "-20px" }, right: { xs: "-12px", md: "-20px" }, width: "80%", height: "80%", background: "radial-gradient(circle, var(--color-primary) 35%, transparent 100%)", borderRadius: "3px", zIndex: 0 }} />
                <Box component="img" src={digitalTransformationServices} alt="Business Consulting" sx={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: "3px", position: "relative", zIndex: 2, boxShadow: "0 20px 50px rgba(0,0,0,.15)", transition: ".4s ease", "&:hover": { transform: "scale(1.02)" } }} />
              </Box>
            </motion.div>
            
            {/* Added flex layout centering for headers and text elements on mobile */}
            <div className="order-1 md:order-2 flex flex-col items-center text-center md:items-start md:text-left space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center border border-[#374151]">
                  <svg className="text-[var(--color-white)] w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="pre-heading uppercase tracking-widest text-sm font-medium">Service Overview</span>
              </div>
              <h2 className="sub-heading">Digital Transformation Services</h2>
              <ul className="space-y-4 text-left w-full">
                {[
                  { title: 'Enterprise Modernization', desc: 'Modernize legacy systems and processes with scalable digital foundations.' },
                  { title: 'Cloud Transformation', desc: 'Migrate critical workloads and enable secure, flexible infrastructure.' },
                  { title: 'Digital Customer Experience', desc: 'Create seamless, personalized journeys across every engagement channel.' },
                  { title: 'Process Automation', desc: 'Use intelligent automation to reduce manual effort and increase speed.' },
                  { title: 'Data-Driven Decision Making', desc: 'Turn operational and customer data into measurable strategic insight.' },
                  { title: 'Technology Enablement', desc: 'Equip teams with the tools and governance needed to scale innovation.' }
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

      {/* DIGITAL PILLARS */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
          className="w-full bg-sub py-6 md:py-12"
        >
          {/* Added text-center logic for mobile heading */}
          <div className="mb-12 text-center md:text-left">
            <h2 className="sub-heading">Digital Pillars</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Customer Experience', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />, desc: 'Design connected, intuitive journeys that elevate loyalty and retention.' },
              { title: 'Cloud & Infrastructure', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />, desc: 'Build a secure, scalable base that supports rapid change and resilience.' },
              { title: 'Data & Analytics', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />, desc: 'Use data to uncover opportunities, improve decisions, and drive growth.' }
            ].map((pillar, idx) => (
              /* Added flex alignment inside cards for centering content on mobile viewports */
              <div key={idx} className="card flex flex-col items-center text-center md:items-start md:text-left hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.1)] transition-all duration-200 bg-main p-6 rounded-[var(--radius-sm)]">
                <svg className="text-[var(--color-primary)] w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{pillar.icon}</svg>
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">{pillar.title}</h3>
                <p className="paragraph">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* STRATEGIC FRAMEWORK METHODOLOGY */}
      <div className="w-full bg-main py-6 md:py-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]">
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}>
            <div className="text-center">
              <span className="pre-heading inline-block px-3 py-1 rounded-full bg-white border border-[#374151] uppercase tracking-[3px] mb-4">4-Step Digital Process</span>
              <h2 className="sub-heading mb-16">Digital Methodology</h2>
              <div className="relative flex flex-col lg:flex-row gap-6 isolate">
                <div className="hidden lg:block absolute top-[48px] left-[10%] right-[10%] h-[2px] bg-[var(--color-primary)] z-0" />
                {[
                  { num: 1, title: 'Digital Audit', items: ['Current-state assessment', 'Capability mapping', 'Opportunity prioritization'] },
                  { num: 2, title: 'Solution Design', items: ['Roadmap planning', 'Architecture alignment', 'Technology selection'] },
                  { num: 3, title: 'Implementation', items: ['Platform rollout', 'Change enablement', 'Team training'] },
                  { num: 4, title: 'Optimization', items: ['Performance measurement', 'Innovation tracking', 'Continuous improvement'] }
                ].map((step) => (
                  /* Modified step layouts to structure perfectly on mobile views */
                  <div key={step.num} className="card flex-1 min-h-[340px] h-full flex flex-col justify-between relative z-20 bg-sub p-6 border border-gray-100 transition-all duration-200 text-center md:text-left items-center md:items-start hover:-translate-y-1 hover:shadow-lg rounded-[var(--radius-sm)]">
                    <div className="flex flex-col items-center md:items-start w-full">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xl font-semibold mb-6 shadow-sm">{step.num}</div>
                      <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4 tracking-tight min-h-[56px] flex items-center">{step.title}</h3>
                    </div>
                    <ul className="space-y-3 flex-grow flex flex-col justify-start text-left w-full">
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

      {/* IMPACT METRICS */}
      <Box component="section" id="impact-metrics-section" sx={{ backgroundColor: "var(--color-main-bg)", py: { xs: 6, md: 8 }, px: { xs: 2, lg: "155px" } }}>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Box component="p" className="pre-heading" sx={{ textTransform: "uppercase", mb: 1.5 }}>Proven Results</Box>
            <Box component="h2" className="sub-heading" sx={{ color: "var(--color-primary)", mb: 2 }}>Our Impact Metrics</Box>
          </Box>
          <Box className="card" sx={{ background: "var(--color-primary)", p: { xs: 5, md: 7 }, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: { xs: 4, md: 2 }, boxShadow: "0 20px 40px rgba(1, 41, 89, 0.15)", borderRadius: "var(--radius-sm)" }}>
            {impactMetrics.map((metric, index) => (
              <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", "&::after": { content: '""', position: "absolute", right: 0, top: "15%", height: "70%", width: "1px", background: "rgba(255,255,255,0.15)", display: index !== impactMetrics.length - 1 ? { xs: "none", md: "block" } : "none" } }}>
                <Box sx={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyCntent: "center", mb: 2.5, color: "#fff" }}>
                  {metric.icon}
                </Box>
                <Box sx={{ display: "flex", alignItems: "baseline", mb: 0.5 }}>
                  <Box sx={{ color: "#fff", fontSize: "2.8rem", fontWeight: 700, lineHeight: 1 }}><AnimatedCounter target={metric.value} /></Box>
                  <Box sx={{ color: "#fff", fontSize: "2.8rem", fontWeight: 700, lineHeight: 1 }}>{metric.suffix}</Box>
                </Box>
                <Box sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>{metric.label}</Box>
              </Box>
            ))}
          </Box>
        </div>
      </Box>

      {/* CASE STUDY PORTFOLIO */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]">
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants} className="w-full py-6 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            {/* Added dynamic flex layouts below to center content blocks during mobile adjustments */}
            <div className="bg-main rounded-[var(--radius-sm)] p-8 flex flex-col justify-between items-center text-center md:items-start md:text-left border border-black/5">
              <div className="flex flex-col items-center md:items-start w-full">
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-xs font-semibold text-white">Digital</span>
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-xs font-semibold text-white">Transformation</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4">Digital Transformation Case Study</h3>
                <p className="paragraph mb-4"><strong>Challenge:</strong> A multi-national manufacturer faced a 15% margin erosion due to fragmented supply chains and rising geopolitical tensions.</p>
                <p className="paragraph mb-8"><strong>Solution:</strong> We architected a 5-year nearshoring strategy, integrating advanced analytics to identify key vulnerabilities and establishing a resilient, cost-effective operating model.</p>
              </div>
              <Link to="/casestudies" className="inline-flex items-center gap-2 text-[var(--color-primary)] text-sm font-medium hover:text-[var(--color-primary-hover)] transition-colors group">
                Read Full Case Study <ArrowForwardIcon sx={{ fontSize: 18, transition: "transform 0.3s ease" }} className="group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="bg-main rounded-[var(--radius-sm)] p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden border border-black/5">
              <div className="w-full h-full flex items-end justify-between gap-2 px-4 relative z-0 opacity-50">
                <div className="w-1/6 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-hover)] h-[30%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-hover)] h-[45%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-hover)] h-[40%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-hover)] h-[65%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-hover)] h-[85%] rounded-t-sm"></div>
              </div>
              <div className="absolute top-8 left-8 right-8 z-20 text-center md:text-left">
                <h4 className="text-sm font-medium paragraph mb-1">+42% Efficiency Gain</h4>
                <p className="text-xs font-semibold text-gray-400">Over 36 Months</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* FINAL CONVERSION BANNER */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
          className="w-full bg-sub text-center py-6 md:py-12"
        >
          <div className="bg-main rounded-[var(--radius-sm)] p-12 text-center relative overflow-hidden border border-black/5 shadow-[0_15px_35px_rgba(0,0,0,0.02)]">
            <h2 className="sub-heading mb-6">What Could Digital Clarity Unlock For Your Business?</h2>
            <p className="paragraph mb-10 max-w-3xl mx-auto">
              The right digital strategy can transform operations, elevate customer experience, and create lasting momentum. Let's build your blueprint for tomorrow.
            </p>
            <Link to="/contact" className="btn inline-flex items-center justify-center text-sm px-8 py-4 mt-4 bg-[var(--color-primary)] text-white rounded-[var(--radius-sm)] font-medium hover:opacity-90 transition-all">
              Contact Our Team
            </Link>
          </div>
        </motion.section>
      </div>

    </div>
  );
};

export default Digital;