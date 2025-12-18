import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  MoreVert,
  InfoOutlined,
} from "@mui/icons-material";

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  trend = 0,
  trendLabel = "vs last month",
  progress,
  progressLabel,
  onClick,
  infoTooltip,
  actionMenu,
}) => {
  const isPositive = trend > 0;
  const trendColor = isPositive ? "success.main" : "error.main";

  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "visible",
        "&:hover": {
          "& .stats-card-actions": {
            opacity: 1,
          },
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ fontWeight: 600, mb: 0.5 }}
            >
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {value}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {infoTooltip && (
              <Tooltip title={infoTooltip}>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {actionMenu && (
              <Box
                className="stats-card-actions"
                sx={{ opacity: 0, transition: "opacity 0.2s" }}
              >
                <IconButton size="small">
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>

        {/* Icon */}
        {icon && (
          <Box
            sx={{
              position: "absolute",
              top: -20,
              right: 20,
              width: 60,
              height: 60,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              boxShadow: 2,
            }}
          >
            {icon}
          </Box>
        )}

        {/* Subtitle */}
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}

        {/* Trend */}
        {trend !== 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            {isPositive ? (
              <TrendingUp sx={{ fontSize: 16, color: trendColor }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: trendColor }} />
            )}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: trendColor,
              }}
            >
              {isPositive ? "+" : ""}
              {trend}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {trendLabel}
            </Typography>
          </Box>
        )}

        {/* Progress Bar */}
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  bgcolor: `${color}.main`,
                },
              }}
            />
            {progressLabel && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                {progressLabel}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
