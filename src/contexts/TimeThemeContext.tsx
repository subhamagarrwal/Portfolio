import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import SunCalc from 'suncalc';

import { useGeolocation } from '@/hooks/useGeolocation';

export type TimeTheme = 'bright_day' | 'warm_day' | 'sunset' | 'twilight' | 'night' | 'day' | 'afternoon' | 'evening' | 'sunrise' | 'dawn';

interface SunData {
  altitude: number; // degrees
  azimuth: number; // degrees
}

interface TimeThemeContextType {
  theme: TimeTheme;
  isManualMode: boolean;
  isDarkModeOverride: boolean;
  effectiveTheme: TimeTheme;
  backgroundTheme: TimeTheme;
  currentHour: number;
  sunData: SunData | null;
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
  const [theme, setTheme] = useState<TimeTheme>('bright_day');
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualTheme, setManualTheme] = useState<TimeTheme>('night');
  const [isDarkModeOverride, setIsDarkModeOverride] = useState(false);
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  const [manualTimeOverride, setManualTimeOverride] = useState<number | null>(null);
  
  const { latitude, longitude } = useGeolocation();
  const [sunData, setSunData] = useState<SunData | null>(null);

  const calculateSunData = useCallback((dateToCalc: Date, lat: number, lng: number): SunData => {
    const pos = SunCalc.getPosition(dateToCalc, lat, lng);
    // Convert radians to degrees
    return {
      altitude: pos.altitude * (180 / Math.PI),
      azimuth: pos.azimuth * (180 / Math.PI)
    };
  }, []);

  const getTimeBasedTheme = useCallback((): TimeTheme => {
    let dateToCalc = new Date();
    
    if (manualTimeOverride !== null) {
      const now = new Date();
      // Calculate fraction of manualTimeOverride so minutes are preserved
      now.setHours(Math.floor(manualTimeOverride), Math.round((manualTimeOverride % 1) * 60), 0, 0);
      dateToCalc = now;
    }

    const hour = manualTimeOverride !== null ? manualTimeOverride : dateToCalc.getHours() + (dateToCalc.getMinutes() / 60);

    // Default time based fallback if no location
    if (latitude === null || longitude === null) {
      if (hour >= 6 && hour < 18) return 'day';
      return 'night';
    }

    const times = SunCalc.getTimes(dateToCalc, latitude, longitude);
    
    const getDecHour = (d: Date | undefined, fallback: number) => {
      if (!d || isNaN(d.getTime())) return fallback;
      return d.getHours() + (d.getMinutes() / 60);
    };

    const sRise = getDecHour(times.sunrise, 6.0);
    const sSet = getDecHour(times.sunsetStart, 18.25);

    // Match exact logical phases from useSunPhase
    if (hour < sRise - 1.0) return 'night';
    if (hour < sRise) return 'dawn'; // pre-dawn
    if (hour < sRise + 1.5) return 'sunrise';
    if (hour < sSet - 2.5) return 'day'; // morning/noon
    if (hour < sSet - 0.75) return 'afternoon';
    if (hour < sSet + 0.25) return 'sunset';
    if (hour < sSet + 1.5) return 'twilight'; // dusk
    return 'night';
  }, [manualTimeOverride, latitude, longitude]);

  // Helper function to get representative hour for a theme
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

  const getBackgroundTheme = (): TimeTheme => {
    if (isDarkModeOverride) return 'night';
    return getTimeBasedTheme();
  };

  const getEffectiveTheme = (): TimeTheme => {
    if (isDarkModeOverride) return 'night';
    return getTimeBasedTheme();
  };

  const effectiveTheme = getEffectiveTheme();
  const backgroundTheme = getBackgroundTheme();

  useEffect(() => {
    // Ignore legacy manual mode to prevent getting stuck at 11:00 PM
    const savedDarkMode = localStorage.getItem('portfolio-dark-mode-override');

    if (savedDarkMode === 'true') {
      setIsDarkModeOverride(true);
    }

    setTheme(getTimeBasedTheme());
  }, [getTimeBasedTheme]);

  useEffect(() => {
    if (!isManualMode) {
      const updateTheme = () => {
        const newHour = manualTimeOverride !== null ? manualTimeOverride : new Date().getHours() + (new Date().getMinutes() / 60);
        setCurrentHour(newHour);
        setTheme(getTimeBasedTheme());
        if (latitude !== null && longitude !== null) {
          let calcDate = new Date();
          if (manualTimeOverride !== null) {
            calcDate.setHours(Math.floor(manualTimeOverride), Math.round((manualTimeOverride % 1) * 60), 0, 0);
          }
          setSunData(calculateSunData(calcDate, latitude, longitude));
        }
      };

      updateTheme();
      const interval = setInterval(updateTheme, 60000); // 1 minute
      return () => clearInterval(interval);
    } else {
      // Manual mode syncing SunData
        if (latitude !== null && longitude !== null) {
          let calcDate = new Date();
          const overrideHour = getRepresentativeHour(manualTheme);
          calcDate.setHours(overrideHour, 0, 0, 0);
          setSunData(calculateSunData(calcDate, latitude, longitude));
          setCurrentHour(overrideHour);
        }
    }
  }, [isManualMode, manualTimeOverride, getTimeBasedTheme, latitude, longitude, manualTheme, calculateSunData]);

  // Listen for manual time changes from the time slider
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
    return () => {
      window.removeEventListener('manualTimeChange', handleManualTimeChange as EventListener);
    };
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
    const currentTheme = effectiveTheme;
    if (['bright_day', 'warm_day', 'day', 'afternoon', 'sunrise', 'sunset'].includes(currentTheme)) {
      return 'text-light-mode';
    }
    return 'text-dark-mode';
  };

  const shouldShowComets = (): boolean => {
    if (isDarkModeOverride) return true;

    // Explicitly hide comets if it's past 5 AM and before noon (morning block)
    if (currentHour >= 5 && currentHour < 12) {
      return false; 
    }

    const currentTheme = effectiveTheme;
    // Only show comets during evening dusk (twilight) and night
    return ['night', 'twilight', 'dawn'].includes(currentTheme) && currentHour < 5 || currentHour >= 12 && ['night', 'twilight'].includes(currentTheme);
  };

  const isDayOrAfternoon = (): boolean => {
    if (isDarkModeOverride) return false;
    const currentTheme = effectiveTheme;
    return ['bright_day', 'warm_day', 'day', 'afternoon', 'sunrise', 'sunset'].includes(currentTheme);
  };

  const getTimeBasedClass = (): string => {
    if (isDarkModeOverride) return 'theme-dark-override';
    return isDayOrAfternoon() ? 'theme-day' : 'theme-night';
  };

  const value: TimeThemeContextType = {
    theme,
    isManualMode,
    isDarkModeOverride,
    effectiveTheme,
    backgroundTheme,
    currentHour: isDarkModeOverride ? getRepresentativeHour('night') : currentHour,
    sunData: isDarkModeOverride ? null : sunData,
    latitude,
    longitude,
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
