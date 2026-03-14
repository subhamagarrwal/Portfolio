import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';

export const SkillsSection = () => {
  const { 
    getTextClass, 
    isDayOrAfternoon,
    getTimeBasedClass
  } = useTimeTheme();
  
  const { skills } = portfolioData;
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();
  const timeBasedClass = getTimeBasedClass();

  const skillCategories = [
    { title: 'Languages', skills: skills.languages, icon: '💻' },
    { title: 'Frameworks', skills: skills.frameworks, icon: '🚀' },
    { title: 'Tools & Technologies', skills: skills.tools, icon: '🛠️' },
  ];

  return (
    <section id="skills" className={`py-20 px-6 ${timeBasedClass}`}>
      <div className="container mx-auto max-w-6xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300 ${!isLightMode ? 'synthwave-text-glow' : ''} ${textClass}
        `}>
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
                  <span
                    key={skill}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 hover:scale-105 
                      ${isLightMode 
                        ? 'liquid-glass-button text-black' 
                        : 'bg-purple-900/20 border border-purple-500/30 text-white'
                      }
                    `}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-12 text-center transition-colors duration-300 ${textClass}`}>
          <p className="text-lg">
            Always learning and exploring new technologies to stay at the forefront of web development.
          </p>
        </div>
      </div>
    </section>
  );
};
