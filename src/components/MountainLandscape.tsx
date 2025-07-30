import { useTimeTheme } from '@/hooks/useTimeTheme';
import { useState, useEffect } from 'react';

export const MountainLandscape = () => {
  const { theme, isDarkModeOverride } = useTimeTheme();
  const [manualTime, setManualTime] = useState<number | null>(null);

  // Listen for manual time changes from the time slider
  useEffect(() => {
    const handleManualTimeChange = (event: CustomEvent) => {
      setManualTime(event.detail);
    };

    window.addEventListener('manualTimeChange', handleManualTimeChange as EventListener);
    
    return () => {
      window.removeEventListener('manualTimeChange', handleManualTimeChange as EventListener);
    };
  }, []);

  // Get current time for real-time updates, or use manual override
  const getCurrentHour = () => {
    if (manualTime !== null) {
      return manualTime;
    }
    if (window.manualTimeOverride !== undefined) {
      return window.manualTimeOverride;
    }
    return new Date().getHours();
  };

  const currentHour = getCurrentHour();
  
  // Determine the time-based theme colors and elements
  const getTimeBasedStyle = () => {
    if (isDarkModeOverride) {
      // Night mode override - always show night
      return {
        skyGradient: 'linear-gradient(to bottom, #0f0f23 0%, #1a1a3e 50%, #2d2d5f 100%)',
        mountainColor: '#1a1a2e',
        treeColor: '#0d1421',
        stars: true,
        moon: true,
        sun: false,
      };
    }

    // Natural time-based themes
    if (currentHour >= 6 && currentHour < 12) {
      // Dawn/Morning (6 AM - 12 PM)
      return {
        skyGradient: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #B0E0E6 100%)',
        mountainColor: '#4682B4',
        treeColor: '#2F4F4F',
        stars: false,
        moon: false,
        sun: true,
      };
    } else if (currentHour >= 12 && currentHour < 18) {
      // Afternoon (12 PM - 6 PM)
      return {
        skyGradient: 'linear-gradient(to bottom, #87CEEB 0%, #F0F8FF 30%, #E6F3FF 100%)',
        mountainColor: '#5F9EA0',
        treeColor: '#2F4F4F',
        stars: false,
        moon: false,
        sun: true,
      };
    } else if (currentHour >= 18 && currentHour < 22) {
      // Evening/Sunset (6 PM - 10 PM)
      return {
        skyGradient: 'linear-gradient(to bottom, #2F1B69 0%, #8B0000 30%, #FF4500 60%, #FFD700 100%)',
        mountainColor: '#4B0082',
        treeColor: '#191970',
        stars: true,
        moon: false,
        sun: true,
      };
    } else {
      // Night (10 PM - 6 AM)
      return {
        skyGradient: 'linear-gradient(to bottom, #0f0f23 0%, #1a1a3e 50%, #2d2d5f 100%)',
        mountainColor: '#1a1a2e',
        treeColor: '#0d1421',
        stars: true,
        moon: true,
        sun: false,
      };
    }
  };

  const timeStyle = getTimeBasedStyle();

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Sky gradient */}
      <div 
        className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
        style={{ background: timeStyle.skyGradient }}
      />
      
      {/* Stars */}
      {timeStyle.stars && (
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Moon */}
      {timeStyle.moon && (
        <div 
          className="absolute top-20 right-32 w-16 h-16 bg-yellow-100 rounded-full shadow-lg opacity-90"
          style={{
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.3), inset -8px -8px 0 rgba(255, 255, 255, 0.1)',
          }}
        />
      )}
      
      {/* Sun */}
      {timeStyle.sun && (
        <div className="absolute top-20 right-32">
          <div 
            className="w-20 h-20 bg-yellow-400 rounded-full shadow-lg animate-pulse"
            style={{
              boxShadow: '0 0 50px rgba(255, 255, 0, 0.4)',
              animationDuration: '4s',
            }}
          />
        </div>
      )}
      
      {/* Mountain ranges */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Back mountains */}
        <svg 
          viewBox="0 0 1200 400" 
          className="absolute bottom-0 w-full h-auto transition-all duration-[2000ms]"
          style={{ fill: timeStyle.mountainColor, opacity: 0.8 }}
        >
          <path d="M0,400 L0,200 L150,120 L300,180 L450,100 L600,140 L750,80 L900,120 L1050,160 L1200,140 L1200,400 Z" />
        </svg>
        
        {/* Middle mountains */}
        <svg 
          viewBox="0 0 1200 350" 
          className="absolute bottom-0 w-full h-auto transition-all duration-[2000ms]"
          style={{ fill: timeStyle.mountainColor, opacity: 0.9 }}
        >
          <path d="M0,350 L0,250 L200,180 L400,220 L600,160 L800,200 L1000,180 L1200,220 L1200,350 Z" />
        </svg>
        
        {/* Front mountains */}
        <svg 
          viewBox="0 0 1200 300" 
          className="absolute bottom-0 w-full h-auto transition-all duration-[2000ms]"
          style={{ fill: timeStyle.mountainColor }}
        >
          <path d="M0,300 L0,200 L100,150 L250,190 L400,140 L550,170 L700,130 L850,160 L1000,140 L1150,180 L1200,160 L1200,300 Z" />
        </svg>
      </div>
      
      {/* Trees/Forest silhouettes */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Left forest */}
        <div className="absolute bottom-0 left-0 w-1/4 h-40 transition-all duration-[2000ms]">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 transition-all duration-[2000ms]"
              style={{
                left: `${i * 8}%`,
                width: `${Math.random() * 15 + 8}px`,
                height: `${Math.random() * 80 + 60}px`,
                backgroundColor: timeStyle.treeColor,
                clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
              }}
            />
          ))}
          
          {/* Glowworms around left trees - evening and night only */}
          {(currentHour >= 18 || currentHour < 6) && (
            <>
              {[...Array(20)].map((_, i) => (
                <div
                  key={`glow-left-${i}`}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 90 + 5}%`,
                    bottom: `${Math.random() * 80 + 15}px`,
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#ADFF2F',
                    borderRadius: '50%',
                    boxShadow: '0 0 12px #ADFF2F, 0 0 20px #90EE90, 0 0 30px rgba(173, 255, 47, 0.3)',
                    animation: `glowwormFloat ${3 + Math.random() * 4}s ease-in-out infinite, glowwormPulse ${1.5 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: Math.random() * 0.4 + 0.6,
                    filter: 'blur(0.5px)',
                  }}
                />
              ))}
            </>
          )}
        </div>
        
        {/* Right forest */}
        <div className="absolute bottom-0 right-0 w-1/4 h-40 transition-all duration-[2000ms]">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 transition-all duration-[2000ms]"
              style={{
                right: `${i * 8}%`,
                width: `${Math.random() * 15 + 8}px`,
                height: `${Math.random() * 80 + 60}px`,
                backgroundColor: timeStyle.treeColor,
                clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
              }}
            />
          ))}
          
          {/* Glowworms around right trees - evening and night only */}
          {(currentHour >= 18 || currentHour < 6) && (
            <>
              {[...Array(20)].map((_, i) => (
                <div
                  key={`glow-right-${i}`}
                  className="absolute"
                  style={{
                    right: `${Math.random() * 90 + 5}%`,
                    bottom: `${Math.random() * 80 + 15}px`,
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#ADFF2F',
                    borderRadius: '50%',
                    boxShadow: '0 0 12px #ADFF2F, 0 0 20px #90EE90, 0 0 30px rgba(173, 255, 47, 0.3)',
                    animation: `glowwormFloat ${3 + Math.random() * 4}s ease-in-out infinite, glowwormPulse ${1.5 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: Math.random() * 0.4 + 0.6,
                    filter: 'blur(0.5px)',
                  }}
                />
              ))}
            </>
          )}
        </div>
        
        {/* Center lake reflection */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-20 transition-all duration-[2000ms]"
          style={{
            background: `linear-gradient(to bottom, ${timeStyle.skyGradient.split(' ')[4]}, transparent)`,
            borderRadius: '50% 50% 0 0',
            opacity: 0.4,
          }}
        />
      </div>
      
      {/* Atmospheric particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              backgroundColor: timeStyle.stars ? '#ffffff' : '#87CEEB',
              borderRadius: '50%',
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default MountainLandscape;
