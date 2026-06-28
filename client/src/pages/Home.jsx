import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Rating,
} from '@mui/material';
import { motion } from 'framer-motion';
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
} from "@mui/icons-material";

import heroBg from "../assets/heroBg.jpg";
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
function Home() {
  const navigate = useNavigate();
  const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, GlobalTech",
    image: leader1,
    review:
      "Their strategic guidance transformed our operations and accelerated growth beyond expectations. The results exceeded every key business objective.",
  },
  {
    name: "Michael Chen",
    role: "Managing Director, Nexus",
    image: leader2,
    review:
      "A highly professional team that delivered measurable business impact within months. Their expertise was invaluable throughout the transformation.",
  },
  {
    name: "Emily Rodriguez",
    role: "VP Operations, Apex",
    image: leader3,
    review:
      "Their consulting approach helped us modernize systems, reduce operational costs, and create sustainable growth opportunities.",
  },
  {
    name: "David Wilson",
    role: "Founder, Vertex",
    image: leader4,
    review:
      "Outstanding execution and strategic thinking. Their team became an extension of our leadership group.",
  },
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

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/success-stories`);
        const data = await response.json();
        if (data && data.length > 0) {
          // Map backend data to frontend expected format
          const formattedData = data.map(story => ({
            name: story.name,
            role: story.position,
            image: story.imageUrl,
            review: story.clientStories
          }));
          setSuccessStories(formattedData);
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
  sx={{
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  }}
>
  {/* Background Image */}

  <Box
    component="img"
    src={heroBg}
    alt="Background"
    sx={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0,
    }}
  />

  {/* Dark Overlay */}

  <Box
    sx={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(90deg, rgba(0,0,0,.90) 0%, rgba(0,0,0,.75) 45%, rgba(0,0,0,.55) 100%)",
      zIndex: 1,
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
          lg: "1fr 1fr",
        },
        alignItems: "center",
        gap: 6,
      }}
    >
      {/* LEFT CONTENT */}

      <Box>
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              mb: 4,
              fontSize: {
                xs: "2.5rem",
                sm: "3.5rem",
                md: "4.2rem",
                lg: "4.8rem",
              },
            }}
          >
            Empowering Enterprise Growth
            <br />
            through Strategic Innovation
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 1,
          }}
        >
          <Typography
            sx={{
              color: "#d1d5db",
              lineHeight: 1.8,
              maxWidth: "650px",
              mb: 5,
              fontSize: {
                xs: "1rem",
                md: "1.15rem",
              },
            }}
          >
            We partner with ambitious leaders to solve
            complex challenges, optimize operations,
            and drive sustainable growth in an
            ever-evolving global landscape.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 1,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <Button
              variant="contained"
              sx={{
                px: 4,
                py: 1.8,
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 700,
                background:
                  "linear-gradient(135deg,#2563eb,#3b82f6)",

                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 15px 30px rgba(37,99,235,.4)",
                },
              }}
            >
              Get Started
            </Button>

            <Button
              variant="outlined"
              sx={{
                px: 4,
                py: 1.8,
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 700,
                color: "#fff",
                borderColor:
                  "rgba(255,255,255,.3)",

                "&:hover": {
                  background:
                    "rgba(255,255,255,.08)",
                  borderColor: "#fff",
                },
              }}
            >
              Learn More
            </Button>
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
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            x: 100,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 1.3,
          }}
        >
          <Box
            component="img"
            src={homeHero}
            alt="Meeting"
            sx={{
              width: "100%",
              borderRadius: "28px",
              boxShadow:
                "0 30px 80px rgba(0,0,0,.55)",
              transition: "all .5s ease",

              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          />
        </motion.div>

        {/* Floating Card */}

        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: "-30px",
              left: "-30px",
              background:
                "rgba(15,23,42,.95)",
              backdropFilter: "blur(20px)",
              border:
                "1px solid rgba(59,130,246,.3)",
              borderRadius: "18px",
              p: 3,
              minWidth: "180px",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "2rem",
              }}
            >
              15+
            </Typography>

            <Typography
              sx={{
                color: "#9ca3af",
              }}
            >
              Years Experience
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  </Container>
</Box>

{/* second section */}
   <Box
  sx={{
    backgroundColor: "transparent",
    py: { xs: 8, md: 12 },
  }}
>
  {/* TRUSTED BY SECTION */}

  <Container maxWidth="xl">
    <Box
      sx={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        py: 8,
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          color: "#94a3b8",
          letterSpacing: "3px",
          fontWeight: 600,
          mb: 6,
          fontSize: "0.9rem",
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
                  color: "#6b7280",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: ".4s",
                  fontSize: {
                    xs: "1.8rem",
                    md: "3rem",
                  },

                  "&:hover": {
                    color: "#fff",
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
    maxWidth="xl"
    sx={{
      mt: { xs: 8, md: 12 },
    }}
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2,1fr)",
          lg: "repeat(4,1fr)",
        },
        gap: 4,
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
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              border:
                "1px solid rgba(59,130,246,0.15)",
              borderRadius: "24px",
              p: 5,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              transition: "all .4s ease",

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
                border:
                  "1px solid rgba(59,130,246,.4)",
                boxShadow:
                  "0 20px 50px rgba(37,99,235,.2)",
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
                  xs: "3rem",
                  md: "4rem",
                },
              }}
            >
              {item.value}
              {item.suffix}
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                letterSpacing: "2px",
                fontWeight: 500,
                textTransform: "uppercase",
                fontSize: {
                  xs: "0.85rem",
                  md: "1rem",
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
  sx={{
    backgroundColor: "transparent",
    py: { xs: 10, md: 14 },
  }}
>
  <Container maxWidth="xl">
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
          color: "#fff",
          textAlign: "center",
          fontWeight: 700,
          mb: 2,
          fontSize: {
            xs: "2rem",
            md: "3rem",
          },
        }}
      >
        Our Core Expertise
      </Typography>

      <Typography
        sx={{
          color: "#94a3b8",
          textAlign: "center",
          maxWidth: "700px",
          mx: "auto",
          mb: 8,
          lineHeight: 1.8,
          fontSize: {
            xs: "1rem",
            md: "1.1rem",
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
            xs: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(4,1fr)",
          },
          gap: 4,
        }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              y: -15,
              scale: 1.03,
            }}
          >
            <Box
              sx={{
                position: "relative",
                background:
                  "linear-gradient(145deg,#081224,#0f172a)",
                borderRadius: "24px",
                p: 4,
                minHeight: "280px",
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
                  width: 60,
                  height: 60,
                  borderRadius: "16px",
                  background:
                    "rgba(37,99,235,.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                {service.icon}
              </Box>

              {/* Title */}

              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  mb: 2,
                  fontSize: "1.25rem",
                }}
              >
                {service.title}
              </Typography>

              {/* Description */}

              <Typography
                sx={{
                  color: "#94a3b8",
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
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
  sx={{
    backgroundColor: "#000",
    py: { xs: 10, md: 16 },
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
        "radial-gradient(circle, rgba(37,99,235,.12), transparent 70%)",
      pointerEvents: "none",
    }}
  />

  <Container maxWidth="xl">
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "1.1fr 0.9fr",
        },
        gap: { xs: 6, md: 10 },
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
            fontWeight: 600,
            letterSpacing: "2px",
            textTransform: "uppercase",
            mb: 2,
            fontSize: "0.9rem",
          }}
        >
          Why Clients Trust Us
        </Typography>

        <Typography
          sx={{
            color: "#fff",
            fontWeight: 800,
            lineHeight: 1.15,
            mb: 4,
            maxWidth: "700px",
            fontSize: {
              xs: "2.2rem",
              md: "3rem",
              lg: "3.8rem",
            },
          }}
        >
          Building Long-Term Partnerships Through Proven Results
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
            lineHeight: 2,
            mb: 3,
            fontSize: {
              xs: "1rem",
              md: "1.1rem",
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
            color: "#94a3b8",
            lineHeight: 2,
            mb: 3,
            fontSize: {
              xs: "1rem",
              md: "1.1rem",
            },
          }}
        >
          Our consultants combine strategic insight, industry
          expertise, and data-driven decision-making to deliver
          solutions that create measurable business impact.
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
            lineHeight: 2,
            fontSize: {
              xs: "1rem",
              md: "1.1rem",
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
            { value: "500+", label: "Projects" },
            { value: "200+", label: "Clients" },
            { value: "98%", label: "Success Rate" },
          ].map((item, index) => (
            <Box key={index}>
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.5rem",
                  },
                }}
              >
                {item.value}
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
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
            maxWidth: "550px",
            ml: "auto",
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
              borderRadius: "28px",
              position: "relative",
              zIndex: 2,
              objectFit: "cover",
              boxShadow:
                "0 30px 70px rgba(0,0,0,.45)",
              transition: ".5s ease",

              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          />

          {/* Floating Card */}
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: "-25px",
                left: "-25px",
                background:
                  "rgba(15,23,42,.95)",
                backdropFilter: "blur(20px)",
                border:
                  "1px solid rgba(59,130,246,.3)",
                borderRadius: "18px",
                p: 3,
                zIndex: 3,
                minWidth: "220px",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "2rem",
                }}
              >
                15+
              </Typography>

              <Typography
                sx={{
                  color: "#94a3b8",
                }}
              >
                Years of Excellence
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  </Container>
</Box>
{/* 4 section */}
<Box
  sx={{
    backgroundColor: "#000",
    py: { xs: 10, md: 14 },
    overflow: "hidden",
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
          color: "#fff",
          textAlign: "center",
          fontWeight: 800,
          mb: 2,
          fontSize: {
            xs: "2rem",
            md: "3.2rem",
          },
        }}
      >
        Client Success Stories
      </Typography>

      <Typography
        sx={{
          color: "#94a3b8",
          textAlign: "center",
          maxWidth: "700px",
          mx: "auto",
          mb: 8,
          lineHeight: 1.8,
        }}
      >
        Discover how leading organizations achieved measurable
        transformation through our strategic consulting expertise.
      </Typography>
    </motion.div>

    {/* Slider */}

    <Swiper
      modules={[Pagination, Autoplay]}
      slidesPerView={1}
      centeredSlides
      loop
      speed={1200}
      autoplay={{
        delay: 4500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      style={{
        paddingBottom: "70px",
      }}
    >
      {loadingStories ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </Box>
      ) : successStories.map((item, index) => (
        <SwiperSlide key={index}>
          <div>
            <Box
              sx={{
                background:
                  "linear-gradient(145deg,#081224,#0f172a)",
                border:
                  "1px solid rgba(59,130,246,.15)",
                borderRadius: "32px",
                p: {
                  xs: 4,
                  md: 7,
                },
                position: "relative",
                overflow: "hidden",
                transition: ".4s ease",

                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow:
                    "0 25px 60px rgba(37,99,235,.18)",
                },
              }}
            >
              {/* Glow */}

              <Box
                sx={{
                  position: "absolute",
                  top: "-120px",
                  right: "-120px",
                  width: "300px",
                  height: "300px",
                  background:
                    "radial-gradient(circle, rgba(37,99,235,.18), transparent)",
                }}
              />

              {/* Quote */}

              <Typography
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 40,
                  fontSize: {
                    xs: "4rem",
                    md: "7rem",
                  },
                  color: "rgba(59,130,246,.12)",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                "
              </Typography>

              {/* Avatar */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 4,
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border:
                      "4px solid rgba(59,130,246,.3)",
                    transition: ".4s",

                    "&:hover": {
                      transform: "scale(1.08)",
                    },
                  }}
                />
              </Box>

              {/* Rating */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Rating value={5} readOnly />
              </Box>

              {/* Review */}

              <Typography
                sx={{
                  color: "#fff",
                  textAlign: "center",
                  fontStyle: "italic",
                  lineHeight: 1.9,
                  mb: 5,
                  maxWidth: "850px",
                  mx: "auto",
                  fontSize: {
                    xs: "1rem",
                    md: "1.4rem",
                  },
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                "{item.review}"
              </Typography>

              {/* Client Info */}

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                >
                  {item.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#94a3b8",
                    mt: 0.5,
                  }}
                >
                  {item.role}
                </Typography>
              </Box>
            </Box>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </Container>
</Box>

    </div>
  );
}

export default Home;