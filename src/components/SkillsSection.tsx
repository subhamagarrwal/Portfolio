import React, { useState, useEffect, useRef, useMemo } from 'react';
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

  const [dragCategory, setDragCategory] = useState<string | null>(null);
  const [draggedSkills, setDraggedSkills] = useState<Set<string>>(new Set());
  const isDraggingRef = useRef(false);
  const currentCategoryRef = useRef<string | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // If we aren't dragging, we don't care
      if (!isDraggingRef.current) return;
      
      // Use coordinates to dynamically find which card we're currently hovering over during a drag
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const skill = el.getAttribute('data-skill');
        const category = el.getAttribute('data-category');
        
        // If it matches the category we started dragging in, add it to our Set to "highlight" it
        if (skill && category === currentCategoryRef.current) {
          setDraggedSkills(prev => {
            if (prev.has(skill)) return prev; // Avoid unnecessary re-renders
            const newSet = new Set(prev);
            newSet.add(skill);
            return newSet;
          });
        }
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      currentCategoryRef.current = null;
      setDragCategory(null);
      setDraggedSkills(new Set()); // Reset highlights
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

  const handlePointerDown = (category: string, skill: string) => {
    isDraggingRef.current = true;
    currentCategoryRef.current = category;
    setDragCategory(category);
    setDraggedSkills(new Set([skill]));
  };

  const { skills } = portfolioData;
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();
  const timeBasedClass = getTimeBasedClass();

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

  const skillCategories = useMemo(() => [
    { title: 'Languages', skills: skills.languages },
    { title: 'Frameworks', skills: skills.frameworks },
    { title: 'Tools & Technologies', skills: skills.tools },
  ], [skills]);

  return (
    <section id="skills" className={`pt-12 pb-6 md:py-20 px-6 ${timeBasedClass}`}>
      <div
        className="container mx-auto max-w-4xl"
        style={{ 
          '--theme-color': primaryColor,
          '--btn-text-color': primaryColor === '#ffffff' ? '#000' : '#fff'
        } as React.CSSProperties}
      >
        <h2 className={`text-4xl font-bold text-center mb-12 transition-colors duration-300 ${textClass}`}>
          Skills & Technologies
        </h2>

        <div className="space-y-8">
          {skillCategories.map((category) => (
            <div key={category.title}>
              <div className="flex items-center mb-4">
                <h3 className={`text-2xl font-bold transition-colors duration-300 ${textClass}`}>
                  {category.title}
                </h3>
              </div>

              <div
                className="flex flex-wrap gap-3 group/skill-list"
                style={{ touchAction: 'pan-y' }} // Allows mobile to scroll vertically while dragging horizontally
              >
                {category.skills.map((skill) => {
                  const isHighlighted = dragCategory === category.title && draggedSkills.has(skill);
                  
                  return (
                    <div
                      key={skill}
                      data-skill={skill}
                      data-category={category.title}
                      onPointerDown={(e) => {
                        handlePointerDown(category.title, skill);
                      }}
                      className={`liquid-glass-card px-4 py-2 rounded-full !text-black text-sm font-medium transition-all duration-300 select-none ${
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
          ))}
        </div>

        <div className={`mt-12 text-center transition-colors duration-300 ${textClass}`}>
        </div>
      </div>
    </section>
  );
};

