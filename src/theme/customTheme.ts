import { createTheme } from '@mui/material/styles';

// Enhanced color palette with modern gradients
const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  dance: {
    hiphop: '#ff6b9d',
    contemporary: '#4ecdc4',
    ballet: '#45b7d1',
    jazz: '#96ceb4',
    urban: '#feca57',
    latin: '#ff9ff3',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
};

// Create enhanced custom theme
const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[600],
      light: colors.secondary[400],
      dark: colors.secondary[800],
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#fca5a5',
      dark: '#dc2626',
    },
    warning: {
      main: colors.accent[500],
      light: colors.accent[300],
      dark: colors.accent[700],
    },
    info: {
      main: '#3b82f6',
      light: '#93c5fd',
      dark: '#1d4ed8',
    },
    success: {
      main: '#10b981',
      light: '#6ee7b7',
      dark: '#059669',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
    },
    divider: colors.neutral[200],
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      color: colors.neutral[900],
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: colors.neutral[900],
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
      color: colors.neutral[800],
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: colors.neutral[800],
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: colors.neutral[800],
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: colors.neutral[800],
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: colors.neutral[700],
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: colors.neutral[600],
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      color: colors.neutral[500],
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: colors.neutral[500],
    },
  },
  shape: {
    borderRadius: 16,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            transform: 'translateY(-1px)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.08)',
          },
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.8rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
        elevation3: {
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary[300],
              borderWidth: 2,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary[600],
              borderWidth: 2,
              boxShadow: `0 0 0 4px ${colors.primary[100]}`,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.neutral[500],
            '&.Mui-focused': {
              color: colors.primary[600],
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          fontSize: '0.8rem',
          height: 28,
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 56,
            fontSize: '0.95rem',
            color: colors.neutral[600],
            '&:hover': {
              color: colors.primary[600],
            },
          },
          '& .Mui-selected': {
            color: colors.primary[600],
          },
        },
        indicator: {
          height: 4,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 8,
          backgroundColor: colors.neutral[200],
        },
        bar: {
          borderRadius: 6,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          border: '2px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.08)',
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 0',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.04)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-track': {
            borderRadius: 12,
          },
          '& .MuiSwitch-thumb': {
            borderRadius: 10,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-thumb': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
            },
          },
          '& .MuiSlider-track': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: colors.neutral[50],
            fontWeight: 700,
            color: colors.neutral[700],
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.neutral[200]}`,
          padding: '16px',
        },
      },
    },
  },
});

// Tema oscuro
export const darkTheme = createTheme({
  ...customTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[400],
      light: colors.primary[300],
      dark: colors.primary[600],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[400],
      light: colors.secondary[300],
      dark: colors.secondary[600],
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  components: {
    ...customTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
  },
});

    // Specific colors for dance types
export const danceColors = {
  hiphop: {
    main: colors.dance.hiphop,
    light: '#ff8fb3',
    dark: '#e91e63',
  },
  contemporary: {
    main: colors.dance.contemporary,
    light: '#7dd3d0',
    dark: '#26a69a',
  },
  ballet: {
    main: colors.dance.ballet,
    light: '#6bc5d8',
    dark: '#1976d2',
  },
  jazz: {
    main: colors.dance.jazz,
    light: '#b8dcc6',
    dark: '#388e3c',
  },
  urban: {
    main: colors.dance.urban,
    light: '#fed976',
    dark: '#f57c00',
  },
  latin: {
    main: colors.dance.latin,
    light: '#ffb3f0',
    dark: '#c2185b',
  },
};

// Gradientes personalizados
export const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  warning: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  dance: 'linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 100%)',
  sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  forest: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
};

// Sombras personalizadas
export const shadows = {
  light: '0 2px 8px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 16px rgba(0, 0, 0, 0.15)',
  heavy: '0 8px 32px rgba(0, 0, 0, 0.2)',
  glow: '0 0 20px rgba(102, 126, 234, 0.3)',
  dance: '0 4px 20px rgba(255, 107, 157, 0.3)',
};

// Animaciones personalizadas
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideDown: {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  bounce: {
    '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
    '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
    '70%': { transform: 'translate3d(0, -4px, 0)' },
    '90%': { transform: 'translate3d(0, -2px, 0)' },
  },
};

export default customTheme;
