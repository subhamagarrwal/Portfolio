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
import { TimeDial } from './TimeDial';
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
  const { isDarkModeOverride, toggleDarkMode, isAutoMode, isDayOrAfternoon } = useTimeTheme();
  const isDarkTheme = !isDayOrAfternoon();
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
    const sections = ['home', 'journey', 'skills', 'projects'];
    
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
      // We no longer clear the manual time override here 
      // so it persists when leaving the section.
    } catch (error) {
      console.error('Error returning to normal mode:', error);
    }
  };

  // Add an effect to hide main contents when in time slider mode
  useEffect(() => {
    if (isTimeSliderMode) {
      document.body.classList.add('time-slider-active');
    } else {
      document.body.classList.remove('time-slider-active');
    }
    
    return () => {
      document.body.classList.remove('time-slider-active');
    };
  }, [isTimeSliderMode]);

  // Instead of completely replacing the dock, show time slider as overlay
  const renderTimeSlider = () => (
    <TimeDial onClose={handleBackToNormal} isDarkModeOverride={isDarkModeOverride} />
  );

  const dockItems: DockItem[] = [
    {
      id: 'home',
      icon: <Home size={getSafeIconSize()} />,
      label: 'Home',
      onClick: () => scrollToSection('home'),
    },
    {
      id: 'journey',
      icon: <Briefcase size={getSafeIconSize()} />,
      label: 'Journey',
      onClick: () => scrollToSection('journey'),
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
      
{/* Main Dock (always visible unless slider is active) - Direct glass container */}
      <div
        className={`
          fixed z-[100] transition-all duration-300
          ${isTimeSliderMode ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100 translate-y-0'}
          flex rounded-2xl
          backdrop-blur-xl backdrop-saturate-150
          border shadow-2xl
          
          /* Desktop constraints */
          md:bottom-3 md:left-1/2 md:transform md:-translate-x-1/2 md:items-center md:px-2 md:py-1.5 md:max-w-[calc(100vw-20px)]
          
          /* Mobile constraints */
          max-md:bottom-3 max-md:left-1/2 max-md:transform max-md:-translate-x-1/2 max-md:items-center max-md:px-2 max-md:py-1.5 max-md:max-w-[calc(100vw-20px)]
          
            : 'bg-white/25 border-black/5 shadow-black/10'
          }
        `}
        style={{
          background: isDarkTheme 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
          boxShadow: isDarkTheme
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
          <div className="glass-dock-scroll relative flex items-center gap-1 justify-center overflow-x-auto overflow-y-hidden max-w-full w-full h-full">
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
                    ${isDarkTheme 
                      ? 'text-white/90 hover:text-white' 
                      : 'text-black/70 hover:text-black'
                    }
                  `}
                  style={{
                    background: isHoveredOrActive 
                      ? isDarkTheme
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
                      -bottom-1 left-1/2 transform -translate-x-1/2
                      w-1 h-1 rounded-full transition-all duration-300
                      ${isDarkTheme ? 'bg-white/60' : 'bg-black/40'}
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
              background: isDarkTheme 
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
            ${isDarkTheme 
              ? 'bg-black/60 text-white border-white/20' 
              : 'bg-white/80 text-black border-black/10'
            }
          `}
          style={{
            minWidth: 'max-content',
            boxShadow: isDarkTheme
              ? '0 4px 16px rgba(0,0,0,0.4)'
              : '0 4px 16px rgba(0,0,0,0.15)',
            top: hoveredRect.top - 12,
            left: hoveredRect.left + (hoveredRect.width / 2),
            transform: 'translate(-50%, -100%)',
          }}
          role="tooltip"
        >
          {dockItems.find(i => i.id === hoveredItem)?.label}
          <div
            className={`
              absolute
              border-transparent
              top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4
              ${isDarkTheme
                ? 'border-t-black/60'
                : 'border-t-white/80'
              }
            `}
          />
        </div>
      )}
    </>
  );
};

export default GlassDock;
