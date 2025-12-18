import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { apiService } from "../../services/api";

const PoliceStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    inCharge: "",
    totalOfficers: 0,
    status: "active",
  });

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/admin/stations");
      setStations(response.data?.stations || []);
      setError("");
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError("Failed to load police stations");
      // Demo data
      setStations([
        {
          _id: "1",
          stationCode: "PS001",
          name: "Central Police Station",
          address: "123 Main Street",
          city: "New York",
          state: "NY",
          pincode: "10001",
          phone: "+1 234-567-8901",
          email: "central@police.gov",
          inCharge: "John Smith",
          totalOfficers: 25,
          status: "active",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          stationCode: "PS002",
          name: "Downtown Police Station",
          address: "456 Broadway",
          city: "New York",
          state: "NY",
          pincode: "10002",
          phone: "+1 234-567-8902",
          email: "downtown@police.gov",
          inCharge: "Jane Doe",
          totalOfficers: 18,
          status: "active",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleOpenDialog = (station = null) => {
    if (station) {
      setEditingStation(station);
      setFormData(station);
    } else {
      setEditingStation(null);
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        email: "",
        inCharge: "",
        totalOfficers: 0,
        status: "active",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStation(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingStation) {
        await apiService.put(`/admin/stations/${editingStation._id}`, formData);
      } else {
        await apiService.post("/admin/stations", formData);
      }
      handleCloseDialog();
      fetchStations();
    } catch (err) {
      console.error("Error saving station:", err);
      setError("Failed to save station");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      try {
        await apiService.delete(`/admin/stations/${id}`);
        fetchStations();
      } catch (err) {
        console.error("Error deleting station:", err);
        setError("Failed to delete station");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Police Stations
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Station
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Stations
              </Typography>
              <Typography variant="h4">{stations.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Stations
              </Typography>
              <Typography variant="h4">
                {stations.filter((s) => s.status === "active").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Officers
              </Typography>
              <Typography variant="h4">
                {stations.reduce(
                  (sum, station) => sum + (station.totalOfficers || 0),
                  0
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stations Table */}
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Station Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>In Charge</TableCell>
                <TableCell>Officers</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station._id}>
                  <TableCell>{station.stationCode}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                        <LocationIcon />
                      </Avatar>
                      <Typography>{station.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{station.address}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {station.city}, {station.state} {station.pincode}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        <PhoneIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {station.phone}
                      </Typography>
                      <Typography variant="body2">
                        <EmailIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {station.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{station.inCharge}</TableCell>
                  <TableCell>{station.totalOfficers}</TableCell>
                  <TableCell>
                    <Chip
                      label={station.status}
                      color={station.status === "active" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(station)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(station._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {stations.length === 0 && (
          <Typography sx={{ p: 3, textAlign: "center" }}>
            No police stations found
          </Typography>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingStation ? "Edit Police Station" : "Add New Police Station"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Station Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="In Charge"
                  name="inCharge"
                  value={formData.inCharge}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Officers"
                  name="totalOfficers"
                  type="number"
                  value={formData.totalOfficers}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingStation ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PoliceStations;
