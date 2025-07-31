import { useState, useRef, useEffect } from 'react';
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
  ArrowLeft,
  Radio
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
  const [isLoading, setIsLoading] = useState(false);
  const [musicMode, setMusicMode] = useState<'lofi' | 'synthwave'>('lofi');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Mobile detection for smaller icons
  const [isMobile, setIsMobile] = useState(false);
  const [iconSize, setIconSize] = useState(24);
  const [isClient, setIsClient] = useState(false);
  
  // Client-side mounting detection
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      
      // Set icon size based on screen width
      if (width <= 360) setIconSize(16);
      else if (width <= 480) setIconSize(18);
      else if (width <= 768) setIconSize(20);
      else setIconSize(24);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isClient]);
  
  // Safe icon size getter with fallback
  const getSafeIconSize = () => {
    if (!isClient || typeof window === 'undefined') return 20; // Default mobile size
    return iconSize;
  };

  // Initialize audio element
  useEffect(() => {
    const initializeAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadstart', () => {});
        audioRef.current.removeEventListener('canplay', () => {});
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current.remove();
      }

      const audio = new Audio();
      
      // Set the stream URL based on music mode
      audio.src = musicMode === 'synthwave'
        ? 'https://stream.nightride.fm/nightride.m3u8'
        : 'https://somafm.com/dronezone130.pls';
      
      audio.crossOrigin = 'anonymous';
      audio.preload = 'none';
      audio.volume = 0.6;
      
      audioRef.current = audio;
    };

    initializeAudio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.remove();
      }
    };
  }, [musicMode]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const toggleMute = async () => {
    if (!audioRef.current) return;

    setIsLoading(true);
    
    try {
      if (isMuted) {
        await audioRef.current.play();
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    } catch (error) {
      console.log('Audio format not supported, trying alternative...');
      // Try alternative stream format
      if (audioRef.current) {
        audioRef.current.src = musicMode === 'synthwave'
          ? 'https://somafm.com/spacestation.pls' // Try PLS format
          : 'https://somafm.com/dronezone.pls';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMusicMode = () => {
    // If currently playing, pause first
    if (!isMuted && audioRef.current) {
      audioRef.current.pause();
      setIsMuted(true);
    }
    
    // Switch music mode
    setMusicMode(prev => prev === 'lofi' ? 'synthwave' : 'lofi');
  };

  const getTimeLabel = (hour: number) => {
    if (hour >= 6 && hour < 12) return `${hour}:00 AM - Morning`;
    if (hour >= 12 && hour < 18) return `${hour === 12 ? 12 : hour - 12}:00 PM - Afternoon`;
    if (hour >= 18 && hour < 22) return `${hour - 12}:00 PM - Evening`;
    return `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour === 0 || hour < 12 ? 'AM' : 'PM'} - Night`;
  };

  const handleTimeChange = (newTime: number) => {
    try {
      setManualTime(newTime);
      // This will be used by MountainLandscape to override the current time
      if (typeof window !== 'undefined') {
        window.manualTimeOverride = newTime;
        // Trigger a re-render of the background with error handling
        try {
          window.dispatchEvent(new CustomEvent('manualTimeChange', { detail: newTime }));
        } catch (error) {
          console.warn('Failed to dispatch time change event:', error);
        }
      }
    } catch (error) {
      console.error('Error handling time change:', error);
    }
  };

  const handleBackToNormal = () => {
    try {
      setIsTimeSliderMode(false);
      // Clear the manual time override
      if (typeof window !== 'undefined') {
        delete window.manualTimeOverride;
        try {
          window.dispatchEvent(new CustomEvent('manualTimeChange', { detail: null }));
        } catch (error) {
          console.warn('Failed to dispatch time reset event:', error);
        }
      }
    } catch (error) {
      console.error('Error returning to normal mode:', error);
    }
  };

  // Instead of completely replacing the dock, show time slider as overlay
  const renderTimeSlider = () => (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 px-4 md:bottom-24 md:px-0">
      <div 
        className={`
          relative flex flex-col items-center px-4 py-3 rounded-2xl max-w-[calc(100vw-32px)]
          backdrop-blur-xl backdrop-saturate-150
          border shadow-2xl transition-all duration-300
          md:px-6 md:py-4
          ${isDarkModeOverride 
            ? 'bg-black/30 border-white/20 shadow-white/10' 
            : 'bg-white/40 border-black/10 shadow-black/20'
          }
        `}
        style={{
          background: isDarkModeOverride 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))',
          boxShadow: isDarkModeOverride
            ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
            : '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4)',
        }}
      >
        {/* Glass shine effect */}
        <div className="absolute inset-0 rounded-2xl glass-reflection" />
        
        {/* Time display */}
        <div className={`
          relative z-10 text-center mb-3 md:mb-4
          ${isDarkModeOverride ? 'text-white' : 'text-black'}
        `}>
          <div className="text-base md:text-lg font-semibold">{getTimeLabel(manualTime)}</div>
          <div className="text-xs md:text-sm opacity-70">Drag to change time of day</div>
        </div>
        
        {/* Time slider */}
        <div className="relative z-10 w-full max-w-xs md:w-80">
          <input
            type="range"
            min="0"
            max="23"
            step="1"
            value={manualTime}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 0 && value <= 23) {
                handleTimeChange(value);
              }
            }}
            onInput={(e) => {
              // Additional safety for mobile devices
              const value = parseInt((e.target as HTMLInputElement).value);
              if (!isNaN(value) && value >= 0 && value <= 23) {
                handleTimeChange(value);
              }
            }}
            className={`
              w-full h-3 md:h-2 rounded-lg appearance-none cursor-pointer
              touch-manipulation
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
            aria-label="Time of day slider"
            aria-valuemin={0}
            aria-valuemax={23}
            aria-valuenow={manualTime}
          />
          
          {/* Time markers */}
          <div className="flex justify-between mt-2 text-xs opacity-60">
            <span className="hidden sm:inline">12 AM</span>
            <span className="sm:hidden">12A</span>
            <span className="hidden sm:inline">6 AM</span>
            <span className="sm:hidden">6A</span>
            <span className="hidden sm:inline">12 PM</span>
            <span className="sm:hidden">12P</span>
            <span className="hidden sm:inline">6 PM</span>
            <span className="sm:hidden">6P</span>
            <span className="hidden sm:inline">11 PM</span>
            <span className="sm:hidden">11P</span>
          </div>
        </div>
        
        {/* Quick exit button */}
        <button
          onClick={handleBackToNormal}
          className={`
            relative z-10 mt-3 px-4 py-1.5 rounded-lg text-xs font-medium
            transition-all duration-200 touch-manipulation
            ${isDarkModeOverride 
              ? 'bg-white/20 text-white hover:bg-white/30' 
              : 'bg-black/20 text-black hover:bg-black/30'
            }
          `}
        >
          ✕ Close
        </button>
      </div>
    </div>
  );

  const dockItems: DockItem[] = [
    {
      id: 'home',
      icon: <Home size={getSafeIconSize()} />,
      label: 'Home',
      onClick: () => scrollToSection('home'),
    },
    {
      id: 'skills',
      icon: <Code2 size={getSafeIconSize()} />,
      label: 'Skills',
      onClick: () => scrollToSection('skills'),
    },
    {
      id: 'projects',
      icon: <FolderOpen size={getSafeIconSize()} />,
      label: 'Projects',
      onClick: () => scrollToSection('projects'),
    },
    {
      id: 'experience',
      icon: <Briefcase size={getSafeIconSize()} />,
      label: 'Experience',
      onClick: () => scrollToSection('experience'),
    },
    {
      id: 'activities',
      icon: <Users size={getSafeIconSize()} />,
      label: 'Activities',
      onClick: () => scrollToSection('extracurriculars'),
    },
    {
      id: 'contact',
      icon: <Mail size={getSafeIconSize()} />,
      label: 'Contact',
      onClick: () => scrollToSection('contact'),
    },
    // Only show time control when in automatic mode
    ...(isAutoMode ? [{
      id: 'time-control',
      icon: <Settings size={getSafeIconSize()} />,
      label: 'Time Control',
      onClick: () => setIsTimeSliderMode(true),
    }] : []),
    {
      id: 'theme',
      icon: isAutoMode ? <Clock size={getSafeIconSize()} /> : <Moon size={getSafeIconSize()} />,
      label: isAutoMode ? 'Night Mode' : 'Auto Mode',
      onClick: toggleDarkMode,
    },
    {
      id: 'music-mode',
      icon: (
        <div className="relative">
          <Radio size={getSafeIconSize()} />
          <div className={`
            absolute -bottom-1 -right-1 text-xs font-bold px-1 py-0.5 rounded
            ${musicMode === 'synthwave' 
              ? 'bg-purple-500 text-white' 
              : 'bg-green-500 text-white'
            }
          `}>
            {musicMode === 'synthwave' ? 'SW' : 'LO'}
          </div>
        </div>
      ),
      label: `Switch to ${musicMode === 'lofi' ? 'Synthwave' : 'Lofi'}`,
      onClick: toggleMusicMode,
    },
    {
      id: 'volume',
      icon: isLoading ? (
        <div className="animate-spin">
          <Volume2 size={getSafeIconSize()} className="opacity-50" />
        </div>
      ) : isMuted ? (
        <VolumeX size={getSafeIconSize()} />
      ) : (
        <Volume2 size={getSafeIconSize()} />
      ),
      label: isLoading 
        ? `Loading ${musicMode}...` 
        : isMuted 
          ? `▶ Play ${musicMode === 'synthwave' ? 'Synthwave' : 'Lofi'}` 
          : `⏸ Pause ${musicMode === 'synthwave' ? 'Synthwave' : 'Lofi'}`,
      onClick: toggleMute,
    },
  ];

  return (
    <>
      {/* Time Slider Overlay (when active) */}
      {isTimeSliderMode && renderTimeSlider()}
      
      {/* Main Dock (always visible) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 glass-dock w-max max-w-[calc(100vw-24px)]">
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
          <div className="relative flex items-center space-x-0.5 sm:space-x-1 min-w-max">
            {dockItems.map((item, index) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => {
                  // Only show tooltips on non-touch devices
                  if (isClient && window.matchMedia('(hover: hover)').matches) {
                    setHoveredItem(item.id);
                  }
                }}
                onMouseLeave={() => setHoveredItem(null)}
                onTouchStart={() => {
                  // Brief haptic feedback simulation for touch
                  setHoveredItem(item.id);
                  setTimeout(() => setHoveredItem(null), 150);
                }}
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
                    touch-manipulation select-none
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
                
                {/* Volume/Music indicator */}
                {item.id === 'volume' && !isMuted && !isLoading && (
                  <div 
                    className={`
                      absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white/50 animate-pulse
                      ${musicMode === 'synthwave' ? 'bg-purple-400' : 'bg-emerald-400'}
                    `}
                    aria-label={`${musicMode === 'synthwave' ? 'Synthwave' : 'Lofi'} music is playing`}
                    style={{
                      boxShadow: musicMode === 'synthwave' 
                        ? '0 0 8px rgba(168, 85, 247, 0.6)'
                        : '0 0 8px rgba(52, 211, 153, 0.6)',
                    }}
                  />
                )}
                
                {/* Loading indicator for music */}
                {item.id === 'volume' && isLoading && (
                  <div 
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white/50 animate-spin"
                    aria-label="Loading music..."
                  />
                )}

                {/* Music mode indicator */}
                {item.id === 'music-mode' && (
                  <div 
                    className={`
                      absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white/50
                      ${musicMode === 'synthwave' ? 'bg-purple-400' : 'bg-emerald-400'}
                    `}
                    aria-label={`Current mode: ${musicMode}`}
                    style={{
                      boxShadow: musicMode === 'synthwave' 
                        ? '0 0 6px rgba(168, 85, 247, 0.4)'
                        : '0 0 6px rgba(52, 211, 153, 0.4)',
                    }}
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
    </>
  );
};

export default GlassDock;
