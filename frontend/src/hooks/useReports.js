import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import reportService from "../services/reportService";

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({});
  const [statistics, setStatistics] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch reports with filters
  const fetchReports = useCallback(
    async (customFilters = {}) => {
      setLoading(true);
      setError(null);

      try {
        const mergedFilters = {
          ...filters,
          ...customFilters,
          page: pagination.page,
          limit: pagination.limit,
        };
        const response = await reportService.getAllReports(mergedFilters);

        if (response.success) {
          setReports(response.data.reports || []);
          setPagination({
            page: response.data.page || 1,
            limit: response.data.limit || 10,
            total: response.data.total || 0,
            pages: response.data.pages || 0,
          });
        }
      } catch (err) {
        setError(err.message || "Failed to fetch reports");
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  // Fetch my reports
  const fetchMyReports = useCallback(
    async (customFilters = {}) => {
      setLoading(true);
      setError(null);

      try {
        const mergedFilters = {
          ...filters,
          ...customFilters,
          page: pagination.page,
          limit: pagination.limit,
        };
        const response = await reportService.getMyReports(mergedFilters);

        if (response.success) {
          setReports(response.data.reports || []);
          setPagination({
            page: response.data.page || 1,
            limit: response.data.limit || 10,
            total: response.data.total || 0,
            pages: response.data.pages || 0,
          });
        }
      } catch (err) {
        setError(err.message || "Failed to fetch your reports");
        toast.error("Failed to load your reports");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  // Fetch single report
  const fetchReportById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await reportService.getReportById(id);

      if (response.success) {
        setSelectedReport(response.data.report);
        return response.data.report;
      }
    } catch (err) {
      setError(err.message || "Failed to fetch report");
      toast.error("Failed to load report details");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new report
  const createReport = useCallback(async (reportData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await reportService.createReport(reportData);

      if (response.success) {
        toast.success("Report submitted successfully!");
        return response.data.report;
      }
    } catch (err) {
      setError(err.message || "Failed to create report");
      toast.error("Failed to submit report");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update report
  const updateReport = useCallback(
    async (id, reportData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await reportService.updateReport(id, reportData);

        if (response.success) {
          toast.success("Report updated successfully!");

          // Update local state if this report is in the list
          setReports((prev) =>
            prev.map((report) =>
              report.id === id ? response.data.report : report
            )
          );

          if (selectedReport?.id === id) {
            setSelectedReport(response.data.report);
          }

          return response.data.report;
        }
      } catch (err) {
        setError(err.message || "Failed to update report");
        toast.error("Failed to update report");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedReport]
  );

  // Update report status
  const updateReportStatus = useCallback(
    async (id, statusData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await reportService.updateReportStatus(id, statusData);

        if (response.success) {
          toast.success("Report status updated!");

          // Update local state
          setReports((prev) =>
            prev.map((report) =>
              report.id === id ? { ...report, status: statusData } : report
            )
          );

          if (selectedReport?.id === id) {
            setSelectedReport((prev) => ({ ...prev, status: statusData }));
          }

          return response.data.report;
        }
      } catch (err) {
        setError(err.message || "Failed to update report status");
        toast.error("Failed to update status");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedReport]
  );

  // Add investigation note
  const addInvestigationNote = useCallback(
    async (id, noteData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await reportService.addInvestigationNote(id, noteData);

        if (response.success) {
          toast.success("Note added successfully!");

          if (selectedReport?.id === id) {
            setSelectedReport((prev) => ({
              ...prev,
              investigationNotes: [
                ...(prev.investigationNotes || []),
                response.data.note,
              ],
            }));
          }

          return response.data.note;
        }
      } catch (err) {
        setError(err.message || "Failed to add note");
        toast.error("Failed to add note");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedReport]
  );

  // Fetch statistics
  const fetchStatistics = useCallback(
    async (customFilters = {}) => {
      setLoading(true);
      setError(null);

      try {
        const mergedFilters = { ...filters, ...customFilters };
        const response = await reportService.getReportStatistics(mergedFilters);

        if (response.success) {
          setStatistics(response.data.statistics);
          return response.data.statistics;
        }
      } catch (err) {
        setError(err.message || "Failed to fetch statistics");
        toast.error("Failed to load statistics");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Change page
  const changePage = useCallback((newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  // Change limit
  const changeLimit = useCallback((newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Export reports
  const exportReports = useCallback(
    async (format = "csv") => {
      setLoading(true);

      try {
        await reportService.exportReports(filters, format);
        toast.success(`Reports exported as ${format.toUpperCase()}`);
      } catch (err) {
        toast.error("Failed to export reports");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Delete report
  const deleteReport = useCallback(
    async (id) => {
      setLoading(true);

      try {
        const response = await reportService.deleteReport(id);

        if (response.success) {
          toast.success("Report deleted successfully!");

          // Remove from local state
          setReports((prev) => prev.filter((report) => report.id !== id));

          if (selectedReport?.id === id) {
            setSelectedReport(null);
          }
        }
      } catch (err) {
        toast.error("Failed to delete report");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedReport]
  );

  // Clear selected report
  const clearSelectedReport = useCallback(() => {
    setSelectedReport(null);
  }, []);

  // Get report by ID from local state
  const getReportFromState = useCallback(
    (id) => {
      return reports.find((report) => report.id === id);
    },
    [reports]
  );

  return {
    // State
    reports,
    loading,
    error,
    pagination,
    filters,
    statistics,
    selectedReport,

    // Actions
    fetchReports,
    fetchMyReports,
    fetchReportById,
    createReport,
    updateReport,
    updateReportStatus,
    addInvestigationNote,
    fetchStatistics,
    exportReports,
    deleteReport,

    // Pagination controls
    changePage,
    changeLimit,

    // Filter controls
    updateFilters,
    clearFilters,

    // Selection
    setSelectedReport,
    clearSelectedReport,
    getReportFromState,

    // Getters
    getTotalReports: () => pagination.total,
    getCurrentPage: () => pagination.page,
    getTotalPages: () => pagination.pages,
  };
};

export default useReports;
