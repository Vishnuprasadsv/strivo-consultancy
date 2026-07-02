import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Rating,
  Dialog,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from '../Components/SEO';
import { SERVER_URL } from '../services/serverUrl';
import homeHero from "../assets/herohome1.jpg";
import leader1 from "../assets/leader1.jpg";
import leader2 from "../assets/leader2.jpg";
import leader3 from "../assets/leader3.jpg";
import leader4 from "../assets/leader4.jpg";
import aboutus from "../assets/aboutus.jpg";
import {
  AccountTree,
  Settings,
  AutoGraph,
  Groups,
  WorkspacePremium,
  ArrowForward,
} from "@mui/icons-material";

import heroBg from "../assets/heroBg.jpeg";
import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Pagination,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import Ready from '../Components/Ready';

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

function Home() {
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const testimonials = [
    {
      name: "John Smith",
      role: "CEO, HexaTech Solutions",
      image: leader1,
      review:
        "Their strategic approach and deep industry expertise helped us streamline operations and achieve a 40% improvement in efficiency.",
    },
    {
      name: "Sarah Johnson",
      role: "CTO, AlphaVista Enterprises",
      image: leader2,
      review:
        "The transformation roadmap delivered by their team resulted in a 65% increase in our revenue within just 12 months.",
    },
    {
      name: "Michael Brown",
      role: "COO, Nexora Industries",
      image: leader3,
      review:
        "Exceptional partnership and unmatched commitment to our success. They exceeded our expectations at every step.",
    },
    {
      name: "David Wilson",
      role: "VP, QuantumLeap Labs",
      image: leader4,
      review:
        "Their digital transformation consulting was a game-changer. We achieved a 30% reduction in processing times.",
    },
    {
      name: "Emily Rodriguez",
      role: "Director, Zentric Ventures",
      image: leader1,
      review:
        "Outstanding collaboration! Their team delivered a measurable business impact and helped us expand into 3 new markets.",
    },
    {
      name: "Priya Nair",
      role: "Director, InnovaTech Labs",
      image: leader2,
      review:
        "From day one, they brought clarity, structure, and a results-first mindset that accelerated our digital transformation journey.",
    },
  ];

  const highlightReview = (text) => {
    if (!text) return "";
    const highlights = [
      { phrase: "40% improvement", color: "#3b82f6" },
      { phrase: "65% increase in our revenue", color: "#3b82f6" },
      { phrase: "exceeded our expectations", color: "#3b82f6" },
      { phrase: "30% reduction", color: "#3b82f6" },
      { phrase: "measurable business impact", color: "#3b82f6" },
      { phrase: "digital transformation", color: "#3b82f6" }
    ];
    let result = text;
    highlights.forEach(({ phrase, color }) => {
      const escaped = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      result = result.replace(regex, `<span style="color: ${color}; font-weight: 700;">$1</span>`);
    });
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const CompanyAvatar = ({ company }) => {
    let logoColor = "#10b981";
    let logoSvg = null;
    const nameLower = company?.toLowerCase() || "";

    if (nameLower.includes("hexatech")) {
      logoColor = "#10b981";
      logoSvg = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke={logoColor} strokeWidth="2" fill="none" />
          <path d="M12 6l6 3v6l-6 3-6-3V9l6-3z" fill={logoColor} opacity="0.3" />
          <circle cx="12" cy="12" r="2" fill={logoColor} />
        </svg>
      );
    } else if (nameLower.includes("alphavista")) {
      logoColor = "#2563eb";
      logoSvg = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 3L3 21h18L12 3z" stroke={logoColor} strokeWidth="2" fill="none" />
          <path d="M12 8l5 10H7l5-10z" fill={logoColor} opacity="0.3" />
        </svg>
      );
    } else if (nameLower.includes("nexora")) {
      logoColor = "#f97316";
      logoSvg = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={logoColor} strokeWidth="2" />
          <path d="M12 6L17 11V16L12 13L7 16V11L12 6Z" fill={logoColor} />
        </svg>
      );
    } else if (nameLower.includes("quantumleap")) {
      logoColor = "#a855f7";
      logoSvg = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={logoColor} strokeWidth="2" />
          <path d="M12 8v8M8 12h8" stroke={logoColor} strokeWidth="2" />
        </svg>
      );
    } else if (nameLower.includes("zentric")) {
      logoColor = "#06b6d4";
      logoSvg = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke={logoColor} strokeWidth="2" />
          <path d="M9 7h6v2l-4 6h4" stroke={logoColor} strokeWidth="2" />
        </svg>
      );
    } else {
      logoColor = "#ec4899";
      logoSvg = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l10 10-10 10L2 12z" stroke={logoColor} strokeWidth="2" />
        </svg>
      );
    }

    const shortName = company?.split(" ")[0] || "";
    const isAlphaVista = nameLower.includes("alphavista");

    return (
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: isAlphaVista ? "#ffffff" : "#050c18",
          border: isAlphaVista ? "1.5px solid #2563eb" : "1px solid rgba(255, 255, 255, 0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 0.5,
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          flexShrink: 0
        }}
      >
        {isAlphaVista ? (
          <>
            <Typography sx={{ fontSize: "1.2rem", color: "#2563eb", fontWeight: 900, lineHeight: 1, fontFamily: "'Inter', sans-serif" }}>
              A
            </Typography>
            <Typography sx={{ fontSize: "0.42rem", color: "#1e293b", fontWeight: 700, mt: -0.1, lineHeight: 1 }}>
              AlphaVista
            </Typography>
          </>
        ) : (
          <>
            {logoSvg}
            <Typography
              sx={{
                fontSize: "0.52rem",
                color: "#fff",
                fontWeight: 700,
                mt: 0.2,
                lineHeight: 1,
                letterSpacing: "0.1px",
                textAlign: "center",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {shortName}
            </Typography>
          </>
        )}
      </Box>
    );
  };

  const renderAvatar = (item) => {
    const roleLower = item.role?.toLowerCase() || "";
    const nameLower = item.name?.toLowerCase() || "";

    if (roleLower.includes("hexatech") || nameLower.includes("smith")) {
      return <CompanyAvatar company="HexaTech" />;
    }
    if (roleLower.includes("alphavista") || nameLower.includes("johnson")) {
      return <CompanyAvatar company="AlphaVista" />;
    }
    if (roleLower.includes("nexora") || nameLower.includes("brown")) {
      return <CompanyAvatar company="Nexora" />;
    }
    if (roleLower.includes("quantumleap") || nameLower.includes("wilson")) {
      return <CompanyAvatar company="QuantumLeap" />;
    }
    if (roleLower.includes("zentric") || nameLower.includes("rodriguez")) {
      return <CompanyAvatar company="Zentric" />;
    }
    if (roleLower.includes("innovatech") || nameLower.includes("nair")) {
      return <CompanyAvatar company="InnovaTech" />;
    }

    if (item.image) {
      return (
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1.5px solid rgba(59,130,246,0.4)",
            flexShrink: 0
          }}
        />
      );
    }

    return <CompanyAvatar company={item.role || "Client"} />;
  };

  const companyLogos = [
    {
      name: "HexaTech",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" />
          <path d="M12 6L6 9.5V14.5L12 18L18 14.5V9.5L12 6Z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      )
    },
    {
      name: "AlphaVista",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3L3 21H21L12 3Z" />
          <path d="M12 9L7.5 18H16.5L12 9Z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      )
    },
    {
      name: "NEXORA",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L3 7L12 12L21 7L12 2Z" />
          <path d="M3 17L12 22L21 17" />
          <path d="M3 12L12 17L21 12" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      name: "QuantumLeap",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7V17M7 12H17" />
          <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
        </svg>
      )
    },
    {
      name: "ZENTRIC",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 8H17L10 16H17" />
        </svg>
      )
    },
    {
      name: "InnovaTech",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" />
          <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 12 18 12 18C12 18 16 12.21 16 10C16 7.79 14.21 6 12 6Z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      )
    }
  ];
  const services = [
    {
      icon: <AccountTree sx={{ color: "#3b82f6" }} />,
      title: "Strategic Planning",
      description:
        "Aligning vision with actionable roadmaps to secure long-term competitive advantage.",
    },
    {
      icon: <Settings sx={{ color: "#3b82f6" }} />,
      title: "Operations Optimization",
      description:
        "Streamlining processes to enhance efficiency, reduce costs, and scale effectively.",
    },
    {
      icon: <AutoGraph sx={{ color: "#3b82f6" }} />,
      title: "Digital Transformation",
      description:
        "Modernizing technology stacks to drive agility and unlock new revenue streams.",
    },
    {
      icon: <Groups sx={{ color: "#3b82f6" }} />,
      title: "Change Management",
      description:
        "Guiding organizations through complex transitions with minimal disruption.",
    },
  ];


  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
  };
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const companies = [
    "Acme Corp",
    "GlobalTech",
    "Nexus",
    "Stratos",
    "Apex",
    "Vertex",
    "Vision",
  ];

  const stats = [
    {
      value: 500,
      suffix: "+",
      label: "PROJECTS COMPLETED",
    },
    {
      value: 200,
      suffix: "+",
      label: "CLIENTS SERVED",
    },
    {
      value: 15,
      suffix: "",
      label: "INDUSTRIES",
    },
    {
      value: 98,
      suffix: "%",
      label: "SUCCESS RATE",
    },
  ];


  const [successStories, setSuccessStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/success-stories`);
        const data = await response.json();
        if (data && data.length > 0) {
          // Map backend data to frontend expected format, filtering out invalid dummy database data
          const formattedData = data
            .filter(story => story.name && story.clientStories && story.name.trim().length > 3 && !story.name.toLowerCase().includes("sdfg"))
            .map(story => ({
              name: story.name,
              role: story.position || "Client",
              image: story.imageUrl,
              review: story.clientStories
            }));

          // Merge backend stories with custom high-quality testimonials to ensure we have enough slides
          const combined = [...formattedData];
          testimonials.forEach(t => {
            if (!combined.some(c => c.name.toLowerCase() === t.name.toLowerCase())) {
              combined.push(t);
            }
          });
          setSuccessStories(combined);
        } else {
          setSuccessStories(testimonials); // Fallback
        }
      } catch (error) {
        console.error('Error fetching success stories:', error);
        setSuccessStories(testimonials); // Fallback
      } finally {
        setLoadingStories(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <div>
      <SEO
        title="Home"
        description="We partner with ambitious leaders to solve complex challenges, optimize operations, and drive sustainable growth in an ever-evolving global landscape."
      />
      <Box
        component="section"
        id="hero-section"
        sx={{
          position: "relative",
          minHeight: { xs: "auto", lg: "calc(100vh - 80px)" },
          py: { xs: 6, lg: 0 },
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "var(--color-black)",
        }}
      >
        {/* Decorative Radial Glow */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            width: { xs: "500px", md: "800px" },
            height: { xs: "500px", md: "800px" },
            background: "radial-gradient(circle, rgba(37,99,235,0.08), transparent 75%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Main Content */}

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1.15fr 0.85fr",
              },
              alignItems: "center",
              gap: { xs: 4, lg: 6 },
            }}
          >
            {/* LEFT CONTENT */}

            <Box>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: "-0.5px",
                    mb: 2,
                    textAlign: "left",
                    fontSize: {
                      xs: "2rem",
                      sm: "2.4rem",
                      md: "2.6rem",
                      lg: "2.8rem",
                    },
                  }}
                >
                  Empowering Enterprise Growth
                  <br />
                  through Strategic Innovation
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.6,
                }}
              >
                <Typography
                  sx={{
                    color: "#cbd5e1",
                    lineHeight: 1.7,
                    maxWidth: "520px",
                    mb: 3,
                    fontSize: {
                      xs: "0.85rem",
                      md: "0.92rem",
                    },
                  }}
                >
                  We partner with ambitious leaders to solve complex challenges, optimize operations, and drive sustainable growth in an ever-evolving global landscape.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4,
                  duration: 0.6,
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                >
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/contact")}
                      sx={{
                        px: 3.5,
                        py: 1.2,
                        borderRadius: "3px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        background: "#4764FF",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        boxShadow: "0 8px 20px rgba(71, 100, 255, 0.3)",
                        "&:hover": {
                          background: "#3b55d9",
                          boxShadow: "0 12px 25px rgba(71, 100, 255, 0.4)",
                        },
                        transition: "all 0.3s ease",
                        width: { xs: "100%", sm: "auto" }
                      }}
                    >
                      Contact Us
                      <ArrowForward sx={{ fontSize: "1rem" }} />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/about")}
                      sx={{
                        px: 3.5,
                        py: 1.2,
                        borderRadius: "3px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color: "#fff",
                        borderColor: "rgba(255, 255, 255, 0.25)",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.08)",
                          borderColor: "#3b82f6",
                        },
                        transition: "all 0.3s ease",
                        width: { xs: "100%", sm: "auto" }
                      }}
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </Stack>
              </motion.div>
            </Box>

            {/* RIGHT IMAGE */}

            <Box
              sx={{
                display: {
                  xs: "none",
                  lg: "block",
                },
                position: "relative",
                maxHeight: "360px",
                width: "100%",
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  x: 30,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.8,
                }}
              >
                <Box
                  component="img"
                  src={homeHero}
                  alt="Meeting"
                  sx={{
                    width: "100%",
                    height: "340px",
                    borderRadius: "16px",
                    boxShadow: "0 20px 50px rgba(0,0,0,.55)",
                    objectFit: "cover",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    transition: "all .5s ease",
                    "&:hover": {
                      transform: "scale(1.01)",
                    },
                  }}
                />
              </motion.div>

              {/* Floating Glassmorphic Badge */}

              <motion.div
                animate={{
                  y: [0, -8, 0],
                  boxShadow: [
                    "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0px rgba(37, 99, 235, 0)",
                    "0 15px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(37, 99, 235, 0.25)",
                    "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0px rgba(37, 99, 235, 0)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  left: "-10px",
                  zIndex: 3,
                  borderRadius: "16px"
                }}
              >
                <Box
                  sx={{
                    background: "rgba(10, 17, 32, 0.85)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(59, 130, 246, 0.25)",
                    borderRadius: "16px",
                    p: "16px 20px",
                    minWidth: "210px",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    textAlign: "left"
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      background: "rgba(37, 99, 235, 0.12)",
                      border: "1px solid rgba(37, 99, 235, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3b82f6",
                    }}
                  >
                    <WorkspacePremium sx={{ fontSize: "1.3rem" }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.3rem", lineHeight: 1.1 }}>
                      15+
                    </Typography>
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", mt: 0.5, fontWeight: 500, letterSpacing: "0.5px" }}>
                      Years Experience
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Animated downward arrow below hero image */}
      <Box
        sx={{
          backgroundColor: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 2.5,
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
        }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ cursor: "pointer" }}
          onClick={() => {
            const targetElement = document.getElementById("stats-section");
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </Box>

      {/* second section */}
      <Box
        component="section"
        id="stats-section"
        sx={{
          backgroundColor: "var(--color-main-bg)",
          py: { xs: 8, lg: 12.5 },
          minHeight: { xs: "auto", lg: "100vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* TRUSTED BY SECTION */}

        <Container maxWidth="xl">
          <Box
            sx={{
              borderTop: "1px solid rgba(0,0,0,0.06)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              py: 4,
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                color: "var(--color-pure-black)",
                letterSpacing: "3px",
                fontWeight: 600,
                mb: 6,
              }}
            >
              TRUSTED BY INDUSTRY LEADERS
            </Typography>

            <motion.div
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 6, md: 10 },
                  width: "max-content",
                }}
              >
                {[...companies, ...companies].map(
                  (company, index) => (
                    <Typography
                      key={index}
                      sx={{
                        color: "#94a3b8",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        transition: ".4s",
                        fontSize: {
                          xs: "1.2rem",
                          md: "1.8rem",
                        },

                        "&:hover": {
                          color: "#0f172a",
                        },
                      }}
                    >
                      {company}
                    </Typography>
                  )
                )}
              </Box>
            </motion.div>
          </Box>
        </Container>

        {/* STATS SECTION */}

        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: 4, lg: 6 },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2,1fr)",
                lg: "repeat(4,1fr)",
              },
              gap: { xs: 2, sm: 4 },
            }}
          >
            {stats.map((item, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 60,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                }}
              >
                <Box
                  sx={{
                    background: "#f8fafc",
                    border: "1px solid rgba(37,99,235,0.08)",
                    borderRadius: "24px",
                    p: { xs: 2.5, sm: 3, md: 3.5 },
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all .4s ease",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.02)",

                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      background:
                        "linear-gradient(90deg,#2563eb,transparent)",
                    },

                    "&:hover": {
                      transform: "translateY(-12px)",
                      background: "#ffffff",
                      border: "1px solid rgba(37,99,235,0.2)",
                      boxShadow: "0 20px 40px rgba(37,99,235,0.08)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#2563eb",
                      mb: 1,
                      lineHeight: 1,
                      fontSize: {
                        xs: "2rem",
                        md: "2.6rem",
                      },
                    }}
                  >
                    {item.value}
                    {item.suffix}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#475569",
                      letterSpacing: "2px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      fontSize: {
                        xs: "0.75rem",
                        md: "0.85rem",
                      },
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>
      {/*  third section */}
      <Box
        component="section"
        id="expertise-section"
        sx={{
          backgroundColor: "var(--color-sub-bg)",
          py: { xs: 8, lg: 12.5 },
          minHeight: { xs: "auto", lg: "100vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="lg">
          {/* Heading */}

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
            }}
          >
            <Typography
              sx={{
                color: "var(--color-pure-black)",
                textAlign: "center",
                fontWeight: 700,
                mb: 2,
                fontSize: {
                  xs: "1.8rem",
                  md: "2.2rem",
                },
              }}
            >
              Our Core Expertise
            </Typography>

            <Typography
              sx={{
                color: "var(--color-pure-black)",
                textAlign: "center",
                maxWidth: "700px",
                mx: "auto",
                mb: 8,
                lineHeight: 1.8,
                fontSize: {
                  xs: "0.9rem",
                  md: "0.95rem",
                },
              }}
            >
              Comprehensive solutions designed to elevate
              your enterprise across every critical
              dimension.
            </Typography>
          </motion.div>

          {/* Cards */}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2,1fr)",
                  lg: "repeat(4,1fr)",
                },
                gap: { xs: 2, sm: 4 },
              }}
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.01,
                  }}
                  style={{ height: "100%" }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      background:
                        // "linear-gradient(145deg,#081224,#0f172a)",
                        "var(--color-main-bg)",
                      borderRadius: "3px",
                      p: { xs: 2, sm: 3, md: 3 },
                      minHeight: { xs: "230px", md: "240px" },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      border:
                        "1px solid rgba(59,130,246,.12)",
                      transition: ".4s ease",

                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "2px",
                        background:
                          "linear-gradient(90deg,#2563eb,transparent)",
                      },

                      "&:hover": {
                        border:
                          "1px solid rgba(59,130,246,.4)",
                        boxShadow:
                          "0 20px 50px rgba(37,99,235,.18)",
                      },
                    }}
                  >
                    {/* Glow */}

                    <Box
                      sx={{
                        position: "absolute",
                        width: "180px",
                        height: "180px",
                        background:
                          "radial-gradient(circle, rgba(37,99,235,.18), transparent)",
                        top: "-70px",
                        right: "-70px",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Icon */}

                    <Box
                      sx={{
                        width: { xs: 44, md: 60 },
                        height: { xs: 44, md: 60 },
                        borderRadius: "16px",
                        background:
                          "rgba(37,99,235,.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: { xs: 2, md: 3 },
                      }}
                    >
                      {service.icon}
                    </Box>

                    {/* Title */}

                    <Typography
                      sx={{
                        color: "var(--color-pure-black)",
                        fontWeight: 700,
                        mb: { xs: 1, md: 2 },
                        fontSize: { xs: "1rem", md: "1.25rem" },
                      }}
                    >
                      {service.title}
                    </Typography>

                    {/* Description */}

                    <Typography
                      sx={{
                        color: "var(--color-pure-black)",
                        lineHeight: { xs: 1.45, md: 1.8 },
                        fontSize: { xs: "0.8rem", md: "0.95rem" },
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>
      <Box
        component="section"
        id="trust-section"
        sx={{
          backgroundColor: "var(--color-main-bg)",
          py: { xs: 8, lg: 12.5 },
          minHeight: { xs: "auto", lg: "100vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Glow */}
        <Box
          sx={{
            position: "absolute",
            top: "-200px",
            right: "-150px",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(37,99,235,.06), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6, lg: 8 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1.1fr 0.9fr",
              },
              gap: { xs: 4, md: 6, lg: 8 },
              alignItems: "center",
            }}
          >
            {/* LEFT CONTENT */}
            <motion.div
              initial={{
                opacity: 0,
                y: 60,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#2563eb",
                  fontWeight: 900,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  mb: 2,
                  fontSize: "18px",
                }}
              >
                Why Clients Trust Us
              </Typography>

              <Typography
                sx={{
                  color: "#0f172a",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  mb: 4,
                  maxWidth: "700px",
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.2rem",
                    lg: "2.5rem",
                  },
                }}
              >
                Building Long-Term Partnerships Through Proven Results
              </Typography>

              <Typography
                sx={{
                  color: "#475569",
                  lineHeight: 1.8,
                  mb: 3,
                  fontSize: {
                    xs: "0.9rem",
                    md: "0.95rem",
                  },
                }}
              >
                For more than 15 years, we have partnered with
                organizations across industries to solve complex
                business challenges, improve operational performance,
                and accelerate sustainable growth.
              </Typography>

              <Typography
                sx={{
                  color: "#475569",
                  lineHeight: 1.8,
                  mb: 3,
                  fontSize: {
                    xs: "0.9rem",
                    md: "0.95rem",
                  },
                }}
              >
                Our consultants combine strategic insight, industry
                expertise, and data-driven decision-making to deliver
                solutions that create measurable business impact.
              </Typography>

              <Typography
                sx={{
                  color: "#475569",
                  lineHeight: 1.7,
                  fontSize: {
                    xs: "0.9rem",
                    md: "0.95rem",
                  },
                }}
              >
                Every engagement is tailored to the unique goals of
                our clients, ensuring practical, scalable, and
                results-oriented outcomes that drive long-term success.
              </Typography>

              {/* Bottom Metrics */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 4, md: 6 },
                  mt: 5,
                }}
              >
                {[
                  { value: 500, suffix: "+", label: "Projects" },
                  { value: 200, suffix: "+", label: "Clients" },
                  { value: 98, suffix: "%", label: "Success Rate" },
                ].map((item, index) => (
                  <Box key={index}>
                    <Typography
                      sx={{
                        color: "var(--color-btn-bg)",
                        fontWeight: 800,
                        fontSize: {
                          xs: "1.8rem",
                          md: "2.5rem",
                        },
                      }}
                    >
                      <AnimatedCounter target={item.value} suffix={item.suffix} />
                    </Typography>

                    <Typography
                      sx={{
                        color: "var(--color-pure-black)",
                        fontWeight: 700,
                        letterSpacing: "2px"
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{
                opacity: 0,
                x: 80,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  maxWidth: "600px",
                  ml: "auto",
                  width: "100%",
                }}
              >
                {/* Glow */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "250px",
                    height: "250px",
                    background:
                      "radial-gradient(circle, rgba(37,99,235,.25), transparent)",
                    top: "-50px",
                    right: "-50px",
                    zIndex: 0,
                  }}
                />

                {/* Main Image */}
                <Box
                  component="img"
                  src={aboutus}
                  alt="Business Consulting"
                  sx={{
                    width: "100%",
                    height: { xs: "auto", md: "380px", lg: "420px" },
                    borderRadius: "3px",
                    position: "relative",
                    zIndex: 2,
                    objectFit: "cover",
                    boxShadow:
                      "0 20px 50px rgba(0,0,0,.15)",
                    transition: ".5s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                />
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>
      {/* Client Success Stories Section */}
      <Box
        component="section"
        id="testimonials-section"
        sx={{
          backgroundColor: "var(--color-sub-bg)",
          py: { xs: 8, lg: 12.5 },
          minHeight: { xs: "auto", lg: "100vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <Container maxWidth="lg">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              sx={{
                color: "var(--color-pure-black)",
                textAlign: "center",
                fontWeight: 900,
                fontSize: "0.95rem",
                letterSpacing: "3px",
                textTransform: "uppercase",
                mb: 1.5,
              }}
            >
              Client Success Stories
            </Typography>

            <Typography
              sx={{
                color: "var(--color-pure-black)",
                textAlign: "center",
                fontWeight: 900,
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                mb: 2,
                lineHeight: 1.1,
              }}
            >
              Real Results. Real Impact.
            </Typography>

            <Typography
              sx={{
                color: "var(--color-pure-black)",
                textAlign: "center",
                maxWidth: "550px",
                mx: "auto",
                mb: 8,
                lineHeight: 1.7,
                fontSize: "0.98rem"
              }}
            >
              See how we've helped leading organizations overcome challenges, drive growth, and achieve measurable results.
            </Typography>
          </motion.div>

          {/* Swiper Slider Wrapper with Custom Nav Buttons */}
          {loadingStories ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </Box>
          ) : (
            <Box sx={{ position: "relative", px: { xs: 0, md: 6 } }}>

              {/* Custom Navigation - Left Arrow */}
              <Box
                onClick={() => swiperRef.current?.slidePrev()}
                sx={{
                  position: "absolute",
                  left: { xs: "-10px", md: "-40px" },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--color-btn-bg)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#ffffff",
                  fontSize: "1.2rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(37, 99, 235, 0.2)",
                    borderColor: "#3b82f6",
                  },
                }}
              >
                ←
              </Box>

              {/* Custom Navigation - Right Arrow */}
              <Box
                onClick={() => swiperRef.current?.slideNext()}
                sx={{
                  position: "absolute",
                  right: { xs: "-10px", md: "-40px" },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--color-btn-bg)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#ffffff",
                  fontSize: "1.2rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(37, 99, 235, 0.2)",
                    borderColor: "#3b82f6",
                  },
                }}
              >
                →
              </Box>

              <Swiper
                modules={[Pagination, Autoplay]}
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
                slidesPerView={1}
                spaceBetween={24}
                loop={true}
                centeredSlides={true}
                speed={800}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  el: ".custom-swiper-pagination"
                }}
                breakpoints={{
                  0: {
                    slidesPerView: 2,
                    spaceBetween: 12,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                }}
                style={{
                  paddingBottom: "50px",
                  paddingTop: "30px"
                }}
              >
                {successStories.map((item, index) => (
                  <SwiperSlide key={index} style={{ height: "auto" }}>
                    {({ isActive }) => (
                      <Box
                        onClick={() => setSelectedTestimonial(item)}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          background: "linear-gradient(145deg, #fcfcfc, #EDF0FF)",
                          border: "1px solid rgba(0, 0, 0, 0.15)",
                          borderRadius: "3px",
                          p: { xs: 2.5, md: 3.5 },
                          position: "relative",
                          opacity: 1,
                          transform: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            borderColor: "#2563eb",
                            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.08)",
                          }
                        }}
                      >
                        <Box>
                          {/* Review Text */}
                          <Typography
                            sx={{
                              color: "var(--color-pure-black)",
                              fontSize: { xs: "0.78rem", md: "0.92rem" },
                              lineHeight: { xs: 1.45, md: 1.7 },
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {highlightReview(item.review)}
                          </Typography>

                          {/* Read More Link */}
                          <Typography
                            sx={{
                              color: "#2563eb",
                              fontSize: { xs: "0.72rem", md: "0.82rem" },
                              fontWeight: 600,
                              display: "inline-block",
                              mt: 0.8,
                              "&:hover": { textDecoration: "underline" }
                            }}
                          >
                            ... Read more
                          </Typography>
                        </Box>

                        {/* Client Info Block */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mt: 2,
                            minWidth: 0,
                          }}
                        >
                          {/* Avatar */}
                          {renderAvatar(item)}

                          {/* Meta Data */}
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                              sx={{
                                color: "var(--color-pure-black)",
                                fontWeight: 700,
                                fontSize: { xs: "0.8rem", md: "0.95rem" },
                                lineHeight: 1.2,
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              sx={{
                                color: "var(--color-pure-black)",
                                fontSize: { xs: "0.68rem", md: "0.78rem" },
                                mt: 0.2,
                                mb: 0.5,
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                              }}
                            >
                              {item.role}
                            </Typography>
                            <Rating
                              value={5}
                              readOnly
                              size="small"
                              sx={{
                                fontSize: "0.85rem",
                                "& .MuiRating-iconFilled": {
                                  color: "#f59e0b",
                                }
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Styled Pagination Dots */}
              <Box
                className="custom-swiper-pagination"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  mt: 2,
                  "& .swiper-pagination-bullet": {
                    width: 8,
                    height: 8,
                    backgroundColor: "#4b5563",
                    opacity: 0.5,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  },
                  "& .swiper-pagination-bullet-active": {
                    backgroundColor: "#2563eb",
                    opacity: 1,
                    width: 20,
                    borderRadius: "4px"
                  }
                }}
              />
            </Box>
          )}

          {/* Trusted By Industry Leaders Logo Strip */}
          <Box
            sx={{
              mt: 10,
              pt: 6,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              textAlign: "center"
            }}
          >
            <Typography
              sx={{
                color: "var(--color-pure-black)",
                fontSize: "0.85rem",
                fontWeight: 900,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                mb: 4
              }}
            >
              Trusted by Industry Leaders
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: { xs: 4, md: 8 },
              }}
            >
              {companyLogos.map((company, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "var(--color-pure-black)",
                    transition: "all 0.3s ease",
                    cursor: "default",
                    "&:hover": {
                      color: "#2200ffcc",
                      transform: "scale(1.05)",
                      cursor: "pointer"
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {company.svg}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase"
                    }}
                  >
                    {company.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Testimonial Detail Modal */}
      <Dialog
        open={Boolean(selectedTestimonial)}
        onClose={() => setSelectedTestimonial(null)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-container": {
            backdropFilter: "blur(8px)",
            background: "rgba(0, 0, 0, 0.4)",
          },
          "& .MuiDialog-paper": {
            background: "var(--color-main-bg)",
            color: "var(--color-pure-black)",
            borderRadius: "20px",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
            p: { xs: 3, sm: 4 },
            margin: "16px",
          }
        }}
      >
        {selectedTestimonial && (
          <Box sx={{ position: "relative" }}>
            <Typography
              onClick={() => setSelectedTestimonial(null)}
              sx={{
                position: "absolute",
                top: -5,
                right: -5,
                cursor: "pointer",
                fontSize: "1.6rem",
                color: "#64748b",
                fontWeight: 500,
                lineHeight: 1,
                transition: "color 0.2s",
                "&:hover": { color: "#000" }
              }}
            >
              ×
            </Typography>

            <Typography
              sx={{
                color: "#2563eb",
                fontSize: "3.5rem",
                fontWeight: 900,
                fontFamily: "Georgia, serif",
                lineHeight: 1,
                mt: 0.5,
                mb: 0.5,
                userSelect: "none"
              }}
            >
              “
            </Typography>

            <Typography
              sx={{
                color: "var(--color-pure-black)",
                fontSize: { xs: "0.88rem", sm: "1rem" },
                lineHeight: 1.7,
                mb: 3,
                fontStyle: "italic",
                wordBreak: "break-word",
                overflowWrap: "break-word"
              }}
            >
              {selectedTestimonial.review}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {renderAvatar(selectedTestimonial)}
              <Box>
                <Typography sx={{ color: "var(--color-pure-black)", fontWeight: 700, fontSize: "0.95rem" }}>
                  {selectedTestimonial.name}
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "0.75rem", mt: 0.2 }}>
                  {selectedTestimonial.role}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>

      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: "32px",
              right: "32px",
              zIndex: 1000,
            }}
          >
            <Box
              onClick={() => {
                const target = document.getElementById("hero-section");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "#4764FF",
                boxShadow: "0 8px 25px rgba(71, 100, 255, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "#3b55d9",
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 30px rgba(71, 100, 255, 0.6)",
                },
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Home;