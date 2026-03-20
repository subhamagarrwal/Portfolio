import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Github, ExternalLink } from 'lucide-react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { ProjectDetailsModal } from './ProjectDetailsModal';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    heading: string;
    description: string;
    image: string;
    techStack: string[];
    github?: string;
    demo?: string;
    featured?: boolean;
    features?: string[];
  };
  index: number;
  totalProjects: number;
  isLightMode: boolean;
  textClass: string;
  className?: string; // Add className prop for custom sizing like fixed height 
}

export const ProjectCard = memo(({ project, index, totalProjects, isLightMode, textClass, className = '' }: ProjectCardProps) => {
  const { effectiveTheme } = useTimeTheme();
  
  // Decide if we should force icons to be strictly white instead of using the custom theme color
  const forceWhiteIcons = effectiveTheme === 'twilight' || effectiveTheme === 'night' || effectiveTheme === 'sunset' || effectiveTheme === 'preDawn' || effectiveTheme === 'dawn';

  return (
    <Card
      key={project.id}
      className={`
        ${className}
        group overflow-hidden transition-all duration-500 ${!isLightMode ? '' : ''}
        ${isLightMode
            ? 'bg-white/40 border border-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
            : 'bg-black/75  border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]'
        }
      `}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div
        className={`
          h-48 bg-gradient-to-br transition-all duration-300 relative overflow-hidden
          ${isLightMode
            ? 'from-[var(--theme-color)]/20 to-purple-500/20'
            : 'from-[var(--theme-color)]/20 to-purple-500/20'
          }
        `}
      >
        <div className="h-full flex items-center justify-center">
          <motion.img
            src={project.image}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover"
            width="400"
            height="192"
            onError={(e) => {
              // Fallback to letter if image fails to load
              (e.currentTarget as HTMLImageElement).style.display = 'none';
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

      <div className="p-6 flex flex-col items-start w-full">
        <div className="w-full max-w-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-xl font-bold transition-colors duration-300 ${textClass}`}>
              {project.title}
            </h3>
            <div className="flex gap-3 items-center">
              <ProjectDetailsModal project={project} isLightMode={isLightMode} textClass={textClass}>
                <button aria-label={`Read more about ${project.title}`} className={`text-xs font-medium cursor-pointer transition-colors hover:text-[var(--theme-color)] pointer-events-auto ${textClass} relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:bg-[var(--theme-color)] whitespace-nowrap`}>
                  Read more
                </button>
              </ProjectDetailsModal>
              {project.github && (
                 <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub repository for ${project.title}`} className={`transition-colors ${forceWhiteIcons ? 'text-white hover:text-gray-300' : 'hover:text-[var(--theme-color)]'}`}>
                    <Github className="w-5 h-5 pointer-events-auto" />
                 </a>
              )}
              {project.demo && (
                 <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`Live demo for ${project.title}`} className={`transition-colors ${forceWhiteIcons ? 'text-white hover:text-gray-300' : 'hover:text-[var(--theme-color)]'}`}>
                    <ExternalLink className="w-5 h-5 pointer-events-auto" />
                 </a>
              )}
            </div>
          </div>

          <p className={`text-sm mb-4 transition-colors duration-300 ${textClass}`}>
            {project.description}
          </p>
        </div>
      </div>
    </Card>
  );
});

ProjectCard.displayName = 'ProjectCard';

