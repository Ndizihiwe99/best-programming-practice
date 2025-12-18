import axios from "axios";
import { toast } from "react-toastify";
import { STORAGE_KEYS } from "../utils/constants";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(
        `[API Request] ${config.method.toUpperCase()} ${config.url}`,
        config.data || config.params
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }

    // Handle success messages from server
    if (response.data?.message && !response.config?.silent) {
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    return response;
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error("[API Error]", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        error: error.message,
      });
    }

    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Bad Request
          toast.error(
            data?.message || "Invalid request. Please check your input."
          );
          break;

        case 401:
          // Unauthorized
          toast.error("Session expired. Please login again.");
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          window.location.href = "/login";
          break;

        case 403:
          // Forbidden
          toast.error("You do not have permission to perform this action.");
          break;

        case 404:
          // Not Found
          toast.error("Resource not found.");
          break;

        case 422:
          // Validation Error
          if (data?.errors) {
            const errors = Object.values(data.errors).flat();
            errors.forEach((err) => toast.error(err));
          } else {
            toast.error(data?.message || "Validation failed.");
          }
          break;

        case 429:
          // Too Many Requests
          toast.error("Too many requests. Please try again later.");
          break;

        case 500:
          // Server Error
          toast.error("Server error. Please try again later.");
          break;

        default:
          toast.error(data?.message || "An unexpected error occurred.");
      }
    } else if (error.request) {
      // Network error
      toast.error("Network error. Please check your connection.");
    } else {
      // Request setup error
      toast.error("Request failed. Please try again.");
    }

    return Promise.reject(error);
  }
);

// API Methods - General
export const apiService = {
  // GET request
  get: (url, config = {}) => api.get(url, config),

  // POST request
  post: (url, data, config = {}) => api.post(url, data, config),

  // PUT request
  put: (url, data, config = {}) => api.put(url, data, config),

  // PATCH request
  patch: (url, data, config = {}) => api.patch(url, data, config),

  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),

  // Upload file
  upload: (url, file, fieldName = "file", config = {}) => {
    const formData = new FormData();
    formData.append(fieldName, file);

    return api.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Multiple files upload
  uploadMultiple: (url, files, fieldName = "files", config = {}) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file);
    });

    return api.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Report-specific API methods
export const reportAPI = {
  // Get all reports
  getAll: (params = {}) => api.get("/reports", { params }),

  // Get single report by ID
  getById: (id) => api.get(`/reports/${id}`),

  // Create new report
  create: (data) => api.post("/reports", data),

  // Update report
  update: (id, data) => api.put(`/reports/${id}`, data),

  // Partial update report
  partialUpdate: (id, data) => api.patch(`/reports/${id}`, data),

  // Delete report
  delete: (id) => api.delete(`/reports/${id}`),

  // Get user's reports
  getMyReports: (params = {}) => api.get("/reports/my", { params }),

  // Generate report
  generate: (data) => api.post("/reports/generate", data),

  // Download report
  download: (id) =>
    api.get(`/reports/${id}/download`, {
      responseType: "blob", // Important for file downloads
    }),

  // Share report
  share: (id, data) => api.post(`/reports/${id}/share`, data),

  // Get report statistics
  getStats: () => api.get("/reports/stats"),

  // Export reports
  export: (params = {}) =>
    api.get("/reports/export", {
      params,
      responseType: "blob",
    }),
};

export default api;
