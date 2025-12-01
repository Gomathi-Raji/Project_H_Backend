import React, { createContext, useContext, useState, useEffect } from 'react';
import apiFetch, { loadToken } from '@/lib/apiClient';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  // Load theme from user settings
  useEffect(() => {
    const loadUserTheme = async () => {
      try {
        // Check if user is authenticated by checking stored token
        const token = loadToken();
        if (token) {
          const userData = await apiFetch('/auth/profile');
          if (userData.settings?.theme) {
            setTheme(userData.settings.theme);
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        // Fall back to light theme
        setTheme('light');
      } finally {
        setLoading(false);
      }
    };

    loadUserTheme();
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Store theme in localStorage as backup
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save theme to backend
  const updateTheme = async (newTheme) => {
    try {
      setTheme(newTheme);
      await apiFetch('/auth/settings', {
        method: 'PUT',
        body: { theme: newTheme }
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      // Revert on error
      setTheme(theme);
    }
  };

  const value = {
    theme,
    setTheme: updateTheme,
    loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};