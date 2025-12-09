import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Container, Navbar, Nav, Button, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./i18n/config";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ReportForm from "./components/ReportForm";
import PoliceDashboard from "./components/PoliceDashboard";
import "./App.css";

function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Rwanda Crime Report</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user ? (
                <>
                  <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                  {user.role === "citizen" && (
                    <Nav.Link href="/report">Report Crime</Nav.Link>
                  )}
                  {(user.role === "officer" || user.role === "admin") && (
                    <Nav.Link href="/police-dashboard">
                      Police Dashboard
                    </Nav.Link>
                  )}
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-light"
                      id="dropdown-basic"
                    >
                      {user.name} ({user.role})
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="/dashboard">
                        My Reports
                      </Dropdown.Item>
                      <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
            <div className="d-flex">
              <Button
                size="sm"
                variant={i18n.language === "en" ? "primary" : "outline-light"}
                onClick={() => changeLanguage("en")}
                className="me-1"
              >
                EN
              </Button>
              <Button
                size="sm"
                variant={i18n.language === "fr" ? "primary" : "outline-light"}
                onClick={() => changeLanguage("fr")}
                className="me-1"
              >
                FR
              </Button>
              <Button
                size="sm"
                variant={i18n.language === "rw" ? "primary" : "outline-light"}
                onClick={() => changeLanguage("rw")}
              >
                RW
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/report" element={<ReportForm user={user} />} />
          <Route
            path="/police-dashboard"
            element={<PoliceDashboard user={user} />}
          />
          <Route
            path="/profile"
            element={
              <div className="text-center mt-5">
                <h3>Profile Page</h3>
                <p>Coming soon...</p>
              </div>
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
