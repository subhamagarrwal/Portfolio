import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimeTheme, TimeTheme } from '@/hooks/useTimeTheme';

export const ThemeToggle = () => {
  const { theme, isManualMode, toggleManualMode, setManualTheme } = useTimeTheme();
  
  const handleToggle = () => {
    console.log('Theme toggle clicked. Current state:', { theme, isManualMode });
    
    if (isManualMode) {
      // Cycle between day and night themes when in manual mode
      const isDayTheme = theme === 'morning' || theme === 'afternoon';
      const newTheme = isDayTheme ? 'night' : 'morning';
      console.log('Manual mode: switching to', newTheme);
      setManualTheme(newTheme);
    } else {
      // Enable manual mode and set to opposite of current theme
      const isDayTheme = theme === 'morning' || theme === 'afternoon';
      const newTheme = isDayTheme ? 'night' : 'morning';
      console.log('Enabling manual mode with theme:', newTheme);
      setManualTheme(newTheme);
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
            ? 'bg-black/80 border-purple-500 text-purple-100 hover:bg-black/90 shadow-lg shadow-purple-500/50' 
            : 'bg-white/80 border-orange-300 text-orange-800 hover:bg-white/90'
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