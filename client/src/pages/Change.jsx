import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import {
  AccountTree,
  Settings,
  AutoGraph,
  WorkspacePremium,
  Group,
  ChatOutlined,
  Autorenew
} from "@mui/icons-material";
import changeManagement from '../assets/changeManagement.jpg';
import changeManagementServices from '../assets/changeManagementServices.jpg'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Change = () => {
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
      
      {/* TOP BANNER HERO */}
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
              Change Management
            </h1>
            <p className="paragraph text-white/90 max-w-3xl text-sm md:text-base leading-relaxed">
              Guide organizations through successful transformation with leadership alignment, communication strategies, employee engagement, and sustainable behavioral change.
            </p>
          </div>
        </motion.section>
      </div>
 
      <div className="max-w-[1440px] mx-auto">
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
                <h2 className="sub-heading mb-4">Change Management</h2>
                <p className="paragraph mb-6 leading-relaxed text-sm md:text-base text-gray-700">
                  Help organizations navigate transformation successfully through leadership alignment, communication strategies, employee engagement, and behavioral adoption frameworks.
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
                  alt="Change management, leadership, workforce transformation, organizational alignment"
                  className="absolute inset-0 w-full h-full object-cover"
                  src={changeManagement}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent lg:w-1/4"></div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
 
      {/* Section 2: Service Overview */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
          className="w-full bg-sub py-6 md:py-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden flex items-center justify-center p-8">
              <img
                alt="Change management services overview"
                className="object-contain w-full h-full opacity-90 drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                src={changeManagementServices}
              />
            </div>
            
            <div className="order-1 md:order-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center border border-[#374151]">
                  <svg className="text-[var(--color-white)] w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="pre-heading uppercase tracking-widest">Service Overview</span>
              </div>
              <h2 className="sub-heading">Change Management Services</h2>
              <ul className="space-y-4">
                {[
                  { title: 'Organizational Change Strategy', desc: 'Define the vision, roadmap, and stakeholder path for change.' },
                  { title: 'Leadership Alignment Programs', desc: 'Build unified leadership commitment and change sponsorship.' },
                  { title: 'Employee Adoption Frameworks', desc: 'Create the structure that turns new ways of working into habit.' },
                  { title: 'Communication Planning', desc: 'Deliver clarity, momentum, and confidence through every stage.' },
                  { title: 'Stakeholder Engagement', desc: 'Align critical audiences with the transformation agenda.' },
                  { title: 'Change Readiness Assessment', desc: 'Measure readiness, risk, and adoption readiness across your teams.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="text-[var(--color-primary)] w-6 h-6 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
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
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
          className="w-full py-6 md:py-12"
        >
          <div className="bg-main rounded-[var(--radius-sm)] p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="sub-heading">Ready to Lead Organizational Change Successfully?</h2>
              <p className="paragraph">
                Drive adoption, strengthen leadership alignment, and create sustainable transformation across your organization.
              </p>
              <Link to="/contact" className="btn inline-flex items-center justify-center text-sm px-8 py-4 mt-4 ">
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
      

      {/* Section 3: Change Pillars */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
          className="w-full bg-sub py-6 md:py-12"
        >
          <div className="mb-12">
            <h2 className="sub-heading">Change Pillars</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Group className="text-[var(--color-primary)] w-8 h-8 mb-4" />,
                title: 'Leadership Alignment',
                desc: 'Unify leaders around change goals, decisions, and accountabilities.'
              },
              {
                icon: <ChatOutlined className="text-[var(--color-primary)] w-8 h-8 mb-4" />,
                title: 'Communication & Adoption',
                desc: 'Create clarity through targeted, high-impact change communications.'
              },
              {
                icon: <Autorenew className="text-[var(--color-primary)] w-8 h-8 mb-4" />,
                title: 'Behavior Change',
                desc: 'Drive new habits with training, coaching, and reinforcement loops.'
              }
            ].map((cap, idx) => (
              <div key={idx} className="card hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.1)] transition-all duration-200 bg-main p-6 rounded-lg border border-gray-100">
                {cap.icon}
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">{cap.title}</h3>
                <p className="paragraph">{cap.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
      

      {/* Section 4: Change Methodology */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
          className="w-full bg-sub py-6 md:py-12"
        >
          <div className="text-center">
            <span className="pre-heading inline-block px-3 py-1 rounded-full bg-white border border-[#374151] uppercase tracking-[3px] mb-4">4-Step Optimization Process</span>
            <h2 className="sub-heading mb-16">Change Methodology</h2>
            <div className="relative flex flex-col lg:flex-row gap-6 isolate">
              <div className="hidden lg:block absolute top-[48px] left-[10%] right-[10%] h-[2px] bg-[var(--color-primary)] z-0" />
              {[
                { num: 1, title: 'Change Readiness Assessment', items: ['Stakeholder analysis', 'Risk scanning', 'Cultural indicators'] },
                { num: 2, title: 'Leadership & Communication Design', items: ['Sponsor coalitions', 'Strategic narrative', 'Feedback loops'] },
                { num: 3, title: 'Adoption & Training Rollout', items: ['Upskilling paths', 'Super-user networks', 'Iterative delivery'] },
                { num: 4, title: 'Sustainment & Measurement', items: ['KPI monitoring', 'Behavior reinforcement', 'Value optimization'] }
              ].map((step) => (
                <div
                  key={step.num}
                  className="card flex-1 min-h-[340px] h-full flex flex-col justify-between relative z-20 bg-main p-6 border border-gray-100 transition-all duration-200 text-left hover:-translate-y-1 hover:shadow-lg"
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

      {/* Section 8: Final Conversion Banner */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[180px]">
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
          className="w-full bg-sub text-center py-6 md:py-12"
        >
          <div>
            <h2 className="sub-heading mb-6">What Could Change Momentum Unlock For Your Business?</h2>
            <p className="paragraph mb-10 max-w-3xl mx-auto">
              Strong change management turns strategy into results. Let’s build the adoption roadmap that keeps your transformation moving.
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
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
          className="w-full py-6 md:py-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            <div className="bg-main rounded-[var(--radius-sm)] p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] border border-[#374151] text-xs font-semibold text-white">Manufacturing</span>
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] border border-[#374151] text-xs font-semibold text-white">Operations</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4">Change Management Case Study</h3>
                <p className="paragraph mb-4"><strong>Challenge:</strong> A multinational firm was struggling to get teams aligned on a major enterprise transformation, leaving adoption stalled and productivity under pressure.</p>
                <p className="paragraph mb-8"><strong>Solution:</strong> We activated a leadership alignment program, a role-based communication plan, and behavior reinforcement rituals that accelerated adoption and freed critical teams to deliver value faster.</p>
              </div>
              <Link to="/casestudies" className="inline-flex items-center gap-2 text-[var(--color-primary)] text-sm font-medium hover:text-[var(--color-primary-hover)] transition-colors group">
                Read Full Case Study
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            
            <div className="bg-[#111111] border border-[#222222] rounded-[var(--radius-sm)] p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent z-10 pointer-events-none"></div>
              <div className="w-full h-full flex items-end justify-between gap-2 px-4 relative z-0 opacity-50">
                <div className="w-1/6 bg-gradient-to-t from-blue-600/20 to-blue-600/5 h-[20%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-blue-600/30 to-blue-600/10 h-[35%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-blue-600/40 to-blue-600/15 h-[45%] rounded-t-sm"></div>
                <div className="w-1/6 bg-[var(--color-primary)]/40 border border-blue-600 h-[70%] rounded-t-sm relative"></div>
                <div className="w-1/6 bg-[var(--color-primary)] h-[90%] rounded-t-sm relative shadow-[0_0_20px_rgba(37,99,235,0.4)]"></div>
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

export default Change;