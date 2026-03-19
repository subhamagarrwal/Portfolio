import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import portfolioData from '@/data/portfolio.json';
import { palettes } from '@/constants/palettes';

export const AboutSection = () => {
  const {
    effectiveTheme,
    getTextClass,
    getTimeBasedClass,
    isDayOrAfternoon
  } = useTimeTheme();

  const textClass = getTextClass();
  const timeBasedClass = getTimeBasedClass();
  const isLightMode = isDayOrAfternoon();

  const [draggedSkills, setDraggedSkills] = useState<Set<string>>(new Set());
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const skill = el.getAttribute('data-skill');
        
        if (skill) {
          setDraggedSkills(prev => {
            if (prev.has(skill)) return prev;
            const newSet = new Set(prev);
            newSet.add(skill);
            return newSet;
          });
        }
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setDraggedSkills(new Set());
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  const handlePointerDown = (skill: string) => {
    isDraggingRef.current = true;
    setDraggedSkills(new Set([skill]));
  };

  const { skills } = portfolioData;

  const primaryColor = useMemo(() => {
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
  }, [effectiveTheme]);

  const allSkills = useMemo(() => [
    ...skills.languages,
    ...skills.frameworks,
    ...skills.tools
  ], [skills]);

  return (
    <section id="about" className={`py-8 sm:py-12 px-6 ${timeBasedClass} relative z-10`}>
      <div className="w-full mx-auto max-w-5xl flex flex-col items-center">
        <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-8 transition-colors duration-300 ${textClass} ${!isLightMode ? '[text-shadow:_0_4px_8px_rgba(0,0,0,0.8)]' : ''}`}>
          About Me
        </h2>

        <div className={`w-[85vw] max-w-[800px] lg:w-full mx-auto space-y-6 p-6 md:p-10 rounded-2xl transition-all duration-500 relative overflow-hidden
          ${isLightMode
            ? 'bg-white/25 border border-white/40 liquid-glass-card shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
            : 'bg-black/75  border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]'}
        `}
        style={{ 
          '--theme-color': primaryColor,
          '--btn-text-color': primaryColor === '#ffffff' ? '#000' : '#fff'
        } as React.CSSProperties}
        >
          {portfolioData.personal.about.map((paragraph, index) => (
            <p key={index} className={`text-[15px] md:text-base leading-relaxed text-left transition-colors duration-300 relative z-10 
              ${effectiveTheme === 'sunset' ? 'text-white' : textClass} 
              ${!isLightMode ? 'font-medium [text-shadow:_0_2px_4px_rgba(0,0,0,0.8)] tracking-wide' : ''}`}>
              {paragraph}
            </p>
          ))}

          <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
            <div className="flex items-center gap-3 mb-8">
              {/* <div className={`p-2 rounded-lg bg-black/20 ${!isLightMode ? 'bg-white/10' : ''}`}>
                { <svg className={`w-5 h-5 ${effectiveTheme === 'sunset' ? 'text-white' : textClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg> }
              </div> */}
              <h3 className={`text-2xl font-bold transition-colors duration-300 ${textClass}`}>
                Technical Skills
              </h3>
            </div>
            
            <div
              className="flex flex-wrap gap-3 group/skill-list"
              style={{ touchAction: 'pan-y' }}
            >
              {allSkills.map((skill) => {
                const isHighlighted = draggedSkills.has(skill);
                
                return (
                  <div
                    key={skill}
                    data-skill={skill}
                    onPointerDown={() => handlePointerDown(skill)}
                    className={`liquid-glass-card px-4 py-2 rounded-full !text-black text-[15px] font-medium transition-all duration-300 select-none cursor-default ${
                      isHighlighted
                        ? '!opacity-100 scale-105 bg-[var(--theme-color)] !text-[var(--btn-text-color)] border-transparent'
                        : 'group-hover/skill-list:opacity-40 hover:!opacity-100 hover:scale-105 hover:bg-[var(--theme-color)] hover:!text-[var(--btn-text-color)] hover:border-transparent'
                    }`}
                  >
                    {skill}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
