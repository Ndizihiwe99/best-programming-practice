import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context
import { AuthProvider } from "./context/AuthContext";

// Layout Components
import MainLayout from "./components/Layout/MainLayout";
import AuthLayout from "./components/Layout/AuthLayout";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Dashboard from "./pages/dashboard/Dashboard";
import AllReports from "./pages/reports/AllReports";
import MyReports from "./pages/reports/MyReports";
import ReportForm from "./pages/reports/ReportForm";
import ReportDetails from "./pages/reports/ReportDetails";
import ReportStatistics from "./pages/reports/ReportStatistics";

import AdminDashboard from "./pages/admin/AdminDashboard";
import PoliceStations from "./pages/admin/PoliceStations";
import PoliceOfficers from "./pages/admin/PoliceOfficers";

import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";

// Guards
import PrivateRoute from "./components/guards/PrivateRoute";
import RoleBasedRoute from "./components/guards/RoleBasedRoute";

// Theme
import theme from "./styles/theme";

// Components
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth Routes - Without Sidebar */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              {/* Main App Routes - With Sidebar */}
              <Route element={<MainLayout />}>
                {/* Dashboard */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />

                {/* Reports */}
                <Route
                  path="/reports"
                  element={
                    <PrivateRoute>
                      <AllReports />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reports/my"
                  element={
                    <PrivateRoute>
                      <MyReports />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reports/new"
                  element={
                    <PrivateRoute>
                      <ReportForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reports/:id"
                  element={
                    <PrivateRoute>
                      <ReportDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reports/statistics"
                  element={
                    <RoleBasedRoute allowedRoles={["police_officer", "admin"]}>
                      {/* <ReportStatistics /> */}
                    </RoleBasedRoute>
                  }
                />

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <RoleBasedRoute allowedRoles={["admin", "police_admin"]}>
                      <AdminDashboard />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/admin/stations"
                  element={
                    <RoleBasedRoute allowedRoles={["admin", "police_admin"]}>
                      <PoliceStations />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/admin/officers"
                  element={
                    <RoleBasedRoute allowedRoles={["admin", "police_admin"]}>
                      <PoliceOfficers />
                    </RoleBasedRoute>
                  }
                />

                {/* User */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
              </Route>

              {/* Error Routes */}
              <Route path="/404" element={<div>404 - Page Not Found</div>} />
              <Route path="/500" element={<div>500 - Server Error</div>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </AuthProvider>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{
            width: "420px",
            maxWidth: "90vw",
            fontSize: "14px",
          }}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
