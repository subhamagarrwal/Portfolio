import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type TimeTheme = 'day' | 'afternoon' | 'evening' | 'night';

interface TimeThemeContextType {
  theme: TimeTheme;
  isManualMode: boolean;
  isDarkModeOverride: boolean;
  effectiveTheme: TimeTheme;
  backgroundTheme: TimeTheme;
  currentHour: number;
  toggleManualMode: () => void;
  setManualTheme: (theme: TimeTheme) => void;
  toggleDarkMode: () => void;
  isAutoMode: boolean;
  getTextClass: () => string;
  shouldShowComets: () => boolean;
  isDayOrAfternoon: () => boolean;
  getTimeBasedClass: () => string;
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
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  const [manualTimeOverride, setManualTimeOverride] = useState<number | null>(null);

  const getTimeBasedTheme = useCallback((): TimeTheme => {
    // Use manual time override if available (from time slider)
    const hour = manualTimeOverride !== null ? manualTimeOverride : new Date().getHours();
    
    if (hour >= 6 && hour < 18) return 'day';        // 6 AM - 6 PM (Day time)
    return 'night';                                   // 6 PM - 6 AM (Night time)
  }, [manualTimeOverride]);

  // Helper function to get representative hour for a theme
  const getRepresentativeHour = (theme: TimeTheme): number => {
    switch (theme) {
      case 'day': return 12;       // 12 PM (middle of day period)
      case 'night': return 23;     // 11 PM (middle of night period)
      // Keep old themes for backward compatibility but map to new logic
      case 'afternoon': return 15; // 3 PM (maps to day)
      case 'evening': return 20;   // 8 PM (maps to night)
      default: return 12;
    }
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
  }, [getTimeBasedTheme]);

  useEffect(() => {
    if (!isManualMode) {
      const updateTheme = () => {
        const newHour = manualTimeOverride !== null ? manualTimeOverride : new Date().getHours();
        setCurrentHour(newHour);
        setTheme(getTimeBasedTheme());
      };

      updateTheme();
      const interval = setInterval(updateTheme, 60000);
      return () => clearInterval(interval);
    }
  }, [isManualMode, manualTimeOverride, getTimeBasedTheme]);

  // Listen for manual time changes from the time slider
  useEffect(() => {
    const handleManualTimeChange = (event: CustomEvent<number | null>) => {
      setManualTimeOverride(event.detail);
      if (event.detail !== null) {
        setCurrentHour(event.detail);
        setTheme(getTimeBasedTheme());
      } else {
        // Reset to actual current time
        const actualHour = new Date().getHours();
        setCurrentHour(actualHour);
        setTheme(getTimeBasedTheme());
      }
    };

    window.addEventListener('manualTimeChange', handleManualTimeChange as EventListener);
    return () => {
      window.removeEventListener('manualTimeChange', handleManualTimeChange as EventListener);
    };
  }, [getTimeBasedTheme, manualTimeOverride]);

  const toggleManualMode = () => {
    const newManualMode = !isManualMode;
    setIsManualMode(newManualMode);
    
    if (newManualMode) {
      setTheme(manualTheme);
      setCurrentHour(getRepresentativeHour(manualTheme)); // Set hour to match manual theme
      localStorage.setItem('portfolio-manual-mode', 'true');
      localStorage.setItem('portfolio-manual-theme', manualTheme);
    } else {
      const currentTimeTheme = getTimeBasedTheme();
      setTheme(currentTimeTheme);
      setCurrentHour(new Date().getHours()); // Reset to actual current hour
      localStorage.setItem('portfolio-manual-mode', 'false');
    }
  };

  const handleSetManualTheme = (newTheme: TimeTheme) => {
    setManualTheme(newTheme);
    if (isManualMode) {
      setTheme(newTheme);
      setCurrentHour(getRepresentativeHour(newTheme)); // Update currentHour to match theme
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
    
    // Use effectiveTheme to respect manual mode
    const currentTheme = effectiveTheme;
    
    // Day period (6 AM - 6 PM) gets black text
    if (currentTheme === 'day' || currentTheme === 'afternoon') {
      return 'text-light-mode'; // Day period - black text
    }
    
    // Night period (6 PM - 6 AM) gets white text with glow
    return 'text-dark-mode'; // Night period - white text with glow
  };

  // Check if comets should be shown
  const shouldShowComets = (): boolean => {
    if (isDarkModeOverride) return true;
    
    // Use effectiveTheme to respect manual mode
    const currentTheme = effectiveTheme;
    // Only show comets during night hours
    // Explicitly exclude day and afternoon
    if (currentTheme === 'day' || currentTheme === 'afternoon') return false;
    return currentTheme === 'night'; // Only show comets during night
  };

  // Check if it's day or afternoon for special text handling
  const isDayOrAfternoon = (): boolean => {
    if (isDarkModeOverride) return false;
    
    // Use effectiveTheme to respect manual mode
    const currentTheme = effectiveTheme;
    // Day period is 6 AM - 6 PM
    return currentTheme === 'day' || currentTheme === 'afternoon';
  };

  // Get time-based CSS class for higher specificity
  const getTimeBasedClass = (): string => {
    const hour = currentHour;
    
    if (isDarkModeOverride) return 'theme-dark-override';
    
    // Simplified logic: 6 AM - 6 PM is day, 6 PM - 6 AM is night
    if (hour >= 6 && hour < 18) return 'theme-day';
    return 'theme-night';
  };

  const value: TimeThemeContextType = {
    theme,
    isManualMode,
    isDarkModeOverride,
    effectiveTheme,
    backgroundTheme,
    currentHour,
    toggleManualMode,
    setManualTheme: handleSetManualTheme,
    toggleDarkMode,
    isAutoMode: !isDarkModeOverride,
    getTextClass,
    shouldShowComets,
    isDayOrAfternoon,
    getTimeBasedClass,
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
