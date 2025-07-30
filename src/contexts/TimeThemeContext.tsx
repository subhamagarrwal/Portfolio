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
  getTextThemeClass: () => string;
  shouldShowComets: () => boolean;
  shouldShowLateNightGlow: () => boolean;
  shouldUseHeroDayAfternoonVisibility: () => boolean;
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
  const [forceUpdate, setForceUpdate] = useState(0);

  const getTimeBasedTheme = (): TimeTheme => {
    const hour = new Date().getHours();
    console.log('Current hour:', hour);
    
    if (hour >= 6 && hour < 12) return 'day';        // 6 AM - 12 PM: Light summer colors
    if (hour >= 12 && hour < 18) return 'afternoon'; // 12 PM - 6 PM: Intense summer colors
    if (hour >= 18 && hour < 22) return 'evening';   // 6 PM - 10 PM: Fading to night
    return 'night';                                   // 10 PM - 6 AM: Purple/violet theme
  };

  // Calculate the background theme (what background should be shown)
  const getBackgroundTheme = (): TimeTheme => {
    if (isDarkModeOverride) {
      return 'night'; // Force night background when dark mode override is active
    }
    return 'day'; // Always use day (blue) background when dark mode override is off
  };

  // Calculate the effective theme (for components to use for styling)
  const getEffectiveTheme = (): TimeTheme => {
    if (isDarkModeOverride) {
      return 'night'; // Force night theme for styling when dark mode override is active
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
    
    console.log('Loading preferences:', { savedMode, savedTheme, savedDarkMode });
    
    // Load dark mode override preference
    if (savedDarkMode === 'true') {
      setIsDarkModeOverride(true);
    }
    
    if (savedMode === 'true' && savedTheme) {
      setIsManualMode(true);
      setManualTheme(savedTheme);
      setTheme(savedTheme);
      console.log('Using manual theme:', savedTheme);
    } else {
      const autoTheme = getTimeBasedTheme();
      setTheme(autoTheme);
      console.log('Using auto theme:', autoTheme);
    }
  }, []);

  useEffect(() => {
    if (!isManualMode) {
      const updateTheme = () => {
        setTheme(getTimeBasedTheme());
      };

      // Update theme immediately
      updateTheme();

      // Update theme every minute
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
    console.log('Dark mode override toggled:', newDarkMode);
    
    // If we're turning off dark mode override, update to current time-based theme
    if (!newDarkMode) {
      const currentTimeTheme = getTimeBasedTheme();
      setTheme(currentTimeTheme);
      console.log('Updated to time-based theme:', currentTimeTheme);
    }
    
    // Force all components to re-render
    setForceUpdate(prev => prev + 1);
  };

  // Get the appropriate text theme class based on current state
  const getTextThemeClass = (): string => {
    // Dark mode override - white text with glow
    if (isDarkModeOverride) {
      return 'theme-dark-override';
    }
    
    // Check for late night hours (10PM-12AM and 12AM-5AM)
    const hour = new Date().getHours();
    const isLateNight = (hour >= 22 && hour <= 23) || (hour >= 0 && hour <= 4);
    
    if (isLateNight) {
      return 'theme-dark-override'; // Use the same class as dark mode override for consistent glow
    }
    
    // Time-based themes
    const currentTheme = getTimeBasedTheme();
    
    // Day and afternoon (6 AM - 6 PM) - black text
    if (currentTheme === 'day' || currentTheme === 'afternoon') {
      return `theme-${currentTheme}-text`;
    }
    
    // Evening and night - white text
    return `theme-${currentTheme}-text`;
  };

  // Check if comets should be shown (dark mode OR 10PM-12AM OR 12AM-5AM)
  const shouldShowComets = (): boolean => {
    if (isDarkModeOverride) return true;
    
    const hour = new Date().getHours();
    // 10PM-12AM (22-23) OR 12AM-5AM (0-4)
    return (hour >= 22 && hour <= 23) || (hour >= 0 && hour <= 4);
  };

  // Check if late night glow should be shown (same conditions as comets)
  const shouldShowLateNightGlow = (): boolean => {
    if (isDarkModeOverride) return true;
    
    const hour = new Date().getHours();
    // 10PM-12AM (22-23) OR 12AM-5AM (0-4)
    return (hour >= 22 && hour <= 23) || (hour >= 0 && hour <= 4);
  };

  // Check if hero section needs special visibility during day/afternoon
  const shouldUseHeroDayAfternoonVisibility = (): boolean => {
    // Don't use if dark mode override is active
    if (isDarkModeOverride) return false;
    
    const hour = new Date().getHours();
    // 6AM-12PM (day) OR 12PM-6PM (afternoon) 
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
    getTextThemeClass,
    shouldShowComets,
    shouldShowLateNightGlow,
    shouldUseHeroDayAfternoonVisibility,
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
