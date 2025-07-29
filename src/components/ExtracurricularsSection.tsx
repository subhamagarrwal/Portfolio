import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';

export const ExtracurricularsSection = () => {
  const { theme } = useTimeTheme();
  const isNightMode = theme === 'night' || theme === 'evening';
  const { extracurriculars } = portfolioData;

  return (
    <section id="extracurriculars" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300
          ${isNightMode 
            ? 'text-night-text synthwave-text-glow' 
            : `text-${theme}-text`
          }
        `}>
          Leadership & Activities
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {extracurriculars.map((activity, index) => (
            <Card
              key={activity.id}
              className={`
                p-6 transition-all duration-500 hover:scale-105
                ${isNightMode 
                  ? 'bg-night-card/80 border-night-border synthwave-glow' 
                  : `bg-${theme}-card border-${theme}-border`
                }
              `}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mb-4">
                <h3 className={`
                  text-xl font-bold mb-2 transition-colors duration-300
                  ${isNightMode 
                    ? 'text-night-accent' 
                    : `text-${theme}-accent`
                  }
                `}>
                  {activity.position}
                </h3>
                <p className={`
                  text-lg font-semibold transition-colors duration-300
                  ${isNightMode 
                    ? 'text-night-text' 
                    : `text-${theme}-text`
                  }
                `}>
                  {activity.organization}
                </p>
                <p className={`
                  text-sm transition-colors duration-300
                  ${isNightMode 
                    ? 'text-night-text/70' 
                    : `text-${theme}-text/70`
                  }
                `}>
                  {activity.duration}
                </p>
              </div>

              <p className={`
                mb-4 transition-colors duration-300
                ${isNightMode 
                  ? 'text-night-text/80' 
                  : `text-${theme}-text/80`
                }
              `}>
                {activity.description}
              </p>

              <div className="space-y-2">
                <h4 className={`
                  font-semibold mb-3 transition-colors duration-300
                  ${isNightMode 
                    ? 'text-night-text' 
                    : `text-${theme}-text`
                  }
                `}>
                  Key Accomplishments:
                </h4>
                <ul className="space-y-2">
                  {activity.achievements.map((achievement, achIndex) => (
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
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};