import { useTimeTheme } from '@/hooks/useTimeTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { backgroundTheme } = useTimeTheme();

  // This ensures all theme classes are included in the build
  const themeClasses = {
    day: 'bg-day text-day-text',
    afternoon: 'bg-afternoon text-afternoon-text', 
    evening: 'bg-evening text-evening-text',
    night: 'bg-night text-night-text'
  };

  return (
    <div className={`min-h-screen transition-all duration-2000 ${themeClasses[backgroundTheme]}`}>
      {children}
    </div>
  );
};
