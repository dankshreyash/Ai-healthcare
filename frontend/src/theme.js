/**
 * Material UI theme configuration.
 * Healthcare CRM – Professional blue/white palette with Inter font.
 */

import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      light: '#42A5F5',
      dark: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00897B',
      light: '#4DB6AC',
      dark: '#00695C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F0F4F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2332',
      secondary: '#546E7A',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#F57C00',
    },
    success: {
      main: '#2E7D32',
    },
    info: {
      main: '#0288D1',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },

  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#546E7A',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
    '0 2px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)',
    '0 4px 12px rgba(0,0,0,0.05), 0 2px 6px rgba(0,0,0,0.04)',
    '0 6px 16px rgba(0,0,0,0.06), 0 3px 8px rgba(0,0,0,0.04)',
    '0 8px 24px rgba(0,0,0,0.07), 0 4px 10px rgba(0,0,0,0.04)',
    '0 12px 32px rgba(0,0,0,0.08), 0 6px 14px rgba(0,0,0,0.04)',
    ...Array(18).fill('0 12px 32px rgba(0,0,0,0.08), 0 6px 14px rgba(0,0,0,0.04)'),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F0F4F8',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(21, 101, 192, 0.25)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(21, 101, 192, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#42A5F5',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: alpha('#1565C0', 0.1),
            '&:hover': {
              backgroundColor: alpha('#1565C0', 0.15),
            },
          },
        },
      },
    },
  },
});

export default theme;
