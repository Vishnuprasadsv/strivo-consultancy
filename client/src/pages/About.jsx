import React from 'react'
import { Box, Card, CardMedia, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

import aboutus from "../assets/aboutus.jpg"
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
    icon: <ShieldIcon sx={{ color: "var(--color-blue)", fontSize: 20 }} />,
    title: "Integrity",
    desc: "Uncompromising honesty in our analysis and advice.",
  },
  {
    icon: <LightbulbIcon sx={{ color: "var(--color-blue)", fontSize: 20 }} />,
    title: "Innovation",
    desc: "Challenging the status quo to find superior solutions.",
  },
  {
    icon: <TrendingUpIcon sx={{ color: "var(--color-blue)", fontSize: 20 }} />,
    title: "Impact",
    desc: "Measuring success exclusively by client outcomes.",
  },
  {
    icon: <GroupIcon sx={{ color: "var(--color-blue)", fontSize: 20 }} />,
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
       {/* <Box
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            maxWidth: "1200px",
            mx: "auto",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              lineHeight: 1.1,
              mb: 5,
              letterSpacing: "-1px",
              fontSize: {
                xs: "2.5rem",
                sm: "3.5rem",
                md: "5rem",
                lg: "6rem",
              },
            }}
          >
            Precision Strategy for the Modern Enterprise.
          </Typography>

          <Typography
            sx={{
              color: "#d1d5db",
              maxWidth: "1000px",
              mx: "auto",
              lineHeight: 1.7,
              fontWeight: 400,
              fontSize: {
                xs: "1.1rem",
                sm: "1.3rem",
                md: "1.8rem",
              },
            }}
          >
            We bridge the gap between visionary thinking and operational
            excellence. Discover the story, people, and values that drive our
            relentless pursuit of impact.
          </Typography>
        </Box>
      </Container>
    </Box> */}
    <Box
  sx={{
    backgroundColor: "transparent",
    color: "#fff",
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }}
>
  <Container maxWidth="lg">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {/* Heading */}
        <motion.div variants={itemVariants}>
          <Typography
            sx={{
              fontWeight: 700,
              lineHeight: 1.15,
              mb: 4,
              letterSpacing: "-0.5px",
              fontSize: {
                xs: "2.2rem",
                sm: "2.8rem",
                md: "3.2rem",
                lg: "3.8rem",
              },
            }}
          >
            Precision Strategy for the Modern Enterprise.
          </Typography>
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants}>
          <Typography
            sx={{
              color: "#cbd5e1",
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.75,
              fontWeight: 400,
              fontSize: {
                xs: "0.95rem",
                md: "1.05rem",
              },
            }}
          >
            We bridge the gap between visionary thinking and operational
            excellence. Discover the story, people, and values that drive our
            relentless pursuit of impact.
          </Typography>
        </motion.div>
      </Box>
    </motion.div>
  </Container>
</Box>
    {/* second section  */}
     <Box
  sx={{
    backgroundColor: "var(--color-main-bg)",
    py: { xs: 8, md: 12 },
  }}
>
  <Container maxWidth="xl">
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
        alt="Corporate Boardroom"
        sx={{
          width: {
            xs: "100%",
            lg: "40%",
          },
          height: {
            xs: "300px",
            sm: "400px",
            md: "500px",
          },
          objectFit: "cover",
          borderRadius: "3px",
          boxShadow: "0 12px 12px rgba(0,0,0,0.5)",
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
          color: "#fff",
          textAlign: {
            xs: "center",
            lg: "left",
          },
        }}
      >
        <Typography
          sx={{
            color: "var(--color-pure-black)",
            fontWeight: 900,
            letterSpacing: "3px",
            mb: 2,
            textTransform: "uppercase",
            fontSize: "0.95rem",
          }}
        >
          Our Story
        </Typography>

        <Typography
          sx={{
            fontWeight: 700,
            color: "var(--color-pure-black)",
            mb: 4,
            lineHeight: 1.2,
            fontSize: {
              xs: "1.8rem",
              sm: "2.2rem",
              md: "2.5rem",
            },
          }}
        >
          Architects of Corporate Transformation
        </Typography>

        <Typography
          sx={{
            color: "var(--color-pure-black)",
            mb: 3,
            lineHeight: 1.8,
            fontSize: {
              xs: "0.9rem",
              md: "0.95rem",
            },
          }}
        >
          Founded on the principle that true innovation requires deep
          analytical rigor, our consultancy began as a boutique advisory
          firm for technology pioneers. Today, we are a global partnership
          serving Fortune 500 leaders across industries.
        </Typography>

        <Typography
          sx={{
            color: "var(--color-pure-black)",
            lineHeight: 1.8,
            fontSize: {
              xs: "0.9rem",
              md: "0.95rem",
            },
          }}
        >
          Our journey is defined by a commitment to disciplined analysis,
          strategic thinking, and bold execution. We partner with clients
          to embed new capabilities, drive sustainable growth, and build
          resilient organizations prepared for the future.
        </Typography>
      </Box>
    </Box>
  </Container>
</Box>

    {/* third section */}
    
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      spacing={4}
      sx={{
        width: "100%",
        background:"var(--color-sub-bg)",
          
        py: { xs: 6, md: 10 },
        
      }}
    >
      <Container maxWidth="xl">
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
                bgcolor: "white",
                border: "1px solid #e2e8f0" ,
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
                  borderColor: "#2F6BFF",
                  boxShadow: "0 20px 40px rgba(47, 107, 255, 0.15)",
                  transform: "translateY(-8px)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#2F6BFF",
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                },
                "&:hover::after": {
                  transform: "scaleX(1)",
                },
                "&:hover .icon-container": {
                  backgroundColor: "#2F6BFF",
                  borderColor: "#2F6BFF",
                  transform: "scale(1.1) rotate(5deg)",
                },
                "&:hover .icon-container svg": {
                  color: "#ffffff !important",
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
                  bgcolor: "rgba(47, 107, 255, 0.05)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                  transition: "all 0.3s ease",
                }}
              >
                <RocketLaunchIcon sx={{ color: "var(--color-blue)", transition: "all 0.3s ease" }} />
              </Box>

              <Typography
                sx={{
                  color: "var(--color-pure-black)",
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
                sx={{
                  color: "var(--color-pure-black)",
                  fontSize: {
                    xs: "0.85rem",
                    md: "0.92rem",
                  },
                  lineHeight: 1.7,
                  maxWidth: "90%",
                  textAlign: "left",
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
                bgcolor: "white",
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
                  borderColor: "#2F6BFF",
                  boxShadow: "0 20px 40px rgba(47, 107, 255, 0.15)",
                  transform: "translateY(-8px)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#2F6BFF",
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                },
                "&:hover::after": {
                  transform: "scaleX(1)",
                },
                "&:hover .icon-container": {
                  backgroundColor: "#2F6BFF",
                  borderColor: "#2F6BFF",
                  transform: "scale(1.1) rotate(5deg)",
                },
                "&:hover .icon-container svg": {
                  color: "#ffffff !important",
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
                  bgcolor: "rgba(47, 107, 255, 0.05)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                  transition: "all 0.3s ease",
                }}
              >
                <VisibilityIcon sx={{ color: "var(--color-blue)", transition: "all 0.3s ease" }} />
              </Box>

              <Typography
                sx={{
                  color: "var(--color-pure-black)",
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
                sx={{
                  color: "var(--color-pure-black)",
                  fontSize: {
                    xs: "0.85rem",
                    md: "0.92rem",
                  },
                  lineHeight: 1.7,
                  textAlign: "left",
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
                  bgcolor: "white",
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
                    borderColor: "#2F6BFF",
                    boxShadow: "0 20px 40px rgba(47, 107, 255, 0.15)",
                    transform: "translateY(-8px)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    backgroundColor: "#2F6BFF",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  },
                  "&:hover::after": {
                    transform: "scaleX(1)",
                  },
                  "&:hover .icon-container": {
                    backgroundColor: "#2F6BFF",
                    borderColor: "#2F6BFF",
                    transform: "scale(1.1) rotate(5deg)",
                  },
                  "&:hover .icon-container svg": {
                    color: "#ffffff !important",
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
                    bgcolor: "rgba(47, 107, 255, 0.05)",
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
                    color: "var(--color-pure-black)",
                    fontWeight: 600,
                    fontSize: { xs: "0.95rem", md: "1.1rem" },
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: "var(--color-pure-black)",
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                    lineHeight: 1.7,
                    textAlign: "left",
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
      </Container>
    </Box>

    {/* fourth section */}
      <Box
      sx={{
        backgroundColor: "var(--color-main-bg)",
        py: { xs: 8, md: 12 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1400px",
        }}
      >
        {/* Heading */}
        <Box textAlign="center" mb={5}>
          <Typography
            sx={{
              color: "var(--color-pure-black)",
              textAlign: 'center',
              fontWeight: 700,
              fontSize: {
                xs: "1.8rem",
                md: "2.2rem",
              },
              mb: 1,
            }}
          >
            Executive Leadership
          </Typography>

          <Typography
            sx={{
              color: "var(--color-pure-black)",
              fontSize: "0.95rem",
              textAlign: 'center',
              mt: 1,
              mb: 2,
            }}
          >
            Guided by decades of industry experience.
          </Typography>
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
              sx={{
                bgcolor: "var(--color-sub-bg)",
                p: { xs: 1.5, sm: 2 },
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: "relative",
                overflow: "hidden",

                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(47, 107, 255, 0.12)",
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
                  backgroundColor: "#2F6BFF",
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
                  color: "var(--color-pure-black)",
                  fontWeight: 700,
                  fontSize: { xs: "14px", sm: "16px" },
                  mb: 0.5,
                }}
              >
                {leader.name}
              </Typography>

              <Typography
                sx={{
                  color: "var(--color-pure-black)",
                  fontSize: { xs: "11px", sm: "13px" },
                  fontWeight: 600,
                  mb: 1.5,
                }}
              >
                {leader.role}
              </Typography>

              <Typography
                sx={{
                  color: "var(--color-pure-black)",
                  fontSize: { xs: "11px", sm: "13px" },
                  lineHeight: 1.7,
                  textAlign: "left",
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
      </Container>
    </Box>

    </div>
  )
}

export default Aboutus
