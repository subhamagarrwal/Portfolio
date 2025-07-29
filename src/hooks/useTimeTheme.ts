import { useState, useEffect } from 'react';

export type TimeTheme = 'day' | 'afternoon' | 'evening' | 'night';

interface UseTimeThemeReturn {
  theme: TimeTheme;
  isManualMode: boolean;
  isDarkModeOverride: boolean;
  effectiveTheme: TimeTheme; // The actual theme being used (considering dark mode override)
  backgroundTheme: TimeTheme; // The theme for background (forces night when dark mode override)
  toggleManualMode: () => void;
  setManualTheme: (theme: TimeTheme) => void;
  toggleDarkMode: () => void;
}

export const useTimeTheme = (): UseTimeThemeReturn => {
  const [theme, setTheme] = useState<TimeTheme>('day');
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualTheme, setManualTheme] = useState<TimeTheme>('night');
  const [isDarkModeOverride, setIsDarkModeOverride] = useState(false);

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
    return theme; // Use natural time-based theme otherwise
  };

  // Calculate the effective theme (for components to use for styling)
  const getEffectiveTheme = (): TimeTheme => {
    if (isDarkModeOverride) {
      return 'night'; // Force night theme for styling when dark mode override is active
    }
    return theme; // Use natural time-based theme otherwise
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
  };

  return {
    theme,
    isManualMode,
    isDarkModeOverride,
    effectiveTheme,
    backgroundTheme,
    toggleManualMode,
    setManualTheme: handleSetManualTheme,
    toggleDarkMode,
  };
};