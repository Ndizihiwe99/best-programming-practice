import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ReportForm.css";

const ReportForm = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "theft",
    location: {
      address: "",
      sector: "",
      coordinates: { lat: -1.9706, lng: 30.1044 }, // Kigali coordinates
    },
    incidentDate: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=\${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        setMapLoaded(true);
        initAutocomplete();
      };
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
      initAutocomplete();
    }

    return () => {
      // Cleanup
    };
  }, []);

  const initAutocomplete = () => {
    if (window.google && window.google.maps) {
      const input = document.getElementById("location-input");
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          componentRestrictions: { country: "rw" },
          fields: ["formatted_address", "geometry", "name"],
          types: ["establishment", "geocode"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            console.log("No details available for input: " + place.name);
            return;
          }

          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              address: place.formatted_address,
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
            },
          }));
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleLocationSelect = (place) => {
    if (place && place.geometry) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          address: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.location.address
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const reportData = {
        ...formData,
        incidentDate: new Date(formData.incidentDate),
      };

      // In production, you would use the actual API endpoint
      // For now, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(
        "Report submitted successfully! An SMS will be sent with your report ID."
      );
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <Card style={{ width: "100%", maxWidth: "900px" }}>
        <Card.Header className="text-center bg-primary text-white">
          <h3>{t("reportCrime")}</h3>
          <p className="mb-0">Help keep Rwanda safe by reporting crimes</p>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Report Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Brief description (e.g., Stolen phone at market)"
                    maxLength={100}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="theft">Theft</option>
                    <option value="vandalism">Vandalism</option>
                    <option value="assault">Assault</option>
                    <option value="fraud">Fraud</option>
                    <option value="suspicious">Suspicious Activity</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Provide detailed information about what happened, time, people involved, etc..."
                maxLength={1000}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location Search *</Form.Label>
                  <Form.Control
                    type="text"
                    id="location-input"
                    placeholder="Type an address or place in Rwanda"
                    defaultValue={formData.location.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, address: e.target.value },
                      }))
                    }
                  />
                  <Form.Text className="text-muted">
                    Start typing to see suggestions from Google Maps
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sector *</Form.Label>
                  <Form.Select
                    name="location.sector"
                    value={formData.location.sector}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Sector</option>
                    <option value="Kicukiro">Kicukiro - Kigali</option>
                    <option value="Nyarugenge">Nyarugenge - Kigali</option>
                    <option value="Gasabo">Gasabo - Kigali</option>
                    <option value="Kirehe">Kirehe - Eastern Province</option>
                    <option value="Nyagatare">
                      Nyagatare - Eastern Province
                    </option>
                    <option value="Musanze">Musanze - Northern Province</option>
                    <option value="Huye">Huye - Southern Province</option>
                    <option value="Rubavu">Rubavu - Western Province</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Incident Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="incidentDate"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split("T")[0]}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority || "medium"}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {mapLoaded && (
              <Form.Group className="mb-3">
                <Form.Label>Selected Location Preview</Form.Label>
                <div
                  className="map-preview"
                  style={{
                    height: "200px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    overflow: "hidden",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {formData.location.address ? (
                    <div className="text-center">
                      <p>
                        <strong>{formData.location.address}</strong>
                      </p>
                      <p>
                        Coordinates:{" "}
                        {formData.location.coordinates.lat.toFixed(6)},{" "}
                        {formData.location.coordinates.lng.toFixed(6)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted">
                      Enter an address to see location details
                    </p>
                  )}
                </div>
              </Form.Group>
            )}

            <div className="d-grid gap-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
              >
                {loading ? "Submitting Report..." : "Submit Crime Report"}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
            </div>

            <Alert variant="info" className="mt-3">
              <strong>Important:</strong> For emergencies, call 112 (Rwanda
              National Police emergency line) immediately. This platform is for
              non-emergency crime reporting.
            </Alert>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportForm;
