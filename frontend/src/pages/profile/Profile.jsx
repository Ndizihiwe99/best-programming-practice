import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Alert,
  LinearProgress,
  Divider,
  Chip,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { apiService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/profile");
      setProfileData(response.data || {});
      setError("");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
      // Demo data
      setProfileData({
        firstName: user?.firstName || "John",
        lastName: user?.lastName || "Doe",
        email: user?.email || "john.doe@example.com",
        phone: "+1 234-567-8901",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        pincode: "10001",
        dateOfBirth: "1990-01-15",
        gender: "male",
        occupation: "Software Engineer",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await apiService.put("/profile", profileData);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Update auth context if needed
      if (user) {
        // You might want to update the user context here
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const getInitials = () => {
    const first = profileData.firstName?.[0] || "";
    const last = profileData.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Profile
      </Typography>

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

      <Grid container spacing={3}>
        {/* Left Column - Profile Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  bgcolor: "primary.main",
                  mb: 2,
                }}
              >
                {getInitials()}
              </Avatar>
              {isEditing && (
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    bgcolor: "white",
                    boxShadow: 2,
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Typography variant="h6" fontWeight="bold">
              {profileData.firstName} {profileData.lastName}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {profileData.email}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Chip
                label={user?.role || "User"}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip
                label="Verified"
                color="success"
                size="small"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Quick Stats */}
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Account Information
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BadgeIcon sx={{ mr: 2, color: "text.secondary" }} />
                <Box>
                  <Typography variant="body2">Member Since</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {user?.createdAt
                      ? format(new Date(user.createdAt), "MMM yyyy")
                      : "Jan 2023"}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarIcon sx={{ mr: 2, color: "text.secondary" }} />
                <Box>
                  <Typography variant="body2">Last Updated</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {format(new Date(), "MMM dd, yyyy")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 1 }}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 1 }}
              onClick={() => (window.location.href = "/reports/my")}
            >
              My Reports
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => (window.location.href = "/settings")}
            >
              Account Settings
            </Button>
          </Paper>
        </Grid>

        {/* Right Column - Profile Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Personal Information
              </Typography>
              {isEditing ? (
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ mr: 1 }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: (
                      <LocationIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={profileData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={profileData.pincode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  SelectProps={{ native: true }}
                >
                  <option value=""></option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Occupation"
                  name="occupation"
                  value={profileData.occupation}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Additional Information */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Account Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" variant="body2">
                      Total Reports
                    </Typography>
                    <Typography variant="h5">24</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" variant="body2">
                      Reports This Month
                    </Typography>
                    <Typography variant="h5">3</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" variant="body2">
                      Resolved
                    </Typography>
                    <Typography variant="h5">18</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" variant="body2">
                      Pending
                    </Typography>
                    <Typography variant="h5">6</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
