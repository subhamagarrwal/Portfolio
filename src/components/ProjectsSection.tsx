import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Button } from '@/components/ui/button';
import portfolioData from '@/data/portfolio.json';
import { ProjectCard } from './ProjectCard';
import { MobileProjectCarousel } from './MobileProjectCarousel';
import { FadeIn } from '@/components/ui/FadeIn';
import { palettes } from '@/constants/palettes';

export const ProjectsSection = () => {
  const {
    effectiveTheme,
    getTextClass,
    isDayOrAfternoon,
    getTimeBasedClass
  } = useTimeTheme();

  const { projects } = portfolioData;
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();
  const timeBasedClass = getTimeBasedClass();

  const getThemePrimaryColor = () => {
    switch (effectiveTheme) {
      case 'dawn':
      case 'preDawn': return palettes.preDawn.bottom;
      case 'sunrise': return palettes.sunrise.bottom;
      case 'morning':
      case 'bright_day':
      case 'day': return palettes.morning.top;
      case 'noon':
      case 'warm_day': return palettes.noon.top;
      case 'afternoon': return palettes.afternoon.top;
      case 'sunset': return palettes.sunset.bottom;
      case 'dusk':
      case 'twilight': return palettes.dusk.bottom;
      case 'night':
      default: return '#7c3aed';
    }
  };

  const primaryColor = getThemePrimaryColor();

  return (
    <section id="projects" className={`py-20 px-6 ${!isLightMode ? timeBasedClass : ''}`}>
      <div 
        className="container mx-auto max-w-6xl"
        style={{ '--theme-color': primaryColor } as React.CSSProperties}
      >
        <FadeIn delay={0.2} className="hidden lg:block">
          <h2 className={`text-4xl font-bold text-center mb-12 transition-colors duration-300 ${!isLightMode ? '' : ''} ${textClass}`}>
            Featured Projects
          </h2>
        </FadeIn>

        {/* Desktop/Laptop View */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <FadeIn key={project.id} delay={0.3 + index * 0.1}>
              <ProjectCard
                project={project}
                index={index}
                totalProjects={projects.length}
                isLightMode={isLightMode}
                textClass={textClass}
              />
            </FadeIn>
          ))}
        </div>

        {/* Mobile/Tablet View Carousel */}
        <MobileProjectCarousel
          projects={projects}
          isLightMode={isLightMode}
          textClass={textClass}
        />

        <FadeIn delay={0.8}>
          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              className={`px-8 py-3 transition-all duration-300 bg-transparent border-2 border-[var(--theme-color)] text-[var(--theme-color)] hover:bg-[var(--theme-color)] hover:text-white ${ 
                !isLightMode ? 'hover:shadow-[0_0_15px_var(--theme-color)]' : ''
              }`}
            >
              <a href={portfolioData.personal.github} target="_blank" rel="noopener noreferrer">
                View All Projects
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
