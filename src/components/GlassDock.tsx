import { useState } from 'react';
import { 
  Code2, 
  FolderOpen, 
  Briefcase, 
  Users, 
  Volume2, 
  VolumeX,
  User,
  Mail,
  Sun,
  Moon,
  Home
} from 'lucide-react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import './GlassDock.css';

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const GlassDock = () => {
  const { isDarkModeOverride, toggleDarkMode } = useTimeTheme();
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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

  const dockItems: DockItem[] = [
    {
      id: 'home',
      icon: <Home size={24} />,
      label: 'Home',
      onClick: () => scrollToSection('home'),
    },
    {
      id: 'about',
      icon: <User size={24} />,
      label: 'About',
      onClick: () => scrollToSection('about'),
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
    {
      id: 'theme',
      icon: isDarkModeOverride ? <Sun size={24} /> : <Moon size={24} />,
      label: isDarkModeOverride ? 'Light Mode' : 'Dark Mode',
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
              {item.id === 'theme' && isDarkModeOverride && (
                <div 
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-white/50 animate-pulse"
                  aria-label="Dark mode active"
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
