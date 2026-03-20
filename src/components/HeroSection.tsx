import { useState, useEffect } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Button } from '@/components/ui/button';
import Github from 'lucide-react/dist/esm/icons/github';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Download from 'lucide-react/dist/esm/icons/download';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import { FadeIn } from '@/components/ui/FadeIn';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import portfolioData from '@/data/portfolio.json';
import { palettes } from '@/constants/palettes';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

export const HeroSection = () => {
  const { 
    effectiveTheme, 
    isDarkModeOverride, 
    getTextClass, 
    isDayOrAfternoon,
    getTimeBasedClass
  } = useTimeTheme();
  
  // Get the appropriate text class and time-based class
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();
  const timeBasedClass = getTimeBasedClass();
  const { personal } = portfolioData;

  const [spotifyData, setSpotifyData] = useState<{ isPlaying: boolean; title?: string; artist?: string; albumImageUrl?: string; songUrl?: string } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Defer the Spotify fetch until after the page has fully loaded to not block LCP
    const initSpotify = () => {
      const fetchSpotify = async () => {
        try {
          const res = await fetch('/api/spotify/now-playing');
          const data = await res.json();
          setSpotifyData(data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchSpotify();
      interval = setInterval(fetchSpotify, 20000); // Also reduced ping rate from 2s to 20s to save CPU
    };

    if (document.readyState === 'complete') {
      setTimeout(initSpotify, 1000);
    } else {
      window.addEventListener('load', () => setTimeout(initSpotify, 1000), { once: true });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const isMusicPlaying = spotifyData?.isPlaying;

  const getThemePrimaryColor = () => {
    switch (effectiveTheme) {
      case 'dawn':
      case 'preDawn': return '#a78bfa'; // #3a2845
      case 'sunrise': return palettes.sunrise.bottom; // #e07b53
      case 'morning':
      case 'bright_day':
      case 'day': return '#1d4ed8'; // #4f83c4
      case 'noon':
      case 'warm_day': return palettes.noon.top; // #2074d4
      case 'afternoon': return palettes.afternoon.top; // #3876be
      case 'sunset': return palettes.sunset.bottom; // #ff4d00
      case 'dusk':
      case 'twilight': return palettes.dusk.bottom; // #6e2030
      case 'night':
      default: return '#ffffff'; // White fallback
    }
  };

  const primaryColor = getThemePrimaryColor();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadResume = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = personal.resume;
    link.download = 'SubhamAgarwal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className={`min-h-screen pt-24 pb-24 md:py-0 flex items-center justify-center px-6 ${timeBasedClass}`}>
      <div className="text-center max-w-4xl mx-auto">
        <FadeIn delay={0.2}>
          {/* Text Container */}
          <div className={`
            mb-8 transition-all duration-1000
            ${!isLightMode ? '' : ''}
            ${textClass}
          `}>
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-colors duration-300 ${textClass}`}>
              {personal.name}
            </h1>
            <p className={`text-xl md:text-2xl mb-4 transition-colors duration-300 ${textClass}`}>
              {personal.title}
            </p>
            <div className={`flex items-center justify-center gap-2 text-sm md:text-base font-medium opacity-80 mb-8 transition-colors duration-300 ${textClass}`}>
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[var(--theme-color)]" style={{ color: primaryColor }} />
              <span>Vellore, Tamil Nadu, <span className="opacity-75">India</span></span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            style={{ 
              '--theme-color': primaryColor,
              '--btn-text-color': primaryColor === '#ffffff' ? '#000000' : '#ffffff'
            } as React.CSSProperties}
          >
            <Button
              onClick={() => scrollToSection('projects')}
              className={`
                px-8 py-3 rounded-full font-semibold transition-all duration-300
                ${primaryColor === '#ffffff'
                  ? 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black shadow-[0_0_10px_rgba(255,255,255,0.5)] shadow-white/30'
                  : `bg-[var(--theme-color)] hover:opacity-80 text-[var(--btn-text-color)] border-2 border-[var(--theme-color)] ${!isLightMode ? 'shadow-[0_0_10px_var(--theme-color)]' : ''}`
                }
              `}
            >
              View My Work
            </Button>
            <Button
              onClick={downloadResume}
              className={`
                px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2
                ${primaryColor === '#ffffff'
                  ? 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                  : `bg-transparent border-2 border-[var(--theme-color)] text-white hover:bg-[var(--theme-color)] hover:text-[var(--btn-text-color)] ${!isLightMode ? 'hover:shadow-[0_0_15px_var(--theme-color)]' : ''}`
                }
              `}
            >
              <Download className="w-4 h-4" />
              Download Resume
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div 
            className="flex justify-center space-x-6 mb-12"
            style={{ '--theme-color': primaryColor } as React.CSSProperties}
          >
            <a
              href={personal.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter) Profile"
              className={`group p-3 rounded-full transition-all duration-300 text-[var(--theme-color)] hover:opacity-80`}
            >
              <XIcon className="w-6 h-6" />
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className={`group p-3 rounded-full transition-all duration-300 text-[var(--theme-color)] hover:opacity-80`}
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className={`group p-3 rounded-full transition-all duration-300 text-[var(--theme-color)] hover:opacity-80`}
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href={`mailto:${personal.email}`}
              aria-label="Send an Email"
              className={`group p-3 rounded-full transition-all duration-300 text-[var(--theme-color)] hover:opacity-80`}
            >
              <Mail className="w-6 h-6" />
            </a>
            {personal.spotify && isMusicPlaying ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button aria-label="Spotify Now Playing" className={`group p-3 rounded-full transition-all duration-300 text-[var(--theme-color)] hover:opacity-80`}>
                    <div className="animate-[spin_4s_linear_infinite]">
                      <SpotifyIcon className="w-6 h-6" />
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 border-white/10 bg-[#121212]/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl mb-4 border" sideOffset={12}>
                  <a href={spotifyData.songUrl} target="_blank" rel="noopener noreferrer" aria-label="Listen on Spotify" className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors">
                    {spotifyData?.albumImageUrl && (
                      <img src={spotifyData.albumImageUrl} alt={spotifyData?.album} className="w-14 h-14 rounded-md object-cover shadow-sm" />
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{spotifyData?.title}</p>
                      <p className="text-xs text-gray-400 truncate">{spotifyData?.artist}</p>
                    </div>
                  </a>
                </PopoverContent>
              </Popover>
            ) : personal.spotify ? (
              <a
                href={personal.spotify}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Spotify Profile"
                className={`group p-3 rounded-full transition-all duration-300 text-[var(--theme-color)] hover:opacity-80`}
              >
                <div>
                  <SpotifyIcon className="w-6 h-6" />
                </div>
              </a>
            ) : null}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
