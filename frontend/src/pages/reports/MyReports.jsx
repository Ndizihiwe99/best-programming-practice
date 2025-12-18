import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { reportAPI } from "../../services/api";
import { REPORT_STATUS, CRIME_CATEGORIES } from "../../utils/constants";

const MyReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    search: "",
  });

  useEffect(() => {
    fetchReports();
  }, [page, rowsPerPage, filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category }),
      };

      const response = await reportAPI.getMyReports(params);
      setReports(response.data.data.reports || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const getStatusColor = (statusCode) => {
    switch (statusCode) {
      case "YATANZWE":
        return "warning";
      case "IRI_MU_BURYO":
        return "info";
      case "YEMEJWE":
        return "success";
      case "YARANGIYE":
        return "success";
      case "YAHINJIRIJWE":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("rw-RW", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4">Raporo Zanye</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/submit-report")}
            >
              Tanga Raporo Nshya
            </Button>
          </Box>

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Imimerere"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <MenuItem value="">Zose</MenuItem>
                {Object.values(REPORT_STATUS).map((status) => (
                  <MenuItem key={status.code} value={status.code}>
                    {status.rw}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Ubwoko"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <MenuItem value="">Zose</MenuItem>
                {CRIME_CATEGORIES.map((cat) => (
                  <MenuItem key={cat.code} value={cat.code}>
                    {cat.rw}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Shaka"
                placeholder="Shaka mu mitwe..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  endAdornment: <SearchIcon color="action" />,
                }}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Reports Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID ya Raporo</TableCell>
                  <TableCell>Umutwe</TableCell>
                  <TableCell>Ubwoko</TableCell>
                  <TableCell>Imimerere</TableCell>
                  <TableCell>Itariki</TableCell>
                  <TableCell>Ibikorwa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                      <Typography sx={{ mt: 2 }}>Kuramba Raporo...</Typography>
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Nta raporo zabonetse. Tanga raporo ya mbere!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report._id} hover>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {report.reportId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{report.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {report.district}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const cat = CRIME_CATEGORIES.find(
                            (c) => c.code === report.category
                          );
                          return cat ? cat.rw : report.category;
                        })()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={(() => {
                            const status = Object.values(REPORT_STATUS).find(
                              (s) => s.code === report.status.code
                            );
                            return status ? status.rw : report.status.code;
                          })()}
                          color={getStatusColor(report.status.code)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(report.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => navigate(`/report/${report._id}`)}
                        >
                          Reba
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Raporo ku ipaji:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} bya ${count}`
            }
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default MyReports;
