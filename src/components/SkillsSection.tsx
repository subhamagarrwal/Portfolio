import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';
import { palettes } from '@/constants/palettes';

export const SkillsSection = () => {
  const { 
    effectiveTheme,
    getTextClass, 
    isDayOrAfternoon,
    getTimeBasedClass
  } = useTimeTheme();
  
  const { skills } = portfolioData;
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

  const skillCategories = [
    { title: 'Languages', skills: skills.languages, icon: '💻' },
    { title: 'Frameworks', skills: skills.frameworks, icon: '🚀' },
    { title: 'Tools & Technologies', skills: skills.tools, icon: '🛠️' },
  ];

  return (
    <section id="skills" className={`py-20 px-6 ${timeBasedClass}`}>
      <div 
        className="container mx-auto max-w-6xl"
        style={{ '--theme-color': primaryColor } as React.CSSProperties}
      >
        <h2 className={`text-4xl font-bold text-center mb-12 transition-colors duration-300 ${textClass}`}>
          Skills & Technologies
        </h2>

        <div className="space-y-8">
          {skillCategories.map((category) => (
            <div key={category.title}>
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl mr-3">{category.icon}</span>
                <h3 className={`text-2xl font-bold transition-colors duration-300 ${textClass}`}>
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {category.skills.map((skill) => (
                  <div
                    key={skill}
                    className="liquid-glass-card px-4 py-2 rounded-full !text-black text-sm font-medium transition-transform hover:scale-105"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-12 text-center transition-colors duration-300 ${textClass}`}>
        </div>
      </div>
    </section>
  );
};

