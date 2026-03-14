import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Button } from '@/components/ui/button';
import portfolioData from '@/data/portfolio.json';
import { ProjectCard } from './ProjectCard';
import { FadeIn } from '@/components/ui/FadeIn';

export const ProjectsSection = () => {
  const {
    getTextClass,
    isDayOrAfternoon,
    getTimeBasedClass
  } = useTimeTheme();

  const { projects } = portfolioData;
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();
  const timeBasedClass = getTimeBasedClass();

  return (
    <section id="projects" className={`py-20 px-6 ${!isLightMode ? timeBasedClass : ''}`}>
      <div className="container mx-auto max-w-6xl">
        <FadeIn delay={0.2}>
          <h2 className={`text-4xl font-bold text-center mb-12 transition-colors duration-300 ${!isLightMode ? 'synthwave-text-glow' : ''} ${textClass}`}>
            Featured Projects
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-8">
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

        <FadeIn delay={0.8}>
          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              className={`px-8 py-3 transition-all duration-300 ${textClass} ${
                isLightMode
                  ? 'border-blue-400 hover:bg-blue-500/20'
                  : 'liquid-glass-button border-white/40 hover:bg-white/10'
              }`}
            >
              <a href="https://github.com/subhamagarrwal" target="_blank" rel="noopener noreferrer">
                View All Projects
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
