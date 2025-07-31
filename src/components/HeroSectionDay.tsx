import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react';

export const HeroSectionDay = () => {
  const { 
    effectiveTheme, 
    isDarkModeOverride, 
    getTextClass, 
    isDayOrAfternoon
  } = useTimeTheme();
  
  // Get the appropriate text class
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadResume = () => {
    // Redirect to LinkedIn resume viewer
    window.open('https://www.linkedin.com/in/subham-agarwal-99386222a/overlay/1753651974026/single-media-viewer/?profileId=ACoAADlveP8BRsu5ziJGWEV8wGvjt5jzC-n9Q0I', '_blank');
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-4xl mx-auto">
        {/* Simplified text without liquid glass container */}
        <div className="mb-8">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-colors duration-300 ${textClass}`}>
            Subham Agarwal
          </h1>
          <p className={`text-xl md:text-2xl mb-12 transition-colors duration-300 ${textClass}`}>
            Full Stack Developer & Creative Technologist
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={() => scrollToSection('projects')}
            className={`
              px-8 py-3 rounded-full font-semibold transition-all duration-300 
              ${isLightMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}
            `}
          >
            View My Work
          </Button>
          <Button
            onClick={downloadResume}
            className={`
              px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2
              ${isLightMode ? 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white' : 'bg-transparent border-2 border-purple-500 text-white hover:bg-purple-500'}
            `}
          >
            <Download className="w-4 h-4" />
            Download Resume
          </Button>
        </div>

        <div className="flex justify-center space-x-6 mb-12">
          <a
            href="https://github.com/subhamagarrwal"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              p-3 rounded-full transition-all duration-300 
              ${isLightMode ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'text-white hover:text-purple-400'}
            `}
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/subham-agarwal-99386222a/"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              p-3 rounded-full transition-all duration-300 
              ${isLightMode ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'text-white hover:text-purple-400'}
            `}
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="mailto:subhamag2003@gmail.com"
            className={`
              p-3 rounded-full transition-all duration-300 
              ${isLightMode ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'text-white hover:text-purple-400'}
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
