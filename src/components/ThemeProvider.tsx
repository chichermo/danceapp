import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import customTheme, { darkTheme, danceColors, gradients } from '../theme/customTheme';

interface ThemeContextType {
  theme: 'light' | 'dark';
  danceStyle: keyof typeof danceColors;
  toggleTheme: () => void;
  setDanceStyle: (style: keyof typeof danceColors) => void;
  customGradient: string;
  setCustomGradient: (gradient: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [danceStyle, setDanceStyle] = useState<keyof typeof danceColors>('contemporary');
  const [customGradient, setCustomGradient] = useState(gradients.dance);

  // Cargar preferencias del tema desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const savedDanceStyle = localStorage.getItem('danceStyle') as keyof typeof danceColors | null;
    const savedGradient = localStorage.getItem('customGradient');

    if (savedTheme) setTheme(savedTheme);
    if (savedDanceStyle) setDanceStyle(savedDanceStyle);
    if (savedGradient) setCustomGradient(savedGradient);
  }, []);

  // Guardar preferencias en localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('danceStyle', danceStyle);
  }, [danceStyle]);

  useEffect(() => {
    localStorage.setItem('customGradient', customGradient);
  }, [customGradient]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSetDanceStyle = (style: keyof typeof danceColors) => {
    setDanceStyle(style);
    // Actualizar gradiente basado en el estilo de danza
    const styleGradients = {
      hiphop: gradients.secondary,
      contemporary: gradients.dance,
      ballet: gradients.ocean,
      jazz: gradients.forest,
      urban: gradients.warning,
      latin: gradients.sunset,
    };
    setCustomGradient(styleGradients[style] || gradients.dance);
  };

  const currentTheme = theme === 'dark' ? darkTheme : customTheme;

  const contextValue: ThemeContextType = {
    theme,
    danceStyle,
    toggleTheme,
    setDanceStyle: handleSetDanceStyle,
    customGradient,
    setCustomGradient,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
