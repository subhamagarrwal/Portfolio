import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

export const ProjectsSection = () => {
  const { theme, getTextThemeClass, shouldShowLateNightGlow } = useTimeTheme();
  const isNightMode = theme === 'night' || theme === 'evening';
  const { projects } = portfolioData;
  
  // Get the appropriate text theme class and glow state
  const textThemeClass = getTextThemeClass();
  const showLateNightGlow = shouldShowLateNightGlow();

  return (
    <section id="projects" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300 ${textThemeClass}
          ${!isNightMode && !showLateNightGlow ? 'liquid-glass-text' : ''}
          ${showLateNightGlow ? 'synthwave-text-glow' : ''}
        `}>
          Featured Projects
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              className={`
                overflow-hidden transition-all duration-500 hover:scale-105
                ${isNightMode || showLateNightGlow
                  ? 'bg-night-card/80 border-night-border synthwave-glow' 
                  : `bg-${theme}-card border-${theme}-border liquid-glass-card`
                }
                ${projects.length % 2 !== 0 && index === projects.length - 1 
                  ? 'lg:col-span-2' 
                  : ''
                }
              `}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`
                h-48 bg-gradient-to-br transition-all duration-300
                ${isNightMode 
                  ? 'from-night-accent/20 to-night-secondary/20' 
                  : `from-${theme}-accent/20 to-${theme}-accent/10`
                }
              `}>
                <div className="h-full flex items-center justify-center">
                  <div className={`
                    text-6xl font-bold opacity-20 transition-colors duration-300
                    ${isNightMode 
                      ? 'text-night-accent' 
                      : `text-${theme}-accent`
                    }
                  `}>
                    {project.title.charAt(0)}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className={`
                  text-xl font-bold mb-3 transition-colors duration-300
                  ${isNightMode 
                    ? 'text-night-accent' 
                    : `text-${theme}-accent`
                  }
                `}>
                  {project.title}
                </h3>

                <p className={`
                  text-sm mb-4 transition-colors duration-300
                  ${isNightMode 
                    ? 'text-night-text/80' 
                    : `text-${theme}-text/80`
                  }
                `}>
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className={`
                        px-2 py-1 text-xs rounded-full transition-all duration-300
                        ${isNightMode 
                          ? 'bg-night-accent/20 text-night-accent border border-night-accent/30' 
                          : `bg-${theme}-accent/20 text-${theme}-accent border border-${theme}-accent/30`
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
                      ${isNightMode 
                        ? 'border-night-border text-night-text hover:bg-night-card' 
                        : `border-${theme}-border text-${theme}-text hover:bg-${theme}-card`
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
                      ${isNightMode 
                        ? 'bg-night-accent hover:bg-night-accent/80 text-white' 
                        : `bg-${theme}-accent hover:bg-${theme}-accent/80 text-white`
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
              px-8 py-3 transition-all duration-300
              ${isNightMode 
                ? 'border-night-border text-night-text hover:bg-night-card' 
                : `border-${theme}-border text-${theme}-text hover:bg-${theme}-card`
              }
            `}
          >

          </Button>
        </div>
      </div>
    </section>
  );
};