const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Mock endpoints for testing
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    res.json({
      success: true,
      token: "mock-jwt-token-123",
      user: {
        id: "123",
        name: "Test User",
        email: email,
        role: "citizen",
        sector: "Kicukiro",
        language: "en",
      },
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Invalid credentials",
    });
  }
});

app.post("/api/auth/register", (req, res) => {
  res.json({
    success: true,
    token: "mock-jwt-token-456",
    user: {
      id: "456",
      name: req.body.name,
      email: req.body.email,
      role: req.body.role || "citizen",
      sector: req.body.sector,
      language: "en",
    },
  });
});

app.get("/api/reports", (req, res) => {
  const mockReports = [
    {
      _id: "1",
      reportId: "CR123456",
      title: "Test Report",
      description: "This is a test report",
      category: "theft",
      status: "submitted",
      createdAt: new Date(),
      citizen: { name: "Test User", phone: "+250788123456" },
      location: { sector: "Kicukiro", address: "Test Address" },
    },
  ];

  res.json({
    success: true,
    data: mockReports,
    pagination: {
      page: 1,
      limit: 10,
    },
  });
});
