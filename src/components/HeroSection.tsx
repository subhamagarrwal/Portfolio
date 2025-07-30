import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

export const HeroSection = () => {
  const { effectiveTheme, isDarkModeOverride } = useTimeTheme();
  
  // Only apply visual effects in dark mode override
  const isVisualDarkMode = isDarkModeOverride;
  
  // Check if it's day or afternoon for solid black text
  const isDayOrAfternoon = effectiveTheme === 'day' || effectiveTheme === 'afternoon';
  
  // More specific time-based black text - only during day and afternoon hours
  const currentHour = new Date().getHours();
  const isDayTime = currentHour >= 6 && currentHour < 12;    // 6 AM to 12 PM (morning/day)
  const isAfternoonTime = currentHour >= 12 && currentHour < 18; // 12 PM to 6 PM (afternoon)
  const shouldBeBlack = (isDayTime || isAfternoonTime) && !isVisualDarkMode;

  // Debug logging
  console.log('HeroSection Debug:', {
    effectiveTheme,
    isDarkModeOverride,
    isDayOrAfternoon,
    currentHour,
    isDayTime,
    isAfternoonTime,
    shouldBeBlack
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-4xl mx-auto">
        <div className={`
          mb-8 transition-all duration-1000
          ${isVisualDarkMode ? 'synthwave-text-glow' : ''}
        `}>
          <h1 
            className={`
              text-5xl md:text-7xl font-bold mb-6 transition-colors duration-300
              ${isVisualDarkMode 
                ? 'text-night-text synthwave-text-glow' 
                : shouldBeBlack
                  ? 'force-black-text'
                  : 'force-black-text'
              }
            `}
          >
            Subham Agarwal
          </h1>
          <p 
            className={`
              text-xl md:text-2xl mb-8 transition-colors duration-300
              ${isVisualDarkMode 
                ? 'text-night-text/80' 
                : shouldBeBlack
                  ? 'force-black-text'
                  : 'force-black-text'
              }
            `}
          >
            Full Stack Developer & Creative Technologist
          </p>
          <p 
            className={`
              text-lg max-w-2xl mx-auto mb-12 transition-colors duration-300
              ${isVisualDarkMode 
                ? 'text-night-text/70' 
                : shouldBeBlack
                  ? 'force-black-text'
                  : 'force-black-text'
              }
            `}
          >
            Passionate about creating innovative web applications that solve real-world problems. 
            Currently pursuing Computer Science with a focus on modern web technologies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={() => scrollToSection('projects')}
            className={`
              px-8 py-3 rounded-full font-semibold transition-all duration-300 grey-liquid-glass-button text-black
              ${isVisualDarkMode 
                ? 'synthwave-glow' 
                : ''
              }
            `}
          >
            View My Work
          </Button>
          <Button
            onClick={() => scrollToSection('projects')}
            className={`
              px-8 py-3 rounded-full font-semibold transition-all duration-300 grey-liquid-glass-button text-black
              ${isVisualDarkMode 
                ? 'synthwave-glow' 
                : ''
              }
            `}
          >
            Download Resume
          </Button>
        </div>

        <div className="flex justify-center space-x-6 mb-12">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              p-3 rounded-full transition-all duration-300 grey-liquid-glass-button text-black
              ${isVisualDarkMode 
                ? 'synthwave-glow' 
                : ''
              }
            `}
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              p-3 rounded-full transition-all duration-300 grey-liquid-glass-button text-black
              ${isVisualDarkMode 
                ? 'synthwave-glow' 
                : ''
              }
            `}
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="mailto:your.email@example.com"
            className={`
              p-3 rounded-full transition-all duration-300 grey-liquid-glass-button text-black
              ${isVisualDarkMode 
                ? 'synthwave-glow' 
                : ''
              }
            `}
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>

        <div className="animate-bounce">
          <ArrowDown 
            className={`
              w-8 h-8 mx-auto cursor-pointer transition-colors duration-300
              ${isVisualDarkMode 
                ? 'text-night-accent' 
                : shouldBeBlack
                  ? 'text-blue-600'
                  : `text-${effectiveTheme}-accent`
              }
            `}
            onClick={() => scrollToSection('about')}
          />
        </div>
      </div>
    </section>
  );
};