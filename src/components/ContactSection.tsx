import { useState, useEffect } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Github, Linkedin, Mail } from 'lucide-react';
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

export const ContactSection = () => {
  const { getTextClass, isDayOrAfternoon, getTimeBasedClass, effectiveTheme } = useTimeTheme();
  
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();
  const timeBasedClass = getTimeBasedClass();
  const { personal } = portfolioData;

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMusicPlaying(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getThemePrimaryColor = () => {
    switch (effectiveTheme) {
      case 'dawn':
      case 'preDawn': return '#a78bfa';
      case 'sunrise': return palettes.sunrise.bottom;
      case 'morning':
      case 'bright_day':
      case 'day': return '#1d4ed8';
      case 'noon':
      case 'warm_day': return palettes.noon.top;
      case 'afternoon': return palettes.afternoon.top;
      case 'sunset': return palettes.sunset.bottom;
      case 'dusk':
      case 'twilight': return palettes.dusk.bottom;
      case 'night':
      case 'deep_night': return '#ffffff';
      default: return '#ffffff';
    }
  };

  const primaryColor = getThemePrimaryColor();

  return (
    <section id="contact" className={`pt-32 pb-24 md:pb-28 px-6 ${timeBasedClass}`}>
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className={`
          text-4xl md:text-5xl font-bold mb-16 transition-colors duration-300 ${!isLightMode ? '' : ''} ${textClass}
        `}>
          Get In Touch
        </h2>
        
        <div 
          className="flex justify-center flex-nowrap gap-3 sm:gap-6 md:gap-12"
          style={{ '--theme-color': primaryColor } as React.CSSProperties}
        >
          {personal.twitter && (
            <a
              href={personal.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-3 md:p-6 rounded-full transition-all duration-300 text-[var(--theme-color)] hover:opacity-80 hover:scale-110 drop-shadow-md`}
            >
              <XIcon className="w-8 h-8 md:w-12 md:h-12" />
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-3 md:p-6 rounded-full transition-all duration-300 text-[var(--theme-color)] hover:opacity-80 hover:scale-110 drop-shadow-md`}
            >
              <Github className="w-8 h-8 md:w-12 md:h-12" />
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-3 md:p-6 rounded-full transition-all duration-300 text-[var(--theme-color)] hover:opacity-80 hover:scale-110 drop-shadow-md`}
            >
              <Linkedin className="w-8 h-8 md:w-12 md:h-12" />
            </a>
          )}
          {personal.email && (
            <a
              href={`mailto:${personal.email}`}
              className={`group p-3 md:p-6 rounded-full transition-all duration-300 text-[var(--theme-color)] hover:opacity-80 hover:scale-110 drop-shadow-md`}
            >
              <Mail className="w-8 h-8 md:w-12 md:h-12" />
            </a>
          )}
          {personal.spotify && (
            <a
              href={personal.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-3 md:p-6 rounded-full transition-all duration-300 text-[var(--theme-color)] hover:opacity-80 hover:scale-110 drop-shadow-md`}
            >
              <div className={`${isMusicPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                <SpotifyIcon className="w-8 h-8 md:w-12 md:h-12" />
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
