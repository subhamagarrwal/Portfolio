import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimeTheme, TimeTheme } from '@/hooks/useTimeTheme';

export const ThemeToggle = () => {
  const { theme, isManualMode, toggleManualMode, setManualTheme } = useTimeTheme();
  
  const handleToggle = () => {
    if (isManualMode) {
      // Cycle between day and night themes when in manual mode
      const isDayTheme = theme === 'morning' || theme === 'afternoon';
      setManualTheme(isDayTheme ? 'night' : 'morning');
    } else {
      // Enable manual mode and set to opposite of current theme
      const isDayTheme = theme === 'morning' || theme === 'afternoon';
      setManualTheme(isDayTheme ? 'night' : 'morning');
      toggleManualMode();
    }
  };

  const isNightMode = theme === 'night' || theme === 'evening';

  return (
    <div className="fixed top-6 right-6 z-50">
      <Button
        onClick={handleToggle}
        variant="outline"
        size="icon"
        className={`
          w-12 h-12 rounded-full backdrop-blur-sm border-2 transition-all duration-300
          ${isNightMode 
            ? 'bg-night-card/80 border-night-border text-night-text hover:bg-night-card synthwave-glow' 
            : 'bg-white/80 border-morning-border text-morning-text hover:bg-white'
          }
        `}
      >
        {isNightMode ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>
      
      {isManualMode && (
        <div className="mt-2 text-xs text-center opacity-60">
          Manual
        </div>
      )}
    </div>
  );
};