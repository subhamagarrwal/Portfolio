import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import SunCalc from 'suncalc';

export type TimeTheme = 'bright_day' | 'warm_day' | 'sunset' | 'twilight' | 'night' | 'day' | 'afternoon' | 'evening';

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
  
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [sunData, setSunData] = useState<SunData | null>(null);

  // Fetch location once
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.log("Geolocation error, using default NY coordinates.", error);
          setLatitude(40.7128);
          setLongitude(-74.0060);
        }
      );
    } else {
      setLatitude(40.7128);
      setLongitude(-74.0060);
    }
  }, []);

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

    // Default time based fallback if no location
    if (latitude === null || longitude === null) {
      const hour = manualTimeOverride !== null ? manualTimeOverride : dateToCalc.getHours();
      if (hour >= 6 && hour < 18) return 'day';
      return 'night';
    }

    const currentSun = calculateSunData(dateToCalc, latitude, longitude);
    
    // Map example logic based on solar altitude
    if (currentSun.altitude > 40) return 'bright_day';
    if (currentSun.altitude > 10) return 'warm_day';
    if (currentSun.altitude > 0) return 'sunset';
    if (currentSun.altitude > -6) return 'twilight';
    return 'night';
  }, [manualTimeOverride, latitude, longitude, calculateSunData]);

  // Helper function to get representative hour for a theme
  const getRepresentativeHour = (theme: TimeTheme): number => {
    switch (theme) {
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
        setTheme(getTimeBasedTheme());
      } else {
        const actualHour = new Date().getHours() + (new Date().getMinutes() / 60);
        setCurrentHour(actualHour);
        setTheme(getTimeBasedTheme());
      }
    };

    window.addEventListener('manualTimeChange', handleManualTimeChange as EventListener);
    return () => {
      window.removeEventListener('manualTimeChange', handleManualTimeChange as EventListener);
    };
  }, [getTimeBasedTheme]);

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
    if (['bright_day', 'warm_day', 'day', 'afternoon'].includes(currentTheme)) {
      return 'text-light-mode';
    }
    return 'text-dark-mode';
  };

  const shouldShowComets = (): boolean => {
    if (isDarkModeOverride) return true;
    const currentTheme = effectiveTheme;
    if (['bright_day', 'warm_day', 'day', 'afternoon'].includes(currentTheme)) return false;
    return ['night', 'twilight'].includes(currentTheme);
  };

  const isDayOrAfternoon = (): boolean => {
    if (isDarkModeOverride) return false;
    const currentTheme = effectiveTheme;
    return ['bright_day', 'warm_day', 'day', 'afternoon'].includes(currentTheme);
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
    currentHour,
    sunData,
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
