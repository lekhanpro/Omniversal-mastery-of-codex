import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = 'codex_theme';

const detectInitialTheme = (): 'light' | 'dark' => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // no-op
  }
  return 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => detectInitialTheme());
  const isDark = theme === 'dark';

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark, theme]);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      isDark,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      setTheme,
    }),
    [isDark, theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
