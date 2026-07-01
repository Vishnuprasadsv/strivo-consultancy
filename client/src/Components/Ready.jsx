import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Settings,
  WorkspacePremium,
  ArrowForward,
} from "@mui/icons-material";

function Ready() {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 6, mb: 2 }}>
      <Box
        sx={{
          background: "var(--color-main-bg)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          borderRadius: "24px",
          p: { xs: 3, md: 4.5 },
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 15px 45px rgba(0, 0, 0, 0.02)",
        }}
      >
        {/* Glow Effects */}
        <Box
          sx={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(37,99,235,0.06), transparent 70%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <Grid container spacing={4} alignItems="center" sx={{ position: "relative", zIndex: 2 }}>
          {/* Left Content Side */}
          <Grid item xs={12} md={7.5}>
            <Box sx={{ textAlign: "left" }}>
              <Typography
                sx={{
                  color: "#3b82f6",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                Let's Build What's Next
              </Typography>

              <Typography
                sx={{
                  color: "#0f172a",
                  fontWeight: 900,
                  fontSize: { xs: "2rem", md: "2.8rem" },
                  lineHeight: 1.15,
                  mb: 2,
                }}
              >
                Ready to <span style={{ color: "#2563eb" }}>Transform</span>
                <br />
                Your Business?
              </Typography>

              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  maxWidth: "500px",
                  mb: 5,
                }}
              >
                Partner with experienced consultants to unlock growth opportunities,
                streamline operations, and build long-term success.
              </Typography>

              {/* Value Props Row */}
              <Grid container spacing={3}>
                {/* Prop 1 */}
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      color: "#3b82f6",
                      background: "rgba(37, 99, 235, 0.05)"
                    }}
                  >
                    <TrendingUp fontSize="small" />
                  </Box>
                  <Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: "0.9rem", mb: 1 }}>
                    Drive Growth
                  </Typography>
                  <Typography sx={{ color: "#475569", fontSize: "0.78rem", lineHeight: 1.5 }}>
                    Identify new opportunities and accelerate results.
                  </Typography>
                </Grid>

                {/* Prop 2 */}
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      color: "#3b82f6",
                      background: "rgba(37, 99, 235, 0.05)"
                    }}
                  >
                    <Settings fontSize="small" />
                  </Box>
                  <Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: "0.9rem", mb: 1 }}>
                    Optimize Operations
                  </Typography>
                  <Typography sx={{ color: "#475569", fontSize: "0.78rem", lineHeight: 1.5 }}>
                    Streamline processes and improve efficiency.
                  </Typography>
                </Grid>

                {/* Prop 3 */}
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      color: "#3b82f6",
                      background: "rgba(37, 99, 235, 0.05)"
                    }}
                  >
                    <WorkspacePremium fontSize="small" />
                  </Box>
                  <Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: "0.9rem", mb: 1 }}>
                    Build Lasting Success
                  </Typography>
                  <Typography sx={{ color: "#475569", fontSize: "0.78rem", lineHeight: 1.5 }}>
                    Create sustainable value and long-term impact.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Vertical Separator for Desktop */}
          <Grid
            item
            xs={false}
            md={0.5}
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignSelf: "stretch"
            }}
          >
            <Box
              sx={{
                width: "1px",
                backgroundColor: "rgba(0, 0, 0, 0.08)",
                height: "80%",
                my: "auto"
              }}
            />
          </Grid>

          {/* Right Globe / CTA Side */}
          <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {/* Animated Rotating Globe Graphic */}
            <Box
              sx={{
                position: "absolute",
                width: "360px",
                height: "360px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                opacity: 0.6,
                zIndex: 0
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyItems: "center" }}
              >
                <svg width="360" height="360" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: "auto" }}>
                  <circle cx="180" cy="180" r="140" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" />
                  <ellipse cx="180" cy="180" rx="140" ry="40" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" />
                  <ellipse cx="180" cy="180" rx="140" ry="85" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" />
                  <ellipse cx="180" cy="180" rx="40" ry="140" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" />
                  <ellipse cx="180" cy="180" rx="85" ry="140" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" />
                  
                  {/* Nodes */}
                  <circle cx="100" cy="120" r="3" fill="#3b82f6" />
                  <circle cx="100" cy="120" r="7" fill="#3b82f6" opacity="0.25" />
                  
                  <circle cx="260" cy="120" r="3" fill="#3b82f6" />
                  <circle cx="260" cy="120" r="7" fill="#3b82f6" opacity="0.25" />

                  <circle cx="180" cy="80" r="2" fill="#3b82f6" />
                  <circle cx="180" cy="280" r="2" fill="#3b82f6" />

                  <circle cx="115" cy="235" r="3" fill="#3b82f6" />
                  <circle cx="115" cy="235" r="7" fill="#3b82f6" opacity="0.25" />

                  <circle cx="245" cy="235" r="3.5" fill="#3b82f6" />
                  <circle cx="245" cy="235" r="8" fill="#3b82f6" opacity="0.25" />
                </svg>
              </motion.div>
            </Box>

            {/* Content card overlay */}
            <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
              <Button
                variant="contained"
                onClick={() => navigate("/contact")}
                sx={{
                  pl: 2,
                  pr: 4,
                  py: 1.6,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 2,
                  boxShadow: "0 10px 30px rgba(37,99,235,0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1e40af, #1d4ed8)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 35px rgba(37,99,235,0.3)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                {/* Arrow Circle */}
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ArrowForward sx={{ fontSize: "1rem", color: "#fff" }} />
                </Box>
                Contact Us
              </Button>

              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "0.82rem",
                  mt: 3.5,
                  maxWidth: "200px",
                  mx: "auto",
                  lineHeight: 1.4
                }}
              >
                Let's start a conversation about your goals.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Ready;
