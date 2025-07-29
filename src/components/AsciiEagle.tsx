import { useEffect, useState } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';

export const AsciiEagle = () => {
  const { effectiveTheme, isDarkModeOverride } = useTimeTheme();
  const isVisualDarkMode = isDarkModeOverride;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const eagleAscii = [
    "                    ^^^^^",
    "               ^^^^      ^^^^",
    "          ^^^^               ^^^^",
    "     ^^^^                        ^^^^",
    "^^^^                                 ^^^^",
    "    ^^^^                         ^^^^",
    "        ^^^^                 ^^^^",
    "            ^^^^         ^^^^",
    "                ^^^^^ ^^^^",
    "                   ^^^",
    "                    ^",
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      <div
        className={`
          absolute transition-all duration-[8s] ease-linear
          ${isVisible ? 'translate-x-[120vw] -translate-y-[20vh]' : '-translate-x-[50vw] translate-y-[30vh]'}
          font-mono text-xs leading-none whitespace-pre
          ${isVisualDarkMode 
            ? 'text-purple-300 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]' 
            : 'text-blue-500 drop-shadow-[0_0_4px_rgba(59,130,246,0.6)]'
          }
          transform-gpu
        `}
      >
        {eagleAscii.map((line, index) => (
          <div 
            key={index}
            className={`
              transition-all duration-300 
              ${isVisualDarkMode ? 'animate-pulse' : ''}
            `}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {line}
          </div>
        ))}
      </div>
      
      {/* Trail effect */}
      <div
        className={`
          absolute transition-all duration-[8s] ease-linear
          ${isVisible ? 'translate-x-[115vw] -translate-y-[18vh]' : '-translate-x-[55vw] translate-y-[32vh]'}
          font-mono text-xs leading-none whitespace-pre opacity-40
          ${isVisualDarkMode 
            ? 'text-purple-400' 
            : 'text-blue-400'
          }
          transform-gpu
        `}
      >
        {eagleAscii.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      
      {/* Second trail effect */}
      <div
        className={`
          absolute transition-all duration-[8s] ease-linear
          ${isVisible ? 'translate-x-[110vw] -translate-y-[16vh]' : '-translate-x-[60vw] translate-y-[34vh]'}
          font-mono text-xs leading-none whitespace-pre opacity-20
          ${isVisualDarkMode 
            ? 'text-purple-500' 
            : 'text-blue-300'
          }
          transform-gpu
        `}
      >
        {eagleAscii.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

export default AsciiEagle;
