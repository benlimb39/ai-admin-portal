import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import { ThemeMode, ThemeSettings } from '../types';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  themeSettings: ThemeSettings;
  setThemeMode: (mode: ThemeMode) => void;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getThemeColors = (mode: ThemeMode) => {
  switch (mode) {
    case 'dark':
      return {
        primary: '#6366f1',
        secondary: '#10b981',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f8fafc',
        textSecondary: '#94a3b8',
        border: '#334155',
        card: '#1e293b',
        cardHover: '#334155',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      };
    case 'darkGrey':
      return {
        primary: '#6366f1',
        secondary: '#10b981',
        background: '#1a1a1a',
        surface: '#2d2d2d',
        text: '#ffffff',
        textSecondary: '#b3b3b3',
        border: '#404040',
        card: '#2d2d2d',
        cardHover: '#404040',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      };
    default: // light
      return {
        primary: '#6366f1',
        secondary: '#10b981',
        background: '#f9fafb',
        surface: '#ffffff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        card: '#ffffff',
        cardHover: '#f3f4f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      };
  }
};

const createAppTheme = (mode: ThemeMode): Theme => {
  const colors = getThemeColors(mode);
  
  return createTheme({
    palette: {
      mode: mode === 'light' ? 'light' : 'dark',
      primary: {
        main: colors.primary,
        contrastText: '#ffffff',
      },
      secondary: {
        main: colors.secondary,
        contrastText: '#ffffff',
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.text,
        secondary: colors.textSecondary,
      },
      success: {
        main: colors.success,
      },
      warning: {
        main: colors.warning,
      },
      error: {
        main: colors.error,
      },
      info: {
        main: colors.info,
      },
      divider: colors.border,
      action: {
        hover: colors.cardHover,
        selected: colors.cardHover,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: colors.background,
            color: colors.text,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
            color: colors.text,
            '&:hover': {
              backgroundColor: colors.cardHover,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            color: colors.text,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            borderBottom: `1px solid ${colors.border}`,
            color: colors.text,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.surface,
            borderRight: `1px solid ${colors.border}`,
            color: colors.text,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            color: colors.text,
            '&:hover': {
              backgroundColor: colors.cardHover,
            },
            '&.Mui-selected': {
              backgroundColor: colors.primary,
              color: '#ffffff',
              '&:hover': {
                backgroundColor: colors.primary,
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: 'inherit',
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: 'inherit',
          },
          secondary: {
            color: colors.textSecondary,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: 'inherit',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 'bold',
            textTransform: 'capitalize',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              color: colors.text,
            },
            '& .MuiInputLabel-root': {
              color: colors.textSecondary,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: colors.border,
              },
              '&:hover fieldset': {
                borderColor: colors.primary,
              },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            color: colors.text,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: colors.text,
            '&:hover': {
              backgroundColor: colors.cardHover,
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: colors.primary,
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: colors.primary,
            },
          },
        },
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        color: 'inherit',
      },
      h6: {
        fontWeight: 600,
        color: 'inherit',
      },
      body1: {
        color: 'inherit',
      },
      body2: {
        color: 'inherit',
      },
    },
  });
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode');
    return (saved as ThemeMode) || 'light';
  });

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('themeSettings');
    return saved ? JSON.parse(saved) : {
      mode: themeMode,
      primaryColor: '#6366f1',
      accentColor: '#10b981',
    };
  });

  const theme = createAppTheme(themeMode);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    setThemeSettings((prev: ThemeSettings) => ({ ...prev, mode }));
    localStorage.setItem('themeMode', mode);
  };

  const updateThemeSettings = (settings: Partial<ThemeSettings>) => {
    const newSettings = { ...themeSettings, ...settings };
    setThemeSettings(newSettings);
    localStorage.setItem('themeSettings', JSON.stringify(newSettings));
  };

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
  }, [themeSettings]);

  return (
    <ThemeContext.Provider value={{
      theme,
      themeMode,
      themeSettings,
      setThemeMode,
      updateThemeSettings,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
