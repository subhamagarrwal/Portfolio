import { useTimeTheme } from '@/hooks/useTimeTheme';
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
      case 'preDawn': return '#a78bfa';
      case 'sunrise': return palettes.sunrise.bottom;
      case 'morning':
      case 'bright_day':
      case 'day': return '#1d4ed8';
      case 'noon':
      case 'warm_day': return palettes.noon.top;
      case 'afternoon': return palettes.afternoon.top;
      case 'sunset': return palettes.sunset.bottom;
      case 'dusk':
      case 'twilight': return palettes.dusk.bottom;
      case 'night':
      default: return '#ffffff';
    }
  };

  const primaryColor = getThemePrimaryColor();

  return (
    <section id="journey" className={`py-20 ${timeBasedClass}`}>
      <div
        className="w-full mx-auto max-w-5xl flex flex-col items-center"
        style={{ 
          '--theme-color': primaryColor,
          '--btn-text-color': primaryColor === '#ffffff' ? '#000000' : '#ffffff'
        } as React.CSSProperties}
      >
        <h2 className={`
          text-3xl sm:text-4xl font-bold text-center mb-10 transition-colors duration-300 ${!isLightMode ? 'synthwave-text-glow' : ''} ${textClass} btn-text-override                         
        `}>
          My Journey
        </h2>

        <Tabs defaultValue="education" className="w-full">
          <TabsList className="grid grid-cols-3 w-[85vw] max-w-[800px] lg:w-full mb-8 bg-transparent gap-1 sm:gap-2 p-1 border rounded-full backdrop-blur-sm shadow-inner overflow-hidden mx-auto h-auto" style={{ borderColor: isLightMode ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)', background: isLightMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>
            <TabsTrigger
              value="education"
              className={`rounded-full flex-1 w-full flex items-center justify-center text-[10.5px] xs:text-[11px] sm:text-sm whitespace-nowrap px-0 sm:px-3 py-2 md:py-2.5 h-full data-[state=active]:bg-[var(--theme-color)] data-[state=active]:text-[var(--btn-text-color)] transition-all duration-300 ${textClass} btn-text-override`}
            >
              Education
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className={`rounded-full flex-1 w-full flex items-center justify-center text-[10.5px] xs:text-[11px] sm:text-sm whitespace-nowrap px-0 sm:px-3 py-2 md:py-2.5 h-full data-[state=active]:bg-[var(--theme-color)] data-[state=active]:text-[var(--btn-text-color)] transition-all duration-300 ${textClass} btn-text-override`}
            >
              Work Experience
            </TabsTrigger>
            <TabsTrigger
              value="volunteering"
              className={`rounded-full flex-1 w-full flex items-center justify-center text-[10.5px] xs:text-[11px] sm:text-sm whitespace-nowrap px-0 sm:px-3 py-2 md:py-2.5 h-full data-[state=active]:bg-[var(--theme-color)] data-[state=active]:text-[var(--btn-text-color)] transition-all duration-300 ${textClass} btn-text-override`}
            >
              Volunteering
            </TabsTrigger>
          </TabsList>

          <TabsContent value="education" className="mt-8">
            <div className={`w-[85vw] max-w-[800px] lg:w-full mx-auto p-4 md:p-10 rounded-[2.5rem] backdrop-blur-md border shadow-2xl transition-all duration-500
              ${isLightMode ? 'bg-white/30 border-white/40' : 'bg-black/20 border-white/10'}
              ${!isLightMode ? 'synthwave-glow' : ''}
            `}>
              <div className="flex flex-col">
                {education.map((edu, index) => (
                  <div key={edu.id} className={`relative pb-8 mb-8 border-b ${isLightMode ? 'border-black/10' : 'border-white/10'} last:border-0 last:pb-0 last:mb-0`} style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="mb-4">
                      <div>
                        <h3 className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${textClass} btn-text-override`}>
                          {edu.degree}
                        </h3>
                        <p className={`text-base sm:text-lg font-semibold transition-colors duration-300 ${textClass} btn-text-override`}>
                          {edu.institution}
                        </p>
                        <p className={`text-xs sm:text-sm transition-colors duration-300 ${textClass} btn-text-override opacity-70`}>
                          {edu.duration} &bull; {edu.location}
                        </p>
                      </div>
                    </div>

                    <p className={`mb-4 transition-colors duration-300 ${textClass} btn-text-override opacity-80`}>
                      {edu.description}
                    </p>

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className={`font-semibold mb-3 transition-colors duration-300 ${textClass} btn-text-override`}>
                          Highlights:
                        </h4>
                        <ul className="space-y-2">
                          {edu.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className={`flex items-start transition-colors duration-300 ${textClass} btn-text-override opacity-80`}>
                              <span className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-[var(--theme-color)]" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experience" className="mt-8">
            <div className={`w-[85vw] max-w-[800px] lg:w-full mx-auto p-4 md:p-10 rounded-[2.5rem] backdrop-blur-md border shadow-2xl transition-all duration-500
              ${isLightMode ? 'bg-white/30 border-white/40' : 'bg-black/20 border-white/10'}
              ${!isLightMode ? 'synthwave-glow' : ''}
            `}>
              <div className="flex flex-col">
                {experience.map((exp, index) => (
                  <div key={exp.id} className={`relative pb-8 mb-8 border-b ${isLightMode ? 'border-black/10' : 'border-white/10'} last:border-0 last:pb-0 last:mb-0`} style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="mb-4">
                      <div>
                        <h3 className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${textClass} btn-text-override`}>
                          {exp.position}
                        </h3>
                        <p className={`text-base sm:text-lg font-semibold transition-colors duration-300 ${textClass} btn-text-override`}>
                          {exp.company}
                        </p>
                        <p className={`text-xs sm:text-sm transition-colors duration-300 ${textClass} btn-text-override opacity-70`}>
                          {exp.duration} &bull; {exp.location}
                        </p>
                      </div>
                    </div>

                    <p className={`mb-4 transition-colors duration-300 ${textClass} btn-text-override opacity-80`}>
                      {exp.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className={`font-semibold mb-3 transition-colors duration-300 ${textClass} btn-text-override`}>
                        Key Achievements:
                      </h4>
                      <ul className="space-y-2">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className={`flex items-start transition-colors duration-300 ${textClass} btn-text-override opacity-80`}>
                              <span className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-[var(--theme-color)]" />
                              {achievement}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="volunteering" className="mt-8">
            <div className={`w-[85vw] max-w-[800px] lg:w-full mx-auto p-4 md:p-10 rounded-[2.5rem] backdrop-blur-md border shadow-2xl transition-all duration-500
              ${isLightMode ? 'bg-white/30 border-white/40' : 'bg-black/20 border-white/10'}
              ${!isLightMode ? 'synthwave-glow' : ''}
            `}>
              <div className="flex flex-col">
                {extracurriculars.map((activity, index) => (
                  <div key={activity.id} className={`relative pb-8 mb-8 border-b ${isLightMode ? 'border-black/10' : 'border-white/10'} last:border-0 last:pb-0 last:mb-0`} style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="mb-4">
                      <h3 className={`text-lg sm:text-xl font-bold mb-2 transition-colors duration-300 ${textClass} btn-text-override`}>
                        {activity.position}
                      </h3>
                      <p className={`text-base sm:text-lg font-semibold transition-colors duration-300 ${textClass} btn-text-override`}>
                        {activity.organization}
                      </p>
                      <p className={`text-xs sm:text-sm transition-colors duration-300 ${textClass} btn-text-override opacity-70`}>
                        {activity.duration}
                      </p>
                    </div>

                    <p className={`mb-4 transition-colors duration-300 ${textClass} btn-text-override opacity-80`}>
                      {activity.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className={`font-semibold mb-3 transition-colors duration-300 ${textClass} btn-text-override`}>
                        Key Accomplishments:
                      </h4>
                      <ul className="space-y-2">
                          {activity.achievements.map((achievement, achIndex) => (       
                            <li key={achIndex} className={`flex items-start transition-colors duration-300 ${textClass} btn-text-override opacity-80`}>
                              <span className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-[var(--theme-color)]" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
      </div>
    </section>
  );
};
