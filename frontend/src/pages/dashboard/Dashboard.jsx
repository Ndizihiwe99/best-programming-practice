// src/pages/dashboard/Dashboard.jsx
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  AvatarGroup,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp,
  Assignment,
  CheckCircle,
  Pending,
  Warning,
  AddCircle,
  Visibility,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Reports",
      value: "1,248",
      change: "+12%",
      icon: <Assignment />,
      color: "primary",
    },
    {
      title: "Resolved",
      value: "892",
      change: "+8%",
      icon: <CheckCircle />,
      color: "success",
    },
    {
      title: "In Progress",
      value: "213",
      change: "-3%",
      icon: <Pending />,
      color: "warning",
    },
    {
      title: "Pending",
      value: "143",
      change: "+5%",
      icon: <Warning />,
      color: "error",
    },
  ];

  const recentReports = [
    {
      id: "RP-2024-001",
      type: "Theft",
      location: "Gasabo",
      status: "Resolved",
      date: "2 hours ago",
    },
    {
      id: "RP-2024-002",
      type: "Assault",
      location: "Kicukiro",
      status: "In Progress",
      date: "4 hours ago",
    },
    {
      id: "RP-2024-003",
      type: "Fraud",
      location: "Nyamirambo",
      status: "Pending",
      date: "1 day ago",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of crime reports and statistics
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          onClick={() => navigate("/submit-report")}
          sx={{ borderRadius: 2 }}
        >
          New Report
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <TrendingUp
                        sx={{ color: "success.main", mr: 0.5, fontSize: 16 }}
                      />
                      <Typography
                        variant="body2"
                        color="success.main"
                        sx={{ fontWeight: 500 }}
                      >
                        {stat.change} from last week
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${stat.color}.light`,
                      color: `${stat.color}.main`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Reports */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Recent Reports
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentReports.map((report, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {report.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        size="small"
                        color={
                          report.status === "Resolved"
                            ? "success"
                            : report.status === "In Progress"
                            ? "warning"
                            : "default"
                        }
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/report/${index + 1}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Crime Distribution
              </Typography>
              <Box>
                {[
                  "Theft (35%)",
                  "Assault (22%)",
                  "Fraud (18%)",
                  "Vandalism (15%)",
                  "Others (10%)",
                ].map((crime, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2">
                        {crime.split(" (")[0]}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {crime.match(/\((\d+)%\)/)[1]}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={parseInt(crime.match(/\((\d+)%\)/)[1])}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ py: 2, borderRadius: 2 }}
                    onClick={() => navigate("/submit-report")}
                  >
                    Report Crime
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ py: 2, borderRadius: 2 }}
                    onClick={() => navigate("/my-reports")}
                  >
                    My Reports
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ py: 2, borderRadius: 2 }}
                  >
                    Safety Tips
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ py: 2, borderRadius: 2 }}
                  >
                    Contact Police
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
