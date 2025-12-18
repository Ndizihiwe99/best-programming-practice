import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Sector,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Equalizer,
  Timeline,
  PieChart as PieChartIcon,
} from "@mui/icons-material";
import { CRIME_CATEGORIES, REPORT_STATUS } from "../../utils/constants";

const COLORS = [
  "#1a237e",
  "#283593",
  "#3949ab",
  "#5c6bc0",
  "#7986cb",
  "#9fa8da",
  "#c5cae9",
  "#e8eaf6",
  "#f9a825",
  "#ffb300",
  "#ffca28",
  "#ffd95a",
];

const CrimeDistributionChart = ({
  data = [],
  loading = false,
  title = "Crime Distribution",
  height = 400,
  showControls = true,
  showTrend = true,
  timeRange = "month",
  onTimeRangeChange,
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState("pie");
  const [activeIndex, setActiveIndex] = useState(0);

  // Process data for charts - FIXED: No Math.random() in render, no useEffect cascade
  const processedData = useMemo(() => {
    // If no real data provided, generate deterministic mock data
    if (!data || data.length === 0) {
      return CRIME_CATEGORIES.map((category, index) => {
        // Deterministic "random" values based on index
        const seed = 12345; // Fixed seed for consistency
        const pseudoRandom = (Math.sin(seed + index * 100) * 10000) % 1;
        const pseudoRandom2 = (Math.sin(seed + index * 200 + 1000) * 10000) % 1;

        return {
          name: category.en,
          value: Math.floor(pseudoRandom * 100) + 20,
          category: category.code,
          color: COLORS[index % COLORS.length],
          trend: pseudoRandom > 0.5 ? "up" : "down",
          trendValue: Math.floor(pseudoRandom2 * 30) + 5,
        };
      });
    }

    return data;
  }, [data]);

  // Calculate totals
  const totalCrimes = useMemo(() => {
    return processedData.reduce((sum, item) => sum + item.value, 0);
  }, [processedData]);

  // Get top categories
  const topCategories = useMemo(() => {
    return [...processedData].sort((a, b) => b.value - a.value).slice(0, 5);
  }, [processedData]);

  // Handle chart type change
  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // Handle pie sector hover
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Custom active shape for pie chart
  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    const sin = Math.sin((-midAngle * Math.PI) / 180);
    const cos = Math.cos((-midAngle * Math.PI) / 180);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 16}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill={theme.palette.text.primary}
          fontSize={12}
          fontWeight={500}
        >
          {payload.name}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey + 16}
          textAnchor={textAnchor}
          fill={theme.palette.text.secondary}
          fontSize={11}
        >
          {`${value} cases (${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  // Render chart based on type
  const renderChart = () => {
    if (loading) {
      return (
        <Box
          sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={processedData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="name"
                stroke={theme.palette.text.secondary}
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                  borderRadius: theme.shape.borderRadius,
                  fontSize: 12,
                }}
                formatter={(value) => [`${value} cases`, "Count"]}
              />
              <Legend />
              <Bar dataKey="value" name="Number of Cases" radius={[4, 4, 0, 0]}>
                {processedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={processedData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="name"
                stroke={theme.palette.text.secondary}
                fontSize={12}
              />
              <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                  borderRadius: theme.shape.borderRadius,
                  fontSize: 12,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Number of Cases"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={processedData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {processedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} cases (${((value / totalCrimes) * 100).toFixed(
                    1
                  )}%)`,
                  props.payload.name,
                ]}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                  borderRadius: theme.shape.borderRadius,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalCrimes} total cases analyzed
            </Typography>
          </Box>

          {showControls && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {showTrend && onTimeRangeChange && (
                <ToggleButtonGroup
                  value={timeRange}
                  exclusive
                  onChange={(e, value) => onTimeRangeChange(value)}
                  size="small"
                >
                  <ToggleButton value="week">Week</ToggleButton>
                  <ToggleButton value="month">Month</ToggleButton>
                  <ToggleButton value="year">Year</ToggleButton>
                </ToggleButtonGroup>
              )}

              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartTypeChange}
                size="small"
              >
                <ToggleButton value="pie">
                  <PieChartIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="bar">
                  <Equalizer fontSize="small" />
                </ToggleButton>
                <ToggleButton value="line">
                  <Timeline fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
        </Box>

        {/* Chart */}
        {renderChart()}

        {/* Legend and Stats */}
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            TOP CATEGORIES
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {topCategories.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: "grey.50",
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: item.color || COLORS[index % COLORS.length],
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {((item.value / totalCrimes) * 100).toFixed(1)}% of total
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.value}
                  </Typography>
                  {showTrend && item.trend && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {item.trend === "up" ? (
                        <TrendingUp
                          sx={{ fontSize: 16, color: "success.main" }}
                        />
                      ) : (
                        <TrendingDown
                          sx={{ fontSize: 16, color: "error.main" }}
                        />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            item.trend === "up" ? "success.main" : "error.main",
                          fontWeight: 500,
                        }}
                      >
                        {item.trendValue}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Summary Stats */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: "primary.light",
              borderRadius: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "primary.contrastText", opacity: 0.9 }}
              >
                INSIGHTS
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "primary.contrastText", fontWeight: 500 }}
              >
                {topCategories[0]?.name || "Theft"} is the most common crime
                type
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{ color: "primary.contrastText", fontWeight: 700 }}
            >
              {topCategories[0]?.value || 0} cases
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CrimeDistributionChart;
