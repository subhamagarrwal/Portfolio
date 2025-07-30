import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

export const HeroSection = () => {
  const { 
    effectiveTheme, 
    isDarkModeOverride, 
    getTextClass, 
    shouldShowGlow,
    isDayOrAfternoon 
  } = useTimeTheme();
  
  // Get the appropriate text class
  const textClass = getTextClass();
  const showGlow = shouldShowGlow();
  const isLightMode = isDayOrAfternoon();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-4xl mx-auto">
        {/* Text Container with optional liquid glass effect for light mode */}
        <div className={`
          mb-8 transition-all duration-1000
          ${isLightMode ? 'liquid-glass-text-container' : ''}
          ${showGlow ? 'synthwave-text-glow' : ''}
          ${textClass}
        `}>
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-colors duration-300 ${textClass}`}>
            Subham Agarwal
          </h1>
          <p className={`text-xl md:text-2xl mb-8 transition-colors duration-300 ${textClass}`}>
            Full Stack Developer & Creative Technologist
          </p>
          <p className={`text-lg max-w-2xl mx-auto mb-12 transition-colors duration-300 ${textClass}`}>
            Passionate about creating innovative web applications that solve real-world problems. 
            Currently pursuing Computer Science with a focus on modern web technologies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={() => scrollToSection('projects')}
            className={`
              px-8 py-3 rounded-full font-semibold transition-all duration-300 
              ${isLightMode ? 'liquid-glass-button text-black' : 'bg-purple-600 hover:bg-purple-700 text-white'}
            `}
          >
            View My Work
          </Button>
          <Button
            onClick={() => scrollToSection('projects')}
            className={`
              px-8 py-3 rounded-full font-semibold transition-all duration-300 
              ${isLightMode ? 'liquid-glass-button text-black' : 'bg-transparent border-2 border-purple-500 text-white hover:bg-purple-500'}
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
              p-3 rounded-full transition-all duration-300 
              ${isLightMode ? 'liquid-glass-button text-black' : 'text-white hover:text-purple-400'}
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
              ${isLightMode ? 'liquid-glass-button text-black' : 'text-white hover:text-purple-400'}
            `}
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="mailto:your.email@example.com"
            className={`
              p-3 rounded-full transition-all duration-300 
              ${isLightMode ? 'liquid-glass-button text-black' : 'text-white hover:text-purple-400'}
            `}
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>

        <div className="animate-bounce">
          <ArrowDown 
            className={`
              w-8 h-8 mx-auto cursor-pointer transition-colors duration-300 ${textClass}
            `}
            onClick={() => scrollToSection('about')}
          />
        </div>
      </div>
    </section>
  );
};