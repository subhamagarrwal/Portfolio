import { useState, useEffect } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { Card } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';
import { palettes } from '@/constants/palettes';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 11.5c2.5-1.5 6-1.5 8.5 0"></path>
    <path d="M9 15c2-1 4.5-1 6.5 0"></path>
    <path d="M7 8c3.5-2 8-2 11.5 0"></path>
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

  // Mock state for music playing detection
  // In a real scenario, this could be tied to the Spotify API, Lanyard API, or a Web Audio API listener
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    // For demonstration, simulating music playing detection after 3 seconds
    const timer = setTimeout(() => setIsMusicPlaying(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getThemePrimaryColor = () => {
    switch (effectiveTheme) {
      case 'dawn':
      case 'preDawn': return palettes.preDawn.bottom; // #3a2845
      case 'sunrise': return palettes.sunrise.bottom; // #e07b53
      case 'morning':
      case 'bright_day':
      case 'day': return palettes.morning.top; // #4f83c4
      case 'noon':
      case 'warm_day': return palettes.noon.top; // #2074d4
      case 'afternoon': return palettes.afternoon.top; // #3876be
      case 'sunset': return palettes.sunset.bottom; // #ff4d00
      case 'dusk':
      case 'twilight': return palettes.dusk.bottom; // #6e2030
      case 'night':
      default: return '#7c3aed'; // Violet fallback
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
    <section id="home" className={`min-h-screen flex items-center justify-center px-6 ${timeBasedClass}`}>
      <div className="text-center max-w-4xl mx-auto">
        <FadeIn delay={0.2}>
          {/* Text Container */}
          <div className={`
            mb-8 transition-all duration-1000
            ${!isLightMode ? 'synthwave-text-glow' : ''}
            ${textClass}
          `}>
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-colors duration-300 ${textClass}`}>
              {personal.name}
            </h1>
            <p className={`text-xl md:text-2xl mb-8 transition-colors duration-300 ${textClass}`}>
              {personal.title}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            style={{ '--theme-color': primaryColor } as React.CSSProperties}
          >
            <Button
              onClick={() => scrollToSection('projects')}
              className={`
                px-8 py-3 rounded-full font-semibold transition-all duration-300 
                bg-[var(--theme-color)] hover:opacity-80 text-white border-2 border-[var(--theme-color)]
              `}
            >
              View My Work
            </Button>
            <Button
              onClick={downloadResume}
              className={`
                px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2
                bg-transparent border-2 border-[var(--theme-color)] text-white hover:bg-[var(--theme-color)] hover:text-white
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
              className={`group p-3 rounded-full transition-all duration-300 text-current`}
            >
              <XIcon className="w-6 h-6 transition-colors duration-300 group-hover:text-[var(--theme-color)]" />
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-3 rounded-full transition-all duration-300 text-current`}
            >
              <Github className="w-6 h-6 transition-colors duration-300 group-hover:text-[var(--theme-color)]" />
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-3 rounded-full transition-all duration-300 text-current`}
            >
              <Linkedin className="w-6 h-6 transition-colors duration-300 group-hover:text-[var(--theme-color)]" />
            </a>
            <a
              href={`mailto:${personal.email}`}
              className={`group p-3 rounded-full transition-all duration-300 text-current`}
            >
              <Mail className="w-6 h-6 transition-colors duration-300 group-hover:text-[var(--theme-color)]" />
            </a>
            {personal.spotify && (
              <a
                href={personal.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-3 rounded-full transition-all duration-300 text-current`}
              >
                <div className={`${isMusicPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                  <SpotifyIcon className="w-6 h-6 transition-colors duration-300 group-hover:text-[var(--theme-color)]" />
                </div>
              </a>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.8}>
          <div className="mt-8 max-w-3xl mx-auto">
            <h2 className={`text-2xl font-bold text-center mb-6 transition-colors duration-300 ${!isLightMode ? 'synthwave-text-glow' : ''} ${textClass}`}>
              About Me
            </h2>
            <Card className={`p-8 transition-all duration-300 ${!isLightMode ? 'synthwave-glow' : ''} ${isLightMode ? 'bg-white/30 border-white/40 backdrop-blur-sm liquid-glass-card' : 'bg-white/10 border-white/20 backdrop-blur-sm liquid-glass-card'}`}>
              <div className="space-y-6">
                {portfolioData.personal.about.map((paragraph, index) => (
                  <p key={index} className={`text-base md:text-lg leading-relaxed text-center transition-colors duration-300 ${textClass}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
