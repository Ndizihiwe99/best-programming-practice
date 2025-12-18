import { apiService } from "./api";
import { STORAGE_KEYS, API_ENDPOINTS } from "../utils/constants";

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (response.data?.data?.token) {
        // Store token and user data
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(response.data.data.user)
        );
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );

      if (response.data?.data?.token) {
        // Store token and user data
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(response.data.data.user)
        );
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      // If 401, clear storage
      if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
      throw error;
    }
  },

  // Update profile
  updateProfile: async (userData) => {
    try {
      const response = await apiService.put("/auth/profile", userData);

      // Update stored user data
      if (response.data?.data?.user) {
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(response.data.data.user)
        );
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await apiService.put(
        "/auth/change-password",
        passwordData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (emailOrPhone) => {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        {
          emailOrPhone,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        resetData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Still clear localStorage even if API call fails
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  // Refresh token (if using refresh tokens)
  refreshToken: async () => {
    try {
      const response = await apiService.post("/auth/refresh");

      if (response.data?.data?.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Clear all auth data
  clearAuthData: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};

export default authService;
