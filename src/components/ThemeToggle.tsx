import { Sun, Moon, Cloud, Star } from 'lucide-react';
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
      <div 
        onClick={handleToggle}
        className={`
          relative w-24 h-12 rounded-full cursor-pointer transition-all duration-500 ease-in-out overflow-hidden
          ${isNightMode 
            ? 'bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg shadow-purple-500/30' 
            : 'bg-gradient-to-r from-sky-300 to-sky-400 shadow-lg shadow-orange-300/30'
          }
        `}
      >
        {/* Toggle Circle */}
        <div className={`
          absolute top-1 w-10 h-10 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center
          ${isNightMode 
            ? 'translate-x-12 bg-slate-700 shadow-lg' 
            : 'translate-x-1 bg-yellow-400 shadow-lg'
          }
        `}>
          {isNightMode ? (
            <Moon className="w-5 h-5 text-yellow-100" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-800" />
          )}
        </div>

        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          {isNightMode ? (
            <>
              {/* Stars */}
              <Star className="absolute top-2 left-2 w-2 h-2 text-yellow-200 animate-pulse" />
              <Star className="absolute top-6 left-4 w-1.5 h-1.5 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Star className="absolute top-3 left-6 w-1 h-1 text-yellow-200 animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          ) : (
            <>
              {/* Clouds */}
              <Cloud className="absolute top-2 right-2 w-3 h-3 text-white/80" />
              <Cloud className="absolute top-6 right-5 w-2.5 h-2.5 text-white/60" />
              <Cloud className="absolute top-4 right-8 w-2 h-2 text-white/70" />
            </>
          )}
        </div>
      </div>
      
      {/* Mode Label */}
      <div className={`
        mt-2 text-xs text-center transition-colors duration-300
        ${isNightMode ? 'text-white/70' : 'text-gray-600'}
      `}>
        {isNightMode ? 'Dark mode' : 'Light mode'}
      </div>
      
      {isManualMode && (
        <div className={`
          text-xs text-center opacity-50 transition-colors duration-300
          ${isNightMode ? 'text-white/50' : 'text-gray-500'}
        `}>
          Manual
        </div>
      )}
    </div>
  );
};