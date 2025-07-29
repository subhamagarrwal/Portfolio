import { ThemeProvider } from '@/components/ThemeProvider';
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
  return (
    <ThemeProvider>
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

      <footer className="py-8 text-center opacity-70">
        <p>© 2024 Your Name. Built with React, TypeScript, and ❤️</p>
      </footer>
    </ThemeProvider>
  );
};

export default Index;
