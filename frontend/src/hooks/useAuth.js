import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        if (token && storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);

          // Optionally validate token with server
          // await authService.getCurrentUser();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        authService.clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      try {
        const response = await authService.login(credentials);

        if (response.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          toast.success("Login successful!");
          navigate("/dashboard");
          return { success: true };
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Register function
  const register = useCallback(
    async (userData) => {
      setLoading(true);
      try {
        const response = await authService.register(userData);

        if (response.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          toast.success("Registration successful!");
          navigate("/dashboard");
          return { success: true };
        }
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.info("You have been logged out.");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API fails
      setUser(null);
      setIsAuthenticated(false);
      authService.clearAuthData();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Update profile function
  const updateProfile = useCallback(async (userData) => {
    try {
      const response = await authService.updateProfile(userData);

      if (response.success) {
        setUser(response.data.user);
        toast.success("Profile updated successfully!");
        return { success: true };
      }
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }, []);

  // Change password function
  const changePassword = useCallback(async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);

      if (response.success) {
        toast.success("Password changed successfully!");
        return { success: true };
      }
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }, []);

  // Forgot password function
  const forgotPassword = useCallback(async (emailOrPhone) => {
    try {
      const response = await authService.forgotPassword(emailOrPhone);

      if (response.success) {
        toast.success("Password reset instructions sent!");
        return { success: true };
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (resetData) => {
    try {
      const response = await authService.resetPassword(resetData);

      if (response.success) {
        toast.success("Password reset successful!");
        return { success: true };
      }
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }, []);

  // Check if user has role
  const hasRole = useCallback(
    (role) => {
      if (!user || !user.role) return false;
      return user.role === role;
    },
    [user]
  );

  // Check if user has any of the roles
  const hasAnyRole = useCallback(
    (roles) => {
      if (!user || !user.role) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  // Check if user has all roles
  const hasAllRoles = useCallback(
    (roles) => {
      if (!user || !user.role) return false;
      return roles.every((role) => user.role === role);
    },
    [user]
  );

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();

      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      throw error;
    }
  }, []);

  return {
    // State
    user,
    loading,
    isAuthenticated,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshUser,

    // Role checks
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // Getters
    getToken: authService.getStoredToken,
    getUserId: () => user?.id,
    getUserRole: () => user?.role,
    getUserName: () =>
      user?.firstName ? `${user.firstName} ${user.lastName}` : "User",
  };
};

export default useAuth;
