import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a237e",
      light: "#534bae",
      dark: "#000051",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f9a825",
      light: "#ffd95a",
      dark: "#c17900",
      contrastText: "#000000",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },
    warning: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
    },
    info: {
      main: "#0288d1",
      light: "#03a9f4",
      dark: "#01579b",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
      disabled: "#94a3b8",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", sans-serif',
    h1: {
      fontSize: "3.5rem",
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.75rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: "1.125rem",
      fontWeight: 500,
      lineHeight: 1.6,
    },
    subtitle2: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.9375rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 960,
      lg: 1280,
      xl: 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
        html: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          scrollBehavior: "smooth",
        },
        body: {
          fontFamily: '"Inter", sans-serif',
          backgroundColor: "#f8fafc",
          color: "#1e293b",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "10px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f5f9",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#cbd5e1",
            borderRadius: "5px",
            "&:hover": {
              background: "#94a3b8",
            },
          },
        },
        a: {
          textDecoration: "none",
          color: "inherit",
          "&:hover": {
            color: "#1a237e",
          },
        },
        "input:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 100px #ffffff inset !important",
          WebkitTextFillColor: "#1e293b !important",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          padding: "10px 24px",
          textTransform: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        contained: {
          boxShadow: "0 4px 14px rgba(26, 35, 126, 0.25)",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(26, 35, 126, 0.35)",
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
            backgroundColor: "rgba(26, 35, 126, 0.04)",
          },
        },
        sizeLarge: {
          padding: "12px 32px",
          fontSize: "1rem",
        },
        sizeSmall: {
          padding: "6px 16px",
          fontSize: "0.875rem",
        },
      },
      variants: [
        {
          props: { variant: "gradient" },
          style: {
            background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
            color: "white",
            "&:hover": {
              background: "linear-gradient(135deg, #000051 0%, #1a237e 100%)",
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.04)",
          transition: "all 0.3s ease",
          overflow: "hidden",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        },
        elevation2: {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
        elevation3: {
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1a237e",
              borderWidth: "2px",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1a237e",
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#64748b",
            "&.Mui-focused": {
              color: "#1a237e",
              fontWeight: 600,
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            color: "#94a3b8",
            opacity: 1,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: "#f8fafc",
          color: "#475569",
          fontSize: "0.875rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        },
        body: {
          fontSize: "0.9375rem",
          color: "#334155",
          borderBottom: "1px solid #e2e8f0",
        },
        root: {
          padding: "16px 24px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(26, 35, 126, 0.02)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(26, 35, 126, 0.08)",
            "&:hover": {
              backgroundColor: "rgba(26, 35, 126, 0.12)",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
          "&.MuiChip-sizeSmall": {
            height: "24px",
            fontSize: "0.75rem",
          },
          "&.MuiChip-sizeMedium": {
            height: "28px",
            fontSize: "0.8125rem",
          },
        },
        filled: {
          "&.MuiChip-colorSuccess": {
            backgroundColor: "#10b981",
            color: "white",
          },
          "&.MuiChip-colorWarning": {
            backgroundColor: "#f59e0b",
            color: "white",
          },
          "&.MuiChip-colorError": {
            backgroundColor: "#ef4444",
            color: "white",
          },
          "&.MuiChip-colorInfo": {
            backgroundColor: "#3b82f6",
            color: "white",
          },
        },
        outlined: {
          borderWidth: "2px",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "16px 20px",
          "& .MuiAlert-icon": {
            fontSize: "1.5rem",
          },
        },
        standardSuccess: {
          backgroundColor: "#d1fae5",
          color: "#065f46",
        },
        standardError: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        },
        standardWarning: {
          backgroundColor: "#fef3c7",
          color: "#92400e",
        },
        standardInfo: {
          backgroundColor: "#dbeafe",
          color: "#1e40af",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid white",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 8,
          backgroundColor: "#e2e8f0",
        },
        bar: {
          borderRadius: 10,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          "&.MuiCircularProgress-colorPrimary": {
            color: "#1a237e",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          padding: "8px",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiSnackbarContent-root": {
            borderRadius: 12,
          },
        },
      },
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
});

export default theme;
