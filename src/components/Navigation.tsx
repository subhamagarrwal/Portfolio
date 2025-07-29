import { useState, useEffect } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'extracurriculars', label: 'Activities' },
  { id: 'contact', label: 'Contact' },
];

export const Navigation = () => {
  const { effectiveTheme, isDarkModeOverride } = useTimeTheme();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // For visual effects like glow and dark styling, only use dark mode override
  const isVisualDarkMode = isDarkModeOverride;

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-40 backdrop-blur-md transition-all duration-300
      ${isVisualDarkMode 
        ? 'bg-night-card/70 border-b border-night-border' 
        : 'bg-white/70 border-b border-morning-border'
      }
    `}>
      <div className="container mx-auto px-6 py-4">
        <ul className="flex justify-center space-x-8">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`
                  px-3 py-2 rounded-lg font-medium transition-all duration-300 relative
                  ${activeSection === item.id
                    ? isVisualDarkMode
                      ? 'text-night-accent synthwave-text-glow'
                      : `text-${effectiveTheme}-accent`
                    : isVisualDarkMode
                      ? 'text-night-text hover:text-night-accent'
                      : `text-${effectiveTheme}-text hover:text-${effectiveTheme}-accent`
                  }
                `}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className={`
                    absolute bottom-0 left-0 right-0 h-0.5 rounded-full
                    ${isVisualDarkMode 
                      ? 'bg-night-accent synthwave-glow' 
                      : `bg-${effectiveTheme}-accent`
                    }
                  `} />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};