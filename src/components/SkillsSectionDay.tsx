import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';
import { useEffect, useRef, useState } from 'react';

export const SkillsSectionDay = () => {
  const { 
    getTextClass, 
    isDayOrAfternoon
  } = useTimeTheme();
  
  const { skills } = portfolioData;
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);
  const sectionRef = useRef<HTMLElement>(null);
  
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();

  const skillCategories = [
    { title: 'Languages', skills: skills.languages, icon: '💻', direction: 'left' },
    { title: 'Frameworks', skills: skills.frameworks, icon: '🚀', direction: 'right' },
    { title: 'Tools & Technologies', skills: skills.tools, icon: '🛠️', direction: 'left' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animations with staggered delays
            setTimeout(() => setVisibleCards(prev => [true, prev[1], prev[2]]), 100);
            setTimeout(() => setVisibleCards(prev => [prev[0], true, prev[2]]), 300);
            setTimeout(() => setVisibleCards(prev => [prev[0], prev[1], true]), 500);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300 ${textClass}
        `}>
          Skills & Technologies
        </h2>

        <div className="space-y-8">
          {skillCategories.map((category, index) => (
            <div
              key={category.title}
              className={`
                transition-all duration-700 ease-out
                ${!visibleCards[index] 
                  ? category.direction === 'left' 
                    ? '-translate-x-full opacity-0' 
                    : 'translate-x-full opacity-0'
                  : 'translate-x-0 opacity-100'
                }
              `}
            >
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl mr-3">{category.icon}</span>
                <h3 className={`text-2xl font-bold transition-colors duration-300 ${textClass}`}>
                  {category.title}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skill}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 
                      ${isLightMode 
                        ? 'liquid-glass-button text-black' 
                        : 'bg-purple-900/20 border border-purple-500/30 text-white'
                      }
                    `}
                    style={{ 
                      animationDelay: `${(index * 200) + (skillIndex * 50)}ms`,
                      transitionDelay: `${(index * 200) + (skillIndex * 50)}ms`
                    }}
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
