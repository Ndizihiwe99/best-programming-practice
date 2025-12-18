import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  //   alpha,
  InputBase,
  Button,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Description,
  AddCircle,
  Analytics,
  People,
  LocationCity,
  Person,
  Settings,
  Notifications,
  Logout,
  Search,
  Home,
  Security,
  TrendingUp,
  Assignment,
  ChevronRight,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 300;

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
      roles: ["citizen", "police_officer", "admin"],
    },
    {
      text: "All Reports",
      icon: <Description />,
      path: "/reports",
      roles: ["police_officer", "admin"],
    },
    {
      text: "My Reports",
      icon: <Assignment />,
      path: "/reports/my",
      roles: ["citizen", "police_officer", "admin"],
    },
    {
      text: "New Report",
      icon: <AddCircle />,
      path: "/reports/new",
      roles: ["citizen"],
      badge: "New",
    },
    {
      text: "Statistics",
      icon: <Analytics />,
      path: "/reports/statistics",
      roles: ["police_officer", "admin"],
    },
    {
      text: "Police Stations",
      icon: <LocationCity />,
      path: "/admin/stations",
      roles: ["admin", "police_admin"],
    },
    {
      text: "Police Officers",
      icon: <People />,
      path: "/admin/officers",
      roles: ["admin", "police_admin"],
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/reports?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "citizen")
  );

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: "white",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Security sx={{ fontSize: 28, color: "primary.main" }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Rwanda Security
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Citizen Crime Reporting
            </Typography>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: "rgba(255,255,255,0.1)",
            borderRadius: 2,
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="caption"
            sx={{ opacity: 0.8, mb: 1, display: "block" }}
          >
            TODAY'S ACTIVITY
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                12
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                New Reports
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "success.light" }}
              >
                8
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Resolved
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "warning.light" }}
              >
                3
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                In Progress
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <form onSubmit={handleSearch}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "grey.50",
              borderRadius: 2,
              px: 2,
              py: 1,
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            <Search sx={{ color: "text.secondary", mr: 1 }} />
            <InputBase
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, fontSize: "0.875rem" }}
            />
          </Box>
        </form>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            mb: 2,
            display: "block",
            px: 2,
          }}
        >
          Navigation
        </Typography>
        <List sx={{ p: 0 }}>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                  "&:hover": {
                    bgcolor: "grey.50",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color:
                      location.pathname === item.path
                        ? "white"
                        : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      ml: 1,
                      bgcolor: "secondary.main",
                      color: "white",
                      fontSize: "0.625rem",
                      height: "20px",
                    }}
                  />
                )}
                {location.pathname === item.path && (
                  <ChevronRight sx={{ fontSize: 20, opacity: 0.7 }} />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Quick Actions */}
        <Box sx={{ mt: 4, px: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              mb: 2,
              display: "block",
            }}
          >
            Quick Actions
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => navigate("/reports/new")}
            sx={{
              borderRadius: 2,
              py: 1.5,
              mb: 1,
              boxShadow: "0 4px 14px rgba(26, 35, 126, 0.25)",
            }}
          >
            Report Crime
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<TrendingUp />}
            onClick={() => navigate("/reports/statistics")}
            sx={{
              borderRadius: 2,
              py: 1.5,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            View Statistics
          </Button>
        </Box>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <ListItemButton
          onClick={handleMenuOpen}
          sx={{
            borderRadius: 2,
            "&:hover": {
              bgcolor: "grey.50",
            },
          }}
        >
          <Avatar
            sx={{
              mr: 2,
              bgcolor: "primary.main",
              width: 40,
              height: 40,
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {user?.firstName?.[0] || "U"}
          </Avatar>
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.firstName
                ? `${user.firstName} ${user.lastName}`
                : "User Account"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.role?.replace("_", " ") || "Citizen"}
            </Typography>
          </Box>
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
            {filteredMenuItems.find((item) => item.path === location.pathname)
              ?.text || "Dashboard"}
          </Typography>

          {/* Theme Toggle
          <IconButton sx={{ mr: 2 }}>
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton> */}

          {/* Notifications */}
          <IconButton sx={{ mr: 2, position: "relative" }}>
            <Badge
              badgeContent={3}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.625rem",
                  height: "16px",
                  minWidth: "16px",
                },
              }}
            >
              <Notifications />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{
          width: { lg: drawerWidth },
          flexShrink: { lg: 0 },
        }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", lg: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid",
              borderColor: "divider",
              boxShadow: "4px 0 20px rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: "64px", lg: 0 },
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Toolbar /> {/* Spacing for AppBar */}
        <Outlet />
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.5,
              "&:hover": {
                bgcolor: "grey.50",
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => navigate("/profile")}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MainLayout;
