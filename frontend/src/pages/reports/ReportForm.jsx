import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  CircularProgress,
} from "@mui/material";
import { reportAPI } from "../../services/api";
import { PROVINCES, DISTRICTS, CRIME_CATEGORIES } from "../../utils/constants";

const ReportForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [districts, setDistricts] = useState([]);
  //   const [sectors, setSectors] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    incidentDate: new Date().toISOString().split("T")[0],
    incidentTime: new Date().toTimeString().split(" ")[0].substring(0, 5),
    latitude: "-1.9441",
    longitude: "30.0619",
    address: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    isAnonymous: false,
  });

  useEffect(() => {
    if (formData.province) {
      setDistricts(DISTRICTS[formData.province] || []);
      //   setSectors([]);
      setFormData((prev) => ({ ...prev, district: "", sector: "" }));
    }
  }, [formData.province]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.category || !formData.title || !formData.description) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await reportAPI.submitReport(formData);
      setSuccess(
        `Report ${response.data.data.report.reportId} submitted successfully!`
      );

      // Clear form after successful submission
      setTimeout(() => {
        navigate("/my-reports");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            🔒 Tanga Raporo
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            gutterBottom
          >
            Tanga amakuru y'ibyaha byabaye kugira ngo abapolisi babikuremo
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Crime Details */}
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Ubwoko bwo kugirira nabi"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">Hitamo ubwoko</MenuItem>
                  {CRIME_CATEGORIES.map((cat) => (
                    <MenuItem key={cat.code} value={cat.code}>
                      {cat.rw} / {cat.en}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Umutwe w'inkuru *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Ubujura bwa telefone mu masoko"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ibisobanuro *"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                  placeholder="Sobanura neza ibyabaye, ibintu byangijwe, abantu bari bahari..."
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Intara *"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">Hitamo Intara</MenuItem>
                  {PROVINCES.map((province) => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Akarere *"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  disabled={!formData.province}
                >
                  <MenuItem value="">Hitamo Akarere</MenuItem>
                  {districts.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Umurenge *"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Akagari"
                  name="cell"
                  value={formData.cell}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Aderesi"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ej: Nyamirambo, KN 45 St"
                />
              </Grid>

              {/* Date and Time */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Itariki y'ikigeragezo *"
                  name="incidentDate"
                  type="date"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Igihe"
                  name="incidentTime"
                  type="time"
                  value={formData.incidentTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Coordinates (hidden by default, can be shown if needed) */}
              <Grid item xs={12} md={6} sx={{ display: "none" }}>
                <TextField
                  fullWidth
                  label="Latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: "none" }}>
                <TextField
                  fullWidth
                  label="Longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </Grid>

              {/* Anonymity */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={handleChange}
                    />
                  }
                  label="Tanga raporo ubusa (nta izina)"
                />
              </Grid>
            </Grid>

            <Box
              sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ minWidth: 120 }}
              >
                Subira
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ minWidth: 200, py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Tanga Raporo"
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

// ✅ THIS LINE IS CRITICAL - MUST BE AT THE END
export default ReportForm;
