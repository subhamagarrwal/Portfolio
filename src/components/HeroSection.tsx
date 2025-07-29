import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

export const HeroSection = () => {
  const { effectiveTheme, isDarkModeOverride } = useTimeTheme();
  
  // For visual effects like glow, only use dark mode override
  // For color themes, use the effective theme
  const isVisualDarkMode = isDarkModeOverride;

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
          <h1 className={`
            text-5xl md:text-7xl font-bold mb-6 transition-colors duration-300
            ${isVisualDarkMode 
              ? 'text-night-text' 
              : `text-${effectiveTheme}-text`
            }
          `}>
            Your Name
          </h1>
          <p className={`
            text-xl md:text-2xl mb-8 transition-colors duration-300
            ${isVisualDarkMode 
              ? 'text-night-text/80' 
              : `text-${effectiveTheme}-text/80`
            }
          `}>
            Full Stack Developer & Creative Technologist
          </p>
          <p className={`
            text-lg max-w-2xl mx-auto mb-12 transition-colors duration-300
            ${isVisualDarkMode 
              ? 'text-night-text/70' 
              : `text-${effectiveTheme}-text/70`
            }
          `}>
            Passionate about creating innovative web applications that solve real-world problems. 
            Currently pursuing Computer Science with a focus on modern web technologies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={() => scrollToSection('projects')}
            className={`
              px-8 py-3 rounded-full font-semibold transition-all duration-300
              ${isVisualDarkMode 
                ? 'bg-night-accent hover:bg-night-accent/80 text-white synthwave-glow' 
                : `bg-${effectiveTheme}-accent hover:bg-${effectiveTheme}-accent/80 text-white`
              }
            `}
          >
            View My Work
          </Button>
          <Button
            onClick={() => scrollToSection('contact')}
            variant="outline"
            className={`
              px-8 py-3 rounded-full font-semibold transition-all duration-300
              ${isVisualDarkMode 
                ? 'border-night-border text-night-text hover:bg-night-card' 
                : `border-${effectiveTheme}-border text-${effectiveTheme}-text hover:bg-${effectiveTheme}-card`
              }
            `}
          >
            Get In Touch
          </Button>
        </div>

        <div className="flex justify-center space-x-6 mb-12">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              p-3 rounded-full transition-all duration-300
              ${isVisualDarkMode 
                ? 'text-night-text hover:text-night-accent hover:bg-night-card' 
                : `text-${effectiveTheme}-text hover:text-${effectiveTheme}-accent hover:bg-${effectiveTheme}-card`
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
              p-3 rounded-full transition-all duration-300
              ${isVisualDarkMode 
                ? 'text-night-text hover:text-night-accent hover:bg-night-card' 
                : `text-${effectiveTheme}-text hover:text-${effectiveTheme}-accent hover:bg-${effectiveTheme}-card`
              }
            `}
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="mailto:your.email@example.com"
            className={`
              p-3 rounded-full transition-all duration-300
              ${isVisualDarkMode 
                ? 'text-night-text hover:text-night-accent hover:bg-night-card' 
                : `text-${effectiveTheme}-text hover:text-${effectiveTheme}-accent hover:bg-${effectiveTheme}-card`
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