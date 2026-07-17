import React, { useState, useEffect, useRef } from 'react';
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
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import careerVideo from "../assets/career.mp4";
import perfectFitImg from "../assets/perfect-fit.jpg";
import cultureImg from "../assets/culture.jpg";
import growthImg from "../assets/growth.jpg";
import collaborationImg from "../assets/collaboration.jpg";
import successImg from "../assets/purpose.jpg";
import careerHeroIllustration from "../assets/career-hero-illustration.png";
import { toast } from "sonner";
import { applyJobAPI, submitTalentAPI, getJobsAPI } from "../services/allApi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputAdornment,
  Popover,
} from "@mui/material";
import { useLayoutEffect } from "react";

const countryCodes = [
  { code: "+91", name: "India (+91)" },
  { code: "+1", name: "United States (+1)" },
  { code: "+44", name: "United Kingdom (+44)" },
  { code: "+61", name: "Australia (+61)" },
  { code: "+1", name: "Canada (+1)" },
  { code: "+49", name: "Germany (+49)" },
  { code: "+33", name: "France (+33)" },
  { code: "+65", name: "Singapore (+65)" },
  { code: "+971", name: "United Arab Emirates (+971)" },
  { code: "+81", name: "Japan (+81)" },
  { code: "+86", name: "China (+86)" },
  { code: "+55", name: "Brazil (+55)" },
  { code: "+27", name: "South Africa (+27)" },
  { code: "+31", name: "Netherlands (+31)" },
  { code: "+39", name: "Italy (+39)" },
  { code: "+34", name: "Spain (+34)" },
  { code: "+7", name: "Russia (+7)" },
  { code: "+82", name: "South Korea (+82)" },
  { code: "+92", name: "Pakistan (+92)" },
  { code: "+880", name: "Bangladesh (+880)" },
  { code: "+966", name: "Saudi Arabia (+966)" },
];

function Career() {
  
  const SHOW_HERO_ILLUSTRATION = true; // Set to false to easily revert and show the original centered text-only hero layout
  const descRefs = useRef({});
  const staticDescRefs = useRef({});
const [showStaticReadMore, setShowStaticReadMore] = useState({});
const [showReadMore, setShowReadMore] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const lifeAtStrivoTabs = [
    {
      id: 'culture',
      label: 'Culture',
      title: 'Experience The Strivo Culture',
      description: 'Join a team driven by innovation, collaboration, and a passion for delivering meaningful outcomes. At Strivo, we foster an inclusive and dynamic environment where every voice matters. We believe that true excellence stems from diverse perspectives coming together to solve complex challenges. Enjoy a vibrant workspace, engaging team events, and a culture that actively promotes work-life balance and overall well-being.',
      image: cultureImg,
    },
    {
      id: 'growth',
      label: 'Growth',
      title: 'Continuous Learning & Mentorship',
      description: 'We nurture your talent with dedicated mentorship, tailored growth tracks, and structured pathways designed to unlock your full potential. Our comprehensive training programs provide you with the tools and resources needed to stay ahead of industry trends. Whether you are aiming to refine your technical skills or step into a leadership role, Strivo provides the support and opportunities necessary to accelerate your career trajectory.',
      image: growthImg,
    },
    {
      id: 'collaboration',
      label: 'Collaboration',
      title: 'Global Team Collaboration',
      description: 'Partner with domain experts worldwide. Share knowledge, build synergies, and co-create high-impact solutions for international clients. Our collaborative approach breaks down silos and encourages cross-functional teamwork, ensuring that the best ideas always rise to the top. By working alongside talented professionals from diverse backgrounds, you will gain invaluable insights and contribute to projects that make a real difference on a global scale.',
      image: collaborationImg,
    },
    {
      id: 'success',
      label: 'Success',
      title: 'Celebrating Team & Client Success',
      description: 'We drive outstanding business value and celebrate milestones together. Your contributions are recognized, rewarded, and amplified across the organization. At Strivo, we understand that our success is built on the hard work and dedication of our team members. We take pride in acknowledging individual achievements and celebrating team victories, fostering a culture of appreciation and mutual respect that motivates us all to strive for greatness.',
      image: successImg,
    }
  ];

  const [openApplyModal, setOpenApplyModal] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [selectedJob, setSelectedJob] = useState({
    title: "",
    description: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [talentFile, setTalentFile] = useState(null);

  const [applyForm, setApplyForm] = useState({ fullName: "", email: "", mobile: "" });
  const [applyCountryCode, setApplyCountryCode] = useState("+91");
  const [talentCountryCode, setTalentCountryCode] = useState("+91");
  const [expandedJobs, setExpandedJobs] = useState({});

  const toggleExpandJob = (jobKey) => {
    setExpandedJobs((prev) => ({ ...prev, [jobKey]: !prev[jobKey] }));
  };

  const [talentForm, setTalentForm] = useState({ fullName: "", email: "", mobile: "", category: "" });

  const [applyErrors, setApplyErrors] = useState({});
  const [talentErrors, setTalentErrors] = useState({});

  const [applyLoading, setApplyLoading] = useState(false);
  const [talentLoading, setTalentLoading] = useState(false);

  const [applyAnchorEl, setApplyAnchorEl] = useState(null);
  const [applySearchQuery, setApplySearchQuery] = useState("");

  const [talentAnchorEl, setTalentAnchorEl] = useState(null);
  const [talentSearchQuery, setTalentSearchQuery] = useState("");

  const filteredApplyCountryCodes = countryCodes.filter(item => 
    item.name.toLowerCase().includes(applySearchQuery.toLowerCase()) || 
    item.code.includes(applySearchQuery)
  );

  const filteredTalentCountryCodes = countryCodes.filter(item => 
    item.name.toLowerCase().includes(talentSearchQuery.toLowerCase()) || 
    item.code.includes(talentSearchQuery)
  );

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
  useLayoutEffect(() => {
  const result = {};

  Object.keys(staticDescRefs.current).forEach((key) => {
    const el = staticDescRefs.current[key];

    if (el) {
      result[key] = el.scrollHeight > el.clientHeight + 1;
    }
  });

  setShowStaticReadMore(result);
}, [expandedJobs]);
  useLayoutEffect(() => {
  const checkOverflow = () => {
    const result = {};

    dynamicJobs.forEach((job) => {
      const el = descRefs.current[job._id];

      if (el) {
        // Keep showing the button while expanded
        result[job._id] =
          expandedJobs[job._id] ||
          el.scrollHeight > el.clientHeight + 1;
      }
    });

    setShowReadMore(result);
  };

  requestAnimationFrame(checkOverflow);
}, [dynamicJobs, expandedJobs]);
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
    setApplyCountryCode("+91");
    setIsDescExpanded(false);
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!applyForm.fullName.trim()) errs.fullName = "Required";
    if (!applyForm.email.trim()) {
      errs.email = "Required";
    } else if (!emailRegex.test(applyForm.email.trim())) {
      errs.email = "Please enter a valid email address (e.g. name@example.com)";
    }
    if (!applyForm.mobile.trim()) errs.mobile = "Required";
    if (!resumeFile) errs.resume = "Please upload resume";
    return errs;
  };

  const validateTalent = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!talentForm.fullName.trim()) errs.fullName = "Required";
    if (!talentForm.email.trim()) {
      errs.email = "Required";
    } else if (!emailRegex.test(talentForm.email.trim())) {
      errs.email = "Please enter a valid email address (e.g. name@example.com)";
    }
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
    formData.append("mobile", applyCountryCode + " " + applyForm.mobile);
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
    formData.append("mobile", talentCountryCode + " " + talentForm.mobile);
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
      borderRadius: "3px",
      background: "var(--color-main-bg)",
      transition: "all 0.3s ease",
      overflow: "visible",

      "& fieldset": {
        borderColor: "var(--color-border)",
        transition: "all 0.3s ease",
      },

      "&:hover fieldset": {
        borderColor: "var(--color-primary)",
      },

      "&.Mui-focused fieldset": {
        borderColor: "var(--color-primary)",
      },

      "&.Mui-focused": {
        boxShadow: "0 0 14px rgba(71, 100, 255, 0.25)",
        background: "var(--color-sub-bg)",
      },
    },


    "& .MuiInputBase-input": {
      color: "var(--color-paragraph) !important",
    },
    "& .MuiSelect-select": {
      color: "var(--color-paragraph) !important",
    },

    "& .MuiInputLabel-root": {
      color: "var(--color-paragraph)",
      lineHeight: "1.4em",
      overflow: "visible",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "var(--color-primary)",
    },

    "& .MuiSvgIcon-root": {
      color: "var(--color-paragraph)",
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
        id="hero-section"
        sx={{
          height: SHOW_HERO_ILLUSTRATION ? { xs: "auto", md: "590px" } : { xs: "500px", md: "590px" },
          minHeight: SHOW_HERO_ILLUSTRATION ? { xs: "720px", md: "590px" } : "auto",
          py: SHOW_HERO_ILLUSTRATION ? { xs: 8, md: 0 } : 0,
          position: "sticky",
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "var(--color-primary)",
          zIndex: 0,
        }}
      >
        {/* Main Glow (Using a lighter shade for contrast against primary bg) */}
        <Box
          sx={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "var(--color-white)",
            filter: "blur(250px)",
            opacity: 0.15,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />



        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          {SHOW_HERO_ILLUSTRATION ? (
            <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "center" }}>
              {/* Left Column - Text Content */}
              <Grid size={{ xs: 12, md: 7 }}>
                <MotionBox
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  sx={{
                    textAlign: { xs: "center", md: "left" },
                    maxWidth: "650px",
                    mx: { xs: "auto", md: "0" },
                  }}
                >
                  <Typography
                  className='pre-heading'
                    sx={{
                      color: "var(--color-white)",
                      letterSpacing: "1px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      mb: 2,
                    }}
                  >
                    Careers At Strivo
                  </Typography>

                  <Box
                      component='h1'
                      className='main-heading text-white'
                      sx={{
                      fontFamily: "var(--font-primary)",
                      letterSpacing: "-0.5px",
                      mb: 2,
                      textAlign: { xs: "center", md: "left" },
                      }}
                      >
                    Build The Future With Us
                  </Box>

                  <Box
                  component='p'
                  className='main-paragraph'
                    sx={{
                      maxWidth: "580px",
                      mx: { xs: "auto", md: "0" },
                      mb: 5,
                    }}
                  >
                    Join a team of innovators, consultants, and technology
                    experts solving complex challenges for businesses worldwide.
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-start" },
                      width: "100%",
                      mt: 2,
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{
                        justifyContent: { xs: "center", md: "flex-start" },
                        alignItems: "center"
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => scrollToSection('open-positions')}
                        sx={{
                          px: 2.5,
                          height: "42px",
                          minWidth: "130px",
                          background: "var(--color-white)",
                          color: "var(--color-primary)",
                          borderRadius: "var(--radius-sm)",
                          fontWeight: "var(--font-bold)",
                          textTransform: "none",
                          fontSize: "var(--text-small)",
                          border: "1px solid transparent",
                          "&:hover": {
                            background: "#c4c4c4",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        Explore Open Roles
                      </Button>

                      <Button
                        variant="outlined"
                        onClick={() => scrollToSection('life-at-strivo')}
                        sx={{
                          px: 2.5,
                          height: "42px",
                          minWidth: "130px",
                          borderRadius: "var(--radius-sm)",
                          borderColor: "rgba(255,255,255,.4)",
                          color: "var(--color-white)",
                          textTransform: "none",
                          fontWeight: "var(--font-bold)",
                          fontSize: "var(--text-small)",
                          border: "1px solid rgba(255,255,255,.4)",
                          "&:hover": {
                            borderColor: "var(--color-white)",
                            color: "var(--color-primary)",
                            background: "var(--color-white)",
                          },
                        }}
                      >
                        Life At Strivo
                      </Button>
                    </Stack>
                  </Box>
                </MotionBox>
              </Grid>

              {/* Right Column - Team Illustration */}
              <Grid size={{ xs: 12, md: 5 }}>
                <MotionBox
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={careerHeroIllustration}
                    alt="Strivo Consultancy Team Illustration"
                    sx={{
                      width: "100%",
                      maxWidth: { xs: "300px", sm: "360px", md: "460px" },
                      height: "auto",
                      display: "block",
                      filter: "drop-shadow(0px 10px 25px rgba(0,0,0,0.15))",
                    }}
                  />
                </MotionBox>
              </Grid>
            </Grid>
          ) : (
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
                  color: "var(--color-white)",
                  letterSpacing: "3px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "var(--text-small)",
                  mb: 2,
                  opacity: 0.9,
                }}
              >
                Careers At Strivo
              </Typography>

              <Typography
                sx={{
                  color: "var(--color-white)",
                  fontWeight: "var(--font-semibold)",
                  lineHeight: 1.2,
                  mb: 3,
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.8rem",
                  },
                }}
              >
                Build The Future With Us
              </Typography>

              <Typography
                sx={{
                  color: "var(--color-white)",
                  maxWidth: "650px",
                  mx: "auto",
                  lineHeight: 1.6,
                  mb: 5,
                  opacity: 0.85,
                  fontSize: "var(--text-paragraph)",
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
                  spacing={2}
                  sx={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Button
                    variant="contained"
                    onClick={() => scrollToSection('open-positions')}
                    sx={{
                      px: 2.5,
                      height: "42px",
                      minWidth: "130px",
                      background: "var(--color-white)",
                      color: "var(--color-primary)",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: "var(--font-bold)",
                      textTransform: "none",
                      fontSize: "var(--text-small)",
                      boxShadow: "var(--shadow-button)",
                      border: "1px solid transparent",
                      "&:hover": {
                        background: "var(--color-sub-bg)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Explore Open Roles
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => scrollToSection('life-at-strivo')}
                    sx={{
                      px: 2.5,
                      height: "42px",
                      minWidth: "130px",
                      borderRadius: "var(--radius-sm)",
                      borderColor: "rgba(255,255,255,.4)",
                      color: "var(--color-white)",
                      textTransform: "none",
                      fontWeight: "var(--font-bold)",
                      fontSize: "var(--text-small)",
                      border: "1px solid rgba(255,255,255,.4)",
                      "&:hover": {
                        borderColor: "var(--color-white)",
                        background: "rgba(255,255,255,.1)",
                      },
                    }}
                  >
                    Life At Strivo
                  </Button>
                </Stack>
              </Box>
            </MotionBox>
          )}
        </Container>


        <MotionBox
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          onClick={() => scrollToSection('why-join-us')}
          sx={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            color: "var(--color-white)",
            cursor: "pointer",
          }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: 36 }} />
        </MotionBox>
      </Box>


      <Box
        id="why-join-us"
        sx={{
          py: { xs: 6, md: 8 },
          background: "var(--color-main-bg)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.3fr 0.9fr 0.9fr" },
              gridTemplateRows: { xs: "auto", md: "repeat(2, 220px)" },
              width: "100%",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            {/* Top Left */}
            <Box
              sx={{
                gridColumn: { xs: "1", md: "1 / 2" },
                gridRow: { xs: "auto", md: "1 / 2" },
                bgcolor: "var(--color-primary)",
                color: "var(--color-white)",
                p: { xs: 2.5, md: 3 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 1 }}>Great People</Typography>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  opacity: 0.9,
                  textAlign: "left",
                }}
              >
                Work with talented and passionate people who inspire and support you every day.
              </Typography>
            </Box>

            {/* Bottom Left */}
            <Box
              sx={{
                gridColumn: { xs: "1", md: "1 / 2" },
                gridRow: { xs: "auto", md: "2 / 3" },
                bgcolor: "var(--color-main-bg)",
                color: "var(--color-black)",
                p: { xs: 2.5, md: 3 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", mb: 1, lineHeight: 1.2 }}>Growth<br />Opportunities</Typography>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  color: "var(--color-paragraph)",
                  textAlign: "left",
                }}
              >
                We encourage continuous learning and provide the resources you need to grow your career.
              </Typography>
            </Box>

            {/* Middle Image */}
            <Box
              sx={{
                gridColumn: { xs: "1", md: "2 / 3" },
                gridRow: { xs: "auto", md: "1 / 3" },
              }}
            >
              <Box
                component="img"
                src="/team-fun.png"
                alt="Aesthetic Office Collaboration"
                sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </Box>

            {/* Top Right */}
            <Box
              sx={{
                gridColumn: { xs: "1", md: "3 / 5" },
                gridRow: { xs: "auto", md: "1 / 2" },
                bgcolor: "var(--color-white)",
                p: { xs: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.8rem", md: "2.1rem" }, lineHeight: 1.2, mb: 1.5, color: "var(--color-black)", textTransform: "uppercase" }}>
                WHY<br />
                CHOOSE<br />
                <span style={{ color: "var(--color-primary)" }}>US?</span>
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  color: "var(--color-paragraph)",
                  maxWidth: "350px",
                  textAlign: "left",
                }}
              >
                Everyday we work hard to make life of our clients better and happier.
              </Typography>
            </Box>

            {/* Bottom Right 1 */}
            <Box
              sx={{
                gridColumn: { xs: "1", md: "3 / 4" },
                gridRow: { xs: "auto", md: "2 / 3" },
                bgcolor: "#eef3f9",
                color: "var(--color-black)",
                p: { xs: 2.5, md: 3 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", mb: 1 }}>Make an Impact</Typography>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  color: "var(--color-paragraph)",
                  textAlign: "left",
                }}
              >
                Be part of meaningful projects that solve real problems and create lasting value.
              </Typography>
            </Box>

            {/* Bottom Right 2 */}
            <Box
              sx={{
                gridColumn: { xs: "1", md: "4 / 5" },
                gridRow: { xs: "auto", md: "2 / 3" },
                bgcolor: "#11161d",
                color: "var(--color-white)",
                p: { xs: 2.5, md: 3 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", mb: 1, lineHeight: 1.2 }}>Support &<br />Well-being</Typography>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  opacity: 0.8,
                  textAlign: "left",
                }}
              >
                We care about your well-being and offer a healthy, flexible and inclusive environment.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box
        id="life-at-strivo"
        sx={{
          height: { xs: "auto", md: "640px" },
          display: "flex",
          alignItems: "center",
          py: { xs: 4, md: 0 },
          background: "var(--color-sub-bg)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg" sx={{ width: "100%" }}>
          <Box
            sx={{
              textAlign: "left",
              mb: 2,
            }}
          >
            <Box
            component='p'
            className='pre-heading'
              sx={{
                mb: 0.5,
              }}
            >
              Life At Strivo
            </Box>

            <Box
            component='h2'
            className='sub-heading'
            >
              Our Culture & Workspace
            </Box>
          </Box>

          {/* Interactive Tabs Row */}
          <Stack
            direction="row"
            spacing={{ xs: 1.5, sm: 3 }}
            sx={{
              mb: 3,
              width: "100%",
              overflowX: "auto",
              pb: 0.5,
              "&::-webkit-scrollbar": { display: "none" }
            }}
          >
            {lifeAtStrivoTabs.map((tab, idx) => (
              <Box
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                sx={{
                  flex: 1,
                  minWidth: { xs: "90px", sm: "auto" },
                  textAlign: "center",
                  pb: 1,
                  cursor: "pointer",
                  borderBottom: activeTab === idx ? "3px solid var(--color-primary)" : "1px solid var(--color-border)",
                  transition: "all 0.3s ease",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    fontWeight: activeTab === idx ? "var(--font-semibold)" : "var(--font-medium)",
                    color: activeTab === idx ? "var(--color-primary)" : "var(--color-paragraph)",
                    whiteSpace: "nowrap",
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "var(--color-primary)",
                    }
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Tab Content Display */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 3, md: 8 }, alignItems: "center", width: "100%" }}>
            {/* Left side: Media (approx 40% width) */}
            <Box sx={{ flex: 4 }}>
              {activeTab === 0 ? (
                <Box
                  component="video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={careerVideo}
                  sx={{
                    width: "100%",
                    height: { xs: "180px", sm: "240px", md: "320px" },
                    objectFit: "cover",
                    borderRadius: "var(--radius-sm)",
                    boxShadow: "var(--shadow-card)",
                    display: "block",
                  }}
                />
              ) : (
                <Box
                  component="img"
                  src={lifeAtStrivoTabs[activeTab].image}
                  alt={lifeAtStrivoTabs[activeTab].label}
                  sx={{
                    width: "100%",
                    height: { xs: "180px", sm: "240px", md: "320px" },
                    objectFit: "cover",
                    borderRadius: "var(--radius-sm)",
                    boxShadow: "var(--shadow-card)",
                    display: "block",
                  }}
                />
              )}
            </Box>

            {/* Right side: Content (approx 60% width) */}
            <Box sx={{ flex: 6, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* Title */}
              <Typography
                sx={{
                  color: "var(--color-black)",
                  fontWeight: "var(--font-normal)",
                  fontSize: { xs: "1rem", sm: "1.25rem", md: "1.85rem" },
                  lineHeight: 1.2,
                  mb: { xs: 1, md: 2 },
                }}
              >
                {lifeAtStrivoTabs[activeTab].title}
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  color: "var(--color-paragraph)",
                  fontSize: "var(--text-paragraph)",
                  lineHeight: 1.7,
                  textAlign: "justify",
                  textJustify: "inter-word",
                  hyphens: "auto",
                }}
              >
                {lifeAtStrivoTabs[activeTab].description}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      <Box
        id="open-positions"
        sx={{
          minHeight: { xs: "auto", md: "640px" },
          py: { xs: 8, md: 4 },
          background: "var(--color-main-bg)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          {/* Heading */}
          <Box
            sx={{
              textAlign: "center",
              mb: 8,
            }}
          >
            <Box
            component='p'
            className='pre-heading'
              sx={{
                mb: 2,
              }}
            >
              Open Positions
            </Box>

            <Box
            component='p'
            className='sub-heading'
              sx={{
                mb: 3,
              }}
            >
              Find Your Next Opportunity
            </Box>

            <Typography
              sx={{
                color: "var(--color-paragraph)",
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

          <Box sx={{ width: "100%", mx: "auto" }}>
            <MotionBox whileHover={{ y: -5 }} sx={{ mb: 3 }}>
              <Box
                sx={{
                  minHeight: { xs: "auto", md: 250 },
                  p: { xs: 2.5, sm: 3, md: 4 },
                  borderRadius: "3px",
                  background: "var(--color-sub-bg)",
                  border: "1px solid var(--color-border)",
                  backdropFilter: "blur(20px)",
                  transition: "all .3s ease",

                  "&:hover": {
                    background: "var(--color-white)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                  },

                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                  justifyContent: "space-between",
                  alignItems: {
                    xs: "stretch",
                    md: "center",
                  },
                  gap: 3,
                }}
              >
                <Box sx={{ maxWidth: "750px", width: "100%", minWidth: 0 }}>
                  <Typography
  ref={(el) => (staticDescRefs.current.frontend = el)}
                    sx={{
                      color: "var(--color-black)",
                      fontSize: "1.35rem",
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Senior Strategy Consultant
                  </Typography>

                  <Typography
                    sx={{
                      color: "var(--color-paragraph)",
                      lineHeight: 1.8,
                      mb: showStaticReadMore.frontend ? (expandedJobs["frontend"] ? 1.5 : 0.5) : 2.5,
                      display: "-webkit-box",
                      WebkitLineClamp: expandedJobs["frontend"] ? "none" : 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textAlign: "justify",
                      textJustify: "inter-word",
                      hyphens: "auto",
                    }}
                  >
                    Lead high-priority consulting engagements, analyze market data,
                    and collaborate with C-suite executives to formulate growth strategies,
                    improve business processes, and drive organizational transformation.
                  </Typography>
                  {showStaticReadMore.frontend && (
<Button
                    onClick={() => toggleExpandJob("frontend")}
                    sx={{
                      textTransform: "none",
                      color: "var(--color-primary)",
                      p: 0,
                      minWidth: "auto",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      mb: 2.5,
                      display: "inline-block",
                      "&:hover": { background: "transparent", textDecoration: "underline" }
                    }}
                  >
                    {expandedJobs["frontend"] ? "Read less" : "Read more"}
                  </Button>
)}

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                      "& .MuiChip-root": {
                        color: "var(--color-primary)",
                        background: "rgba(1, 42, 89, 0.08)",
                        border: "1px solid rgba(1, 42, 89, 0.2)",
                        fontWeight: 500,
                        maxWidth: "100%",
                        height: "auto",
                        "& .MuiChip-label": {
                          whiteSpace: "normal",
                          display: "block",
                          py: 0.5,
                        }
                      }
                    }}
                  >
                    <Chip label="Strategy" />
                    <Chip label="Remote" />
                    <Chip label="Full Time" />
                  </Box>
                </Box>

                <Button

                  onClick={() =>
                    handleApplyClick(
                      "Senior Strategy Consultant",
                      "Lead high-priority consulting engagements, analyze market data, and collaborate with C-suite executives to formulate growth strategies, improve business processes, and drive organizational transformation."
                    )
                  }
                  variant="contained"
                  sx={{
                    background: "var(--color-primary)",
                    borderRadius: "var(--radius-sm)",
                    px: 3,
                    minWidth: "130px",
                    height: "42px",
                    textTransform: "none",
                    fontWeight: "var(--font-bold)",
                    whiteSpace: "nowrap",
                    boxShadow: "var(--shadow-button)",
                    "&:hover": {
                      background: "var(--color-primary-hover)",
                      transform: "translateY(-2px)",
                    }
                  }}
                >
                  Apply Now
                </Button>
              </Box>
            </MotionBox>


            <MotionBox whileHover={{ y: -5 }} sx={{ mb: 3 }}>
              <Box
                sx={{
                  minHeight: { xs: "auto", md: 250 },
                  p: { xs: 2.5, sm: 3, md: 4 },
                  borderRadius: "3px",
                  background: "var(--color-sub-bg)",
                  border: "1px solid var(--color-border)",
                  backdropFilter: "blur(20px)",
                  transition: "all .3s ease",

                  "&:hover": {
                    background: "var(--color-white)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                  },

                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                  justifyContent: "space-between",
                  alignItems: {
                    xs: "stretch",
                    md: "center",
                  },
                  gap: 3,
                }}
              >
                <Box sx={{ maxWidth: "750px", width: "100%", minWidth: 0 }}>
                  <Typography ref={(el) => (staticDescRefs.current.uiux = el)}
                    sx={{
                      color: "var(--color-black)",
                      fontSize: "1.35rem",
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Operations & Management Consultant
                  </Typography>

                  <Typography
                    sx={{
                      color: "var(--color-paragraph)",
                      lineHeight: 1.8,
                      mb: showStaticReadMore.uiux ? (expandedJobs["uiux"] ? 1.5 : 0.5) : 2.5,
                      display: "-webkit-box",
                      WebkitLineClamp: expandedJobs["uiux"] ? "none" : 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textAlign: "justify",
                      textJustify: "inter-word",
                      hyphens: "auto",
                    }}
                  >
                    Evaluate company workflows, design organizational changes,
                    and optimize supply chain/business operations to enhance efficiency,
                    reduce costs, and accelerate overall business performance.
                  </Typography>
                  {showStaticReadMore.uiux && (
   <Button 
                    onClick={() => toggleExpandJob("uiux")}
                    sx={{
                      textTransform: "none",
                      color: "var(--color-primary)",
                      p: 0,
                      minWidth: "auto",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      mb: 2.5,
                      display: "inline-block",
                      "&:hover": { background: "transparent", textDecoration: "underline" }
                    }}
                  >
                    {expandedJobs["uiux"] ? "Read less" : "Read more"}
                 </Button>
)}

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                      "& .MuiChip-root": {
                        color: "var(--color-primary)",
                        background: "rgba(1, 42, 89, 0.08)",
                        border: "1px solid rgba(1, 42, 89, 0.2)",
                        fontWeight: 500,
                        maxWidth: "100%",
                        height: "auto",
                        "& .MuiChip-label": {
                          whiteSpace: "normal",
                          display: "block",
                          py: 0.5,
                        }
                      }
                    }}
                  >
                    <Chip label="Operations" />
                    <Chip label="Kochi" />
                    <Chip label="Full Time" />
                  </Box>
                </Box>

                <Button
                  onClick={() =>
                    handleApplyClick(
                      "Operations & Management Consultant",
                      "Evaluate company workflows, design organizational changes, and optimize supply chain/business operations to enhance efficiency, reduce costs, and accelerate overall business performance."
                    )
                  }
                  variant="contained"
                  sx={{
                    background: "var(--color-primary)",
                    borderRadius: "var(--radius-sm)",
                    px: 3,
                    minWidth: "130px",
                    height: "42px",
                    textTransform: "none",
                    fontWeight: "var(--font-bold)",
                    whiteSpace: "nowrap",
                    boxShadow: "var(--shadow-button)",
                    "&:hover": {
                      background: "var(--color-primary-hover)",
                      transform: "translateY(-2px)",
                    }
                  }}
                >
                  Apply Now
                </Button>
              </Box>
            </MotionBox>


            <MotionBox whileHover={{ y: -5 }}>
              <Box
                sx={{
                  minHeight: { xs: "auto", md: 250 },
                  p: { xs: 2.5, sm: 3, md: 4 },
                  borderRadius: "3px",
                  background: "var(--color-sub-bg)",
                  border: "1px solid var(--color-border)",
                  backdropFilter: "blur(20px)",
                  transition: "all .3s ease",

                  "&:hover": {
                    background: "var(--color-white)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                  },

                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                  justifyContent: "space-between",
                  alignItems: {
                    xs: "stretch",
                    md: "center",
                  },
                  gap: 3,
                }}
              >
                <Box sx={{ maxWidth: "750px", width: "100%", minWidth: 0 }}>
                  <Typography ref={(el) => (staticDescRefs.current.consultant = el)}
                    sx={{
                      color: "var(--color-black)",
                      fontSize: "1.35rem",
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Business Consultant
                  </Typography>

                  <Typography
                    sx={{
                      color: "var(--color-paragraph)",
                      lineHeight: 1.8,
                      mb: showStaticReadMore.consultant ? (expandedJobs["consultant"] ? 1.5 : 0.5) : 2.5,
                      display: "-webkit-box",
                      WebkitLineClamp: expandedJobs["consultant"] ? "none" : 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textAlign: "justify",
                      textJustify: "inter-word",
                      hyphens: "auto",
                    }}
                  >
                    Work closely with clients to analyze business
                    challenges, identify growth opportunities, and
                    deliver strategic solutions that drive measurable
                    outcomes and transformation.
                  </Typography>
                  {showStaticReadMore.consultant && (
   <Button
                    onClick={() => toggleExpandJob("consultant")}
                    sx={{
                      textTransform: "none",
                      color: "var(--color-primary)",
                      p: 0,
                      minWidth: "auto",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      mb: 2.5,
                      display: "inline-block",
                      "&:hover": { background: "transparent", textDecoration: "underline" }
                    }}
                  >
                    {expandedJobs["consultant"] ? "Read less" : "Read more"}
                 </Button>
)}

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                      "& .MuiChip-root": {
                        color: "var(--color-primary)",
                        background: "rgba(1, 42, 89, 0.08)",
                        border: "1px solid rgba(1, 42, 89, 0.2)",
                        fontWeight: 500,
                        maxWidth: "100%",
                        height: "auto",
                        "& .MuiChip-label": {
                          whiteSpace: "normal",
                          display: "block",
                          py: 0.5,
                        }
                      }
                    }}
                  >
                    <Chip label="Consulting" />
                    <Chip label="Dubai" />
                    <Chip label="Full Time" />
                  </Box>
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
                    background: "var(--color-primary)",
                    borderRadius: "var(--radius-sm)",
                    px: 3,
                    minWidth: "130px",
                    height: "42px",
                    textTransform: "none",
                    fontWeight: "var(--font-bold)",
                    whiteSpace: "nowrap",
                    boxShadow: "var(--shadow-button)",
                    "&:hover": {
                      background: "var(--color-primary-hover)",
                      transform: "translateY(-2px)",
                    }
                  }}
                >
                  Apply Now
                </Button>
              </Box>
            </MotionBox>


            {dynamicJobs.length > 0 && (
              <Box sx={{ mt: 3 }}>

                {dynamicJobs
  .slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
  .map((job) => {



    return (
                  <MotionBox key={job._id} whileHover={{ y: -5 }} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        minHeight: { xs: "auto", md: 250 },
                        p: { xs: 2.5, sm: 3, md: 4 },
                        borderRadius: "3px",
                        background: "var(--color-sub-bg)",
                        border: "1px solid var(--color-border)",
                        backdropFilter: "blur(20px)",
                        transition: "all .3s ease",

                        "&:hover": {
                          background: "var(--color-white)",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                        },

                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          md: "row",
                        },
                        justifyContent: "space-between",
                        alignItems: {
                          xs: "stretch",
                          md: "center",
                        },
                        gap: 3,
                      }}
                    >
                      <Box sx={{ maxWidth: "750px", width: "100%", minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "var(--color-black)",
                            fontSize: "1.35rem",
                            fontWeight: 700,
                            mb: 1,
                          }}
                        >
                          {job.title}
                        </Typography>

                      <Typography
  ref={(el) => (descRefs.current[job._id] = el)}
  sx={{
    color: "var(--color-paragraph)",
    lineHeight: 1.8,
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: expandedJobs[job._id] ? "unset" : 3,
    overflow: "hidden",

    minHeight: expandedJobs[job._id] ? "auto" : "86px", // height of 3 lines
    mb: (showReadMore[job._id] || expandedJobs[job._id]) ? 1.5 : 2.5,
  }}
>
  {job.description}
</Typography>
{(showReadMore[job._id] || expandedJobs[job._id]) && (
  <Box
    sx={{
      minHeight: "32px",
      display: "flex",
      alignItems: "center",
      mb: 2,
    }}
  >
    <Button
      onClick={() => toggleExpandJob(job._id)}
      sx={{
        p: 0,
        minWidth: 0,
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.85rem",
        color: "var(--color-primary)",
        "&:hover": {
          background: "transparent",
          textDecoration: "underline",
        },
      }}
    >
      {expandedJobs[job._id] ? "Read less" : "Read more"}
    </Button>
  </Box>
)}
                        <Box
                          sx={{ 
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1.5,
                            "& .MuiChip-root": {
                              color: "var(--color-primary)",
                              background: "rgba(1, 42, 89, 0.08)",
                              border: "1px solid rgba(1, 42, 89, 0.2)",
                              fontWeight: 500,
                              maxWidth: "100%",
                              height: "auto",
                              "& .MuiChip-label": {
                                whiteSpace: "normal",
                                display: "block",
                                py: 0.5,
                              }
                            }
                          }}
                        >
                          <Chip label={job.department} />
                          <Chip label={job.location} />
                          <Chip label={job.jobType || "Full Time"} />
                        </Box>
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
                          background: "var(--color-primary)",
                          borderRadius: "var(--radius-sm)",
                          px: 3,
                          minWidth: "130px",
                          height: "42px",
                          textTransform: "none",
                          fontWeight: "var(--font-bold)",
                          whiteSpace: "nowrap",
                          boxShadow: "var(--shadow-button)",
                          "&:hover": {
                            background: "var(--color-primary-hover)",
                            transform: "translateY(-2px)",
                          }
                        }}
                      >
                        Apply Now
                      </Button>
                    </Box>
                  </MotionBox>
                  );
  })}

                {dynamicJobs.length > jobsPerPage && (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 5 }}>
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      variant="outlined"
                      sx={{
                        color: "var(--color-paragraph)",
                        borderColor: "var(--color-border)",
                        borderRadius: "3px",
                        textTransform: "none",
                        px: 3,
                        "&:hover": { borderColor: "var(--color-primary)", background: "rgba(71, 100, 255, 0.1)" },
                        "&.Mui-disabled": { color: "rgba(0, 0, 0, 0.2)", borderColor: "rgba(0, 0, 0, 0.05)" }
                      }}
                    >
                      Previous
                    </Button>
                    <Typography sx={{ color: "var(--color-paragraph)", opacity: 0.6, fontSize: "0.9rem" }}>
                      Page {currentPage} of {Math.ceil(dynamicJobs.length / jobsPerPage)}
                    </Typography>
                    <Button
                      disabled={currentPage === Math.ceil(dynamicJobs.length / jobsPerPage)}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(dynamicJobs.length / jobsPerPage)))}
                      variant="outlined"
                      sx={{
                        color: "var(--color-paragraph)",
                        borderColor: "var(--color-border)",
                        borderRadius: "3px",
                        textTransform: "none",
                        px: 3,
                        "&:hover": { borderColor: "var(--color-primary)", background: "rgba(71, 100, 255, 0.1)" },
                        "&.Mui-disabled": { color: "rgba(0, 0, 0, 0.2)", borderColor: "rgba(0, 0, 0, 0.05)" }
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Box
        id="perfect-fit"
        sx={{
          height: { xs: "auto", md: "640px" },
          display: "flex",
          alignItems: "center",
          py: { xs: 6, md: 8 },
          px: 2,
          background: "var(--color-sub-bg)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              borderRadius: "3px",
              background: "var(--color-primary)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              overflow: "hidden",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {/* Left Side: Content */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", sm: "1 1 50%" },
                width: { xs: "100%", sm: "50%" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                p: { xs: 4, sm: 5, md: 5 },
                textAlign: "left",
                boxSizing: "border-box",
              }}
            >
              {/* Tagline */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <Box sx={{ width: "3px", height: "18px", backgroundColor: "var(--color-white)" }} />
                <Typography
                  sx={{
                    color: "var(--color-white)",
                    fontWeight: "var(--font-semibold)",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    fontSize: "0.85rem",
                    opacity: 0.9,
                  }}
                >
                  WE'RE ALWAYS GROWING
                </Typography>
              </Box>

              {/* Heading */}
              <Typography
                sx={{
                  color: "var(--color-white)",
                  fontWeight: "var(--font-semibold)",
                  lineHeight: 1.2,
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.4rem",
                  },
                  mb: 2,
                }}
              >
                Don't See a<br />Perfect Fit?
              </Typography>

              {/* Line Divider */}
              <Box sx={{ width: "45px", height: "3px", backgroundColor: "var(--color-white)", mb: 2.5 }} />

              {/* Description */}
              <Box
              component='p'
              className='main-paragraph'
                sx={{
                  maxWidth: "480px",
                  mb: 3.5,
                  textAlign: "justify",
                  textJustify: "inter-word",
                  hyphens: "auto",
                }}
              >
                We are always looking for exceptional talent to join our team.
                Send us your resume and we'll reach out when a relevant position
                becomes available.
              </Box>

              {/* CTA Button */}
              <Button
                variant="contained"
                onClick={() => {
                  setTalentCountryCode("+91");
                  setOpenResumeModal(true);
                }}
                sx={{
                  background: "var(--color-white)",
                  color: "var(--color-primary)",
                  px: 2.5,
                  height: "42px",
                  minWidth: "130px",
                  borderRadius: "var(--radius-sm)",
                  textTransform: "none",
                  fontWeight: "var(--font-bold)",
                  fontSize: "0.95rem",
                  boxShadow: "var(--shadow-button)",
                  "&:hover": {
                    background: "#c4c4c4",
                    transform: "translateY(-2px)",
                    boxShadow: "var(--shadow-button)",
                  },
                }}
              >
                Submit Your Resume
              </Button>
            </Box>

            {/* Right Side: Image */}
            <Box
              sx={{
                flex: { xs: "none", sm: "1 1 50%" },
                width: { xs: "100%", sm: "50%" },
                position: "relative",
                minHeight: { xs: "300px", sm: "auto" },
              }}
            >
              <Box
                component="img"
                src={perfectFitImg}
                alt="Strivo Team"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>


      <Dialog
        open={openApplyModal}
        onClose={() => setOpenApplyModal(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-container": {
            backgroundColor: "rgba(10,15,30,0.7)",
            backdropFilter: "blur(8px)",
          },
          "& .MuiDialog-paper": {
            borderRadius: "3px",
            background: "var(--color-main-bg)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            maxWidth: "440px",
          },
        }}
      >
        <DialogTitle component="div" sx={{ textAlign: "center", pt: 3.5, pb: 1, px: { xs: 2.5, sm: 4 } }}>
          <Typography fontWeight={700} sx={{ mb: 0.5, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
            Apply for {selectedJob.title || "Job"}
          </Typography>
          <Typography sx={{ color: "var(--color-paragraph)", maxWidth: "440px", mx: "auto", fontSize: { xs: "0.75rem", sm: "0.85rem" }, lineHeight: 1.5 }}>
            Submit your details and resume below.
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, pb: 1.5, pt: 2.5 }}>
          <Stack spacing={2} sx={{ mt: 1.5 }}>
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

            {/* Custom Searchable Country Selector Phone Field with MUI Popover */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: "100%", textAlign: "left" }}>
              <Typography sx={{ color: "var(--color-paragraph)", fontWeight: 500, fontSize: "0.85rem", ml: 1 }}>
                Mobile Number
              </Typography>
              <div 
                className={`flex items-center w-full bg-white rounded-[var(--radius-sm)] border transition-colors focus-within:ring-2 ${
                  applyErrors.mobile 
                    ? "border-[#EF4444] focus-within:ring-red-500/30" 
                    : "border-gray-300 focus-within:ring-blue-500"
                }`}
                style={{ height: "38px" }}
              >
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      setApplyAnchorEl(e.currentTarget);
                      setApplySearchQuery("");
                    }}
                    className="paragraph h-full flex items-center justify-between text-black pl-3 pr-1 py-1.5 bg-transparent focus:outline-none text-sm w-auto max-w-[64px]"
                    style={{ border: "none", outline: "none", cursor: "pointer", display: "flex", alignItems: "center", height: "100%" }}
                  >
                    <span className="truncate">{applyCountryCode}</span>
                    <span className="text-gray-500 shrink-0 ml-0.5" style={{ fontSize: "9px" }}>▼</span>
                  </button>

                  <Popover
                    open={Boolean(applyAnchorEl)}
                    anchorEl={applyAnchorEl}
                    onClose={() => setApplyAnchorEl(null)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    PaperProps={{
                      sx: {
                        width: 250,
                        maxHeight: 250,
                        border: "1px solid var(--color-border)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                        borderRadius: "3px",
                        background: "var(--color-main-bg)",
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                      }
                    }}
                  >
                    <Box sx={{ p: 0.5, borderBottom: "1px solid var(--color-border)", mb: 0.5 }}>
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={applySearchQuery}
                        onChange={(e) => setApplySearchQuery(e.target.value)}
                        className="w-full bg-white text-black text-xs rounded-[var(--radius-sm)] px-2 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        style={{ border: "1px solid #D1D5DB" }}
                      />
                    </Box>
                    <Box sx={{ overflowY: "auto", flex: 1 }}>
                      {filteredApplyCountryCodes.length > 0 ? (
                        filteredApplyCountryCodes.map((item) => (
                          <Button
                            key={`${item.name}-${item.code}`}
                            onClick={() => {
                              setApplyCountryCode(item.code);
                              setApplyAnchorEl(null);
                            }}
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              textTransform: "none",
                              color: "var(--color-paragraph)",
                              px: 1.5,
                              py: 0.8,
                              fontSize: "0.85rem",
                              "&:hover": {
                                background: "rgba(71, 100, 255, 0.08)",
                              }
                            }}
                          >
                            <span className="truncate mr-2" style={{ color: "black", textAlign: "left" }}>{item.name}</span>
                            <span style={{ color: "#6B7280", fontFamily: "monospace" }}>{item.code}</span>
                          </Button>
                        ))
                      ) : (
                        <Typography sx={{ p: 1.5, fontSize: "0.75rem", color: "gray", textAlign: "center" }}>
                          No results found
                        </Typography>
                      )}
                    </Box>
                  </Popover>
                </div>

                <input
                  type="tel"
                  name="mobile"
                  value={applyForm.mobile}
                  onChange={handleApplyChange}
                  placeholder=""
                  className="paragraph min-w-0 flex-1 bg-transparent text-black placeholder-gray-500 pl-2 pr-4 py-1.5 focus:outline-none"
                  style={{ border: "none", outline: "none", height: "100%", fontSize: "14px" }}
                />
              </div>
              {applyErrors.mobile && (
                <Typography sx={{ color: "#EF4444", fontSize: "0.75rem", mt: 0.5, ml: 1 }}>
                  {applyErrors.mobile}
                </Typography>
              )}
            </Box>

            <Button
              component="label"
              sx={{
                height: 70, borderRadius: "3px",
                border: "2px dashed rgba(71,100,255,.4)",
                background: "var(--color-sub-bg)",
                display: "flex", flexDirection: "column", justifyContext: "center", gap: 0.2,
                color: "var(--color-paragraph)", textTransform: "none",
                py: 1,
                "&:hover": { background: "rgba(71,100,255,.08)", borderColor: "var(--color-primary)" },
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 24, color: "var(--color-primary)" }} />
              <Typography fontWeight={600} fontSize="0.85rem">
                {resumeFile ? resumeFile.name : "Upload Resume"}
              </Typography>
              <Typography sx={{ fontSize: ".7rem", color: applyErrors.resume ? "#EF4444" : "#94A3B8" }}>
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
          <button
            type="button"
            onClick={() => setOpenApplyModal(false)}
            className="bg-[var(--color-sub-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-paragraph)] px-4 py-1.5 rounded-[var(--radius-sm)] cursor-pointer text-xs font-semibold transition-colors h-[42px] min-w-[130px] w-full sm:w-auto"
          >
            Cancel
          </button>
          <Button
            variant="contained"
            onClick={handleApplySubmit}
            disabled={applyLoading}
            sx={{
              background: "var(--color-primary)",
              px: 4, height: "42px", minWidth: "130px", borderRadius: "var(--radius-sm)", textTransform: "none", fontWeight: "var(--font-bold)",
              boxShadow: "var(--shadow-button)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "var(--color-primary-hover)",
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
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-container": {
            backgroundColor: "rgba(10,15,30,0.7)",
            backdropFilter: "blur(8px)",
          },
          "& .MuiDialog-paper": {
            borderRadius: "3px",
            background: "var(--color-main-bg)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            maxWidth: "440px",
          },
        }}
      >
        <DialogTitle component="div" sx={{ textAlign: "center", pt: 3.5, pb: 1, px: { xs: 2.5, sm: 4 } }}>
          <Typography fontWeight={700} sx={{ mb: 0.5, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>Join Our Talent Network</Typography>
          <Typography sx={{ color: "var(--color-paragraph)", maxWidth: "440px", mx: "auto", fontSize: { xs: "0.75rem", sm: "0.85rem" }, lineHeight: 1.5 }}>
            Submit your profile and we'll reach out when a suitable opportunity becomes available.
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, pb: 1.5, pt: 2.5 }}>
          <Stack spacing={2} sx={{ mt: 1.5 }}>
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

            {/* Custom Searchable Country Selector Phone Field with MUI Popover */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: "100%", textAlign: "left" }}>
              <Typography sx={{ color: "var(--color-paragraph)", fontWeight: 500, fontSize: "0.85rem", ml: 1 }}>
                Mobile Number
              </Typography>
              <div 
                className={`flex items-center w-full bg-white rounded-[var(--radius-sm)] border transition-colors focus-within:ring-2 ${
                  talentErrors.mobile 
                    ? "border-[#EF4444] focus-within:ring-red-500/30" 
                    : "border-gray-300 focus-within:ring-blue-500"
                }`}
                style={{ height: "38px" }}
              >
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      setTalentAnchorEl(e.currentTarget);
                      setTalentSearchQuery("");
                    }}
                    className="paragraph h-full flex items-center justify-between text-black pl-3 pr-1 py-1.5 bg-transparent focus:outline-none text-sm w-auto max-w-[64px]"
                    style={{ border: "none", outline: "none", cursor: "pointer", display: "flex", alignItems: "center", height: "100%" }}
                  >
                    <span className="truncate">{talentCountryCode}</span>
                    <span className="text-gray-500 shrink-0 ml-0.5" style={{ fontSize: "9px" }}>▼</span>
                  </button>

                  <Popover
                    open={Boolean(talentAnchorEl)}
                    anchorEl={talentAnchorEl}
                    onClose={() => setTalentAnchorEl(null)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    PaperProps={{
                      sx: {
                        width: 250,
                        maxHeight: 250,
                        border: "1px solid var(--color-border)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                        borderRadius: "3px",
                        background: "var(--color-main-bg)",
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                      }
                    }}
                  >
                    <Box sx={{ p: 0.5, borderBottom: "1px solid var(--color-border)", mb: 0.5 }}>
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={talentSearchQuery}
                        onChange={(e) => setTalentSearchQuery(e.target.value)}
                        className="w-full bg-white text-black text-xs rounded-[var(--radius-sm)] px-2 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        style={{ border: "1px solid #D1D5DB" }}
                      />
                    </Box>
                    <Box sx={{ overflowY: "auto", flex: 1 }}>
                      {filteredTalentCountryCodes.length > 0 ? (
                        filteredTalentCountryCodes.map((item) => (
                          <Button
                            key={`${item.name}-${item.code}`}
                            onClick={() => {
                              setTalentCountryCode(item.code);
                              setTalentAnchorEl(null);
                            }}
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              textTransform: "none",
                              color: "var(--color-paragraph)",
                              px: 1.5,
                              py: 0.8,
                              fontSize: "0.85rem",
                              "&:hover": {
                                background: "rgba(71, 100, 255, 0.08)",
                              }
                            }}
                          >
                            <span className="truncate mr-2" style={{ color: "black", textAlign: "left" }}>{item.name}</span>
                            <span style={{ color: "#6B7280", fontFamily: "monospace" }}>{item.code}</span>
                          </Button>
                        ))
                      ) : (
                        <Typography sx={{ p: 1.5, fontSize: "0.75rem", color: "gray", textAlign: "center" }}>
                          No results found
                        </Typography>
                      )}
                    </Box>
                  </Popover>
                </div>
                <input
                  type="tel"
                  name="mobile"
                  value={talentForm.mobile}
                  onChange={handleTalentChange}
                  placeholder=""
                  className="paragraph min-w-0 flex-1 bg-transparent text-black placeholder-gray-500 pl-2 pr-4 py-1.5 focus:outline-none"
                  style={{ border: "none", outline: "none", height: "100%", fontSize: "14px" }}
                />
              </div>
              {talentErrors.mobile && (
                <Typography sx={{ color: "#EF4444", fontSize: "0.75rem", mt: 0.5, ml: 1 }}>
                  {talentErrors.mobile}
                </Typography>
              )}
            </Box>

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
                height: 70, borderRadius: "3px",
                border: "2px dashed rgba(71,100,255,.4)",
                background: "var(--color-sub-bg)",
                display: "flex", flexDirection: "column", justifyContext: "center", gap: 0.2,
                color: "var(--color-paragraph)", textTransform: "none",
                py: 1,
                "&:hover": { background: "rgba(71,100,255,.08)", borderColor: "var(--color-primary)" },
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 24, color: "var(--color-primary)" }} />
              <Typography fontWeight={600} fontSize="0.85rem">
                {talentFile ? talentFile.name : "Upload Resume"}
              </Typography>
              <Typography sx={{ fontSize: ".7rem", color: talentErrors.resume ? "#EF4444" : "#94A3B8" }}>
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
          <button
            type="button"
            onClick={() => setOpenResumeModal(false)}
            className="bg-[var(--color-sub-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-paragraph)] px-4 py-1.5 rounded-[var(--radius-sm)] cursor-pointer text-xs font-semibold transition-colors h-[42px] min-w-[130px] w-full sm:w-auto"
          >
            Cancel
          </button>
          <Button
            variant="contained"
            onClick={handleTalentSubmit}
            disabled={talentLoading}
            sx={{
              background: "var(--color-primary)",
              px: 4, height: "42px", minWidth: "130px", borderRadius: "var(--radius-sm)", textTransform: "none", fontWeight: "var(--font-bold)",
              boxShadow: "var(--shadow-button)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "var(--color-primary-hover)",
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
