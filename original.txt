import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import portfolioData from '@/data/portfolio.json';
import { palettes } from '@/constants/palettes';

export const JourneySection = () => {
  const { effectiveTheme, getTextClass, isDayOrAfternoon, getTimeBasedClass } = useTimeTheme(); 
  const { education, experience, extracurriculars } = portfolioData;

  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();
  const timeBasedClass = getTimeBasedClass();

  const getThemePrimaryColor = () => {
    switch (effectiveTheme) {
      case 'dawn':
      case 'preDawn': return palettes.preDawn.bottom;
      case 'sunrise': return palettes.sunrise.bottom;
      case 'morning':
      case 'bright_day':
      case 'day': return palettes.morning.top;
      case 'noon':
      case 'warm_day': return palettes.noon.top;
      case 'afternoon': return palettes.afternoon.top;
      case 'sunset': return palettes.sunset.bottom;
      case 'dusk':
      case 'twilight': return palettes.dusk.bottom;
      case 'night':
      default: return '#7c3aed';
    }
  };

  const primaryColor = getThemePrimaryColor();

  return (
    <section id="journey" className={`py-20 px-6 ${timeBasedClass}`}>        
      <div 
        className={`container mx-auto max-w-5xl p-6 md:p-10 rounded-[2.5rem] backdrop-blur-md border shadow-2xl transition-all duration-500
          ${isLightMode ? 'bg-white/30 border-white/40' : 'bg-black/20 border-white/10'}
        `}
        style={{ '--theme-color': primaryColor } as React.CSSProperties}
      >
        <h2 className={`
          text-4xl font-bold text-center mb-10 transition-colors duration-300 ${!isLightMode ? 'synthwave-text-glow' : ''} ${textClass}                         
        `}>
          My Journey
        </h2>

        <Tabs defaultValue="education" className="w-full">
          <TabsList className="flex flex-col sm:grid w-full sm:grid-cols-3 mb-8 bg-transparent gap-2 p-1 border rounded-[2rem] sm:rounded-full backdrop-blur-sm shadow-inner overflow-hidden mx-auto max-w-3xl h-auto" style={{ borderColor: isLightMode ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)', background: isLightMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>
            <TabsTrigger
              value="education"
              className={`rounded-full flex-1 w-full data-[state=active]:bg-[var(--theme-color)] data-[state=active]:text-white transition-all duration-300 ${textClass}`}
            >
              Education
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className={`rounded-full flex-1 w-full data-[state=active]:bg-[var(--theme-color)] data-[state=active]:text-white transition-all duration-300 ${textClass}`}
            >
              Work Experience
            </TabsTrigger>
            <TabsTrigger
              value="volunteering"
              className={`rounded-full flex-1 w-full data-[state=active]:bg-[var(--theme-color)] data-[state=active]:text-white transition-all duration-300 ${textClass}`}
            >
              Volunteering
            </TabsTrigger>
          </TabsList>

          <TabsContent value="education" className="space-y-6">
            {education.map((edu, index) => (
              <Card
                key={edu.id}
                className={`
                  transition-all duration-500  ${!isLightMode ? 'synthwave-glow' : ''}                                                                          ${isLightMode
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
                        {edu.degree}
                      </h3>
                      <p className={`text-lg font-semibold transition-colors duration-300 ${textClass}`}>
                        {edu.institution}
                      </p>
                      <p className={`text-sm transition-colors duration-300 ${textClass} opacity-70`}>
                        {edu.duration} &bull; {edu.location}
                      </p>
                    </div>
                  </div>

                  <p className={`mb-4 transition-colors duration-300 ${textClass} opacity-80`}>
                    {edu.description}
                  </p>

                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="space-y-2">
                      <h4 className={`font-semibold mb-3 transition-colors duration-300 ${textClass}`}>
                        Highlights:
                      </h4>
                      <ul className="space-y-2">
                        {edu.achievements.map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            className={`flex items-start transition-colors duration-300 ${textClass} opacity-80`}
                          >
                            <span className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-[var(--theme-color)]" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            {experience.map((exp, index) => (
              <Card
                key={exp.id}
                className={`
                  transition-all duration-500  ${!isLightMode ? 'synthwave-glow' : ''}                                                                          ${isLightMode
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
                        {exp.duration} &bull; {exp.location}
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
                            className={`flex items-start transition-colors duration-300 ${textClass} opacity-80`}
                          >
                            <span className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-[var(--theme-color)]" />
                            {achievement}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="volunteering" className="space-y-6">
            {extracurriculars.map((activity, index) => (
              <Card
                key={activity.id}
                className={`
                  transition-all duration-500  ${!isLightMode ? 'synthwave-glow' : ''}                                                                          ${isLightMode
                      ? 'bg-white/25 border-white/40 liquid-glass-card'
                      : 'bg-white/15 border-white/25 liquid-glass-card'
                  }
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
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
                            <span className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-[var(--theme-color)]" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
      </div>
    </section>
  );
};
