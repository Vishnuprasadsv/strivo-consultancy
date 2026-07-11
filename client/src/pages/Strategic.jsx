
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
import sustainableGrowth from '../assets/sustainableGrowth.jpg'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Strategic = () => {
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
        setCount(Math.floor(rate * endVal));
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
          className="max-w-[110rem] w-full mx-auto px-8 md:px-16 lg:px-[180px] py-10 text-white"
          style={{
            filter: "drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.2))"
          }}
        >
          <div className="max-w-4xl flex flex-col items-start text-left">
            <button 
              onClick={() => navigate("/services")} 
              className="text-white/80 hover:text-white transition-colors flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer bg-white/10 hover:bg-white/20 rounded-md px-4 py-1.5 border border-white/20"
            >
              ← Back to Services
            </button>
            <h1 className="main-heading text-white leading-tight mb-4 text-3xl md:text-4xl lg:text-5xl">
              Strategic Planning
            </h1>
            <p className="paragraph text-white/90 max-w-3xl text-sm md:text-base leading-relaxed">
              Architecting the future of enterprise strategy. We partner with visionary leaders to navigate complexity, define bold directions, and orchestrate execution that guarantees long-term market dominance.
            </p>
          </div>
        </motion.section>
      </div>

      {/* ========================================================================= */}
      {/* SECOND SECTION: Enterprise Architecture                                   */}
      {/* ========================================================================= */}
      <div className="max-w-[1440px] mx-auto">
        {/* Adjusted padding to half */}
        <div className="bg-sub py-6 md:py-12 px-6 md:px-16 lg:px-[180px]">
          <div className="max-w-[1440px] mx-auto">
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUpVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 items-stretch bg-white var(--radius-sm) overflow-hidden border border-black/5 shadow-[0_15px_35px_rgba(0,0,0,0.03)]"
            >
              <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center order-2 lg:order-1">
                <h2 className="sub-heading mb-4">
                  Architecting the Future of Enterprise Strategy
                </h2>
                <p className="paragraph mb-6 leading-relaxed text-sm md:text-base text-gray-700">
                  We partner with visionary leaders to navigate complexity, define bold directions, and orchestrate execution that guarantees sustainable market dominance in an unpredictable global landscape.
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
                  alt="Abstract strategic planning" 
                  className="absolute inset-0 w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwH885Ucg74aW0JQ-tQ_R19jjsVUDbDWzt_rmw6fjRAflkTAWnj3pp44SYvBT6CItG78fZ56GGg-lZvfmJ1MYl-P779LOy7KhXM07RkdI-y-DF592pJBVw5j2h7CcNsyCvROSQEIX6-OPEl-cff306Trl3rX_qAEKob5mhJRicbHpacPmjrUOLinS4xZ9q8fqHQwuuNjGzrjAfBudpy7V0GD8Vf64RJVrGZIG8ePF4Amxwv-9Vp6nHfiZPZrSRhhPjMNOR5Cob5A" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent lg:w-1/4"></div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Section 2: Service Overview */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[180px]">
        {/* Adjusted padding to half */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
          className="w-full bg-sub py-4 md:py-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden flex items-center justify-center p-8">
              <img alt="Strategic Service Overview" className="object-contain w-full h-full opacity-90 drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]" src={sustainableGrowth} />
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center border border-[#374151]">
                  <svg className="text-[var(--color-white)] w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <span className="pre-heading uppercase tracking-widest">Service Overview</span>
              </div>
              <h2 className="sub-heading">The Foundation of Sustainable Growth</h2>
              <ul className="space-y-4">
                {[
                  { title: "Vision alignment", desc: "Synchronize leadership intent with operational reality." },
                  { title: "Market positioning", desc: "Define clear differentiation in crowded ecosystems." },
                  { title: "Long-term planning", desc: "Develop robust 5-to-10-year strategic horizons." },
                  { title: "Risk management", desc: "Proactively identify and mitigate structural threats." },
                  { title: "Growth optimization", desc: "Identify adjacent markets and scalable models." },
                  { title: "Competitive advantage", desc: "Build defensible moats around core business units." }
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
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[180px]">
        {/* Adjusted padding to half */}
        {/* Want Expert Guidance */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
                className="mt-24 bg-main rounded-[var(--radius-sm)] p-8 md:p-12 text-center"
              >
                <h2 className="sub-heading mb-4">Want expert guidance?</h2>
                <p className="max-w-2xl mx-auto mb-8 pragraph">
                  Our global team of consultants helps organizations navigate technical complexity and unlock transformative value through tailored strategic frameworks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/contact" className="btn w-full sm:w-auto px-8 py-3 transition-colors cursor-pointer">
                    Schedule Consultation
                  </Link>
                  <Link to="/insights" className="w-full h-[42px] flex items-center justify-center sm:w-auto bg-transparent border border-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:text-white text-black px-8 py-3 rounded-sm font-black transition-colors text-center cursor-pointer">
                    Explore More Insights
                  </Link>
                </div>
              </motion.div>
      </div>

      {/* Section 3: Core Capabilities */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[180px]">
        {/* Adjusted padding to half */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
          className="w-full bg-sub py-4 md:py-8"
        >
          <div className="mb-12">
            <h2 className="sub-heading">Core Capabilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                title: "Market & Competitive Intelligence",
                desc: "Deep-dive analytics to understand competitor movements, market sizing, and emerging trends to inform strategic bets."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />,
                title: "Corporate Vision & Objective Setting",
                desc: "Facilitating leadership alignment to establish clear, measurable, and inspiring corporate objectives."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
                title: "Long-Term Growth Roadmapping",
                desc: "Structuring sequenced growth initiatives, M&A targets, and organic expansion paths over a multi-year horizon."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                title: "Risk Mitigation & Scenario Planning",
                desc: "Developing resilient strategies against macroeconomic shocks, regulatory changes, and technological disruptions."
              }
            ].map((cap, idx) => (
              <div key={idx} className="card hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.1)] transition-all duration-200 bg-main">
                <svg className="text-[var(--color-primary)] w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{cap.icon}</svg>
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">{cap.title}</h3>
                <p className="paragraph">{cap.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Section 4: The Acumen Strategic Framework */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[180px]">
        {/* Adjusted padding to half */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
          className="w-full bg-sub py-6 md:py-12"
        >
          <div className="text-center">
            <span className="pre-heading inline-block px-3 py-1 rounded-full bg-white border border-[#374151] uppercase tracking-[3px] mb-4">4-Step Strategic Framework</span>
            <h2 className="sub-heading mb-16">The Acumen Strategic Framework</h2>
            <div className="relative flex flex-col lg:flex-row gap-6 isolate">
              <div className="hidden lg:block absolute top-[48px] left-[10%] right-[10%] h-[2px] bg-[var(--color-primary)] z-0" />
              
              {[
                { num: 1, title: "Diagnostic Discovery", items: ["Business Assessment", "Stakeholder Analysis", "Opportunity Identification"] },
                { num: 2, title: "Strategy Architecture", items: ["Vision Development", "Goal Definition", "Strategic Mapping"] },
                { num: 3, title: "Operationalization", items: ["Execution Planning", "Resource Alignment", "KPI Definition"] },
                { num: 4, title: "Governance & Iteration", items: ["Performance Monitoring", "Continuous Improvement", "Strategic Reviews"] }
              ].map((step) => (
                <div 
                  key={step.num} 
                  className="card flex-1 min-h-[340px] h-full flex flex-col justify-between relative z-20 bg-main p-6 border border-gray-100 transition-all duration-200 text-left hover:-translate-y-1 hover:shadow-lg"
                >
                  <div>
                    {/* Step Indicator */}
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xl font-semibold mb-6 shadow-sm">
                      {step.num}
                    </div>
                    
                    {/* Card Title */}
                    <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4 tracking-tight min-h-[56px] flex items-center">
                      {step.title}
                    </h3>
                  </div>

                  {/* Clean Left-Aligned List Content */}
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
      
      {/* Section 8: Final Conversion */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[180px]">
        {/* Adjusted padding to half */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
          className="w-full bg-sub text-center py-4 md:py-8"
        >
          <div>
            <h2 className="sub-heading mb-6">What Could Strategic Clarity Unlock For Your Business?</h2>
            <p className="paragraph mb-10 max-w-3xl mx-auto">
              The difference between market leaders and followers is actionable foresight. Let's build your blueprint for tomorrow.
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
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "2.8rem",
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          <AnimatedCounter target={metric.value} />
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "2.8rem",
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          {metric.suffix}
                        </Typography>
                      </Box>
      
                      {/* Subtitle / Description */}
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        }}
                      >
                        {metric.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </div>
            </Box>
      
      {/* Section 6: Strategic Excellence in Action */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[180px]">
        {/* Adjusted padding to half */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
          className="w-full py-5 md:py-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            <div className="bg-main rounded-[var(--radius-sm)] p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] border border-[#374151] text-xs font-semibold text-white">Manufacturing</span>
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] border border-[#374151] text-xs font-semibold text-white">Transformation</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4">Optimizing Global Supply Chains</h3>
                <p className="paragraph mb-4"><strong>Challenge:</strong> A multi-national manufacturer faced a 15% margin erosion due to fragmented supply chains and rising geopolitical tensions.</p>
                <p className="paragraph mb-8"><strong>Solution:</strong> We architected a 5-year nearshoring strategy, integrating advanced analytics to identify key vulnerabilities and establishing a resilient, cost-effective operating model.</p>
              </div>
              <Link to="/casestudies" className="inline-flex items-center gap-2 text-[var(--color-primary)] text-sm font-medium hover:text-[var(--color-primary-hover)] transition-colors group">
                Read Full Case Study
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="bg-[#111111] border border-[#222222] rounded-[var(--radius-sm)] p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent z-10 pointer-events-none"></div>
              <div className="w-full h-full flex items-end justify-between gap-2 px-4 relative z-0 opacity-50">
                <div className="w-1/6 bg-gradient-to-t from-blue-600/20 to-blue-600/5 h-[30%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-blue-600/30 to-blue-600/10 h-[45%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-blue-600/40 to-blue-600/15 h-[40%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-blue-600/60 to-blue-600/20 h-[65%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-blue-600/80 to-blue-600/30 h-[85%] rounded-t-sm shadow-[0_0_20px_rgba(37,99,235,0.4)]"></div>
              </div>
              <div className="absolute top-8 left-8 right-8 z-20">
                <h4 className="text-sm font-medium text-white mb-1">+42% Efficiency Gain</h4>
                <p className="text-xs font-semibold text-gray-400">Over 36 Months</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

    </div>
  );
};

export default Strategic;