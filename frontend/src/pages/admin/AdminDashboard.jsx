import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Alert,
} from "@mui/material";
import {
  People as PeopleIcon,
  LocationOn as StationIcon,
  Assignment as ReportIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { apiService } from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOfficers: 0,
    totalStations: 0,
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, reportsRes] = await Promise.all([
        apiService.get("/admin/dashboard/stats"),
        apiService.get("/reports?limit=5&sort=-createdAt"),
      ]);

      setStats(statsRes.data || {});
      setRecentReports(reportsRes.data?.reports || []);
      setError("");
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
      // For demo purposes, show sample data
      setStats({
        totalUsers: 154,
        totalOfficers: 42,
        totalStations: 8,
        totalReports: 1287,
        pendingReports: 23,
        resolvedReports: 1245,
      });
      setRecentReports([
        {
          _id: "1",
          reportId: "RPT-2024-001",
          title: "Traffic Violation",
          status: "resolved",
          createdAt: new Date().toISOString(),
          reporterName: "John Doe",
        },
        {
          _id: "2",
          reportId: "RPT-2024-002",
          title: "Noise Complaint",
          status: "pending",
          createdAt: new Date().toISOString(),
          reporterName: "Jane Smith",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <PeopleIcon fontSize="large" />,
      color: "#1976d2",
      bgColor: "#e3f2fd",
    },
    {
      title: "Police Officers",
      value: stats.totalOfficers,
      icon: <PeopleIcon fontSize="large" />,
      color: "#2e7d32",
      bgColor: "#e8f5e9",
    },
    {
      title: "Police Stations",
      value: stats.totalStations,
      icon: <StationIcon fontSize="large" />,
      color: "#ed6c02",
      bgColor: "#fff3e0",
    },
    {
      title: "Total Reports",
      value: stats.totalReports,
      icon: <ReportIcon fontSize="large" />,
      color: "#9c27b0",
      bgColor: "#f3e5f5",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in_progress":
        return "info";
      case "resolved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
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
          Admin Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: card.bgColor,
                borderLeft: `4px solid ${card.color}`,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Report Status
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TrendingUpIcon sx={{ mr: 1, color: "success.main" }} />
              <Typography>Resolved Reports: {stats.resolvedReports}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TrendingUpIcon sx={{ mr: 1, color: "warning.main" }} />
              <Typography>Pending Reports: {stats.pendingReports}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={() => navigate("/admin/officers")}
              >
                Manage Officers
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/stations")}
              >
                View Stations
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/reports/statistics")}
              >
                View Analytics
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Reports */}
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
            Recent Reports
          </Typography>
          <Button onClick={() => navigate("/reports")}>View All</Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Report ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Reporter</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>{report.reportId || report._id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.reporterName || "N/A"}</TableCell>
                  <TableCell>
                    {format(new Date(report.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={report.status}
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/reports/${report._id}`)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {recentReports.length === 0 && (
          <Typography sx={{ p: 3, textAlign: "center" }}>
            No reports found
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
