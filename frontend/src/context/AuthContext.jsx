import React, { createContext, useState, useContext, useMemo } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize state directly from localStorage - NO useEffect needed
  const { initialUser, initialAuth } = useMemo(() => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        return { initialUser: parsedUser, initialAuth: true };
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return { initialUser: null, initialAuth: false };
  }, []); // Runs once on mount

  const [user, setUser] = useState(initialUser);
  const [loading] = useState(false); // No initial loading needed
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    toast.info("You have been logged out.");
  };

  const login = async (credentials) => {
    try {
      // Simulate API call
      const mockUser = {
        id: "user_123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: credentials.phoneNumber || "0781234567",
        role: "citizen",
        province: "Kigali City",
        district: "Gasabo",
        sector: "Remera",
        createdAt: new Date().toISOString(),
      };

      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      setUser(mockUser);
      setIsAuthenticated(true);

      toast.success("Login successful! Welcome back.");
      return { success: true, data: { user: mockUser, token: mockToken } };
    } catch (error) {
      toast.error("Login failed. Please try again.");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call
      const newUser = {
        id: "user_" + Date.now(),
        ...userData,
        role: "citizen",
        createdAt: new Date().toISOString(),
      };

      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5ldyBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.4Adcj3UFYzPUVaVF43FmMav6fR8c3HYnXuUxshU";

      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);

      toast.success(
        "Registration successful! Welcome to Rwanda Security Platform."
      );
      return { success: true, data: { user: newUser, token: mockToken } };
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      throw error;
    }
  };

  const updateProfile = (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
      return { success: true, user: updatedUser };
    } catch (error) {
      toast.error("Failed to update profile.");
      throw error;
    }
  };

  const changePassword = async () => {
    try {
      // Simulate API call
      toast.success("Password changed successfully!");
      return { success: true };
    } catch (error) {
      toast.error("Failed to change password.");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
