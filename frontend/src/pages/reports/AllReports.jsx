import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import {
  Add,
  FilterList,
  Search,
  Clear,
  Download,
  Refresh,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useReports } from "../../hooks/useReports";
import ReportTable from "../../components/ui/ReportTable";
import StatsCard from "../../components/ui/StatsCard";
import PageHeader from "../../components/common/PageHeader";
// import { formatDate } from "../../utils/helpers";
import { REPORT_STATUS, CRIME_CATEGORIES } from "../../utils/constants";

const AllReports = () => {
  const navigate = useNavigate();
  const {
    reports,
    loading,
    pagination,
    filters,
    fetchReports,
    updateFilters,
    clearFilters,
    changePage,
    changeLimit,
    exportReports,
  } = useReports();

  const [localFilters, setLocalFilters] = useState({
    status: "",
    category: "",
    priority: "",
    district: "",
    search: "",
  });

  // Initial fetch
  useEffect(() => {
    fetchReports();
  }, []);

  // Apply filters
  const handleApplyFilters = () => {
    updateFilters(localFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setLocalFilters({
      status: "",
      category: "",
      priority: "",
      district: "",
      search: "",
    });
    clearFilters();
  };

  // Handle export
  const handleExport = (format) => {
    exportReports(format);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchReports();
  };

  // Handle view report
  const handleViewReport = (report) => {
    navigate(`/reports/${report.id}`);
  };

  // Handle edit report
  const handleEditReport = (report) => {
    navigate(`/reports/${report.id}/edit`);
  };

  // Handle delete report
  const handleDeleteReport = (report) => {
    if (
      window.confirm(
        `Are you sure you want to delete report ${report.reportId}?`
      )
    ) {
      console.log("Delete report:", report.id);
      // Implement delete logic
    }
  };

  // Stats data
  const stats = [
    {
      title: "Total Reports",
      value: "1,248",
      change: "+12%",
      icon: <TrendingUp />,
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
      icon: <Warning />,
      color: "warning",
    },
    {
      title: "Pending",
      value: "143",
      change: "+5%",
      icon: <TrendingDown />,
      color: "error",
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        title="All Reports"
        subtitle="Monitor and manage all crime reports in the system"
        breadcrumbs
        actions={["download", "print"]}
        helpText="View and filter all submitted crime reports"
      />

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Filters Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <FilterList /> Filters
          </Typography>

          <Grid container spacing={3}>
            {/* Status Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={localFilters.status}
                  label="Status"
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, status: e.target.value })
                  }
                >
                  <MenuItem value="">All Status</MenuItem>
                  {Object.values(REPORT_STATUS).map((status) => (
                    <MenuItem key={status.code} value={status.code}>
                      {status.en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={localFilters.category}
                  label="Category"
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      category: e.target.value,
                    })
                  }
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {CRIME_CATEGORIES.map((category) => (
                    <MenuItem key={category.code} value={category.code}>
                      {category.en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Priority Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={localFilters.priority}
                  label="Priority"
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      priority: e.target.value,
                    })
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="URGENT">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* District Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="District"
                value={localFilters.district}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, district: e.target.value })
                }
                placeholder="Enter district"
              />
            </Grid>

            {/* Search */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                value={localFilters.search}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, search: e.target.value })
                }
                placeholder="Search reports..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Filter Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleClearFilters}
                >
                  Clear All
                </Button>
                <Button
                  variant="contained"
                  startIcon={<FilterList />}
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Active Filters */}
          {Object.values(filters).some((value) => value) && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Active Filters:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;

                  let label = value;
                  if (key === "status") {
                    const status = Object.values(REPORT_STATUS).find(
                      (s) => s.code === value
                    );
                    label = status?.en || value;
                  } else if (key === "category") {
                    const category = CRIME_CATEGORIES.find(
                      (c) => c.code === value
                    );
                    label = category?.en || value;
                  }

                  return (
                    <Chip
                      key={key}
                      label={`${key}: ${label}`}
                      size="small"
                      onDelete={() => updateFilters({ [key]: "" })}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Table Header */}
          <Box sx={{ p: 3, pb: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                All Reports ({pagination.total})
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleExport("csv")}
                >
                  Export
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate("/reports/new")}
                >
                  New Report
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Table */}
          <Box sx={{ p: 3 }}>
            <ReportTable
              reports={reports}
              loading={loading}
              total={pagination.total}
              page={pagination.page - 1}
              rowsPerPage={pagination.limit}
              onPageChange={(e, newPage) => changePage(newPage + 1)}
              onRowsPerPageChange={(e) =>
                changeLimit(parseInt(e.target.value, 10))
              }
              onView={handleViewReport}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
              onExport={handleExport}
              onRefresh={handleRefresh}
              enableSelection
              enableActions
              enableExport={false}
              enableFilter={false}
              showStatusChips
              showCategory
              showLocation
              showAssignee
            />
          </Box>

          {/* Quick Stats */}
          <Divider />
          <Box sx={{ p: 3, bgcolor: "grey.50" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary">
                    Average Response Time
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "success.main" }}
                  >
                    2.4 hours
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary">
                    Resolution Rate
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    85%
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary">
                    Citizen Satisfaction
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "warning.main" }}
                  >
                    92%
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AllReports;
