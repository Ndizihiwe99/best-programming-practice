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
  Avatar,
  Grid,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { apiService } from "../../services/api";

const PoliceOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    badgeNumber: "",
    email: "",
    phone: "",
    rank: "",
    station: "",
    status: "active",
  });

  const ranks = [
    "Constable",
    "Head Constable",
    "Assistant Sub-Inspector",
    "Sub-Inspector",
    "Inspector",
    "Deputy Superintendent",
    "Superintendent",
    "Deputy Commissioner",
    "Commissioner",
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [officersRes, stationsRes] = await Promise.all([
        apiService.get("/admin/officers"),
        apiService.get("/admin/stations"),
      ]);

      setOfficers(officersRes.data?.officers || []);
      setStations(stationsRes.data?.stations || []);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
      // Demo data
      setOfficers([
        {
          _id: "1",
          badgeNumber: "BDG001",
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@police.gov",
          phone: "+1 234-567-8901",
          rank: "Inspector",
          station: "Central Police Station",
          status: "active",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          badgeNumber: "BDG002",
          firstName: "Jane",
          lastName: "Doe",
          email: "jane.doe@police.gov",
          phone: "+1 234-567-8902",
          rank: "Sub-Inspector",
          station: "Downtown Police Station",
          status: "active",
          createdAt: new Date().toISOString(),
        },
      ]);
      setStations([
        { _id: "1", name: "Central Police Station" },
        { _id: "2", name: "Downtown Police Station" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (officer = null) => {
    if (officer) {
      setEditingOfficer(officer);
      setFormData(officer);
    } else {
      setEditingOfficer(null);
      setFormData({
        firstName: "",
        lastName: "",
        badgeNumber: "",
        email: "",
        phone: "",
        rank: "",
        station: "",
        status: "active",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOfficer(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingOfficer) {
        await apiService.put(`/admin/officers/${editingOfficer._id}`, formData);
      } else {
        await apiService.post("/admin/officers", formData);
      }
      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error("Error saving officer:", err);
      setError("Failed to save officer");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this officer?")) {
      try {
        await apiService.delete(`/admin/officers/${id}`);
        fetchData();
      } catch (err) {
        console.error("Error deleting officer:", err);
        setError("Failed to delete officer");
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

  const getRankColor = (rank) => {
    const rankColors = {
      Constable: "default",
      "Head Constable": "primary",
      "Assistant Sub-Inspector": "secondary",
      "Sub-Inspector": "info",
      Inspector: "success",
      "Deputy Superintendent": "warning",
      Superintendent: "error",
      "Deputy Commissioner": "primary",
      Commissioner: "secondary",
    };
    return rankColors[rank] || "default";
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
          Police Officers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Officer
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
                Total Officers
              </Typography>
              <Typography variant="h4">{officers.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Officers
              </Typography>
              <Typography variant="h4">
                {officers.filter((o) => o.status === "active").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                By Station
              </Typography>
              <Typography variant="h4">
                {new Set(officers.map((o) => o.station)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Officers Table */}
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Badge Number</TableCell>
                <TableCell>Officer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Station</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {officers.map((officer) => (
                <TableRow key={officer._id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                        <BadgeIcon />
                      </Avatar>
                      <Typography>{officer.badgeNumber}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {officer.firstName} {officer.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        <EmailIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {officer.email}
                      </Typography>
                      <Typography variant="body2">
                        <PhoneIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {officer.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={officer.rank}
                      color={getRankColor(officer.rank)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{officer.station}</TableCell>
                  <TableCell>
                    <Chip
                      label={officer.status}
                      color={officer.status === "active" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(officer)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(officer._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {officers.length === 0 && (
          <Typography sx={{ p: 3, textAlign: "center" }}>
            No police officers found
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
          {editingOfficer ? "Edit Police Officer" : "Add New Police Officer"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Badge Number"
                  name="badgeNumber"
                  value={formData.badgeNumber}
                  onChange={handleInputChange}
                  required
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
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Rank</InputLabel>
                  <Select
                    name="rank"
                    value={formData.rank}
                    label="Rank"
                    onChange={handleInputChange}
                  >
                    {ranks.map((rank) => (
                      <MenuItem key={rank} value={rank}>
                        {rank}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Station</InputLabel>
                  <Select
                    name="station"
                    value={formData.station}
                    label="Station"
                    onChange={handleInputChange}
                  >
                    {stations.map((station) => (
                      <MenuItem key={station._id} value={station.name}>
                        {station.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="on_leave">On Leave</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingOfficer ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PoliceOfficers;
