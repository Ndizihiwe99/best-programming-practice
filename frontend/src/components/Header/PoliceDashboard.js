import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Alert,
  Modal,
  Form,
  Dropdown,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PoliceDashboard = ({ user }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalReports: 0,
    resolvedReports: 0,
    pendingReports: 0,
    investigatingReports: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [assignedOfficer, setAssignedOfficer] = useState("");
  const [availableOfficers, setAvailableOfficers] = useState([]);
  const [crimeHotspots, setCrimeHotspots] = useState([]);

  useEffect(() => {
    if (user?.role === "officer" || user?.role === "admin") {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch dashboard data
      const [statsRes, reportsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/reports/stats", {
          headers: { Authorization: `Bearer \${token}` },
        }),
        axios.get(
          "http://localhost:5000/api/reports?limit=10&status=submitted",
          {
            headers: { Authorization: `Bearer \${token}` },
          }
        ),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data.overall || { total: 0, byStatus: [] });
      }

      if (reportsRes.data.success) {
        setRecentReports(reportsRes.data.data);
      }

      // Mock data for demo
      const mockHotspots = [
        { location: "Kigali Market", count: 15, type: "theft" },
        { location: "Kimironko", count: 12, type: "vandalism" },
        { location: "Downtown", count: 8, type: "assault" },
        { location: "Remera", count: 6, type: "fraud" },
      ];
      setCrimeHotspots(mockHotspots);

      const mockOfficers = [
        { id: "1", name: "Officer John", badge: "RNP123" },
        { id: "2", name: "Officer Alice", badge: "RNP124" },
        { id: "3", name: "Officer Bob", badge: "RNP125" },
      ];
      setAvailableOfficers(mockOfficers);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      // Use mock data for demo
      setStats({
        total: 42,
        byStatus: [
          { status: "submitted", count: 12 },
          { status: "under_review", count: 8 },
          { status: "investigating", count: 15 },
          { status: "resolved", count: 7 },
        ],
      });

      const mockReports = [
        {
          _id: "1",
          reportId: "CR123459",
          title: "Phone Theft",
          status: "submitted",
          createdAt: "2024-01-16",
          category: "theft",
        },
        {
          _id: "2",
          reportId: "CR123460",
          title: "Car Break-in",
          status: "submitted",
          createdAt: "2024-01-16",
          category: "vandalism",
        },
        {
          _id: "3",
          reportId: "CR123461",
          title: "Assault Report",
          status: "submitted",
          createdAt: "2024-01-15",
          category: "assault",
        },
      ];
      setRecentReports(mockReports);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      submitted: "secondary",
      under_review: "info",
      assigned: "warning",
      investigating: "primary",
      resolved: "success",
      closed: "dark",
    };
    return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
  };

  const handleAssignReport = (report) => {
    setSelectedReport(report);
    setShowAssignModal(true);
  };

  const confirmAssignment = async () => {
    if (!selectedReport || !assignedOfficer) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/reports/\${selectedReport._id}/status`,
        { status: "assigned" },
        {
          headers: { Authorization: `Bearer \${token}` },
        }
      );

      // Update local state
      setRecentReports(
        recentReports.filter((report) => report._id !== selectedReport._id)
      );
      setShowAssignModal(false);
      setSelectedReport(null);
      setAssignedOfficer("");

      // Refresh stats
      fetchDashboardData();

      alert(`Report \${selectedReport.reportId} assigned successfully!`);
    } catch (err) {
      console.error("Assignment failed:", err);
      alert("Assignment failed. Please try again.");
    }
  };

  // Chart data for crime statistics
  const crimeChartData = {
    labels: ["Theft", "Vandalism", "Assault", "Fraud", "Suspicious", "Other"],
    datasets: [
      {
        label: "Crime Reports by Category",
        data: [15, 10, 8, 6, 12, 5],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const statusChartData = {
    labels: [
      "Submitted",
      "Under Review",
      "Investigating",
      "Resolved",
      "Closed",
    ],
    datasets: [
      {
        label: "Reports by Status",
        data: [12, 8, 15, 7, 3],
        backgroundColor: [
          "rgba(108, 117, 125, 0.6)",
          "rgba(13, 202, 240, 0.6)",
          "rgba(13, 110, 253, 0.6)",
          "rgba(25, 135, 84, 0.6)",
          "rgba(33, 37, 41, 0.6)",
        ],
      },
    ],
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading Police Dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Police Officer Dashboard</h2>
          <p className="text-muted">
            Welcome, {user?.name} (
            {user?.policeStation || "Rwanda National Police"})
          </p>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary">
            <Card.Body>
              <Card.Title className="text-primary">
                {stats.total || 0}
              </Card.Title>
              <Card.Text>Total Reports</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <Card.Title className="text-warning">
                {stats.byStatus?.find((s) => s.status === "submitted")?.count ||
                  0}
              </Card.Title>
              <Card.Text>Pending Review</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info">
            <Card.Body>
              <Card.Title className="text-info">
                {stats.byStatus?.find((s) => s.status === "investigating")
                  ?.count || 0}
              </Card.Title>
              <Card.Text>Under Investigation</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
            <Card.Body>
              <Card.Title className="text-success">
                {stats.byStatus?.find(
                  (s) => s.status === "resolved" || s.status === "closed"
                )?.count || 0}
              </Card.Title>
              <Card.Text>Resolved Cases</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Crime Distribution by Category</h5>
            </Card.Header>
            <Card.Body style={{ height: "300px" }}>
              <Bar
                data={crimeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Report Status Distribution</h5>
            </Card.Header>
            <Card.Body style={{ height: "300px" }}>
              <Pie
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reports and Hotspots Row */}
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Recent Reports Needing Attention</h5>
              <Badge bg="danger">{recentReports.length} Pending</Badge>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No pending reports
                      </td>
                    </tr>
                  ) : (
                    recentReports.map((report) => (
                      <tr key={report._id}>
                        <td>{report.reportId}</td>
                        <td>{report.title}</td>
                        <td>
                          <Badge bg="info">{report.category}</Badge>
                        </td>
                        <td>{getStatusBadge(report.status)}</td>
                        <td>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="primary"
                            className="me-1"
                            onClick={() =>
                              alert(`View details for \${report.reportId}`)
                            }
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleAssignReport(report)}
                          >
                            Assign
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Crime Hotspots</h5>
            </Card.Header>
            <Card.Body>
              <div className="hotspot-list">
                {crimeHotspots.map((hotspot, index) => (
                  <div key={index} className="mb-3 p-2 border rounded">
                    <div className="d-flex justify-content-between">
                      <strong>{hotspot.location}</strong>
                      <Badge bg="danger">{hotspot.count} reports</Badge>
                    </div>
                    <small className="text-muted">Type: {hotspot.type}</small>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="w-100"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="primary">Generate Weekly Report</Button>
                <Button variant="success">View All Assigned Cases</Button>
                <Button variant="info">Update Patrol Routes</Button>
                <Button variant="warning">Send Bulk SMS Alerts</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Assign Report Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Report to Officer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <>
              <p>
                <strong>Report ID:</strong> {selectedReport.reportId}
              </p>
              <p>
                <strong>Title:</strong> {selectedReport.title}
              </p>
              <p>
                <strong>Category:</strong> {selectedReport.category}
              </p>

              <Form.Group className="mt-3">
                <Form.Label>Select Officer</Form.Label>
                <Form.Select
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                >
                  <option value="">Choose an officer...</option>
                  {availableOfficers.map((officer) => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name} ({officer.badge})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Priority Level</Form.Label>
                <Form.Select>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Notes (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add investigation notes..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmAssignment}
            disabled={!assignedOfficer}
          >
            Assign Report
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PoliceDashboard;
