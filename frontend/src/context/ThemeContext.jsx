import React, { createContext, useState, useEffect, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeModeContext = createContext(null);

export const ThemeModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('themeMode');
    if (saved) return saved === 'dark';
    // Fallback to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newVal = !prev;
      localStorage.setItem('themeMode', newVal ? 'dark' : 'light');
      return newVal;
    });
  };

  // Build the Material UI custom theme configuration
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#818cf8' : '#4f46e5', // Sleek Indigo
        light: darkMode ? '#a5b4fc' : '#818cf8',
        dark: darkMode ? '#4f46e5' : '#3730a3',
      },
      secondary: {
        main: darkMode ? '#22d3ee' : '#0891b2', // Electric Cyan
      },
      background: {
        default: darkMode ? '#0f172a' : '#f8fafc', // Dark slate vs clean slate
        paper: darkMode ? '#1e293b' : '#ffffff',   // Darker paper vs pure white
      },
      text: {
        primary: darkMode ? '#f8fafc' : '#0f172a',
        secondary: darkMode ? '#94a3b8' : '#475569',
      },
      divider: darkMode ? '#334155' : '#e2e8f0',
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800, fontFamily: 'Outfit' },
      h2: { fontWeight: 700, fontFamily: 'Outfit' },
      h3: { fontWeight: 700, fontFamily: 'Outfit' },
      h4: { fontWeight: 700, fontFamily: 'Outfit' },
      h5: { fontWeight: 600, fontFamily: 'Outfit' },
      h6: { fontWeight: 600, fontFamily: 'Outfit' },
      subtitle1: { fontWeight: 500 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
      borderRadius: 12, // Modern rounded aesthetic
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            padding: '8px 20px',
            borderRadius: 10,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
            },
          },
          containedPrimary: {
            background: darkMode
              ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
              : 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            color: '#ffffff',
            '&:hover': {
              background: darkMode
                ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
                : 'linear-gradient(135deg, #3730a3 0%, #1d4ed8 100%)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: darkMode
              ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
              : '0 10px 30px -10px rgba(148, 163, 184, 0.12)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: darkMode
                ? '0 15px 35px -5px rgba(0, 0, 0, 0.6)'
                : '0 15px 35px -5px rgba(148, 163, 184, 0.25)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(8px)',
            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            color: darkMode ? '#f8fafc' : '#0f172a',
            borderBottom: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? '#0f172a' : '#ffffff',
            borderRight: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
          },
        },
      },
    },
  });

  return (
    <ThemeModeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};
