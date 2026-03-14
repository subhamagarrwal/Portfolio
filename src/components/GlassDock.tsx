import { useState, useRef, useEffect } from 'react';
import { 
  Code2, 
  FolderOpen, 
  Briefcase, 
  Users, 
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isTimeSliderMode, setIsTimeSliderMode] = useState(false);
  const [manualTime, setManualTime] = useState(12); // 0-23 hours
  
  // Mobile detection for smaller icons
  const [isMobile, setIsMobile] = useState(false);
  const [iconSize, setIconSize] = useState(20); // Start with mobile-friendly default
  const [isClient, setIsClient] = useState(false);
  
  // Client-side mounting detection - no loading states
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    // Intersection Observer for scroll spy
    const sections = ['home', 'skills', 'experience', 'projects', 'extracurriculars'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      
      // Set icon size based on screen width - more conservative sizing
      if (width <= 360) setIconSize(16);
      else if (width <= 480) setIconSize(18);
      else if (width <= 768) setIconSize(20);
      else setIconSize(22);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, [isClient]);
  
  // Safe icon size getter with fallback
  const getSafeIconSize = () => {
    if (!isClient || typeof window === 'undefined') return 18; // Conservative mobile default
    return iconSize;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
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
    <div className="glass-dock-container">
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
      id: 'experience',
      icon: <Briefcase size={getSafeIconSize()} />,
      label: 'Experience',
      onClick: () => scrollToSection('experience'),
    },
    {
      id: 'projects',
      icon: <FolderOpen size={getSafeIconSize()} />,
      label: 'Projects',
      onClick: () => scrollToSection('projects'),
    },
    {
      id: 'activities',
      icon: <Users size={getSafeIconSize()} />,
      label: 'Activities',
      onClick: () => scrollToSection('extracurriculars'),
    },
    // Only show time control when in automatic mode
    ...(isAutoMode ? [{
      id: 'time-control',
      icon: <Clock size={getSafeIconSize()} />,
      label: 'Time Control',
      onClick: () => setIsTimeSliderMode(true),
    }] : []),
    {
      id: 'theme',
      icon: isAutoMode ? <Sun size={getSafeIconSize()} /> : <Moon size={getSafeIconSize()} />,
      label: isAutoMode ? 'Night Mode' : 'Auto Mode',
      onClick: toggleDarkMode,
    },
  ];

  return (
    <>
      {/* Time Slider Overlay (when active) */}
      {isTimeSliderMode && renderTimeSlider()}
      
      {/* Main Dock (always visible) - Direct glass container */}
      <div 
        className={`
          fixed z-[100]
          flex rounded-2xl
          backdrop-blur-xl backdrop-saturate-150
          border shadow-2xl
          
          /* Desktop constraints */
          md:bottom-3 md:left-1/2 md:transform md:-translate-x-1/2 md:items-center md:px-2 md:py-1.5 md:max-w-[calc(100vw-20px)]
          
          /* Mobile constraints */
          max-md:right-2 max-md:top-1/2 max-md:transform max-md:-translate-y-1/2 max-md:flex-col max-md:items-center max-md:py-2 max-md:px-2 max-md:max-h-[calc(100vh-40px)] max-md:min-h-0
          
          overflow-hidden
          
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
          
          {/* Dock items container with overflow scrolling */}
          <div className="glass-dock-scroll relative flex items-center gap-1 md:justify-center max-md:justify-start max-md:flex-col overflow-x-auto overflow-y-hidden max-md:overflow-y-auto max-md:overflow-x-hidden md:max-w-full w-full h-full max-md:flex-1 max-md:min-h-0 mask-image-vertical">
            {dockItems.map((item, index) => {
              const isHovered = hoveredItem === item.id;
              const isActive = activeSection === item.id;
              const isHoveredOrActive = isHovered || isActive;

              return (
              <div
                key={item.id}
                className="relative flex-shrink-0"
                onMouseEnter={(e) => {
                  // Only show tooltips on non-touch devices
                  if (isClient && window.matchMedia('(hover: hover)').matches) {
                    setHoveredItem(item.id);
                    setHoveredRect(e.currentTarget.getBoundingClientRect());
                  }
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setHoveredRect(null);
                }}
                onTouchStart={(e) => {
                  // Brief haptic feedback simulation for touch
                  setHoveredItem(item.id);
                  setHoveredRect(e.currentTarget.getBoundingClientRect());
                  setTimeout(() => {
                    setHoveredItem(null);
                    setHoveredRect(null);
                  }, 1500);
                }}
              >
                {/* Tooltip rendered outside to avoid clipping in scrollable dock */}
                
                {/* Dock item button */}
                <button
                  onClick={item.onClick}
                  className={`
                    glass-dock-item
                    relative flex items-center justify-center
                    rounded-xl
                    select-none outline-none focus:outline-none
                    transform hover:scale-105 active:scale-95 transition-all duration-150
                    ${isHoveredOrActive 
                      ? 'bg-white/25 shadow-lg scale-105' 
                      : 'hover:bg-white/15'
                    }
                    ${isDarkModeOverride 
                      ? 'text-white/90 hover:text-white' 
                      : 'text-black/70 hover:text-black'
                    }
                  `}
                  style={{
                    background: isHoveredOrActive 
                      ? isDarkModeOverride
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.2))'
                      : undefined,
                    boxShadow: isHoveredOrActive
                      ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.1)'
                      : undefined,
                  }}
                  aria-label={item.label}
                  title={item.label}
                >
                  {/* Button highlight */}
                  {isHoveredOrActive && (
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
                
                {/* Theme toggle indicator */}
                {item.id === 'theme' && !isAutoMode && (
                  <div 
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full border border-white/50 animate-pulse"
                    aria-label="Night mode active"
                  />
                )}
                
                {/* Active state indicator */}
                {isHoveredOrActive && (
                  <div 
                    className={`
                      absolute
                      md:-bottom-6 md:left-1/2 md:transform md:-translate-x-1/2 
                      max-md:-left-6 max-md:top-1/2 max-md:transform max-md:-translate-y-1/2
                      w-1 h-1 rounded-full transition-all duration-300
                      ${isDarkModeOverride ? 'bg-white/60' : 'bg-black/40'}
                    `}
                  />
                )}
              </div>
            );
          })}
          </div>
          
          {/* Bottom reflection */}
          <div 
            className="hidden sm:block absolute -bottom-4 left-2 right-2 h-4 rounded-b-2xl opacity-20 blur-sm"
            style={{
              background: isDarkModeOverride 
                ? 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)'
                : 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)',
            }}
          />
        </div>

      {/* Tooltip rendered outside to avoid clipping in scrollable dock */}
      {hoveredItem && hoveredRect && (
        <div 
          className={`
            fixed z-[60] px-3 py-1.5 rounded-lg text-xs font-medium
            backdrop-blur-md border tooltip-enter pointer-events-none transition-all
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
            top: isMobile 
              ? hoveredRect.top + (hoveredRect.height / 2)
              : hoveredRect.top - 12,
            left: isMobile 
              ? hoveredRect.left - 12
              : hoveredRect.left + (hoveredRect.width / 2),
            transform: isMobile 
              ? 'translate(-100%, -50%)' 
              : 'translate(-50%, -100%)',
          }}
          role="tooltip"
        >
          {dockItems.find(i => i.id === hoveredItem)?.label}
          <div 
            className={`
              absolute 
              border-transparent
              ${isMobile 
                ? 'left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4' 
                : 'top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4'
              }
              ${isDarkModeOverride 
                ? (isMobile ? 'border-l-black/60' : 'border-t-black/60') 
                : (isMobile ? 'border-l-white/80' : 'border-t-white/80')
              }
            `}
          />
        </div>
      )}
    </>
  );
};

export default GlassDock;
