import { useState } from 'react';
import { 
  Code2, 
  FolderOpen, 
  Briefcase, 
  Users, 
  Volume2, 
  VolumeX,
  Mail,
  Sun,
  Moon,
  Home,
  Clock,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import './GlassDock.css';

// Extend Window interface for manual time override
declare global {
  interface Window {
    manualTimeOverride?: number;
  }
}

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const GlassDock = () => {
  const { isDarkModeOverride, toggleDarkMode, isAutoMode } = useTimeTheme();
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isTimeSliderMode, setIsTimeSliderMode] = useState(false);
  const [manualTime, setManualTime] = useState(12); // 0-23 hours

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implement actual music toggle functionality
  };

  const getTimeLabel = (hour: number) => {
    if (hour >= 6 && hour < 12) return `${hour}:00 AM - Morning`;
    if (hour >= 12 && hour < 18) return `${hour === 12 ? 12 : hour - 12}:00 PM - Afternoon`;
    if (hour >= 18 && hour < 22) return `${hour - 12}:00 PM - Evening`;
    return `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour === 0 || hour < 12 ? 'AM' : 'PM'} - Night`;
  };

  const handleTimeChange = (newTime: number) => {
    setManualTime(newTime);
    // This will be used by MountainLandscape to override the current time
    window.manualTimeOverride = newTime;
    // Trigger a re-render of the background
    window.dispatchEvent(new CustomEvent('manualTimeChange', { detail: newTime }));
  };

  const handleBackToNormal = () => {
    setIsTimeSliderMode(false);
    // Clear the manual time override
    delete window.manualTimeOverride;
    window.dispatchEvent(new CustomEvent('manualTimeChange', { detail: null }));
  };

  // Time Slider Mode UI
  if (isTimeSliderMode) {
    return (
      <>
        {/* Back button in top left */}
        <button
          onClick={handleBackToNormal}
          className={`
            fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl
            backdrop-blur-xl backdrop-saturate-150 border transition-all duration-300
            ${isDarkModeOverride 
              ? 'bg-black/20 border-white/10 text-white hover:bg-white/10' 
              : 'bg-white/25 border-black/5 text-black hover:bg-white/40'
            }
          `}
          style={{
            background: isDarkModeOverride 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
            boxShadow: isDarkModeOverride
              ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
              : '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Time Slider Dock */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div 
            className={`
              relative flex flex-col items-center px-6 py-4 rounded-2xl
              backdrop-blur-xl backdrop-saturate-150
              border shadow-2xl transition-all duration-300
              ${isDarkModeOverride 
                ? 'bg-black/20 border-white/10 shadow-white/5' 
                : 'bg-white/25 border-black/5 shadow-black/10'
              }
            `}
            style={{
              background: isDarkModeOverride 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'
                : 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
              boxShadow: isDarkModeOverride
                ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                : '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            {/* Glass shine effect */}
            <div className="absolute inset-0 rounded-2xl glass-reflection" />
            
            {/* Time display */}
            <div className={`
              relative z-10 text-center mb-4
              ${isDarkModeOverride ? 'text-white' : 'text-black'}
            `}>
              <div className="text-lg font-semibold">{getTimeLabel(manualTime)}</div>
              <div className="text-sm opacity-70">Drag to change time of day</div>
            </div>
            
            {/* Time slider */}
            <div className="relative z-10 w-80">
              <input
                type="range"
                min="0"
                max="23"
                value={manualTime}
                onChange={(e) => handleTimeChange(parseInt(e.target.value))}
                className={`
                  w-full h-2 rounded-lg appearance-none cursor-pointer
                  ${isDarkModeOverride 
                    ? 'bg-white/20 slider-dark' 
                    : 'bg-black/20 slider-light'
                  }
                `}
                style={{
                  background: `linear-gradient(to right, 
                    #87CEEB 0%, #87CEEB 25%, 
                    #FFD700 25%, #FFD700 50%, 
                    #FF4500 50%, #FF4500 75%, 
                    #4B0082 75%, #4B0082 100%)`,
                }}
              />
              
              {/* Time markers */}
              <div className="flex justify-between mt-2 text-xs opacity-60">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>11 PM</span>
              </div>
            </div>
            
            {/* Current time indicator */}
            <div className={`
              relative z-10 mt-3 text-xs opacity-50
              ${isDarkModeOverride ? 'text-white' : 'text-black'}
            `}>
              Real time: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        <style>{`
          .slider-dark::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
            cursor: pointer;
            border: 2px solid rgba(255,255,255,0.3);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }
          
          .slider-light::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6));
            cursor: pointer;
            border: 2px solid rgba(0,0,0,0.2);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          
          .slider-dark::-moz-range-thumb,
          .slider-light::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            border: none;
          }
        `}</style>
      </>
    );
  }

  const dockItems: DockItem[] = [
    {
      id: 'home',
      icon: <Home size={24} />,
      label: 'Home',
      onClick: () => scrollToSection('home'),
    },
    {
      id: 'skills',
      icon: <Code2 size={24} />,
      label: 'Skills',
      onClick: () => scrollToSection('skills'),
    },
    {
      id: 'projects',
      icon: <FolderOpen size={24} />,
      label: 'Projects',
      onClick: () => scrollToSection('projects'),
    },
    {
      id: 'experience',
      icon: <Briefcase size={24} />,
      label: 'Experience',
      onClick: () => scrollToSection('experience'),
    },
    {
      id: 'activities',
      icon: <Users size={24} />,
      label: 'Activities',
      onClick: () => scrollToSection('extracurriculars'),
    },
    {
      id: 'contact',
      icon: <Mail size={24} />,
      label: 'Contact',
      onClick: () => scrollToSection('contact'),
    },
    // Only show time control when in automatic mode
    ...(isAutoMode ? [{
      id: 'time-control',
      icon: <Settings size={24} />,
      label: 'Time Control',
      onClick: () => setIsTimeSliderMode(true),
    }] : []),
    {
      id: 'theme',
      icon: isAutoMode ? <Clock size={24} /> : <Moon size={24} />,
      label: isAutoMode ? 'Night Mode' : 'Auto Mode',
      onClick: toggleDarkMode,
    },
    {
      id: 'volume',
      icon: isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />,
      label: isMuted ? 'Unmute' : 'Mute',
      onClick: toggleMute,
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 glass-dock">
      {/* Glass container */}
      <div 
        className={`
          relative flex items-center px-3 py-2 rounded-2xl
          backdrop-blur-xl backdrop-saturate-150
          border shadow-2xl transition-all duration-300
          ${isDarkModeOverride 
            ? 'bg-black/20 border-white/10 shadow-white/5' 
            : 'bg-white/25 border-black/5 shadow-black/10'
          }
        `}
        style={{
          background: isDarkModeOverride 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
          boxShadow: isDarkModeOverride
            ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            : '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
        role="navigation"
        aria-label="Quick navigation dock"
      >
        {/* Glass shine effect */}
        <div 
          className="absolute inset-0 rounded-2xl glass-reflection"
        />
        
        {/* Dock items */}
        <div className="relative flex items-center space-x-1">
          {dockItems.map((item, index) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Tooltip */}
              {hoveredItem === item.id && (
                <div 
                  className={`
                    absolute -top-14 left-1/2 transform -translate-x-1/2 
                    px-3 py-1.5 rounded-lg text-xs font-medium
                    backdrop-blur-md border tooltip-enter
                    ${isDarkModeOverride 
                      ? 'bg-black/60 text-white border-white/20' 
                      : 'bg-white/80 text-black border-black/10'
                    }
                  `}
                  style={{ 
                    minWidth: 'max-content',
                    boxShadow: isDarkModeOverride
                      ? '0 4px 16px rgba(0,0,0,0.4)'
                      : '0 4px 16px rgba(0,0,0,0.15)',
                  }}
                  role="tooltip"
                >
                  {item.label}
                  <div 
                    className={`
                      absolute top-full left-1/2 transform -translate-x-1/2 
                      w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent
                      ${isDarkModeOverride ? 'border-t-black/60' : 'border-t-white/80'}
                    `}
                  />
                </div>
              )}
              
              {/* Dock item button */}
              <button
                onClick={item.onClick}
                className={`
                  glass-dock-item
                  relative flex items-center justify-center
                  w-11 h-11 rounded-xl transition-all duration-300 ease-out
                  transform hover:scale-110 active:scale-95
                  ${hoveredItem === item.id 
                    ? 'bg-white/25 shadow-lg scale-105' 
                    : 'hover:bg-white/15'
                  }
                  ${isDarkModeOverride 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-black/70 hover:text-black'
                  }
                `}
                style={{
                  background: hoveredItem === item.id 
                    ? isDarkModeOverride
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.2))'
                    : undefined,
                  boxShadow: hoveredItem === item.id
                    ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.1)'
                    : undefined,
                }}
                aria-label={item.label}
                title={item.label}
              >
                {/* Button highlight */}
                {hoveredItem === item.id && (
                  <div 
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    }}
                  />
                )}
                
                <div className="relative z-10 transition-transform duration-300">
                  {item.icon}
                </div>
              </button>
              
              {/* Volume indicator */}
              {item.id === 'volume' && !isMuted && (
                <div 
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border border-white/50 volume-active"
                  aria-label="Audio is playing"
                />
              )}
              
              {/* Theme toggle indicator */}
              {item.id === 'theme' && !isAutoMode && (
                <div 
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full border border-white/50 animate-pulse"
                  aria-label="Night mode active"
                />
              )}
              
              {/* Active state indicator */}
              {hoveredItem === item.id && (
                <div 
                  className={`
                    absolute -bottom-6 left-1/2 transform -translate-x-1/2 
                    w-1 h-1 rounded-full transition-all duration-300
                    ${isDarkModeOverride ? 'bg-white/60' : 'bg-black/40'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Bottom reflection */}
        <div 
          className="absolute -bottom-4 left-2 right-2 h-4 rounded-b-2xl opacity-20 blur-sm"
          style={{
            background: isDarkModeOverride 
              ? 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)'
              : 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)',
          }}
        />
      </div>
    </div>
  );
};

export default GlassDock;
