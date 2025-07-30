import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';

export const ExtracurricularsSectionDay = () => {
  const { getTextClass, isDayOrAfternoon } = useTimeTheme();
  const { extracurriculars } = portfolioData;
  
  // Get the appropriate text theme class
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();

  return (
    <section id="extracurriculars" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300 ${textClass}
          ${isLightMode ? 'liquid-glass-text-container' : ''}
        `}>
          Leadership & Activities
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {extracurriculars.map((activity, index) => (
            <Card
              key={activity.id}
              className={`
                p-6 transition-all duration-500 hover:scale-105
                ${isLightMode
                    ? 'bg-white/25 border-white/40 liquid-glass-card'
                    : 'bg-white/15 border-white/25 liquid-glass-card'
                }
              `}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mb-4">
                <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${textClass}`}>
                  {activity.position}
                </h3>
                <p className={`text-lg font-semibold transition-colors duration-300 ${textClass}`}>
                  {activity.organization}
                </p>
                <p className={`text-sm transition-colors duration-300 ${textClass} opacity-70`}>
                  {activity.duration}
                </p>
              </div>

              <p className={`mb-4 transition-colors duration-300 ${textClass} opacity-80`}>
                {activity.description}
              </p>

              <div className="space-y-2">
                <h4 className={`font-semibold mb-3 transition-colors duration-300 ${textClass}`}>
                  Key Accomplishments:
                </h4>
                <ul className="space-y-2">
                  {activity.achievements.map((achievement, achIndex) => (
                    <li
                      key={achIndex}
                      className={`flex items-start transition-colors duration-300 ${textClass} opacity-80`}
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
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
