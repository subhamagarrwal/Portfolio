import { useState, useEffect } from 'react';
import { Sun, Moon, Cloud, Star } from 'lucide-react';
import { useTimeTheme, TimeTheme } from '@/hooks/useTimeTheme';

export const ThemeToggle = () => {
  const { theme, effectiveTheme, backgroundTheme, isDarkModeOverride, toggleDarkMode } = useTimeTheme();
  const [isToggling, setIsToggling] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (for SSR compatibility)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle dark mode toggle
  const handleToggle = async () => {
    setIsToggling(true);
    console.log('Theme toggle clicked. Current state:', { theme, effectiveTheme, backgroundTheme, isDarkModeOverride });
    
    try {
      toggleDarkMode();
    } catch (error) {
      console.error('Error toggling theme:', error);
    } finally {
      // Add a small delay for smooth animation
      setTimeout(() => setIsToggling(false), 500);
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  // Don't render until mounted (prevents hydration issues)
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <button 
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={isToggling}
        aria-label={`Switch to ${isDarkModeOverride ? 'light' : 'dark'} mode`}
        aria-pressed={isDarkModeOverride}
        className={`
          relative w-24 h-12 rounded-full cursor-pointer transition-all duration-500 ease-in-out overflow-hidden
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:cursor-not-allowed disabled:opacity-70
          ${isDarkModeOverride 
            ? 'bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg shadow-purple-500/30' 
            : 'bg-gradient-to-r from-sky-300 to-sky-400 shadow-lg shadow-orange-300/30'
          }
          ${isToggling ? 'scale-95' : 'hover:scale-105'}
        `}
      >
        {/* Toggle Circle */}
        <div className={`
          absolute top-1 w-10 h-10 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center
          ${isDarkModeOverride 
            ? 'translate-x-12 bg-slate-700 shadow-lg' 
            : 'translate-x-1 bg-yellow-400 shadow-lg'
          }
          ${isToggling ? 'animate-pulse' : ''}
        `}>
          {isDarkModeOverride ? (
            <Moon className={`w-5 h-5 text-yellow-100 ${isToggling ? 'animate-spin' : ''}`} />
          ) : (
            <Sun className={`w-5 h-5 text-yellow-800 ${isToggling ? 'animate-spin' : ''}`} />
          )}
        </div>

        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          {isDarkModeOverride ? (
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
      </button>
      
      {/* Mode Label */}
      <div className={`
        mt-2 text-xs text-center transition-colors duration-300
        ${isDarkModeOverride ? 'text-white/70' : 'text-gray-600'}
      `}>
        {isDarkModeOverride ? 'Dark mode' : 'Light mode'}
        {isToggling && (
          <span className="ml-1 inline-block animate-pulse">⚡</span>
        )}
      </div>
      
      {isDarkModeOverride && (
        <div className={`
          text-xs text-center opacity-50 transition-colors duration-300
          ${isDarkModeOverride ? 'text-white/50' : 'text-gray-500'}
        `}>
          Dark Mode Override
        </div>
      )}
    </div>
  );
};