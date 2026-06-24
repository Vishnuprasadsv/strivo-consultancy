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
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const MotionBox = motion.create(Box);
const MotionButton = motion.create(Button);

/* ─── Floating particle background ─────────────────────── */
const Particles = () => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    }}
  >
    {[...Array(20)].map((_, i) => (
      <MotionBox
        key={i}
        animate={{
          y: [0, -60, 0],
          x: [0, Math.sin(i) * 30, 0],
          opacity: [0.04, 0.12, 0.04],
        }}
        transition={{
          duration: 6 + (i % 5),
          repeat: Infinity,
          delay: i * 0.4,
          ease: "easeInOut",
        }}
        sx={{
          position: "absolute",
          width: 4 + (i % 4) * 2,
          height: 4 + (i % 4) * 2,
          borderRadius: "50%",
          background: "#2563EB",
          top: `${(i * 13 + 5) % 95}%`,
          left: `${(i * 17 + 3) % 95}%`,
        }}
      />
    ))}
  </Box>
);

/* ─── Star Rating component ─────────────────────────────── */
const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <Box>
      <Stack direction="row" spacing={0.5} alignItems="center">
        {[1, 2, 3, 4, 5].map((star) => (
          <MotionBox
            key={star}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            sx={{ cursor: "pointer", lineHeight: 0 }}
          >
            {star <= (hovered || value) ? (
              <StarIcon
                sx={{
                  fontSize: 34,
                  color: star <= (hovered || value) ? "#F59E0B" : "#334155",
                  filter:
                    star <= (hovered || value)
                      ? "drop-shadow(0 0 8px rgba(245,158,11,0.6))"
                      : "none",
                  transition: "all 0.2s ease",
                }}
              />
            ) : (
              <StarBorderIcon
                sx={{
                  fontSize: 34,
                  color: "#334155",
                  transition: "all 0.2s ease",
                }}
              />
            )}
          </MotionBox>
        ))}

        <AnimatePresence mode="wait">
          {(hovered || value) > 0 && (
            <MotionBox
              key={hovered || value}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              sx={{ ml: 1 }}
            >
              <Typography
                sx={{
                  color: "#F59E0B",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                {labels[hovered || value]}
              </Typography>
            </MotionBox>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  );
};

/* ─── Field wrapper with animated label ─────────────────── */
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
  "& .MuiInputLabel-root": { color: "#64748B" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#60A5FA" },
};

/* ─── Guidelines panel ──────────────────────────────────── */
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

/* ─── Success overlay ───────────────────────────────────── */
const SuccessScreen = ({ onReset }) => (
  <MotionBox
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.85 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    sx={{
      textAlign: "center",
      py: 10,
      px: 4,
    }}
  >
    {/* Animated ring */}
    <MotionBox
      animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2.5, repeat: Infinity }}
      sx={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        border: "2px solid #2563EB",
        mx: "auto",
        mb: -7.5,
      }}
    />
    <MotionBox
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
      sx={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#1D4ED8,#2563EB)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: "auto",
        mb: 4,
        boxShadow: "0 0 50px rgba(37,99,235,0.5)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 52, color: "#fff" }} />
    </MotionBox>

    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <Typography
        sx={{ color: "#fff", fontWeight: 800, fontSize: "2rem", mb: 1.5 }}
      >
        Thank You! 🎉
      </Typography>
      <Typography
        sx={{ color: "#94A3B8", lineHeight: 1.8, mb: 5, maxWidth: 420, mx: "auto" }}
      >
        Your success story has been submitted. We truly appreciate your
        feedback — it helps us serve enterprises better.
      </Typography>
      <MotionBox whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
        <Button
          onClick={onReset}
          variant="outlined"
          sx={{
            borderColor: "rgba(37,99,235,0.5)",
            color: "#60A5FA",
            borderRadius: "14px",
            px: 4,
            py: 1.2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { borderColor: "#2563EB", background: "rgba(37,99,235,0.08)" },
          }}
        >
          Submit Another Review
        </Button>
      </MotionBox>
    </MotionBox>
  </MotionBox>
);

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Review() {
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
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.company.trim()) errs.company = "Company name is required";
    if (form.rating === 0) errs.rating = "Please select a rating";
    if (!form.title.trim()) errs.title = "Review title is required";
    if (form.review.trim().length < 20)
      errs.review = "Please write at least 20 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ fullName: "", company: "", rating: 0, title: "", review: "" });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#020617 0%,#061226 50%,#020617 100%)",
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 14 },
      }}
    >
      <Particles />

      {/* Big ambient glow */}
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
        {/* ── HEADER ── */}
        <MotionBox
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ mb: { xs: 6, md: 8 } }}
        >
          {/* Badge */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2.5,
              py: 0.8,
              borderRadius: "30px",
              background: "rgba(37,99,235,0.12)",
              border: "1px solid rgba(37,99,235,0.25)",
              mb: 3,
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
          </MotionBox>

          <Typography
            sx={{
              color: "#fff",
              fontWeight: 900,
              fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem" },
              lineHeight: 1.1,
              mb: 2.5,
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
              lineHeight: 1.8,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            Your insights help us refine our approach and guide other enterprises
            toward strategic excellence. We value your honest feedback.
          </Typography>
        </MotionBox>

        {/* ── MAIN CONTENT ── */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <MotionBox
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              sx={{
                borderRadius: "28px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(24px)",
                maxWidth: 640,
                mx: "auto",
              }}
            >
              <SuccessScreen onReset={handleReset} />
            </MotionBox>
          ) : (
            <MotionBox
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <Grid container spacing={3} alignItems="flex-start">
                {/* ── LEFT: FORM ── */}
                <Grid item xs={12} lg={8}>
                  <Box
                    component="form"
                    ref={formRef}
                    onSubmit={handleSubmit}
                    sx={{
                      p: { xs: 3, sm: 4, md: 5 },
                      borderRadius: "28px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(24px)",
                      boxShadow: "0 0 60px rgba(0,0,0,0.4)",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(90deg,#1D4ED8,#3B82F6,#60A5FA)",
                      },
                    }}
                  >
                    {/* Quote icon decoration */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 24,
                        opacity: 0.04,
                      }}
                    >
                      <FormatQuoteIcon sx={{ fontSize: 120, color: "#2563EB" }} />
                    </Box>

                    <Stack spacing={3} sx={{ position: "relative", zIndex: 1 }}>
                      {/* Row 1: Full Name + Company */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <MotionBox
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <TextField
                              fullWidth
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
                          </MotionBox>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <MotionBox
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                          >
                            <TextField
                              fullWidth
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
                          </MotionBox>
                        </Grid>
                      </Grid>

                      {/* Row 2: Star Rating */}
                      <MotionBox
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        sx={{
                          p: 2.5,
                          borderRadius: "14px",
                          border: errors.rating
                            ? "1px solid rgba(239,68,68,0.5)"
                            : "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <Typography
                          sx={{ color: "#64748B", fontSize: "0.82rem", mb: 1.5 }}
                        >
                          Overall Rating
                        </Typography>
                        <StarRating
                          value={form.rating}
                          onChange={(v) => {
                            setForm((p) => ({ ...p, rating: v }));
                            setErrors((p) => ({ ...p, rating: "" }));
                          }}
                        />
                        {errors.rating && (
                          <Typography
                            sx={{ color: "#EF4444", fontSize: "0.78rem", mt: 1 }}
                          >
                            {errors.rating}
                          </Typography>
                        )}
                      </MotionBox>

                      {/* Row 3: Review Title */}
                      <MotionBox
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <TextField
                          fullWidth
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
                      </MotionBox>

                      {/* Row 4: Detailed Review */}
                      <MotionBox
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
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
                              fontSize: "0.75rem",
                            },
                          }}
                        />
                      </MotionBox>

                      {/* Submit Button */}
                      <MotionBox
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <MotionButton
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          whileHover={!loading ? { scale: 1.04, y: -2 } : {}}
                          whileTap={!loading ? { scale: 0.97 } : {}}
                          sx={{
                            background: loading
                              ? "rgba(37,99,235,0.5)"
                              : "linear-gradient(90deg,#1D4ED8,#3B82F6)",
                            px: { xs: 4, sm: 6 },
                            py: 1.5,
                            borderRadius: "14px",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "1rem",
                            letterSpacing: "0.3px",
                            boxShadow: loading
                              ? "none"
                              : "0 8px 30px rgba(37,99,235,0.4)",
                            transition: "all 0.3s ease",
                            minWidth: 180,
                            position: "relative",
                            overflow: "hidden",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: "-100%",
                              width: "100%",
                              height: "100%",
                              background:
                                "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)",
                              animation: loading ? "none" : "shimmer 2s infinite",
                            },
                            "@keyframes shimmer": {
                              "0%": { left: "-100%" },
                              "100%": { left: "200%" },
                            },
                          }}
                        >
                          {loading ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <MotionBox
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                sx={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  border: "2px solid rgba(255,255,255,0.3)",
                                  borderTopColor: "#fff",
                                }}
                              />
                              <span>Submitting...</span>
                            </Stack>
                          ) : (
                            "Submit Review"
                          )}
                        </MotionButton>
                      </MotionBox>
                    </Stack>
                  </Box>
                </Grid>

                {/* ── RIGHT: GUIDELINES ── */}
                <Grid item xs={12} lg={4}>
                  <MotionBox
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    sx={{
                      p: { xs: 3, md: 4 },
                      borderRadius: "24px",
                      background: "rgba(30,58,138,0.12)",
                      border: "1px solid rgba(37,99,235,0.2)",
                      backdropFilter: "blur(20px)",
                      position: { lg: "sticky" },
                      top: { lg: 100 },
                    }}
                  >
                    {/* Header */}
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={3.5}>
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: "10px",
                          background: "rgba(37,99,235,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <InfoOutlinedIcon sx={{ color: "#3B82F6", fontSize: 20 }} />
                      </Box>
                      <Typography
                        sx={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}
                      >
                        Review Guidelines
                      </Typography>
                    </Stack>

                    {/* Guidelines list */}
                    <Stack spacing={3}>
                      {guidelines.map((g, i) => (
                        <MotionBox
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.45 + i * 0.12 }}
                          whileHover={{ x: 4 }}
                          sx={{
                            display: "flex",
                            gap: 2,
                            p: 2,
                            borderRadius: "14px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            transition: "all 0.25s ease",
                            "&:hover": {
                              background: "rgba(37,99,235,0.08)",
                              border: "1px solid rgba(37,99,235,0.2)",
                            },
                            cursor: "default",
                          }}
                        >
                          <CheckCircleOutlineIcon
                            sx={{
                              color: "#3B82F6",
                              fontSize: 22,
                              mt: 0.2,
                              flexShrink: 0,
                            }}
                          />
                          <Box>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.9rem",
                                mb: 0.5,
                              }}
                            >
                              {g.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#64748B",
                                fontSize: "0.82rem",
                                lineHeight: 1.6,
                              }}
                            >
                              {g.desc}
                            </Typography>
                          </Box>
                        </MotionBox>
                      ))}
                    </Stack>

                    {/* Bottom note */}
                    <MotionBox
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      sx={{
                        mt: 3.5,
                        p: 2,
                        borderRadius: "12px",
                        background: "rgba(37,99,235,0.08)",
                        border: "1px solid rgba(37,99,235,0.15)",
                        textAlign: "center",
                      }}
                    >
                      <Typography sx={{ color: "#475569", fontSize: "0.78rem", lineHeight: 1.6 }}>
                        🔒 Your review may be featured on our website with your
                        permission. We never share personal data without consent.
                      </Typography>
                    </MotionBox>
                  </MotionBox>
                </Grid>
              </Grid>
            </MotionBox>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
