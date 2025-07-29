import { useEffect } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Navigation } from '@/components/Navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ExtracurricularsSection } from '@/components/ExtracurricularsSection';
import { ContactSection } from '@/components/ContactSection';

const Index = () => {
  const { theme } = useTimeTheme();

  useEffect(() => {
    // Apply the theme class to the body
    const body = document.body;
    body.className = `bg-${theme}`;
  }, [theme]);

  return (
    <div className={`min-h-screen bg-${theme}`}>
      <Navigation />
      <ThemeToggle />
      
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ExtracurricularsSection />
        <ContactSection />
      </main>

      <footer className={`
        py-8 text-center transition-colors duration-300
        ${theme === 'night' || theme === 'evening'
          ? 'text-night-text/70' 
          : `text-${theme}-text/70`
        }
      `}>
        <p>© 2024 Your Name. Built with React, TypeScript, and ❤️</p>
      </footer>
    </div>
  );
};

export default Index;
