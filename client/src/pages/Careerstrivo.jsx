import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import {
  Grid,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PaymentsIcon from "@mui/icons-material/Payments";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import SchoolIcon from "@mui/icons-material/School";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useState } from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import careerVideo from "../assets/career.mp4";
import {

  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
 
} from "@mui/material";


function Career() {

const [openApplyModal, setOpenApplyModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState({
  title: "",
  description: "",
});

const [resumeFile, setResumeFile] = useState(null);
  

const handleApplyClick = (title, description) => {
  setSelectedJob({
    title,
    description,
  });

  setResumeFile(null);
  setOpenApplyModal(true);
};


    const [openResumeModal, setOpenResumeModal] = useState(false);

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.03)",

    "& fieldset": {
      borderColor: "rgba(255,255,255,0.12)",
    },

    "&:hover fieldset": {
      borderColor: "#2563EB",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#2563EB",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#94A3B8",
  },

  "& .MuiSvgIcon-root": {
    color: "#fff",
  },
};
const MotionBox = motion.create(Box);
const features = [
  "Culture of Excellence",
  "Global Impact Projects",
  "Learning & Mentorship",
  "Innovation First Mindset",
  "Flexible Work Environment",
];
const benefits = [
  {
    icon: <FavoriteIcon />,
    title: "Healthcare & Wellness",
    desc: "Comprehensive health programs designed to support your physical and mental wellbeing.",
  },
  {
    icon: <PaymentsIcon />,
    title: "Competitive Compensation",
    desc: "Industry-leading salary packages with performance-based rewards and incentives.",
  },
  {
    icon: <HomeWorkIcon />,
    title: "Hybrid & Remote Work",
    desc: "Flexible work arrangements that help you maintain work-life balance.",
  },
  {
    icon: <SchoolIcon />,
    title: "Learning Budget",
    desc: "Dedicated annual budget for certifications, courses, and professional growth.",
  },
  {
    icon: <BeachAccessIcon />,
    title: "Generous PTO",
    desc: "Recharge with flexible vacation policies and wellness-focused leave benefits.",
  },
  {
    icon: <TrendingUpIcon />,
    title: "Career Growth",
    desc: "Clear advancement pathways supported by mentoring and leadership programs.",
  },
];
  return (
    <div>
      {/* HERO SECTION */}
<Box
  sx={{
    minHeight: "100vh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background:
      "radial-gradient(circle at top right,#2563EB20,#020617 45%,#000 100%)",
  }}
>
  {/* Main Glow */}
  <Box
    sx={{
      position: "absolute",
      width: 700,
      height: 700,
      borderRadius: "50%",
      background: "#2563EB",
      filter: "blur(250px)",
      opacity: 0.08,
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
    }}
  />

  {/* Floating Card */}
  <MotionBox
    animate={{
      y: [0, -30, 0],
      rotate: [0, 10, 0],
      scale: [1, 1.04, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    sx={{
      position: "absolute",
      top: "12%",
      right: "8%",
      width: 220,
      height: 220,
      borderRadius: "32px",
      overflow: "hidden",
      backdropFilter: "blur(25px)",
      background:
        "linear-gradient(135deg, rgba(37,99,235,.15), rgba(255,255,255,.03))",
      border: "1px solid rgba(255,255,255,.08)",
      boxShadow:
        "0 0 80px rgba(37,99,235,.15), inset 0 0 30px rgba(255,255,255,.03)",

      "&::before": {
        content: '""',
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "#2563EB",
        filter: "blur(50px)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      },
    }}
  />
  

  {/* Left Orb */}
  <MotionBox
    animate={{
      y: [0, 40, 0],
      x: [0, 20, 0],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    sx={{
      position: "absolute",
      bottom: "18%",
      left: "8%",
      width: 160,
      height: 160,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(37,99,235,.8), rgba(37,99,235,.05))",
      filter: "blur(15px)",
    }}
  />

  <Container maxWidth="lg">
    <MotionBox
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      sx={{
        textAlign: "center",
        maxWidth: "900px",
        mx: "auto",
        position: "relative",
        zIndex: 2,
      }}
    >
      <Typography
        sx={{
          color: "#2563EB",
          letterSpacing: "4px",
          fontWeight: 700,
          textTransform: "uppercase",
          mb: 3,
        }}
      >
        Careers At Strivo
      </Typography>

      <Typography
        sx={{
          color: "#fff",
          fontWeight: 900,
          lineHeight: 1,
          mb: 4,
          fontSize: {
            xs: "3rem",
            sm: "4rem",
            md: "6rem",
            lg: "7rem",
          },
        }}
      >
        Build The
        <br />
        Future With Us
      </Typography>

      <Typography
        sx={{
          color: "#94A3B8",
          maxWidth: "700px",
          mx: "auto",
          lineHeight: 1.8,
          mb: 6,
          fontSize: {
            xs: "1rem",
            md: "1.2rem",
          },
        }}
      >
        Join a team of innovators, consultants, and technology
        experts solving complex challenges for businesses worldwide.
      </Typography>
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    width: "100%",
    mt: 2,
  }}
>
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={3}
    alignItems="center"
  >

    <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        justifyContent="center"
        alignItems="center"
      >
        <Button
          variant="contained"
          sx={{
            minWidth: 230,
            height: 60,
            background: "#2563EB",
            borderRadius: "16px",
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "0 15px 40px rgba(37,99,235,.35)",

            "&:hover": {
              background: "#1D4ED8",
              transform: "translateY(-4px)",
            },
          }}
        >
          Explore Open Roles
        </Button>

        <Button
          variant="outlined"
          sx={{
            minWidth: 230,
            height: 60,
            borderRadius: "16px",
            borderColor: "rgba(255,255,255,.15)",
            color: "#fff",
            textTransform: "none",
            fontWeight: 700,

            "&:hover": {
              borderColor: "#2563EB",
              background: "rgba(37,99,235,.08)",
            },
          }}
        >
          Life At Company
        </Button>
      </Stack>
    {/* buttons */}
  </Stack>
</Box>
      
    </MotionBox>
  </Container>

  {/* Scroll Indicator */}
  <MotionBox
    animate={{ y: [0, 12, 0] }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
    }}
    sx={{
      position: "absolute",
      bottom: 40,
      left: "50%",
      transform: "translateX(-50%)",
      color: "#fff",
    }}
  >
    <KeyboardArrowDownIcon sx={{ fontSize: 40 }} />
  </MotionBox>
</Box>

{/* why choose us  */}
{/* WHY JOIN US */}
{/* WHY JOIN US SECTION */}
<Box
  sx={{
    py: { xs: 10, md: 18 },
    background: "#020617",
    position: "relative",
  }}
>
  <Container maxWidth="xl">
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        alignItems: "center",
        justifyContent: "space-between",
        gap: {
          xs: 8,
          md: 12,
        },
      }}
    >
      {/* LEFT IMAGE */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          position: "relative",
        }}
      >
        <MotionBox
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Glow Effect */}
          <Box
            sx={{
              position: "absolute",
              width: "80%",
              height: "80%",
              background: "#2563EB",
              filter: "blur(120px)",
              opacity: 0.15,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          <Box
            sx={{
              position: "relative",
              borderRadius: "32px",
              overflow: "hidden",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Team"
              sx={{
                width: "100%",
                height: {
                  xs: 350,
                  md: 600,
                },
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        </MotionBox>
      </Box>

      {/* RIGHT CONTENT */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: "650px",
        }}
      >
        <MotionBox
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            sx={{
              color: "#2563EB",
              fontWeight: 700,
              letterSpacing: "4px",
              textTransform: "uppercase",
              mb: 2,
            }}
          >
            Why Join Us
          </Typography>

          <Typography
            sx={{
              color: "#fff",
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 4,
              fontSize: {
                xs: "2.5rem",
                sm: "3rem",
                md: "4rem",
              },
            }}
          >
            A Place Where
            <br />
            Talent Thrives
          </Typography>

          <Typography
            sx={{
              color: "#94A3B8",
              lineHeight: 1.9,
              fontSize: "1.05rem",
              mb: 6,
            }}
          >
            We empower ambitious professionals to solve
            complex business challenges, collaborate globally,
            and accelerate their growth through continuous
            learning, innovation, and mentorship.
          </Typography>

          <Stack spacing={3}>
            {[
              "Culture of Excellence",
              "Global Impact Projects",
              "Learning & Mentorship",
              "Innovation First Mindset",
              "Flexible Work Environment",
            ].map((item, index) => (
              <MotionBox
                key={index}
                initial={{
                  opacity: 0,
                  x: 40,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background:
                        "rgba(37,99,235,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✓
                  </Box>

                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "1.05rem",
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </Typography>
                </Stack>
              </MotionBox>
            ))}
          </Stack>
        </MotionBox>
      </Box>
    </Box>
  </Container>
</Box>
<Box
  sx={{
    py: { xs: 10, md: 14 },
    background:
      "linear-gradient(to bottom,#020617,#08142B)",
  }}
>
  <Container maxWidth="lg">

    {/* Content */}

    <Box
      sx={{
        textAlign: "center",
        mb: 6,
      }}
    >
      <Typography
        sx={{
          color: "#2563EB",
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          mb: 2,
        }}
      >
        Life At Strivo
      </Typography>

      <Typography
        sx={{
          color: "#fff",
          fontWeight: 800,
          lineHeight: 1.1,
          mb: 3,
          fontSize: {
            xs: "2.5rem",
            md: "4rem",
          },
        }}
      >
        More Than A Workplace.
        <br />
        A Place To Grow.
      </Typography>

      <Typography
        sx={{
          color: "#94A3B8",
          maxWidth: "700px",
          mx: "auto",
          lineHeight: 1.8,
        }}
      >
        At Strivo, we foster innovation,
        collaboration, and continuous learning.
        Every project is an opportunity to create
        impact, develop new skills, and shape the future.
      </Typography>
    </Box>

    {/* Video */}

    <Box
      sx={{
        position: "relative",
        overflow: "hidden",

        borderRadius: "32px",

        border:
          "1px solid rgba(255,255,255,.08)",

        boxShadow:
          "0 30px 80px rgba(0,0,0,.45)",

        height: {
          xs: 260,
          md: 550,
        },
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source
          src={careerVideo}
          type="video/mp4"
        />
      </video>

      {/* Overlay */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,

          background:
            "linear-gradient(to top,rgba(0,0,0,.75),rgba(0,0,0,.15))",

          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",

          p: {
            xs: 3,
            md: 6,
          },
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 800,
            mb: 1,

            fontSize: {
              xs: "1.5rem",
              md: "3rem",
            },
          }}
        >
          Experience The Strivo Culture
        </Typography>

        <Typography
          sx={{
            color: "#CBD5E1",
            maxWidth: "650px",
            lineHeight: 1.8,
          }}
        >
          Join a team driven by innovation,
          collaboration, and a passion for
          delivering meaningful outcomes.
        </Typography>
      </Box>
    </Box>

  </Container>
</Box>
<Box
  sx={{
    py: { xs: 8, md: 12 },
    background: "#020617",
  }}
>
  <Container maxWidth="xl">
    {/* Heading */}
    <Box
      sx={{
        textAlign: "center",
        mb: 8,
      }}
    >
      <Typography
        sx={{
          color: "#2563EB",
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          mb: 2,
        }}
      >
        Open Positions
      </Typography>

      <Typography
        sx={{
          color: "#fff",
          fontWeight: 800,
          lineHeight: 1.1,
          mb: 3,
          fontSize: {
            xs: "2.3rem",
            md: "3.8rem",
          },
        }}
      >
        Find Your Next
        <br />
        Opportunity
      </Typography>

      <Typography
        sx={{
          color: "#94A3B8",
          maxWidth: "650px",
          mx: "auto",
          lineHeight: 1.8,
        }}
      >
        Join a team that values innovation,
        collaboration, and continuous growth.
        Explore opportunities that match your
        skills and aspirations.
      </Typography>
    </Box>

    {/* Job Card 1 */}
    <MotionBox whileHover={{ y: -5 }} sx={{ mb: 3 }}>
      <Box
        sx={{
          minHeight: 250,
          p: 4,
          borderRadius: "24px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          transition: "all .3s ease",

          "&:hover": {
            border: "1px solid rgba(37,99,235,.4)",
            boxShadow: "0 0 40px rgba(37,99,235,.15)",
          },

          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          gap: 3,
        }}
      >
        <Box maxWidth="750px">
          <Typography
            sx={{
              color: "#fff",
              fontSize: "1.35rem",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Frontend Developer
          </Typography>

          <Typography
            sx={{
              color: "#94A3B8",
              lineHeight: 1.8,
              mb: 2.5,
            }}
          >
            Build modern web applications using React,
            Material UI, and JavaScript. Collaborate with
            designers and backend teams to deliver fast,
            responsive, and user-centric digital experiences.
          </Typography>

          <Stack  sx={{
    "& .MuiChip-root": {
      color: "#fff",
      background: "rgba(37,99,235,0.15)",
      border: "1px solid rgba(37,99,235,0.3)",
      fontWeight: 500,
    }}} direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Chip label="Technology" />
            <Chip label="Remote" />
            <Chip label="Full Time" />
          </Stack>
        </Box>

        <Button

        onClick={() =>
    handleApplyClick(
      "Frontend Developer",
      "Build modern web applications using React, Material UI, and JavaScript. Collaborate with designers and backend teams to deliver fast, responsive, and user-centric digital experiences."
    )
  }
          variant="contained"
          sx={{
            background: "#2563EB",
            borderRadius: "14px",
            px: 4,
            minWidth: 150,
            height: 50,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Apply Now
        </Button>
      </Box>
    </MotionBox>

    {/* Job Card 2 */}
    <MotionBox whileHover={{ y: -5 }} sx={{ mb: 3 }}>
      <Box
        sx={{
          minHeight: 250,
          p: 4,
          borderRadius: "24px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          transition: "all .3s ease",

          "&:hover": {
            border: "1px solid rgba(37,99,235,.4)",
            boxShadow: "0 0 40px rgba(37,99,235,.15)",
          },

          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          gap: 3,
        }}
      >
        <Box maxWidth="750px">
          <Typography
            sx={{
              color: "#fff",
              fontSize: "1.35rem",
              fontWeight: 700,
              mb: 1,
            }}
          >
            UI/UX Designer
          </Typography>

          <Typography
            sx={{
              color: "#94A3B8",
              lineHeight: 1.8,
              mb: 2.5,
            }}
          >
            Create intuitive interfaces, wireframes,
            and prototypes that enhance user engagement
            and provide seamless digital experiences
            across web and mobile platforms.
          </Typography>

          <Stack sx={{
    "& .MuiChip-root": {
      color: "#fff",
      background: "rgba(37,99,235,0.15)",
      border: "1px solid rgba(37,99,235,0.3)",
      fontWeight: 500,
    }}} direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Chip label="Design" />
            <Chip label="Kochi" />
            <Chip label="Full Time" />
          </Stack>
        </Box>

        <Button
         onClick={() =>
    handleApplyClick(
      "UI/UX Designer",
      "Create intuitive interfaces, wireframes and prototypes that enhance user engagement and provide seamless digital experiences across web and mobile platforms."
    )
  }
          variant="contained"
          sx={{
            background: "#2563EB",
            borderRadius: "14px",
            px: 4,
            minWidth: 150,
            height: 50,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Apply Now
        </Button>
      </Box>
    </MotionBox>

    {/* Job Card 3 */}
    <MotionBox whileHover={{ y: -5 }}>
      <Box
        sx={{
          minHeight: 250,
          p: 4,
          borderRadius: "24px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          transition: "all .3s ease",

          "&:hover": {
            border: "1px solid rgba(37,99,235,.4)",
            boxShadow: "0 0 40px rgba(37,99,235,.15)",
          },

          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          gap: 3,
        }}
      >
        <Box maxWidth="750px">
          <Typography
            sx={{
              color: "#fff",
              fontSize: "1.35rem",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Business Consultant
          </Typography>

          <Typography
            sx={{
              color: "#94A3B8",
              lineHeight: 1.8,
              mb: 2.5,
            }}
          >
            Work closely with clients to analyze business
            challenges, identify growth opportunities, and
            deliver strategic solutions that drive measurable
            outcomes and transformation.
          </Typography>

          <Stack sx={{
    "& .MuiChip-root": {
      color: "#fff",
      background: "rgba(37,99,235,0.15)",
      border: "1px solid rgba(37,99,235,0.3)",
      fontWeight: 500,
    }}} direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Chip label="Consulting" />
            <Chip label="Dubai" />
            <Chip label="Full Time" />
          </Stack>
        </Box>

        <Button

        onClick={() =>
    handleApplyClick(
      "Business Consultant",
      "Work closely with clients to analyze business challenges, identify growth opportunities, and deliver strategic solutions that drive measurable outcomes and transformation."
    )
  }
          variant="contained"
          sx={{
            background: "#2563EB",
            borderRadius: "14px",
            px: 4,
            minWidth: 150,
            height: 50,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Apply Now
        </Button>
      </Box>
    </MotionBox>
  </Container>
</Box>
{/* modal */}

<Dialog
  open={openApplyModal}
  onClose={() => setOpenApplyModal(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      background:
        "linear-gradient(145deg,#0F172A,#111827)",
      borderRadius: "30px",
      color: "#fff",
      border: "1px solid rgba(255,255,255,.08)",
    },
  }}
>
  <DialogTitle
    sx={{
      textAlign: "center",
      py: 4,
    }}
  >
    <Typography
      variant="h4"
      fontWeight={700}
    >
      Apply For Position
    </Typography>

    <Box
      sx={{
        mt: 2,
        display: "inline-block",
        px: 3,
        py: 1,
        borderRadius: "20px",
        background:
          "rgba(37,99,235,.15)",
        color: "#60A5FA",
      }}
    >
      {selectedJob.title}
    </Box>
  </DialogTitle>

  <DialogContent>
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Full Name"
      />

      <TextField
        fullWidth
        label="Email Address"
      />

      <TextField
        fullWidth
        label="Mobile Number"
      />

      <TextField
        fullWidth
        label="Applied Position"
        value={selectedJob.title}
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Role Description"
        value={selectedJob.description}
        InputProps={{
          readOnly: true,
        }}
      />

      <Button
        component="label"
        sx={{
          height: 120,
          borderRadius: "18px",
          border:
            "2px dashed rgba(37,99,235,.4)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        Upload Resume

        <input
          hidden
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            setResumeFile(
              e.target.files?.[0] || null
            )
          }
        />
      </Button>

      {resumeFile && (
        <Box
          sx={{
            p: 2,
            borderRadius: "12px",
            background:
              "rgba(37,99,235,.08)",
            border:
              "1px solid rgba(37,99,235,.2)",
          }}
        >
          📄 {resumeFile.name}
        </Box>
      )}
    </Stack>
  </DialogContent>

  <DialogActions
    sx={{
      p: 3,
      justifyContent: "space-between",
    }}
  >
    <Button
      onClick={() =>
        setOpenApplyModal(false)
      }
      sx={{
        color: "#94A3B8",
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      sx={{
        background:
          "linear-gradient(90deg,#2563EB,#3B82F6)",
        px: 4,
        borderRadius: "12px",
        textTransform: "none",
      }}
    >
      Submit Application
    </Button>
  </DialogActions>
</Dialog>

{/* didint find */}

{/* DON'T SEE A PERFECT FIT */}
<Box
  sx={{
    py: { xs: 8, md: 12 },
    px: 2,
    background:
      "linear-gradient(135deg,#0F172A,#020617)",
  }}
>
  <Container maxWidth="lg">
    <Box
      sx={{
        textAlign: "center",
        p: { xs: 4, md: 6 },
        borderRadius: "30px",

        background: "rgba(255,255,255,0.04)",

        backdropFilter: "blur(20px)",

        border: "1px solid rgba(255,255,255,0.08)",

        boxShadow:
          "0 0 40px rgba(37,99,235,0.08)",
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontWeight: 800,
          fontSize: {
            xs: "1.8rem",
            md: "2.5rem",
          },
          mb: 2,
        }}
      >
        Don't See a Perfect Fit?
      </Typography>

      <Typography
        sx={{
          color: "#94A3B8",
          maxWidth: "700px",
          mx: "auto",
          lineHeight: 1.8,
          mb: 4,
        }}
      >
        We are always looking for exceptional
        talent to join our team. Send us your
        resume and we'll reach out when a
        relevant position becomes available.
      </Typography>

      <Button
        variant="contained"
        onClick={() => setOpenResumeModal(true)}
        sx={{
          background: "#2563EB",
          px: 5,
          py: 1.5,
          borderRadius: "14px",
          textTransform: "none",
          fontWeight: 600,

          "&:hover": {
            background: "#1D4ED8",
          },
        }}
      >
        Submit Your Resume
      </Button>
    </Box>
  </Container>
</Box>

{/* RESUME MODAL */}
<Dialog
  open={openResumeModal}
  onClose={() => setOpenResumeModal(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      background:
        "linear-gradient(145deg,#0F172A,#111827)",

      color: "#fff",

      borderRadius: "28px",

      overflow: "hidden",

      position: "relative",

      border: "1px solid rgba(255,255,255,0.08)",

      boxShadow:
        "0 0 80px rgba(37,99,235,.18)",

      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background:
          "linear-gradient(90deg,#2563EB,#60A5FA)",
      },
    },
  }}
>
  {/* HEADER */}
  <DialogTitle
    sx={{
      textAlign: "center",
      pt: 5,
      pb: 2,
    }}
  >
    <Box
      sx={{
        width: 80,
        height: 80,
        mx: "auto",
        mb: 2,

        borderRadius: "20px",

        background:
          "rgba(37,99,235,.12)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CloudUploadOutlinedIcon
        sx={{
          fontSize: 40,
          color: "#2563EB",
        }}
      />
    </Box>

    <Typography
      variant="h4"
      fontWeight={700}
      sx={{
        mb: 1,
      }}
    >
      Join Our Talent Network
    </Typography>

    <Typography
      sx={{
        color: "#94A3B8",
        maxWidth: "400px",
        mx: "auto",
        lineHeight: 1.7,
      }}
    >
      Submit your profile and we'll reach out
      when a suitable opportunity becomes available.
    </Typography>
  </DialogTitle>

  {/* FORM */}
  <DialogContent
    sx={{
      px: 4,
      pb: 2,
    }}
  >
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Full Name"
        sx={fieldStyle}
      />

      <TextField
        fullWidth
        label="Email Address"
        sx={fieldStyle}
      />

      <TextField
        fullWidth
        label="Mobile Number"
        sx={fieldStyle}
      />

      <TextField
        select
        fullWidth
        label="Category"
        sx={fieldStyle}
      >
        <MenuItem value="Frontend Developer">
          Frontend Developer
        </MenuItem>

        <MenuItem value="UI/UX Designer">
          UI/UX Designer
        </MenuItem>

        <MenuItem value="Business Consultant">
          Business Consultant
        </MenuItem>

        <MenuItem value="Other">
          Other
        </MenuItem>
      </TextField>

      {/* Upload Area */}

      <Button
        component="label"
        sx={{
          height: 120,

          borderRadius: "18px",

          border:
            "2px dashed rgba(37,99,235,.4)",

          background:
            "rgba(255,255,255,0.03)",

          display: "flex",
          flexDirection: "column",

          gap: 1,

          color: "#fff",

          textTransform: "none",

          "&:hover": {
            background:
              "rgba(37,99,235,.08)",

            borderColor: "#2563EB",
          },
        }}
      >
        <CloudUploadOutlinedIcon
          sx={{
            fontSize: 34,
            color: "#2563EB",
          }}
        />

        <Typography
          fontWeight={600}
        >
          Upload Resume
        </Typography>

        <Typography
          sx={{
            fontSize: ".8rem",
            color: "#94A3B8",
          }}
        >
          PDF, DOC, DOCX
        </Typography>

        <input
          hidden
          type="file"
          accept=".pdf,.doc,.docx"
        />
      </Button>
    </Stack>
  </DialogContent>

  {/* FOOTER */}
  <DialogActions
    sx={{
      px: 4,
      pb: 4,
      pt: 2,
      justifyContent: "space-between",
    }}
  >
    <Button
      onClick={() => setOpenResumeModal(false)}
      sx={{
        color: "#94A3B8",
        textTransform: "none",
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      sx={{
        background:
          "linear-gradient(90deg,#2563EB,#3B82F6)",

        px: 4,
        py: 1.2,

        borderRadius: "12px",

        textTransform: "none",

        fontWeight: 600,

        boxShadow:
          "0 10px 30px rgba(37,99,235,.35)",

        "&:hover": {
          background:
            "linear-gradient(90deg,#1D4ED8,#2563EB)",
        },
      }}
    >
      Submit Application
    </Button>
  </DialogActions>
</Dialog>

    </div>
  )
}

export default Career
