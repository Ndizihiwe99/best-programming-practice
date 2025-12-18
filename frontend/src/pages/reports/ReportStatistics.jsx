import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Equalizer as EqualizerIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { format, subMonths, startOfMonth, endOfMonth, subDays } from "date-fns";
import { apiService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ReportStatistics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("month");
  const [viewType, setViewType] = useState("charts");
  const [stats, setStats] = useState({
    overview: {},
    trends: [],
    categoryData: [],
    statusData: [],
    monthlyData: [],
    topStations: [],
    recentReports: [],
  });

  const timeRanges = [
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "quarter", label: "Last Quarter" },
    { value: "year", label: "Last Year" },
    { value: "all", label: "All Time" },
  ];

  const reportCategories = [
    "Theft",
    "Assault",
    "Vandalism",
    "Traffic Violation",
    "Noise Complaint",
    "Missing Person",
    "Fraud",
    "Cyber Crime",
    "Drug Offense",
    "Other",
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
    "#4ECDC4",
    "#FFA726",
    "#AB47BC",
  ];

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError("");

      const params = { timeRange };
      const response = await apiService.get("/reports/statistics", { params });

      if (response.data) {
        setStats(response.data);
      } else {
        // Demo data for testing
        setDemoData();
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Failed to load statistics data");
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    const now = new Date();
    const monthlyData = [];
    const categoryData = [];

    // Generate monthly data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      monthlyData.push({
        month: format(date, "MMM"),
        total: Math.floor(Math.random() * 100) + 50,
        resolved: Math.floor(Math.random() * 80) + 30,
        pending: Math.floor(Math.random() * 20) + 5,
      });
    }

    // Generate category data
    reportCategories.forEach((category, index) => {
      categoryData.push({
        name: category,
        value: Math.floor(Math.random() * 100) + 10,
        color: COLORS[index % COLORS.length],
      });
    });

    setStats({
      overview: {
        totalReports: 1247,
        resolvedReports: 1123,
        pendingReports: 89,
        avgResolutionTime: "2.5",
        resolutionRate: "90%",
        monthlyGrowth: "+12%",
      },
      trends: [
        { day: "Mon", reports: 45, resolved: 38 },
        { day: "Tue", reports: 52, resolved: 47 },
        { day: "Wed", reports: 48, resolved: 42 },
        { day: "Thu", reports: 55, resolved: 50 },
        { day: "Fri", reports: 60, resolved: 52 },
        { day: "Sat", reports: 40, resolved: 35 },
        { day: "Sun", reports: 35, resolved: 30 },
      ],
      categoryData,
      statusData: [
        { name: "Resolved", value: 1123, color: "#4CAF50" },
        { name: "Pending", value: 89, color: "#FF9800" },
        { name: "In Progress", value: 35, color: "#2196F3" },
      ],
      monthlyData,
      topStations: [
        { station: "Central Station", reports: 245, resolutionRate: "92%" },
        { station: "Downtown Station", reports: 198, resolutionRate: "88%" },
        { station: "North Station", reports: 156, resolutionRate: "85%" },
        { station: "South Station", reports: 132, resolutionRate: "90%" },
        { station: "East Station", reports: 98, resolutionRate: "82%" },
      ],
      recentReports: [
        {
          id: "RPT-2024-001",
          title: "Traffic Violation",
          category: "Traffic Violation",
          status: "resolved",
          date: format(subDays(now, 1), "MMM dd"),
          station: "Central Station",
        },
        {
          id: "RPT-2024-002",
          title: "Noise Complaint",
          category: "Noise Complaint",
          status: "pending",
          date: format(subDays(now, 2), "MMM dd"),
          station: "Downtown Station",
        },
        {
          id: "RPT-2024-003",
          title: "Theft Report",
          category: "Theft",
          status: "in_progress",
          date: format(subDays(now, 3), "MMM dd"),
          station: "North Station",
        },
      ],
    });
  };

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const handleExport = () => {
    // Implement export functionality
    alert("Export feature coming soon!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "success";
      case "pending":
        return "warning";
      case "in_progress":
        return "info";
      default:
        return "default";
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Report Statistics
          </Typography>
          <Typography color="textSecondary">
            Analytics and insights for crime reports
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
              startAdornment={<CalendarIcon sx={{ mr: 1 }} />}
            >
              {timeRanges.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={(e, newView) => newView && setViewType(newView)}
            size="small"
          >
            <ToggleButton value="charts">
              <EqualizerIcon />
            </ToggleButton>
            <ToggleButton value="table">
              <TableChartIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchStatistics}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Reports
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h4">
                  {formatNumber(stats.overview.totalReports || 0)}
                </Typography>
                <TrendingUpIcon color="success" />
              </Box>
              <Typography variant="caption" color="textSecondary">
                {stats.overview.monthlyGrowth || "+0%"} from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Resolved Reports
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h4">
                  {formatNumber(stats.overview.resolvedReports || 0)}
                </Typography>
                <Box sx={{ color: "success.main" }}>✓</Box>
              </Box>
              <Typography variant="caption" color="textSecondary">
                {stats.overview.resolutionRate || "0%"} resolution rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Pending Reports
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h4">
                  {formatNumber(stats.overview.pendingReports || 0)}
                </Typography>
                <TrendingDownIcon color="warning" />
              </Box>
              <Typography variant="caption" color="textSecondary">
                Requires immediate attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Avg. Resolution Time
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h4">
                  {stats.overview.avgResolutionTime || "0"}
                </Typography>
                <TimelineIcon color="info" />
              </Box>
              <Typography variant="caption" color="textSecondary">
                Days to resolve
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {viewType === "charts" ? (
        <>
          {/* Charts Row 1 */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Monthly Report Trends
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        name="Total Reports"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="#82ca9d"
                        name="Resolved"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Report Status Distribution
                </Typography>
                <Box
                  sx={{ height: 300, display: "flex", alignItems: "center" }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Charts Row 2 */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Reports by Category
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Weekly Trend
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="reports"
                        fill="#8884d8"
                        name="Total Reports"
                      />
                      <Bar dataKey="resolved" fill="#82ca9d" name="Resolved" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        /* Table View */
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Detailed Statistics
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Total Reports</TableCell>
                      <TableCell align="right">Resolved</TableCell>
                      <TableCell align="right">Pending</TableCell>
                      <TableCell align="right">Resolution Rate</TableCell>
                      <TableCell align="right">Avg. Days</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.categoryData.map((category) => (
                      <TableRow key={category.name}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: category.color,
                                mr: 2,
                              }}
                            />
                            {category.name}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{category.value}</TableCell>
                        <TableCell align="right">
                          {Math.floor(category.value * 0.9)}
                        </TableCell>
                        <TableCell align="right">
                          {Math.floor(category.value * 0.1)}
                        </TableCell>
                        <TableCell align="right">90%</TableCell>
                        <TableCell align="right">2.5</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Additional Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Top Performing Stations
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Station</TableCell>
                    <TableCell align="right">Reports Handled</TableCell>
                    <TableCell align="right">Resolution Rate</TableCell>
                    <TableCell align="right">Performance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.topStations.map((station, index) => (
                    <TableRow key={station.station}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            #{index + 1}
                          </Typography>
                          {station.station}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{station.reports}</TableCell>
                      <TableCell align="right">
                        {station.resolutionRate}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label="Excellent"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Report Activity
            </Typography>
            <List dense>
              {stats.recentReports.map((report) => (
                <React.Fragment key={report.id}>
                  <ListItem
                    secondaryAction={
                      <Chip
                        label={report.status}
                        color={getStatusColor(report.status)}
                        size="small"
                      />
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {report.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" display="block">
                            {report.category} • {report.station}
                          </Typography>
                          <Typography variant="caption">
                            {report.date}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportStatistics;
