import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';

export const ExtracurricularsSection = () => {
  const { getTextClass, isDayOrAfternoon, getTimeBasedClass } = useTimeTheme();
  const { extracurriculars } = portfolioData;
  
  // Get the appropriate text theme class
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();
  const timeBasedClass = getTimeBasedClass();

  return (
    <section id="extracurriculars" className={`py-20 px-6 ${timeBasedClass}`}>
      <div className="container mx-auto max-w-6xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300 ${!isLightMode ? '' : ''} ${textClass}
          
        `}>
          Leadership & Activities
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {extracurriculars.map((activity, index) => (
            <Card
              key={activity.id}
              className={`
                p-6 transition-all duration-500 hover:scale-105 ${!isLightMode ? '' : ''}
                ${isLightMode
                    ? 'bg-white/25 border border-white/40 liquid-glass-card shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
                    : 'bg-black/40 backdrop-blur-lg border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] [transform:translate3d(0,0,0)]'
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
