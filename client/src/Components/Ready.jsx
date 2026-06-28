import React from 'react'
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Typography,
  Button,
} from "@mui/material";
function Ready() {
  const navigate = useNavigate();
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12">
       <Box
      sx={{
        mt: 12,
        background:
          "linear-gradient(145deg,#081224,#0f172a)",
        border:
          "1px solid rgba(59,130,246,.15)",
        borderRadius: "30px",
        p: {
          xs: 5,
          md: 8,
        },
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
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

      <Typography
        sx={{
          color: "#fff",
          fontWeight: 700,
          mb: 2,
          position: "relative",
          zIndex: 2,
          fontSize: {
            xs: "2rem",
            md: "3rem",
          },
        }}
      >
        Ready to Transform Your Business?
      </Typography>

      <Typography
        sx={{
          color: "#94a3b8",
          maxWidth: "700px",
          mx: "auto",
          mb: 5,
          lineHeight: 1.8,
          position: "relative",
          zIndex: 2,
        }}
      >
        Partner with experienced consultants to unlock
        growth opportunities, streamline operations,
        and build long-term success.
      </Typography>

      <Button
        onClick={() => navigate('/contact')}
        variant="contained"
        sx={{
          px: 5,
          py: 1.8,
          borderRadius: "14px",
          textTransform: "none",
          fontWeight: 700,
          position: "relative",
          zIndex: 2,
          background:
            "linear-gradient(135deg,#2563eb,#3b82f6)",

          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow:
              "0 15px 30px rgba(37,99,235,.35)",
          },
        }}
      >
        Contact Us
      </Button>
    </Box>
    </div>
  )
}

export default Ready
