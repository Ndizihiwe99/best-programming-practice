import React from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  NavigateNext,
  HelpOutline,
  Download,
  Print,
  Share,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = true,
  actions = [],
  helpText,
  onHelpClick,
  showBackButton = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbItems = pathnames.map((value, index) => {
    const last = index === pathnames.length - 1;
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
    const formattedValue = value
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return last ? (
      <Typography key={to} color="text.primary" sx={{ fontWeight: 600 }}>
        {formattedValue}
      </Typography>
    ) : (
      <Link
        key={to}
        underline="hover"
        color="inherit"
        onClick={() => navigate(to)}
        sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
      >
        {formattedValue}
      </Link>
    );
  });

  const renderActionButtons = () => {
    const actionComponents = {
      download: (
        <Tooltip title="Download" key="download">
          <IconButton sx={{ border: 1, borderColor: "divider" }}>
            <Download />
          </IconButton>
        </Tooltip>
      ),
      print: (
        <Tooltip title="Print" key="print">
          <IconButton sx={{ border: 1, borderColor: "divider" }}>
            <Print />
          </IconButton>
        </Tooltip>
      ),
      share: (
        <Tooltip title="Share" key="share">
          <IconButton sx={{ border: 1, borderColor: "divider" }}>
            <Share />
          </IconButton>
        </Tooltip>
      ),
    };

    return actions.map((action) => {
      if (typeof action === "string") {
        return actionComponents[action] || null;
      }
      return action;
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/dashboard")}
            sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
          >
            Dashboard
          </Link>
          {breadcrumbItems}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            {showBackButton && (
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  "&:hover": { bgcolor: "grey.50" },
                }}
              >
                ←
              </IconButton>
            )}
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            {helpText && (
              <Tooltip title={helpText}>
                <IconButton
                  size="small"
                  onClick={onHelpClick}
                  sx={{ color: "text.secondary" }}
                >
                  <HelpOutline fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 800 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
            {renderActionButtons()}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
