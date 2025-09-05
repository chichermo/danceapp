import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#EC4899',
      light: '#F472B6',
      dark: '#DB2777',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
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
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px rgba(0, 0, 0, 0.07), 0px 2px 4px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
    '0px 0px 0px rgba(0, 0, 0, 0)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 28px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0px)',
            transition: 'all 0.1s ease',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            boxShadow: '0px 12px 30px rgba(99, 102, 241, 0.4)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            transform: 'translateY(-2px)',
            background: 'rgba(99, 102, 241, 0.08)',
          },
        },
        text: {
          '&:hover': {
            background: 'rgba(99, 102, 241, 0.08)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.15)',
            background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.95) 100%)',
            '&::before': {
              opacity: 1,
            },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: 0,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.07), 0px 2px 4px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6366F1',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6366F1',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: '24px',
          '& .MuiChip-label': {
            padding: '0 12px',
          },
        },
        filled: {
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          },
        },
        outlined: {
          borderColor: '#6366F1',
          color: '#6366F1',
          '&:hover': {
            background: 'rgba(99, 102, 241, 0.08)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            height: '3px',
            borderRadius: '3px 3px 0 0',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: '48px',
          '&.Mui-selected': {
            color: '#6366F1',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#E2E8F0',
        },
        bar: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'scale(1.1)',
            background: 'rgba(99, 102, 241, 0.12)',
            boxShadow: '0px 8px 25px rgba(99, 102, 241, 0.3)',
          },
          '&:active': {
            transform: 'scale(0.95)',
            transition: 'all 0.1s ease',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.2)',
            transition: 'all 0.3s ease',
            transform: 'translate(-50%, -50%)',
          },
          '&:hover::before': {
            width: '100%',
            height: '100%',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: '4px',
          '&:hover': {
            background: 'rgba(99, 102, 241, 0.04)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid',
        },
        standardSuccess: {
          background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
          color: '#FFFFFF',
          borderColor: '#10B981',
        },
        standardError: {
          background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
          color: '#FFFFFF',
          borderColor: '#EF4444',
        },
        standardWarning: {
          background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
          color: '#FFFFFF',
          borderColor: '#F59E0B',
        },
        standardInfo: {
          background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
          color: '#FFFFFF',
          borderColor: '#3B82F6',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 44,
          height: 24,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              '& + .MuiSwitch-track': {
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                opacity: 1,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 20,
            height: 20,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
          '& .MuiSwitch-track': {
            borderRadius: 12,
            opacity: 0.3,
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-track': {
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          },
          '& .MuiSlider-thumb': {
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            boxShadow: '0px 2px 8px rgba(99, 102, 241, 0.3)',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.4)',
            },
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          border: '1px solid #E2E8F0',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '8px 0',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-expanded': {
            minHeight: '48px',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
          color: '#FFFFFF',
          fontWeight: 600,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '& .MuiGrid-item': {
            paddingTop: '16px',
            paddingBottom: '16px',
          },
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
      main: '#818CF8',
      light: '#A5B4FC',
      dark: '#6366F1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F472B6',
      light: '#F9A8D4',
      dark: '#EC4899',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
    },
  },
});

// Colores específicos para tipos de baile
export const danceColors = {
  hiphop: {
    main: '#FF6B9D',
    light: '#FF8FB3',
    dark: '#E91E63',
  },
  contemporary: {
    main: '#4ECDC4',
    light: '#7DD3D0',
    dark: '#26A69A',
  },
  ballet: {
    main: '#45B7D1',
    light: '#6BC5D8',
    dark: '#1976D2',
  },
  jazz: {
    main: '#96CEB4',
    light: '#B8DCC6',
    dark: '#388E3C',
  },
  urban: {
    main: '#FECA57',
    light: '#FED976',
    dark: '#F57C00',
  },
  latin: {
    main: '#FF9FF3',
    light: '#FFB3F0',
    dark: '#C2185B',
  },
};

// Gradientes personalizados
export const gradients = {
  primary: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  secondary: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
  success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  warning: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
  dance: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
  sunset: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
  ocean: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  forest: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
};

// Sombras personalizadas
export const shadows = {
  light: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  medium: '0px 4px 16px rgba(0, 0, 0, 0.15)',
  heavy: '0px 8px 32px rgba(0, 0, 0, 0.2)',
  glow: '0px 0px 20px rgba(99, 102, 241, 0.3)',
  dance: '0px 4px 20px rgba(255, 107, 157, 0.3)',
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
