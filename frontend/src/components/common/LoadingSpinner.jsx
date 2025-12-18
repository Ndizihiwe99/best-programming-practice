import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { HourglassEmpty } from "@mui/icons-material";

const LoadingSpinner = ({
  message = "Loading...",
  size = 60,
  fullScreen = true,
}) => {
  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CircularProgress
          size={size}
          thickness={4}
          sx={{
            color: "primary.main",
            animationDuration: "1.5s",
          }}
        />
        <HourglassEmpty
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: size / 2,
            color: "primary.main",
            opacity: 0.7,
          }}
        />
      </Box>
      {message && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.5 },
            },
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;
