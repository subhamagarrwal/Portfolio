import { useState, useEffect } from 'react';

export type TimeTheme = 'morning' | 'afternoon' | 'evening' | 'night';

interface UseTimeThemeReturn {
  theme: TimeTheme;
  isManualMode: boolean;
  toggleManualMode: () => void;
  setManualTheme: (theme: TimeTheme) => void;
}

export const useTimeTheme = (): UseTimeThemeReturn => {
  const [theme, setTheme] = useState<TimeTheme>('morning');
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualTheme, setManualTheme] = useState<TimeTheme>('night');

  const getTimeBasedTheme = (): TimeTheme => {
    const hour = new Date().getHours();
    console.log('Current hour:', hour);
    
    if (hour >= 6 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 20) return 'evening';
    return 'night';
  };

  useEffect(() => {
    // Load preferences from localStorage
    const savedMode = localStorage.getItem('portfolio-manual-mode');
    const savedTheme = localStorage.getItem('portfolio-manual-theme') as TimeTheme;
    
    console.log('Loading preferences:', { savedMode, savedTheme });
    
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

  return {
    theme,
    isManualMode,
    toggleManualMode,
    setManualTheme: handleSetManualTheme,
  };
};