import { apiService } from "./api";
import { API_ENDPOINTS } from "../utils/constants";

export const reportService = {
  // Get all reports (with filters)
  getAllReports: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });

      const url = `${API_ENDPOINTS.REPORTS.BASE}?${params.toString()}`;
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get my reports
  getMyReports: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });

      const url = `${API_ENDPOINTS.REPORTS.MY_REPORTS}?${params.toString()}`;
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single report by ID
  getReportById: async (id) => {
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.BASE}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new report
  createReport: async (reportData) => {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.REPORTS.BASE,
        reportData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update report
  updateReport: async (id, reportData) => {
    try {
      const response = await apiService.put(
        `${API_ENDPOINTS.REPORTS.BASE}/${id}`,
        reportData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update report status
  updateReportStatus: async (id, statusData) => {
    try {
      const response = await apiService.patch(
        `${API_ENDPOINTS.REPORTS.BASE}/${id}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add investigation note
  addInvestigationNote: async (id, noteData) => {
    try {
      const response = await apiService.post(
        `${API_ENDPOINTS.REPORTS.BASE}/${id}/notes`,
        noteData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Assign report to officer
  assignReport: async (id, assignmentData) => {
    try {
      const response = await apiService.post(
        `${API_ENDPOINTS.REPORTS.BASE}/${id}/assign`,
        assignmentData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get report statistics
  getReportStatistics: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });

      const url = `${API_ENDPOINTS.REPORTS.STATISTICS}?${params.toString()}`;
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get nearby reports
  getNearbyReports: async (location, radius = 5) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.REPORTS.NEARBY, {
        params: {
          lat: location.latitude,
          lng: location.longitude,
          radius,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload report attachments
  uploadAttachments: async (id, files) => {
    try {
      const response = await apiService.uploadMultiple(
        `${API_ENDPOINTS.REPORTS.BASE}/${id}/attachments`,
        files
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete report
  deleteReport: async (id) => {
    try {
      const response = await apiService.delete(
        `${API_ENDPOINTS.REPORTS.BASE}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export reports
  exportReports: async (filters = {}, format = "csv") => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });

      params.append("format", format);

      const url = `${API_ENDPOINTS.REPORTS.BASE}/export?${params.toString()}`;
      const response = await apiService.get(url, {
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `reports-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

export default reportService;
