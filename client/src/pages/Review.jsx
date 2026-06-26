import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";


import Ferrofluid from "../Components/Ferrofluid";

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <Box>
      <Stack direction="row" spacing={0.5} alignItems="center">
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
    color: "#fff",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.04)",
    transition: "all 0.3s ease",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
    "&.Mui-focused fieldset": {
      borderColor: "#2563EB",
      boxShadow: "0 0 0 3px rgba(37,99,235,0.12)",
    },
  },
  "& .MuiInputLabel-root": { color: "#64748B", fontSize: "0.9rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#60A5FA" },
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
    title: "Privacy First",
    desc: "Avoid sharing sensitive financial data or proprietary company information.",
  },
];


const SuccessScreen = ({ onReset }) => {
  return (
    <Box sx={{ textAlign: "center", py: 8, px: 4 }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#1D4ED8,#2563EB)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 3,
          boxShadow: "0 0 30px rgba(37,99,235,0.3)",
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 44, color: "#fff" }} />
      </Box>

      <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.6rem", mb: 1.5 }}>
        Thank You! 
      </Typography>

      <Typography sx={{ color: "#94A3B8", lineHeight: 1.6, mb: 4, maxWidth: 400, mx: "auto", fontSize: "0.88rem" }}>
        Your success story has been submitted. We truly appreciate your feedback — it helps us serve enterprises better.
      </Typography>

      <Button
        onClick={onReset}
        variant="outlined"
        sx={{
          borderColor: "rgba(37,99,235,0.5)",
          color: "#60A5FA",
          borderRadius: "12px",
          px: 4,
          py: 1,
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.2s ease",
          "&:hover": { 
            borderColor: "#2563EB", 
            background: "rgba(37,99,235,0.08)",
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
  const formRef = useRef(null);

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
    await new Promise((resolve) => setTimeout(resolve, 1600));
    setLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ 
      fullName: "", 
      company: "", 
      rating: 0, 
      title: "", 
      review: "" 
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#000000",
        position: "relative",
        overflow: "hidden",
        py: { xs: 6, md: 10 },
      }}
    >
     
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Ferrofluid
          colors={['#4F46E5', '#06B6D4', '#E0F2FE']}
          speed={0.5}
          scale={1.2}
          opacity={0.6}
          flowDirection="down"
        />
      </Box>

      
      <Box
        sx={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "#2563EB",
          filter: "blur(260px)",
          opacity: 0.05,
          top: "40%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        
      
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
           
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2.5,
                py: 0.8,
                borderRadius: "30px",
                background: "rgba(37,99,235,0.12)",
                border: "1px solid rgba(37,99,235,0.25)",
                mb: 2.5,
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 16, color: "#60A5FA" }} />
              <Typography
                sx={{
                  color: "#60A5FA",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                Client Testimonials
              </Typography>
            </Box>

           
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 900,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                lineHeight: 1.1,
                mb: 2,
              }}
            >
              Share Your{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(90deg,#3B82F6,#60A5FA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Success Story
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",
                maxWidth: 640,
                lineHeight: 1.7,
                fontSize: { xs: "0.85rem", md: "0.92rem" },
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
                borderRadius: "28px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(24px)",
                maxWidth: 640,
                margin: "0 auto",
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
              <Grid container spacing={3} alignItems="flex-start">
                
               
                <Grid item xs={12} md={7}>
                  <Box
                    component="form"
                    ref={formRef}
                    onSubmit={handleSubmit}
                    sx={{
                      p: { xs: 2.5, sm: 3, md: 3.5 },
                      borderRadius: "24px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(24px)",
                      boxShadow: "0 0 60px rgba(0,0,0,0.4)",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0, left: 0, right: 0,
                        height: "3px",
                        background: "linear-gradient(90deg,#1D4ED8,#3B82F6,#60A5FA)",
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
                      <FormatQuoteIcon sx={{ fontSize: 90, color: "#2563EB" }} />
                    </Box>

                    <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
                 
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
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
                            FormHelperTextProps={{ sx: { color: "#EF4444" } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                            FormHelperTextProps={{ sx: { color: "#EF4444" } }}
                          />
                        </Grid>
                      </Grid>

                     
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "12px",
                          border: errors.rating
                            ? "1px solid rgba(239,68,68,0.4)"
                            : "1px solid rgba(255,255,255,0.06)",
                          background: "rgba(255,255,255,0.02)",
                        }}
                      >
                        <Typography sx={{ color: "#64748B", fontSize: "0.78rem", mb: 1 }}>
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
                          <Typography sx={{ color: "#EF4444", fontSize: "0.72rem", mt: 0.5 }}>
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
                        FormHelperTextProps={{ sx: { color: "#EF4444" } }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        rows={4}
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
                            color: errors.review ? "#EF4444" : "#475569",
                            fontSize: "0.72rem",
                          },
                        }}
                      />

                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          sx={{
                            background: loading
                              ? "rgba(37,99,235,0.5)"
                              : "linear-gradient(90deg,#1D4ED8,#3B82F6)",
                            px: 4, py: 1.1,
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background: "linear-gradient(90deg,#1e40af,#1d4ed8)",
                              transform: "translateY(-1px)"
                            }
                          }}
                        >
                          {loading ? "Submitting..." : "Submit Review"}
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>

              
                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      borderRadius: "24px",
                      background: "rgba(30,58,138,0.12)",
                      border: "1px solid rgba(37,99,235,0.2)",
                      backdropFilter: "blur(20px)",
                      position: { md: "sticky" },
                      top: { md: 100 },
                    }}
                  >
                  
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
                      <Box
                        sx={{
                          width: 34, height: 34,
                          borderRadius: "8px",
                          background: "rgba(37,99,235,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <InfoOutlinedIcon sx={{ color: "#3B82F6", fontSize: 18 }} />
                      </Box>
                      <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>
                        Review Guidelines
                      </Typography>
                    </Stack>

                    <Stack spacing={1.5}>
                      {guidelines.map((g, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            gap: 1.5, p: 1.5,
                            borderRadius: "12px",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.04)",
                            transition: "all 0.25s ease",
                            "&:hover": {
                              background: "rgba(37,99,235,0.08)",
                              border: "1px solid rgba(37,99,235,0.2)",
                            },
                          }}
                        >
                          <CheckCircleOutlineIcon
                            sx={{
                              color: "#3B82F6",
                              fontSize: 20,
                              mt: 0.2,
                              flexShrink: 0,
                            }}
                          />
                          <Box>
                            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.8rem", mb: 0.3 }}>
                              {g.title}
                            </Typography>
                            <Typography sx={{ color: "#64748B", fontSize: "0.75rem", lineHeight: 1.4 }}>
                              {g.desc}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>

                   
                    <Box
                      sx={{
                        mt: 2.5, p: 1.5,
                        borderRadius: "10px",
                        background: "rgba(37,99,235,0.06)",
                        border: "1px solid rgba(37,99,235,0.12)",
                        textAlign: "center",
                      }}
                    >
                      <Typography sx={{ color: "#475569", fontSize: "0.68rem", lineHeight: 1.4 }}>
                        Your review may be featured on our website with your
                        permission. We never share personal data without consent.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
