import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';

export const ExperienceSectionDay = () => {
  const { getTextClass, isDayOrAfternoon } = useTimeTheme();
  const { experience } = portfolioData;
  
  // Get the appropriate text theme class
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();

  return (
    <section id="experience" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300 ${textClass}
          ${isLightMode ? 'liquid-glass-text-container' : ''}
        `}>
          Professional Experience
        </h2>

        <div className="space-y-6">
          {experience.map((exp, index) => (
            <Card
              key={exp.id}
              className={`
                transition-all duration-500 hover:scale-[1.02]
                ${isLightMode
                    ? 'bg-white/25 border-white/40 liquid-glass-card'
                    : 'bg-white/15 border-white/25 liquid-glass-card'
                }
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="mb-4">
                  <div>
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${textClass}`}>
                      {exp.position}
                    </h3>
                    <p className={`text-lg font-semibold transition-colors duration-300 ${textClass}`}>
                      {exp.company}
                    </p>
                    <p className={`text-sm transition-colors duration-300 ${textClass} opacity-70`}>
                      {exp.duration} • {exp.location}
                    </p>
                  </div>
                </div>

                <p className={`mb-4 transition-colors duration-300 ${textClass} opacity-80`}>
                  {exp.description}
                </p>

                <div className="space-y-2">
                  <h4 className={`font-semibold mb-3 transition-colors duration-300 ${textClass}`}>
                    Key Achievements:
                  </h4>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li
                        key={achIndex}
                        className={`
                          flex items-start transition-colors duration-300 ${textClass}
                          opacity-80
                        `}
                      >
                        <span className={`
                          inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0
                          ${isLightMode ? 'bg-blue-500' : 'bg-purple-500'}
                        `} />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
