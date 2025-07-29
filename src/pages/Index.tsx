import { ThemeProvider } from '@/components/ThemeProvider';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ExtracurricularsSection } from '@/components/ExtracurricularsSection';
import { ContactSection } from '@/components/ContactSection';
import { GlassDock } from '@/components/GlassDock';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="relative z-10">
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
        
        {/* Glass Dock - Apple-inspired navigation */}
        <GlassDock />
      </div>
    </ThemeProvider>
  );
};

export default Index;
