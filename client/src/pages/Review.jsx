import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { submitReviewAPI } from "../services/allApi";
import { toast } from "sonner";
import homeHero from "../assets/homehero.jpg";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isHighlighted = star <= (hovered || value);

          return (
            <Box
              key={star}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              sx={{
                cursor: "pointer",
                lineHeight: 0,
                transition: "transform 0.15s ease",
                "&:hover": { transform: "scale(1.2)" }
              }}
            >
              {isHighlighted ? (
                <StarIcon
                  sx={{
                    fontSize: 32,
                    color: "#F59E0B",
                    filter: "drop-shadow(0 0 6px rgba(245,158,11,0.5))"
                  }}
                />
              ) : (
                <StarBorderIcon
                  sx={{
                    fontSize: 32,
                    color: "#334155"
                  }}
                />
              )}
            </Box>
          );
        })}

        {(hovered || value) > 0 && (
          <Typography
            sx={{
              ml: 1.5,
              color: "#F59E0B",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            {labels[hovered || value]}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "var(--color-black)",
    borderRadius: "3px",
    background: "var(--color-main-bg)",
    transition: "all 0.3s ease",
    "& fieldset": { borderColor: "var(--color-border)" },
    "&:hover fieldset": { borderColor: "rgba(71,100,255,0.5)" },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-primary)",
      boxShadow: "none",
    },
  },
  "& .MuiInputLabel-root": { color: "var(--color-paragraph)", fontSize: "0.9rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
};

const guidelines = [
  {
    title: "Be Specific",
    desc: "Focus on tangible outcomes and specific strategic initiatives we partnered on.",
  },
  {
    title: "Keep It Professional",
    desc: "Maintain a constructive tone suitable for an executive audience.",
  },
  {
    title: "Share Key Metrics",
    desc: "Highlight specific growth metrics, efficiency gains, or team impact achieved.",
  },
  {
    title: "Privacy First",
    desc: "Avoid sharing sensitive financial data or proprietary company information.",
  },
];

const SuccessScreen = ({ onReset }) => {
  return (
    <Box sx={{ textAlign: "center", py: 4, px: 4 }}>
      <Box
        sx={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
          boxShadow: "0 0 30px rgba(71,100,255,0.3)",
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 38, color: "#fff" }} />
      </Box>

      <Typography sx={{ color: "var(--color-black)", fontWeight: 800, fontSize: "1.4rem", mb: 1 }}>
        Thank You!
      </Typography>

      <Typography sx={{ color: "var(--color-paragraph)", lineHeight: 1.5, mb: 3, maxWidth: 400, mx: "auto", fontSize: "0.85rem" }}>
        We truly appreciate your feedback — it helps us serve enterprises better.
      </Typography>

      <Button
        onClick={onReset}
        variant="outlined"
        sx={{
          borderColor: "rgba(71,100,255,0.5)",
          color: "var(--color-primary)",
          borderRadius: "3px",
          px: 4,
          py: 1,
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "var(--color-primary)",
            background: "rgba(71,100,255,0.08)",
            transform: "translateY(-1px)"
          },
        }}
      >
        Submit Another Review
      </Button>
    </Box>
  );
};

export default function Review() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const formSectionRef = useRef(null);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [form, setForm] = useState({
    fullName: "",
    company: "",
    rating: 0,
    title: "",
    review: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.company.trim()) errs.company = "Company name is required";
    if (form.rating === 0) errs.rating = "Please select a rating";
    if (!form.title.trim()) errs.title = "Review title is required";
    if (form.review.trim().length < 20) {
      errs.review = "Please write a longer review (at least 20 characters)";
    }
    if (!acceptedPolicy) {
      errs.acceptedPolicy = "Privacy Policy consent is required";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await submitReviewAPI(form);

      if (response.status === 201 || response.status === 200) {
        if (response.data?.success) {
          toast.success("Review submitted successfully!", { icon: null });
          setSubmitted(true);
        } else {
          toast.error(response.data?.message || "Failed to submit review.", { icon: null });
        }
      } else {
        toast.error(response.data?.message || "Server error. Please try again.", { icon: null });
      }
    } catch (err) {
      console.error("API error during review submission:", err);
      toast.error("Something went wrong. Please check your connection.", { icon: null });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      fullName: "",
      company: "",
      rating: 0,
      title: "",
      review: ""
    });
    setAcceptedPolicy(false);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        component="section"
        id="hero-section"
        sx={{
          position: { xs: "relative", md: "sticky" },
          top: { xs: 0, md: "80px" },
          zIndex: 1,
          height: { xs: "auto", md: "600px" },
          minHeight: { xs: "auto", md: "600px" },
          backgroundColor: "var(--color-primary)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        {/* Right Column: Clean Image of the Consultant */}
        <Box
          sx={{
            position: { xs: "relative", md: "absolute" },
            top: 0,
            right: 0,
            width: { xs: "100%", md: "50%" },
            height: { xs: "320px", md: "100%" },
            backgroundImage: `url(${homeHero})`,
            backgroundSize: "cover",
            backgroundPosition: "right top",
            zIndex: 1,
            order: { xs: 1, md: 2 },
          }}
        />

        {/* Left Column Container: Content Aligned to Navbar */}
        <Box
          className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]"
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            display: "flex",
            alignItems: "center",
            py: { xs: 6, md: 0 },
            order: { xs: 2, md: 1 },
          }}
        >
          <Box sx={{ maxWidth: { xs: "100%", md: "46%" } }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                component="h1"
                sx={{
                  fontFamily: "var(--font-primary)",
                  fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.2rem" },
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.5px",
                  color: "#ffffff",
                  mb: 2.5,
                  textAlign: "left",
                }}
              >
                Where Partnership
                <br />
                Inspires Innovation
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Typography
                component="p"
                sx={{
                  fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
                  color: "rgba(255, 255, 255, 0.78)",
                  maxWidth: "540px",
                  lineHeight: 1.65,
                  mb: 4.5,
                  textAlign: "left",
                }}
              >
                We value our partnership and welcome your honest feedback. Your review helps us
                refine our methodologies and guides other enterprises towards strategic growth.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    onClick={scrollToForm}
                    sx={{
                      py: 1.5,
                      px: 4.5,
                      borderRadius: "3px",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      background: "#ffffff",
                      color: "var(--color-primary)",
                      display: "inline-flex",
                      alignItems: "center",
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                      "&:hover": {
                        background: "var(--color-sub-bg)",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                      },
                      transition: "all 0.2s ease",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Write a Review
                  </Button>
                </motion.div>
              </Stack>
            </motion.div>
          </Box>
        </Box>
      </Box>

      {/* Review Form Container */}
      <Box
        ref={formSectionRef}
        className="bg-main"
        sx={{
          minHeight: { md: "640px", xs: "auto" },
          position: "relative",
          zIndex: 10,
          py: { xs: 6, md: 8 },
          backgroundColor: "var(--color-main-bg)",
        }}
      >
        <Box
          className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px]"
          sx={{ position: "relative", zIndex: 1 }}
        >

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Box sx={{ mb: { xs: 4, md: 5 }, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Top Badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2.5,
                  py: 0.5,
                  borderRadius: "30px",
                  background: "rgba(71,100,255,0.12)",
                  border: "1px solid rgba(71,100,255,0.25)",
                  mb: 1.5,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 14, color: "var(--color-primary)" }} />
                <Typography
                  sx={{
                    color: "var(--color-paragraph)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  Client Testimonials
                </Typography>
              </Box>

              <Box
                component='h2'
                className="sub-heading"
                sx={{
                  mb: 1,
                  textAlign: "center",
                  fontSize: { xs: "1.8rem", md: "2.4rem" },
                  fontWeight: 700,
                  color: "var(--color-black)"
                }}
              >
                Share Your Success Story
              </Box>

              <Typography
                sx={{
                  color: "var(--color-paragraph)",
                  maxWidth: 640,
                  lineHeight: 1.5,
                  fontSize: { xs: "0.82rem", md: "0.88rem" },
                  textAlign: "center"
                }}
              >
                Your insights help us refine our approach and guide other enterprises
                toward strategic excellence. We value your honest feedback.
              </Typography>
            </Box>
          </motion.div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                style={{
                  borderRadius: "3px",
                  background: "var(--color-sub-bg)",
                  border: "1px solid var(--color-border)",
                  maxWidth: 640,
                  margin: "0 auto",
                  height: 420,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SuccessScreen onReset={handleReset} />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Grid Container centered */}
                <Grid container spacing={4} sx={{ justifyContent: "center", mx: "auto" }}>

                  {/* Guidelines Box */}
                  <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex", justifyContent: "center" }}>
                    <Box
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: "3px",
                        background: "var(--color-sub-bg)",
                        border: "1px solid var(--color-border)",
                        position: { md: "sticky" },
                        top: { md: 100 },
                        minHeight: { md: "420px", xs: "auto" },
                        height: "100%",
                        width: "100%",
                        maxWidth: "460px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        textAlign: "center"
                      }}
                    >
                      <Box>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "center", mb: "24px" }}>
                          <Box
                            sx={{
                              width: 34, height: 34,
                              borderRadius: "3px",
                              background: "rgba(71,100,255,0.2)",
                              display: "flex", alignItems: "center", justifyContent: "center"
                            }}
                          >
                            <InfoOutlinedIcon sx={{ color: "var(--color-primary)", fontSize: 18 }} />
                          </Box>
                          <Typography sx={{ color: "var(--color-black)", fontWeight: 700, fontSize: "0.95rem" }}>
                            Review Guidelines
                          </Typography>
                        </Stack>

                        <Stack spacing={1.5} sx={{ mt: "24px", alignItems: "center" }}>
                          {guidelines.map((g, i) => (
                            <Box
                              key={i}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                textAlign: "left",
                                gap: 1.5, p: 1.5,
                                borderRadius: "3px",
                                background: "var(--color-main-bg)",
                                border: "1px solid var(--color-border)",
                                transition: "all 0.25s ease",
                                width: "100%",
                                "&:hover": {
                                  background: "rgba(71,100,255,0.08)",
                                  border: "1px solid rgba(71,100,255,0.2)",
                                },
                              }}
                            >
                              <CheckCircleOutlineIcon
                                sx={{
                                  color: "var(--color-primary)",
                                  fontSize: 20,
                                  flexShrink: 0,
                                }}
                              />
                              <Box>
                                <Typography sx={{ color: "var(--color-black)", fontWeight: 700, fontSize: "0.8rem", mb: 0.3 }}>
                                  {g.title}
                                </Typography>
                                <Typography sx={{ color: "var(--color-paragraph)", fontSize: "0.75rem", lineHeight: 1.4 }}>
                                  {g.desc}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Stack>

                        <Box
                          sx={{
                            mt: 3,
                            p: 1.5,
                            borderRadius: "3px",
                            background: "rgba(71,100,255,0.05)",
                            borderLeft: "3px solid var(--color-primary)",
                            textAlign: "left"
                          }}
                        >
                          <Typography sx={{ color: "var(--color-black)", fontWeight: 700, fontSize: "0.8rem", mb: 0.5 }}>
                            Verification Process
                          </Typography>
                          <Typography sx={{ color: "var(--color-paragraph)", fontSize: "0.72rem", lineHeight: 1.4 }}>
                            For authenticity, all submitted strategic consulting testimonials undergo an internal review before being featured on our website.
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          mt: 2.5, p: 1.5,
                          borderRadius: "3px",
                          background: "rgba(71,100,255,0.06)",
                          border: "1px solid rgba(71,100,255,0.12)",
                        }}
                      >
                        <Typography sx={{ color: "var(--color-paragraph)", fontSize: "0.68rem", lineHeight: 1.4 }}>
                          Your review may be featured on our website with your
                          permission. We never share personal data without consent.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Review Form Box */}
                  <Grid size={{ xs: 12, md: 7 }} sx={{ display: "flex", justifyContent: "center" }}>
                    <Box
                      component="form"
                      ref={formRef}
                      onSubmit={handleSubmit}
                      sx={{
                        p: { xs: 2.5, sm: 3, md: 3.5 },
                        borderRadius: "3px",
                        background: "var(--color-sub-bg)",
                        border: "1px solid var(--color-border)",
                        position: "relative",
                        minHeight: { md: "420px", xs: "auto" },
                        height: "100%",
                        width: "100%",
                        maxWidth: "600px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        textAlign: "center",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0, left: 0, right: 0,
                          height: "3px",
                          background: "linear-gradient(90deg, var(--color-primary), #7A90FF)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 15, right: 20,
                          opacity: 0.03,
                        }}
                      >
                        <FormatQuoteIcon sx={{ fontSize: 90, color: "var(--color-primary)" }} />
                      </Box>

                      <Stack spacing={2.5} sx={{ position: "relative", zIndex: 1, flexGrow: 1 }}>

                        {/* Name & Company Input Fields */}
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Full Name"
                              name="fullName"
                              value={form.fullName}
                              onChange={handleChange}
                              placeholder="Jane Doe"
                              error={!!errors.fullName}
                              helperText={errors.fullName}
                              sx={fieldSx}
                              FormHelperTextProps={{ sx: { color: "var(--color-danger)" } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Company Name"
                              name="company"
                              value={form.company}
                              onChange={handleChange}
                              placeholder="Acme Corp"
                              error={!!errors.company}
                              helperText={errors.company}
                              sx={fieldSx}
                              FormHelperTextProps={{ sx: { color: "var(--color-danger)" } }}
                            />
                          </Grid>
                        </Grid>

                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: "3px",
                            border: errors.rating
                              ? "1px solid rgba(239,68,68,0.4)"
                              : "1px solid var(--color-border)",
                            background: "var(--color-main-bg)",
                          }}
                        >
                          <Typography sx={{ color: "var(--color-paragraph)", fontSize: "0.78rem", mb: 0.5 }}>
                            Overall Rating
                          </Typography>
                          <StarRating
                            value={form.rating}
                            onChange={(newRating) => {
                              setForm((prev) => ({ ...prev, rating: newRating }));
                              setErrors((prev) => ({ ...prev, rating: "" }));
                            }}
                          />
                          {errors.rating && (
                            <Typography sx={{ color: "var(--color-danger)", fontSize: "0.72rem", mt: 0.5 }}>
                              {errors.rating}
                            </Typography>
                          )}
                        </Box>

                        <TextField
                          fullWidth
                          size="small"
                          label="Review Title"
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="Transformative strategic guidance"
                          error={!!errors.title}
                          helperText={errors.title}
                          sx={fieldSx}
                          FormHelperTextProps={{ sx: { color: "var(--color-danger)" } }}
                        />

                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Detailed Review"
                          name="review"
                          value={form.review}
                          onChange={handleChange}
                          placeholder="Describe your experience working with our consulting team..."
                          error={!!errors.review}
                          helperText={
                            errors.review ||
                            `${form.review.length} characters (min 20)`
                          }
                          sx={fieldSx}
                          FormHelperTextProps={{
                            sx: {
                              color: errors.review ? "var(--color-danger)" : "var(--color-paragraph)",
                              fontSize: "0.72rem",
                            },
                          }}
                        />

                        <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
                          <FormControlLabel
                            sx={{ m: 0 }}
                            control={
                              <Checkbox
                                checked={acceptedPolicy}
                                onChange={(e) => {
                                  setAcceptedPolicy(e.target.checked);
                                  if (errors.acceptedPolicy) {
                                    setErrors((prev) => ({ ...prev, acceptedPolicy: "" }));
                                  }
                                }}
                                sx={{
                                  p: 0.5,
                                  mr: 1,
                                  color: errors.acceptedPolicy ? "var(--color-danger)" : "var(--color-paragraph)",
                                  "&.Mui-checked": {
                                    color: "var(--color-primary)",
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography sx={{ color: "var(--color-paragraph)", fontSize: "0.75rem", userSelect: "none", textAlign: "left" }}>
                                I accept the{" "}
                                <Link
                                  to="/privacy-policy"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    color: "var(--color-primary)",
                                    textDecoration: "underline",
                                  }}
                                >
                                  privacy policy
                                </Link>{" "}
                                for publishing this testimonial.
                              </Typography>
                            }
                          />
                        </Box>
                        {errors.acceptedPolicy && (
                          <Typography sx={{ color: "var(--color-danger)", fontSize: "0.72rem", mt: 0.5 }}>
                            {errors.acceptedPolicy}
                          </Typography>
                        )}
                      </Stack>

                      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, position: "relative", zIndex: 1 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          sx={{
                            background: "var(--color-primary)",
                            px: 5, py: 1.2,
                            borderRadius: "3px",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background: "var(--color-primary-hover)",
                              transform: "translateY(-1px)"
                            }
                          }}
                        >
                          {loading ? "Submitting..." : "Submit Review"}
                        </Button>
                      </Box>
                    </Box>
                  </Grid>

                </Grid>
              </motion.div>
            )}
          </AnimatePresence>

        </Box>
      </Box>
    </>
  );
}
