import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Download,
  Print,
  Share,
  Refresh,
  Assignment,
  Warning,
  CheckCircle,
  Pending,
} from "@mui/icons-material";
import { formatDate, getStatusColor, truncateText } from "../../utils/helpers";
import { REPORT_STATUS, CRIME_CATEGORIES } from "../../utils/constants";

const ReportTable = ({
  reports = [],
  loading = false,
  selected = [],
  onSelect,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  onExport,
  onRefresh,
  total = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  sortBy = "createdAt",
  sortDirection = "desc",
  onSort,
  //   filters = {},
  onFilter,
  enableSelection = true,
  enableActions = true,
  enableExport = true,
  enableFilter = true,
  showStatusChips = true,
  showCategory = true,
  showLocation = true,
  showAssignee = true,
  dense = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // Filtered reports
  const filteredReports = useMemo(() => {
    if (!searchTerm) return reports;

    return reports.filter(
      (report) =>
        report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporterName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  // Columns configuration
  const columns = [
    ...(enableSelection ? [{ id: "selection", label: "", width: 60 }] : []),
    { id: "reportId", label: "Report ID", sortable: true, width: 150 },
    { id: "title", label: "Title", sortable: true, width: 250 },
    ...(showCategory
      ? [{ id: "category", label: "Category", sortable: true, width: 150 }]
      : []),
    { id: "status", label: "Status", sortable: true, width: 150 },
    ...(showLocation
      ? [{ id: "location", label: "Location", sortable: false, width: 150 }]
      : []),
    { id: "createdAt", label: "Date", sortable: true, width: 150 },
    ...(showAssignee
      ? [{ id: "assignee", label: "Assignee", sortable: false, width: 150 }]
      : []),
    ...(enableActions ? [{ id: "actions", label: "Actions", width: 120 }] : []),
  ];

  // Get category label
  const getCategoryLabel = (categoryCode) => {
    const category = CRIME_CATEGORIES.find((cat) => cat.code === categoryCode);
    return category ? category.en : categoryCode;
  };

  // Get status label
  const getStatusLabel = (statusCode) => {
    const status = Object.values(REPORT_STATUS).find(
      (s) => s.code === statusCode
    );
    return status ? status.en : statusCode;
  };

  // Get status icon
  const getStatusIcon = (statusCode) => {
    switch (statusCode) {
      case "YARANGIYE":
        return <CheckCircle fontSize="small" />;
      case "YAHINJIRIJWE":
        return <Warning fontSize="small" />;
      case "IRI_MU_BURYO":
        return <Pending fontSize="small" />;
      default:
        return <Assignment fontSize="small" />;
    }
  };

  // Handle row selection
  const handleSelectRow = (id) => {
    if (onSelect) {
      onSelect(id);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll(filteredReports.map((report) => report.id));
    }
  };

  // Handle view
  const handleView = (report) => {
    if (onView) {
      onView(report);
    }
  };

  // Handle edit
  const handleEdit = (report) => {
    if (onEdit) {
      onEdit(report);
    }
  };

  // Handle delete
  const handleDelete = (report) => {
    if (onDelete) {
      onDelete(report);
    }
  };

  // Handle export
  const handleExport = (format = "csv") => {
    if (onExport) {
      onExport(format);
    }
  };

  // Open action menu
  const handleActionClick = (event, report) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  // Close action menu
  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedReport(null);
  };

  // Open filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Close filter menu
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Apply filter
  const handleFilterApply = (filter) => {
    if (onFilter) {
      onFilter(filter);
    }
    handleFilterClose();
  };

  // Clear filters
  const handleClearFilters = () => {
    if (onFilter) {
      onFilter({});
    }
    handleFilterClose();
  };

  // Is all selected
  const isAllSelected =
    filteredReports.length > 0 &&
    filteredReports.every((report) => selected.includes(report.id));

  // Is indeterminate
  const isIndeterminate =
    filteredReports.some((report) => selected.includes(report.id)) &&
    !isAllSelected;

  if (loading && reports.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading reports...</Typography>
      </Box>
    );
  }

  if (!loading && reports.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Assignment sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No reports found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {searchTerm
            ? `No reports matching "${searchTerm}"`
            : "Start by creating your first report"}
        </Typography>
        {onRefresh && (
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
          >
            Refresh
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {/* Toolbar */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search reports..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, maxWidth: 400 }}
        />

        <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
          {enableFilter && (
            <>
              <Tooltip title="Filter">
                <IconButton onClick={handleFilterClick}>
                  <FilterList />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
                PaperProps={{
                  sx: { minWidth: 200 },
                }}
              >
                <MenuItem
                  onClick={() => handleFilterApply({ status: "YARANGIYE" })}
                >
                  Show Resolved
                </MenuItem>
                <MenuItem
                  onClick={() => handleFilterApply({ status: "IRI_MU_BURYO" })}
                >
                  Show In Progress
                </MenuItem>
                <MenuItem
                  onClick={() => handleFilterApply({ status: "YATANZWE" })}
                >
                  Show Pending
                </MenuItem>
                <MenuItem onClick={handleClearFilters}>Clear Filters</MenuItem>
              </Menu>
            </>
          )}

          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>
          )}

          {enableExport && (
            <Tooltip title="Export">
              <IconButton onClick={() => handleExport("csv")}>
                <Download />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Print">
            <IconButton onClick={() => window.print()}>
              <Print />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size={dense ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    width: column.width,
                    fontWeight: 600,
                    bgcolor: "grey.50",
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.id === "selection" ? (
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                      size="small"
                    />
                  ) : column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortDirection}
                      onClick={() => onSort && onSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredReports.map((report) => (
              <TableRow
                key={report.id}
                hover
                selected={selected.includes(report.id)}
                sx={{
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                  "&.Mui-selected": {
                    bgcolor: "primary.light",
                  },
                }}
              >
                {/* Selection Checkbox */}
                {enableSelection && (
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(report.id)}
                      onChange={() => handleSelectRow(report.id)}
                      size="small"
                    />
                  </TableCell>
                )}

                {/* Report ID */}
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontFamily: "monospace" }}
                  >
                    {report.reportId}
                  </Typography>
                </TableCell>

                {/* Title */}
                <TableCell>
                  <Tooltip title={report.title}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {truncateText(report.title, 40)}
                    </Typography>
                  </Tooltip>
                  {report.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {truncateText(report.description, 60)}
                    </Typography>
                  )}
                </TableCell>

                {/* Category */}
                {showCategory && (
                  <TableCell>
                    <Chip
                      label={getCategoryLabel(report.category)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                )}

                {/* Status */}
                <TableCell>
                  {showStatusChips ? (
                    <Chip
                      icon={getStatusIcon(report.status)}
                      label={getStatusLabel(report.status)}
                      size="small"
                      color={getStatusColor(report.status)}
                      sx={{ fontWeight: 500 }}
                    />
                  ) : (
                    <Typography variant="body2">
                      {getStatusLabel(report.status)}
                    </Typography>
                  )}
                </TableCell>

                {/* Location */}
                {showLocation && (
                  <TableCell>
                    <Typography variant="body2">{report.district}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {report.sector}
                    </Typography>
                  </TableCell>
                )}

                {/* Date */}
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(report.createdAt, "short")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(report.createdAt, "time")}
                  </Typography>
                </TableCell>

                {/* Assignee */}
                {showAssignee && (
                  <TableCell>
                    {report.assignedTo ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                          {report.assignedTo?.firstName?.[0]}
                          {report.assignedTo?.lastName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {report.assignedTo?.firstName}{" "}
                            {report.assignedTo?.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {report.assignedTo?.badgeNumber}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        Unassigned
                      </Typography>
                    )}
                  </TableCell>
                )}

                {/* Actions */}
                {enableActions && (
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => handleView(report)}
                          sx={{ color: "primary.main" }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(report)}
                          sx={{ color: "warning.main" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="More">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionClick(e, report)}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
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
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
        PaperProps={{
          sx: { minWidth: 180 },
        }}
      >
        <MenuItem
          onClick={() => {
            handleView(selectedReport);
            handleActionClose();
          }}
        >
          <Visibility fontSize="small" sx={{ mr: 2 }} />
          View Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleEdit(selectedReport);
            handleActionClose();
          }}
        >
          <Edit fontSize="small" sx={{ mr: 2 }} />
          Edit Report
        </MenuItem>

        <MenuItem
          onClick={() => {
            // Handle share
            navigator.clipboard.writeText(
              `${window.location.origin}/reports/${selectedReport.id}`
            );
            handleActionClose();
          }}
        >
          <Share fontSize="small" sx={{ mr: 2 }} />
          Share Link
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDelete(selectedReport);
            handleActionClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default ReportTable;
