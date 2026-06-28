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
import { toast } from "sonner";
import { applyJobAPI, submitTalentAPI, getJobsAPI } from "../services/allApi";
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
  const [talentFile, setTalentFile] = useState(null);

  const [applyForm, setApplyForm] = useState({ fullName: "", email: "", mobile: "" });
  const [talentForm, setTalentForm] = useState({ fullName: "", email: "", mobile: "", category: "" });

  const [applyErrors, setApplyErrors] = useState({});
  const [talentErrors, setTalentErrors] = useState({});

  const [applyLoading, setApplyLoading] = useState(false);
  const [talentLoading, setTalentLoading] = useState(false);

  // Dynamic jobs states
  const [dynamicJobs, setDynamicJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 1;

  const fetchDynamicJobs = async () => {
    try {
      const response = await getJobsAPI();
      if (response.status === 200 && response.data?.success) {
        const activeJobs = response.data.data.filter(job => job.status === "Active" || !job.status);
        setDynamicJobs(activeJobs);
      }
    } catch (error) {
      console.error("Failed to load dynamic jobs:", error);
    }
  };

  React.useEffect(() => {
    fetchDynamicJobs();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleApplyClick = (title, description) => {
    setSelectedJob({ title, description });
    setResumeFile(null);
    setApplyForm({ fullName: "", email: "", mobile: "" });
    setApplyErrors({});
    setOpenApplyModal(true);
  };

  const handleApplyChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      setApplyForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 10) }));
    } else {
      setApplyForm((prev) => ({ ...prev, [name]: value }));
    }
    if (applyErrors[name]) setApplyErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTalentChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      setTalentForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 10) }));
    } else {
      setTalentForm((prev) => ({ ...prev, [name]: value }));
    }
    if (talentErrors[name]) setTalentErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateApply = () => {
    const errs = {};
    if (!applyForm.fullName.trim()) errs.fullName = "Required";
    if (!applyForm.email.trim()) errs.email = "Required";
    if (!applyForm.mobile.trim()) errs.mobile = "Required";
    if (!resumeFile) errs.resume = "Please upload resume";
    return errs;
  };

  const validateTalent = () => {
    const errs = {};
    if (!talentForm.fullName.trim()) errs.fullName = "Required";
    if (!talentForm.email.trim()) errs.email = "Required";
    if (!talentForm.mobile.trim()) errs.mobile = "Required";
    if (!talentForm.category) errs.category = "Required";
    if (!talentFile) errs.resume = "Please upload resume";
    return errs;
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    const errs = validateApply();
    if (Object.keys(errs).length) return setApplyErrors(errs);
    setApplyLoading(true);
    const formData = new FormData();
    formData.append("fullName", applyForm.fullName);
    formData.append("email", applyForm.email);
    formData.append("mobile", applyForm.mobile);
    formData.append("appliedPosition", selectedJob.title);
    formData.append("roleDescription", selectedJob.description);
    formData.append("resume", resumeFile);
    try {
      const response = await applyJobAPI(formData);
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Application submitted successfully!");
        setOpenApplyModal(false);
        setApplyForm({ fullName: "", email: "", mobile: "" });
        setResumeFile(null);
      } else {
        toast.error(response?.data?.message || response?.response?.data?.message || "Failed to submit.");
      }
    } catch (err) { toast.error("Network error."); }
    setApplyLoading(false);
  };

  const handleTalentSubmit = async (e) => {
    e.preventDefault();
    const errs = validateTalent();
    if (Object.keys(errs).length) return setTalentErrors(errs);
    setTalentLoading(true);
    const formData = new FormData();
    formData.append("fullName", talentForm.fullName);
    formData.append("email", talentForm.email);
    formData.append("mobile", talentForm.mobile);
    formData.append("category", talentForm.category);
    formData.append("resume", talentFile);
    try {
      const response = await submitTalentAPI(formData);
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Profile submitted successfully!");
        setOpenResumeModal(false);
        setTalentForm({ fullName: "", email: "", mobile: "", category: "" });
        setTalentFile(null);
      } else {
        toast.error(response?.data?.message || response?.response?.data?.message || "Failed to submit.");
      }
    } catch (err) { toast.error("Network error."); }
    setTalentLoading(false);
  };

  const [openResumeModal, setOpenResumeModal] = useState(false);

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      background: "rgba(255,255,255,0.03)",
      transition: "all 0.3s ease",

      "& fieldset": {
        borderColor: "rgba(255,255,255,0.12)",
        transition: "all 0.3s ease",
      },

      "&:hover fieldset": {
        borderColor: "#2563EB",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#2563EB",
      },

      "&.Mui-focused": {
        boxShadow: "0 0 14px rgba(37,99,235, 0.25)",
        background: "rgba(255,255,255,0.05)",
      },
    },


    "& .MuiInputBase-input": {
      color: "#ffffff !important",
    },
    "& .MuiSelect-select": {
      color: "#ffffff !important",
    },

    "& .MuiInputLabel-root": {
      color: "#94A3B8",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#2563EB",
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

      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "transparent",
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


        <MotionBox
          animate={{
            y: [0, -25, 0],
            rotate: [0, 8, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          sx={{
            position: "absolute",
            top: "14%",
            right: "10%",
            width: 240,
            height: 240,
            borderRadius: "32px",
            overflow: "hidden",
            backdropFilter: "blur(30px)",
            background:
              "linear-gradient(135deg, rgba(37,99,235,.15), rgba(255,255,255,.02))",
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow:
              "0 40px 100px rgba(0,0,0,.6), inset 0 0 30px rgba(255,255,255,.03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 3,
            zIndex: 1,

            "&::before": {
              content: '""',
              position: "absolute",
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "#2563EB",
              filter: "blur(60px)",
              top: "-20px",
              right: "-20px",
              opacity: 0.35,
              zIndex: -1,
            },
          }}
        >

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                background: "rgba(37, 99, 235, 0.2)",
                border: "1px solid rgba(37, 99, 235, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUpIcon sx={{ color: "#60A5FA", fontSize: 22 }} />
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "20px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                component={motion.div}
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                sx={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }}
              />
              <Typography sx={{ color: "#34D399", fontSize: "0.7rem", fontWeight: 600 }}>
                Hiring
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: "1.15rem", mb: 0.5 }}>
              Join Our Team
            </Typography>
            <Typography sx={{ color: "#94A3B8", fontSize: "0.78rem", lineHeight: 1.4, mb: 1.5 }}>
              We are looking for passionate innovators to build the future.
            </Typography>

            <Typography
              sx={{
                color: "#60A5FA",
                fontSize: "0.78rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                "&:hover": { color: "#93C5FD" }
              }}
              onClick={() => scrollToSection('open-positions')}
            >
              View Openings &rarr;
            </Typography>
          </Box>
        </MotionBox>



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
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 4,
                fontSize: {
                  xs: "2rem",
                  sm: "2.8rem",
                  md: "3.5rem",
                  lg: "3.8rem",
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
                lineHeight: 1.7,
                mb: 6,
                fontSize: {
                  xs: "0.95rem",
                  md: "1.1rem",
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
                    onClick={() => scrollToSection('open-positions')}
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
                    onClick={() => scrollToSection('life-at-strivo')}
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
                    Life At Strivo
                  </Button>
                </Stack>

              </Stack>
            </Box>

          </MotionBox>
        </Container>


        <MotionBox
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          onClick={() => scrollToSection('why-join-us')}
          sx={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: 40 }} />
        </MotionBox>
      </Box>


      <Box
        id="why-join-us"
        sx={{
          py: { xs: 10, md: 18 },
          background: "#000000",
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
                    fontWeight: 700,
                    lineHeight: 1.1,
                    mb: 4,
                    fontSize: {
                      xs: "1.8rem",
                      sm: "2.2rem",
                      md: "2.5rem",
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
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
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
        id="life-at-strivo"
        sx={{
          py: { xs: 10, md: 14 },
          background: "#000000",
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
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 3,
                fontSize: {
                  xs: "2rem",
                  md: "3rem",
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
                lineHeight: 1.7,
                fontSize: "0.95rem",
              }}
            >
              At Strivo, we foster innovation,
              collaboration, and continuous learning.
              Every project is an opportunity to create
              impact, develop new skills, and shape the future.
            </Typography>
          </Box>



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
                  fontWeight: 700,
                  mb: 1,

                  fontSize: {
                    xs: "1.3rem",
                    md: "2.2rem",
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
        id="open-positions"
        sx={{
          py: { xs: 8, md: 12 },
          background: "#000000",
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
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 3,
                fontSize: {
                  xs: "2rem",
                  md: "2.8rem",
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
                lineHeight: 1.7,
                fontSize: "0.95rem",
              }}
            >
              Join a team that values innovation,
              collaboration, and continuous growth.
              Explore opportunities that match your
              skills and aspirations.
            </Typography>
          </Box>

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

                <Stack sx={{
                  "& .MuiChip-root": {
                    color: "#fff",
                    background: "rgba(37,99,235,0.15)",
                    border: "1px solid rgba(37,99,235,0.3)",
                    fontWeight: 500,
                  }
                }} direction="row" spacing={2} flexWrap="wrap" useFlexGap>
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
                  }
                }} direction="row" spacing={2} flexWrap="wrap" useFlexGap>
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
                  }
                }} direction="row" spacing={2} flexWrap="wrap" useFlexGap>
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

        
          {dynamicJobs.length > 0 && (
            <Box sx={{ mt: 3 }}>

              {dynamicJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map((job) => (
                <MotionBox key={job._id} whileHover={{ y: -5 }} sx={{ mb: 3 }}>
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
                        {job.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#94A3B8",
                          lineHeight: 1.8,
                          mb: 2.5,
                        }}
                      >
                        {job.description}
                      </Typography>

                      <Stack sx={{
                        "& .MuiChip-root": {
                          color: "#fff",
                          background: "rgba(37,99,235,0.15)",
                          border: "1px solid rgba(37,99,235,0.3)",
                          fontWeight: 500,
                        }
                      }} direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                        <Chip label={job.department} />
                        <Chip label={job.location} />
                        <Chip label={job.jobType || "Full Time"} />
                      </Stack>
                    </Box>

                    <Button
                      onClick={() =>
                        handleApplyClick(
                          job.title,
                          job.description
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
              ))}

             
              {dynamicJobs.length > jobsPerPage && (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 5 }}>
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    variant="outlined"
                    sx={{
                      color: "#fff",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      borderRadius: "10px",
                      textTransform: "none",
                      px: 3,
                      "&:hover": { borderColor: "#2563EB", background: "rgba(37, 99, 235, 0.1)" },
                      "&.Mui-disabled": { color: "rgba(255, 255, 255, 0.2)", borderColor: "rgba(255, 255, 255, 0.05)" }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.9rem" }}>
                    Page {currentPage} of {Math.ceil(dynamicJobs.length / jobsPerPage)}
                  </Typography>
                  <Button
                    disabled={currentPage === Math.ceil(dynamicJobs.length / jobsPerPage)}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(dynamicJobs.length / jobsPerPage)))}
                    variant="outlined"
                    sx={{
                      color: "#fff",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      borderRadius: "10px",
                      textTransform: "none",
                      px: 3,
                      "&:hover": { borderColor: "#2563EB", background: "rgba(37, 99, 235, 0.1)" },
                      "&.Mui-disabled": { color: "rgba(255, 255, 255, 0.2)", borderColor: "rgba(255, 255, 255, 0.05)" }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
   
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          background: "#000000",
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
                fontWeight: 700,
                fontSize: {
                  xs: "1.6rem",
                  md: "2.2rem",
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

    
      <Dialog
        open={openApplyModal}
        onClose={() => setOpenApplyModal(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-container": {
            backdropFilter: "blur(12px)",
            background: "rgba(0, 0, 0, 0.4)",
          },
          "& .MuiDialog-paper": {
            background: "#000000 !important",
            color: "#ffffff !important",
            borderRadius: { xs: "20px", sm: "28px" },
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 80px rgba(37,99,235,.22)",
            margin: { xs: "16px", sm: "32px" },
            width: "100%",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "4px",
              background: "linear-gradient(90deg,#2563EB,#60A5FA)",
            },
          }
        }}
      >
        <DialogTitle component="div" sx={{ textAlign: "center", pt: 3.5, pb: 1, px: { xs: 2.5, sm: 4 } }}>
          <Typography fontWeight={700} sx={{ mb: 0.5, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
            Apply for {selectedJob.title || "Job"}
          </Typography>
          <Typography sx={{ color: "#94A3B8", maxWidth: "440px", mx: "auto", fontSize: { xs: "0.75rem", sm: "0.85rem" }, lineHeight: 1.5 }}>
            Submit your details and resume below.
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, pb: 1.5, pt: 0.5 }}>
          {selectedJob.description && (
            <Box
              sx={{
                p: 1.5,
                mb: 2,
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "#2563EB", fontWeight: 600, mb: 0.5 }}>
                Job Description:
              </Typography>
              <Typography sx={{ color: "#CBD5E1", fontSize: "0.85rem", lineHeight: 1.5 }}>
                {selectedJob.description}
              </Typography>
            </Box>
          )}
          <Stack spacing={1.5}>
            <TextField
              fullWidth
              size="small"
              label="Full Name"
              name="fullName"
              value={applyForm.fullName}
              onChange={handleApplyChange}
              error={!!applyErrors.fullName}
              helperText={applyErrors.fullName}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Email Address"
              name="email"
              value={applyForm.email}
              onChange={handleApplyChange}
              error={!!applyErrors.email}
              helperText={applyErrors.email}
              sx={fieldStyle}
            />
            <TextField
              fullWidth
              size="small"
              label="Mobile Number"
              name="mobile"
              value={applyForm.mobile}
              onChange={handleApplyChange}
              error={!!applyErrors.mobile}
              helperText={applyErrors.mobile}
              sx={fieldStyle}
            />
            <Button
              component="label"
              sx={{
                height: 90, borderRadius: "18px",
                border: "2px dashed rgba(37,99,235,.4)",
                background: "rgba(255,255,255,0.03)",
                display: "flex", flexDirection: "column", gap: 0.5,
                color: "#fff", textTransform: "none",
                "&:hover": { background: "rgba(37,99,235,.08)", borderColor: "#2563EB" },
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 28, color: "#2563EB" }} />
              <Typography fontWeight={600} fontSize="0.9rem">
                {resumeFile ? resumeFile.name : "Upload Resume"}
              </Typography>
              <Typography sx={{ fontSize: ".75rem", color: applyErrors.resume ? "#EF4444" : "#94A3B8" }}>
                {applyErrors.resume || "PDF, DOC, DOCX"}
              </Typography>
              <input
                hidden type="file" accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions sx={{
          px: { xs: 2.5, sm: 4 },
          pb: { xs: 3.5, sm: 4 },
          pt: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
          gap: { xs: 1.5, sm: 2 },
          "& .MuiButton-root": {
            width: { xs: "100%", sm: "auto" },
            margin: "0 !important"
          }
        }}>
          <Button onClick={() => setOpenApplyModal(false)} sx={{ color: "#94A3B8", textTransform: "none" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleApplySubmit}
            disabled={applyLoading}
            sx={{
              background: "linear-gradient(90deg,#2563EB,#3B82F6)",
              px: 4, py: 1.2, borderRadius: "12px", textTransform: "none", fontWeight: 600,
              boxShadow: "0 10px 30px rgba(37,99,235,.35)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(90deg,#1D4ED8,#2563EB)",
                boxShadow: "0 10px 35px rgba(37,99,235,.55)",
                transform: "translateY(-2px)"
              },
            }}
          >
            {applyLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogActions>
      </Dialog>

    
      <Dialog
        open={openResumeModal}
        onClose={() => setOpenResumeModal(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-container": {
            backdropFilter: "blur(12px)",
            background: "rgba(0, 0, 0, 0.4)",
          },
          "& .MuiDialog-paper": {
            background: "#000000 !important",
            color: "#ffffff !important",
            borderRadius: { xs: "20px", sm: "28px" },
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 80px rgba(37,99,235,.22)",
            margin: { xs: "16px", sm: "32px" },
            width: "100%",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "4px",
              background: "linear-gradient(90deg,#2563EB,#60A5FA)",
            },
          }
        }}
      >
        <DialogTitle component="div" sx={{ textAlign: "center", pt: 3.5, pb: 1, px: { xs: 2.5, sm: 4 } }}>
          <Box sx={{ width: 50, height: 50, mx: "auto", mb: 1.5, borderRadius: "16px", background: "rgba(37,99,235,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloudUploadOutlinedIcon sx={{ fontSize: 26, color: "#2563EB" }} />
          </Box>
          <Typography fontWeight={700} sx={{ mb: 0.5, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>Join Our Talent Network</Typography>
          <Typography sx={{ color: "#94A3B8", maxWidth: "440px", mx: "auto", fontSize: { xs: "0.75rem", sm: "0.85rem" }, lineHeight: 1.5 }}>
            Submit your profile and we'll reach out when a suitable opportunity becomes available.
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, pb: 1.5, pt: 0.5 }}>
          <Stack spacing={1.5}>
            <TextField
              fullWidth size="small" label="Full Name" name="fullName"
              value={talentForm.fullName} onChange={handleTalentChange}
              error={!!talentErrors.fullName} helperText={talentErrors.fullName}
              sx={fieldStyle}
            />
            <TextField
              fullWidth size="small" label="Email Address" name="email"
              value={talentForm.email} onChange={handleTalentChange}
              error={!!talentErrors.email} helperText={talentErrors.email}
              sx={fieldStyle}
            />
            <TextField
              fullWidth size="small" label="Mobile Number" name="mobile"
              value={talentForm.mobile} onChange={handleTalentChange}
              error={!!talentErrors.mobile} helperText={talentErrors.mobile}
              sx={fieldStyle}
            />
            <TextField
              select fullWidth size="small" label="Category" name="category"
              value={talentForm.category} onChange={handleTalentChange}
              error={!!talentErrors.category} helperText={talentErrors.category}
              sx={fieldStyle}
            >
              <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>
              <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
              <MenuItem value="Business Consultant">Business Consultant</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <Button
              component="label"
              sx={{
                height: 90, borderRadius: "18px",
                border: "2px dashed rgba(37,99,235,.4)",
                background: "rgba(255,255,255,0.03)",
                display: "flex", flexDirection: "column", gap: 0.5,
                color: "#fff", textTransform: "none",
                "&:hover": { background: "rgba(37,99,235,.08)", borderColor: "#2563EB" },
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 28, color: "#2563EB" }} />
              <Typography fontWeight={600} fontSize="0.9rem">
                {talentFile ? talentFile.name : "Upload Resume"}
              </Typography>
              <Typography sx={{ fontSize: ".75rem", color: talentErrors.resume ? "#EF4444" : "#94A3B8" }}>
                {talentErrors.resume || "PDF, DOC, DOCX"}
              </Typography>
              <input
                hidden type="file" accept=".pdf,.doc,.docx"
                onChange={(e) => setTalentFile(e.target.files[0])}
              />
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions sx={{
          px: { xs: 2.5, sm: 4 },
          pb: { xs: 3.5, sm: 4 },
          pt: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
          gap: { xs: 1.5, sm: 2 },
          "& .MuiButton-root": {
            width: { xs: "100%", sm: "auto" },
            margin: "0 !important"
          }
        }}>
          <Button onClick={() => setOpenResumeModal(false)} sx={{ color: "#94A3B8", textTransform: "none" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleTalentSubmit}
            disabled={talentLoading}
            sx={{
              background: "linear-gradient(90deg,#2563EB,#3B82F6)",
              px: 4, py: 1.2, borderRadius: "12px", textTransform: "none", fontWeight: 600,
              boxShadow: "0 10px 30px rgba(37,99,235,.35)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(90deg,#1D4ED8,#2563EB)",
                boxShadow: "0 10px 35px rgba(37,99,235,.55)",
                transform: "translateY(-2px)"
              },
            }}
          >
            {talentLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}

export default Career
