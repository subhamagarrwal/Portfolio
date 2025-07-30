import { useState } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

export const ExperienceSection = () => {
  const { theme } = useTimeTheme();
  const isNightMode = theme === 'night' || theme === 'evening';
  const { experience } = portfolioData;
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="experience" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300
          ${isNightMode 
            ? 'text-night-text synthwave-text-glow' 
            : `text-${theme}-text liquid-glass-text font-extrabold`
          }
        `}>
          Professional Experience
        </h2>

        <div className="space-y-6">
          {experience.map((exp, index) => (
            <Card
              key={exp.id}
              className={`
                transition-all duration-500 hover:scale-[1.02]
                ${isNightMode 
                  ? 'bg-night-card/80 border-night-border synthwave-glow' 
                  : `bg-${theme}-card border-${theme}-border liquid-glass-card`
                }
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`
                      text-xl font-bold transition-colors duration-300
                      ${isNightMode 
                        ? 'text-night-accent' 
                        : `text-${theme}-accent`
                      }
                    `}>
                      {exp.position}
                    </h3>
                    <p className={`
                      text-lg font-semibold transition-colors duration-300
                      ${isNightMode 
                        ? 'text-night-text' 
                        : `text-${theme}-text`
                      }
                    `}>
                      {exp.company}
                    </p>
                    <p className={`
                      text-sm transition-colors duration-300
                      ${isNightMode 
                        ? 'text-night-text/70' 
                        : `text-${theme}-text/70`
                      }
                    `}>
                      {exp.duration} • {exp.location}
                    </p>
                  </div>
                  <Button
                    onClick={() => toggleExpanded(exp.id)}
                    variant="ghost"
                    size="sm"
                    className={`
                      transition-all duration-300
                      ${isNightMode 
                        ? 'text-night-text hover:text-night-accent hover:bg-night-card' 
                        : `text-${theme}-text hover:text-${theme}-accent hover:bg-${theme}-card`
                      }
                    `}
                  >
                    {expandedItems[exp.id] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                <p className={`
                  mb-4 transition-colors duration-300
                  ${isNightMode 
                    ? 'text-night-text/80' 
                    : `text-${theme}-text/80`
                  }
                `}>
                  {exp.description}
                </p>

                {expandedItems[exp.id] && (
                  <div className="space-y-2 animate-fade-in">
                    <h4 className={`
                      font-semibold mb-3 transition-colors duration-300
                      ${isNightMode 
                        ? 'text-night-text' 
                        : `text-${theme}-text`
                      }
                    `}>
                      Key Achievements:
                    </h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li
                          key={achIndex}
                          className={`
                            flex items-start transition-colors duration-300
                            ${isNightMode 
                              ? 'text-night-text/80' 
                              : `text-${theme}-text/80`
                            }
                          `}
                        >
                          <span className={`
                            inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0
                            ${isNightMode 
                              ? 'bg-night-accent' 
                              : `bg-${theme}-accent`
                            }
                          `} />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};