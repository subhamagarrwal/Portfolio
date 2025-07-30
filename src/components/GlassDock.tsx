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
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Dynamic icon size based on screen size
  const getIconSize = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 360) return 16;
      if (window.innerWidth <= 480) return 18;
      if (window.innerWidth <= 768) return 20;
    }
    return 24;
  };
  
  const iconSize = getIconSize();

  // Initialize audio element
  useEffect(() => {
    const initializeAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadstart', () => {});
        audioRef.current.removeEventListener('canplay', () => {});
        audioRef.current.removeEventListener('error', () => {});
      }

      // Alternative streaming sources that are more reliable
      const streams = {
        synthwave: [
          'https://streams.fluxfm.de/80s80s/mp3-320/streams.fluxfm.de/', // 80s music with synthwave
          'https://ice1.somafm.com/spacestation-128-mp3', // SomaFM Space Station
          'https://streams.radiobrowser.info/29e1fa9e-00ad-4c3e-b3da-c82dc7b7b0e6' // Synthwave24.com
        ],
        lofi: [
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/', // ChillHop
          'https://ice1.somafm.com/dronezone-128-mp3', // SomaFM Drone Zone
          'https://streams.radiobrowser.info/50e8ac7b-74fc-4a19-80ad-e9b69da6fea9' // LoFi Hip Hop
        ]
      };

      const currentStreams = streams[musicMode];
      let streamIndex = 0;

      const tryNextStream = () => {
        if (streamIndex >= currentStreams.length) {
          console.error('All streams failed for', musicMode);
          setIsLoading(false);
          return;
        }

        const streamUrl = currentStreams[streamIndex];
        console.log(`Trying ${musicMode} stream ${streamIndex + 1}:`, streamUrl);

        audioRef.current = new Audio();
        audioRef.current.crossOrigin = 'anonymous';
        audioRef.current.src = streamUrl;
        audioRef.current.volume = 0.3;
        audioRef.current.preload = 'metadata';
        
        // Handle audio events
        const handleLoadStart = () => {
          console.log(`Loading ${musicMode} stream...`);
          setIsLoading(true);
        };
        
        const handleCanPlay = () => {
          console.log(`${musicMode} stream ready to play`);
          setIsLoading(false);
        };
        
        const handleError = (e) => {
          console.error(`${musicMode} stream ${streamIndex + 1} failed:`, e);
          streamIndex++;
          setTimeout(tryNextStream, 1000); // Try next stream after 1 second
        };
        
        audioRef.current.addEventListener('loadstart', handleLoadStart);
        audioRef.current.addEventListener('canplay', handleCanPlay);
        audioRef.current.addEventListener('canplaythrough', handleCanPlay);
        audioRef.current.addEventListener('error', handleError);
        audioRef.current.addEventListener('stalled', () => {
          console.log('Stream stalled, trying next...');
          streamIndex++;
          tryNextStream();
        });
      };

      tryNextStream();
    };

    initializeAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [musicMode]); // Re-initialize when music mode changes

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleMute = async () => {
    if (!audioRef.current) {
      console.error('Audio element not initialized');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isMuted) {
        console.log(`Attempting to play ${musicMode} stream...`);
        
        // Check if audio is ready
        if (audioRef.current.readyState === 0) {
          console.log('Loading audio first...');
          audioRef.current.load();
          
          // Wait for audio to be ready
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);
            
            const onCanPlay = () => {
              clearTimeout(timeout);
              audioRef.current?.removeEventListener('canplay', onCanPlay);
              audioRef.current?.removeEventListener('error', onError);
              resolve(true);
            };
            
            const onError = (e) => {
              clearTimeout(timeout);
              audioRef.current?.removeEventListener('canplay', onCanPlay);
              audioRef.current?.removeEventListener('error', onError);
              reject(e);
            };
            
            audioRef.current?.addEventListener('canplay', onCanPlay);
            audioRef.current?.addEventListener('error', onError);
          });
        }
        
        // Start playing
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log(`${musicMode} stream started successfully`);
          setIsMuted(false);
        }
      } else {
        // Pause
        audioRef.current.pause();
        console.log(`${musicMode} stream paused`);
        setIsMuted(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      
      // Show user-friendly error handling
      if (error.name === 'NotAllowedError') {
        console.log('Autoplay blocked - user interaction required');
        // For autoplay restrictions, we still toggle the state
        // The user can try clicking again
        setIsMuted(!isMuted);
      } else if (error.name === 'NotSupportedError') {
        console.log('Audio format not supported, trying alternative...');
        // Try alternative stream format
        if (audioRef.current) {
          audioRef.current.src = musicMode === 'synthwave'
            ? 'https://somafm.com/spacestation.pls' // Try PLS format
            : 'https://somafm.com/dronezone.pls';
        }
      } else {
        console.log('Playback failed, stream may be unavailable');
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
            fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl
            backdrop-blur-xl backdrop-saturate-150 border transition-all duration-300
            touch-manipulation select-none
            md:top-6 md:left-6 md:px-4
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
          <ArrowLeft size={iconSize} className="md:w-5 md:h-5" />
          <span className="text-xs md:text-sm font-medium">Back</span>
        </button>

        {/* Time Slider Dock */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 md:bottom-6 md:px-0">
          <div 
            className={`
              relative flex flex-col items-center px-4 py-3 rounded-2xl max-w-[calc(100vw-32px)]
              backdrop-blur-xl backdrop-saturate-150
              border shadow-2xl transition-all duration-300
              md:px-6 md:py-4
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
                value={manualTime}
                onChange={(e) => handleTimeChange(parseInt(e.target.value))}
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
      icon: <Home size={iconSize} />,
      label: 'Home',
      onClick: () => scrollToSection('home'),
    },
    {
      id: 'skills',
      icon: <Code2 size={iconSize} />,
      label: 'Skills',
      onClick: () => scrollToSection('skills'),
    },
    {
      id: 'projects',
      icon: <FolderOpen size={iconSize} />,
      label: 'Projects',
      onClick: () => scrollToSection('projects'),
    },
    {
      id: 'experience',
      icon: <Briefcase size={iconSize} />,
      label: 'Experience',
      onClick: () => scrollToSection('experience'),
    },
    {
      id: 'activities',
      icon: <Users size={iconSize} />,
      label: 'Activities',
      onClick: () => scrollToSection('extracurriculars'),
    },
    {
      id: 'contact',
      icon: <Mail size={iconSize} />,
      label: 'Contact',
      onClick: () => scrollToSection('contact'),
    },
    // Only show time control when in automatic mode
    ...(isAutoMode ? [{
      id: 'time-control',
      icon: <Settings size={iconSize} />,
      label: 'Time Control',
      onClick: () => setIsTimeSliderMode(true),
    }] : []),
    {
      id: 'theme',
      icon: isAutoMode ? <Clock size={iconSize} /> : <Moon size={iconSize} />,
      label: isAutoMode ? 'Night Mode' : 'Auto Mode',
      onClick: toggleDarkMode,
    },
    {
      id: 'music-mode',
      icon: (
        <div className="relative">
          <Radio size={iconSize} />
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
          <Volume2 size={iconSize} className="opacity-50" />
        </div>
      ) : isMuted ? (
        <VolumeX size={iconSize} />
      ) : (
        <Volume2 size={iconSize} />
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
                if (window.matchMedia('(hover: hover)').matches) {
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
  );
};

export default GlassDock;
