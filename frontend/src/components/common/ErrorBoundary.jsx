import React, { Component } from "react";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import { ErrorOutline, Refresh, Home } from "@mui/icons-material";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md">
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                borderRadius: 4,
                textAlign: "center",
                maxWidth: 600,
                width: "100%",
                border: "1px solid",
                borderColor: "error.light",
                bgcolor: "error.light",
              }}
            >
              <ErrorOutline
                sx={{
                  fontSize: 80,
                  color: "error.main",
                  mb: 3,
                }}
              />

              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 2, color: "error.dark" }}
              >
                Oops! Something went wrong
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 4, color: "text.secondary" }}
              >
                We apologize for the inconvenience. Our team has been notified
                and is working to fix the issue.
              </Typography>

              {import.meta.env.NODE_ENV === "development" && (
                <Paper
                  sx={{
                    p: 3,
                    mb: 4,
                    bgcolor: "grey.50",
                    textAlign: "left",
                    overflow: "auto",
                    maxHeight: 200,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, display: "block", mb: 1 }}
                  >
                    Error Details (Development Only):
                  </Typography>
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      color: "error.main",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                    }}
                  >
                    {this.state.error && this.state.error.toString()}
                    {"\n\n"}
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Paper>
              )}

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={this.handleReload}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Reload Page
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={this.handleReset}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    },
                  }}
                >
                  Go to Home
                </Button>
              </Box>

              <Typography
                variant="caption"
                sx={{ display: "block", mt: 4, color: "text.secondary" }}
              >
                If the problem persists, please contact support at
                support@rwandasecurity.gov.rw
              </Typography>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
