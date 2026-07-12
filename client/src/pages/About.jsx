import React from 'react'
import { Box, Card, CardMedia, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

import aboutus from "../assets/about-team.png"
import aboutHeroImg from "../assets/about-hero-illustration.png"
import { motion } from "framer-motion";
import RocketIcon from "@mui/icons-material/RocketLaunch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShieldIcon from "@mui/icons-material/Security";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import leader1 from "../assets/leader1.jpg";
import leader2 from "../assets/leader2.jpg";
import leader3 from "../assets/leader3.jpg";
import leader4 from "../assets/leader4.jpg";


function Aboutus() {
  const navigate = useNavigate();

  const leaders = [
    {
      image: leader1,
      name: "Sarah Jenkins",
      role: "Managing Partner",
      description:
        "20+ years driving global transformation for Fortune 50 firms. Former McKinsey principal.",
    },
    {
      image: leader2,
      name: "David Chen",
      role: "Head of Strategy",
      description:
        "Expert in market entry and M&A integration. Leads the quantitative analysis practice.",
    },
    {
      image: leader3,
      name: "Elena Rodriguez",
      role: "Director of Operations",
      description:
        "Specializes in supply chain optimization and digital process automation for enterprise clients.",
    },
    {
      image: leader4,
      name: "Michael O'Connor",
      role: "Chief Technology Advisor",
      description:
        "Pioneers digital transformation strategies, bridging the gap between IT infrastructure and business goals.",
    },
  ];

  // Animations are now fully handled by framer-motion for smooth 60fps performance


  const featureData = [
    {
      icon: <ShieldIcon sx={{ color: "var(--color-primary)", fontSize: 20 }} />,
      title: "Integrity",
      desc: "Uncompromising honesty in our analysis and advice.",
    },
    {
      icon: <LightbulbIcon sx={{ color: "var(--color-primary)", fontSize: 20 }} />,
      title: "Innovation",
      desc: "Challenging the status quo to find superior solutions.",
    },
    {
      icon: <TrendingUpIcon sx={{ color: "var(--color-primary)", fontSize: 20 }} />,
      title: "Impact",
      desc: "Measuring success exclusively by client outcomes.",
    },
    {
      icon: <GroupIcon sx={{ color: "var(--color-primary)", fontSize: 20 }} />,
      title: "Collaboration",
      desc: "Partnering deeply with clients to ensure lasting capability.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 100,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div>
      <Box
        component="section"
        id="hero-section"
        className="section-padding"
        sx={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-white)",
          height: { xs: "auto", md: "500px" },
          minHeight: { xs: "auto", md: "500px" },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          className="max-w-[110rem] mx-auto px-4 md:px-12 lg:px-[180px]"
          sx={{ width: "100%" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 5, md: 8, lg: 8 },
            }}
          >
            {/* Left Column - Text Content */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  lg: "auto",
                },
                maxWidth: "680px",
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box sx={{ textAlign: "left", width: "100%", maxWidth: "680px" }}>
                  <Box
                     component='h1'
                  className='main-heading text-white'
                  sx={{
                    fontFamily: "var(--font-primary)",
                    letterSpacing: "-0.5px",
                    mb: 2,
                    textAlign: "left",
                  }}
                  >
                    Strategic Thinking
                    <br />
                    Meaningful Impact
                  </Box>

                  <Box
                  component="p"
                  className="main-paragraph"
                  sx={{
                    maxWidth: "700px",
                    mb: 3,
                  }}
                  >
                    We are a passionate team of advisors who believe in the power of true collaboration. By working closely with your teams, we combine deep strategy with real-world execution to build lasting success together.
                  </Box>
                </Box>
              </motion.div>
            </Box>

            {/* Right Column - Hero Illustration */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  lg: "auto",
                },
                display: "flex",
                justifyContent: "center",
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <Box
                  component="img"
                  src={aboutHeroImg}
                  alt="Team Collaboration Illustration"
                  sx={{
                    width: { xs: "100%", lg: "85%" },
                    height: "auto",
                    maxHeight: { xs: "380px", lg: "300px" },
                    objectFit: "contain",
                    objectPosition: { xs: "center", lg: "right" },
                    display: "block",
                  }}
                />
              </motion.div>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* second section  */}
      <Box
        className="section-padding"
        sx={{
          backgroundColor: "var(--color-main-bg)",
          height: { xs: "auto", lg: "600px" },
          minHeight: { xs: "auto", lg: "600px" },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box className="max-w-[110rem] mx-auto px-4 md:px-12 lg:px-[180px]" sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 5, md: 8, lg: 10 },
            }}
          >
            {/* Left Image */}
            <Box
              component={motion.img}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src={aboutus}
              alt="Strivo Professional Team"
              sx={{
                width: {
                  xs: "100%",
                  lg: "40%",
                },
                height: {
                  xs: "300px",
                  sm: "400px",
                  lg: "440px",
                },
                objectFit: "cover",
                borderRadius: "3px",
                transition: "all 0.5s ease",
                "&:hover": {
                  transform: "scale(1.00)",
                },
              }}
            />

            {/* Right Content */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              sx={{
                width: {
                  xs: "100%",
                  lg: "60%",
                },
                maxWidth: "750px",
                color: "var(--color-white)",
                textAlign: "left",
              }}
            >
              <Box
                component="span"
                className="pre-heading"
                sx={{ mb: 2 }}
              >
                Our Story
              </Box>

              <Box
                component="h2"
                className="sub-heading"
                sx={{ mb: 4 }}
              >
                How we work and why we started
              </Box>

              <Box
                component="p"
                className="paragraph"
                sx={{
                  mb: 3,
                  textAlign: "justify",
                  textJustify: "inter-word",
                  hyphens: "auto",
                }}
              >
                Strivo was founded to solve a simple problem: businesses were tired of getting thick slide decks with recommendations that no one knew how to implement. We set out to build a consultancy of actual operators—people who have run companies, scaled products, and managed global teams.
              </Box>

              <Box
                component="p"
                className="paragraph"
                sx={{
                  textAlign: "justify",
                  textJustify: "inter-word",
                  hyphens: "auto",
                }}
              >
                We work directly alongside your leadership and front-line staff to identify real operational issues, simplify workflows, and roll out changes that stick. No templates or generic strategies. Just practical, disciplined problem solving designed to help your business run better and grow faster.
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Who We Are Stats Section */}
      <Box
        component="section"
        className="section-padding"
        sx={{
          backgroundColor: "var(--color-sub-bg)",
          height: { xs: "auto", lg: "600px" },
          minHeight: { xs: "auto", lg: "600px" },
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Box className="max-w-[110rem] mx-auto px-4 md:px-12 lg:px-[180px]" sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 6, md: 8, lg: 10 },
            }}
          >
            {/* Left Column */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              sx={{
                width: {
                  xs: "100%",
                  lg: "45%",
                },
              }}
            >
              <Box
                component="span"
                className="pre-heading"
                sx={{
                  mb: 2,
                  display: "block",
                  textAlign: "left",
                }}
              >
                Who We Are
              </Box>

              <Box
                component="h2"
                className="sub-heading"
                sx={{
                  mb: 4,
                  textAlign: "left",
                  color: "var(--color-primary)",
                }}
              >
                A Team Built on
                <br />
                Passion & Purpose
              </Box>

              <Box
                component="p"
                className="paragraph"
                sx={{
                  mb: 3,
                  textAlign: "justify",
                  textJustify: "inter-word",
                  hyphens: "auto",
                }}
              >
                We are a collective of consultants, strategists, and problem solvers who believe that meaningful impact comes from the right blend of insight, innovation, and integrity.
              </Box>

              <Box
                component="p"
                className="paragraph"
                sx={{
                  mb: 3,
                  textAlign: "justify",
                  textJustify: "inter-word",
                  hyphens: "auto",
                }}
              >
                Since our inception, we have been committed to helping organizations navigate complexity, unlock opportunities, and achieve sustainable growth.
              </Box>

              <Box
                component="p"
                className="paragraph"
                sx={{
                  mb: 0,
                  textAlign: "justify",
                  textJustify: "inter-word",
                  hyphens: "auto",
                }}
              >
                Our team brings together diverse expertise across business strategy, technology, operations, and transformation. Together, we partner with our clients to turn bold ideas into measurable outcomes.
              </Box>
            </Box>

            {/* Right Column - Stats Grid */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              sx={{
                width: {
                  xs: "100%",
                  lg: "50%",
                },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(2, 1fr)" },
                  gap: { xs: 2, sm: 3 },
                  width: "100%",
                }}
              >
                {/* Card 1 */}
                <Box
                  sx={{
                    backgroundColor: "var(--color-white)",
                    p: { xs: 2, sm: 2.5, lg: 3 },
                    borderRadius: "3px",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    textAlign: "left",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1.8rem", sm: "2.4rem", lg: "2.8rem" },
                      fontWeight: 800,
                      color: "var(--color-primary)",
                      mb: 1,
                      lineHeight: 1,
                    }}
                  >
                    25+
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      fontWeight: 700,
                      color: "var(--color-black)",
                      mb: 1,
                    }}
                  >
                    Team Members
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.75rem", lg: "0.82rem" },
                      color: "var(--color-paragraph)",
                      lineHeight: 1.6,
                      textAlign: "justify",
                      textJustify: "inter-word",
                      hyphens: "auto",
                    }}
                  >
                    A multidisciplinary team of experts dedicated to driving your success.
                  </Typography>
                </Box>

                {/* Card 2 */}
                <Box
                  sx={{
                    backgroundColor: "var(--color-white)",
                    p: { xs: 2, sm: 2.5, lg: 3 },
                    borderRadius: "3px",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    textAlign: "left",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1.8rem", sm: "2.4rem", lg: "2.8rem" },
                      fontWeight: 800,
                      color: "var(--color-primary)",
                      mb: 1,
                      lineHeight: 1,
                    }}
                  >
                    8+
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      fontWeight: 700,
                      color: "var(--color-black)",
                      mb: 1,
                    }}
                  >
                    Years Experience
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.75rem", lg: "0.82rem" },
                      color: "var(--color-paragraph)",
                      lineHeight: 1.6,
                      textAlign: "justify",
                      textJustify: "inter-word",
                      hyphens: "auto",
                    }}
                  >
                    Years of collective experience delivering strategies that create real impact.
                  </Typography>
                </Box>

                {/* Card 3 */}
                <Box
                  sx={{
                    backgroundColor: "var(--color-white)",
                    p: { xs: 2, sm: 2.5, lg: 3 },
                    borderRadius: "3px",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    textAlign: "left",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1.8rem", sm: "2.4rem", lg: "2.8rem" },
                      fontWeight: 800,
                      color: "var(--color-primary)",
                      mb: 1,
                      lineHeight: 1,
                    }}
                  >
                    500+
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      fontWeight: 700,
                      color: "var(--color-black)",
                      mb: 1,
                    }}
                  >
                    Projects Delivered
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.75rem", lg: "0.82rem" },
                      color: "var(--color-paragraph)",
                      lineHeight: 1.6,
                      textAlign: "justify",
                      textJustify: "inter-word",
                      hyphens: "auto",
                    }}
                  >
                    Successful projects across industries, focused on delivering measurable business results.
                  </Typography>
                </Box>

                {/* Card 4 */}
                <Box
                  sx={{
                    backgroundColor: "var(--color-white)",
                    p: { xs: 2, sm: 2.5, lg: 3 },
                    borderRadius: "3px",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    textAlign: "left",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1.8rem", sm: "2.4rem", lg: "2.8rem" },
                      fontWeight: 800,
                      color: "var(--color-primary)",
                      mb: 1,
                      lineHeight: 1,
                    }}
                  >
                    100%
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      fontWeight: 700,
                      color: "var(--color-black)",
                      mb: 1,
                    }}
                  >
                    Client Commitment
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.75rem", lg: "0.82rem" },
                      color: "var(--color-paragraph)",
                      lineHeight: 1.6,
                      textAlign: "justify",
                      textJustify: "inter-word",
                      hyphens: "auto",
                    }}
                  >
                    We are committed to our clients' success with integrity, transparency, and excellence.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* third section */}

      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        spacing={4}
        className="section-padding"
        sx={{
          width: "100%",
          background: "var(--color-main-bg)",
        }}
      >
        <Box className="max-w-[110rem] mx-auto px-4 md:px-12 lg:px-[180px]">
          {/* Heading */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Box
              component="span"
              className="pre-heading"
              sx={{
                mb: 1.5,
                display: "block",
                textAlign: "center",
              }}
            >
              What Drives Us
            </Box>
            <Box
              component="h2"
              className="sub-heading"
              sx={{
                textAlign: "center",
                color: "var(--color-primary)",
              }}
            >
              Our Core Values
            </Box>
          </Box>
          {/* TOP SECTION */}
          <Grid container spacing={4} sx={{ margin: { xs: '20px auto', md: '40px auto' }, width: 'auto' }}>
            {/* MISSION */}
            <Grid size={{ xs: 6, md: 8.5 }}>
              <Box
                component={motion.div}
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                onClick={() => navigate("/mission")}
                sx={{
                  bgcolor: "var(--color-white)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                  p: { xs: 2, md: 3 },
                  minHeight: { xs: 170, md: 220 },
                  height: "100%",
                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    borderColor: "var(--color-primary)",
                    boxShadow: "0 20px 40px rgba(1, 42, 89, 0.15)",
                    transform: "translateY(-8px)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    backgroundColor: "var(--color-primary)",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  },
                  "&:hover::after": {
                    transform: "scaleX(1)",
                  },
                  "&:hover .icon-container": {
                    backgroundColor: "var(--color-primary)",
                    borderColor: "var(--color-primary)",
                    transform: "scale(1.1) rotate(5deg)",
                  },
                  "&:hover .icon-container svg": {
                    color: "var(--color-white) !important",
                  }
                }}
              >
                <Box
                  className="icon-container"
                  sx={{
                    width: 40,
                    height: 40,
                    border: "1px solid #e2e8f0",
                    borderRadius: "50%",
                    bgcolor: "rgba(1, 42, 89, 0.05)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                    transition: "all 0.3s ease",
                  }}
                >
                  <RocketLaunchIcon sx={{ color: "var(--color-primary)", transition: "all 0.3s ease" }} />
                </Box>

                <Typography
                  sx={{
                    color: "var(--color-primary)",
                    fontWeight: 700,
                    fontSize: {
                      xs: "1.1rem",
                      md: "1.8rem",
                    },
                    mb: 2,
                  }}
                >
                  Our Mission
                </Typography>

                <Typography
                component='p'
                className='paragraph'
                  sx={{
                    fontSize: {
                      xs: "0.85rem",
                      md: "0.92rem",
                    },
                    maxWidth: "90%",
                    textAlign: "justify",
                    textJustify: "inter-word",
                    hyphens: "auto",
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 3, md: "none" },
                    WebkitBoxOrient: "vertical",
                    overflow: { xs: "hidden", md: "visible" },
                  }}
                >
                  To architect sustainable growth for ambitious enterprises
                  through rigorous data analysis, strategic foresight, and
                  flawless operational execution.
                </Typography>
              </Box>
            </Grid>

            {/* VISION */}
            <Grid size={{ xs: 6, md: 3.5 }}>
              <Box
                component={motion.div}
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                onClick={() => navigate("/vision")}
                sx={{
                  bgcolor: "var(--color-white)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                  p: { xs: 2, md: 3 },
                  minHeight: { xs: 170, md: 220 },
                  height: "100%",
                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    borderColor: "var(--color-primary)",
                    boxShadow: "0 20px 40px rgba(1, 42, 89, 0.15)",
                    transform: "translateY(-8px)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    backgroundColor: "var(--color-primary)",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  },
                  "&:hover::after": {
                    transform: "scaleX(1)",
                  },
                  "&:hover .icon-container": {
                    backgroundColor: "var(--color-primary)",
                    borderColor: "var(--color-primary)",
                    transform: "scale(1.1) rotate(5deg)",
                  },
                  "&:hover .icon-container svg": {
                    color: "var(--color-white) !important",
                  }
                }}
              >
                <Box
                  className="icon-container"
                  sx={{
                    width: 40,
                    height: 40,
                    border: "1px solid #e2e8f0",
                    borderRadius: "50%",
                    bgcolor: "rgba(1, 42, 89, 0.05)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                    transition: "all 0.3s ease",
                  }}
                >
                  <VisibilityIcon sx={{ color: "var(--color-primary)", transition: "all 0.3s ease" }} />
                </Box>

                <Typography
                  sx={{
                    color: "var(--color-primary)",
                    fontWeight: 700,
                    fontSize: {
                      xs: "1.1rem",
                      md: "1.8rem",
                    },
                    mb: 2,
                  }}
                >
                  Our Vision
                </Typography>

                <Typography
                component='p'
                className='paragraph'
                  sx={{
                    fontSize: {
                      xs: "0.85rem",
                      md: "0.92rem",
                    },
                    lineHeight: 1.7,
                    textAlign: "justify",
                    textJustify: "inter-word",
                    hyphens: "auto",
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 3, md: "none" },
                    WebkitBoxOrient: "vertical",
                    overflow: { xs: "hidden", md: "visible" },
                  }}
                >
                  To be the definitive standard for corporate strategic advisory,
                  recognized globally for integrity and impact.
                </Typography>
              </Box>
            </Grid>
          </Grid>


          <Grid container spacing={3} mt={1}>
            {featureData.map((item, index) => (
              <Grid
                key={index}
                size={{
                  xs: 6,
                  sm: 6,
                  md: 3,
                }}
              >
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15,
                  }}
                  onClick={() => navigate(`/values/${item.title.toLowerCase()}`)}
                  sx={{
                    bgcolor: "var(--color-white)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                    p: { xs: 2, md: 3 },
                    minHeight: 170,
                    height: "100%",
                    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      borderColor: "var(--color-primary)",
                      boxShadow: "0 20px 40px rgba(1, 42, 89, 0.15)",
                      transform: "translateY(-8px)",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "4px",
                      backgroundColor: "var(--color-primary)",
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    },
                    "&:hover::after": {
                      transform: "scaleX(1)",
                    },
                    "&:hover .icon-container": {
                      backgroundColor: "var(--color-primary)",
                      borderColor: "var(--color-primary)",
                      transform: "scale(1.1) rotate(5deg)",
                    },
                    "&:hover .icon-container svg": {
                      color: "var(--color-white) !important",
                    }
                  }}
                >
                  <Box
                    className="icon-container"
                    sx={{
                      width: 40,
                      height: 40,
                      border: "1px solid #e2e8f0",
                      borderRadius: "50%",
                      bgcolor: "rgba(1, 42, 89, 0.05)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 2,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      color: "var(--color-primary)",
                      fontWeight: 600,
                      fontSize: { xs: "0.95rem", md: "1.1rem" },
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                  component='p'
                  className='paragraph'
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      textAlign: "justify",
                      textJustify: "inter-word",
                      hyphens: "auto",
                      display: "-webkit-box",
                      WebkitLineClamp: { xs: 3, md: "none" },
                      WebkitBoxOrient: "vertical",
                      overflow: { xs: "hidden", md: "visible" },
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* fourth section */}
      <Box
        className="section-padding"
        sx={{
          backgroundColor: "var(--color-sub-bg)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <Box className="max-w-[110rem] mx-auto px-4 md:px-12 lg:px-[180px]">
          {/* Heading */}
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Box
              component="h2"
              className='sub-heading'
              sx={{
                textAlign: 'center',
                mb: 1,
              }}
            >
              Executive Leadership
            </Box>

            <Box
              component="p"
              className='paragraph'
              sx={{
                textAlign: 'center',
                mt: 1,
                mb: 2,
              }}
            >
              Guided by decades of industry experience.
            </Box>
          </Box>

          {/* Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: { xs: 2, sm: 4 },
            }}
          >
            {leaders.map((leader, index) => (
              <Box
                key={index}
                className="card"
                sx={{
                  cursor: "pointer",
                  backgroundColor: "var(--color-main-bg)",
                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  position: "relative",
                  overflow: "hidden",

                  "&:hover": {
                    transform: "translateY(-8px)",
                  },

                  "&:hover img": {
                    transform: "scale(1.08)",
                  },

                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    backgroundColor: "var(--color-primary)",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  },
                  "&:hover::after": {
                    transform: "scaleX(1)",
                  }
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    overflow: "hidden",
                    borderRadius: "4px",
                    height: {
                      xs: 200,
                      sm: 280,
                      md: 320,
                    },
                    mb: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={leader.image}
                    alt={leader.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform .6s ease",
                      display: "block",
                    }}
                  />
                </Box>

                {/* Content */}
                <Typography
                  sx={{
                    color: "var(--color-paragraph)",
                    fontWeight: 700,
                    fontSize: { xs: "14px", sm: "16px" },
                    mb: 0.5,
                  }}
                >
                  {leader.name}
                </Typography>

                <Typography
                  sx={{
                    color: "var(--color-paragraph)",
                    fontSize: { xs: "11px", sm: "13px" },
                    fontWeight: 600,
                    mb: 1.5,
                  }}
                >
                  {leader.role}
                </Typography>

                <Typography
                component='p'
                className='paragraph'
                  sx={{
                    fontSize: { xs: "11px", sm: "13px" },
                    textAlign: "justify",
                    textJustify: "inter-word",
                    hyphens: "auto",
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 3, md: "none" },
                    WebkitBoxOrient: "vertical",
                    overflow: { xs: "hidden", md: "visible" },
                  }}
                >
                  {leader.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* fifth section - How We Work (Vertical Stepper) */}
      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="section-padding"
        sx={{
          backgroundColor: "var(--color-main-bg)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <Box className="max-w-[110rem] mx-auto px-4 md:px-12 lg:px-[180px]">
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Box
              component="span"
              className="pre-heading"
              sx={{
                mb: 1.5,
                display: "block",
                textAlign: "center",
              }}
            >
              Welcome to Strivo Family
            </Box>
            <Box
              component="h2"
              className="sub-heading"
              sx={{
                textAlign: "center",
                mb: 3,
              }}
            >
              How We Work
            </Box>
            <Box
              component="p"
              className="paragraph"
              sx={{
                maxWidth: "680px",
                mx: "auto",
                textAlign: "center",
                color: "var(--color-paragraph)",
                lineHeight: 1.7,
              }}
            >
              We make your business journey simple, transparent, and results-driven. From the first conversation to long-term success, we're with you every step of the way.
            </Box>
          </Box>

          {/* Stepper Container */}
          <Box
            sx={{
              maxWidth: "800px",
              mx: "auto",
              position: "relative",
              pl: { xs: 4, md: 8 },
              "&::before": {
                content: '""',
                position: "absolute",
                left: { xs: "15px", md: "31px" },
                top: 0,
                bottom: 0,
                width: "2px",
                background: "linear-gradient(to bottom, var(--color-primary), var(--color-primary-light, #60a5fa))",
                opacity: 0.3,
              }
            }}
          >
            {/* Step 1 */}
            <Box
              component={motion.div}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              sx={{ position: "relative", mb: 6 }}
            >
              {/* Step Badge */}
              <Box
                component={motion.div}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                sx={{
                  position: "absolute",
                  left: { xs: "-41px", md: "-65px" },
                  top: "0px",
                  width: { xs: "32px", md: "48px" },
                  height: { xs: "32px", md: "48px" },
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", md: "18px" },
                  zIndex: 2,
                }}
              >
                1
              </Box>
              <Box sx={{ pl: 2 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: "var(--font-primary)",
                    fontWeight: 600,
                    fontSize: "1.35rem",
                    color: "var(--color-black)",
                    mb: 1,
                  }}
                >
                  Connect
                </Typography>
                <Typography
                  component="p"
                  className="paragraph"
                  sx={{
                    color: "var(--color-paragraph)",
                    lineHeight: 1.6,
                    fontSize: "var(--text-paragraph)",
                    textAlign: "justify",
                    textJustify: "inter-word",
                    hyphens: "auto",
                  }}
                >
                  We start with an initial conversation to understand your business goals, challenges, and aspirations. Our experts listen closely to align on how we can support your growth.
                </Typography>
              </Box>
            </Box>

            {/* Step 2 */}
            <Box
              component={motion.div}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              sx={{ position: "relative", mb: 6 }}
            >
              {/* Step Badge */}
              <Box
                component={motion.div}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                sx={{
                  position: "absolute",
                  left: { xs: "-41px", md: "-65px" },
                  top: "0px",
                  width: { xs: "32px", md: "48px" },
                  height: { xs: "32px", md: "48px" },
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", md: "18px" },
                  zIndex: 2,
                }}
              >
                2
              </Box>
              <Box sx={{ pl: 2 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: "var(--font-primary)",
                    fontWeight: 600,
                    fontSize: "1.35rem",
                    color: "var(--color-black)",
                    mb: 1,
                  }}
                >
                  Consult
                </Typography>
                <Typography
                  component="p"
                  className="paragraph"
                  sx={{
                    color: "var(--color-paragraph)",
                    lineHeight: 1.6,
                    fontSize: "var(--text-paragraph)",
                    textAlign: "justify",
                    textJustify: "inter-word",
                    hyphens: "auto",
                  }}
                >
                  We dive deep into your operations, market positioning, and workflow structures. Through structured analysis and interviews, we identify bottleneck areas and high-value opportunities.
                </Typography>
              </Box>
            </Box>

            {/* Step 3 */}
            <Box
              component={motion.div}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              sx={{ position: "relative", mb: 6 }}
            >
              {/* Step Badge */}
              <Box
                component={motion.div}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                sx={{
                  position: "absolute",
                  left: { xs: "-41px", md: "-65px" },
                  top: "0px",
                  width: { xs: "32px", md: "48px" },
                  height: { xs: "32px", md: "48px" },
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", md: "18px" },
                  zIndex: 2,
                }}
              >
                3
              </Box>
              <Box sx={{ pl: 2 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: "var(--font-primary)",
                    fontWeight: 600,
                    fontSize: "1.35rem",
                    color: "var(--color-black)",
                    mb: 1,
                  }}
                >
                  Plan
                </Typography>
                <Typography
                  component="p"
                  className="paragraph"
                  sx={{
                    color: "var(--color-paragraph)",
                    lineHeight: 1.6,
                    fontSize: "var(--text-paragraph)",
                    textAlign: "justify",
                    textJustify: "inter-word",
                    hyphens: "auto",
                  }}
                >
                  Our team formulates custom strategic playbooks tailored to your unique scaling needs. We structure action plans, map implementation timelines, and align resource management frameworks.
                </Typography>
              </Box>
            </Box>

            {/* Step 4 */}
            <Box
              component={motion.div}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              sx={{ position: "relative", mb: 6 }}
            >
              {/* Step Badge */}
              <Box
                component={motion.div}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                sx={{
                  position: "absolute",
                  left: { xs: "-41px", md: "-65px" },
                  top: "0px",
                  width: { xs: "32px", md: "48px" },
                  height: { xs: "32px", md: "48px" },
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", md: "18px" },
                  zIndex: 2,
                }}
              >
                4
              </Box>
              <Box sx={{ pl: 2 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: "var(--font-primary)",
                    fontWeight: 600,
                    fontSize: "1.35rem",
                    color: "var(--color-black)",
                    mb: 1,
                  }}
                >
                  Execute
                </Typography>
                <Typography
                  component="p"
                  className="paragraph"
                  sx={{
                    color: "var(--color-paragraph)",
                    lineHeight: 1.6,
                    fontSize: "var(--text-paragraph)",
                    textAlign: "justify",
                    textJustify: "inter-word",
                    hyphens: "auto",
                  }}
                >
                  We work alongside your teams to implement changes. Through active change management, software integrations, and process optimizations, we drive transformation forward.
                </Typography>
              </Box>
            </Box>

            {/* Step 5 */}
            <Box
              component={motion.div}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              sx={{ position: "relative" }}
            >
              {/* Step Badge */}
              <Box
                component={motion.div}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                sx={{
                  position: "absolute",
                  left: { xs: "-41px", md: "-65px" },
                  top: "0px",
                  width: { xs: "32px", md: "48px" },
                  height: { xs: "32px", md: "48px" },
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", md: "18px" },
                  zIndex: 2,
                }}
              >
                5
              </Box>
              <Box sx={{ pl: 2 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: "var(--font-primary)",
                    fontWeight: 600,
                    fontSize: "1.35rem",
                    color: "var(--color-black)",
                    mb: 1,
                  }}
                >
                  Grow
                </Typography>
                <Typography
                  component="p"
                  className="paragraph"
                  sx={{
                    color: "var(--color-paragraph)",
                    lineHeight: 1.6,
                    fontSize: "var(--text-paragraph)",
                    textAlign: "justify",
                    textJustify: "inter-word",
                    hyphens: "auto",
                  }}
                >
                  We continuously measure outcomes, collect performance feedback, and optimize solutions. We maintain ongoing advisory relations to make sure your business continues growing smoothly.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Stepper Footer Action */}
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Box
              component="button"
              onClick={() => navigate("/contact")}
              sx={{
                px: 5,
                py: 2,
                fontSize: "1rem",
                fontWeight: "var(--font-bold)",
                fontFamily: "var(--font-primary)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-primary)",
                color: "var(--color-white)",
                border: "none",
                cursor: "pointer",
                boxShadow: "var(--shadow-button)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "var(--color-primary-hover)",
                  transform: "translateY(-2px)",
                  boxShadow: "var(--shadow-button)",
                },
                "&:active": {
                  transform: "translateY(0)",
                }
              }}
            >
              Get In Touch
            </Box>
          </Box>
        </Box>
      </Box>

    </div>
  )
}

export default Aboutus
