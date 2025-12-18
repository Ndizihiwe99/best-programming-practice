import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Alert,
  LinearProgress,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import {
  Save as SaveIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { apiService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Settings states
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reportUpdates: true,
    monthlyDigest: true,
    securityAlerts: true,
  });
  const [preferenceSettings, setPreferenceSettings] = useState({
    theme: "light",
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
  });
  const [dangerZone, setDangerZone] = useState({
    confirmDelete: "",
  });

  // Dialog states
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "hi", name: "Hindi" },
  ];

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Berlin",
    "Asia/Kolkata",
    "Asia/Tokyo",
  ];

  const dateFormats = [
    "MM/DD/YYYY",
    "DD/MM/YYYY",
    "YYYY-MM-DD",
    "MMMM DD, YYYY",
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/settings");
      const data = response.data || {};

      if (data.notifications) {
        setNotificationSettings(data.notifications);
      }
      if (data.preferences) {
        setPreferenceSettings(data.preferences);
      }
      setError("");
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await apiService.put("/settings/notifications", notificationSettings);
      setSuccess("Notification settings updated successfully!");
    } catch (err) {
      console.error("Error saving notifications:", err);
      setError(err.response?.data?.message || "Failed to update notifications");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await apiService.put("/settings/preferences", preferenceSettings);
      setSuccess("Preferences updated successfully!");
    } catch (err) {
      console.error("Error saving preferences:", err);
      setError(err.response?.data?.message || "Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (securityData.newPassword !== securityData.confirmPassword) {
        setError("New passwords do not match");
        return;
      }

      await apiService.put("/auth/change-password", {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });

      setSuccess("Password changed successfully!");
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangePasswordDialog(false);
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSaving(true);
      setError("");

      if (dangerZone.confirmDelete !== "DELETE") {
        setError("Please type DELETE to confirm");
        return;
      }

      await apiService.delete("/account");

      logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(err.response?.data?.message || "Failed to delete account");
      setSaving(false);
    }
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferenceSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
        Account Settings
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
        {/* Security Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <SecurityIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h6" fontWeight="bold">
                Security Settings
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight="medium"
                    >
                      Two-Factor Authentication
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Add an extra layer of security to your account
                    </Typography>
                    <Button variant="outlined" size="small">
                      {user?.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight="medium"
                    >
                      Active Sessions
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Manage your active login sessions
                    </Typography>
                    <Button variant="outlined" size="small">
                      View Sessions
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => setChangePasswordDialog(true)}
              >
                Change Password
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <NotificationsIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h6" fontWeight="bold">
                Notifications
              </Typography>
            </Box>

            <List>
              {Object.entries(notificationSettings).map(([key, value]) => (
                <ListItem key={key} divider>
                  <ListItemText
                    primary={key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    secondary={`Receive ${key.toLowerCase()} notifications`}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={value}
                      onChange={() => handleNotificationToggle(key)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveNotifications}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Notifications"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <PaletteIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h6" fontWeight="bold">
                Preferences
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={preferenceSettings.theme}
                    label="Theme"
                    onChange={(e) =>
                      handlePreferenceChange("theme", e.target.value)
                    }
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={preferenceSettings.language}
                    label="Language"
                    onChange={(e) =>
                      handlePreferenceChange("language", e.target.value)
                    }
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={preferenceSettings.timezone}
                    label="Timezone"
                    onChange={(e) =>
                      handlePreferenceChange("timezone", e.target.value)
                    }
                  >
                    {timezones.map((tz) => (
                      <MenuItem key={tz} value={tz}>
                        {tz}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={preferenceSettings.dateFormat}
                    label="Date Format"
                    onChange={(e) =>
                      handlePreferenceChange("dateFormat", e.target.value)
                    }
                  >
                    {dateFormats.map((format) => (
                      <MenuItem key={format} value={format}>
                        {format}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSavePreferences}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Danger Zone */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, border: "2px solid #ff4444" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <DeleteIcon sx={{ mr: 2, color: "error.main" }} />
              <Typography variant="h6" fontWeight="bold" color="error">
                Danger Zone
              </Typography>
            </Box>

            <Typography variant="body2" color="textSecondary" paragraph>
              These actions are irreversible. Please proceed with caution.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => setDeleteAccountDialog(true)}
                >
                  Delete Account
                </Button>
                <Typography variant="caption" color="textSecondary">
                  Permanently delete your account and all data
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  color="warning"
                  fullWidth
                  onClick={() => alert("Export feature coming soon!")}
                >
                  Export Data
                </Button>
                <Typography variant="caption" color="textSecondary">
                  Download all your data in JSON format
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordDialog}
        onClose={() => setChangePasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.current ? "text" : "password"}
              value={securityData.currentPassword}
              onChange={(e) =>
                setSecurityData({
                  ...securityData,
                  currentPassword: e.target.value,
                })
              }
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("current")}
                    >
                      {showPasswords.current ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? "text" : "password"}
              value={securityData.newPassword}
              onChange={(e) =>
                setSecurityData({
                  ...securityData,
                  newPassword: e.target.value,
                })
              }
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility("new")}>
                      {showPasswords.new ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              value={securityData.confirmPassword}
              onChange={(e) =>
                setSecurityData({
                  ...securityData,
                  confirmPassword: e.target.value,
                })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showPasswords.confirm ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={saving}
          >
            {saving ? "Changing..." : "Change Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteAccountDialog}
        onClose={() => setDeleteAccountDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. All your data will be permanently
            deleted.
          </Alert>
          <Typography variant="body2" paragraph>
            To confirm, please type <strong>DELETE</strong> in the box below:
          </Typography>
          <TextField
            fullWidth
            value={dangerZone.confirmDelete}
            onChange={(e) => setDangerZone({ confirmDelete: e.target.value })}
            placeholder="DELETE"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            disabled={saving}
          >
            {saving ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
