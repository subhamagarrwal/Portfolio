import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

export const ProjectsSectionDay = () => {
  const { 
    getTextClass, 
    isDayOrAfternoon
  } = useTimeTheme();
  
  const { projects } = portfolioData;
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();

  return (
    <section id="projects" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300 ${textClass}
        `}>
          Featured Projects
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              className={`
                overflow-hidden transition-all duration-500 hover:scale-105
                ${isLightMode
                    ? 'bg-white/25 border-white/40 liquid-glass-card'
                    : 'bg-white/15 border-white/25 liquid-glass-card'
                }
                ${projects.length % 2 !== 0 && index === projects.length - 1 
                  ? 'lg:col-span-2' 
                  : ''
                }
              `}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`
                h-48 bg-gradient-to-br transition-all duration-300 relative overflow-hidden
                ${isLightMode 
                  ? 'from-blue-500/20 to-purple-500/20' 
                  : 'from-blue-500/20 to-purple-500/20'
                }
              `}>
                <div className="h-full flex items-center justify-center">
                  <img 
                    src={project.image} 
                    alt={`${project.title} preview`}
                    className="w-full h-full object-cover"
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
                        px-2 py-1 text-xs rounded-full transition-all duration-300
                        ${isLightMode 
                          ? 'bg-blue-500/20 text-blue-800 border border-blue-300/30' 
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }
                      `}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className={`
                      flex-1 transition-all duration-300
                      ${isLightMode 
                        ? 'border-blue-400 text-black hover:bg-blue-500/20' 
                        : 'border-purple-500 text-white hover:bg-purple-500/20'
                      }
                    `}
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className={`
                      flex-1 transition-all duration-300
                      ${isLightMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }
                    `}
                  >
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Demo
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            className={`
              px-8 py-3 transition-all duration-300 ${textClass}
              ${isLightMode 
                ? 'border-blue-400 hover:bg-blue-500/20' 
                : 'border-purple-500 hover:bg-purple-500/20'
              }
            `}
          >
            <a href="https://github.com/subhamagarrwal" target="_blank" rel="noopener noreferrer">
              View All Projects
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
