import { useState, useEffect, useRef } from 'react';
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

  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [isTouchHovered, setIsTouchHovered] = useState(false);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Only apply this logic for touch interactions
      if (e.pointerType !== 'touch') return;
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      // Check if current touch coordinates are strictly inside the button's bounding box
      const isInside = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      
      setIsTouchHovered(isInside);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        setIsTouchHovered(false);
      }
    };

    const resetState = () => setIsTouchHovered(false);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('blur', resetState);
    document.addEventListener('visibilitychange', resetState);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('blur', resetState);
      document.removeEventListener('visibilitychange', resetState);
    };
  }, []);

  const getThemePrimaryColor = () => {
    switch (effectiveTheme) {
      case 'dawn':
      case 'preDawn': return '#a78bfa';
      case 'sunrise': return palettes.sunrise.bottom;
      case 'morning':
      case 'bright_day':
      case 'day': return '#1d4ed8';
      case 'noon':
      case 'warm_day': return palettes.noon.top;
      case 'afternoon': return palettes.afternoon.top;
      case 'sunset': return palettes.sunset.bottom;
      case 'dusk':
      case 'twilight': return palettes.dusk.bottom;
      case 'night':
      default: return '#ffffff';
    }
  };

  const primaryColor = getThemePrimaryColor();

  return (
    <section id="projects" className={`py-20 px-6 ${!isLightMode ? timeBasedClass : ''}`}>
      <div 
        className="container mx-auto max-w-6xl"
        style={{ 
          '--theme-color': primaryColor,
          '--btn-text-color': primaryColor === '#ffffff' ? '#000000' : '#ffffff'
        } as React.CSSProperties}
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

        <FadeIn delay={0.8} className="text-center mt-12">
          <div className="relative inline-block group">
            <Button
              asChild
              variant="outline"
              className={`
                relative px-8 py-3 transition-all duration-300 border-2 rounded-xl
                select-none outline-none focus:outline-none overflow-hidden
                border-[var(--theme-color)] text-[var(--theme-color)] hover:text-[var(--btn-text-color)]
                ${
                  !isLightMode ? 'hover:shadow-[0_0_15px_var(--theme-color)]' : ''
                }
                ${isTouchHovered ? 'scale-105 shadow-lg text-[var(--btn-text-color)]' : 'bg-transparent hover:bg-[var(--theme-color)]'}
              `}
              style={{
                background: isTouchHovered 
                  ? 'var(--theme-color)' 
                  : undefined,
              }}
            >
              <a
                ref={buttonRef}
                href={portfolioData.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsTouchHovered(false)}
              >
                View All Projects
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
