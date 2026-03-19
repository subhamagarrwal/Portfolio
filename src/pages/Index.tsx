import { ThemeProvider } from '@/components/ThemeProvider';
import { StructuredData } from '@/components/StructuredData';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { JourneySection } from '@/components/JourneySection';
import { ContactSection } from '@/components/ContactSection';
import { GlassDock } from '@/components/GlassDock';

const Index = () => {
  return (
    <ThemeProvider>
      <StructuredData />
      <div className="relative z-10">
        <main>
          <HeroSection />
          <AboutSection />
          <JourneySection />
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </main>

        <footer className="py-8 text-center opacity-70">
          <p className='text-white'>© Subham Agarwal, {new Date().getFullYear()}.</p>
        </footer>

        {/* Glass Dock - Apple-inspired navigation */}
        <GlassDock />
      </div>
    </ThemeProvider>
  );
};

export default Index;
