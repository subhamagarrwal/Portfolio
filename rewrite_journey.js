const fs = require('fs');

const code = `import React, { useEffect, useRef, useState } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
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
  
  // Combine all items
  const allItems = [
    ...experience.map(item => ({ ...item, category: 'Work Experience' })),
    ...education.map(item => ({ ...item, category: 'Education' })),
    ...extracurriculars.map(item => ({ ...item, category: 'Volunteering' }))
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeLamp, setActiveLamp] = useState(false);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver((entries) => {
      let isVisible = false;
      // If any of the experience items are heavily visible, shine the lamp
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true;
        }
      });
      if (isVisible) {
        setActiveLamp(true);
      } else {
        setActiveLamp(false); // Dim when no items are visible fully
      }
    }, {
      root: root,
      threshold: 0.6 // item is at least 60% visible
    });

    const items = root.querySelectorAll('.experience-item');
    items.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="journey" className={\`py-20 px-6 \${timeBasedClass}\`}>
      <div 
        className={\`container mx-auto max-w-5xl p-6 md:p-10 rounded-[2.5rem] backdrop-blur-md border shadow-2xl transition-all duration-500 flex flex-col items-center
          \${isLightMode ? 'bg-white/30 border-white/40' : 'bg-black/20 border-white/10'}
        \`}
        style={{ '--theme-color': primaryColor } as React.CSSProperties}
      >
        <h2 className={\`
          text-4xl font-bold text-center mb-10 transition-colors duration-300 \${textClass}
        \`}>
          My Experience
        </h2>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="w-full max-h-[60vh] overflow-y-auto no-scrollbar space-y-8 p-4 relative"
        >
          {allItems.map((item, index) => (
            <Card
              key={\`\${item.category}-\${item.id || index}\`}
              className={\`
                experience-item transition-all duration-500 
                \${isLightMode
                    ? 'bg-white/25 border-white/40 liquid-glass-card'
                    : 'bg-white/15 border-white/25 liquid-glass-card'
                }
              \`}
            >
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className={\`text-xl font-bold transition-colors duration-300 \${textClass}\`}>
                        {item.position || item.degree}
                      </h3>
                      <p className={\`text-lg font-semibold transition-colors duration-300 \${textClass}\`}>
                        {item.company || item.institution || item.organization}
                      </p>
                      <p className={\`text-sm transition-colors duration-300 \${textClass} opacity-70\`}>
                        {item.duration} {item.location ? \`• \${item.location}\` : ''}
                      </p>
                    </div>
                    <span className={\`px-3 py-1 text-xs rounded-full font-medium \${isLightMode ? 'bg-black/10 text-black/80' : 'bg-white/20 text-white/90'}\`}>
                      {item.category}
                    </span>
                  </div>
                </div>

                <p className={\`mb-4 transition-colors duration-300 \${textClass} opacity-80\`}>
                  {item.description}
                </p>

                {item.achievements && item.achievements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className={\`font-semibold mb-3 transition-colors duration-300 \${textClass}\`}>
                      Highlights:
                    </h4>
                    <ul className="space-y-2">
                      {item.achievements.map((achievement: string, achIndex: number) => (
                        <li
                          key={achIndex}
                          className={\`flex items-start transition-colors duration-300 \${textClass} opacity-80\`}
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
        </div>

        {/* Table Lamp Effect Below the Scroll Container */}
        <div className="mt-8 flex flex-col items-center justify-center relative w-full h-32 pointer-events-none">
          {/* Lamp Head */}
          <div className={\`w-16 h-8 rounded-t-full z-10 transition-all duration-500 \${isLightMode ? 'bg-gray-700/50' : 'bg-zinc-800'}\`}></div>
          
          {/* Lamp Base and stand */}
          <div className={\`w-2 h-10 z-10 transition-all duration-500 \${isLightMode ? 'bg-gray-700/50' : 'bg-zinc-800'}\`}></div>
          <div className={\`w-20 h-2 rounded-t-lg z-10 transition-all duration-500 \${isLightMode ? 'bg-gray-700/50' : 'bg-zinc-800'}\`}></div>

          {/* Lamp Light Beam */}
          <div 
            className="absolute top-8 left-1/2 -translate-x-1/2 w-[250px] h-[120px] pointer-events-none transition-all duration-700 blur-2xl rounded-t-[100px]"
            style={{ 
              background: \`\${primaryColor}\`, 
              opacity: activeLamp ? (isLightMode ? 0.4 : 0.6) : (isLightMode ? 0.05 : 0.05),
              transform: activeLamp ? 'scale(1.1) translateY(-20px)' : 'scale(1) translateY(0)',
            }}
          ></div>
        </div>

      </div>
    </section>
  );
};
`;
fs.writeFileSync('src/components/JourneySection.tsx', code);
