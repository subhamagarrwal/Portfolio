import { memo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    image: string;
    techStack: string[];
    github?: string;
    demo?: string;
  };
  index: number;
  totalProjects: number;
  isLightMode: boolean;
  textClass: string;
}

export const ProjectCard = memo(({ project, index, totalProjects, isLightMode, textClass }: ProjectCardProps) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  return (
    <Card
      key={project.id}
      className={`
        group overflow-hidden transition-all duration-500 ${!isLightMode ? '' : ''}
        ${isLightMode
            ? 'bg-white/25 border-white/40 liquid-glass-card'
            : 'bg-white/15 border-white/25 liquid-glass-card'
        }
        ${totalProjects % 2 !== 0 && index === totalProjects - 1
          ? 'lg:col-span-2'
          : ''
        }
      `}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div 
        className={`
          h-48 bg-gradient-to-br transition-all duration-300 relative overflow-hidden
          ${isLightMode
            ? 'from-blue-500/20 to-purple-500/20'
            : 'from-blue-500/20 to-purple-500/20'
          }
        `}
        onMouseEnter={() => setIsOverlayVisible(true)}
        onMouseLeave={() => setIsOverlayVisible(false)}
        onClick={() => setIsOverlayVisible(!isOverlayVisible)}
      >
        <div className={`absolute inset-0 bg-black/70 transition-opacity duration-300 flex items-center justify-center gap-4 z-20 ${isOverlayVisible ? 'opacity-100' : 'opacity-0'}`}>
          {project.github ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className={`
                transition-all duration-300 pointer-events-auto
                bg-transparent border-2 border-[var(--theme-color)] text-white hover:bg-[var(--theme-color)] hover:text-white
                ${!isLightMode ? 'hover:shadow-[0_0_15px_var(--theme-color)]' : ''}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                Code
              </a>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="transition-all duration-300 bg-transparent border-2 border-gray-500 text-gray-400 cursor-not-allowed pointer-events-auto"
            >
              <Github className="w-4 h-4 mr-2" />
              Code
            </Button>
          )}

          {project.demo ? (
            <Button
              asChild
              size="sm"
              className={`
                transition-all duration-300 pointer-events-auto
                bg-[var(--theme-color)] hover:opacity-80 text-white border-2 border-[var(--theme-color)]
                ${!isLightMode ? 'shadow-[0_0_10px_var(--theme-color)]' : ''}
              `}
            >
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Demo
              </a>
            </Button>
          ) : (
            <Button
              size="sm"
              disabled
              className="bg-gray-600 border-2 border-gray-600 text-gray-300 cursor-not-allowed opacity-80 pointer-events-auto"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Demo
            </Button>
          )}
        </div>

        <div className="h-full flex items-center justify-center">
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            width="400"
            height="192"
            onError={(e) => {
              // Fallback to letter if image fails to load
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div
            className={`
              text-6xl font-bold opacity-20 transition-colors duration-300 absolute inset-0 items-center justify-center
              ${isLightMode ? 'text-blue-600' : 'text-blue-600'}
            `}
            style={{ display: 'none' }}
          >
            {project.title.charAt(0)}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${textClass}`}>
          {project.title}
        </h3>

        <p className={`text-sm mb-4 transition-colors duration-300 ${textClass}`}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className={`
                px-2 py-1 text-xs rounded-full transition-all duration-300 font-medium
                ${isLightMode
                  ? 'bg-[var(--theme-color)]/10 text-white border border-[var(--theme-color)]/30 hover:bg-[var(--theme-color)] hover:shadow-lg'
                  : 'bg-[var(--theme-color)]/20 text-white border border-[var(--theme-color)]/50  hover:bg-[var(--theme-color)] hover:shadow-[0_0_15px_var(--theme-color)]'
                }
              `}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
});

ProjectCard.displayName = 'ProjectCard';
