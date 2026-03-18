import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type TimeTheme = 'bright_day' | 'warm_day' | 'sunset' | 'twilight' | 'night' | 'day' | 'afternoon' | 'evening' | 'sunrise' | 'dawn';

interface TimeThemeContextType {
  theme: TimeTheme;
  isManualMode: boolean;
  isDarkModeOverride: boolean;
  effectiveTheme: TimeTheme;
  backgroundTheme: TimeTheme;
  currentHour: number;
  latitude: number | null;
  longitude: number | null;
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
  const [isDarkModeOverride, setIsDarkModeOverride] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portfolio-dark-mode-override') === 'true';
    }
    return false;
  });
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualTheme, setManualTheme] = useState<TimeTheme>('night');
  const [theme, setTheme] = useState<TimeTheme>('bright_day');
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  const [manualTimeOverride, setManualTimeOverride] = useState<number | null>(null);

  const getTimeBasedTheme = useCallback((): TimeTheme => {
    let dateToCalc = new Date();
    
    if (manualTimeOverride !== null) {
      dateToCalc.setHours(Math.floor(manualTimeOverride), Math.round((manualTimeOverride % 1) * 60), 0, 0);
    }

    const hour = manualTimeOverride !== null ? manualTimeOverride : dateToCalc.getHours() + (dateToCalc.getMinutes() / 60);

    const sRise = 6.0;
    const sSet = 18.25;

    if (hour < sRise - 1.0) return 'night';
    if (hour < sRise) return 'dawn';
    if (hour < sRise + 1.5) return 'sunrise';
    if (hour < sSet - 2.5) return 'day';
    if (hour < sSet - 0.75) return 'afternoon';
    if (hour < sSet + 0.25) return 'sunset';
    if (hour < sSet + 1.5) return 'twilight';
    return 'night';
  }, [manualTimeOverride]);

  const getRepresentativeHour = (theme: TimeTheme): number => {
    switch (theme) {
      case 'dawn': return 5;
      case 'sunrise': return 6;
      case 'bright_day': return 12;
      case 'warm_day': return 16;
      case 'sunset': return 18;
      case 'twilight': return 19;
      case 'night': return 23;
      case 'day': return 12;
      case 'afternoon': return 15;
      case 'evening': return 20;
      default: return 12;
    }
  };

  const getBackgroundTheme = (): TimeTheme => isDarkModeOverride ? 'night' : getTimeBasedTheme();
  const getEffectiveTheme = (): TimeTheme => isDarkModeOverride ? 'night' : getTimeBasedTheme();

  const effectiveTheme = getEffectiveTheme();
  const backgroundTheme = getBackgroundTheme();

  useEffect(() => {
    setTheme(getTimeBasedTheme());
  }, [getTimeBasedTheme]);

  useEffect(() => {
    if (!isManualMode) {
      const updateTheme = () => {
        const newHour = manualTimeOverride !== null ? manualTimeOverride : new Date().getHours() + (new Date().getMinutes() / 60);
        setCurrentHour(newHour);
        setTheme(getTimeBasedTheme());
      };

      updateTheme();
      const interval = setInterval(updateTheme, 60000);
      return () => clearInterval(interval);
    } else {
      setCurrentHour(getRepresentativeHour(manualTheme));
    }
  }, [isManualMode, manualTimeOverride, getTimeBasedTheme, manualTheme]);

  useEffect(() => {
    const handleManualTimeChange = (event: CustomEvent<number | null>) => {
      setIsManualMode(false);
      localStorage.setItem('portfolio-manual-mode', 'false');
      
      setManualTimeOverride(event.detail);
      if (event.detail !== null) {
        setCurrentHour(event.detail);
      } else {
        const actualHour = new Date().getHours() + (new Date().getMinutes() / 60);
        setCurrentHour(actualHour);
      }
    };

    window.addEventListener('manualTimeChange', handleManualTimeChange as EventListener);
    return () => window.removeEventListener('manualTimeChange', handleManualTimeChange as EventListener);
  }, []);

  const toggleManualMode = () => {
    const newManualMode = !isManualMode;
    setIsManualMode(newManualMode);

    if (newManualMode) {
      setTheme(manualTheme);
      setCurrentHour(getRepresentativeHour(manualTheme));
      localStorage.setItem('portfolio-manual-mode', 'true');
      localStorage.setItem('portfolio-manual-theme', manualTheme);
    } else {
      setTheme(getTimeBasedTheme());
      setCurrentHour(new Date().getHours() + (new Date().getMinutes() / 60));
      localStorage.setItem('portfolio-manual-mode', 'false');
    }
  };

  const handleSetManualTheme = (newTheme: TimeTheme) => {
    setManualTheme(newTheme);
    if (isManualMode) {
      setTheme(newTheme);
      setCurrentHour(getRepresentativeHour(newTheme));
      localStorage.setItem('portfolio-manual-theme', newTheme);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkModeOverride;
    setIsDarkModeOverride(newDarkMode);
    localStorage.setItem('portfolio-dark-mode-override', newDarkMode.toString());
    if (!newDarkMode) {
      setTheme(getTimeBasedTheme());
    }
  };

  const getTextClass = (): string => {
    if (isDarkModeOverride) return 'text-dark-mode';
    if (['bright_day', 'warm_day', 'day', 'afternoon', 'sunrise', 'sunset'].includes(effectiveTheme)) return 'text-light-mode';
    return 'text-dark-mode';
  };

  const shouldShowComets = (): boolean => isDarkModeOverride || effectiveTheme === 'night';
  const isDayOrAfternoon = (): boolean => !isDarkModeOverride && ['bright_day', 'warm_day', 'day', 'afternoon', 'sunrise', 'sunset'].includes(effectiveTheme);
  const getTimeBasedClass = (): string => isDarkModeOverride ? 'theme-dark-override' : (isDayOrAfternoon() ? 'theme-day' : 'theme-night');

  const value: TimeThemeContextType = {
    theme,
    isManualMode,
    isDarkModeOverride,
    effectiveTheme,
    backgroundTheme,
    currentHour: isDarkModeOverride ? getRepresentativeHour('night') : currentHour,
    latitude: 0,
    longitude: 0,
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

// eslint-disable-next-line react-refresh/only-export-components
export const useTimeTheme = (): TimeThemeContextType => {
  const context = useContext(TimeThemeContext);
  if (context === undefined) {
    throw new Error('useTimeTheme must be used within a TimeThemeProvider');
  }
  return context;
};
