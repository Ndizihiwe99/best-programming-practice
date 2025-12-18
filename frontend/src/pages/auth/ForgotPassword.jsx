import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  InputAdornment,
} from "@mui/material";
import { Email, Phone, ArrowBack, LockReset } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!emailOrPhone.trim()) {
      setError("Please enter your email or phone number");
      setLoading(false);
      return;
    }

    try {
      await forgotPassword(emailOrPhone);
      setSuccess(
        "Password reset instructions have been sent to your email/phone"
      );

      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reset instructions"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/login")}
          sx={{ mb: 3 }}
        >
          Back to Login
        </Button>

        <Card
          sx={{ borderRadius: 3, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "primary.light",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <LockReset sx={{ fontSize: 32, color: "primary.main" }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Forgot Password
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your email or phone number to reset your password
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email or Phone Number"
                placeholder="john@example.com or 0781234567"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {emailOrPhone.includes("@") ? (
                        <Email color="action" />
                      ) : (
                        <Phone color="action" />
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Reset Instructions"
                )}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    style={{
                      textDecoration: "none",
                      fontWeight: 600,
                      color: "#1a237e",
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Need help? Contact support at support@rwandasecurity.gov.rw or call
            0788 831 000
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
