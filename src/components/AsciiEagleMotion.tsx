import { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';

export const AsciiEagleMotion = () => {
  const { isDarkModeOverride } = useTimeTheme();
  const isVisualDarkMode = isDarkModeOverride;
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  // Different eagle ASCII patterns for wing flapping effect
  const eagleFrames = [
    // Frame 1 - Wings up
    [
      "                     ^^^",
      "                ^^^     ^^^",
      "           ^^^              ^^^",
      "      ^^^                      ^^^",
      " ^^^                              ^^^",
      "     ^^^                      ^^^",
      "         ^^^              ^^^",
      "             ^^^      ^^^",
      "                 ^^^^^^",
      "                   ^^",
    ],
    // Frame 2 - Wings middle
    [
      "                     ^^^",
      "                ^^^     ^^^",
      "         ^^^^               ^^^^",
      "   ^^^^                         ^^^^",
      "^^^^                               ^^^^",
      "   ^^^^                         ^^^^",
      "         ^^^^               ^^^^",
      "             ^^^^       ^^^^",
      "                 ^^^^ ^^^^",
      "                   ^^^^",
    ],
    // Frame 3 - Wings down
    [
      "                     ^^^",
      "                ^^^     ^^^",
      "        ^^^^^               ^^^^^",
      "  ^^^^^                         ^^^^^",
      "^^^^^                               ^^^^^",
      "  ^^^^^                         ^^^^^",
      "        ^^^^^               ^^^^^",
      "            ^^^^^       ^^^^^",
      "                ^^^^ ^^^^",
      "                   ^^^^",
    ]
  ];

  const currentEagle = eagleFrames[animationPhase];

  return (
    <>
      {/* Main flying eagle */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 overflow-hidden">
        <div
          className={`
            absolute top-1/4 -left-96 
            font-mono text-sm leading-tight whitespace-pre
            ${isVisualDarkMode 
              ? 'text-purple-300 drop-shadow-[0_0_10px_rgba(147,51,234,0.9)]' 
              : 'text-blue-600 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]'
            }
            transform-gpu
          `}
          style={{
            animation: 'slideNortheast 20s linear infinite',
          }}
        >
          {currentEagle.map((line, index) => (
            <div 
              key={`${animationPhase}-${index}`}
              className="transition-all duration-300"
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Trail effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-5 overflow-hidden">
        <div
          className={`
            absolute top-1/4 -left-96 
            font-mono text-sm leading-tight whitespace-pre opacity-40
            ${isVisualDarkMode ? 'text-purple-400' : 'text-blue-400'}
          `}
          style={{
            animation: 'slideNortheast 20s linear infinite 0.2s',
          }}
        >
          {currentEagle.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>

      {/* Floating ASCII elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-1 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute animate-bounce
              font-mono text-xs opacity-10
              ${isVisualDarkMode ? 'text-purple-400' : 'text-blue-400'}
            `}
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + (i % 2)}s`,
            }}
          >
            {['^^^', '^^', '^'][i % 3]}
          </div>
        ))}
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes slideNortheast {
          0% {
            transform: translateX(-100px) translateY(150px) rotate(-25deg);
          }
          100% {
            transform: translateX(calc(100vw + 200px)) translateY(-150px) rotate(-25deg);
          }
        }
      `}</style>
    </>
  );
};

export default AsciiEagleMotion;
