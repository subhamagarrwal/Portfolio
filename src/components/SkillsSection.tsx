import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';

export const SkillsSection = () => {
  const { theme } = useTimeTheme();
  const isNightMode = theme === 'night' || theme === 'evening';
  const { skills } = portfolioData;

  const skillCategories = [
    { title: 'Languages', skills: skills.languages, icon: '💻' },
    { title: 'Frameworks', skills: skills.frameworks, icon: '🚀' },
    { title: 'Tools & Technologies', skills: skills.tools, icon: '🛠️' },
  ];

  return (
    <section id="skills" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300
          ${isNightMode 
            ? 'text-night-text synthwave-text-glow' 
            : `text-${theme}-text`
          }
        `}>
          Skills & Technologies
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <Card
              key={category.title}
              className={`
                p-6 transition-all duration-500 hover:scale-105
                ${isNightMode 
                  ? 'bg-night-card/80 border-night-border synthwave-glow' 
                  : `bg-${theme}-card border-${theme}-border`
                }
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className={`
                  text-xl font-semibold transition-colors duration-300
                  ${isNightMode 
                    ? 'text-night-accent' 
                    : `text-${theme}-accent`
                  }
                `}>
                  {category.title}
                </h3>
              </div>

              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skill}
                    className={`
                      px-3 py-2 rounded-lg text-center transition-all duration-300 hover:scale-105
                      ${isNightMode 
                        ? 'bg-night-card/60 border border-night-border text-night-text' 
                        : `bg-${theme}-card/60 border border-${theme}-border text-${theme}-text`
                      }
                    `}
                    style={{ animationDelay: `${(index * 0.1) + (skillIndex * 0.05)}s` }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className={`
          mt-12 text-center transition-colors duration-300
          ${isNightMode 
            ? 'text-night-text/70' 
            : `text-${theme}-text/70`
          }
        `}>
          <p className="text-lg">
            Always learning and exploring new technologies to stay at the forefront of web development.
          </p>
        </div>
      </div>
    </section>
  );
};