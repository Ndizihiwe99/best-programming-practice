import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container, Typography, useTheme } from "@mui/material";
import { Security, Shield, GpsFixed } from "@mui/icons-material";

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(${theme.palette.primary.light}20 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          opacity: 0.3,
        }}
      />

      {/* Floating Icons */}
      <Security
        sx={{
          position: "absolute",
          top: "20%",
          left: "10%",
          fontSize: 120,
          color: "rgba(255,255,255,0.1)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Shield
        sx={{
          position: "absolute",
          top: "60%",
          right: "15%",
          fontSize: 100,
          color: "rgba(255,255,255,0.1)",
          animation: "float 8s ease-in-out infinite",
          animationDelay: "1s",
        }}
      />
      <GpsFixed
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "20%",
          fontSize: 80,
          color: "rgba(255,255,255,0.1)",
          animation: "float 7s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />

      {/* Content */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 6,
          }}
        >
          {/* Left Side - Branding */}
          <Box sx={{ flex: 1, color: "white", maxWidth: { md: 500 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "white",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
              >
                <Security
                  sx={{ fontSize: 48, color: theme.palette.primary.main }}
                />
              </Box>
              <Box>
                <Typography variant="h2" sx={{ fontWeight: 900, mb: 0.5 }}>
                  Rwanda
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, opacity: 0.9 }}>
                  Security Platform
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 3, lineHeight: 1.3 }}
            >
              Secure. Efficient. Reliable Crime Reporting
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                opacity: 0.9,
                lineHeight: 1.7,
                fontSize: "1.125rem",
              }}
            >
              Join thousands of citizens and police officers in making Rwanda
              safer. Report crimes instantly, track case progress, and receive
              real-time updates through our secure platform.
            </Typography>

            {/* Features */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[
                {
                  icon: "🔒",
                  title: "Secure & Encrypted",
                  desc: "Military-grade encryption for all reports",
                },
                {
                  icon: "⚡",
                  title: "Real-time Updates",
                  desc: "Instant notifications on case progress",
                },
                {
                  icon: "📱",
                  title: "Mobile Friendly",
                  desc: "Access from any device, anywhere",
                },
                {
                  icon: "👮",
                  title: "Police Integration",
                  desc: "Direct connection to police stations",
                },
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {feature.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Stats */}
            <Box
              sx={{
                display: "flex",
                gap: 4,
                mt: 6,
                pt: 4,
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {[
                { value: "10K+", label: "Active Users" },
                { value: "85%", label: "Cases Resolved" },
                { value: "24/7", label: "Support" },
              ].map((stat, index) => (
                <Box key={index}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right Side - Form */}
          <Box
            sx={{
              flex: 1,
              maxWidth: { md: 480 },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 4,
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                overflow: "hidden",
                position: "relative",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              <Outlet />
            </Box>

            {/* Footer Note */}
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 3,
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.75rem",
              }}
            >
              © 2024 Rwanda Citizen Security Platform. All rights reserved.
              <br />
              Emergency: Call 112 | Police: 0788 831 000
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </Box>
  );
};

export default AuthLayout;
