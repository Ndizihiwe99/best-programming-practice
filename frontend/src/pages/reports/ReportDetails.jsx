import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Note as NoteIcon,
} from "@mui/icons-material";
import { reportAPI } from "../../services/api";
import { REPORT_STATUS, CRIME_CATEGORIES } from "../../utils/constants";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getReport(id);
      setReport(response.data.data.report);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statusCode) => {
    switch (statusCode) {
      case "YATANZWE":
        return "warning";
      case "IRI_MU_BURYO":
        return "info";
      case "YEMEJWE":
        return "success";
      case "YARANGIYE":
        return "success";
      case "YAHINJIRIJWE":
        return "error";
      default:
        return "default";
    }
  };

  const getCategoryText = (categoryCode) => {
    const cat = CRIME_CATEGORIES.find((c) => c.code === categoryCode);
    return cat ? `${cat.rw} (${cat.en})` : categoryCode;
  };

  const getStatusText = (statusCode) => {
    const status = Object.values(REPORT_STATUS).find(
      (s) => s.code === statusCode
    );
    return status ? `${status.rw} (${status.en})` : statusCode;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("rw-RW", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !report) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || "Report not found"}
        </Alert>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate("/my-reports")}
          sx={{ mt: 2 }}
        >
          Subira ku Raporo
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate("/my-reports")}
          >
            Subira
          </Button>
          <Chip
            label={getStatusText(report.status.code)}
            color={getStatusColor(report.status.code)}
            size="large"
          />
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Report Details */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                {report.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                ID: {report.reportId}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Ibisobanuro
                </Typography>
                <Typography variant="body1" paragraph>
                  {report.description}
                </Typography>
              </Box>

              {/* Details Grid */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <SecurityIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">
                          Ubwoko bw'ikigeragezo
                        </Typography>
                      </Box>
                      <Typography variant="h6">
                        {getCategoryText(report.category)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <DateIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">
                          Igihe byabaye
                        </Typography>
                      </Box>
                      <Typography variant="h6">
                        {formatDate(report.incidentDate)}
                      </Typography>
                      {report.incidentTime && (
                        <Typography variant="body2" color="text.secondary">
                          Isaha: {report.incidentTime}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <LocationIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">Aho byabaye</Typography>
                      </Box>
                      <Typography variant="h6">
                        {report.address || `${report.village}, ${report.cell}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {report.sector}, {report.district}, {report.province}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            {/* Investigation Notes */}
            {report.investigationNotes &&
              report.investigationNotes.length > 0 && (
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Inyandiko zo gukurikirana
                  </Typography>
                  <List>
                    {report.investigationNotes.map((note, index) => (
                      <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar>
                              <NoteIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="body1">
                                {note.note}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {note.addedBy?.firstName}{" "}
                                  {note.addedBy?.lastName}
                                </Typography>
                                {" — "}
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {formatDate(note.addedAt)}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < report.investigationNotes.length - 1 && (
                          <Divider variant="inset" component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              )}
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Reporter Info */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Umwanditsi</Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                {report.reporter?.firstName} {report.reporter?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {report.reporterPhone}
              </Typography>
              <Chip
                label={report.isAnonymous ? "Ubuso" : "Iri Kugaragara"}
                size="small"
                sx={{ mt: 1 }}
              />
            </Paper>

            {/* Status Timeline */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Amategeko y'Imimerere
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Yatanzwe: {formatDate(report.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Imimerere yahinduwe: {formatDate(report.status.updatedAt)}
                </Typography>
                {report.resolution?.resolvedAt && (
                  <Typography variant="body2" color="text.secondary">
                    Yarakozwe: {formatDate(report.resolution.resolvedAt)}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ReportDetails;
