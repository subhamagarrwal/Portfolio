import { ThemeProvider } from '@/components/ThemeProvider';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ExtracurricularsSection } from '@/components/ExtracurricularsSection';
import { ContactSection } from '@/components/ContactSection';
import { HeroSectionDay } from '@/components/HeroSectionDay';
import { AboutSectionDay } from '@/components/AboutSectionDay';
import { SkillsSectionDay } from '@/components/SkillsSectionDay';
import { ProjectsSectionDay } from '@/components/ProjectsSectionDay';
import { ExperienceSectionDay } from '@/components/ExperienceSectionDay';
import { ExtracurricularsSectionDay } from '@/components/ExtracurricularsSectionDay';
import { ContactSectionDay } from '@/components/ContactSectionDay';
import { GlassDock } from '@/components/GlassDock';
import { StructuredData } from '@/components/StructuredData';
import { useTimeTheme } from '@/hooks/useTimeTheme';

const Index = () => {
  const { isDayOrAfternoon } = useTimeTheme();
  const isDayTime = isDayOrAfternoon();

  return (
    <ThemeProvider>
      <StructuredData />
      <div className="relative z-10">
        <main>
          {isDayTime ? <HeroSectionDay /> : <HeroSection />}
          {isDayTime ? <AboutSectionDay /> : <AboutSection />}
          {isDayTime ? <SkillsSectionDay /> : <SkillsSection />}
          {isDayTime ? <ExperienceSectionDay /> : <ExperienceSection />}
          {isDayTime ? <ProjectsSectionDay /> : <ProjectsSection />}
          {isDayTime ? <ExtracurricularsSectionDay /> : <ExtracurricularsSection />}
          {isDayTime ? <ContactSectionDay /> : <ContactSection />}
        </main>

        <footer className="py-8 text-center opacity-70">
          <p>© Subham Agarwal, {new Date().getFullYear()}.Never Quit</p>
        </footer>
        
        {/* Glass Dock - Apple-inspired navigation */}
        <GlassDock />
      </div>
    </ThemeProvider>
  );
};

export default Index;
