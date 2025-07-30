import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TimeTheme = 'day' | 'afternoon' | 'evening' | 'night';

interface TimeThemeContextType {
  theme: TimeTheme;
  isManualMode: boolean;
  isDarkModeOverride: boolean;
  effectiveTheme: TimeTheme;
  backgroundTheme: TimeTheme;
  toggleManualMode: () => void;
  setManualTheme: (theme: TimeTheme) => void;
  toggleDarkMode: () => void;
  isAutoMode: boolean;
  getTextClass: () => string;
  shouldShowComets: () => boolean;
  shouldShowGlow: () => boolean;
  isDayOrAfternoon: () => boolean;
}

const TimeThemeContext = createContext<TimeThemeContextType | undefined>(undefined);

interface TimeThemeProviderProps {
  children: ReactNode;
}

export const TimeThemeProvider: React.FC<TimeThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<TimeTheme>('day');
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualTheme, setManualTheme] = useState<TimeTheme>('night');
  const [isDarkModeOverride, setIsDarkModeOverride] = useState(false);

  const getTimeBasedTheme = (): TimeTheme => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return 'day';        // 6 AM - 12 PM
    if (hour >= 12 && hour < 18) return 'afternoon'; // 12 PM - 6 PM
    if (hour >= 18 && hour < 22) return 'evening';   // 6 PM - 10 PM
    return 'night';                                   // 10 PM - 6 AM
  };

  const getBackgroundTheme = (): TimeTheme => {
    if (isDarkModeOverride) {
      return 'night'; // Force night background when dark mode is active
    }
    return getTimeBasedTheme(); // Use time-based background otherwise
  };

  const getEffectiveTheme = (): TimeTheme => {
    if (isDarkModeOverride) {
      return 'night'; // Force night theme for styling when dark mode is active
    }
    return getTimeBasedTheme(); // Use actual time-based theme when in auto mode
  };

  const effectiveTheme = getEffectiveTheme();
  const backgroundTheme = getBackgroundTheme();

  useEffect(() => {
    // Load preferences from localStorage
    const savedMode = localStorage.getItem('portfolio-manual-mode');
    const savedTheme = localStorage.getItem('portfolio-manual-theme') as TimeTheme;
    const savedDarkMode = localStorage.getItem('portfolio-dark-mode-override');
    
    if (savedDarkMode === 'true') {
      setIsDarkModeOverride(true);
    }
    
    if (savedMode === 'true' && savedTheme) {
      setIsManualMode(true);
      setManualTheme(savedTheme);
      setTheme(savedTheme);
    } else {
      const autoTheme = getTimeBasedTheme();
      setTheme(autoTheme);
    }
  }, []);

  useEffect(() => {
    if (!isManualMode) {
      const updateTheme = () => {
        setTheme(getTimeBasedTheme());
      };

      updateTheme();
      const interval = setInterval(updateTheme, 60000);
      return () => clearInterval(interval);
    }
  }, [isManualMode]);

  const toggleManualMode = () => {
    const newManualMode = !isManualMode;
    setIsManualMode(newManualMode);
    
    if (newManualMode) {
      setTheme(manualTheme);
      localStorage.setItem('portfolio-manual-mode', 'true');
      localStorage.setItem('portfolio-manual-theme', manualTheme);
    } else {
      setTheme(getTimeBasedTheme());
      localStorage.setItem('portfolio-manual-mode', 'false');
    }
  };

  const handleSetManualTheme = (newTheme: TimeTheme) => {
    setManualTheme(newTheme);
    if (isManualMode) {
      setTheme(newTheme);
      localStorage.setItem('portfolio-manual-theme', newTheme);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkModeOverride;
    setIsDarkModeOverride(newDarkMode);
    localStorage.setItem('portfolio-dark-mode-override', newDarkMode.toString());
    
    if (!newDarkMode) {
      const currentTimeTheme = getTimeBasedTheme();
      setTheme(currentTimeTheme);
    }
  };

  // Simple text class logic
  const getTextClass = (): string => {
    if (isDarkModeOverride) {
      return 'text-dark-mode'; // Dark mode override - white text with glow
    }
    
    const hour = new Date().getHours();
    const isLateNight = (hour >= 22 && hour <= 23) || (hour >= 0 && hour <= 4);
    
    if (isLateNight) {
      return 'text-dark-mode'; // Late night gets same styling as dark mode
    }
    
    const currentTheme = getTimeBasedTheme();
    if (currentTheme === 'day' || currentTheme === 'afternoon') {
      return 'text-light-mode'; // Day and afternoon - black text
    }
    
    return 'text-regular'; // Evening and regular night - white text
  };

  // Check if comets should be shown
  const shouldShowComets = (): boolean => {
    if (isDarkModeOverride) return true;
    
    const hour = new Date().getHours();
    return (hour >= 22 && hour <= 23) || (hour >= 0 && hour <= 4);
  };

  // Check if glow effects should be shown
  const shouldShowGlow = (): boolean => {
    if (isDarkModeOverride) return true;
    
    const hour = new Date().getHours();
    return (hour >= 22 && hour <= 23) || (hour >= 0 && hour <= 4);
  };

  // Check if it's day or afternoon for special text handling
  const isDayOrAfternoon = (): boolean => {
    if (isDarkModeOverride) return false;
    
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 12) || (hour >= 12 && hour < 18);
  };

  const value: TimeThemeContextType = {
    theme,
    isManualMode,
    isDarkModeOverride,
    effectiveTheme,
    backgroundTheme,
    toggleManualMode,
    setManualTheme: handleSetManualTheme,
    toggleDarkMode,
    isAutoMode: !isDarkModeOverride,
    getTextClass,
    shouldShowComets,
    shouldShowGlow,
    isDayOrAfternoon,
  };

  return (
    <TimeThemeContext.Provider value={value}>
      {children}
    </TimeThemeContext.Provider>
  );
};

export const useTimeTheme = (): TimeThemeContextType => {
  const context = useContext(TimeThemeContext);
  if (context === undefined) {
    throw new Error('useTimeTheme must be used within a TimeThemeProvider');
  }
  return context;
};
